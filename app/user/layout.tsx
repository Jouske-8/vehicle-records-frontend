import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { UserSidebar } from "@/components/UserSidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-full w-full relative">
      <SidebarProvider>
        <UserSidebar />
        <SidebarTrigger />
        {children}
      </SidebarProvider>
    </div>  
  );
}
