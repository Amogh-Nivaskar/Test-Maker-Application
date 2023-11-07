import { Types } from "mongoose";
import { ITest } from "../interfaces/test";
import { IUser } from "../interfaces/user";
import { IClassroom } from "../interfaces/classroom";
import { IQuestion } from "../interfaces/question";
import { IResponse } from "../interfaces/response";
import { TestStatus } from "../utils/enums/testStatus";

class Test implements ITest {
  _id: Types.ObjectId;
  name: string;
  createdBy: IUser | IUser["_id"];
  classroom: IClassroom | IClassroom["_id"];
  createdAt: Date;
  status: TestStatus;
  questions: Array<IQuestion> | Array<IQuestion["_id"]>;
  responses: Array<IResponse> | Array<IResponse["_id"]>;

  public constructor(test: ITest) {
    this._id = test._id;
    this.name = test.name;
    this.createdBy = test.createdBy;
    this.createdAt = test.createdAt;
    this.classroom = test.classroom;
    this.status = test.status;
    this.questions = test.questions;
    this.responses = test.responses;
  }
}

export default Test;
