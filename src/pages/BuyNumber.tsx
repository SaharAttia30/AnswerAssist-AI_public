// src/pages/BuyNumber.tsx
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import ReactCountryFlag from "react-country-flag";

type CountryCode = "IL" | "US";
type NumberType = "all" | "local" | "mobile" | "tollFree";

interface AvailableNumber {
  friendlyName: string | null;
  phoneNumber: string;
  locality?: string | null;
  region?: string | null;
  isoCountry: string;
  type: "local" | "mobile" | "tollFree";
}
function TranslateLocalityIfNeeded(locality : string , is_rtl : boolean){
  if(!is_rtl) return locality;
  const map: Record<string, string> = {
    "local": "ביתי",
    "mobile": "פלפון",
    "tollfree": "מספר חינמי"
  };
  return map[locality.toLowerCase()] || locality;
}
const BuyNumber = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "he";
  const { toast } = useToast();
  useEffect(() => {
      const defaultCountry: CountryCode = isRtl ? "IL" : "US";
      setCountry(defaultCountry);
  }, [isRtl]);
  const defaultCountry: CountryCode = isRtl ? "IL" : "US";
  const [country, setCountry] = useState<CountryCode>(defaultCountry);
  const [numberType, setNumberType] = useState<NumberType>("all");
  const [numbers, setNumbers] = useState<AvailableNumber[]>([]);
  const [loading, setLoading] = useState(false);

  const countries = [
    { code: "IL" as CountryCode, name: t("onboarding.countries_israel"), prefix: "+972" },
    { code: "US" as CountryCode, name: t("onboarding.countries_us"), prefix: "+1" },
  ];

  function CountrySelect({
    value,
    onChange,
  }: {
    value: CountryCode;
    onChange: (val: CountryCode) => void;
  }) {
    return (
      <div className="flex items-center gap-2">
        <ReactCountryFlag
          countryCode={value}
          svg
          style={{ width: "1.4em", height: "1.4em" }}
          title={value}
        />

        <select
          className="min-w-[160px] p-2 border border-gray-300 rounded-lg bg-white"
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
  function TypeSelect({
    value,
    onChange,
  }: {
    value: NumberType;
    onChange: (val: NumberType) => void;
  }) {
    return (
      <select
        className="min-w-[160px] p-2 border border-gray-300 rounded-lg bg-white"
        value={value}
        onChange={(e) => onChange(e.target.value as NumberType)}
      >
        <option value="all">{t("buynumber.types_anytype", "Any type")}</option>
        <option value="local">{t("buynumber.types_local", "Local")}</option>
        <option value="mobile">{t("buynumber.types_mobile", "Mobile")}</option>
        <option value="tollFree">{t("buynumber.types_tollfree", "Toll-free")}</option>
      </select>
    );
  }

  const fetchNumbers = async (selectedCountry: CountryCode, selectedType: NumberType) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/get-phone-number?country=${selectedCountry}&limit=8&type=${selectedType}`
      );

      const text = await res.text();
      if (!res.ok) {
        throw new Error(text || "Failed to load numbers");
      }

      const data = JSON.parse(text);
      setNumbers(data.numbers || []);
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to load available numbers",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNumbers(country, numberType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [country, numberType]);

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl bg-white shadow-md rounded-xl p-6">
          <h1
            className={`text-2xl font-semibold mb-4 ${
              isRtl ? "text-right" : "text-left"
            }`}
          >
            {t("buynumber.title", "Choose a Twilio phone number")}
          </h1>

          {/* Filters row */}
          <div
            className={`mb-4 flex flex-wrap items-center gap-3 w-full`} dir={isRtl ? "rtl" : "ltr"}>
            <span className="text-sm font-medium">
              {t("buynumber.country_label", "Country")}
            </span>
            <CountrySelect value={country} onChange={setCountry} />

            <span className="text-sm font-medium">
              {t("buynumber.types_label", "Number type")}
            </span>
            <TypeSelect value={numberType} onChange={setNumberType} />

            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchNumbers(country, numberType)}
              disabled={loading}
            >
              {loading
                ? t("buynumber.refresh_loading", "Loading...")
                : t("buynumber.button_refresh_page", "Refresh list")}
            </Button>
          </div>

          {/* Numbers list */}
          {loading ? (
            <p className={isRtl ? "text-right" : "text-left"}>
              {t("buynumber.button_loading_available_numbers", "Loading available numbers...")}
            </p>
          ) : numbers.length === 0 ? (
            <p className={isRtl ? "text-right text-gray-500" : "text-left text-gray-500"}>
              {t(
                "buynumber.none",
                "No numbers found for this selection. Try refreshing, another type, or another country."
              )}
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {numbers.map((n) => (
                <Card key={n.phoneNumber} className="p-4 flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <div dir="ltr" className="text-lg font-mono font-semibold">
                      {n.phoneNumber}
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 capitalize">
                      {TranslateLocalityIfNeeded(n.type, isRtl)}
                    </span>
                  </div>
                  <div dir="ltr" className="text-sm text-gray-600">
                    {n.friendlyName || t("buynumber.local_number", "Number")}
                    {n.locality && ` • ${n.locality}`}
                    {n.region && ` • ${n.region}`}
                  </div>
                  <div className="text-xs text-gray-500">
                    {t("buynumber.country_label", "Country")}: {n.isoCountry}
                  </div>

                  <Button
                    className="mt-2"
                    onClick={() => {
                      // later: call API to actually purchase + store in DB
                      toast({
                        title: t("buynumber.mock_buy_title", "Number selected"),
                        description: `${t(
                          "buynumber.mock_buy_desc",
                          "You chose"
                        )} ${n.phoneNumber}`,
                      });
                    }}
                  >
                    {t("buynumber.button_selectthisnumber", "Select this number")}
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuyNumber;
