import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { UserSidebar } from "@/components/UserSidebar";

export default function RequestLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex relative">
      <SidebarProvider>
        {/* <UserSidebar />
        <SidebarTrigger /> */}
        {children}
      </SidebarProvider>
    </div>  
  );
}
