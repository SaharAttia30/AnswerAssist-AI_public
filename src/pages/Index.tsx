
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import PricingSection from '@/components/PricingSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import HelpSection from '@/components/HelpSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "react-router-dom";

function getCheckoutStatus(): string | null {
  if (window.location.search) {
    const params = new URLSearchParams(window.location.search);
    const v = params.get("checkout");
    if (v) return v;
  }
  if (window.location.hash) {
    const hash = window.location.hash;           // "#pricing?checkout=cancel"
    const queryString = hash.split("?")[1] || ""; // "checkout=cancel"
    const params = new URLSearchParams(queryString);
    const v = params.get("checkout");
    if (v) return v;
  }

  return null;
}
const Index = () => {
  const location = useLocation();
  const {toast} = useToast();
  useEffect(() => {
    const status = getCheckoutStatus();
    if (status === "cancel") {
      toast({
        title: "Payment Cancelled",
        description: "You can choose a plan again whenever you're ready",
        variant: "destructive",
      });
    }
    else if(status === "success"){
      toast({
        title: "Payment Successfull",
        description: "Thank you for your purchase, the data is updated to you account",
        variant: "success",
      });
    }
  }, [location.search, location.hash, toast]); // run when route changes

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PricingSection />
      <HelpSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
