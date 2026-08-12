// src/pages/BillingSuccess.tsx
import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const BillingSuccess = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    toast({
      title: "Payment successful",
      description: "Your plan will be updated in a moment.",
    });

    const timeout = setTimeout(() => {
      navigate("/dashboard");
    }, 2000);

    return () => clearTimeout(timeout);
  }, [navigate, toast, params, user]);

  return <p className="p-4">Processing your payment...</p>;
};

export default BillingSuccess;
