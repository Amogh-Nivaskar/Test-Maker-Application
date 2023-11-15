"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = __importDefault(require("pg"));
const { Pool } = pg_1.default;
const postgresdb_url = "postgres://default:o4PicgER2KAG@ep-red-snow-40545631-pooler.ap-southeast-1.postgres.vercel-storage.com:5432/verceldb";
const pool = new Pool({
    connectionString: postgresdb_url + "?sslmode=require",
});
pool.connect((err) => {
    if (err)
        throw err;
    console.log("PostgresDB connection successful");
});
exports.default = pool;
//# sourceMappingURL=postgresDB.js.map