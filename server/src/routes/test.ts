import express from "express";
import {
  validateEvaluateTestAuthorization,
  validateUserGivingTestAuthorization,
} from "../middleware/roleValidation/user";
import {
  answerTestQuestion,
  evaluateTestResponses,
  getTest,
  startGivingTest,
  submitTestResponse,
} from "../controllers/test";
import { validateUserAsClassroomMember } from "../middleware/roleValidation/classroom";

const router = express.Router({ mergeParams: true });

router.get("/:testId", validateUserAsClassroomMember, getTest);

router.post(
  "/:testId/startTest",
  validateUserGivingTestAuthorization,
  startGivingTest
);

router.post(
  "/:testId/response/:responseId/answer/:answerId",
  validateUserGivingTestAuthorization,
  answerTestQuestion
);

router.post(
  "/:testId/response/:responseId/submit",
  validateUserGivingTestAuthorization,
  submitTestResponse
);

router.post(
  "/:testId/evaluate",
  validateEvaluateTestAuthorization,
  evaluateTestResponses
);

export default router;
