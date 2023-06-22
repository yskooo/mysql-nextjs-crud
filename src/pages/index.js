import { useEffect, useState, useRef } from "react";
import { CiTrash } from "react-icons/ci";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.scss";

export default function Home() {
  // Refs for input fields
  const productNameRef = useRef();
  const productIDToDeleteRef = useRef();
  const productIDToUpdateRef = useRef();
  const productNameToUpdateRef = useRef();

  // State variables
  const [products, setProducts] = useState([]); // Holds the list of products
  const [updated, setUpdated] = useState(false); // Flag to indicate if product was updated successfully
  const [updatedError, setUpdatedError] = useState(false); // Flag to indicate if product update encountered an error
  const [created, setCreated] = useState(false); // Flag to indicate if product was created successfully
  const [deleted, setDeleted] = useState(false); // Flag to indicate if product was deleted successfully
  const [deletedError, setDeletedError] = useState(false); // Flag to indicate if product deletion encountered an error

  // Function to add a new product
  async function addProduct() {
    const productName = productNameRef.current.value.trim();
    if (productName.length < 3) return;

    const postData = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_name: productName,
      }),
    };

    // Send POST request to create a new product
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/products`,
      postData
    );
    const response = await res.json();
    console.log(response);

    // If creation is successful, add the new product to the state
    if (response.response.message !== "success") return;
    const newproduct = response.response.product;
    setProducts([
      ...products,
      {
        product_id: newproduct.product_id,
        product_name: newproduct.product_name,
      },
    ]);
    setCreated(true);
  }

  // Function to fetch and display all products
  async function getProducts() {
    const postData = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    // Send GET request to fetch all products
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/products`,
      postData
    );
    const response = await res.json();
    setProducts(response.products);
    console.log(response);
  }

  // Function to delete a product
  async function deleteProduct(id) {
    if (!id) return;

    const postData = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_id: id,
      }),
    };

    // Send DELETE request to delete the product
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/products`,
      postData
    );
    const response = await res.json();
    console.log(response.response);

    // If deletion encounters an error, set the error flag
    if (response.response.message === "error") return setDeletedError(true);

    // Remove the deleted product from the state
    const idToRemove = parseFloat(response.response.product_id);
    setProducts(products.filter((a) => a.product_id !== idToRemove));
    setDeleted(true);
  }

  // Function to update a product
  async function updateProduct() {
    const productIDToUpdate = productIDToUpdateRef.current.value.trim();
    const productNameToUpdate = productNameToUpdateRef.current.value.trim();
    if (!productIDToUpdate.length) return;

    const postData = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_id: productIDToUpdate,
        product_name: productNameToUpdate,
      }),
    };

    // Send PUT request to update the product
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/products`,
      postData
    );
    const response = await res.json();

    // If update encounters an error, set the error flag
    if (response.response.message === "error") return setUpdatedError(true);

    const productIdUpdated = parseFloat(response.response.product.product_id);
    const productUpdatedName = response.response.product.product_name;

    // Update the product in the state
    const productsStateAfterUpdate = products.map((product) => {
      if (product.product_id === productIdUpdated) {
        const productUpdated = {
          ...product,
          product_name: productUpdatedName,
        };
        return productUpdated;
      } else {
        return {
          ...product,
        };
      }
    });

    setUpdated(true);
    setProducts(productsStateAfterUpdate);
  }

  // Fetch products on component mount
  useEffect(() => {
    getProducts();
  }, []);

  return (
    <>
      <Head>
        <title>CRUD With Next.Js & MySQL Demo</title>
      </Head>
      <div className={styles.container}>
        <section className={styles.main}>
          <h1>CRUD With Next.Js & MySQL Demo</h1>
          {/* Commented out paragraph */}
          <div className={styles.heading}>
            <a href="/api/products" target="_blank" rel="noreferrer">
              Database API data
            </a>
          </div>
        </section>
        <section>
          <div className={styles.read}>
            <h2>Read</h2>
            <div className={styles.products}>
              {/* Displaying the list of products */}
              {products.map((item, index) => {
                return (
                  <div key={item.product_id} className={styles.product}>
                    <span>product_id</span>: {item.product_id} <br />{" "}
                    <span>product_name</span>: {item.product_name}{" "}
                    <CiTrash
                      className={styles.icons}
                      onClick={() => deleteProduct(item.product_id)}
                    />
                  </div>
                );
              })}
              {!products.length ? <>No products found</> : null}
            </div>
          </div>
        </section>
        <section>
          <div className={styles.create}>
            <h2>Create</h2>
            <div className={styles.input}>
              <div className={styles.label}>Product Name</div>
              <input type="text" ref={productNameRef} />
            </div>
            {created ? <div className={styles.success}>Success!</div> : null}
            <div className={styles.buttonarea}>
              <input
                className={styles.button}
                value="Save"
                type="button"
                onClick={addProduct}
              />
            </div>
          </div>
        </section>
        <section>
          <div className={styles.update}>
            <h2>Update</h2>
            <div className={styles.input}>
              <div className={styles.label}>Product Id</div>
              <input type="text" ref={productIDToUpdateRef} />
            </div>
            <div className={styles.input}>
              <div className={styles.label}>Product Name</div>
              <input type="text" ref={productNameToUpdateRef} />
            </div>
            {updated ? <div className={styles.success}>Success!</div> : null}
            {updatedError ? <div className={styles.error}>Error!</div> : null}
            <div className={styles.buttonarea}>
              <input
                className={styles.button}
                value="Update"
                type="button"
                onClick={updateProduct}
              />
            </div>
          </div>
        </section>
        <section>
          <div className={styles.delete}>
            <h2>Delete</h2>
            <div className={styles.input}>
              <div className={styles.label}>Product Id</div>
              <input type="text" ref={productIDToDeleteRef} />
            </div>
            {deleted ? <div className={styles.success}>Success!</div> : null}
            {deletedError ? <div className={styles.error}>Error!</div> : null}
            <div className={styles.buttonarea}>
              <input
                className={`${styles.button} ${styles.warning}`}
                value="Delete"
                type="button"
                onClick={() =>
                  deleteProduct(productIDToDeleteRef.current.value)
                }
              />
            </div>
          </div>
        </section>
        <footer>
          <p>
            Create, Read, Update, Delete database data in React, Node and
            Next.JS by Omar Elbaga{" "}
            <a
              href="https://github.com/oelbaga/nextjs-mysql"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          </p>
        </footer>
      </div>
    </>
  );
}

// The above code is a React component that demonstrates CRUD operations (Create, Read, Update, Delete) with Next.js and MySQL. It uses the useState, useEffect, and useRef hooks from React for managing state and side effects.

// The component renders a form where users can create, update, and delete products. It also displays a list of products fetched from the database.

// Here's a breakdown of the code:

// - The component starts by importing necessary dependencies such as React, Next.js components, styles, and icons.

// - Inside the Home function component, several variables are declared using the useState and useRef hooks. These variables hold the state values and references to input fields.

// - The addProduct function is an asynchronous function that handles the creation of a new product. It validates the product name and sends a POST request to the server to save the new product in the database. If the request is successful, the new product is added to the local state.

// - The getProducts function fetches the list of products from the server using a GET request and updates the local state with the fetched products.

// - The deleteProduct function handles the deletion of a product. It sends a DELETE request to the server with the product ID to be deleted. If the deletion is successful, the product is removed from the local state.

// - The updateProduct function handles the updating of a product. It sends a PUT request to the server with the updated product ID and name. If the update is successful, the local state is updated with the new product details.

// - The useEffect hook is used to fetch the products from the server when the component mounts. It runs only once when the component is initially rendered.

// - The render method returns JSX code that renders the HTML structure of the component. It includes sections for reading, creating, updating, and deleting products. The list of products is rendered dynamically based on the products state. Success and error messages are displayed based on the state variables.

// - The component also includes a footer with attribution and a link to the project's GitHub repository.

// Overall, this component provides a basic interface for interacting with a MySQL database using CRUD operations in a Next.js application.
