import { Types } from "mongoose";
import { IClassroom } from "./classroom";
import { IQuestion } from "./question";
import { IResponse } from "./response";
import { IUser } from "./user";
import { TestStatus } from "../utils/enums/testStatus";

export interface ITest {
  _id: Types.ObjectId;
  name: string;
  createdBy: IUser | IUser["_id"];
  createdAt: Date;
  classroom: IClassroom | IClassroom["_id"];
  status: TestStatus;
  questions: Array<IQuestion> | Array<IQuestion["_id"]>;
  responses: Array<IResponse> | Array<IResponse["_id"]>;
  totalMarks: number;
}
