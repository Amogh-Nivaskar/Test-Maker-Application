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
exports.validateUserAsOrganizationMember = exports.validateUserAsAdmin = void 0;
const organization_1 = __importDefault(require("../../services/organization"));
const roles_1 = require("../../utils/enums/roles");
function validateUserAsAdmin(req, res, next) {
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
                return res.status(401).json({
                    message: "Access Denied. User needs to be organization's admin to send organization invite",
                });
            }
        }
        catch (error) {
            console.log(error);
            return res.status(400).json({ message: error.message });
        }
    });
}
exports.validateUserAsAdmin = validateUserAsAdmin;
function validateUserAsOrganizationMember(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = req.user;
            const { organizationId } = req.params;
            const organization = yield organization_1.default.getOrganizationById(organizationId);
            const organizationService = new organization_1.default(organization);
            if (organization.teachers.includes(user._id) ||
                organization.students.includes(user._id)) {
                next();
            }
            else {
                return res.status(401).json({
                    message: "Access Denied. User needs to be organization's member",
                });
            }
        }
        catch (error) {
            console.log(error);
            return res.status(400).json({ message: error.message });
        }
    });
}
exports.validateUserAsOrganizationMember = validateUserAsOrganizationMember;
//# sourceMappingURL=organization.js.map