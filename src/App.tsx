
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import PartnerDashboard from "./pages/PartnerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import HelpCenter from "./pages/HelpCenter";
import Legal from "./pages/Legal";
import NotFound from "./pages/NotFound";
import Onboarding from "@/pages/Onboarding";
import VoiceDemo from "./pages/VoiceDemo";
import AuthCallback from "./pages/AuthCallback";
import BuyNumber from "./pages/BuyNumber";
import BillingSuccess from "./pages/BillingSuccess";
import BillingCancelled from "./pages/BillingCancelled";
const queryClient = new QueryClient();

const App = () => {
  return(
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/dashboard" element={
              <ProtectedRoute allowedRoles={['user']}>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/partner" element={
              <ProtectedRoute allowedRoles={['partner']}>
                <PartnerDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/signup" element={<Signup />} />
            <Route path="/help" element={<HelpCenter />} />
            <Route path="/legal" element={<Legal />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/buy-number" element={<BuyNumber />} />
            <Route path="/billing/success" element={<BillingSuccess/>}/>
            <Route path="/billing/cancelled" element={<BillingCancelled/>}/>
            <Route
              path="/ai-demo"
              element={
                <ProtectedRoute allowedRoles={['user', 'partner', 'admin']}>
                  <VoiceDemo />
                </ProtectedRoute>
              }
            />
            {/* Catch-all MUST be last */}
            <Route path="*" element={<NotFound />} />
          </Routes>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
  )
};

export default App;
