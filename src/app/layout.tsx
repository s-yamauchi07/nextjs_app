import type { Metadata } from "next";
import "./globals.css";
import  Header from "./components/Header";

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
        {children}
      </body>
    </html>
  );
}
