import type { Metadata } from "next";
import { getCurrentAdmin, hasAnyUsers } from "@/lib/auth";
import { getCmsData } from "@/lib/cms-store";
import { AdminApp } from "@/components/admin/AdminApp";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Панель управления — GeeApp",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const initialized = hasAnyUsers();
  const user = await getCurrentAdmin();
  const initialData = user ? getCmsData() : null;

  return (
    <AdminApp
      initialInitialized={initialized}
      initialUser={user}
      initialCms={initialData}
    />
  );
}