import React, { useEffect, useState } from "react";
import axios from "axios";

function CRUD() {
  const [showInput, setShowInput] = useState(null);
  const [productName, setProductName] = useState("");
  const [message, setMessage] = useState("");
  const [products, setProducts] = useState([]);
  const [counts, setCount] = useState({});

  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const handleButtonClick = (button) => {
    setShowInput(button);
  };

  const exportData = () => {
    const exportProducts = products.map((product) => ({
      name: product.name,
      count: product.count,
      needed: product.needed,
      work: product.work,
    }));

    // Convert data to CSV format
    const csv = [
      ["Product Name", "Count", "Needed", "Work"], // CSV headers
      ...exportProducts.map((product) => [
        product.name,
        product.count,
        product.needed,
        product.work,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    // Create a Blob from the CSV data and trigger a download
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "products_export.csv";
    link.click();
  };

  const handleInsertProduct = async () => {
    try {
      const userId = localStorage.getItem("userId"); // Retrieve userId from localStorage
      console.log("User ID from localStorage:", userId); // Log the userId to confirm it's correct

      if (!userId) {
        setMessage("You must be logged in to add a product.");
        return;
      }

      // Validate product name
      if (!productName.trim()) {
        setMessage("Product name cannot be empty.");
        return;
      }

      // Log the product data being sent
      console.log("Sending product data to backend:", {
        name: productName,
        userId, // Send userId with the product
        count: 0, // Default values for count, needed, work
        needed: 0,
        work: 0,
      });

      // Send product data along with userId to the backend
      const response = await axios.post("http://localhost:5000/CRUD", {
        name: productName,
        userId, // Send userId with the product
        count: 0,
        needed: 0,
        work: 0,
      });

      setMessage(response.data.message);
      setProducts((prevProducts) => [...prevProducts, response.data.product]);

      setProductName(""); // Clear the input
      setShowInput(null); // Hide the input field
    } catch (error) {
      setMessage(
        error.response?.data?.message || "An error occurred adding the product"
      );
      console.error("Error adding product:", error);
    }
  };

  useEffect(() => {
    if (
      showInput === "startWork" ||
      showInput === "productNeeded" ||
      showInput === "startCount"
    ) {
      const fetchProducts = async () => {
        try {
          if (!userId) {
            setMessage("User ID is missing. Please log in again.");
            return;
          }

          const response = await axios.get("http://localhost:5000/products", {
            params: { userId }, // Pass userId as a query parameter
          });

          console.log("Fetched Products:", response.data); // ✅ Debugging line

          setProducts(response.data);
        } catch (error) {
          console.error("Error fetching products:", error);
          setMessage("Error fetching products.");
        }
      };

      fetchProducts();
    }
  }, [showInput, userId]); // ✅ Add userId as a dependency to avoid stale state

  const handleCountChange = (id, value) => {
    const numericValue = Number(value); // Convert to number

    if (isNaN(numericValue) || numericValue < 0) {
      setMessage("Count cannot be negative.");
      return;
    }

    setCount((prevCounts) => ({
      ...prevCounts,
      [id]: numericValue, // ✅ Store count for each product separately
    }));
  };

  const handleUpdateCount = async (id) => {
    try {
      const count = counts[id];

      if (count === undefined || count === "") {
        setMessage("Please enter a count value.");
        return;
      }

      const response = await axios.put(`http://localhost:5000/products/${id}`, {
        count,
      });

      setMessage(response.data.message);
      console.log("Count Updated:", response.data);

      // ✅ Update the product in the state instead of refetching all products
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === id ? { ...product, count: Number(count) } : product
        )
      );
    } catch (error) {
      console.error("Error updating count:", error);
      setMessage("Error updating count.");
    }
  };

  //Needed Section
  const handleUpdateNeeded = async (id) => {
    try {
      const needed = counts[id];
      console.log("Updating needed for Product ID:", id, "Value:", needed); // Debug

      if (needed === undefined || needed === "") {
        setMessage("Please enter the needed quantity");
        return;
      }

      const response = await axios.put(
        `http://localhost:5000/products/${id}/needed`,
        { needed } // Send `needed` value
      );

      setMessage(response.data.message);
      console.log("Needed Quantity Updated:", response.data);

      // Update the specific product in state without refetching all products
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === id ? { ...product, needed: Number(needed) } : product
        )
      );
    } catch (error) {
      console.error(
        "Error updating needed quantity:",
        error.response || error.message
      );
      setMessage("Error updating product needed");
    }
  };

  const handleUpdateWork = async (id) => {
    try {
      const worked = counts[id];
      console.log("Updating work for Product ID:", id, "Value:", worked);
      if (worked === undefined || worked === "") {
        setMessage("Please enter the work quantity");
        return;
      }
      const response = await axios.put(
        `http://localhost:5000/products/${id}/worked`,
        { worked }
      );
      setMessage(response.data.message);
      console.log("Worked Quantity Updated:", response.data);
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === id ? { ...product, work: Number(worked) } : product
        )
      );
    } catch (error) {
      console.error(
        "Error updating work quantity:",
        error.response || error.message
      );
      setMessage("Error updating product work");
    }
  };

  //Four buttons that take you to each CRUD Section
  return (
    <div className="CRUD">
      <h1>Welcome</h1>
      <div className="buttons">
        <button type="button" onClick={() => handleButtonClick("addProduct")}>
          Add To Product List
        </button>
        <button type="button" onClick={() => handleButtonClick("startCount")}>
          Start Count
        </button>
        <button
          type="button"
          onClick={() => handleButtonClick("productNeeded")}
        >
          Product Needed
        </button>
        <button type="button" onClick={() => handleButtonClick("startWork")}>
          Start Work
        </button>
        <button type="button" onClick={exportData}>
          End Work
        </button>
      </div>

      {message && <p>{message}</p>}
      {showInput === "addProduct" && (
        <div className="input">
          <h2>Add Product</h2>
          <input
            type="text"
            placeholder="Product Name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
          <button type="button" onClick={handleInsertProduct}>
            Add Product
          </button>
        </div>
      )}
      {showInput === "startCount" && (
        <div className="input">
          <h2>Start Count</h2>
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product._id}>
                <p>
                  <strong>Product Name:</strong> {product.name}
                </p>
                <p>
                  <strong>Current Count:</strong> {product.count || 0}
                </p>
                <input
                  type="number"
                  placeholder="Enter count"
                  value={counts[product._id] || ""}
                  onChange={(e) =>
                    handleCountChange(product._id, e.target.value)
                  }
                />
                <button
                  type="button"
                  onClick={() => handleUpdateCount(product._id)}
                >
                  Update Count
                </button>
              </div>
            ))
          ) : (
            <p>No products found.</p>
          )}
        </div>
      )}

      {showInput === "productNeeded" && (
        <div className="input">
          <h2>Product Needed</h2>
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product._id}>
                <p>Product Name: {product.name}</p>
                <p>Current Count: {product.count}</p>
                <p>Needed: {product.needed || 0}</p>
                <input
                  type="number"
                  placeholder="Enter needed quantity"
                  value={counts[product._id] || ""}
                  onChange={(e) =>
                    handleCountChange(product._id, e.target.value)
                  }
                />
                <button
                  type="button"
                  onClick={() => handleUpdateNeeded(product._id)}
                >
                  Update Needed
                </button>
              </div>
            ))
          ) : (
            <p>No products found</p>
          )}
        </div>
      )}
      {showInput === "startWork" && (
        <div className="input">
          <h2>Start Working</h2>
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product._id}>
                <p>Product Name: {product.name}</p>
                <p>Current Count: {product.count}</p>
                <p>Working: {product.work || 0}</p>
                <input
                  type="number"
                  placeholder="Enter needed quantity"
                  value={counts[product._id] || ""}
                  onChange={(e) =>
                    handleCountChange(product._id, e.target.value)
                  }
                />
                <button
                  type="button"
                  onClick={() => handleUpdateWork(product._id)}
                >
                  Update Work
                </button>
              </div>
            ))
          ) : (
            <p>No products found</p>
          )}
        </div>
      )}
    </div>
  );
}

export default CRUD;
