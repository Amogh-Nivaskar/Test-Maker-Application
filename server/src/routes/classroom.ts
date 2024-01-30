import express from "express";
import { validateUserAuthentication } from "../middleware/authentication";
import {
  createClassroom,
  createTest,
  getTests,
  sendClassroomInvite,
} from "../controllers/classroom";
import {
  validateCreateTestAuthorization,
  validateCreatingClassroomAuthorization,
  validateSendingClassroomInviteAuthorization,
  validateUserAsClassroomMember,
} from "../middleware/roleValidation/classroom";

const router = express.Router({ mergeParams: true });

router.post("/", validateCreatingClassroomAuthorization, createClassroom);
router.get("/:classroomId/tests", validateUserAsClassroomMember, getTests);

router.post(
  "/:classroomId/sendInvite",
  validateSendingClassroomInviteAuthorization,
  sendClassroomInvite
);

router.post(
  "/:classroomId/createTest",
  validateCreateTestAuthorization,
  createTest
);

export default router;
