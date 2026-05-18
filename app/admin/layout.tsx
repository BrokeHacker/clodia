import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import AdminSidebar from "./AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/admin");
  if (user.app_metadata?.role !== "admin") redirect("/");

  return (
    <div className="min-h-screen flex flex-col md:flex-row" style={{ background: "#FAFAFA" }}>
      <AdminSidebar userEmail={user.email!} />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
