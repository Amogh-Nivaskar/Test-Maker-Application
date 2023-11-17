"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnswerModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const AnswerSchema = new Schema({
    question: {
        type: Schema.Types.ObjectId,
        ref: "Question",
        required: true,
    },
    answer: Schema.Types.Mixed,
    isCorrect: Boolean,
});
exports.AnswerModel = mongoose_1.default.model("Answer", AnswerSchema);
//# sourceMappingURL=answer.js.map