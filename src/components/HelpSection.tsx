
import { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, Book, MessageCircle, Zap } from 'lucide-react';
import { useTranslation } from "react-i18next";

const HelpSection = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { t } = useTranslation();
  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };
  const faqs = [
    {
      question: t("helpsection.faq1_question"),
      answer: t("helpsection.faq1_answer")
    },
    {
      question: t("helpsection.faq2_question"),
      answer: t("helpsection.faq2_answer")
    },
    {
      question: t("helpsection.faq3_question"),
      answer: t("helpsection.faq3_answer")
    },
    {
      question: t("helpsection.faq4_question"),
      answer: t("helpsection.faq4_answer")
    },
    {
      question: t("helpsection.faq5_question"),
      answer: t("helpsection.faq5_answer")
    },
    {
      question: t("helpsection.faq6_question"),
      answer: t("helpsection.faq6_answer")
    },
    {
      question: t("helpsection.faq7_question"),
      answer: t("helpsection.faq7_answer")
    },
    {
      question: t("helpsection.faq8_question"),
      answer: t("helpsection.faq8_answer")
    }
  ];

  const resources = [
    {
      icon: Book,
      title: t("helpsection.resource1_title"),
      description: t("helpsection.resource1_description"),
      link: "/docs"
    },
    {
      icon: MessageCircle,
      title: t("helpsection.resource2_title"),
      description: t("helpsection.resource2_description"),
      link: "/support"
    },
    {
      icon: Zap,
      title: t("helpsection.resource3_title"),
      description: t("helpsection.resource3_description"),
      link: "/quickstart"
    },
    {
      icon: HelpCircle,
      title: t("helpsection.resource4_title"),
      description: t("helpsection.resource4_description"),
      link: "/community"
    }
  ];
  return (
    <section id="help" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t("helpsection.title1")}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t("helpsection.title2")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* FAQ Section */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-8">{t("helpsection.askedquestions")}</h3>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border border-gray-200 rounded-lg">
                  <button
                    className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                    onClick={() => toggleFaq(index)}
                  >
                    <span className="font-medium text-gray-900">{faq.question}</span>
                    {openFaq === index ? (
                      <ChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </button>
                  {openFaq === index && (
                    <div className="px-6 pb-4">
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Resources Section */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-8">{t("helpsection.supportresources")}</h3>
            <div className="space-y-6">
              {resources.map((resource, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <resource.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        {resource.title}
                      </h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {resource.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                {t("helpsection.stillneedhelp")}
              </h4>
              <p className="text-gray-600 mb-4 text-sm">
                {t("helpsection.oursupportteam")}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  {t("helpsection.contactsupport")}
                </button>
                <button className="border border-blue-200 hover:border-blue-300 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  {t("helpsection.scheduledemo")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HelpSection;
