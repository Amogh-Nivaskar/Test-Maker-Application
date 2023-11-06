import pg from "pg";

const { Pool } = pg;

let pool;

export async function connectToPostgresDB() {
  try {
    pool = new Pool({
      connectionString:
        String(process.env.POSTGRES_DB_URL) + "?sslmode=require",
    });

    pool.connect((err) => {
      if (err) throw err;
      console.log("Connect to PostgreSQL successfully!");
    });

    return pool;
  } catch (error) {
    console.log("Got an error");
    console.log(error);
  }
}

export default pool;
