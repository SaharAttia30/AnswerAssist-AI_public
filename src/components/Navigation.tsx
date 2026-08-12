
import { useState } from 'react';
import { useNavigate, useLocation} from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Phone, Zap, LogOut, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import i18n from '@/i18n';
import { useTranslation } from "react-i18next";

const Navigation = () => {
  const { i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isRtl = i18n.language === "he"; 
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const goToSection = (id: string) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => scrollToSection(id), 0);
    } else {
      scrollToSection(id);
    }
  };
  const handleLogin = () => {
    navigate('/login');
  };

  const handleDashboard = () => {
    if (user?.role === 'admin') {
      navigate('/admin');
    } else if (user?.role === 'partner') {
      navigate('/partner');
    } else {
      navigate('/dashboard');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };
  const toggleLanguage = () => {
    const next = i18n.language === "he" ? "en" : "he";
    i18n.changeLanguage(next);
    document.documentElement.lang = next;
    document.documentElement.dir = next === "he" ? "rtl" : "ltr";
    localStorage.setItem("lang", next);
  };
  const handleStartTrial = () => {
    if (isAuthenticated) {
      handleDashboard();
    } else {
      navigate('/signup');
    }
  };
  const { t } = useTranslation();

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
              <Phone className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">{t("BusinessName")}</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <button
              type="button"
              onClick={() => goToSection("features")}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              {t("nav.features")}
            </button>

            <button
              type="button"
              onClick={() => goToSection("pricing")}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              {t("nav.pricing")}
            </button>

            <button
              type="button"
              onClick={() => goToSection("how-it-works")}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              {t("nav.howitworks")}
            </button>
            <button onClick={() => navigate('/help')} className="text-gray-700 hover:text-blue-600 transition-colors">{t("nav.help")}</button>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
              <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={toggleLanguage}
                >
                {i18n.language === "he" ? "English" : "עברית"}
              </Button>
            {isAuthenticated ? (
              <>
                <Button variant="ghost" onClick={handleDashboard} className="text-gray-700 hover:text-blue-600">
                  <User className="mr-2 h-4 w-4" />
                  {user?.name}
                </Button>
                <Button variant="ghost" onClick={handleLogout} className={isRtl ? "flex flex-row-reverse items-center" : "flex items-center"}>
                  <LogOut className={`h-4 w-4 ${isRtl ? "ml-2" : "mr-2"}`}  />
                  {t("nav.logout")}
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={handleLogin} className="text-gray-700 hover:text-blue-600">
                  {t("nav.login")}
                </Button>
                <Button onClick={handleStartTrial} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Zap className="mr-2 h-4 w-4" />
                  {t("nav.startfreetrial")}
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={toggleMenu}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
            <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={toggleLanguage}
                >
                {i18n.language === "he" ? "English" : "עברית"}
              </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col gap-4">
              <button
                type="button"
                onClick={() => {
                  goToSection("features");
                  setIsMenuOpen(false);
                }}
                className="text-gray-700 hover:text-blue-600 transition-colors text-left"
              >
                {t("nav.features")}
              </button>

              <button
                type="button"
                onClick={() => {
                  goToSection("pricing");
                  setIsMenuOpen(false);
                }}
                className="text-gray-700 hover:text-blue-600 transition-colors text-left"
              >
                {t("nav.pricing")}
              </button>

              <button
                type="button"
                onClick={() => {
                  goToSection("how-it-works");
                  setIsMenuOpen(false);
                }}
                className="text-gray-700 hover:text-blue-600 transition-colors text-left"
              >
                {t("nav.howitworks")}
              </button>
              <button onClick={() => navigate('/help')} className="text-gray-700 hover:text-blue-600 transition-colors text-left">{t("nav.help")}</button>
              
              <div className="flex flex-col space-y-2 pt-4 border-t border-gray-100">
                
                {isAuthenticated ? (
                  <>
                    <Button variant="ghost" onClick={handleDashboard} className="justify-start">
                      <User className="mr-2 h-4 w-4" />
                      {user?.name}
                    </Button>
                    <Button variant="ghost" onClick={handleLogout} className={isRtl ? "flex flex-row-reverse items-center" : "flex items-center"}>
                      <LogOut className={`h-4 w-4 ${isRtl ? "ml-2" : "mr-2"}`}  />
                      {t("nav.logout")}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" onClick={handleLogin} className="justify-start">{t("nav.login")}</Button>
                    <Button onClick={handleStartTrial} className="bg-gradient-to-r from-blue-600 to-purple-600">
                      <Zap className="mr-2 h-4 w-4" />
                      {t("nav.startfreetrial")}
                    </Button>
                  </>
                )}
              
              </div>
              
            </div>
          </div>
        )}
      </div>
     
    </nav>
  );
};

export default Navigation;
