
import { Phone, Zap, Settings, BarChart, Clock, Users, Headphones, Shield } from 'lucide-react';
import { useTranslation } from "react-i18next";
const FeaturesSection = () => {
  const { t } = useTranslation();
  const features = [
  {
    icon: Phone,
    title: t("features.phonetitle"),
    description: t("features.phonedescription"),
    benefits: [t("features.phonebenefits1"), t("features.phonebenefits2"), t("features.phonebenefits3")]
  },
  {
    icon: Zap,
    title: t("features.zaptitle"),
    description: t("features.zapdescription"),
    benefits: [t("features.zapbenefits1"), t("features.zapbenefits2"), t("features.zapbenefits3")]
  },
  {
    icon: Users,
    title: t("features.userstitle"),
    description: t("features.usersdescription"),
    benefits: [t("features.usersbenefits1"), t("features.usersbenefits2"), t("features.usersbenefits3")]
  },
  {
    icon: Settings,
    title: t("features.settingstitle"),
    description: t("features.settingsdescription"),
    benefits: [t("features.settingsbenefits1"), t("features.settingsbenefits2"), t("features.settingsbenefits3")]
  },
  {
    icon: BarChart,
    title: t("features.barchattitle"),
    description: t("features.barchatdescription"),
    benefits: [t("features.barchatbenefits1"), t("features.barchatbenefits2"), t("features.barchatbenefits3")]
  },
  {
    icon: Shield,
    title: t("features.shieldtitle"),
    description: t("features.shielddescription"),
    benefits: [t("features.shieldbenefits1"), t("features.shieldbenefits2"), t("features.shieldbenefits3")]
  }
];
  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t("features.title1")}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t("features.title2")}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="feature-card animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 mb-4 leading-relaxed">
                {feature.description}
              </p>
              
              <ul className="space-y-2">
                {feature.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-center text-sm text-gray-700 gap-3">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{t("features.uptime_value")}</div>
              <div className="text-gray-600 text-sm">{t("features.uptime_text")}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{t("features.happybusiness_value")}</div>
              <div className="text-gray-600 text-sm">{t("features.happybusiness_text")}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{t("features.callhandled_value")}</div>
              <div className="text-gray-600 text-sm">{t("features.callhandled_text")}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">{t("features.rating_value")}</div>
              <div className="text-gray-600 text-sm">{t("features.rating_text")}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

