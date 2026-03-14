import { notFound } from "next/navigation";
import AdminPanel from "../../components/AdminPanel";

interface PageProps {
  params: Promise<{ accessKey: string }>;
}

export default async function PanelPage({ params }: PageProps) {
  const { accessKey } = await params;

  if (accessKey !== process.env.ADMIN_ACCESS_KEY) {
    notFound();
  }

  return <AdminPanel />;
}
