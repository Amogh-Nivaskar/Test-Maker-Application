import mongoose, { Model, Schema } from "mongoose";
import { IUser } from "../interfaces/user";
import { UserRole } from "../utils/enums/roles";
import { ProviderTypes } from "../utils/enums/providerTypes";

const UserSchema: Schema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  provider: {
    type: String,
    required: true,
    default: ProviderTypes.Credentials,
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
      type: Schema.Types.ObjectId,
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
      type: Schema.Types.ObjectId,
      ref: "Organization",
    },
  ],
  organizationInvites: [
    {
      from: {
        type: Schema.Types.ObjectId,
        ref: "Organization",
      },
      role: {
        type: String,
        default: UserRole.Student,
        enum: UserRole,
      },
    },
  ],
  classroomInvites: [
    {
      from: {
        type: Schema.Types.ObjectId,
        ref: "Classroom",
      },
      role: {
        type: String,
        default: UserRole.Student,
        enum: UserRole,
      },
    },
  ],
});

export const UserModel = mongoose.model("User", UserSchema);
