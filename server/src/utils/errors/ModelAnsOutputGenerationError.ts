export default class ModelAnsOutputGenerationError extends Error {
  questionIdx: number;

  public constructor(message: string, questionIdx: number) {
    super(message);
    this.questionIdx = questionIdx;
  }
}
