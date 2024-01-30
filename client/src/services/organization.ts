import { options } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { BASE_URL } from "./user";
import axios from "axios";

export async function getOrganizations() {
  try {
    const session = await getServerSession(options);
    const user = session?.user;

    const res = await axios.get(`${BASE_URL}/user/organizations`, {
      headers: {
        Authorization: user?.email,
      },
    });

    return res.data.organizations;
    // return [];
  } catch (error: any) {
    console.log(error.message);
  }
}

export async function getOrganizationRole(organizationId: string) {
  try {
    const session = await getServerSession(options);
    const user = session?.user;

    const res = await axios.get(
      `${BASE_URL}/organization/${organizationId}/role`,
      {
        headers: {
          Authorization: user?.email,
        },
      }
    );

    return res.data.role;
  } catch (error: any) {
    console.log(error.message);
  }
}
