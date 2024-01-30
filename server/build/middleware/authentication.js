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
exports.validateUserAuthentication = void 0;
const user_1 = __importDefault(require("../services/user"));
function validateUserAuthentication(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const token = req.header("Authorization");
            if (!token)
                throw new Error("No Token found in request header");
            // const user = UserService.verifyToken(token);
            const userObj = yield user_1.default.getUserByEmail(token);
            if (!userObj)
                throw new Error("Token is faulty");
            req.user = {
                _id: userObj._id,
                name: userObj.name,
                email: userObj.email,
            };
            next();
        }
        catch (error) {
            console.log(error);
            return res.status(401).json({ message: error.message });
        }
    });
}
exports.validateUserAuthentication = validateUserAuthentication;
//# sourceMappingURL=authentication.js.map