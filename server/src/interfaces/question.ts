import { Types } from "mongoose";
import { answerTypes } from "./answer";

export interface IQuestion {
  _id: Types.ObjectId;
  statement: string;
  type: string;
  marks: number;
  modelAns: answerTypes;
  options?: string[];
}
