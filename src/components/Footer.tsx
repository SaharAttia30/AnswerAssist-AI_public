
import { Phone, Mail, MapPin } from 'lucide-react';
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Phone className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">{t("BusinessName")}</span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              {t("footer.description1")}
              {t("footer.description2")}
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-400">
                <Mail className="h-4 w-4" />
                <span>{t("BusinessEmail")}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Phone className="h-4 w-4" />
                <span>{t("BusinessPhoneNumber")}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <MapPin className="h-4 w-4" />
                <span>{t("BusinessLocation")}</span>
              </div>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-lg font-semibold mb-6">{t("footer.products_title")}</h3>
            <ul className="space-y-3 text-gray-400">
              <li><a href="#features" className="hover:text-white transition-colors">{t("footer.products_menu1")}</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">{t("footer.products_menu2")}</a></li>
              <li><a href="#how-it-works" className="hover:text-white transition-colors">{t("footer.products_menu3")}</a></li>
              <li><a href="/integrations" className="hover:text-white transition-colors">{t("footer.products_menu4")}</a></li>
              <li><a href="/api" className="hover:text-white transition-colors">{t("footer.products_menu5")}</a></li>
              <li><a href="/security" className="hover:text-white transition-colors">{t("footer.products_menu6")}</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-6">{t("footer.support_title")}</h3>
            <ul className="space-y-3 text-gray-400">
              <li><a href="#help" className="hover:text-white transition-colors">{t("footer.support_menu1")}</a></li>
              <li><a href="/contact" className="hover:text-white transition-colors">{t("footer.support_menu2")}</a></li>
              <li><a href="/status" className="hover:text-white transition-colors">{t("footer.support_menu3")}</a></li>
              <li><a href="/community" className="hover:text-white transition-colors">{t("footer.support_menu4")}</a></li>
              <li><a href="/training" className="hover:text-white transition-colors">{t("footer.support_menu5")}</a></li>
              <li><a href="/partners" className="hover:text-white transition-colors">{t("footer.support_menu6")}</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-6">{t("footer.legal_title")}</h3>
            <ul className="space-y-3 text-gray-400">
              <li><a href="/privacy" className="hover:text-white transition-colors">{t("footer.legal_menu1")}</a></li>
              <li><a href="/terms" className="hover:text-white transition-colors">{t("footer.legal_menu2")}</a></li>
              <li><a href="/cookies" className="hover:text-white transition-colors">{t("footer.legal_menu3")}</a></li>
              <li><a href="/gdpr" className="hover:text-white transition-colors">{t("footer.legal_menu4")}</a></li>
              <li><a href="/sla" className="hover:text-white transition-colors">{t("footer.legal_menu5")}</a></li>
              <li><a href="/dmca" className="hover:text-white transition-colors">{t("footer.legal_menu6")}</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm mb-4 md:mb-0">
            {t("footer.buttom_title")}
          </div>
          
          <div className="flex items-center gap-6">
            <a 
              href={t("BusinessTiktokUrl")}
              className="text-gray-400 hover:text-white transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="text-sm">{t("footer.buttom_followustiktop")}</span>
            </a>
            <div className="text-gray-400 text-sm">
              {t("footer.buttom_madewith")}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
