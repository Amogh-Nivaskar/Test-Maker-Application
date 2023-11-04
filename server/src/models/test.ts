import mongoose from "mongoose";
const Schema = mongoose.Schema;

const TestSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  classroom: {
    type: Schema.Types.ObjectId,
    ref: "Classroom",
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "inactive",
  },
  questions: [
    {
      type: Schema.Types.ObjectId,
      ref: "Question",
    },
  ],
  responses: [
    {
      type: Schema.Types.ObjectId,
      ref: "Response",
    },
  ],
  totalMarks: Number,
});

export const TestModel = mongoose.model("Test", TestSchema);
