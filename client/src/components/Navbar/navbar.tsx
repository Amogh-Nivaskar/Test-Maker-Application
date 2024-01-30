import { options } from "@/app/api/auth/[...nextauth]/options";
import { useAuth } from "@/contexts/authentication";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { Combobox } from "../ui/combobox";
import { getOrganizations } from "@/services/organization";

export default async function Navbar() {
  const session = await getServerSession(options);
  const organizations = await getOrganizations();
  console.log(organizations);
  return (
    <ul className="flex gap-2">
      <li>
        <Link href="/">Home</Link>
      </li>
      {session ? (
        <>
          <li>
            <Link href={"/api/auth/signout"}>Sign Out</Link>
          </li>
          <li>
            <Combobox displayArray={organizations} />
          </li>
        </>
      ) : (
        <>
          <li>
            <Link href="/api/auth/signin">Sign In</Link>
          </li>
          <li>
            <Link href="/api/auth/signin">Sign up</Link>
          </li>
        </>
      )}
    </ul>
  );
}
