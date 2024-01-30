"use client";

import { selectUser } from "@/redux/slices/user";
import { getTest } from "@/services/test";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

export default function TeacherView({
  testId,
  organizationId,
  classroomId,
}: {
  testId: string;
  organizationId: string;
  classroomId: string;
}) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [responses, setResponses] = useState<any[]>([]);

  const user = useSelector(selectUser);

  useEffect(() => {
    async function getTestHelper() {
      const data = await getTest(
        organizationId,
        classroomId,
        testId,
        user?.email
      );
      console.log(data);
      setQuestions(data?.questions);
      setResponses(data?.responses);
    }
    getTestHelper();
  }, [organizationId, classroomId, testId, user.email]);

  return (
    <div>
      {questions.map((q: any, idx: number) => (
        <div key={idx}> {q.statement} </div>
      ))}
    </div>
  );
}
