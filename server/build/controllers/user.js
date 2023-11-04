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
exports.acceptClassroomInvite = exports.acceptOrganizationInvite = exports.signinWithEmailAndPassword = exports.signupWithEmailAndPassword = void 0;
const user_1 = __importDefault(require("../services/user"));
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
//# sourceMappingURL=user.js.map