"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const organization_1 = require("../controllers/organization");
const organization_2 = require("../middleware/roleValidation/organization");
const router = express_1.default.Router();
router.get("/:organizationId/classrooms", organization_2.validateUserAsOrganizationMember, organization_1.getClassrooms);
router.get("/:organizationId/role", organization_1.getOrganizationRole);
router.post("/", organization_1.createOrganization);
router.post("/sendInvite/:organizationId", organization_2.validateUserAsAdmin, organization_1.sendOrganizationInvite);
router.post("/:organizationId/createTable", organization_1.createTable);
exports.default = router;
//# sourceMappingURL=organization.js.map