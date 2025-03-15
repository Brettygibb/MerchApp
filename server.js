require("dotenv").config(); // Load environment variables

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const Product = require("./models/Product");
const nodemailer = require("nodemailer");

const app = express();
app.use(cors());

app.use(bodyParser.json());
const CONNECTION_STRING =
  process.env.merchDB || "mongodb://127.0.0.1:27017/MerchUserDB";

mongoose.connect(CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Connected to MongoDB");
});

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

app.listen(5000, () => {
  console.log(`Server is listening on port 5000`);
});

app.put("/products/:id/needed", async (req, res) => {
  try {
    const { id } = req.params; // Extract product ID
    const { needed } = req.body; // Extract `needed` value

    if (needed === undefined || needed === null) {
      return res.status(400).json({ message: "Needed quantity is required" });
    }

    // Update the `needed` field dynamically
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { needed: Number(needed) }, // Dynamically add or update `needed`
      { new: true } // Return the updated document
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Needed quantity updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating needed quantity:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.put("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { count } = req.body;

    if (count === undefined) {
      return res.status(400).json({ message: "Count Value is Required" });
    }
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { count: Number(count) },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product Count Updated Successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updationg product:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.post("/register", async (req, res) => {
  const { username, password, email } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({ username, password: hashedPassword, email });
    await newUser.save();

    // Send the welcome email after creating the user

    // Return success response
    res.status(201).json({ message: "User created", userId: newUser._id });
  } catch (error) {
    console.error("Error creating user:", error); // Log error in creating user
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // ✅ Return _id as userId
    res.status(200).json({ message: "Login successful", userId: user._id });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/CRUD", async (req, res) => {
  const { name, count, needed, work, userId } = req.body;

  console.log("Received request to create product:");
  console.log("name:", name);
  console.log("userId:", userId);
  console.log("count:", count);
  console.log("needed:", needed);
  console.log("work:", work);

  try {
    if (!name || !userId) {
      return res
        .status(400)
        .json({ message: "Product name and user ID are required" });
    }

    // Create the new product with the userId
    const newProduct = new Product({
      name,
      count,
      needed,
      work,
      user: userId, // Save the userId with the product
    });

    // Log the product being created
    console.log("Creating product with userId:", userId);
    const savedProduct = await newProduct.save();

    res.status(201).json({
      message: "Product added successfully",
      product: savedProduct,
    });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/products", async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Fetch products for the specific user
    const products = await Product.find({ user: userId }); // Filter products by userId

    if (!products) {
      return res.status(404).json({ message: "No products found" });
    }

    res.status(200).json(products); // Send the list of products
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.put("/products/:id/worked", async (req, res) => {
  try {
    const { id } = req.params;
    const { worked } = req.body;

    if (worked === undefined || worked === null) {
      return res.status(400).json({ message: "Worked quantity is required" });
    }
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { worked: Number(worked) },
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({
      message: "Worked quantity updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating worked quantity:", error);
    res.status(500).json({ message: "Server error" });
  }
});
