import mongoose, { Types } from "mongoose";
import { IAnswer, answerTypes } from "../interfaces/answer";
import { IQuestion } from "../interfaces/question";
import { AnswerModel } from "../models/answer";
import { QuestionTypes } from "../utils/enums/questionsTypes";
import Postgres from "../connections/postgresDB";

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

  //TODO: See if we want to add answer.answer.output field
  public async getEvaluationAnswerResult() {
    const answer = (await AnswerModel.findById(this._id).populate(
      "question"
    )) as any;

    switch (answer.question.type) {
      case QuestionTypes.SQL:
        let output;

        try {
          output = await Postgres`${answer.answer.query}`;
        } catch (error) {
          output = null;
        }

        if (output) {
          // console.log(output.rows);
          answer.answer.output = output;

          answer.isCorrect = this.isAnswerCorrect(
            answer.question.modelAns.output,
            answer.answer.output
          );
          // console.log(answer.answer.output);
        } else {
          answer.isCorrect = false;
          answer.answer.output = null;
        }
        break;
      case QuestionTypes.MultipleChoice:
        if (answer.question.modelAns === answer.answer) {
          answer.isCorrect = true;
        } else {
          answer.isCorrect = false;
        }
        break;
      case QuestionTypes.MultipleSelect:
        if (
          this.areArraysEqual(
            answer.question.modelAns.sort(),
            answer.answer.sort()
          )
        ) {
          answer.isCorrect = true;
        } else {
          answer.isCorrect = false;
        }
        break;
      case QuestionTypes.TextAns:
        break;
      default:
        throw new Error("Invalid Question Type");
    }

    await answer.save();
    if (answer.isCorrect === true) {
      return answer.question.marks;
    } else {
      return 0;
    }
  }

  private isAnswerCorrect(modelOutput: any, answerOutput: any) {
    if (modelOutput.length !== answerOutput.length) return false;
    let isCorrect = true;
    for (let i = 0; i < modelOutput.length; i++) {
      if (!this.areRowObjectsEqual(modelOutput[i], answerOutput[i])) {
        isCorrect = false;
        break;
      }
    }
    return isCorrect;
  }

  private areRowObjectsEqual(modelOutputRow: any, answerOutputRow: any) {
    if (
      (modelOutputRow === null && answerOutputRow !== null) ||
      (modelOutputRow !== null && answerOutputRow === null)
    ) {
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

  private areArraysEqual(
    modelAnsArray: Array<number>,
    answerArray: Array<number>
  ) {
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
