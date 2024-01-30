import express from "express";
import { validateUserAuthentication } from "../middleware/authentication";
import {
  createOrganization,
  createTable,
  getClassrooms,
  getOrganizationRole,
  sendOrganizationInvite,
} from "../controllers/organization";
import {
  validateUserAsAdmin,
  validateUserAsOrganizationMember,
} from "../middleware/roleValidation/organization";

const router = express.Router();

router.get(
  "/:organizationId/classrooms",
  validateUserAsOrganizationMember,
  getClassrooms
);

router.get("/:organizationId/role", getOrganizationRole);

router.post("/", createOrganization);
router.post(
  "/sendInvite/:organizationId",
  validateUserAsAdmin,
  sendOrganizationInvite
);

router.post("/:organizationId/createTable", createTable);

export default router;
