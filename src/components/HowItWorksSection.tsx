import { ArrowDown, Phone, Settings, Zap, CheckCircle } from 'lucide-react';
import { useTranslation } from "react-i18next";
import { useNavigate } from 'react-router-dom';

const HowItWorksSection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
    const NavigateSugnup = () => {
      navigate('/signup');
    };
  const steps = [
    {
      icon: Zap,
      title: t("howitworks.zaptitle"),
      description: t("howitworks.zapdescription"),
      details: [t("howitworks.zapbenefits1"), t("howitworks.zapbenefits2"), t("howitworks.zapbenefits3"), t("howitworks.zapbenefits4")]
    },
    {
      icon: Phone,
      title: t("howitworks.phonetitle"),
      description: t("howitworks.phonedescription"),
      details: [t("howitworks.phonebenefits1"), t("howitworks.phonebenefits2"), t("howitworks.phonebenefits3"), t("howitworks.phonebenefits4")]
    },
    {
      icon: Settings,
      title: t("howitworks.settingstitle"),
      description: t("howitworks.settingsdescription"),
      details: [t("howitworks.settingsbenefits1"), t("howitworks.settingsbenefits2"), t("howitworks.settingsbenefits3"), t("howitworks.settingsbenefits4")]
    },
    {
      icon: CheckCircle,
      title: t("howitworks.checkcirclestitle"),
      description: t("howitworks.checkcircledescription"),
      details: [t("howitworks.checkcirclebenefits1"), t("howitworks.checkcirclebenefits2"), t("howitworks.checkcirclebenefits3"), t("howitworks.checkcirclebenefits4")]
    }
  ];
  return (
    <section id="how-it-works" className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t("howitworks.title1")}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t("howitworks.title2")}
          </p>
        </div>
        <div className="max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12">
                <div className="flex-shrink-0 text-center">
                  <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg mb-4 mx-auto">
                    <step.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mx-auto">
                    {index + 1}
                  </div>
                </div>
                  <div 
                    className={`flex-1 
                      ${document.documentElement.dir === "rtl" 
                        ? "text-right md:text-right" 
                        : "text-center md:text-left"
                      }`}
                  >
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                    {step.description}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {step.details.map((detail, idx) => (
                      <div key={idx} className="flex items-center justify-center md:justify-start gap-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full" />
                        <span className="text-gray-700 text-sm">{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className="flex justify-center mb-8">
                  <ArrowDown className="h-8 w-8 text-gray-400" />
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {t("howitworks.redytostart_title1")}
            </h3>
            <p className="text-gray-600 mb-6">
              {t("howitworks.redytostart_title2")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                onClick={NavigateSugnup}
              >
              {t("howitworks.freetriel")}
              </button>
              <button className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-3 rounded-lg font-semibold transition-colors">
              {t("howitworks.schduledemo")}
              </button>
            </div>
            <div className="mt-6 text-sm text-gray-500">
              {t("howitworks.threedayfreetrial")}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
