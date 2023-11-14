import mongoose from "mongoose";
import { QuestionTypes } from "../utils/enums/questionsTypes";
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
  statement: {
    type: String,
    required: true,
    default: "Empty Question",
  },
  type: {
    type: String,
    enum: QuestionTypes,
    default: QuestionTypes.TextAns,
  },
  marks: Number,
  modelAns: Schema.Types.Mixed,
  options: [String],
});

/*
text-ans
    modelAns: String

multiple-choice
    modelAns: Number

multiple-select
    modelAns: [Number]

sql
    modelAns: {
        query: String.
        output: {}
    }

*/

export const QuestionModel = mongoose.model("Question", QuestionSchema);
