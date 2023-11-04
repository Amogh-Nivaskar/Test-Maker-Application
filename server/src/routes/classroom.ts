import express from "express";
import { validateUserAuthentication } from "../middleware/authentication";
import { createClassroom, sendClassroomInvite } from "../controllers/classroom";
import {
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
  "/sendInvite/:classroomId",
  validateUserAuthentication,
  validateSendingClassroomInviteAuthorization,
  sendClassroomInvite
);

export default router;
