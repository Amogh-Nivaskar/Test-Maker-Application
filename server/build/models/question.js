"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const questionsTypes_1 = require("../utils/enums/questionsTypes");
const Schema = mongoose_1.default.Schema;
const QuestionSchema = new Schema({
    statement: {
        type: String,
        required: true,
        default: "Empty Question",
    },
    type: {
        type: String,
        enum: questionsTypes_1.QuestionTypes,
        default: questionsTypes_1.QuestionTypes.TextAns,
    },
    marks: Number,
    modelAns: Schema.Types.Mixed,
    options: [String],
});
/*
text-ans
    modelAns: String

multiple-choice
    modelAns: Number

multiple-select
    modelAns: [Number]

sql
    modelAns: {
        query: String.
        output: {}
    }

*/
exports.QuestionModel = mongoose_1.default.model("Question", QuestionSchema);
//# sourceMappingURL=question.js.map