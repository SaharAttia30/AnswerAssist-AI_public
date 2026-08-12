
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Navigation from '@/components/Navigation';
import { useTranslation } from "react-i18next";

import { 
  Search, 
  Phone, 
  MessageCircle, 
  Mail, 
  FileText,
  HelpCircle,
  Settings,
  CreditCard,
  Mic
} from 'lucide-react';



const HelpCenter = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "he"; 
  const helpCategories = [
    {
      title: t("helpcenter.category_getting_started"),
      icon: Settings,
      articles: [
        t("helpcenter.article_setup_assistant"),
        t("helpcenter.article_configure_number"),
        t("helpcenter.article_voice_preferences"),
        t("helpcenter.article_testing_setup")
      ]
    },
    {
      title: t("helpcenter.category_voice_settings"),
      icon: Mic,
      articles: [
        t("helpcenter.article_choose_voice"),
        t("helpcenter.article_customize_personality"),
        t("helpcenter.article_training_responses"),
        t("helpcenter.article_voice_troubleshooting")
      ]
    },
    {
      title: t("helpcenter.category_billing"),
      icon: CreditCard,
      articles: [
        t("helpcenter.article_minute_bundles"),
        t("helpcenter.article_upgrade_plan"),
        t("helpcenter.article_billing_cycle"),
        t("helpcenter.article_refunds")
      ]
    },
    {
      title: t("helpcenter.category_call_management"),
      icon: Phone,
      articles: [
        t("helpcenter.article_call_logs"),
        t("helpcenter.article_download_recordings"),
        t("helpcenter.article_flag_calls"),
        t("helpcenter.article_call_analytics")
      ]
    }
  ];

  const faqs = [
    {
      question: t("helpcenter.faq_trial"),
      answer: t("helpcenter.faq_trial_answer")
    },
    {
      question: t("helpcenter.faq_minutes"),
      answer: t("helpcenter.faq_minutes_answer")
    },
    {
      question: t("helpcenter.faq_voice_change"),
      answer: t("helpcenter.faq_voice_change_answer")
    },
    {
      question: t("helpcenter.faq_api_costs"),
      answer: t("helpcenter.faq_api_costs_answer")
    },
    {
      question: t("helpcenter.faq_crm"),
      answer: t("helpcenter.faq_crm_answer")
    }
  ];
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {t("helpcenter.title_main")}
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              {t("helpcenter.subtitle_main")}
            </p>
            
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input 
                placeholder={t("helpcenter.search_placeholder")}
                className="pl-10 py-3 text-lg"
              />
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <Card className="text-center p-6">
              <MessageCircle className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t("helpcenter.quicklinks_livechat")}</h3>
              <p className="text-gray-600 mb-4">{t("helpcenter.quicklinks_livechat_desc")}</p>
              <Button>{t("helpcenter.quicklinks_livechat_button")}</Button>
            </Card>
            
            <Card className="text-center p-6">
              <Mail className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t("helpcenter.quicklinks_email")}</h3>
              <p className="text-gray-600 mb-4">{t("helpcenter.quicklinks_email_desc")}</p>
              <Button variant="outline">{t("helpcenter.quicklinks_email_button")}</Button>
            </Card>
            
            <Card className="text-center p-6">
              <Phone className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t("helpcenter.quicklinks_phone")}</h3>
              <p className="text-gray-600 mb-4">{t("helpcenter.quicklinks_phone_desc")}</p>
              <Button variant="outline">{t("helpcenter.quicklinks_phone_button")}</Button>
            </Card>
          </div>

          {/* Help Categories */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">{t("helpcenter.browse_categories")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {helpCategories.map((category, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <category.icon className="h-6 w-6 text-blue-600" />
                      <CardTitle>{category.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {category.articles.map((article, articleIndex) => (
                        <li key={articleIndex}>
                          <a href="#" className="text-blue-600 hover:text-blue-800 text-sm">
                            {article}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">{t("helpcenter.faq_title")}</h2>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <HelpCircle className={`h-5 w-5 text-blue-600 ${isRtl ? "ml-2" : "mr-2"}`} />
                      {faq.question}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Contact Footer */}
          <div className="mt-16 text-center bg-blue-50 rounded-lg p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {t("helpcenter.need_help_title")}
            </h3>
            <p className="text-gray-600 mb-4"
              style={{ direction: isRtl ? "rtl" : "ltr"}}
            >
              {t("helpcenter.need_help_subtitle")}
            </p>
            <div className="gap-4">
              <Button>{t("helpcenter.button_contact_support")}</Button>
              <Button variant="outline">{t("helpcenter.button_schedule_demo")}</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
