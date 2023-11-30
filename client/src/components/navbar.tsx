"use client";
import { useAuth } from "@/contexts/authentication";
import Link from "next/link";

export default function Navbar() {
  const { user, signOut } = useAuth();
  const isAuthenticated = user.id !== null;

  return (
    <ul className="flex gap-2">
      <li>
        <Link href="/">Home</Link>
      </li>
      {isAuthenticated ? (
        <li>
          <button onClick={signOut}>Sign Out</button>
        </li>
      ) : (
        <>
          <li>
            <Link href="/signIn">Sign In</Link>
          </li>
          <li>
            <Link href="/signUp">Sign up</Link>
          </li>
        </>
      )}
    </ul>
  );
}
