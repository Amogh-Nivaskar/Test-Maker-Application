"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authentication_1 = require("../middleware/authentication");
const classroom_1 = require("../controllers/classroom");
const classroom_2 = require("../middleware/roleValidation/classroom");
const router = express_1.default.Router({ mergeParams: true });
router.post("/", authentication_1.validateUserAuthentication, classroom_2.validateCreatingClassroomAuthorization, classroom_1.createClassroom);
router.post("/sendInvite/:classroomId", authentication_1.validateUserAuthentication, classroom_2.validateSendingClassroomInviteAuthorization, classroom_1.sendClassroomInvite);
exports.default = router;
//# sourceMappingURL=classroom.js.map