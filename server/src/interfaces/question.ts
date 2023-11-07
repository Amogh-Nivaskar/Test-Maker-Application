import { Types } from "mongoose";
import { answerTypes } from "./answer";
import { QuestionTypes } from "../utils/enums/questionsTypes";

export interface IQuestion {
  _id: Types.ObjectId;
  statement: string;
  type: QuestionTypes;
  marks: number;
  modelAns: answerTypes;
  options?: string[];
}
