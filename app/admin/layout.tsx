import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";

export default function RequestLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-full w-full relative">
      <SidebarProvider>
        {/* <AdminSidebar/>
        <SidebarTrigger /> */}
        {children}
      </SidebarProvider>
    </div>  
  );
}
