export default function ExplorerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex relative">
        {children}
    </div>  
  );
}
