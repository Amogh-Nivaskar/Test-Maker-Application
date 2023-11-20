import { Types } from "mongoose";
import { ITest } from "../interfaces/test";
import { IUser } from "../interfaces/user";
import { IClassroom } from "../interfaces/classroom";
import { IQuestion } from "../interfaces/question";
import { IResponse } from "../interfaces/response";
import { TestStatus } from "../utils/enums/testStatus";
import ClassroomService from "./classroom";
import { TestModel } from "../models/test";
import { QuestionTypes } from "../utils/enums/questionsTypes";
import QuestionService from "./question";
import { QuestionModel } from "../models/question";
import { ClassroomModel } from "../models/classroom";
import { UserRole } from "../utils/enums/roles";
import { error } from "console";
import { ResponseService } from "./response";
import { ResponseStatus } from "../utils/enums/responseStatus";

class TestService implements ITest {
  _id: Types.ObjectId;
  name: string;
  createdBy: IUser | IUser["_id"];
  classroom: IClassroom | IClassroom["_id"];
  createdAt: Date;
  status: TestStatus;
  questions: Array<IQuestion> | Array<IQuestion["_id"]>;
  responses: Array<IResponse> | Array<IResponse["_id"]>;
  totalMarks: number;

  public constructor(test: any) {
    this._id = test._id;
    this.name = test.name;
    this.createdBy = test.createdBy;
    this.createdAt = test.createdAt;
    this.classroom = test.classroom;
    this.status = test.status;
    this.questions = test.questions;
    this.responses = test.responses;
    this.totalMarks = test.totalMarks;
  }

  public async createTest(outputs: any) {
    const classroom = await ClassroomService.getClassroomById(
      this.classroom as Types.ObjectId
    );

    const questionIdsPromises = this.questions.map((question: any, idx) => {
      let questionModel;
      if (question.type === QuestionTypes.SQL) {
        questionModel = new QuestionModel({
          ...question,
          modelAns: { ...question.modelAns, output: outputs[idx] },
        });
      } else {
        questionModel = new QuestionModel(question);
      }
      questionModel.save();
      return questionModel._id;
    });

    const questionIds = await Promise.all(questionIdsPromises);

    const { _id, ...remainingTest } = this;

    const testModel = new TestModel({
      ...remainingTest,
      questions: questionIds,
    });

    await testModel.save();

    if (!classroom) throw new Error("Classroom not found");

    classroom.tests.push(testModel._id);
    await classroom.save();
  }

  public static async getTestById(testId: Types.ObjectId) {
    const test = await TestModel.findById(testId);
    if (!test) throw new Error("Test Not Found");
    return test;
  }

  public static async checkTest(test: any) {
    const questions = test?.questions;

    const questionsPromises = questions.map((question: any, idx: number) => {
      if (question.type === QuestionTypes.SQL) {
        return QuestionService.checkProgrammingModelAnswer(
          question.modelAns,
          idx
        );
      } else {
        return null;
      }
    });

    const outputs = await Promise.all(questionsPromises);
    return outputs;
  }

  public async checkIfStudentCanGiveTest(userId: Types.ObjectId) {
    const classroomId = this.classroom;
    const classroom = await ClassroomModel.findById(classroomId);
    const classroomService = new ClassroomService(classroom);

    const userRole = await classroomService.getClassroomRole(userId);
    if (userRole === UserRole.Student) return true;
    return false;
  }

  public async addTestResponse(responseId: Types.ObjectId) {
    const test = await TestModel.findById(this._id);
    if (!test) throw new Error("Test Not Found");
    test.responses.push(responseId);
    await test.save();
  }

  public async evaluateTestResponses() {
    const test = await TestModel.findById(this._id).populate("responses");

    if (!test) throw new Error("Test Not Found");

    const evaluatedResponsesPromises = test.responses.map((response: any) => {
      if (response.status === ResponseStatus.Submitted) {
        const responseService = new ResponseService(response);
        responseService.evaluateResponse();
      }
    });

    if (evaluatedResponsesPromises) {
      await Promise.all(evaluatedResponsesPromises);
    } else {
      throw new Error("Error in Evaluating Responses");
    }
  }
}

export default TestService;
