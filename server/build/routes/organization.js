"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authentication_1 = require("../middleware/authentication");
const organization_1 = require("../controllers/organization");
const organization_2 = require("../middleware/roleValidation/organization");
const router = express_1.default.Router();
router.post("/", authentication_1.validateUserAuthentication, organization_1.createOrganization);
router.post("/sendInvite/:organizationId", authentication_1.validateUserAuthentication, organization_2.validateSendingOrganizationInviteAuthorization, organization_1.sendOrganizationInvite);
router.post("/:organizationId/createTable", authentication_1.validateUserAuthentication, organization_1.createTable);
exports.default = router;
//# sourceMappingURL=organization.js.map