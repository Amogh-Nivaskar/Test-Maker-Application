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
const organization_1 = require("../models/organization");
const roles_1 = require("../utils/enums/roles");
const user_1 = require("../models/user");
const user_2 = __importDefault(require("./user"));
const postgresDB_1 = __importDefault(require("../connections/postgresDB"));
class OrganizationService {
    constructor(organization) {
        this._id = organization._id;
        this.name = organization.name;
        this.admin = organization.admin;
        this.teachers = organization.teachers;
        this.students = organization.students;
        this.classrooms = organization.classrooms;
        this.invitesSent = organization.invitesSent;
    }
    static createOrganization(name, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!name || !userId)
                throw new Error("Name and UserId required");
            const organization = new organization_1.OrganizationModel({
                name,
                admin: userId,
                teachers: [userId],
            });
            yield organization.save();
            const user = yield user_2.default.getUserById(userId);
            if (!user)
                throw new Error("User not found");
            // PATCHUP
            const organizationId = organization._id;
            user.ownedOrganizations.push(organizationId);
            user.organizations.push({ id: organizationId, classrooms: [] });
            yield user.save();
        });
    }
    static getOrganizationById(organizationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const organization = yield organization_1.OrganizationModel.findById(organizationId);
            if (!organization)
                throw new Error("Organization not found");
            return organization;
        });
    }
    isOrganizationAdmin(userId) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const organization = yield organization_1.OrganizationModel.findById(this._id);
            if (!organization)
                throw new Error(`Organization by ${this._id} ID does not exist`);
            if (organization.admin === userId || ((_a = organization.admin) === null || _a === void 0 ? void 0 : _a.id) === userId)
                return true;
            return false;
        });
    }
    getOrganizationRole(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const organization = yield organization_1.OrganizationModel.findById(this._id);
            if (!organization)
                throw new Error(`Organization by ${this._id} ID does not exist`);
            if (organization.admin.toString() === userId.toString())
                return roles_1.UserRole.Admin;
            else if (organization.teachers.includes(userId))
                return roles_1.UserRole.Teacher;
            else if (organization.students.includes(userId))
                return roles_1.UserRole.Student;
            return roles_1.UserRole.NonMember;
        });
    }
    addTeacher(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const organization = yield organization_1.OrganizationModel.findById(this._id);
            if (!organization)
                throw new Error("Organization doesnt exist");
            const userRole = yield this.getOrganizationRole(userId);
            if (userRole === roles_1.UserRole.NonMember) {
                organization === null || organization === void 0 ? void 0 : organization.teachers.push(userId);
                yield (organization === null || organization === void 0 ? void 0 : organization.save());
                this.teachers = organization.teachers;
            }
            throw new Error(`User is already a member of this Organization as a ${userRole}`);
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
            const organization = yield organization_1.OrganizationModel.findById(this._id);
            if (!organization)
                throw new Error("Organization doesnt exist");
            const userRole = yield this.getOrganizationRole(userId);
            if (userRole === roles_1.UserRole.NonMember) {
                organization === null || organization === void 0 ? void 0 : organization.students.push(userId);
                yield (organization === null || organization === void 0 ? void 0 : organization.save());
                this.students = organization.students;
            }
            throw new Error(`User is already a member of this Organization as a ${userRole}`);
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
                throw new Error(`Cant send invite for ${role} role`);
            const userOrganizationRole = yield this.getOrganizationRole(userId);
            if (userOrganizationRole !== roles_1.UserRole.NonMember)
                throw new Error("User is already part of this organization");
            const organization = yield organization_1.OrganizationModel.findById(this._id);
            if (!organization)
                throw new Error("Organization doesnt exist");
            const user = yield user_1.UserModel.findById(userId);
            if (!user)
                throw new Error("User doesnt exist");
            organization.invitesSent.map((invite) => {
                if (invite.user.toString() === userId.toString()) {
                    throw new Error("User has already been sent an invite from this organization");
                }
            });
            organization.invitesSent.push({ user: userId, role });
            yield organization.save();
            this.invitesSent = organization.invitesSent;
            user.organizationInvites.push({ from: this._id, role });
            yield user.save();
        });
    }
    static addTable(createTableQuery, populateTableQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            yield postgresDB_1.default.query(createTableQuery);
            yield postgresDB_1.default.query(populateTableQuery);
        });
    }
}
exports.default = OrganizationService;
//# sourceMappingURL=organization.js.map