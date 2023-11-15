import { Types } from "mongoose";
import { IQuestion } from "../interfaces/question";
import { QuestionTypes } from "../utils/enums/questionsTypes";
import { answerTypes } from "../interfaces/answer";
import Postgres from "../connections/postgresDB";
import ModelAnsOutputGenerationError from "../utils/errors/ModelAnsOutputGenerationError";

class QuestionService implements IQuestion {
  _id: Types.ObjectId;
  statement: string;
  type: QuestionTypes;
  marks: number;
  modelAns: answerTypes;
  options?: string[];

  public constructor(question: any) {
    this._id = question._id;
    this.statement = question.statement;
    this.type = question.type;
    this.marks = question.marks;
    this.modelAns = question.modelAns;
    this.options = question?.options;
  }

  public static async checkProgrammingModelAnswer(modelAns: any, idx: number) {
    try {
      if (modelAns.query) {
        const output = await Postgres.query(modelAns.query);
        console.log(output.rows);
        return output.rows;
      } else {
        throw new Error("Model Answer Query not found");
      }
    } catch (error: any) {
      console.log("Error at question " + idx);
      throw new ModelAnsOutputGenerationError(error.message, idx);
    }
  }
}

export default QuestionService;
