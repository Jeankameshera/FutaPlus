import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface AdminLayoutProps {
  children: React.ReactNode;
  userData?: {
    firstName: string;
    lastName: string;
    profileImage?: string;
    role: string;
    phone?: string;
  };
}

const AdminLayout = ({ children, userData }: AdminLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col">
        <Header userData={userData} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;