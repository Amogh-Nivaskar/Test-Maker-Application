import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { checkUserExistance, signInUser, signUpUser } from "@/services/user";

export const options: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email:",
          type: "email",
          placeholder: "your-cool-email",
        },
        password: {
          label: "Password:",
          type: "password",
          placeholder: "your-awesome-password",
        },
      },
      async authorize(credentials) {
        /*
        check if user with email exists
        sign up -> create user in db
        sign in -> make api call to sign in user
        */
        // const user = { id: "42", name: "Dave", password: "nextauth" };

        try {
          if (!credentials) throw new Error("Credentials not found");

          const userExists = await checkUserExistance(credentials.email);

          if (userExists) {
            //sign in
            const signedInUser = await signInUser(
              credentials.email,
              credentials.password
            );
            return signedInUser;
          } else {
            //sign up
            const signedUpUser = await signUpUser(
              credentials.email,
              "credentials",
              credentials.password
            );
            return signedUpUser;
          }
        } catch (error) {
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      /*
    if provider is 'Google':
        if user exists:
            do nothing 
        else:
            sign up user (make api call)
    */
      console.log("account provider is " + account?.provider);
      if (account?.provider === "google") {
        const userExists = await checkUserExistance(user?.email as string);
        if (!userExists) {
          const signedUpUser = await signUpUser(
            user.email as string,
            account.provider
          );
        } else {
          const signedInUser = await signInUser(user.email as string);
        }
      }
      return true;
    },
  },
};
