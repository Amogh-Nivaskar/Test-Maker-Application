import { options } from "@/app/api/auth/[...nextauth]/options";
import { DisplayRole } from "@/components/DisplayRole";
import { getOrganizationRole } from "@/services/organization";
import { getServerSession } from "next-auth";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    organizationId: string;
  };
}) {
  const role = await getOrganizationRole(params.organizationId);
  const session = await getServerSession(options);
  return (
    <div className="flex flex-col justify-center ">
      <DisplayRole role={role} user={session?.user} />
      {children}
    </div>
  );
}
