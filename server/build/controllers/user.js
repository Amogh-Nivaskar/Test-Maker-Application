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
exports.acceptClassroomInvite = exports.acceptOrganizationInvite = exports.getOrganizations = exports.checkAuthStatus = exports.signin = exports.signup = exports.userExists = exports.ACCESS_TOKEN = void 0;
const user_1 = __importDefault(require("../services/user"));
exports.ACCESS_TOKEN = "__Access_Token__";
function userExists(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const email = req.query.email;
            const existingUser = yield user_1.default.getUserByEmail(email);
            return res
                .status(200)
                .json({ message: "Checked User Successfully", existingUser });
        }
        catch (error) {
            console.log(error);
            return res.status(400).json({
                message: "Something went wrong in checking if user already exists",
            });
        }
    });
}
exports.userExists = userExists;
// export async function signupWithEmailAndPassword(req: Request, res: Response) {
//   try {
//     const { name, email, password } = req.body;
//     const payload = await UserService.signupWithEmailAndPassword(
//       name,
//       email,
//       password
//     );
//     return res
//       .status(201)
//       .json({ message: "User Signed Up Successfully", payload });
//   } catch (error: any) {
//     console.log("Error in sign up: ", error.message);
//     return res.status(400).json({ message: error.message });
//   }
// }
function signup(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, password, provider } = req.body;
            const payload = yield user_1.default.signUp(email, email, provider, password);
            return res.status(201).json({
                message: "User Signed Up Successfull",
                user: payload === null || payload === void 0 ? void 0 : payload.user,
                accessToken: payload === null || payload === void 0 ? void 0 : payload.accessToken,
            });
        }
        catch (error) {
            console.log("Error in sign up: ", error.message);
            return res.status(400).json({ message: error.message });
        }
    });
}
exports.signup = signup;
function signin(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            const payload = yield user_1.default.signinWithEmailAndPassword(email, password);
            res.cookie(exports.ACCESS_TOKEN, payload === null || payload === void 0 ? void 0 : payload.accessToken);
            return res.status(200).json({
                message: "User Signed In Successfully",
                user: payload === null || payload === void 0 ? void 0 : payload.user,
                accessToken: payload === null || payload === void 0 ? void 0 : payload.accessToken,
            });
        }
        catch (error) {
            console.log(error);
            return res.status(400).json({ message: "Something went wrong in Sign In" });
        }
    });
}
exports.signin = signin;
function checkAuthStatus(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = req.user;
            if (user) {
                return res
                    .status(200)
                    .json({ message: "User is currently logged in", user });
            }
            else {
                return res.status(401).json({ message: "User is not logged in" });
            }
        }
        catch (error) {
            console.log(error);
            return res
                .status(400)
                .json({ message: "Something went wrong when checking auth status" });
        }
    });
}
exports.checkAuthStatus = checkAuthStatus;
function getOrganizations(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { _id } = req.user;
            // PATCHUP
            const user = (yield user_1.default.getUserById(_id));
            if (!user)
                throw new Error("User not found");
            const userService = new user_1.default(user);
            const organizations = yield userService.getOrganizations();
            return res
                .status(201)
                .json({ message: "Successfully fetched organizations", organizations });
        }
        catch (error) {
            console.log(error);
            return res.status(400).json({ message: error.message });
        }
    });
}
exports.getOrganizations = getOrganizations;
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