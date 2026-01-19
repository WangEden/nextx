export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen cursor-custom bg-radial pt-20">
      {children}
    </div>
  )
}
