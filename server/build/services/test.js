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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const classroom_1 = __importDefault(require("./classroom"));
const test_1 = require("../models/test");
const questionsTypes_1 = require("../utils/enums/questionsTypes");
const question_1 = __importDefault(require("./question"));
const question_2 = require("../models/question");
const classroom_2 = require("../models/classroom");
const roles_1 = require("../utils/enums/roles");
class TestService {
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
    createTest(outputs) {
        return __awaiter(this, void 0, void 0, function* () {
            const classroom = yield classroom_1.default.getClassroomById(this.classroom);
            const questionIdsPromises = this.questions.map((question, idx) => {
                let questionModel;
                if (question.type === questionsTypes_1.QuestionTypes.SQL) {
                    questionModel = new question_2.QuestionModel(Object.assign(Object.assign({}, question), { modelAns: Object.assign(Object.assign({}, question.modelAns), { output: outputs[idx] }) }));
                }
                else {
                    questionModel = new question_2.QuestionModel(question);
                }
                questionModel.save();
                return questionModel._id;
            });
            const questionIds = yield Promise.all(questionIdsPromises);
            const _a = this, { _id } = _a, remainingTest = __rest(_a, ["_id"]);
            const testModel = new test_1.TestModel(Object.assign(Object.assign({}, remainingTest), { questions: questionIds }));
            yield testModel.save();
            if (!classroom)
                throw new Error("Classroom not found");
            classroom.tests.push(testModel._id);
            yield classroom.save();
        });
    }
    static getTestById(testId) {
        return __awaiter(this, void 0, void 0, function* () {
            const test = yield test_1.TestModel.findById(testId);
            if (!test)
                throw new Error("Test Not Found");
            return test;
        });
    }
    static checkTest(test) {
        return __awaiter(this, void 0, void 0, function* () {
            const questions = test === null || test === void 0 ? void 0 : test.questions;
            const questionsPromises = questions.map((question, idx) => {
                if (question.type === questionsTypes_1.QuestionTypes.SQL) {
                    return question_1.default.checkProgrammingModelAnswer(question.modelAns, idx);
                }
                else {
                    return null;
                }
            });
            const outputs = yield Promise.all(questionsPromises);
            return outputs;
        });
    }
    checkIfStudentCanGiveTest(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const classroomId = this.classroom;
            const classroom = yield classroom_2.ClassroomModel.findById(classroomId);
            const classroomService = new classroom_1.default(classroom);
            const userRole = yield classroomService.getClassroomRole(userId);
            if (userRole === roles_1.UserRole.Student)
                return true;
            return false;
        });
    }
    addTestResponse(responseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const test = yield test_1.TestModel.findById(this._id);
            if (!test)
                throw new Error("Test Not Found");
            test.responses.push(responseId);
            yield test.save();
        });
    }
}
exports.default = TestService;
//# sourceMappingURL=test.js.map