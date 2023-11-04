"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("../controllers/user");
const authentication_1 = require("../middleware/authentication");
const router = express_1.default.Router();
router.post("/signup", user_1.signupWithEmailAndPassword);
router.post("/signin", user_1.signinWithEmailAndPassword);
router.post("/acceptOrganizationInvite", authentication_1.validateUserAuthentication, user_1.acceptOrganizationInvite);
router.post("/acceptClassroomInvite", authentication_1.validateUserAuthentication, user_1.acceptClassroomInvite);
exports.default = router;
//# sourceMappingURL=user.js.map