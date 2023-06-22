// import { query } from "@/lib/db";
import { query } from "../../lib/db"; // Importing the query function from the local db library

export default async function handler(req, res) {
  let message; // Variable to store the response message

  if (req.method === "GET") {
    // Handling GET requests
    const products = await query({
      query: "SELECT * FROM products", // SQL query to retrieve all products
      values: [], // No additional values required for this query
    });
    res.status(200).json({ products: products }); // Sending the retrieved products as a JSON response
  }

  if (req.method === "POST") {
    // Handling POST requests
    const productName = req.body.product_name; // Extracting the product name from the request body
    const addProducts = await query({
      query: "INSERT INTO products (product_name) VALUES (?)", // SQL query to insert a new product
      values: [productName], // The value to be inserted is the product name
    });
    let product = [];

    if (addProducts.insertId) {
      message = "success"; // If the insertion is successful, set the message to "success"
    } else {
      message = "error"; // If the insertion fails, set the message to "error"
    }

    product = {
      product_id: addProducts.insertId, // The ID of the inserted product
      product_name: productName, // The name of the inserted product
    };

    res.status(200).json({ response: { message: message, product: product } }); // Sending the response message and the inserted product details as a JSON response
  }

  if (req.method === "PUT") {
    // Handling PUT requests
    const productId = req.body.product_id; // Extracting the product ID from the request body
    const productName = req.body.product_name; // Extracting the updated product name from the request body
    const updateProducts = await query({
      query: "UPDATE products SET product_name = ? WHERE product_id = ?", // SQL query to update a product's name based on the ID
      values: [productName, productId], // The updated product name and the product ID
    });
    const result = updateProducts.affectedRows; // Number of affected rows after the update

    if (result) {
      message = "success"; // If the update is successful, set the message to "success"
    } else {
      message = "error"; // If the update fails, set the message to "error"
    }

    const product = {
      product_id: productId, // The ID of the updated product
      product_name: productName, // The updated product name
    };

    res.status(200).json({ response: { message: message, product: product } }); // Sending the response message and the updated product details as a JSON response
  }

  if (req.method === "DELETE") {
    // Handling DELETE requests
    const productId = req.body.product_id; // Extracting the product ID from the request body
    const deleteProducts = await query({
      query: "DELETE FROM products WHERE product_id = ?", // SQL query to delete a product based on the ID
      values: [productId], // The product ID to be deleted
    });
    const result = deleteProducts.affectedRows; // Number of affected rows after the delete

    if (result) {
      message = "success"; // If the delete is successful, set the message to "success"
    } else {
      message = "error"; // If the delete fails, set the message to "error"
    }

    res
      .status(200)
      .json({ response: { message: message, product_id: productId } }); // Sending the response message and the deleted product ID as a JSON response
  }
}
