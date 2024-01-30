import { options } from "@/app/api/auth/[...nextauth]/options";
import axios from "axios";
import { getServerSession } from "next-auth";
import { BASE_URL } from "./user";
import { UserRole } from "@/redux/slices/activeOrganization";

export const CLIENT_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function getTests(organizationId: string, classroomId: string) {
  try {
    const session = await getServerSession(options);
    const user = session?.user;

    const res = await axios.get(
      `${BASE_URL}/organization/${organizationId}/classroom/${classroomId}/tests`,
      {
        headers: {
          Authorization: user?.email,
        },
      }
    );
    return res.data.tests;
  } catch (error: any) {
    console.log(error.message);
  }
}

export async function getTest(
  organizationId: string,
  classroomId: string,
  testId: string,
  email: string
) {
  try {
    const res = await axios.get(
      `${CLIENT_BASE_URL}/organization/${organizationId}/classroom/${classroomId}/test/${testId}`,
      {
        headers: {
          Authorization: email,
        },
      }
    );
    const userRole = res.data.userRole;
    if (userRole === UserRole.Admin || userRole === UserRole.Teacher) {
      return { questions: res.data.questions, responses: res.data.responses };
    }
    return;
  } catch (error: any) {
    console.log(error.message);
  }
}
