import { getClassrooms } from "@/services/classroom";
import Link from "next/link";

export default async function Page({
  params,
}: {
  params: { organizationId: string };
}) {
  const organizationId = params.organizationId;
  const classrooms = await getClassrooms(organizationId);

  return (
    <div className="flex flex-col gap-1 border border-black">
      {classrooms.map((classroom: any) => (
        <div key={classroom._id} className="border border-black p-2">
          <Link
            href={`/organization/${organizationId}/classroom/${classroom._id}`}
          >
            {classroom.name}
          </Link>
        </div>
      ))}
    </div>
  );
}
