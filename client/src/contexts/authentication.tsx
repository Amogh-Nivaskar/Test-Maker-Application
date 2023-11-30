"use client";

import axiosReq from "@/utils/axios";
import { createContext, useContext, useReducer } from "react";

export enum UserRole {
  Teacher = "teacher",
  Student = "student",
  Admin = "admin",
  NonMember = "NonMember",
}

export const ACCESS_TOKEN = "__Access_Token__";

type stateType = {
  id: null | string;
  name: null | string;
  email: null | string;
  activeOrganization?: null | string;
  organizationRole?: null | UserRole;
};

const initialState: stateType = {
  id: null,
  name: null,
  email: null,
  activeOrganization: null,
  organizationRole: null,
};

type ACTIONTYPE =
  | {
      type: "signUp";
      payload: stateType;
    }
  | {
      type: "signIn";
      payload: stateType;
    }
  | {
      type: "checkAuthStatus";
      payload: {};
    }
  | {
      type: "signOut";
    };

function reducer(state: stateType, action: ACTIONTYPE) {
  switch (action.type) {
    case "signUp":
      return { ...state, ...action.payload };
    case "signIn":
      return { ...state, ...action.payload };
    case "checkAuthStatus":
      return { ...state, ...action.payload };
    case "signOut":
      return initialState;
    default:
      return state;
  }
}

type PayloadType = {
  id: string;
  name: string;
  email: string;
  accessToken: string;
};

// type ContextType = {
//   signUp: (name: string, email: string, password: string) => Promise<void>;
// };

const AuthenticationContext = createContext<any>(null);

export function AuthenticationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, dispatch] = useReducer(reducer, initialState);

  async function signUp(name: string, email: string, password: string) {
    try {
      const res = await axiosReq
        .post("user/signup", { name, email, password })
        .catch((error: any) => error.response);

      if (res.status === 201) {
        const { id, name, email, accessToken }: PayloadType = res.data.payload;

        dispatch({ type: "signUp", payload: { id, name, email } });
        localStorage.setItem(ACCESS_TOKEN, accessToken);
        return { signedIn: true, message: res.data.message };
      } else {
        console.log(res);
        return { signedIn: false, message: res.data.message };
      }
    } catch (error: any) {
      console.log(error);
    }
  }

  async function signIn(email: string, password: string) {
    try {
      const res = await axiosReq
        .post("user/signin", { email, password })
        .catch((error) => error.response);

      if (res.status === 200) {
        const { id, name, email, accessToken }: PayloadType = res.data.payload;
        dispatch({ type: "signIn", payload: { id, name, email } });
        localStorage.setItem(ACCESS_TOKEN, accessToken);
        return { signedIn: true, message: res.data.message };
      } else {
        return { signedIn: false, message: res.data.message };
      }
    } catch (error: any) {
      console.log(error);
    }
  }

  async function checkAuthStatus() {
    try {
      const accessToken = localStorage.getItem(ACCESS_TOKEN);
      const res = await axiosReq.get("user/checkAuthStatus", {
        headers: {
          Authorization: accessToken,
        },
      });

      if (res.status !== 200) {
        dispatch({ type: "signOut" });
        localStorage.removeItem(ACCESS_TOKEN);
      }
    } catch (error: any) {
      console.log(error);
    }
  }

  async function signOut() {
    try {
      dispatch({ type: "signOut" });
      localStorage.removeItem(ACCESS_TOKEN);
    } catch (error: any) {
      console.log(error);
    }
  }

  return (
    <AuthenticationContext.Provider
      value={{ user, signUp, signIn, checkAuthStatus, signOut }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthenticationContext);
  if (!context)
    throw new Error(
      "AuthenticationContext was used outside of AuthenticationProvider scope"
    );

  return context;
}
