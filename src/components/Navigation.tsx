import { Button } from "@/components/ui/button";
import { Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  const handleLoginClick = () => {
    navigate("/login");
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setMobileMenuOpen(false);
  };

  const handleAdminClick = () => {
    navigate("/admin");
    setMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="text-2xl font-bold bg-gradient-flow bg-clip-text text-transparent">
            FLOW AI
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollToSection('services')} className="text-foreground hover:text-primary transition-colors">
              Services
            </button>
            <button onClick={() => scrollToSection('portfolio')} className="text-foreground hover:text-primary transition-colors">
              Portfolio
            </button>
            <button onClick={() => scrollToSection('order')} className="text-foreground hover:text-primary transition-colors">
              Order
            </button>
            <button onClick={() => scrollToSection('contact')} className="text-foreground hover:text-primary transition-colors">
              Contact
            </button>
            {user ? (
              <>
                {isAdmin && (
                  <Button variant="outline" size="sm" onClick={handleAdminClick}>
                    Admin
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="mr-2" size={16} />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => navigate("/signup")}>
                  Sign Up
                </Button>
                <Button variant="outline" size="sm" onClick={handleLoginClick}>
                  Login
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4 animate-slide-up">
            <button onClick={() => scrollToSection('services')} className="block w-full text-left text-foreground hover:text-primary transition-colors py-2">
              Services
            </button>
            <button onClick={() => scrollToSection('portfolio')} className="block w-full text-left text-foreground hover:text-primary transition-colors py-2">
              Portfolio
            </button>
            <button onClick={() => scrollToSection('order')} className="block w-full text-left text-foreground hover:text-primary transition-colors py-2">
              Order
            </button>
            <button onClick={() => scrollToSection('contact')} className="block w-full text-left text-foreground hover:text-primary transition-colors py-2">
              Contact
            </button>
            {user ? (
              <>
                {isAdmin && (
                  <Button variant="outline" size="sm" className="w-full" onClick={handleAdminClick}>
                    Admin
                  </Button>
                )}
                <Button variant="outline" size="sm" className="w-full" onClick={handleLogout}>
                  <LogOut className="mr-2" size={16} />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" className="w-full" onClick={() => { navigate("/signup"); setMobileMenuOpen(false); }}>
                  Sign Up
                </Button>
                <Button variant="outline" size="sm" className="w-full" onClick={handleLoginClick}>
                  Login
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
