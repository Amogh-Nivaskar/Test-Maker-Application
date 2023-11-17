import { Types } from "mongoose";
import { IAnswer } from "./answer";
import { IQuestion } from "./question";
import { ITest } from "./test";
import { IUser } from "./user";
import { ResponseStatus } from "../utils/enums/responseStatus";

export interface IResponse {
  _id: Types.ObjectId;
  marksScored: number;
  givenBy: IUser | IUser["_id"];
  test: ITest | ITest["_id"];
  status: ResponseStatus;
  answers: IAnswer[];
}
