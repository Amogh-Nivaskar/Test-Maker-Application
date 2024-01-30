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
exports.createTest = exports.getTests = exports.sendClassroomInvite = exports.createClassroom = void 0;
const classroom_1 = __importDefault(require("../services/classroom"));
const test_1 = __importDefault(require("../services/test"));
function createClassroom(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = req.user;
            const { name, classroomAdminId } = req.body;
            const { organizationId } = req.params;
            yield classroom_1.default.createClassroom(name, classroomAdminId, organizationId);
            return res.status(201).json({ message: "Classroom Created Successfully" });
        }
        catch (error) {
            console.log(error);
            return res.status(400).json({ message: error.message });
        }
    });
}
exports.createClassroom = createClassroom;
function sendClassroomInvite(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = req.user;
            const { invitedUserId, role } = req.body;
            const { classroomId, organizationId } = req.params;
            const classroom = (yield classroom_1.default.getClassroomById(classroomId));
            const classroomService = new classroom_1.default(classroom);
            yield classroomService.sendInvite(invitedUserId, role);
            return res
                .status(201)
                .json({ message: "Classroom Invite Sent Successfully" });
        }
        catch (error) {
            console.log(error);
            return res.status(400).json({ message: error.message });
        }
    });
}
exports.sendClassroomInvite = sendClassroomInvite;
function getTests(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { classroomId } = req.params;
            const classroom = yield classroom_1.default.getClassroomById(classroomId);
            const classroomService = new classroom_1.default(classroom);
            const tests = yield classroomService.getTests();
            return res
                .status(201)
                .json({ message: "Fetched tests Successfully", tests });
        }
        catch (error) {
            console.log(error);
            return res
                .status(400)
                .json({ message: error.message, errorQuestionIdx: error.questionIdx });
        }
    });
}
exports.getTests = getTests;
function createTest(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = req.user;
            const { classroomId, organizationId } = req.params;
            const { test } = req.body;
            const outputs = yield test_1.default.checkTest(test);
            const testService = new test_1.default(test);
            testService.createTest(outputs);
            return res
                .status(201)
                .json({ message: "Created Test Successfully", outputs });
        }
        catch (error) {
            console.log(error);
            return res
                .status(400)
                .json({ message: error.message, errorQuestionIdx: error.questionIdx });
        }
    });
}
exports.createTest = createTest;
//# sourceMappingURL=classroom.js.map