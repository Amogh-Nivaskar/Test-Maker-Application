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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongodbAtlas_1 = require("./connections/mongodbAtlas");
const user_1 = __importDefault(require("./routes/user"));
const organization_1 = __importDefault(require("./routes/organization"));
const classroom_1 = __importDefault(require("./routes/classroom"));
const postgresDB_1 = require("./connections/postgresDB");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = Number(process.env.PORT) || 3000;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cors_1.default)());
app.get("/", (req, res) => {
    return res.json({ message: "Here is your data" });
});
app.use("/user", user_1.default);
app.use("/organization", organization_1.default);
app.use("/organization/:organizationId/classroom", classroom_1.default);
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, mongodbAtlas_1.connectToMongoDB)();
        yield (0, postgresDB_1.connectToPostgresDB)();
        app.listen(PORT, () => console.log(`Server is running on PORT: ${PORT}`));
    });
}
init();
//# sourceMappingURL=index.js.map