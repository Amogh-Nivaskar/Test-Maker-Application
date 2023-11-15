import pg from "pg";

const { Pool } = pg;

const postgresdb_url =
  "postgres://default:o4PicgER2KAG@ep-red-snow-40545631-pooler.ap-southeast-1.postgres.vercel-storage.com:5432/verceldb";

const pool = new Pool({
  connectionString: postgresdb_url + "?sslmode=require",
});

pool.connect((err) => {
  if (err) throw err;
  console.log("PostgresDB connection successful");
});

export default pool;
