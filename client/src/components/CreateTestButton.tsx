"use client";

import { UserRole, selectUserRole } from "@/redux/slices/activeOrganization";
import { useSelector } from "react-redux";
import { Button } from "./ui/button";

export function CreateTestButton({ className }: { className: string }) {
  const userRole = useSelector(selectUserRole);

  //TODO: Create Test Link

  if (userRole === UserRole.Admin || userRole === UserRole.Teacher) {
    return <Button className={className}>Create Test</Button>;
  }
  return;
}
