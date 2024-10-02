import type { Metadata } from "next";
import "./globals.css";
import  Header from "./_components/Header";
import SideBar from "./_components/SideBar";

export const metadata: Metadata = {
  title: "NextJs App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <Header />
        <div className="flex">
          <SideBar />
          {children}
        </div>
      </body>
    </html>
  );
}
