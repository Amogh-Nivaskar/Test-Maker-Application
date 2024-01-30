import ViewTestResponse from "@/components/ViewTestResponses/ViewTestResponse";

export default async function Page({
  params,
}: {
  params: { organizationId: string; classroomId: string; testId: string };
}) {
  const { testId, organizationId, classroomId } = params;
  return (
    <ViewTestResponse
      organizationId={organizationId}
      classroomId={classroomId}
      testId={testId}
    />
  );
}
