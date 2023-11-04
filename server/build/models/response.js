"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const ResponseSchema = new Schema({
    marksScored: {
        type: Number,
        default: 0,
    },
    givenBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    test: {
        type: Schema.Types.ObjectId,
        ref: "Test",
        required: true,
    },
    answers: [
        {
            question: {
                type: Schema.Types.ObjectId,
                ref: "Question",
                required: true,
            },
            answer: Schema.Types.Mixed,
            isCorrect: Boolean,
        },
    ],
});
exports.ResponseModel = mongoose_1.default.model("Response", ResponseSchema);
//# sourceMappingURL=response.js.map