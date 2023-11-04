import mongoose, { Model, Schema } from "mongoose";
import { IOrganization } from "../interfaces/organization";
import { UserRole } from "../utils/roles";

const OrganizationSchema: Schema = new Schema<IOrganization>({
  name: {
    type: String,
    required: true,
  },
  admin: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  teachers: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  students: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  classrooms: [
    {
      type: Schema.Types.ObjectId,
      ref: "Classroom",
    },
  ],
  invitesSent: [
    {
      user: { type: Schema.Types.ObjectId, ref: "User" },
      role: { type: String, enum: UserRole, default: UserRole.Student },
    },
  ],
});

export const OrganizationModel = mongoose.model(
  "Organization",
  OrganizationSchema
);
