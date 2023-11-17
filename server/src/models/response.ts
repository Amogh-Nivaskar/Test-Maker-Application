import mongoose from "mongoose";
import { ResponseStatus } from "../utils/enums/responseStatus";
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
  status: {
    type: String,
    enum: ResponseStatus,
    default: ResponseStatus.Ongoing,
  },
  answers: [
    {
      type: Schema.Types.ObjectId,
      ref: "Answer",
    },
  ],
});

export const ResponseModel = mongoose.model("Response", ResponseSchema);
