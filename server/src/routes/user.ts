import express from "express";
import {
  acceptClassroomInvite,
  acceptOrganizationInvite,
  checkAuthStatus,
  getOrganizations,
  signin,
  signup,
  userExists,
} from "../controllers/user";
import { validateUserAuthentication } from "../middleware/authentication";

const router = express.Router();

router.get("/", userExists);
router.post("/signup", signup);
router.post("/signin", signin);

router.get("/checkAuthStatus", validateUserAuthentication, checkAuthStatus);

router.get("/organizations", validateUserAuthentication, getOrganizations);

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
