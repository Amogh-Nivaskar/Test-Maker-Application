"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToPostgresDB = void 0;
const pg_1 = __importDefault(require("pg"));
const { Pool } = pg_1.default;
let pool;
function connectToPostgresDB() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            pool = new Pool({
                connectionString: String(process.env.POSTGRES_DB_URL) + "?sslmode=require",
            });
            pool.connect((err) => {
                if (err)
                    throw err;
                console.log("Connect to PostgreSQL successfully!");
            });
            return pool;
        }
        catch (error) {
            console.log("Got an error");
            console.log(error);
        }
    });
}
exports.connectToPostgresDB = connectToPostgresDB;
exports.default = pool;
//# sourceMappingURL=postgresDB.js.map