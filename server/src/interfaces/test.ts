import { Types } from "mongoose";
import { IClassroom } from "./classroom";
import { IQuestion } from "./question";
import { IResponse } from "./response";
import { IUser } from "./user";

export interface ITest {
  _id: Types.ObjectId;
  name: string;
  createdBy: IUser | IUser["_id"];
  classroom: IClassroom | IClassroom["_id"];
  status: string;
  questions: Array<IQuestion> | Array<IQuestion["_id"]>;
  responses: Array<IResponse> | Array<IResponse["_id"]>;
}
