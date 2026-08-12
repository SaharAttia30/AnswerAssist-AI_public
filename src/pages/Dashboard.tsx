import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import {Phone, Clock, Users, Play, Download, Flag, CreditCard, LogOut, Mic,} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation, useNavigate } from "react-router-dom";
type TwilioCallLog = {
  sid: string;
  dateCreated?: string | null;
  startTime?: string | null;
  status?: string | null;
  duration?: string | null;
  from?: string | null;
  to?: string | null;
  direction?: string | null;
};
const baseUrl =  ""; 

export async function fetchCallLogs(number: string): Promise<TwilioCallLog[]> {
  const res = await fetch(
    `${baseUrl}/api/call-logs?number=${encodeURIComponent(number)}`
  );
  if (!res.ok) {
    throw new Error("Failed to load call logs");
  }
  return res.json();
}

export async function fetchLastThreeIncoming(number: string): Promise<TwilioCallLog[]> {
  const res = await fetch(
    `/api/call-logs-last3?number=${encodeURIComponent(number)}`
  );
  if (!res.ok) throw new Error("Failed to load last incoming calls");
  return res.json();
}
// Format Twilio ISO date into date + time strings
function formatTwilioDateTime(iso: string, isRtl: boolean) {
  const d = new Date(iso);
  const date = d.toLocaleDateString(isRtl ? "he-IL" : "en-US");
  const time = d.toLocaleTimeString(isRtl ? "he-IL" : "en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return { date, time };
}

// Convert duration from "13" seconds to "0:13"
function formatDurationSeconds(secondsStr: string | null | undefined) {
  const total = parseInt(secondsStr ?? "0", 10);
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function NormalizePhoneNumber(input_phone_number){
  let res_phone_number = input_phone_number.replace("+972", "0");
  let prefix_pos = 1;
  if(res_phone_number[1] == 5)
  {
    prefix_pos = 2;
  }
  const mobile_prefix = res_phone_number[prefix_pos];
  const tmp_phone_number = res_phone_number.slice(0, prefix_pos) + mobile_prefix + "-" + res_phone_number.slice(prefix_pos+1);
  res_phone_number = tmp_phone_number;
  return res_phone_number ? res_phone_number : input_phone_number;
}

function NormalizeCallDirection(input_direction : string, is_rtl:boolean){
  if (!is_rtl) return input_direction;
  const map: Record<string, string> = {
    "inbound" : "נכנסת",
    "outbound" : "יוצאת"
  }
  return map[input_direction] || input_direction;
}
// Mock data for demonstration

const mockMinuteBundles = [
  { minutes: 100, price: 80, discount: "20%" },
  { minutes: 500, price: 350, discount: "20%" },
  { minutes: 1000, price: 600, discount: "20%" },
  { minutes: 5000, price: 2500, discount: "20%" },
];

const voiceOptions = [
  { id: "sarah", name: "Professional Sarah", description: "Clear, professional tone", available: true },
  { id: "alex",  name: "Friendly Alex", description: "Warm, approachable voice", available: false },
  { id: "mike",  name: "Confident Mike", description: "Authoritative, trustworthy", available: false },
  { id: "emma",  name: "Energetic Emma", description: "Upbeat, enthusiastic", available: false },
];

const Dashboard = () => {
  // const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated, isVerified } = useAuth();
  const { t, i18n } = useTranslation();
  const { toast } = useToast();            
  const [buyingBundle, setBuyingBundle] = useState<number | null>(null); 
  const [selectedVoice, setSelectedVoice] = useState("sarah");
  const [activeTab, setActiveTab] = useState("overview");
  const [userPlan, setUserPlan] = useState<{ planId: string; minutes: number, twillio_phone_number: string }>({
    planId: "none",
    minutes: 0,
    twillio_phone_number: "none",
  });
  const [userPlanLoading, setUserPlanLoading] = useState<boolean>(true);
  const [callLogs, setCallLogs] = useState<TwilioCallLog[]>([]);
  const [isLoadingCalls, setIsLoadingCalls] = useState(false);
  const [callError, setCallError] = useState<string | null>(null);
  const [hasLoadedCalls, setHasLoadedCalls] = useState(false);
  const [businessName, setBusinessName] = useState("");
  const [business_phonen_umber, setBusinessPhoneNumbert] = useState("");
  const [personal_phone_number, setPersonalPhoneNumber] = useState("");
  const [recentCalls, setRecentCalls] = useState<TwilioCallLog[]>([]);
  const [isLoadingRecent, setIsLoadingRecent] = useState(false);
  const [recentError, setRecentError] = useState<string | null>(null);
  const isRtl = i18n.language === "he";
  const [planLoading, setPlanLoading] = useState<boolean>(true);
  const [planError, setPlanError] = useState<string | null>(null);
  const [planInfo, setPlanInfo] = useState<{
    plan_id: string | null;
    status: string | null;
  } | null>(null);
  const user_discount_on_minutes_due_to_plan = userPlanLoading ? "..." : userPlan.planId === "solo" ? "10%" : userPlan.planId === "business" ? "12%" : userPlan.planId === "enterprise" ? "15%" : "0%"
  const discount_percent = userPlanLoading
  ? 0 : userPlan.planId === "solo" ? 10 : userPlan.planId === "business" ? 12 : userPlan.planId === "enterprise" ? 15 : 0;
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
  const goToSection = (id: string) => {
  if (location.pathname !== "/") {
    navigate("/");
    setTimeout(() => scrollToSection(id), 0);
  } else {
    scrollToSection(id);
  }
};
  const purchaseMinutes = async (bundle: { minutes: number; price: number }) => {
    const discount_amount = (bundle.price * discount_percent) / 100;
    const total_price = bundle.price - discount_amount;
    if (!isAuthenticated || !user) {
      navigate("/login");
      return;
    }
    try {

      setBuyingBundle(bundle.minutes);
      const res = await fetch("/api/top-up-minutes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          minutes: bundle.minutes,
          minutes_price: total_price.toString(),
          userId: user.id,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        throw new Error(data.error || "Failed to start checkout");
      }

      // redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (err) {
      console.error(err);
      toast({
        title: t("userdashboard.minutes_payment_error_title", "Payment error"),
        description: t(
          "userdashboard.minutes_payment_error_desc",
          "Could not start checkout, please try again."
        ),
        variant: "destructive",
      });
    } finally {
      setBuyingBundle(null);
    }
  };

  
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleCheckLogs = useCallback(async () => {
    try {
      setIsLoadingCalls(true);
      setCallError(null);

      const data = await fetchCallLogs(userPlan.twillio_phone_number);

      setCallLogs(data);
      setHasLoadedCalls(true);
    } catch (e) {
      console.error(e);
      setCallError("Failed to load call logs");
    } finally {
      setIsLoadingCalls(false);
    }
  }, [userPlan.twillio_phone_number]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
      return;
    }

    if (!isVerified) {
      navigate("/login", { replace: true });
      return;
    }

    if (user && !user.phone) {
      navigate("/onboarding", { replace: true });
    }
  }, [isAuthenticated, isVerified, user, navigate]);
 
 useEffect(() => {
    const loadBusinessNameFromAuth = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching auth user:", error.message);
        return;
      }
      setBusinessName(data.user?.user_metadata?.business_name ?? "");
      setBusinessPhoneNumbert(data.user?.user_metadata?.business_phone ?? "");
      setPersonalPhoneNumber(data.user?.user_metadata?.phone ?? "");
    };

    loadBusinessNameFromAuth();
  }, []);

  useEffect(() => {
    if (!user?.id) return;

    const loadUserPlan = async () => {
      setUserPlanLoading(true);

      const { data, error } = await supabase
        .from("user_plans")
        .select("plan_id, minutes, twillio_phone_number")
        .eq("user_id", user.id)
        .single();

      if (error || !data) {
        console.error("loadUserPlan error:", error?.message);
        setUserPlan({ planId: "none", minutes: 0, twillio_phone_number: "none"});
        setUserPlanLoading(false);
        return;
      }

      setUserPlan({
        planId: data.plan_id ?? "none",
        minutes: data.minutes ?? 0,
        twillio_phone_number: data.twillio_phone_number ?? "none"
      });

      setUserPlanLoading(false);
    };

    loadUserPlan();
  }, [user?.id]);

  useEffect(() => {
    if (activeTab === "calls" && !hasLoadedCalls && !isLoadingCalls) {
      handleCheckLogs();
    }
  }, [activeTab, hasLoadedCalls, isLoadingCalls, handleCheckLogs]);

  useEffect(() => {
    const loadRecentCalls = async () => {
      try {
        setIsLoadingRecent(true);
        setRecentError(null);
        const data = await fetchLastThreeIncoming(userPlan.twillio_phone_number);
        setRecentCalls(data);
      } catch (e) {
        console.error(e);
        setRecentError("Failed to load recent calls");
      } finally {
        setIsLoadingRecent(false);
      }
    };

    loadRecentCalls();
  }, [userPlan.twillio_phone_number]);

  useEffect(() => {
  // no user yet
    if (!user?.id) {
      setPlanInfo(null);
      setPlanLoading(false);
      return;
    }

    const fetchPlan = async () => {
      setPlanLoading(true);
      setPlanError(null);

      const { data, error } = await supabase
        .from("user_plans")
        .select("plan_id, status")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error loading user plan:", error.message);
        setPlanError(error.message);
        setPlanInfo(null);
      } else {
        // data can be null if the row does not exist yet
        setPlanInfo(
          data
            ? {
                plan_id: data.plan_id as string | null,
                status: data.status as string | null,
              }
            : null
        );
      }

      setPlanLoading(false);
    };

    fetchPlan();
  }, [user?.id]);

  if (!isAuthenticated || !isVerified) {
    return null;
  }

  const getStatusLabel = (status: string) => {
    if (!isRtl) return status;

    const map: Record<string, string> = {
      "no-answer": "לא נענה",
      "busy": "עסוק",
      "completed": "הושלם",
      "transferred": "הועבר",
      "flagged": "מסומן",
      "failed": "נכשל",
    };

    return map[status] || status;
  };

  const toggleLanguage = () => {
    const next = i18n.language === "he" ? "en" : "he";
    i18n.changeLanguage(next);
    document.documentElement.lang = next;
    document.documentElement.dir = next === "he" ? "rtl" : "ltr";
    localStorage.setItem("lang", next);
  };

  const getDiscountedPrice = (price: number) => {
    const discountAmount = (price * discount_percent) / 100;
    return price - discountAmount;
  };

  const getPlanName = (plan: string) => {
    if (!isRtl) {
      if (plan === "none") {
        return "inactive";
      }
      return plan;
    }

    const map: Record<string, string> = {
      none: "אין מנוי",
      trial: "ניסיון",
      solo: "עצמאי",
      business: "עסקי",
      enterprise: "ארגון",
    };

    return map[plan] || plan;
  };

  const playVoiceSample = (voiceId: string) => {
    console.log(`Playing sample for voice: ${voiceId}`);
  };

  const flagCall = (callId: string) => {
    console.log(`Flagging call: ${callId}`);
  };

  return (
    <div
      className={`min-h-screen bg-gray-50 ${isRtl ? "text-right" : "text-left"}`}
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div
              className="flex items-center gap-4 cursor-pointer"
              onClick={() => navigate("/")}
            >
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Phone className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {t("BusinessName")}
                </h1>
                <p className="text-sm text-gray-600">
                  {t("userdashboard.welcome")}, {user?.name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Badge variant="default">
                {userPlanLoading ? "..." : getPlanName(userPlan.planId)}
              </Badge>

              <Button
                variant="ghost"
                size="sm"
                className={isRtl ? "flex flex-row-reverse items-center" : "flex items-center"}
                onClick={handleLogout}
              >
                <LogOut className={`h-4 w-4 ${isRtl ? "ml-2" : "mr-2"}`} />
                <span>{t("userdashboard.logout")}</span>
              </Button>

              <Button variant="outline" size="sm" type="button" onClick={toggleLanguage}>
                {i18n.language === "he" ? "English" : "עברית"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className={`flex w-full ${isRtl ? "justify-end" : "justify-start"}`}>
            <TabsList
              className={`inline-flex gap-2 ${isRtl ? "flex-row-reverse" : "flex-row"}`}
            >
              <TabsTrigger value="overview">
                {t("userdashboard.tabs_overview")}
              </TabsTrigger>
              <TabsTrigger value="calls">
                {t("userdashboard.tabs_calls")}
              </TabsTrigger>
              <TabsTrigger value="voice">
                {t("userdashboard.tabs_voice")}
              </TabsTrigger>
              <TabsTrigger value="minutes">
                {t("userdashboard.tabs_minutes")}
              </TabsTrigger>
              <TabsTrigger
                value="ai-settings"
                style={{
                  direction: isRtl ? "rtl" : "ltr",
                  textAlign: isRtl ? "right" : "left",
                }}
              >
                {t("userdashboard.tabs_ai_settings")}
              </TabsTrigger>
              <TabsTrigger value="account">
                {t("userdashboard.tabs_account")}
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Overview Tab */}
          <TabsContent
            value="overview"
            className={`space-y-6 ${isRtl ? "text-right" : "text-left"}`}
          >
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Status */}
              <Card className={`p-6 ${isRtl ? "lg:order-4" : "lg:order-1"}`}>
                <div className={`flex items-center gap-3 ${isRtl ? "flex-row-reverse" : ""}`}>
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Phone className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className={isRtl ? "text-right" : "text-left"}>
                    <p className="text-sm text-gray-600">
                      {t("userdashboard.status_label")}
                    </p>
                    <p className="text-lg font-semibold">
                      {userPlanLoading ? "..." : userPlan.planId === "none"
                        ? t("userdashboard.status_inactive")
                        : t("userdashboard.status_active")}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Minutes */}
              <Card className={`p-6 ${isRtl ? "lg:order-3" : "lg:order-2"}`}>
                <div className={`flex items-center gap-3 ${isRtl ? "flex-row-reverse" : ""}`}>
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Clock className="h-5 w-5 text-green-600" />
                  </div>
                  <div className={isRtl ? "text-right" : "text-left"}>
                    <p className="text-sm text-gray-600">
                      {t("userdashboard.minutes_left_label")}
                    </p>
                    <p className="text-lg font-semibold">
                      {userPlanLoading ? "..." : userPlan.minutes.toLocaleString()}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Voice */}
              <Card className={`p-6 ${isRtl ? "lg:order-2" : "lg:order-3"}`}>
                <div className={`flex items-center gap-3 ${isRtl ? "flex-row-reverse" : ""}`}>
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <Mic className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className={isRtl ? "text-right" : "text-left"}>
                    <p className="text-sm text-gray-600">
                      {t("userdashboard.voice_label")}
                    </p>
                    <p className="text-lg font-semibold">Professional Sarah</p>
                  </div>
                </div>
              </Card>

              {/* Phone number */}
              <Card className={`p-6 ${isRtl ? "lg:order-1" : "lg:order-4"}`}>
                <div className={`flex items-center gap-3 ${isRtl ? "flex-row-reverse" : ""}`}>
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <Users className="h-5 w-5 text-orange-600" />
                  </div>
                  <div className={isRtl ? "text-right" : "text-left"}>
                    <p className="text-sm text-gray-600">
                      {t("userdashboard.phone_number_label")}
                    </p>

                    {userPlanLoading ? (
                      <p className="text-lg font-semibold">...</p>
                    ) : !userPlan.twillio_phone_number ||
                      userPlan.twillio_phone_number === "none" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate("/buy-number")}
                      >
                        {t("userdashboard.account_buy_twillio_phone_number")}
                      </Button>
                    ) : (
                      <p className="text-lg font-semibold">
                        {NormalizePhoneNumber(userPlan.twillio_phone_number)}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            </div>

            {/* Recent Calls - Real past 3 incoming calls from call-logs-last3.js */}
            <Card className="p-6">
              <h3
                className={`text-lg font-semibold mb-4 ${
                  isRtl ? "text-right" : "text-left"
                }`}
              >
                {t("userdashboard.recent_calls_title")}
              </h3>

              {recentError && (
                <p className="text-red-500 text-sm mb-2">
                  {recentError}
                </p>
              )}

              {isLoadingRecent && (
                <p
                  className="text-gray-500 text-sm"
                  style={{
                    direction: isRtl ? "rtl" : "ltr",
                    textAlign: isRtl ? "right" : "left",
                  }}
                >
                  {t("userdashboard.loadingcalllogs_button")}
                </p>
              )}

              {!isLoadingRecent && recentCalls.length === 0 && !recentError && (
                <p
                  className="text-gray-500 text-sm"
                  style={{
                    direction: isRtl ? "rtl" : "ltr",
                    textAlign: isRtl ? "right" : "left",
                  }}
                >
                  {t("userdashboard.Nocallsfoundyet")}
                </p>
              )}

              {!isLoadingRecent && recentCalls.length > 0 && (
                <div className="space-y-3">
                  {recentCalls.map((call) => {
                    const { date, time } = formatTwilioDateTime(
                      call.startTime || call.dateCreated,
                      isRtl
                    );
                    const duration = formatDurationSeconds(call.duration);

                    return (
                      <div
                        key={call.sid}
                        className={`flex items-center justify-between p-3 bg-gray-50 rounded-lg ${
                          isRtl ? "flex-row-reverse" : ""
                        }`}
                      >
                        <div
                          className={`flex flex-col gap-1 ${
                            isRtl ? "items-end text-right" : "items-start text-left"
                          }`}
                        >
                          {/* date + time + status */}
                          <div
                            className={`flex items-center gap-2 ${
                              isRtl ? "flex-row-reverse" : ""
                            }`}
                          >
                            <span className="font-medium text-sm">
                              {isRtl ? (
                                <>
                                  <span dir="ltr">{time}</span>{" "}
                                  {t("userdashboard.call_history_timeat")}{" "}
                                  <span dir="ltr">{date}</span>
                                </>
                              ) : (
                                <>
                                  <span>{date}</span>{" "}
                                  {t("userdashboard.call_history_timeat")}{" "}
                                  <span>{time}</span>
                                </>
                              )}
                            </span>
                            {call.status && (
                              <Badge
                                variant={
                                  call.status === "completed"
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {getStatusLabel(call.status)}
                              </Badge>
                            )}
                          </div>

                          {/* duration */}
                          <p className="text-xs text-gray-600">
                            {t("userdashboard.call_duration_label")}{" "}
                            {duration}
                          </p>

                          {/* From / To, same RTL trick as logs */}
                          <p
                            className={`text-xs text-gray-600 flex ${
                              isRtl ? "flex-row-reverse" : ""
                            }`}
                          >
                            <span
                              className="font-medium"
                              style={{
                                direction: isRtl ? "rtl" : "ltr",
                                textAlign: isRtl ? "right" : "left",
                              }}
                            >
                              {t("userdashboard.from_label")}{" "}
                            </span>
                            <span
                              dir="ltr"
                              className={`${isRtl ? "mr-1" : "ml-1"}`}
                            >
                              {call.from
                                ? NormalizePhoneNumber(call.from)
                                : ""}
                            </span>
                          </p>

                          <p
                            className={`text-xs text-gray-600 flex ${
                              isRtl ? "flex-row-reverse" : ""
                            }`}
                          >
                            <span
                              className="font-medium"
                              style={{
                                direction: isRtl ? "rtl" : "ltr",
                                textAlign: isRtl ? "right" : "left",
                              }}
                            >
                              {t("userdashboard.to_label")}{" "}
                            </span>
                            <span
                              dir="ltr"
                              className={`${isRtl ? "mr-1" : "ml-1"}`}
                            >
                              {call.to ? NormalizePhoneNumber(call.to) : ""}
                            </span>
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Call Logs Tab */}
          <TabsContent
            value="calls"
            className={`space-y-6 ${isRtl ? "text-right" : "text-left"}`}
          >
            <Card className="p-6">
              {/* Header row */}
              <div
                className={`flex items-center mb-6 ${
                  isRtl ? "flex-row-reverse" : "justify-between"
                }`}
              >
                <h3 className="text-lg font-semibold">
                  {t("userdashboard.call_history_title")}
                </h3>

                <div
                  className={`flex gap-2 ${
                    isRtl ? "mr-auto flex-row-reverse" : "ml-auto"
                  }`}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCheckLogs}
                    disabled={isLoadingCalls}
                    style={{ direction: isRtl ? "rtl" : "ltr", textAlign: isRtl ? "right" : "left" }}
                  >
                    {isLoadingCalls ? t("userdashboard.loading_button") : t("userdashboard.refresh_button")}
                  </Button>
                  <Button variant="outline" size="sm">
                    {t("userdashboard.call_history_filter")}
                  </Button>
                  <Button variant="outline" size="sm">
                    {t("userdashboard.call_history_export")}
                  </Button>
                </div>
              </div>

              {/* Call list */}
              {callError && (
                <p className="text-red-500 mb-4">
                  {callError}
                </p>
              )}

              {isLoadingCalls && (
                <p className="text-gray-500" style={{ direction: isRtl ? "rtl" : "ltr", textAlign: isRtl ? "right" : "left" }}>
                  {t("userdashboard.loadingcalllogs_button")}
                </p>
              )}

              {!isLoadingCalls && callLogs.length === 0 && !callError && (
                <p className="text-gray-500" style={{ direction: isRtl ? "rtl" : "ltr", textAlign: isRtl ? "right" : "left" }}>
                  {t("userdashboard.Nocallsfoundyet")}
                </p>
              )}

              {!isLoadingCalls && callLogs.length > 0 && (
                <div className="space-y-4">
                  {callLogs.map((call: TwilioCallLog) => {
                    const { date, time } = formatTwilioDateTime(
                      call.startTime || call.dateCreated,
                      isRtl
                    );
                    const duration = formatDurationSeconds(call.duration);

                    return (
                      <div
                        key={call.sid}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div
                          className={`flex items-center justify-between ${
                            isRtl ? "flex-row-reverse" : ""
                          }`}
                        >
                          {/* Call details */}
                          <div
                            className={`space-y-1 ${isRtl ? "text-right" : "text-left"}`}>
                            <div className={`flex items-center gap-3 ${isRtl ? "flex-row-reverse" : ""}`}>
                              <span className="font-medium">
                                {isRtl ? (
                                  <>
                                    <span dir="ltr">{time}</span>{" "}
                                    {t("userdashboard.call_history_timeat")}{" "}
                                    <span dir="ltr">{date}</span>
                                  </>
                                ) : (
                                  <>
                                    <span>{date}</span>{" "}
                                    {t("userdashboard.call_history_timeat")}{" "}
                                    <span>{time}</span>
                                  </>
                                )}
                              </span>
                              <Badge
                                variant={
                                  call.status === "completed"
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {getStatusLabel(call.status)}
                              </Badge>
                            </div>

                            <p className="text-sm text-gray-600">
                              {t("userdashboard.call_duration_label")}{" "}
                              {duration}
                            </p>

                            <p className={`text-sm text-gray-600 flex ${isRtl ? "flex-row-reverse" : ""}`}>
                              <span className="font-medium" style={{ direction: isRtl ? "rtl" : "ltr", textAlign: isRtl ? "right" : "left" }}>
                                {t("userdashboard.from_label")}{" "}
                              </span>
                              <span dir="ltr" className={`${isRtl ? "mr-1" : "ml-1"}`}>
                                {NormalizePhoneNumber(call.from)}
                              </span>
                            </p>

                            <p className={`text-sm text-gray-600 flex ${isRtl ? "flex-row-reverse" : ""}`}>
                              <span className="font-medium" style={{ direction: isRtl ? "rtl" : "ltr", textAlign: isRtl ? "right" : "left" }}>
                                {t("userdashboard.to_label")}{" "}
                              </span>
                              <span dir="ltr" className={`${isRtl ? "mr-1" : "ml-1"}`}>{NormalizePhoneNumber(call.to)}</span>
                            </p>

                            <p className={`text-sm text-gray-600 ${isRtl ? "flex-row-reverse" : ""}`}>
                              <span className="font-medium" style={{ direction: isRtl ? "rtl" : "ltr", textAlign: isRtl ? "right" : "left" }}>
                                {t("userdashboard.calldirection")}
                              </span>
                              <span className={`${isRtl ? "mr-1" : "ml-1"}`}>{NormalizeCallDirection(call.direction, isRtl)}</span>
                            </p>
                          </div>

                          {/* Action buttons */}
                          <div
                            className={`flex items-center gap-2 ${
                              isRtl ? "flex-row-reverse" : ""
                            }`}
                          >
                            <Button variant="outline" size="sm">
                              <Play
                                className={`h-4 w-4 ${
                                  isRtl ? "ml-1" : "mr-1"
                                }`}
                              />
                              {t("userdashboard.call_play_button")}
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download
                                className={`h-4 w-4 ${
                                  isRtl ? "ml-1" : "mr-1"
                                }`}
                              />
                              {t("userdashboard.call_download_button")}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => flagCall(call.sid)}
                            >
                              <Flag
                                className={`h-4 w-4 ${
                                  isRtl ? "ml-1" : "mr-1"
                                }`}
                              />
                              {t("userdashboard.call_flag_button")}
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Voice Tab */}
          <TabsContent
            value="voice"
            className={`space-y-6 ${isRtl ? "text-right" : "text-left"}`}
          >
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-6">
                {t("userdashboard.voice_config_title")}
              </h3>

              <div className="space-y-6">
                {Array.from({
                  length: Math.ceil(voiceOptions.length / 2),
                }).map((_, rowIndex) => {
                  const rowVoices = voiceOptions.slice(
                    rowIndex * 2,
                    rowIndex * 2 + 2
                  );

                  return (
                    <div
                      key={rowIndex}
                      className={`flex flex-col md:flex-row gap-6 ${
                        isRtl ? "md:flex-row-reverse" : ""
                      }`}
                    >
                      {rowVoices.map((voice) => {
                        const isAvailable = voice.available;

                        return (
                          <div
                            key={voice.id}
                            className={`flex-1 border-2 rounded-lg p-4 transition-colors ${
                              isAvailable
                                ? selectedVoice === voice.id
                                  ? "border-blue-500 bg-blue-50 cursor-pointer"
                                  : "border-gray-200 hover:border-gray-300 cursor-pointer"
                                : "border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed"
                            }`}
                            onClick={
                              isAvailable
                                ? () => setSelectedVoice(voice.id)
                                : undefined
                            }
                          >
                            <div
                              className={`flex items-center justify-between mb-3 ${
                                isRtl ? "flex-row-reverse" : ""
                              }`}
                            >
                              <h4 className="font-medium">{voice.name}</h4>

                              <Button
                                variant="outline"
                                size="sm"
                                disabled={!isAvailable}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (!isAvailable) return;
                                  playVoiceSample(voice.id);
                                }}
                              >
                                <Play className={`h-3 w-3 ${isRtl ? "ml-1" : "mr-1"}`} />
                                {isAvailable
                                  ? t("userdashboard.voice_preview_button")
                                  : "Coming soon"}
                              </Button>
                            </div>

                            <p className="text-sm text-gray-600">
                              {voice.description}
                            </p>

                            {!isAvailable && (
                              <p className="mt-2 text-xs text-orange-600">
                                Coming soon
                              </p>
                            )}
                          </div>
                        );
                      })}

                    </div>
                  );
                })}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <Button className="w-full sm:w-auto">
                  {t("userdashboard.voice_save_button")}
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* Minutes Tab */}
          <TabsContent
            value="minutes"
            className={`space-y-6 ${isRtl ? "text-right" : "text-left"}`}
          >
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-6">
                {t("userdashboard.minutes_title")}
              </h3>

              <div className="mb-6">
                <div
                  className={`bg-blue-50 border border-blue-200 rounded-lg p-4 ${
                    isRtl ? "text-right" : "text-left"
                  }`}
                >
                  <p className="text-sm text-blue-800">
                    <strong>
                      {t("userdashboard.minutes_current_balance_label")}
                    </strong>{" "}
                    {userPlanLoading
                      ? "..."
                      : userPlan.minutes.toLocaleString()}{" "}
                    {t("userdashboard.minutes_current_balance_suffix")}
                  </p>
                  <p className="text-sm text-blue-700 mt-1">
                    {t("userdashboard.minutes_discount_text_your")}{" "}
                    {userPlanLoading ? "..." : getPlanName(userPlan.planId)}{" "}
                    {t("userdashboard.minutes_discount_text_planinclude")}{" "}
                    {userPlanLoading ? "..." : user_discount_on_minutes_due_to_plan}{" "}
                    {t("userdashboard.minutes_discount_text_dicounton")}
                  </p>
                </div>
              </div>

              <div
                className={`flex grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${
                  isRtl ? "md:flex-row-reverse" : ""
                }`}
              >
                {mockMinuteBundles.map((bundle, index) => (
                  <div
                    key={index}
                    className="w-full md:w-1/2 lg:w-1/4 border border-gray-200 rounded-lg p-6 text-center"
                  >
                    <div className="text-2xl font-bold text-gray-900 mb-2">
                      {bundle.minutes.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600 mb-1">
                      {t("userdashboard.minutes_card_minutes_label")}
                    </div>
                    <div className="text-3xl font-bold text-blue-600 mb-1">
                      ${bundle.price.toLocaleString()}
                    </div>
                    <div
                      className="text-sm text-green-600 mb-4"
                      style={{ direction: isRtl ? "rtl" : "ltr" }}
                    >
                      {userPlanLoading ? "..." : user_discount_on_minutes_due_to_plan}{" "}
                      {t("userdashboard.minutes_card_discount_suffix")}
                    </div>
                    <div
                      className="text-sm text-gray-700"
                      style={{ direction: isRtl ? "rtl" : "ltr" }}
                    >
                      {t("userdashboard.minutes_total_after_discount", "Total after discount")}{" "}
                      <span className="font-semibold">
                        ${userPlanLoading ? "..." : getDiscountedPrice(bundle.price).toFixed(2)}
                      </span>
                    </div>
                    <Button
                      className="w-full"
                      onClick={() => purchaseMinutes(bundle)}
                      disabled={buyingBundle === bundle.minutes}
                    >
                      <CreditCard className={`h-4 w-4 ${isRtl ? "ml-2" : "mr-2"}`} />
                      {buyingBundle === bundle.minutes
                        ? t("userdashboard.minutes_processing_button", "Processing...")
                        : t("userdashboard.minutes_purchase_button")}
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* AI Settings Tab */}
          <TabsContent
            value="ai-settings"
            className={`space-y-6 ${isRtl ? "text-right" : "text-left"}`}
          >
            <Card className="p-6">
              <h3
                className="text-lg font-semibold mb-6"
                style={{
                  direction: isRtl ? "rtl" : "ltr",
                  textAlign: isRtl ? "right" : "left",
                }}
              >
                {t("userdashboard.ai_config_title")}
              </h3>

              <div className="space-y-6">
                {/* Company Information */}
                <div>
                  <h4
                    className={`font-medium mb-4 ${
                      isRtl ? "text-right" : "text-left"
                    }`}
                  >
                    {t("userdashboard.company_info_title")}
                  </h4>

                  <div
                    className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${
                      isRtl ? "md:[direction:rtl]" : "md:[direction:ltr]"
                    }`}
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t("userdashboard.business_name_label")}
                      </label>
                      <input
                        type="text"
                        className={`w-full p-2 border border-gray-300 rounded-lg ${isRtl ? "text-right" : "text-left"}`}
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t("userdashboard.service_type_label")}
                      </label>
                      <select
                        className={`w-full p-2 border border-gray-300 rounded-lg ${
                          isRtl ? "text-right" : "text-left"
                        }`}
                      >
                        <option>
                          {t("userdashboard.service_type_plumbing")}
                        </option>
                        <option>
                          {t("userdashboard.service_type_electrical")}
                        </option>
                        <option>
                          {t("userdashboard.service_type_hvac")}
                        </option>
                        <option>
                          {t("userdashboard.service_type_locksmith")}
                        </option>
                        <option>
                          {t("userdashboard.service_type_other")}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* AI Personality */}
                <div>
                  <h4 className="font-medium mb-4" style={{ direction: isRtl ? "rtl" : "ltr", textAlign: isRtl ? "right" : "left", }}>
                    {t("userdashboard.ai_personality_title")}
                  </h4>

                  <div
                    className={`
                      grid grid-cols-1 md:grid-cols-3 gap-4
                      ${
                        isRtl
                          ? "md:justify-items-end text-right"
                          : "md:justify-items-start text-left"
                      }
                    `}
                  >
                    <label className={`flex items-center gap-2 ${isRtl ? "flex-row-reverse lg:order-3" : "lg:order-1"}`} >
                      <input type="radio" name="personality" value="professional"/>
                      <span>
                        {t("userdashboard.ai_personality_professional")}
                      </span>
                    </label>

                    <label className={`flex items-center gap-2 ${isRtl ? "flex-row-reverse lg:order-2" : "lg:order-2"}`}>
                      <input type="radio" name="personality" value="friendly" />
                      <span>
                        {t("userdashboard.ai_personality_friendly")}
                      </span>
                    </label>

                    <label className={`flex items-center gap-2 ${isRtl ? "flex-row-reverse lg:order-1" : "lg:order-3"}`}>
                      <input type="radio" name="personality" value="energetic" />
                      <span>{t("userdashboard.ai_personality_energetic")}</span>
                    </label>
                  </div>
                </div>

                {/* Call Handling */}
                <div>
                  <h4 className="font-medium mb-4">
                    {t("userdashboard.call_handling_title")}
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label
                        className="block text-sm font-medium text-gray-700 mb-2"
                        style={{
                          direction: isRtl ? "rtl" : "ltr",
                          textAlign: isRtl ? "right" : "left",
                        }}
                      >
                        {t("userdashboard.call_handling_booking_label")}
                      </label>
                      <textarea
                        className={`w-full p-2 border border-gray-300 rounded-lg ${
                          isRtl ? "text-right" : "text-left"
                        }`}
                        style={{
                          direction: isRtl ? "rtl" : "ltr",
                          textAlign: isRtl ? "right" : "left",
                        }}
                        rows={3}
                        placeholder={t(
                          "userdashboard.call_handling_booking_placeholder"
                        )}
                      />
                    </div>

                    <div>
                      <label
                        className="block text-sm font-medium text-gray-700 mb-2"
                        style={{
                          direction: isRtl ? "rtl" : "ltr",
                          textAlign: isRtl ? "right" : "left",
                        }}
                      >
                        {t("userdashboard.call_handling_booking_placeholder")}
                      </label>
                      <textarea className={`w-full p-2 border border-gray-300 rounded-lg ${isRtl ? "text-right" : "text-left"}`}
                        rows={3}
                        style={{direction: isRtl ? "rtl" : "ltr", textAlign: isRtl ? "right" : "left",}}
                        placeholder={t("userdashboard.call_handling_urgent_placeholder")}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200" style={{
                    direction: isRtl ? "rtl" : "ltr",
                    textAlign: isRtl ? "right" : "left",
                  }}
                >
                  <Button>{t("userdashboard.ai_settings_save_button")}</Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Account Tab */}
          <TabsContent
            value="account"
            className={`space-y-6 ${isRtl ? "text-right" : "text-left"}`}
          >
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-6">
                {t("userdashboard.account_settings_title")}
              </h3>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className={isRtl ? "md:order-2" : ""}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("userdashboard.account_email_label")}
                    </label>
                    <input type="email" value={user?.email} className="w-full p-2 border border-gray-300 rounded-lg" readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("userdashboard.account_phone_numbers_label")}
                    </label>
                    <div className="space-y-2">
                      <input type="tel" className="w-full p-2 border border-gray-300 rounded-lg"
                        value={NormalizePhoneNumber(business_phonen_umber)}
                      />
                      <input type="tel" className="w-full p-2 border border-gray-300 rounded-lg"
                        value={NormalizePhoneNumber(personal_phone_number)}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-4">
                    {t("userdashboard.subscription_management_title")}
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div
                      className={`flex items-center justify-between ${
                        isRtl ? "flex-row-reverse" : ""
                      }`}
                    >
                      <div className={isRtl ? "text-right" : "text-left"}>
                        <p className="font-medium">
                          {t(
                            "userdashboard.subscription_current_plan_label"
                          )}{" "}
                          {userPlanLoading ? "..." : getPlanName(userPlan.planId)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {t("userdashboard.subscription_next_billing_label")}{" "}
                          {t("userdashboard.subscription_next_billing_value")}
                        </p>
                      </div>
                      <div
                        className={`flex gap-2 ${
                          isRtl ? "flex-row-reverse" : ""
                        }`}
                      >
                        <Button variant="outline" onClick={() => goToSection("pricing")}>
                          {t(
                            "userdashboard.subscription_change_plan_button"
                          )}
                        </Button>
                        <Button variant="outline">
                          {t("userdashboard.subscription_manage_billing_button")}
                        </Button>
                        <Button variant="outline" onClick={() => navigate('/buy-number')}>
                          {t("userdashboard.account_buy_twillio_phone_number")}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className={`pt-6 border-t border-gray-200 ${
                    isRtl ? "md:flex flex-row-reverse" : ""
                  }`}
                >
                  <Button className={isRtl ? "ml-4" : "mr-4"}>
                    {t("userdashboard.account_update_button")}
                  </Button>
                  <Button variant="outline">
                    {t("userdashboard.account_change_password_button")}
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
