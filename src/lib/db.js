import mysql from "mysql2/promise";
import dotenv from 'dotenv';

dotenv.config();

// Function to execute MySQL queries
export async function query({ query, values = [] }) {
  // Establish a connection to the MySQL database using the provided environment variables

  // PlanetScale;
  // const dbconnection = await mysql.createConnection(
  //   process.env.MYSQL_DATABASE_URL,
  // );

  // Digital Ocean Ubuntu
  // const dbconnection = await mysql.createConnection({
  //   host: process.env.MYSQL_HOST,
  //   database: process.env.MYSQL_DATABASE,
  //   user: process.env.MYSQL_USER,
  //   password: process.env.MYSQL_PASSWORD,
  // });

  // Local development or other hosting environments
  const dbconnection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  });

  try {
    // Execute the query using the established database connection and provided query and values
    const [results] = await dbconnection.execute(query, values);

    // Close the database connection
    dbconnection.end();

    // Return the query results
    return results;
  } catch (error) {
    // Throw an error with the error message if the query execution fails
    throw Error(error.message);

    // If you want to return the error as part of the function result, you can uncomment the following line:
    // return { error };
  }
}
