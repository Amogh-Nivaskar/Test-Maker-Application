"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitTestResponse = exports.answerTestQuestion = exports.startGivingTest = exports.acceptClassroomInvite = exports.acceptOrganizationInvite = exports.signinWithEmailAndPassword = exports.signupWithEmailAndPassword = void 0;
const user_1 = __importDefault(require("../services/user"));
const test_1 = __importDefault(require("../services/test"));
const testStatus_1 = require("../utils/enums/testStatus");
const response_1 = require("../services/response");
const answer_1 = require("../services/answer");
const responseStatus_1 = require("../utils/enums/responseStatus");
function signupWithEmailAndPassword(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { name, email, password } = req.body;
            const accessToken = yield user_1.default.signupWithEmailAndPassword(name, email, password);
            return res
                .status(201)
                .json({ message: "User Signed Up Successfully", accessToken, email });
        }
        catch (error) {
            console.log(error);
            return res.status(400).json({ message: "Something went wrong in Sign Up" });
        }
    });
}
exports.signupWithEmailAndPassword = signupWithEmailAndPassword;
function signinWithEmailAndPassword(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            const accessToken = yield user_1.default.signinWithEmailAndPassword(email, password);
            return res
                .status(201)
                .json({ message: "User Signed In Successfully", accessToken, email });
        }
        catch (error) {
            console.log(error);
            return res.status(400).json({ message: "Something went wrong in Sign In" });
        }
    });
}
exports.signinWithEmailAndPassword = signinWithEmailAndPassword;
function acceptOrganizationInvite(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { _id } = req.user;
            const { organizationId } = req.body;
            // PATCHUP
            const user = (yield user_1.default.getUserById(_id));
            if (!user)
                throw new Error("User not found");
            const userService = new user_1.default(user);
            yield userService.acceptOrganizationInvite(organizationId);
            return res
                .status(201)
                .json({ message: "Successfully accepted Organization Invite" });
        }
        catch (error) {
            console.log(error);
            return res.status(400).json({ message: error.message });
        }
    });
}
exports.acceptOrganizationInvite = acceptOrganizationInvite;
function acceptClassroomInvite(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { _id } = req.user;
            const { classroomId } = req.body;
            const user = (yield user_1.default.getUserById(_id));
            if (!user)
                throw new Error("User not found");
            const userService = new user_1.default(user);
            yield userService.acceptClassroomInvite(classroomId);
            return res
                .status(201)
                .json({ message: "Sunccessfully accepted Classroom Invite" });
        }
        catch (error) {
            console.log(error);
            return res.status(400).json({ message: error.message });
        }
    });
}
exports.acceptClassroomInvite = acceptClassroomInvite;
function startGivingTest(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = req.user;
            const { testId } = req.params;
            if (yield response_1.ResponseService.checkIfStudentHasTestResponse(user._id, testId)) {
                return res.status(400).json({
                    message: "Student already has a response to this test. Cannot create another response",
                });
            }
            const test = yield test_1.default.getTestById(testId);
            if (test.status === testStatus_1.TestStatus.Inactive) {
                return res.status(401).json({ message: "Test is inactive" });
            }
            const response = yield response_1.ResponseService.createResponse(user._id, testId);
            return res.status(201).json({
                message: "Successfully Created Response",
                responseId: response._id,
            });
        }
        catch (error) {
            console.log(error);
            return res.status(400).json({ message: error.message });
        }
    });
}
exports.startGivingTest = startGivingTest;
function answerTestQuestion(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = req.user;
            const { testId, responseId, answerId } = req.params;
            const { answer } = req.body;
            const test = yield test_1.default.getTestById(testId);
            if (test.status === testStatus_1.TestStatus.Inactive) {
                return res.status(401).json({ message: "Test is inactive" });
            }
            const response = yield response_1.ResponseService.getResponseById(responseId);
            if (response.status !== responseStatus_1.ResponseStatus.Ongoing) {
                return res
                    .status(400)
                    .json({ message: "Response has already been submitted" });
            }
            const answerModel = yield answer_1.AnswerService.getAnswerById(answerId);
            const answerService = new answer_1.AnswerService(answerModel);
            yield answerService.updateAnswer(answer);
            return res.status(201).json({ message: "Successfully Updated Answer" });
        }
        catch (error) {
            console.log(error);
            return res.status(400).json({ message: error.message });
        }
    });
}
exports.answerTestQuestion = answerTestQuestion;
function submitTestResponse(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = req.user;
            const { testId, responseId, answerId } = req.params;
            const test = yield test_1.default.getTestById(testId);
            if (test.status === testStatus_1.TestStatus.Inactive) {
                return res.status(401).json({ message: "Test is inactive" });
            }
            const response = yield response_1.ResponseService.getResponseById(responseId);
            if (response.status !== responseStatus_1.ResponseStatus.Ongoing) {
                return res
                    .status(400)
                    .json({ message: "Response has already been submitted" });
            }
            const responseService = new response_1.ResponseService(response);
            yield responseService.submitResponse();
            return res.status(201).json({ message: "Successfully Submitted Response" });
        }
        catch (error) {
            console.log(error);
            return res.status(400).json({ message: error.message });
        }
    });
}
exports.submitTestResponse = submitTestResponse;
//# sourceMappingURL=user.js.map