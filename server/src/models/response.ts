import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ResponseSchema = new Schema({
  marksScored: {
    type: Number,
    default: 0,
  },
  givenBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  test: {
    type: Schema.Types.ObjectId,
    ref: "Test",
    required: true,
  },
  answers: [
    {
      question: {
        type: Schema.Types.ObjectId,
        ref: "Question",
        required: true,
      },
      answer: Schema.Types.Mixed,
      isCorrect: Boolean,
    },
  ],
});

export const ResponseModel = mongoose.model("Response", ResponseSchema);
