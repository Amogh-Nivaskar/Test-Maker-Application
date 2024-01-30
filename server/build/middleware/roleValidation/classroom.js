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
exports.validateUserAsClassroomMember = exports.validateCreateTestAuthorization = exports.validateSendingClassroomInviteAuthorization = exports.validateCreatingClassroomAuthorization = void 0;
const organization_1 = __importDefault(require("../../services/organization"));
const roles_1 = require("../../utils/enums/roles");
const classroom_1 = __importDefault(require("../../services/classroom"));
function validateCreatingClassroomAuthorization(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = req.user;
            const { organizationId } = req.params;
            const organization = yield organization_1.default.getOrganizationById(organizationId);
            const organizationService = new organization_1.default(organization);
            const userOrganizationRole = yield organizationService.getOrganizationRole(user._id);
            if (userOrganizationRole === roles_1.UserRole.Admin) {
                next();
            }
            else {
                return res
                    .status(401)
                    .json({ message: "Access Denied. User is not Organization admin" });
            }
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    });
}
exports.validateCreatingClassroomAuthorization = validateCreatingClassroomAuthorization;
function validateSendingClassroomInviteAuthorization(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = req.user;
            const { organizationId, classroomId } = req.params;
            const organization = yield organization_1.default.getOrganizationById(organizationId);
            const organizationService = new organization_1.default(organization);
            const userOrganizationRole = yield organizationService.getOrganizationRole(user._id);
            const classroom = yield classroom_1.default.getClassroomById(classroomId);
            const classroomService = new classroom_1.default(classroom);
            const userClassroomRole = yield classroomService.getClassroomRole(user._id);
            if (userClassroomRole === roles_1.UserRole.Admin ||
                userOrganizationRole === roles_1.UserRole.Admin) {
                next();
            }
            else {
                return res.status(401).json({
                    message: "Access Denied. User needs to be either classroom's admin or classroom's organization's admin to send classroom invite",
                });
            }
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    });
}
exports.validateSendingClassroomInviteAuthorization = validateSendingClassroomInviteAuthorization;
function validateCreateTestAuthorization(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = req.user;
            const { organizationId, classroomId } = req.params;
            const classroom = yield classroom_1.default.getClassroomById(classroomId);
            const classroomService = new classroom_1.default(classroom);
            const userClassroomRole = yield classroomService.getClassroomRole(user._id);
            if (userClassroomRole === roles_1.UserRole.Teacher) {
                next();
            }
            else {
                return res.status(401).json({
                    message: "Access Denied. User needs to be a classroom's teacher create test",
                });
            }
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    });
}
exports.validateCreateTestAuthorization = validateCreateTestAuthorization;
function validateUserAsClassroomMember(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = req.user;
            const { classroomId } = req.params;
            const classroom = yield classroom_1.default.getClassroomById(classroomId);
            if ((classroom === null || classroom === void 0 ? void 0 : classroom.teachers.includes(user._id)) ||
                (classroom === null || classroom === void 0 ? void 0 : classroom.students.includes(user._id))) {
                next();
            }
            else {
                return res.status(401).json({
                    message: "Access Denied. User needs to be classroom's member",
                });
            }
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    });
}
exports.validateUserAsClassroomMember = validateUserAsClassroomMember;
//# sourceMappingURL=classroom.js.map