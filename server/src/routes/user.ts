import express from "express";
import {
  acceptClassroomInvite,
  acceptOrganizationInvite,
  signinWithEmailAndPassword,
  signupWithEmailAndPassword,
} from "../controllers/user";
import { validateUserAuthentication } from "../middleware/authentication";

const router = express.Router();

router.post("/signup", signupWithEmailAndPassword);
router.post("/signin", signinWithEmailAndPassword);
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

export default router;
