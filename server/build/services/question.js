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
const postgresDB_1 = __importDefault(require("../connections/postgresDB"));
const ModelAnsOutputGenerationError_1 = __importDefault(require("../utils/errors/ModelAnsOutputGenerationError"));
class QuestionService {
    constructor(question) {
        this._id = question._id;
        this.statement = question.statement;
        this.type = question.type;
        this.marks = question.marks;
        this.modelAns = question.modelAns;
        this.options = question === null || question === void 0 ? void 0 : question.options;
    }
    static checkProgrammingModelAnswer(modelAns, idx) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (modelAns.query) {
                    const output = yield (0, postgresDB_1.default) `${modelAns.query}`;
                    console.log(output);
                    return output;
                }
                else {
                    throw new Error("Model Answer Query not found");
                }
            }
            catch (error) {
                console.log("Error at question " + idx);
                throw new ModelAnsOutputGenerationError_1.default(error.message, idx);
            }
        });
    }
}
exports.default = QuestionService;
//# sourceMappingURL=question.js.map