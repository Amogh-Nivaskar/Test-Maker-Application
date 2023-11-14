import pg from "pg";

const { Pool } = pg;

// let pool: any;

// export async function connectToPostgresDB() {
//   try {
//     pool = new Pool({
//       connectionString:
//         String(process.env.POSTGRES_DB_URL) + "?sslmode=require",
//     });

//     pool.connect((err: any) => {
//       if (err) throw err;
//       console.log("Connect to PostgreSQL successfully!");
//     });

//     return pool;
//   } catch (error) {
//     console.log("Got an error");
//     console.log(error);
//   }
// }

const postgresdb_url =
  "postgres://default:o4PicgER2KAG@ep-red-snow-40545631-pooler.ap-southeast-1.postgres.vercel-storage.com:5432/verceldb";

const pool = new Pool({
  connectionString: postgresdb_url + "?sslmode=require",
});

pool.connect((err) => {
  if (err) throw err;
  console.log("connected to postgresDB");
});

export default pool;
