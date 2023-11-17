import { Types } from "mongoose";
import { IAnswer, answerTypes } from "../interfaces/answer";
import { IQuestion } from "../interfaces/question";
import { AnswerModel } from "../models/answer";

export class AnswerService implements IAnswer {
  _id: Types.ObjectId;
  question: IQuestion | IQuestion["_id"];
  answer: answerTypes;
  isCorrect: boolean;

  public constructor(answer: any) {
    this._id = answer._id;
    this.question = answer.question;
    this.answer = answer.answer;
    this.isCorrect = answer.isCorrect;
  }

  // TODO: Make answer object according to question type
  public static async createAnswer(questionId: Types.ObjectId) {
    const answer = new AnswerModel({
      question: questionId,
      answer: null,
      isCorrect: false,
    });

    await answer.save();
    return answer._id;
  }

  public static async getAnswerById(answerId: Types.ObjectId) {
    const answer = await AnswerModel.findById(answerId);
    if (!answer) throw new Error("Answer Not Found");
    return answer;
  }

  public async updateAnswer(answer: any) {
    const answerModel = await AnswerModel.findByIdAndUpdate(this._id, {
      answer,
    });
    if (!answerModel) throw new Error("Answer Not Found");
    this.answer = answer;
  }
}
