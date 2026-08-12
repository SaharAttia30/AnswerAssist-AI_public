import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navigation from '@/components/Navigation';
import { useTranslation } from "react-i18next";
import { useAuth, signInWithGoogle } from '@/contexts/AuthContext';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserPlus, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Signup = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "he"; 
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toast({
        title: t("signup.toast_name_required_title"),
        description: t("signup.toast_name_required_desc"),
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: t("signup.toast_password_mismatch_title"),
        description: t("signup.toast_password_mismatch_desc"),
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const success = await register(fullName, email, password);

      if (success) {
        toast({
          title: t("signup.toast_success_title"),
          description: t("signup.toast_success_desc"),
        });
        navigate("/login");
      } else {
        toast({
          title: t("signup.toast_fail_title"),
          description: t("signup.toast_fail_desc"),
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: t("signup.toast_error_title"),
        description: t("signup.toast_error_desc"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    
    <div className="min-h-screen bg-white">
      <Navigation />

      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-lg">
                <UserPlus className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl">{t("signup.title")}</CardTitle>
            <CardDescription>{t("signup.subtitle")}</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Full Name */}
              <div className={`space-y-2 ${isRtl ? "text-right" : "text-left"}`}>
                <label htmlFor="fullName" className="text-sm font-medium">
                  {t("signup.fullname_label")}
                </label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={t("signup.fullname_placeholder")}
                  required
                />
              </div>

              {/* Email */}
              <div className={`space-y-2 ${isRtl ? "text-right" : "text-left"}`}>
                <label htmlFor="email" className="text-sm font-medium">
                  {t("signup.email_label")}
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("signup.email_placeholder")}
                  required
                />
              </div>

              {/* Password */}
              <div className={`space-y-2 ${isRtl ? "text-right" : "text-left"}`}>
                <label htmlFor="password" className="text-sm font-medium">
                  {t("signup.password_label")}
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t("signup.password_placeholder")}
                    required
                    className={isRtl ? "text-right" : "text-left"}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className={`absolute top-0 h-full px-3 py-2 hover:bg-transparent ${isRtl ? "left-0" : "right-0"}`}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className={`space-y-2 ${isRtl ? "text-right" : "text-left"}`}>
                <label htmlFor="confirmPassword" className="text-sm font-medium">
                  {t("signup.confirm_password_label")}
                </label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder={t("signup.confirm_password_placeholder")}
                    required
                    className={isRtl ? "text-right" : "text-left"}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className={`absolute top-0 h-full px-3 py-2 hover:bg-transparent ${isRtl ? "left-0" : "right-0"}`}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? t("signup.button_loading"): t("signup.button_submit")}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
                onClick={signInWithGoogle}
              >
                <img
                  src="https://www.svgrepo.com/show/355037/google.svg"
                  alt="Google"
                  className="w-4 h-4"
                />
                {t("Login.loginwithgoogle")}
              </Button>
            </form>

            <p className="text-sm text-gray-600 text-center">
              {t("signup.already_have_account")}{" "}
              <Link to="/login" className="text-blue-600 hover:underline">
                {t("signup.signin_link")}
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
