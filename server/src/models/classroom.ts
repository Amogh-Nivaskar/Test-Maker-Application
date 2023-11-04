import mongoose, { Schema } from "mongoose";
import { IClassroom } from "../interfaces/classroom";
import { UserRole } from "../utils/roles";

const ClassroomSchema: Schema = new Schema<IClassroom>({
  name: {
    type: String,
    required: true,
  },
  organization: {
    type: Schema.Types.ObjectId,
    ref: "Organization",
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
  tests: [
    {
      type: Schema.Types.ObjectId,
      ref: "Test",
    },
  ],
  invitesSent: [
    {
      user: { type: Schema.Types.ObjectId, ref: "User" },
      role: { type: String, enum: UserRole, default: UserRole.Student },
    },
  ],
});

export const ClassroomModel = mongoose.model("Classroom", ClassroomSchema);
