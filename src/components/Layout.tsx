
import React from "react";
import Sidebar from "./Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileNav from "./MobileNav";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {isMobile ? <MobileNav /> : <Sidebar />}
      <main className="flex-1 p-4 md:p-8 pt-20 md:pt-8">{children}</main>
    </div>
  );
};

export default Layout;
