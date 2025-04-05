
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Outlet, Navigate } from "react-router-dom";
import AppHeader from "./AppHeader";
import AppFooter from "./AppFooter";
import { Loader2, Heart } from "lucide-react";

const AppLayout: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-health-light">
        <Heart className="w-12 h-12 text-health-primary animate-pulse mb-4" />
        <div className="flex items-center">
          <Loader2 className="w-6 h-6 text-health-primary animate-spin mr-2" />
          <span className="text-lg font-medium text-health-primary">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-health-light">
      <AppHeader />
      <main className="flex-grow">
        <div className="health-container py-8">
          <Outlet />
        </div>
      </main>
      <AppFooter />
    </div>
  );
};

export default AppLayout;
