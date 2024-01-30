"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("../middleware/roleValidation/user");
const test_1 = require("../controllers/test");
const classroom_1 = require("../middleware/roleValidation/classroom");
const router = express_1.default.Router({ mergeParams: true });
router.get("/:testId", classroom_1.validateUserAsClassroomMember, test_1.getTest);
router.post("/:testId/startTest", user_1.validateUserGivingTestAuthorization, test_1.startGivingTest);
router.post("/:testId/response/:responseId/answer/:answerId", user_1.validateUserGivingTestAuthorization, test_1.answerTestQuestion);
router.post("/:testId/response/:responseId/submit", user_1.validateUserGivingTestAuthorization, test_1.submitTestResponse);
router.post("/:testId/evaluate", user_1.validateEvaluateTestAuthorization, test_1.evaluateTestResponses);
exports.default = router;
//# sourceMappingURL=test.js.map