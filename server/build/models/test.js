"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const testStatus_1 = require("../utils/enums/testStatus");
const Schema = mongoose_1.default.Schema;
const TestSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    classroom: {
        type: Schema.Types.ObjectId,
        ref: "Classroom",
        required: true,
    },
    status: {
        type: String,
        enum: testStatus_1.TestStatus,
        default: testStatus_1.TestStatus.Inactive,
    },
    questions: [
        {
            type: Schema.Types.ObjectId,
            ref: "Question",
        },
    ],
    responses: [
        {
            type: Schema.Types.ObjectId,
            ref: "Response",
        },
    ],
    totalMarks: Number,
});
exports.TestModel = mongoose_1.default.model("Test", TestSchema);
//# sourceMappingURL=test.js.map