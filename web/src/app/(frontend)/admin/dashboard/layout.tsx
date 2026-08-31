import './admin.css'
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/auth";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "./components/sidebar/AdminSidebar";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user || session.role === "USER") {
    redirect("/admin");
  }

  return (
    <SidebarProvider>
      <AdminSidebar />
      <div className="flex w-full">
        <SidebarTrigger className='m-1' iconClassName="size-5" />
        <main className="admin-container">
          {children}
        </main>
      </div>
    </SidebarProvider>
  )
}