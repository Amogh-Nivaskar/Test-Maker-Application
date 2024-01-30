"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("../controllers/user");
const authentication_1 = require("../middleware/authentication");
const router = express_1.default.Router();
router.get("/", user_1.userExists);
router.post("/signup", user_1.signup);
router.post("/signin", user_1.signin);
router.get("/checkAuthStatus", authentication_1.validateUserAuthentication, user_1.checkAuthStatus);
router.get("/organizations", authentication_1.validateUserAuthentication, user_1.getOrganizations);
router.post("/acceptOrganizationInvite", authentication_1.validateUserAuthentication, user_1.acceptOrganizationInvite);
router.post("/acceptClassroomInvite", authentication_1.validateUserAuthentication, user_1.acceptClassroomInvite);
exports.default = router;
//# sourceMappingURL=user.js.map