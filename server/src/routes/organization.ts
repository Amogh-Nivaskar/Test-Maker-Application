import express from "express";
import { validateUserAuthentication } from "../middleware/authentication";
import {
  createOrganization,
  sendOrganizationInvite,
} from "../controllers/organization";

const router = express.Router();

router.post("/", validateUserAuthentication, createOrganization);
router.post(
  "/sendInvite/:organizationId",
  validateUserAuthentication,
  sendOrganizationInvite
);

export default router;
