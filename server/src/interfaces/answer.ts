import { IQuestion } from "./question";

interface ISQLAnswer {
  query: string;
  output: any;
}

export type answerTypes = string | number | number[] | ISQLAnswer;

export interface IAnswer {
  question: IQuestion;
  answer: answerTypes;
  isCorrect: boolean;
}
