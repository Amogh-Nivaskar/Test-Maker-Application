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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnswerService = void 0;
const answer_1 = require("../models/answer");
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
}
exports.AnswerService = AnswerService;
//# sourceMappingURL=answer.js.map