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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = require("../models/user");
const organization_1 = require("../models/organization");
const roles_1 = require("../utils/enums/roles");
const classroom_1 = require("../models/classroom");
const providerTypes_1 = require("../utils/enums/providerTypes");
class UserService {
    constructor(user) {
        this._id = user._id;
        this.name = user.name;
        this.provider = user.provider;
        this.email = user.email;
        this.password = user.password;
        this.ownedOrganizations = user.ownedOrganizations;
        this.organizations = user.organizations;
        this.organizationInvites = user.organizationInvites;
        this.classroomInvites = user.classroomInvites;
    }
    static getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_1.UserModel.findOne({ email });
            if (!user)
                return null;
            return user;
        });
    }
    static getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_1.UserModel.findById(id);
            if (!user)
                return null;
            return user;
        });
    }
    static signUp(name, email, provider, password) {
        return __awaiter(this, void 0, void 0, function* () {
            if (provider === providerTypes_1.ProviderTypes.Google) {
                const user = new user_1.UserModel({ name, email, provider });
                yield user.save();
                const accessToken = this.generateAccessToken(email);
                return {
                    user: { _id: user === null || user === void 0 ? void 0 : user._id, name: user === null || user === void 0 ? void 0 : user.name, email: user === null || user === void 0 ? void 0 : user.email },
                    accessToken,
                };
            }
            else if (provider === providerTypes_1.ProviderTypes.Credentials) {
                if (!password)
                    throw new Error("Password not found");
                const { user, accessToken } = yield this.signupWithEmailAndPassword(name, email, password, provider);
                return {
                    user: { _id: user === null || user === void 0 ? void 0 : user._id, name: user === null || user === void 0 ? void 0 : user.name, email: user === null || user === void 0 ? void 0 : user.email },
                    accessToken,
                };
            }
        });
    }
    static signupWithEmailAndPassword(name, email, password, provider) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingUser = yield this.getUserByEmail(email);
            if (existingUser)
                throw new Error(`User by this email already exists`);
            const user = new user_1.UserModel({ name, email, password, provider });
            yield user.save();
            const accessToken = yield this.generateAccessToken(email);
            return { user, accessToken };
        });
    }
    static signinWithEmailAndPassword(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingUser = yield this.getUserByEmail(email);
            if (!existingUser)
                throw new Error("No user with given email ID");
            if (existingUser.provider === providerTypes_1.ProviderTypes.Credentials &&
                existingUser.password !== password) {
                // throw new Error("Incorrect email or password");
                return null;
            }
            const accessToken = yield this.generateAccessToken(email);
            return {
                user: {
                    _id: existingUser === null || existingUser === void 0 ? void 0 : existingUser._id,
                    name: existingUser === null || existingUser === void 0 ? void 0 : existingUser.name,
                    email: existingUser === null || existingUser === void 0 ? void 0 : existingUser.email,
                },
                accessToken,
            };
        });
    }
    static generateAccessToken(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.getUserByEmail(email);
            if (!user)
                throw new Error("No user with given email ID");
            const accessToken = jsonwebtoken_1.default.sign({
                _id: user._id,
                name: user.name,
                email: user.email,
            }, String(process.env.JWT_SECRET)
            // {
            //   expiresIn: "1d",
            // }
            );
            return accessToken;
        });
    }
    static verifyToken(token) {
        try {
            const user = jsonwebtoken_1.default.verify(token, String(process.env.JWT_SECRET));
            return user;
        }
        catch (error) {
            return null;
        }
    }
    getOrganizations() {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_1.UserModel.findById(this._id).populate("organizations");
            if (!user)
                throw new Error("User doesnt exist");
            return user.organizations;
        });
    }
    acceptOrganizationInvite(organizationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_1.UserModel.findById(this._id);
            if (!user)
                throw new Error("User doesnt exist");
            const targetInvite = this.organizationInvites.find((invite) => invite.from.toString() === organizationId.toString());
            if (!targetInvite)
                throw new Error("User doesnt have an invite from this organization");
            const organization = yield organization_1.OrganizationModel.findById(organizationId);
            if (!organization)
                throw new Error("Organization doesnt exist");
            if (targetInvite.role === roles_1.UserRole.Teacher) {
                organization.teachers.push(this._id);
            }
            else if (targetInvite.role === roles_1.UserRole.Student) {
                organization.students.push(this._id);
            }
            // CHECK
            organization.invitesSent = organization.invitesSent.filter((invite) => invite.user.toString() != this._id.toString());
            yield organization.save();
            user.organizations.push(organization._id);
            this.organizations = user.organizations;
            user.organizationInvites = user.organizationInvites.filter((invite) => invite.from.toString() !== organizationId.toString());
            user.organizations = [
                ...user.organizations,
                { id: organization._id, classrooms: [] },
            ];
            this.organizations = user.organizations;
            this.organizationInvites = user.organizationInvites;
            yield user.save();
        });
    }
    acceptClassroomInvite(classroomId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_1.UserModel.findById(this._id);
            if (!user)
                throw new Error("User doesnt exist");
            const targetInvite = this.classroomInvites.find((invite) => invite.from.toString() === classroomId.toString());
            if (!targetInvite)
                throw new Error("User doesnt have an invite from this organization");
            const classroom = yield classroom_1.ClassroomModel.findById(classroomId);
            if (!classroom)
                throw new Error("Classroom doesn't exist");
            if (targetInvite.role === roles_1.UserRole.Teacher) {
                classroom.teachers.push(this._id);
            }
            else if (targetInvite.role === roles_1.UserRole.Student) {
                classroom.students.push(this._id);
            }
            // CHECK
            classroom.invitesSent = classroom.invitesSent.filter((invite) => invite.user.toString() !== this._id.toString());
            user.classroomInvites = user.classroomInvites.filter((invite) => invite.from.toString() !== classroomId.toString());
            this.classroomInvites = user.classroomInvites;
            user.organizations = user.organizations.map((organization) => {
                if (organization.id.toString() === classroom.organization.toString()) {
                    organization.classrooms.push(classroom._id);
                }
                return organization;
            });
            yield classroom.save();
            yield user.save();
        });
    }
}
exports.default = UserService;
//# sourceMappingURL=user.js.map