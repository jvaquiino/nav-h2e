'use client'
import { SidebarMenu } from "@/components/ui/sidebar";
import { items } from "./items";
import { usePathname } from "next/navigation";
import AdminLink from "./AdminLink";
import { authClient } from "@/lib/auth-client";

function AdminMenuList() {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  const role = session?.role;

  const visibleItems = items.filter(
    (item) => !item.requiredRole || item.requiredRole === role
  );

  return (
    <SidebarMenu>
      {visibleItems.map((item) => (
        <AdminLink key={item.title} item={item} pathname={pathname} />
      ))}
    </SidebarMenu>
   );
}

export default AdminMenuList;