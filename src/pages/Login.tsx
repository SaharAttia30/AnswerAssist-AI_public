import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth, signInWithGoogle } from '@/contexts/AuthContext';
import { Phone, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from "react-i18next";
import Navigation from '@/components/Navigation';

const Login = () => {
  const { t, i18n } = useTranslation();
    const isRtl = i18n.language === "he";

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const success = await login(email, password);
    if (success) {
      toast({
        title: t("Login.loginseccesful"),
        description: t("Login.welcomeback"),
      });
      navigate('/dashboard');
    } else {
      toast({
        title: t("Login.loginfailed"),
        description: t("Login.faileddescription"),
        variant: 'destructive',
      });
    }
    setIsLoading(false);
  };
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-lg">
                <Phone className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl">{t("Login.title")}</CardTitle>
            <CardDescription>{t("Login.description")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className={`space-y-2 ${isRtl ? "text-right" : "text-left"}`}>
                <label htmlFor="email" className="text-sm font-medium">
                  {t("Login.email_title")}
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("Login.email_placeholder")}
                  required
                  className={isRtl ? "text-right" : "text-left"}
                />
              </div>

              <div className={`space-y-2 ${isRtl ? "text-right" : "text-left"}`}>
                <label htmlFor="password" className="text-sm font-medium">
                  {t("Login.password_title")}
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t("Login.password_placeholder")}
                    required
                    className={isRtl ? "text-right" : "text-left"}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className={`absolute top-0 h-full px-3 py-2 hover:bg-transparent ${
                      isRtl ? "left-0" : "right-0"
                    }`}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? t("Login.button_loading") : t("Login.button")}
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
          </CardContent>

        </Card>
      </div>
    </div>
  );
};

export default Login;
