import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  X, 
  User, 
  FileText, 
  PieChart, 
  Home, 
  Upload, 
  LogOut,
  Heart
} from "lucide-react";

const AppHeader: React.FC = () => {
  const { logout, user } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const userRole = user?.role;

  // Define navigation based on user role
  const getNavigation = () => {
    const baseNavigation = [
      { name: "Dashboard", href: "/dashboard", icon: Home },
      { name: "Reports", href: "/reports", icon: FileText },
      { name: "Profile", href: "/profile", icon: User },
    ];
    
    // Add patient-specific navigation items
    if (userRole === 'Patient') {
      baseNavigation.splice(2, 0, 
        { name: "Upload", href: "/upload", icon: Upload },
        { name: "Diet Consult", href: "/diet", icon: PieChart }
      );
    }
    
    return baseNavigation;
  };

  const navigation = getNavigation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-10 bg-white border-b shadow-sm">
      <div className="health-container">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center">
              <Heart className="w-6 h-6 mr-2 text-health-primary" />
              <span className="text-xl font-bold text-health-primary">Dharitri</span>
              <span className="ml-1 text-xl font-light">Health</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:items-center md:space-x-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors ${
                  isActive(item.href)
                    ? "bg-health-muted text-health-primary"
                    : "text-foreground hover:bg-health-muted hover:text-health-primary"
                }`}
              >
                <item.icon className="w-4 h-4 mr-2" />
                {item.name}
              </Link>
            ))}
            <Button
              variant="outline"
              onClick={logout}
              className="flex items-center ml-4 text-destructive hover:text-destructive-foreground"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </nav>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              type="button"
              className="text-foreground"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white shadow-md">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium flex items-center ${
                  isActive(item.href)
                    ? "bg-health-muted text-health-primary"
                    : "text-foreground hover:bg-health-muted"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            ))}
            <button
              onClick={() => {
                setIsMenuOpen(false);
                logout();
              }}
              className="flex items-center w-full px-3 py-2 mt-2 text-base font-medium text-destructive rounded-md hover:bg-destructive hover:text-destructive-foreground"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default AppHeader;