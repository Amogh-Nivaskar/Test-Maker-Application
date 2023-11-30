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
exports.AnswerService = void 0;
const answer_1 = require("../models/answer");
const questionsTypes_1 = require("../utils/enums/questionsTypes");
const postgresDB_1 = __importDefault(require("../connections/postgresDB"));
class AnswerService {
    constructor(answer) {
        this._id = answer._id;
        this.question = answer.question;
        this.answer = answer.answer;
        this.isCorrect = answer.isCorrect;
    }
    // TODO: Make answer object according to question type
    static createAnswer(questionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const answer = new answer_1.AnswerModel({
                question: questionId,
                answer: null,
                isCorrect: false,
            });
            yield answer.save();
            return answer._id;
        });
    }
    static getAnswerById(answerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const answer = yield answer_1.AnswerModel.findById(answerId);
            if (!answer)
                throw new Error("Answer Not Found");
            return answer;
        });
    }
    updateAnswer(answer) {
        return __awaiter(this, void 0, void 0, function* () {
            const answerModel = yield answer_1.AnswerModel.findByIdAndUpdate(this._id, {
                answer,
            });
            if (!answerModel)
                throw new Error("Answer Not Found");
            this.answer = answer;
        });
    }
    //TODO: See if we want to add answer.answer.output field
    getEvaluationAnswerResult() {
        return __awaiter(this, void 0, void 0, function* () {
            const answer = (yield answer_1.AnswerModel.findById(this._id).populate("question"));
            switch (answer.question.type) {
                case questionsTypes_1.QuestionTypes.SQL:
                    let output;
                    try {
                        output = yield (0, postgresDB_1.default) `${answer.answer.query}`;
                    }
                    catch (error) {
                        output = null;
                    }
                    if (output) {
                        // console.log(output.rows);
                        answer.answer.output = output;
                        answer.isCorrect = this.isAnswerCorrect(answer.question.modelAns.output, answer.answer.output);
                        // console.log(answer.answer.output);
                    }
                    else {
                        answer.isCorrect = false;
                        answer.answer.output = null;
                    }
                    break;
                case questionsTypes_1.QuestionTypes.MultipleChoice:
                    if (answer.question.modelAns === answer.answer) {
                        answer.isCorrect = true;
                    }
                    else {
                        answer.isCorrect = false;
                    }
                    break;
                case questionsTypes_1.QuestionTypes.MultipleSelect:
                    if (this.areArraysEqual(answer.question.modelAns.sort(), answer.answer.sort())) {
                        answer.isCorrect = true;
                    }
                    else {
                        answer.isCorrect = false;
                    }
                    break;
                case questionsTypes_1.QuestionTypes.TextAns:
                    break;
                default:
                    throw new Error("Invalid Question Type");
            }
            yield answer.save();
            if (answer.isCorrect === true) {
                return answer.question.marks;
            }
            else {
                return 0;
            }
        });
    }
    isAnswerCorrect(modelOutput, answerOutput) {
        if (modelOutput.length !== answerOutput.length)
            return false;
        let isCorrect = true;
        for (let i = 0; i < modelOutput.length; i++) {
            if (!this.areRowObjectsEqual(modelOutput[i], answerOutput[i])) {
                isCorrect = false;
                break;
            }
        }
        return isCorrect;
    }
    areRowObjectsEqual(modelOutputRow, answerOutputRow) {
        if ((modelOutputRow === null && answerOutputRow !== null) ||
            (modelOutputRow !== null && answerOutputRow === null)) {
            return false;
        }
        if (modelOutputRow === null && answerOutputRow === null) {
            return true;
        }
        const modelOutputRowKeys = Object.keys(modelOutputRow);
        const answerOutputRowKeys = Object.keys(answerOutputRow);
        if (modelOutputRowKeys.length !== answerOutputRowKeys.length) {
            return false;
        }
        for (const key of modelOutputRowKeys) {
            if (modelOutputRow[key] !== answerOutputRow[key]) {
                return false;
            }
        }
        return true;
    }
    areArraysEqual(modelAnsArray, answerArray) {
        if (modelAnsArray.length !== answerArray.length) {
            return false;
        }
        for (let i = 0; i < modelAnsArray.length; i++) {
            if (modelAnsArray[i] !== answerArray[i]) {
                return false;
            }
        }
        return true;
    }
}
exports.AnswerService = AnswerService;
//# sourceMappingURL=answer.js.map