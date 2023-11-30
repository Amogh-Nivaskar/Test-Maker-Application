import { Types } from "mongoose";
import UserService from "../services/user";
import { NextFunction, Request, Response } from "express";
import { IUser } from "../interfaces/user";
import TestService from "../services/test";
import { TestStatus } from "../utils/enums/testStatus";
import { ResponseService } from "../services/response";
import { AnswerService } from "../services/answer";
import { ResponseStatus } from "../utils/enums/responseStatus";

export async function signupWithEmailAndPassword(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body;
    const payload = await UserService.signupWithEmailAndPassword(
      name,
      email,
      password
    );
    return res
      .status(201)
      .json({ message: "User Signed Up Successfully", payload });
  } catch (error: any) {
    console.log("Error in sign up: ", error.message);
    return res.status(400).json({ message: error.message });
  }
}

export async function signinWithEmailAndPassword(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const payload = await UserService.signinWithEmailAndPassword(
      email,
      password
    );
    return res
      .status(200)
      .json({ message: "User Signed In Successfully", payload });
  } catch (error: any) {
    console.log(error);
    return res.status(400).json({ message: "Something went wrong in Sign In" });
  }
}

export async function checkAuthStatus(req: Request, res: Response) {
  try {
    const user = req.user;
    if (user) {
      return res
        .status(200)
        .json({ message: "User is currently logged in", data: user });
    } else {
      return res.status(401).json({ message: "User is not logged in" });
    }
  } catch (error: any) {
    console.log(error);
    return res
      .status(400)
      .json({ message: "Something went wrong when checking auth status" });
  }
}

export async function acceptOrganizationInvite(req: Request, res: Response) {
  try {
    const { _id } = req.user;
    const { organizationId } = req.body;
    // PATCHUP
    const user: IUser | null = (await UserService.getUserById(
      _id
    )) as unknown as IUser;
    if (!user) throw new Error("User not found");
    const userService = new UserService(user);

    await userService.acceptOrganizationInvite(organizationId);

    return res
      .status(201)
      .json({ message: "Successfully accepted Organization Invite" });
  } catch (error: any) {
    console.log(error);
    return res.status(400).json({ message: error.message });
  }
}

export async function acceptClassroomInvite(req: Request, res: Response) {
  try {
    const { _id } = req.user;
    const { classroomId } = req.body;

    const user = (await UserService.getUserById(_id)) as unknown as IUser;
    if (!user) throw new Error("User not found");

    const userService = new UserService(user);
    await userService.acceptClassroomInvite(classroomId);

    return res
      .status(201)
      .json({ message: "Sunccessfully accepted Classroom Invite" });
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
