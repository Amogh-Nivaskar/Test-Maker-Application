import { options } from "@/app/api/auth/[...nextauth]/options";
import axios from "axios";
import { getServerSession } from "next-auth";
import { BASE_URL } from "./user";

export async function getClassrooms(organizationId: string) {
  try {
    const session = await getServerSession(options);
    const user = session?.user;

    const res = await axios.get(
      `${BASE_URL}/organization/${organizationId}/classrooms`,
      {
        headers: {
          Authorization: user?.email,
        },
      }
    );
    return res.data.classrooms;
  } catch (error: any) {
    console.log(error.message);
  }
}
