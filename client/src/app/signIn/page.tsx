"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/authentication";
import { redirect, useRouter } from "next/navigation";

export default function Page(): React.ReactNode {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { signIn } = useAuth();
  const router = useRouter();

  async function handleSignIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const { signedIn, message } = await signIn(email, password);
    if (signedIn) {
      console.log("signed in");
      router.push("/new");
    } else {
      setErrorMessage(message);
    }
  }

  const inputStyles = "border-2 border-slate-400 focus:outline-none p-1";

  return (
    <div className="">
      <form className="flex flex-col gap-2" onSubmit={handleSignIn}>
        <input
          className={inputStyles}
          type="email"
          placeholder="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className={inputStyles}
          type="password"
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="border-2 border-slate-400" type="submit">
          Login
        </button>
      </form>
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
}
