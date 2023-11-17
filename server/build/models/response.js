"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const responseStatus_1 = require("../utils/enums/responseStatus");
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
    status: {
        type: String,
        enum: responseStatus_1.ResponseStatus,
        default: responseStatus_1.ResponseStatus.Ongoing,
    },
    answers: [
        {
            type: Schema.Types.ObjectId,
            ref: "Answer",
        },
    ],
});
exports.ResponseModel = mongoose_1.default.model("Response", ResponseSchema);
//# sourceMappingURL=response.js.map