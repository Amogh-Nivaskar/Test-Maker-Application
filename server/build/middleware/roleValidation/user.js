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
exports.validateUserGivingTestAuthorization = void 0;
const test_1 = __importDefault(require("../../services/test"));
function validateUserGivingTestAuthorization(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = req.user;
            const { testId } = req.params;
            const test = yield test_1.default.getTestById(testId);
            const testService = new test_1.default(test);
            if (yield testService.checkIfStudentCanGiveTest(user._id)) {
                next();
            }
            else {
                return res
                    .status(401)
                    .json({ message: "User must be a student of the test's classroom" });
            }
        }
        catch (error) {
            console.log(error);
            return res.status(400).json({ message: error.message });
        }
    });
}
exports.validateUserGivingTestAuthorization = validateUserGivingTestAuthorization;
//# sourceMappingURL=user.js.map