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
exports.sendOrganizationInvite = exports.createOrganization = void 0;
const organization_1 = __importDefault(require("../services/organization"));
function createOrganization(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = req.user;
            const { name } = req.body;
            yield organization_1.default.createOrganization(name, user._id);
            return res
                .status(201)
                .json({ message: "Organization Created Successfully" });
        }
        catch (error) {
            console.log(error);
            return res.status(400).json({ message: error.message });
        }
    });
}
exports.createOrganization = createOrganization;
function sendOrganizationInvite(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = req.user;
            const { invitedUserId, role } = req.body;
            const { organizationId } = req.params;
            const organization = (yield organization_1.default.getOrganizationById(organizationId));
            const organizationService = new organization_1.default(organization);
            yield organizationService.sendInvite(invitedUserId, role);
            return res
                .status(201)
                .json({ message: "Organization Invite sent successfully" });
        }
        catch (error) {
            console.log(error);
            return res.status(400).json({ message: error.message });
        }
    });
}
exports.sendOrganizationInvite = sendOrganizationInvite;
//# sourceMappingURL=organization.js.map