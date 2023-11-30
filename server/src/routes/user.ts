import express from "express";
import {
  acceptClassroomInvite,
  acceptOrganizationInvite,
  answerTestQuestion,
  checkAuthStatus,
  evaluateTestResponses,
  signinWithEmailAndPassword,
  signupWithEmailAndPassword,
  startGivingTest,
  submitTestResponse,
} from "../controllers/user";
import { validateUserAuthentication } from "../middleware/authentication";
import {
  validateEvaluateTestAuthorization,
  validateUserGivingTestAuthorization,
} from "../middleware/roleValidation/user";

const router = express.Router();

router.post("/signup", signupWithEmailAndPassword);
router.post("/signin", signinWithEmailAndPassword);
router.get("/checkAuthStatus", validateUserAuthentication, checkAuthStatus);
router.post(
  "/acceptOrganizationInvite",
  validateUserAuthentication,
  acceptOrganizationInvite
);

router.post(
  "/acceptClassroomInvite",
  validateUserAuthentication,
  acceptClassroomInvite
);

// Answering Test
router.post(
  "/test/:testId/startTest",
  validateUserAuthentication,
  validateUserGivingTestAuthorization,
  startGivingTest
);

router.post(
  "/test/:testId/response/:responseId/answer/:answerId",
  validateUserAuthentication,
  validateUserGivingTestAuthorization,
  answerTestQuestion
);

router.post(
  "/test/:testId/response/:responseId/submit",
  validateUserAuthentication,
  validateUserGivingTestAuthorization,
  submitTestResponse
);

router.post(
  "/test/:testId/evaluate",
  validateUserAuthentication,
  validateEvaluateTestAuthorization,
  evaluateTestResponses
);

export default router;
