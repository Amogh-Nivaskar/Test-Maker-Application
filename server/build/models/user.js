"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const roles_1 = require("../utils/enums/roles");
const providerTypes_1 = require("../utils/enums/providerTypes");
const UserSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    provider: {
        type: String,
        required: true,
        default: providerTypes_1.ProviderTypes.Credentials,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
    },
    ownedOrganizations: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Organization",
        },
    ],
    // organizations: [
    //   {
    //     id: {
    //       type: Schema.Types.ObjectId,
    //       ref: "Organization",
    //     },
    //     classrooms: [
    //       {
    //         type: Schema.Types.ObjectId,
    //         ref: "Classroom",
    //       },
    //     ],
    //   },
    // ],
    organizations: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Organization",
        },
    ],
    organizationInvites: [
        {
            from: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: "Organization",
            },
            role: {
                type: String,
                default: roles_1.UserRole.Student,
                enum: roles_1.UserRole,
            },
        },
    ],
    classroomInvites: [
        {
            from: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: "Classroom",
            },
            role: {
                type: String,
                default: roles_1.UserRole.Student,
                enum: roles_1.UserRole,
            },
        },
    ],
});
exports.UserModel = mongoose_1.default.model("User", UserSchema);
//# sourceMappingURL=user.js.map