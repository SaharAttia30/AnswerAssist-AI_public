import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ReactCountryFlag from "react-country-flag";
import Navigation from '@/components/Navigation';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next"; 

type CountryCode = "IL" | "US";


function applyPrefix(prefix, phoneInput) {
  const cleaned = phoneInput.replace(/[^0-9]/g, ""); // numbers only
  return `${prefix}${cleaned}`;
}
function allowOnlyDigits(input) {
  return input.replace(/\D/g, ""); // remove anything NOT a digit
}

function formatPhoneInput(value, country) {
  // Remove everything except digits
  let cleaned = allowOnlyDigits(value);

  // Israel rule: remove leading zero
  if (country === "IL" && cleaned.startsWith("0")) {
    cleaned = cleaned.substring(1);
  }

  return cleaned;
}

const Onboarding = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();      
  const isRtl = i18n.language === "he"; 
  useEffect(() => {
    const defaultCountry: CountryCode = isRtl ? "IL" : "US";
    setPhoneCountry(defaultCountry);
    setBusinessPhoneCountry(defaultCountry);
  }, [isRtl]);
  const [phone, setPhone] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessPhone, setBusinessPhone] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const defaultCountry: CountryCode = isRtl ? "IL" : "US";
  const [phoneCountry, setPhoneCountry] = useState<CountryCode>(defaultCountry);
  const [businessPhoneCountry, setBusinessPhoneCountry] = useState<CountryCode>(defaultCountry);

  const countries = [
    { code: "IL" as CountryCode, name: t("onboarding.countries_israel"), prefix: "+972" },
    { code: "US" as CountryCode, name: t("onboarding.countries_us"), prefix: "+1" },
  ];

  function CountrySelect({value, onChange,}: {value: CountryCode; onChange: (val: CountryCode) => void;}) {
    return (
      <div className="flex items-center gap-2">
        <ReactCountryFlag
          countryCode={value}
          svg
          style={{ width: "1.2em", height: "1.2em" }}
          title={value}
        />

        <select
          className="min-w-[130px] p-2 border border-gray-300 rounded-lg bg-white"
          value={value}
          onChange={(e) => onChange(e.target.value as CountryCode)}
        >
          {countries.map((c) => (
            <option key={c.code} value={c.code}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
    );
  }
  // if no user (not logged in) just send to login
  if (!user) {
    navigate("/login", { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const personalPrefix =
      phoneCountry === "IL" ? "+972" : "+1";
    const businessPrefix =
      businessPhoneCountry === "IL" ? "+972" : "+1";
    const formattedPhone = applyPrefix(personalPrefix, phone);
    const formattedBusinessPhone = applyPrefix(businessPrefix, businessPhone);
    const { error } = await supabase.auth.updateUser({
      data: {
        phone: formattedPhone,
        business_name: businessName,
        business_phone: formattedBusinessPhone,
      },
    });

    setIsSaving(false);

    if (error) {
      console.error("onboarding error", error.message);
      return;
    }

    navigate("/dashboard", { replace: true });
  };


  return (
    <div className="min-h-screen bg-white">
      <Navigation />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-lg px-10 py-8 shadow-lg">
                <CardHeader>
                <CardTitle>{t("onboarding.title1")}</CardTitle>
                </CardHeader>
                <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                    <label className="block text-sm font-medium mb-1">
                        {t("onboarding.personal_phone_number")}
                    </label>
                    <div>
                      <div className={`flex gap-2 ${isRtl ? "flex-row-reverse" : ""}`}>
                        <div className="w-40 flex-shrink-0">
                          <CountrySelect value={phoneCountry} onChange={setPhoneCountry} />
                        </div>
                        <Input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(formatPhoneInput(e.target.value, phoneCountry))}
                          placeholder={t("onboarding.personal_phone_number_placeholder")}
                          inputMode="numeric"
                          pattern="[0-9]*"
                          required
                        />
                      </div>
                    </div>
                    </div>
                    <div>
                    <label className="block text-sm font-medium mb-1">
                        {t("onboarding.business_name")}
                    </label>
                    <Input
                        type="text"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder={t("onboarding.business_name_placeholder")}
                        required
                    />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        {t("onboarding.business_phone_number")}
                      </label>

                      <div className={`flex gap-2 ${isRtl ? "flex-row-reverse" : ""}`}>
                        <div className="w-40 flex-shrink-0">
                          <CountrySelect value={businessPhoneCountry} onChange={setBusinessPhoneCountry} />
                        </div>
                        <Input
                          type="tel"
                          value={businessPhone}
                          onChange={(e) => setBusinessPhone(formatPhoneInput(e.target.value, businessPhoneCountry))}
                          placeholder={t("onboarding.business_phone_number_placeholder")}
                          inputMode="numeric"
                          pattern="[0-9]*"
                          required
                        />
                      </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={isSaving}>
                    {isSaving ? t("onboarding.saving"): t("onboarding.continue_to_dashboard")}
                    </Button>
                </form>
                </CardContent>
            </Card>
        </div>
    </div>
  );
};

export default Onboarding;
