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
exports.ResponseService = void 0;
const response_1 = require("../models/response");
const responseStatus_1 = require("../utils/enums/responseStatus");
const test_1 = __importDefault(require("./test"));
const answer_1 = require("./answer");
class ResponseService {
    constructor(response) {
        this._id = response._id;
        this.marksScored = response.marksScored;
        this.givenBy = response.givenBy;
        this.test = response.test;
        this.status = response.status;
        this.answers = response.answers;
    }
    static createResponse(userId, testId) {
        return __awaiter(this, void 0, void 0, function* () {
            const test = yield test_1.default.getTestById(testId);
            const testService = new test_1.default(test);
            const answersPromises = test.questions.map((question) => {
                return answer_1.AnswerService.createAnswer(question._id);
            });
            const answers = yield Promise.all(answersPromises);
            const response = new response_1.ResponseModel({
                marksScored: null,
                givenBy: userId,
                test: testId,
                status: responseStatus_1.ResponseStatus.Ongoing,
                answers,
            });
            yield response.save();
            yield testService.addTestResponse(response._id);
            return response;
        });
    }
    static getResponseById(responseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield response_1.ResponseModel.findById(responseId);
            if (!response)
                throw new Error("Response Not Found");
            return response;
        });
    }
    submitResponse() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield response_1.ResponseModel.findByIdAndUpdate(this._id, {
                status: responseStatus_1.ResponseStatus.Submitted,
            });
            if (!response)
                throw new Error("Response Not Found");
            this.status = responseStatus_1.ResponseStatus.Submitted;
        });
    }
    static checkIfStudentHasTestResponse(userId, testId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield response_1.ResponseModel.findOne({
                test: testId,
                givenBy: userId,
            });
            if (response)
                return true;
            return false;
        });
    }
    evaluateResponse() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield response_1.ResponseModel.findById(this._id).populate("answers");
            if (!response)
                throw new Error("Response Not Found");
            const evaluatedAnswersPromises = response === null || response === void 0 ? void 0 : response.answers.map((answer) => {
                const answerService = new answer_1.AnswerService(answer);
                const marks = answerService.getEvaluationAnswerResult();
                return marks;
            });
            if (evaluatedAnswersPromises) {
                const evaluatedAnswers = yield Promise.all(evaluatedAnswersPromises);
                const totalMarks = evaluatedAnswers.reduce((sum, currMarks) => {
                    if (currMarks)
                        return sum + currMarks;
                    return sum;
                }, 0);
                response.marksScored = totalMarks;
                response.status = responseStatus_1.ResponseStatus.Evaluated;
                yield response.save();
            }
            else {
                throw new Error(`Error in Evaluating Answers for Response ID: ${this._id}`);
            }
        });
    }
}
exports.ResponseService = ResponseService;
//# sourceMappingURL=response.js.map