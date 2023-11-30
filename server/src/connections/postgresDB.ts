import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_DB_URL + "?sslmode=require", {});
console.log("Connected to PostgresDB successfully");

// will use psql environment variables
export default sql;
