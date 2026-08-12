
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { useTranslation } from "react-i18next";

const ContactSection = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form submitted:', formData);
    // Handle form submission
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t("ContactSection.title1")}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t("ContactSection.title2")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact form */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">{t("ContactSection.sendamessage")}</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    {t("ContactSection.form_name")} *
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder={t("ContactSection.form_name_placeholder")}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    {t("ContactSection.form_email")} *
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your.email@company.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                  {t("ContactSection.form_comapany")}
                </label>
                <Input
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder={t("ContactSection.form_comapany_placeholder")}
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  {t("ContactSection.form_message")} *
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder={t("ContactSection.form_message_placeholder")}
                  rows={5}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {t("ContactSection.form_sendmessage")}
              </Button>
            </form>
          </div>

          {/* Contact info */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">{t("ContactSection.contact_title1")}</h3>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                {t("ContactSection.contact_title2_1")}
                <br/>
                {t("ContactSection.contact_title2_2")}
              </p>
            </div>

            {/* Contact methods */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">{t("ContactSection.contact_emailus_title")}</h4>
                  <p className="text-gray-600">{t("BusinessEmail")}</p>
                  <p className="text-sm text-gray-500">{t("ContactSection.contact_emailus_response")}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Phone className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">{t("ContactSection.contact_callus_title")}</h4>
                  <p className="text-gray-600">{t("BusinessPhoneNumber")}</p>
                  <p className="text-sm text-gray-500">{t("BusinessHoursOfOperatiom")}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <MapPin className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">{t("ContactSection.contact_visitus_title")}</h4>
                  <p className="text-gray-600">{t("BusinessLocation")}</p>
                  <p className="text-sm text-gray-500">{t("ContactSection.contact_visitus_text")}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-orange-100 p-3 rounded-lg">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">{t("ContactSection.contact_hours_title")}</h4>
                  <p className="text-gray-600">{t("BusinessHoursOfOperatiom")}</p>
                  <p className="text-sm text-gray-500">{t("ContactSection.contact_hours_text")}</p>
                </div>
              </div>
            </div>

            {/* Quick links */}
            <div className="bg-blue-50 rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 mb-4">{t("ContactSection.contact_quickaction_title")}</h4>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  {t("ContactSection.contact_quickaction_scheduledemo")}
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  {t("ContactSection.contact_quickaction_integrationguide")}
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  {t("ContactSection.contact_quickaction_Documentation")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
