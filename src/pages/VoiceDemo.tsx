// src/pages/VoiceDemo.tsx
import React from "react";
import App from "@/laOfficeDemo/App"; // this is the AI voice app you copied
import Navigation from '@/components/Navigation';
const VoiceDemo: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            {/* Optional: you can add a small title bar from your main app */}
            <div className="w-full max-w-4xl bg-white shadow-md rounded-xl p-4">
                <h1 className="text-2xl font-semibold mb-4">
                הדגמה של העוזרת הוויטואלית
                </h1>
                <p className="text-gray-700 text-right mb-6 leading-relaxed bg-gray-100 p-3 rounded-lg border border-gray-200">
                  גרסת הדמו כרגע לא עובד על מכשירים סלולרים! רק במחשב.
                  גרסת הדמו אינה מאומנת על שום דאטה סט ואינה מכירה את מבנה עסק, יומן פגישות
                  או נתונים של בתי עסק. במערכת האמיתית יכולות הזיהוי של גבר/אישה,
                  הבנת השיחה והתאמת התשובה מדויקות וחכמות בהרבה. כאן ניתן רק להתנסות
                  בקולות, בדיבור ובחוויית השיחה.
                </p>
                {/* The original la_office App – logic unchanged */}
                <App />
            </div>
        </div>
    </div>
  );
};

export default VoiceDemo;
