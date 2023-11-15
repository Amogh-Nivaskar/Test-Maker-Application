import express from "express";
import { validateUserAuthentication } from "../middleware/authentication";
import {
  createClassroom,
  createTest,
  sendClassroomInvite,
} from "../controllers/classroom";
import {
  validateCreateTestAuthorization,
  validateCreatingClassroomAuthorization,
  validateSendingClassroomInviteAuthorization,
} from "../middleware/roleValidation/classroom";

const router = express.Router({ mergeParams: true });

router.post(
  "/",
  validateUserAuthentication,
  validateCreatingClassroomAuthorization,
  createClassroom
);
router.post(
  "/:classroomId/sendInvite",
  validateUserAuthentication,
  validateSendingClassroomInviteAuthorization,
  sendClassroomInvite
);

router.post(
  "/:classroomId/createTest",
  validateUserAuthentication,
  validateCreateTestAuthorization,
  createTest
);

export default router;
