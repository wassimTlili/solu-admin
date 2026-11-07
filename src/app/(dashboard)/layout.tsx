import { Suspense } from "react";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminBadge } from "@/components/shell/admin-badge";
import { AppSidebar } from "@/components/shell/app-sidebar";
import { PageTitle } from "@/components/shell/page-title";

export default function DashboardLayout({ children }: LayoutProps<"/">) {
  return (
    <SidebarProvider>
      <AppSidebar
        footer={
          <Suspense fallback={<Skeleton className="h-10 w-full" />}>
            <AdminBadge />
          </Suspense>
        }
      />
      <SidebarInset className="bg-transparent">
        <header className="glass sticky top-0 z-10 flex h-14 items-center gap-2 border-x-0 border-t-0 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mx-1 h-4" />
          <PageTitle />
        </header>
        <div className="flex-1 p-4 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
