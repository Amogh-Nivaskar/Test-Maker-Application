import express from "express";
import { validateUserAuthentication } from "../middleware/authentication";
import {
  createOrganization,
  createTable,
  sendOrganizationInvite,
} from "../controllers/organization";
import { validateSendingOrganizationInviteAuthorization } from "../middleware/roleValidation/organization";

const router = express.Router();

router.post("/", validateUserAuthentication, createOrganization);
router.post(
  "/sendInvite/:organizationId",
  validateUserAuthentication,
  validateSendingOrganizationInviteAuthorization,
  sendOrganizationInvite
);

router.post(
  "/:organizationId/createTable",
  validateUserAuthentication,
  createTable
);

export default router;
