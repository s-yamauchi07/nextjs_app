"use client"

import SideBar from "@/app/_components/SideBar";
import useRouteGuard from "./_hooks/useRouteGuard"; 

export default function SideBarLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 共通コンポーネント内でuseRouteGuardを実行することで、管理者用ページにアクセスした際に制限をかけられる。
  useRouteGuard()

  return(
    <div className="flex">
      <SideBar />
      <div className="w-full">
        {children}
      </div>
    </div>
  )
}