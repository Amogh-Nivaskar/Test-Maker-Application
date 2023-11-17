import { Types } from "mongoose";
import { IQuestion } from "./question";

interface ISQLAnswer {
  query: string;
  output: any;
}

export type answerTypes = string | number | number[] | ISQLAnswer;

export interface IAnswer {
  _id: Types.ObjectId;
  question: IQuestion | IQuestion["_id"];
  answer: answerTypes;
  isCorrect: boolean;
}
