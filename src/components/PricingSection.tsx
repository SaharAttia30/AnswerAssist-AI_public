import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, Zap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from "react-i18next";
import { useToast } from '@/hooks/use-toast';  

const PricingSection = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "he"; 
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();  
  const navigate = useNavigate();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const is_rtl = document.documentElement.dir === "rtl";
  const startCheckout = async (planId: string) => {
    if (!user) {
      // safety guard – should be handled before calling this
      navigate(`/signup?plan=${planId}`);
      return;
    }

    try {
      setLoadingPlan(planId);

      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, planId }),
      });

      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || 'Failed to start checkout');
      }

      window.location.href = data.url;
    } catch (err) {
      console.error(err);
      toast({
        title: t("pricingsection.payment_error_title", "Payment error"),
        description: t("pricingsection.payment_error_desc", "Could not start checkout, please try again."),
        variant: "destructive",
      });
    } finally {
      setLoadingPlan(null);
    }
  };
  const handleChoosePlan = async (planId: string) => {
    if (!isAuthenticated || !user) {
      navigate(`/signup?plan=${planId}`);
      return;
    }
    if(planId == "trial"){
      navigate(`/ai-demo`)
    }
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          billingPeriod,
          userId: user.id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error('Stripe checkout error:', data.error);
        alert(data.error || 'Failed to start checkout');
        return;
      }

      window.location.href = data.url;
    } catch (err) {
      console.error('Error calling create-checkout-session', err);
      alert('Something went wrong starting the payment. Please try again.');
    }
  };

  const handlePlanSelect = (planType: string) => {
  if (!isAuthenticated || !user) {
    navigate('/login');
    return;
  }

  handleChoosePlan(planType);
};


  const handleBundleSelect = (bundleSize: number) => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      navigate('/dashboard');
    }
  };

  const subscriptionPlans = [
    {
      id: "trial",
      name: t("pricingsection.subscriptionplans_trial_name"),
      description: t("pricingsection.subscriptionplans_trial_description"),
      monthlyPrice: 0,
      annualPrice: 0,
      features: [
        t("pricingsection.subscriptionplans_trial_features1"),
        t("pricingsection.subscriptionplans_trial_features2"),
        t("pricingsection.subscriptionplans_trial_features3"),
        t("pricingsection.subscriptionplans_trial_features4"),
        t("pricingsection.subscriptionplans_trial_features5")
      ],
      popular: false,
      buttonText: t("pricingsection.subscriptionplans_trial_buttonText")
    },
    {
      id: "solo",
      name: t("pricingsection.subscriptionplans_solo_name"),
      description: t("pricingsection.subscriptionplans_solo_description"),
      monthlyPrice: 99,
      annualPrice: 990,
      features: [
        t("pricingsection.subscriptionplans_solo_features1"),
        t("pricingsection.subscriptionplans_solo_features2"),
        t("pricingsection.subscriptionplans_solo_features3"),
        t("pricingsection.subscriptionplans_solo_features4"),
        t("pricingsection.subscriptionplans_solo_features5"),
        t("pricingsection.subscriptionplans_solo_features6")
      ],
      popular: false,
      buttonText: t("pricingsection.subscriptionplans_solo_buttonText")
    },
    {
      id: "business",
      name: t("pricingsection.subscriptionplans_business_name"),
      description: t("pricingsection.subscriptionplans_business_description"),
      monthlyPrice: 199,
      annualPrice: 1990,
      features: [
        t("pricingsection.subscriptionplans_business_features1"),
        t("pricingsection.subscriptionplans_business_features2"),
        t("pricingsection.subscriptionplans_business_features3"),
        t("pricingsection.subscriptionplans_business_features4"),
        t("pricingsection.subscriptionplans_business_features5"),
        t("pricingsection.subscriptionplans_business_features6"),
        t("pricingsection.subscriptionplans_business_features7")
      ],
      popular: true,
      buttonText: t("pricingsection.subscriptionplans_business_buttonText")
    },
    {
      id: "enterprise",
      name: t("pricingsection.subscriptionplans_Enterprise_name"),
      description: t("pricingsection.subscriptionplans_Enterprise_description"),
      monthlyPrice: 499,
      annualPrice: 4990,
      features: [
        t("pricingsection.subscriptionplans_Enterprise_features1"),
        t("pricingsection.subscriptionplans_Enterprise_features2"),
        t("pricingsection.subscriptionplans_Enterprise_features3"),
        t("pricingsection.subscriptionplans_Enterprise_features4"),
        t("pricingsection.subscriptionplans_Enterprise_features5"),
        t("pricingsection.subscriptionplans_Enterprise_features6"),
        t("pricingsection.subscriptionplans_Enterprise_features7")
      ],
      popular: false,
      buttonText: t("pricingsection.subscriptionplans_Enterprise_buttonText")
    }
  ];

  const minuteBundles = [
    { minutes: 100, price: 15, rate: 0.15 },
    { minutes: 500, price: 65, rate: 0.13 },
    { minutes: 1000, price: 120, rate: 0.12 },
    { minutes: 2500, price: 275, rate: 0.11 },
    { minutes: 5000, price: 500, rate: 0.10 },
    { minutes: 10000, price: 900, rate: 0.09 },
    { minutes: 25000, price: 2000, rate: 0.08 },
    { minutes: 100000, price: 7000, rate: 0.07 }
  ];

  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {t("pricingsection.title1")}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t("pricingsection.title2")}
          </p>
        </div>

        <Tabs defaultValue="subscriptions" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
            <TabsTrigger value="subscriptions"> {t("pricingsection.monthlyplan")}</TabsTrigger>
            <TabsTrigger value="bundles">{t("pricingsection.minutebundles")}</TabsTrigger>
          </TabsList>

          <TabsContent value="subscriptions">
            {/* Billing Toggle */}
            <div className="flex justify-center items-center mb-8">
              <span className={`mr-3 ${billingPeriod === 'monthly' ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                {t("pricingsection.Monthly")}
              </span>
              <button
                onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'annual' : 'monthly')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  billingPeriod === 'annual' ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    billingPeriod === 'annual' ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`ml-3 ${billingPeriod === 'annual' ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                {t("pricingsection.Annual")}
              </span>
              {billingPeriod === 'annual' && (
                <Badge className="ml-2 bg-green-100 text-green-800">{t("pricingsection.save17")}</Badge>
              )}
            </div>

            {/* Subscription Plans */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
              
            >
              {subscriptionPlans.map((plan, index) => (
                <Card key={index} className={`relative ${plan.popular ? 'border-blue-500 shadow-lg scale-105' : ''}`}>
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600">
                      {t("pricingsection.mostpopular")}
                    </Badge>
                  )}
                  <CardHeader className="text-center">
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">
                        ${billingPeriod === 'monthly' ? plan.monthlyPrice : Math.floor(plan.annualPrice / 12)}
                      </span>
                      <span className="text-gray-500">/{t("pricingsection./mounth")}</span>
                      {billingPeriod === 'annual' && plan.annualPrice > 0 && (
                        <div className="text-sm text-gray-500">
                          ${plan.annualPrice}/{t("pricingsection./year")}
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      className={`w-full mb-6 ${plan.popular ? 'bg-gradient-to-r from-blue-600 to-purple-600' : ''}`}
                      variant={plan.popular ? 'default' : 'outline'}
                      onClick={() => handlePlanSelect(plan.id)}
                    >
                      {plan.buttonText}
                    </Button>
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <li
                          key={featureIndex}
                          className={`flex items-center gap-2 ${is_rtl ? "flex-row-reverse text-right" : "text-left"}`}
                        >
                          <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm" style={{ direction: isRtl ? "rtl" : "ltr", textAlign: isRtl ? "right" : "left" }} >{feature}</span>
                        </li>
                      ))}
                    </ul>

                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="bundles">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{t("pricingsection.onetimeminute")}</h3>
              <p className="text-gray-600">{t("pricingsection.perfectscaling")}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {minuteBundles.map((bundle, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="text-center">
                    <CardTitle className="text-lg" style={{ direction: isRtl ? "rtl" : "ltr"}}>
                      {bundle.minutes.toLocaleString()} {t("pricingsection.minutes")}
                    </CardTitle>
                    <div className="text-3xl font-bold text-blue-600">
                      ${bundle.price}
                    </div>
                    <div className="text-sm text-gray-500" style={{ direction: isRtl ? "rtl" : "ltr"}}>
                      ${bundle.rate.toFixed(2)} {t("pricingsection.perminute")}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      className="w-full"
                      style={{ direction: isRtl ? "rtl" : "ltr", textAlign: isRtl ? "right" : "left" }}
                      onClick={() => handleBundleSelect(bundle.minutes)}
                    >
                      <Zap className="mr-2 h-4 w-4"  />
                      {t("pricingsection.buynow")}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default PricingSection;
