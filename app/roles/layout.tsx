export default function RequestLayout({
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
