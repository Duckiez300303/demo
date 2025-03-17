import pkg from "pg";

const { Client } = pkg;

const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "Test",
  password: "Duckiez2740@",
  port: 5432,
});

async function databaseConnect() {
  try {
    await client.connect();
    console.log("Database connected successfully");
  } catch (error) {
    console.error("error connecting to the database");
  }
}
databaseConnect();

export default client;
