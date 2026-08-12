import { Button } from '@/components/ui/button';
import { Phone, Star, CheckCircle, Zap, Clock, Users } from 'lucide-react';
import { useTranslation } from "react-i18next";
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const NavigateSugnup = () => {
    navigate('/signup');
  };
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50" />
      <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-pulse-slow" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-200 rounded-full opacity-20 animate-pulse-slow" />
      <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-indigo-200 rounded-full opacity-20 animate-pulse-slow" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center animate-fade-in">
          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="flex items-center gap-1">
              <Star className="h-5 w-5 text-yellow-400 fill-current" />
              <Star className="h-5 w-5 text-yellow-400 fill-current" />
              <Star className="h-5 w-5 text-yellow-400 fill-current" />
              <Star className="h-5 w-5 text-yellow-400 fill-current" />
              <Star className="h-5 w-5 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-600 ml-2">{t("hero.trustedby")}</span>
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            {t("hero.title1")}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block mt-2 pb-4">
              {t("hero.title2")}
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            {t("hero.subheader")}
          </p>
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm">
              <Clock className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium">{t("hero.available")}</span>
            </div>
            <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm">
              <Users className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium">{t("hero.humanvoice")}</span>
            </div>
            <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm">
              <CheckCircle className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium">{t("hero.setup")}</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={NavigateSugnup}
            >
              <Zap className="mr-2 h-5 w-5" />
              {t("hero.startTrial")}
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-6 border-2 hover:bg-gray-50"
              onClick={() => navigate("/ai-demo")}
            >
              <Phone className="mr-2 h-5 w-5" />
              {t("hero.watchDemo")}
            </Button>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-3"> {t("hero.freetrialinclude")}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span> {t("hero.tencalls")}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span> {t("hero.threeminutes")}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span> {t("hero.customvoice")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
