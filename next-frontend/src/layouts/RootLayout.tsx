import Header from "@/components/Header/header";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Inter } from "next/font/google";
import Sidebar from "@/components/Sidebar/admin_sidebar";
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <div>
      <div className="flex">
        <div className="container mx-auto p-4">
          {/* Render the Sidebar component */}
          <Sidebar router={router} isOpen={isSidebarOpen} />
          {/* Render the Header component */}
          <Header isOpen={isSidebarOpen} onToggleSidebar={toggleSidebar} />

          {children}
        </div>
      </div>
    </div>
  );
}
