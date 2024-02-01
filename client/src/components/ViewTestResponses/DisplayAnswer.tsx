import { QuestionTypes } from "@/lib/enums/questionTypes";

interface ISQLAnswer {
  query: string;
  output: any;
}

export type answerTypes = string | number | number[] | ISQLAnswer;

export interface IAnswer {
  _id: string;
  question: IQuestion | IQuestion["_id"];
  answer: answerTypes;
  isCorrect: boolean;
}

export interface IQuestion {
  _id: string;
  statement: string;
  type: QuestionTypes;
  marks: number;
  modelAns: answerTypes;
  options?: string[];
}

export default function DisplayAnswer({
  questionObj,
  answerObj,
}: {
  questionObj: IQuestion;
  answerObj: IAnswer;
}) {
  return (
    <div>
      <p>Question: {questionObj.statement}</p>
      <p>Is Correct: {answerObj.isCorrect.toString()}</p>
      <p>
        Answer:&emsp;
        <span>
          {questionObj.type === QuestionTypes.TextAns &&
            answerObj.answer.toString()}
        </span>
        <span>
          {questionObj.type === QuestionTypes.MultipleChoice &&
            questionObj.options?.[answerObj.answer as number]}
        </span>
        <span>
          {questionObj.type === QuestionTypes.MultipleSelect &&
            questionObj.options?.map((option: string, idx: number) => {
              if (
                Array.isArray(answerObj.answer) &&
                answerObj.answer?.includes(idx)
              ) {
                return option + ", ";
              }
            })}
        </span>
        <span>
          {questionObj.type === QuestionTypes.SQL &&
            (answerObj.answer as ISQLAnswer)?.query}
        </span>
      </p>
    </div>
  );
}
