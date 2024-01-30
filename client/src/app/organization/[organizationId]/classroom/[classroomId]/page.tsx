import { CreateTestButton } from "@/components/CreateTestButton";
import { getTests } from "@/services/test";
import Link from "next/link";

export default async function Page({
  params,
}: {
  params: { organizationId: string; classroomId: string };
}) {
  const { organizationId, classroomId } = params;
  const tests = await getTests(organizationId, classroomId);
  return (
    <div>
      <CreateTestButton />
      {tests.map((test: any) => (
        <div className=" flex gap-1" key={test._id}>
          <Link
            href={`/organization/${organizationId}/classroom/${classroomId}/test/${test._id}`}
          >
            <span>{test.name} - </span>
            <span className="italic">{test.status}</span>
          </Link>
        </div>
      ))}
    </div>
  );
}
