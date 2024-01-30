import { Types } from "mongoose";
import { Request, Response } from "express";
import TestService from "../services/test";
import { TestStatus } from "../utils/enums/testStatus";
import { ResponseService } from "../services/response";
import { AnswerService } from "../services/answer";
import { ResponseStatus } from "../utils/enums/responseStatus";
import UserService from "../services/user";
import OrganizationService from "../services/organization";
import { UserRole } from "../utils/enums/roles";

export async function getTest(req: Request, res: Response) {
  try {
    const user = req.user;
    const { testId, organizationId } = req.params;
    const organization = await OrganizationService.getOrganizationById(
      organizationId as unknown as Types.ObjectId
    );
    const organizationService = new OrganizationService(organization);
    const userRole = await organizationService.getOrganizationRole(user._id);

    const test = await TestService.getTestById(
      testId as unknown as Types.ObjectId
    );
    const testService = new TestService(test);
    const questions = await testService.getQuestions();

    if (userRole === UserRole.Admin || userRole === UserRole.Teacher) {
      const responses = await testService.getResponses();
      return res.status(200).json({
        message: "Fetched test respones",
        questions,
        responses,
        userRole,
      });
    }
  } catch (error: any) {
    console.log(error);
    return res.status(400).json({ message: error.message });
  }
}

export async function startGivingTest(req: Request, res: Response) {
  try {
    const user = req.user;
    const { testId } = req.params;

    if (
      await ResponseService.checkIfStudentHasTestResponse(
        user._id,
        testId as unknown as Types.ObjectId
      )
    ) {
      return res.status(400).json({
        message:
          "Student already has a response to this test. Cannot create another response",
      });
    }

    const test = await TestService.getTestById(
      testId as unknown as Types.ObjectId
    );
    if (test.status === TestStatus.Inactive) {
      return res.status(401).json({ message: "Test is inactive" });
    }
    const response = await ResponseService.createResponse(
      user._id,
      testId as unknown as Types.ObjectId
    );
    return res.status(201).json({
      message: "Successfully Created Response",
      responseId: response._id,
    });
  } catch (error: any) {
    console.log(error);
    return res.status(400).json({ message: error.message });
  }
}

export async function answerTestQuestion(req: Request, res: Response) {
  try {
    const user = req.user;
    const { testId, responseId, answerId } = req.params;
    const { answer } = req.body;

    const test = await TestService.getTestById(
      testId as unknown as Types.ObjectId
    );
    if (test.status === TestStatus.Inactive) {
      return res.status(401).json({ message: "Test is inactive" });
    }

    const response = await ResponseService.getResponseById(
      responseId as unknown as Types.ObjectId
    );

    if (response.status !== ResponseStatus.Ongoing) {
      return res
        .status(400)
        .json({ message: "Response has already been submitted" });
    }

    const answerModel = await AnswerService.getAnswerById(
      answerId as unknown as Types.ObjectId
    );

    const answerService = new AnswerService(answerModel);

    await answerService.updateAnswer(answer);

    return res.status(201).json({ message: "Successfully Updated Answer" });
  } catch (error: any) {
    console.log(error);
    return res.status(400).json({ message: error.message });
  }
}

export async function submitTestResponse(req: Request, res: Response) {
  try {
    const user = req.user;
    const { testId, responseId, answerId } = req.params;

    const test = await TestService.getTestById(
      testId as unknown as Types.ObjectId
    );
    if (test.status === TestStatus.Inactive) {
      return res.status(401).json({ message: "Test is inactive" });
    }

    const response = await ResponseService.getResponseById(
      responseId as unknown as Types.ObjectId
    );

    if (response.status !== ResponseStatus.Ongoing) {
      return res
        .status(400)
        .json({ message: "Response has already been submitted" });
    }

    const responseService = new ResponseService(response);

    await responseService.submitResponse();

    return res.status(201).json({ message: "Successfully Submitted Response" });
  } catch (error: any) {
    console.log(error);
    return res.status(400).json({ message: error.message });
  }
}

export async function evaluateTestResponses(req: Request, res: Response) {
  try {
    const { testId } = req.params;
    const test = await TestService.getTestById(
      testId as unknown as Types.ObjectId
    );
    const testService = new TestService(test);
    await testService.evaluateTestResponses();
    return res
      .status(201)
      .json({ messsage: "Successfully evaluated test responses" });
  } catch (error: any) {
    console.log(error);
    return res.status(400).json({ message: error.message });
  }
}
