import { Types } from "mongoose";
import { ITest } from "../interfaces/test";
import { IUser } from "../interfaces/user";
import { IClassroom } from "../interfaces/classroom";
import { IQuestion } from "../interfaces/question";
import { IResponse } from "../interfaces/response";
import { TestStatus } from "../utils/enums/testStatus";
import ClassroomService from "./classroom";
import { TestModel } from "../models/test";

class Test implements ITest {
  _id: Types.ObjectId;
  name: string;
  createdBy: IUser | IUser["_id"];
  classroom: IClassroom | IClassroom["_id"];
  createdAt: Date;
  status: TestStatus;
  questions: Array<IQuestion> | Array<IQuestion["_id"]>;
  responses: Array<IResponse> | Array<IResponse["_id"]>;

  public constructor(test: any) {
    this._id = test._id;
    this.name = test.name;
    this.createdBy = test.createdBy;
    this.createdAt = test.createdAt;
    this.classroom = test.classroom;
    this.status = test.status;
    this.questions = test.questions;
    this.responses = test.responses;
  }

  public async createTest() {
    const classroom = await ClassroomService.getClassroomById(
      this.classroom as Types.ObjectId
    );

    if (!classroom) throw new Error("Classroom not found");

    const test = new TestModel(this);

    classroom.tests.push(test._id);
  }
}

export default Test;
