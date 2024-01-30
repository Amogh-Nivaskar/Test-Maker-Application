"use client";
import { UserRole, selectUserRole } from "@/redux/slices/activeOrganization";
import { useSelector } from "react-redux";
import TeacherView from "./TeacherView";
import StudentView from "./StudentView";

export default function ViewTestResponse({
  testId,
  organizationId,
  classroomId,
}: {
  testId: string;
  organizationId: string;
  classroomId: string;
}) {
  const userRole = useSelector(selectUserRole);

  if (userRole === UserRole.Admin || userRole === UserRole.Teacher) {
    return (
      <TeacherView
        organizationId={organizationId}
        classroomId={classroomId}
        testId={testId}
      />
    );
  } else if (userRole === UserRole.Student) {
    return <StudentView />;
  } else {
    return <div>Non Member can not view test responses</div>;
  }
}
