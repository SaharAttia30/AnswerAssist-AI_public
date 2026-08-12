import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const run = async () => {
      try {
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
        }
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          navigate("/dashboard", { replace: true });
        } else {
          navigate("/login", { replace: true });
        }
      } catch (err) {
        console.error("OAuth callback error:", err);
        navigate("/login", { replace: true });
      }
    };
    run();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div>Completing sign in...</div>
    </div>
  );
}
