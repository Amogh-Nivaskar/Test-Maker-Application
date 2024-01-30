"use client";
import { UserRole, setUserRole } from "@/redux/slices/activeOrganization";
import { setUser } from "@/redux/slices/user";
import { Session } from "next-auth";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export function DisplayRole({
  role,
  user,
}: {
  role: UserRole;
  user:
    | {
        name?: string | null | undefined;
        email?: string | null | undefined;
        image?: string | null | undefined;
      }
    | undefined;
}) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setUserRole(role));

    dispatch(setUser(user));
  }, [role, dispatch, user]);

  return <span className="font-bold">Role: {role}</span>;
}
