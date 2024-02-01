"use client";
import React, { useState } from "react";
import DisplayAnswer, { IAnswer, IQuestion } from "./DisplayAnswer";
import { Button } from "../ui/button";
import useResponses from "@/hooks/useResponses";

export default function TeacherView({
  testId,
  organizationId,
  classroomId,
}: {
  testId: string;
  organizationId: string;
  classroomId: string;
}) {
  const [responseIdx, setResponseIdx] = useState<number>(0);
  const { loading, questions, responses } = useResponses(
    testId,
    classroomId,
    organizationId
  );
  function goToPrev() {
    if (responseIdx > 0) setResponseIdx(responseIdx - 1);
  }

  function goToNext() {
    if (responseIdx < responses.length - 1) setResponseIdx(responseIdx + 1);
  }

  if (loading) return <span>Loading</span>;

  return (
    <div className="flex flex-col gap-2">
      <span className="italic font-semibold">
        Student: {responses[responseIdx]?.givenBy.name}
      </span>
      <div className="flex flex-col gap-3">
        {questions.map((question: IQuestion, idx: number) => {
          const questionStatement = question?.statement;
          const answerObj = responses[responseIdx].answers.find(
            (answer: IAnswer) => answer.question === question._id
          );
          return (
            <div
              className="flex flex-col gap-1 border border-black p-2"
              key={idx}
            >
              <DisplayAnswer questionObj={question} answerObj={answerObj} />
            </div>
          );
        })}
      </div>
      <div className="flex justify-between">
        <Button disabled={responseIdx === 0} onClick={goToPrev}>
          Prev
        </Button>
        <Button
          disabled={responseIdx === responses.length - 1}
          onClick={goToNext}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
