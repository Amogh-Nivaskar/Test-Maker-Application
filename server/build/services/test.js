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
const classroom_1 = __importDefault(require("./classroom"));
const test_1 = require("../models/test");
class Test {
    constructor(test) {
        this._id = test._id;
        this.name = test.name;
        this.createdBy = test.createdBy;
        this.createdAt = test.createdAt;
        this.classroom = test.classroom;
        this.status = test.status;
        this.questions = test.questions;
        this.responses = test.responses;
    }
    createTest() {
        return __awaiter(this, void 0, void 0, function* () {
            const classroom = yield classroom_1.default.getClassroomById(this.classroom);
            if (!classroom)
                throw new Error("Classroom not found");
            const test = new test_1.TestModel(this);
            classroom.tests.push(test._id);
        });
    }
}
exports.default = Test;
//# sourceMappingURL=test.js.map