import { selectUser } from "@/redux/slices/user";
import { getTest } from "@/services/test";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

export default function useResponses(
  testId: string,
  classroomId: string,
  organizationId: string
) {
  const [loading, setLoading] = useState<boolean>(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [responses, setResponses] = useState<any[]>([]);

  const user = useSelector(selectUser);

  useEffect(() => {
    async function getTestHelper() {
      setLoading(true);
      const data = await getTest(
        organizationId,
        classroomId,
        testId,
        user?.email
      );

      setQuestions(data?.questions);
      setResponses(data?.responses);
      setLoading(false);
    }
    getTestHelper();
  }, [organizationId, classroomId, testId, user.email]);

  return { loading, questions, responses };
}
