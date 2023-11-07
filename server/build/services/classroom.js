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
const classroom_1 = require("../models/classroom");
const roles_1 = require("../utils/enums/roles");
const organization_1 = __importDefault(require("./organization"));
const user_1 = require("../models/user");
const user_2 = __importDefault(require("./user"));
class ClassroomService {
    constructor(classroom) {
        this._id = classroom._id;
        this.name = classroom.name;
        this.organization = classroom.organization;
        this.admin = classroom.admin;
        this.teachers = classroom.teachers;
        this.students = classroom.students;
        this.tests = classroom.tests;
        this.invitesSent = classroom.invitesSent;
    }
    getClassroomRole(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const classroom = yield classroom_1.ClassroomModel.findById(this._id);
            if (!classroom)
                throw new Error(`Classroom by ${this._id} ID does not exist`);
            if (classroom.admin === userId)
                return roles_1.UserRole.Admin;
            else if (classroom.teachers.includes(userId))
                return roles_1.UserRole.Teacher;
            else if (classroom.students.includes(userId))
                return roles_1.UserRole.Student;
            return roles_1.UserRole.NonMember;
        });
    }
    static getClassroomById(classroomId) {
        return __awaiter(this, void 0, void 0, function* () {
            const classroom = classroom_1.ClassroomModel.findById(classroomId);
            if (!classroom)
                throw new Error("Classroom not found");
            return classroom;
        });
    }
    static createClassroom(name, classroomAdminId, organizationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const organization = yield organization_1.default.getOrganizationById(organizationId);
            if (!organization)
                throw new Error("Organization Not Found");
            const classroomAdmin = yield user_2.default.getUserById(classroomAdminId);
            if (!classroomAdmin)
                throw new Error(`User with id ${classroomAdminId} doesn't exist`);
            const organizationService = new organization_1.default(organization);
            const userOrganizationRole = yield organizationService.getOrganizationRole(classroomAdminId);
            if (userOrganizationRole !== roles_1.UserRole.Teacher &&
                userOrganizationRole !== roles_1.UserRole.Admin) {
                throw new Error("Classroom's admin can only be a teacher or admin of its respective organization");
            }
            if (!name || !classroomAdminId)
                throw new Error("Name and ClassroomAdminId required");
            const classroom = new classroom_1.ClassroomModel({
                name,
                admin: classroomAdminId,
                teachers: [classroomAdminId],
                organization: organizationId,
            });
            organization.classrooms.push(classroom._id);
            classroomAdmin.organizations = classroomAdmin.organizations.map((org) => {
                const { id, classrooms } = org;
                if (id.toString() === organizationId.toString()) {
                    return { id, classrooms: [...classrooms, classroom._id] };
                }
                return { id, classrooms };
            });
            yield classroomAdmin.save();
            yield organization.save();
            yield classroom.save();
        });
    }
    addTeacher(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const classroom = yield classroom_1.ClassroomModel.findById(this._id).populate("organization");
            const userClassroomRole = yield this.getClassroomRole(userId);
            const organization = new organization_1.default(classroom === null || classroom === void 0 ? void 0 : classroom.organization);
            const userOrganizationRole = yield organization.getOrganizationRole(userId);
            // User should be member of organization and not be an existing member of classroom
            if (userOrganizationRole !== roles_1.UserRole.NonMember &&
                userClassroomRole === roles_1.UserRole.NonMember) {
                classroom === null || classroom === void 0 ? void 0 : classroom.teachers.push(userId);
                yield (classroom === null || classroom === void 0 ? void 0 : classroom.save());
            }
            else if (userOrganizationRole === roles_1.UserRole.NonMember) {
                throw new Error("User is not part of organization");
            }
            else {
                throw new Error(`User is already a member of this Classroom as a ${userClassroomRole}`);
            }
        });
    }
    addTeachers(userIdsList) {
        return __awaiter(this, void 0, void 0, function* () {
            const promises = userIdsList.map((userId) => {
                return this.addTeacher(userId);
            });
            yield Promise.all(promises);
        });
    }
    addStudent(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const classroom = yield classroom_1.ClassroomModel.findById(this._id);
            const userRole = yield this.getClassroomRole(userId);
            if (userRole === roles_1.UserRole.NonMember) {
                classroom === null || classroom === void 0 ? void 0 : classroom.students.push(userId);
                yield (classroom === null || classroom === void 0 ? void 0 : classroom.save());
            }
            throw new Error(`User is already a member of this Classroom as a ${userRole}`);
        });
    }
    addStudents(userIdsList) {
        return __awaiter(this, void 0, void 0, function* () {
            const promises = userIdsList.map((userId) => {
                return this.addStudent(userId);
            });
            yield Promise.all(promises);
        });
    }
    sendInvite(userId, role) {
        return __awaiter(this, void 0, void 0, function* () {
            if (role === roles_1.UserRole.Admin || role === roles_1.UserRole.NonMember)
                throw new Error(`Can't send invite for ${role} role`);
            const classroom = yield classroom_1.ClassroomModel.findById(this._id).populate("organization");
            if (!classroom)
                throw new Error("Classroom doesn't exist");
            const organization = new organization_1.default(classroom.organization);
            const userOrganizationRole = yield organization.getOrganizationRole(userId);
            if (userOrganizationRole === roles_1.UserRole.NonMember)
                throw new Error("Can't send invite since user isn't part of the classrooms's organization");
            const userClassroomRole = yield this.getClassroomRole(userId);
            if (userClassroomRole !== roles_1.UserRole.NonMember)
                throw new Error("User is already part of this classroom");
            classroom.invitesSent.map((invite) => {
                if (invite.user.toString() === userId.toString()) {
                    throw new Error("User has already been sent an invite from this classroom");
                }
            });
            const user = yield user_1.UserModel.findById(userId);
            if (!user)
                throw new Error("User not found");
            if ((role === roles_1.UserRole.Teacher &&
                userOrganizationRole === roles_1.UserRole.Teacher) ||
                (role === roles_1.UserRole.Student && userOrganizationRole === roles_1.UserRole.Student)) {
                classroom.invitesSent.push({ user: userId, role });
                yield classroom.save();
                this.invitesSent = classroom.invitesSent;
                user.classroomInvites.push({ from: this._id, role });
                yield user.save();
            }
            else {
                throw new Error("Invited classroom's role and user's organization role don't match");
            }
        });
    }
}
exports.default = ClassroomService;
//# sourceMappingURL=classroom.js.map