// le fichier pour le thème globale 

import React from "react";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {children}
    </div>
  );
}
