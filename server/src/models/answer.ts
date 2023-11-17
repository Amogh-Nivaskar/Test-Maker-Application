import mongoose from "mongoose";
const Schema = mongoose.Schema;

const AnswerSchema = new Schema({
  question: {
    type: Schema.Types.ObjectId,
    ref: "Question",
    required: true,
  },
  answer: Schema.Types.Mixed,
  isCorrect: Boolean,
});

export const AnswerModel = mongoose.model("Answer", AnswerSchema);
