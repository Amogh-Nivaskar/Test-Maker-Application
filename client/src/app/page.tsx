import axios from "axios";
import { useState } from "react";
import { options } from "./api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";

export default async function Page() {
  const session = await getServerSession(options);
  console.log(session);
  return (
    <div className="w-full flex flex-col gap-3">
      {session ? "Logged in " : "Not Logged In"}
    </div>
  );
}
