import { NextFunction, Request, Response } from "express";
import TestService from "../../services/test";
import { Types } from "mongoose";

export async function validateUserGivingTestAuthorization(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user;
    const { testId } = req.params;
    const test = await TestService.getTestById(
      testId as unknown as Types.ObjectId
    );

    const testService = new TestService(test);

    if (await testService.checkIfStudentCanGiveTest(user._id)) {
      next();
    } else {
      return res
        .status(401)
        .json({ message: "User must be a student of the test's classroom" });
    }
  } catch (error: any) {
    console.log(error);
    return res.status(400).json({ message: error.message });
  }
}

export async function validateEvaluateTestAuthorization(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user;
    const { testId } = req.params;

    const test = await TestService.getTestById(
      testId as unknown as Types.ObjectId
    );

    if (test.createdBy.toString() === user._id.toString()) {
      next();
    } else {
      return res.status(401).json({
        message:
          "Test evaluation can be initiated only by the teacher who made the test",
      });
    }
  } catch (error: any) {
    console.log(error);
    return res.status(400).json({ message: error.message });
  }
}
