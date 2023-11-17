import { Types } from "mongoose";
import { IResponse } from "../interfaces/response";
import { IUser } from "../interfaces/user";
import { ITest } from "../interfaces/test";
import { IAnswer } from "../interfaces/answer";
import { ResponseModel } from "../models/response";
import { ResponseStatus } from "../utils/enums/responseStatus";
import TestService from "./test";
import { AnswerService } from "./answer";

export class ResponseService implements IResponse {
  _id: Types.ObjectId;
  marksScored: number;
  givenBy: IUser | IUser["_id"];
  test: ITest | ITest["_id"];
  status: ResponseStatus;
  answers: IAnswer[];

  public constructor(response: any) {
    this._id = response._id;
    this.marksScored = response.marksScored;
    this.givenBy = response.givenBy;
    this.test = response.test;
    this.status = response.status;
    this.answers = response.answers;
  }

  public static async createResponse(
    userId: Types.ObjectId,
    testId: Types.ObjectId
  ) {
    const test = await TestService.getTestById(testId);

    const testService = new TestService(test);

    const answersPromises = test.questions.map((question) => {
      return AnswerService.createAnswer(question._id);
    });
    const answers = await Promise.all(answersPromises);

    const response = new ResponseModel({
      marksScored: null,
      givenBy: userId,
      test: testId,
      status: ResponseStatus.Ongoing,
      answers,
    });

    await response.save();

    await testService.addTestResponse(response._id);

    return response;
  }

  public static async getResponseById(responseId: Types.ObjectId) {
    const response = await ResponseModel.findById(responseId);
    if (!response) throw new Error("Response Not Found");
    return response;
  }

  public async submitResponse() {
    const response = await ResponseModel.findByIdAndUpdate(this._id, {
      status: ResponseStatus.Submitted,
    });
    if (!response) throw new Error("Response Not Found");
    this.status = ResponseStatus.Submitted;
  }

  public static async checkIfStudentHasTestResponse(
    userId: Types.ObjectId,
    testId: Types.ObjectId
  ) {
    const response = await ResponseModel.findOne({
      test: testId,
      givenBy: userId,
    });

    if (response) return true;
    return false;
  }
}
