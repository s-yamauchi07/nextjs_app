import SideBar from "@/app/_components/SideBar";

export default function SideBarLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return(
    <div className="flex">
      <SideBar />
      <div className="w-full">
        {children}
      </div>
    </div>
  )
}