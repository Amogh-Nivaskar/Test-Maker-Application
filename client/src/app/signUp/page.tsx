"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/authentication";
import { redirect } from "next/navigation";

export default function Page(): React.ReactNode {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { signUp } = useAuth();

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const { signedIn, message } = await signUp(name, email, password);
    if (signedIn) {
      // redirect user to new page
      console.log("signed Up");
      redirect("/new");
    } else {
      setErrorMessage(message);
    }
  }

  const inputStyles = "border-2 border-slate-400 focus:outline-none p-1";

  return (
    <div className="">
      <form className="flex flex-col gap-2" onSubmit={handleLogin}>
        <input
          className={inputStyles}
          type="text"
          placeholder="username"
          onChange={(e) => setName(e.target.value)}
        />
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
          Sign up
        </button>
      </form>
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
}
