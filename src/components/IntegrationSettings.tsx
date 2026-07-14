import React, { useState, useEffect } from "react";
import { Settings, Save, AlertTriangle, ShieldCheck, RefreshCw, Send } from "lucide-react";
import { IntegrationConfig } from "../types";

interface IntegrationSettingsProps {
  config: IntegrationConfig;
  onSave: (newConfig: IntegrationConfig) => void;
}

export default function IntegrationSettings({ config, onSave }: IntegrationSettingsProps) {
  const [telegramToken, setTelegramToken] = useState(config.telegramToken || "");
  const [telegramChatId, setTelegramChatId] = useState(config.telegramChatId || "");
  const [appsScriptUrl, setAppsScriptUrl] = useState(config.appsScriptUrl || "");
  const [whatsappNumber, setWhatsappNumber] = useState(config.whatsappNumber || "966546679537");
  
  // Custom asset urls & working hours
  const [logoUrl, setLogoUrl] = useState(config.logoUrl || "");
  const [faviconUrl, setFaviconUrl] = useState(config.faviconUrl || "");
  const [bgImage1, setBgImage1] = useState(config.backgroundImages?.[0] || "");
  const [bgImage2, setBgImage2] = useState(config.backgroundImages?.[1] || "");
  const [bgImage3, setBgImage3] = useState(config.backgroundImages?.[2] || "");
  const [bgImage4, setBgImage4] = useState(config.backgroundImages?.[3] || "");
  const [workingHoursStart, setWorkingHoursStart] = useState(config.workingHoursStart || "13:00");
  const [workingHoursEnd, setWorkingHoursEnd] = useState(config.workingHoursEnd || "22:00");
  const [googlePlaceId, setGooglePlaceId] = useState(config.googlePlaceId || "");
  const [googleApiKey, setGoogleApiKey] = useState(config.googleApiKey || "");

  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success">("idle");
  const [testStatus, setTestStatus] = useState<"idle" | "testing" | "success" | "error">("idle");
  const [testMessage, setTestMessage] = useState("");

  useEffect(() => {
    setTelegramToken(config.telegramToken || "");
    setTelegramChatId(config.telegramChatId || "");
    setAppsScriptUrl(config.appsScriptUrl || "");
    setWhatsappNumber(config.whatsappNumber || "966546679537");
    setLogoUrl(config.logoUrl || "");
    setFaviconUrl(config.faviconUrl || "");
    setBgImage1(config.backgroundImages?.[0] || "");
    setBgImage2(config.backgroundImages?.[1] || "");
    setBgImage3(config.backgroundImages?.[2] || "");
    setBgImage4(config.backgroundImages?.[3] || "");
    setWorkingHoursStart(config.workingHoursStart || "13:00");
    setWorkingHoursEnd(config.workingHoursEnd || "22:00");
    setGooglePlaceId(config.googlePlaceId || "");
    setGoogleApiKey(config.googleApiKey || "");
  }, [config]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus("saving");

    const backgroundImages = [bgImage1, bgImage2, bgImage3, bgImage4].filter(img => img.trim() !== "");
    
    onSave({
      telegramToken,
      telegramChatId,
      appsScriptUrl,
      whatsappNumber,
      logoUrl: logoUrl.trim(),
      faviconUrl: faviconUrl.trim(),
      backgroundImages: backgroundImages.length > 0 ? backgroundImages : undefined,
      workingHoursStart,
      workingHoursEnd,
      googlePlaceId: googlePlaceId.trim(),
      googleApiKey: googleApiKey.trim()
    });

    // Update Favicon dynamically if provided
    if (faviconUrl.trim()) {
      const link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
      if (link) {
        link.href = faviconUrl.trim();
      } else {
        const newLink = document.createElement("link");
        newLink.rel = "icon";
        newLink.href = faviconUrl.trim();
        document.head.appendChild(newLink);
      }
    }

    setTimeout(() => {
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 2000);
    }, 1200);
  };

  const handleTestTelegram = async () => {
    if (!telegramToken || !telegramChatId) {
      setTestStatus("error");
      setTestMessage("يجب إدخال توكن البوت ومعرف الشات أولاً لتجربة الاتصال!");
      return;
    }

    setTestStatus("testing");
    setTestMessage("");

    try {
      const url = `https://api.telegram.org/bot${telegramToken}/sendMessage`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: telegramChatId,
          text: `🧪 *رسالة تجريبية من لوحة تحكم صالون ڤيڤيد بيوتي!*\n\nتم ربط البوت بموقعك بنجاح. عند قيام أي عميل بالحجز، ستصلك التفاصيل هنا فوراً!`,
          parse_mode: "Markdown",
        }),
      });

      const resData = await response.json();

      if (response.ok && resData.ok) {
        setTestStatus("success");
        setTestMessage("تم إرسال رسالة تجريبية بنجاح! تحقق من حسابك على تلجرام.");
      } else {
        setTestStatus("error");
        setTestMessage(`خطأ في الرد: ${resData.description || "معلومات غير صحيحة"}`);
      }
    } catch (err: any) {
      setTestStatus("error");
      setTestMessage(`فشل الاتصال: ${err.message || "تأكد من اتصالك بالإنترنت"}`);
    }
  };

  const handleReset = () => {
    if (window.confirm("هل أنت متأكد من رغبتك في إعادة تعيين الإعدادات الافتراضية؟")) {
      setTelegramToken("");
      setTelegramChatId("");
      setAppsScriptUrl("");
      setWhatsappNumber("966546679537");
    }
  };

  return (
    <div className="bg-stone-900/90 border border-amber-200/15 rounded-[32px] p-6 text-stone-100 max-w-2xl mx-auto backdrop-blur-xl shadow-2xl">
      <div className="flex items-center gap-2 border-b border-amber-200/10 pb-4 mb-6">
        <Settings className="w-6 h-6 text-amber-200" />
        <h2 className="text-xl font-bold text-amber-100 font-sans">لوحة التحكم وإعدادات الاتصال البرمجي</h2>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        <div className="bg-amber-500/5 border border-amber-200/10 rounded-2xl p-4 flex gap-3 text-sm text-stone-300 leading-relaxed">
          <AlertTriangle className="w-5 h-5 text-amber-200 shrink-0 mt-0.5" />
          <p>
            تُحفظ هذه الإعدادات محلياً في متصفحك الحالي <b>(localStorage)</b>. مما يعني أن الكود آمن تماماً وخالٍ من الخوادم، ومتوافق ١٠٠٪ مع الاستضافات الثابتة مثل Vercel دون تكاليف خادم إضافية.
          </p>
        </div>

        {/* Telegram Section */}
        <div className="space-y-4 border-b border-amber-200/10 pb-5">
          <h3 className="font-semibold text-amber-200 flex items-center gap-1.5 text-base">
            <span>١. إعدادات بوت تلجرام (Telegram Bot)</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-stone-300 block font-sans font-medium">توكن البوت (Telegram Bot Token)</label>
              <input
                type="text"
                value={telegramToken}
                onChange={(e) => setTelegramToken(e.target.value)}
                placeholder="مثال: 123456:ABC-DEF1234ghIkl-zyx"
                className="w-full text-sm bg-stone-950/60 border border-amber-200/10 rounded-xl px-3 py-2 text-stone-100 font-mono focus:border-amber-300 focus:outline-none placeholder-stone-600"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-stone-300 block font-sans font-medium">معرف الدردشة (Chat ID)</label>
              <input
                type="text"
                value={telegramChatId}
                onChange={(e) => setTelegramChatId(e.target.value)}
                placeholder="مثال: 123456789"
                className="w-full text-sm bg-stone-950/60 border border-amber-200/10 rounded-xl px-3 py-2 text-stone-100 font-mono focus:border-amber-300 focus:outline-none placeholder-stone-600"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleTestTelegram}
              disabled={testStatus === "testing"}
              className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-stone-950/60 text-amber-100 hover:bg-stone-800 border border-amber-200/10 shadow-md transition flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 text-amber-200" />
              <span>{testStatus === "testing" ? "جاري الإرسال التجريبي..." : "تجربة إرسال رسالة للبوت"}</span>
            </button>
          </div>

          {testStatus !== "idle" && (
            <div className={`text-xs p-3 rounded-xl border leading-relaxed ${
              testStatus === "success" 
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-200"
                : "bg-red-500/10 border-red-500/20 text-red-200"
            }`}>
              {testMessage}
            </div>
          )}
        </div>

        {/* Google Sheet / Webhook Section */}
        <div className="space-y-4 border-b border-amber-200/10 pb-5">
          <h3 className="font-semibold text-amber-200 flex items-center gap-1.5 text-base">
            <span>٢. رابط Google Apps Script Webhook</span>
          </h3>
          <div className="space-y-1.5">
            <label className="text-xs text-stone-300 block font-sans font-medium">رابط الويب هوك (Web App URL)</label>
            <input
              type="url"
              value={appsScriptUrl}
              onChange={(e) => setAppsScriptUrl(e.target.value)}
              placeholder="https://script.google.com/macros/s/.../exec"
              className="w-full text-sm bg-stone-950/60 border border-amber-200/10 rounded-xl px-3 py-2 text-stone-100 font-mono focus:border-amber-300 focus:outline-none placeholder-stone-600"
            />
            <p className="text-[11px] text-stone-400 leading-normal font-medium">
              * عند تعبئة هذا الرابط، سيقوم الموقع تلقائياً بإرسال بيانات الحجز للـ Google Sheet لحفظها كقاعدة بيانات، ثم يقوم السكريبت بإرسال الرسالة للتلجرام بدلاً من إرسالها من المتصفح مباشرة.
            </p>
          </div>
        </div>

        {/* Whatsapp Confirmation Number */}
        <div className="space-y-4 border-b border-amber-200/10 pb-5">
          <h3 className="font-semibold text-amber-200 flex items-center gap-1.5 text-base">
            <span>٣. رقم واتساب لصالون ڤيڤيد بيوتي</span>
          </h3>
          <div className="space-y-1.5">
            <label className="text-xs text-stone-300 block font-sans font-medium">رقم واتساب المستلم (بصيغة دولية بدون أصفار أو علامة زائد)</label>
            <input
              type="text"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              placeholder="966546679537"
              className="w-full text-sm bg-stone-950/60 border border-amber-200/10 rounded-xl px-3 py-2 text-stone-100 font-mono focus:border-amber-300 focus:outline-none placeholder-stone-600"
            />
            <p className="text-[11px] text-stone-400 leading-normal font-medium">
              * هذا هو الرقم الذي ستتواصل منه الإدارة مع العميلات لتأكيد الحجز، وسيظهر رابط مباشر للعميلة للتواصل معك فور تقديم الحجز مع تفاصيل طلبها المعبأة تلقائياً.
            </p>
          </div>
        </div>

        {/* 4. Salon Working Hours */}
        <div className="space-y-4 border-b border-amber-200/10 pb-5">
          <h3 className="font-semibold text-amber-200 flex items-center gap-1.5 text-base">
            <span>٤. أوقات دوام الصالون</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-stone-300 block font-sans font-medium">وقت بدء العمل اليومي</label>
              <input
                type="time"
                value={workingHoursStart}
                onChange={(e) => setWorkingHoursStart(e.target.value)}
                className="w-full text-sm bg-stone-950/60 border border-amber-200/10 rounded-xl px-3 py-2 text-stone-100 focus:border-amber-300 focus:outline-none [color-scheme:dark]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-stone-300 block font-sans font-medium">وقت انتهاء العمل اليومي</label>
              <input
                type="time"
                value={workingHoursEnd}
                onChange={(e) => setWorkingHoursEnd(e.target.value)}
                className="w-full text-sm bg-stone-950/60 border border-amber-200/10 rounded-xl px-3 py-2 text-stone-100 focus:border-amber-300 focus:outline-none [color-scheme:dark]"
              />
            </div>
          </div>
          <p className="text-[11px] text-stone-400 leading-normal font-medium">
            * سيتم عرض الساعات المتاحة فقط بين هذين الوقتين للعميلات عند اختيار الموعد، لمنع الحجوزات خارج أوقات العمل الرسمية.
          </p>
        </div>

        {/* 5. Custom Logo, Favicon & Background Slides */}
        <div className="space-y-4 pb-2">
          <h3 className="font-semibold text-amber-200 flex items-center gap-1.5 text-base">
            <span>٥. تخصيص الشعار والصور الخلفية</span>
          </h3>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs text-stone-300 block font-sans font-medium">رابط شعار الصالون (Logo URL)</label>
              <input
                type="url"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://example.com/my-logo.png"
                className="w-full text-sm bg-stone-950/60 border border-amber-200/10 rounded-xl px-3 py-2 text-stone-100 font-mono focus:border-amber-300 focus:outline-none placeholder-stone-600"
              />
              <p className="text-[11px] text-stone-400">إذا تركته فارغاً، سيستمر عرض الشعار الحرفي (V) الفاخر بشكل افتراضي.</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-stone-300 block font-sans font-medium">رابط أيقونة المتصفح (Favicon URL)</label>
              <input
                type="url"
                value={faviconUrl}
                onChange={(e) => setFaviconUrl(e.target.value)}
                placeholder="https://example.com/favicon.ico"
                className="w-full text-sm bg-stone-950/60 border border-amber-200/10 rounded-xl px-3 py-2 text-stone-100 font-mono focus:border-amber-300 focus:outline-none placeholder-stone-600"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-stone-300 block font-sans font-medium">روابط الخلفيات المتحركة (Slideshow - 4 صور)</label>
              <div className="grid grid-cols-1 gap-2">
                <input
                  type="url"
                  value={bgImage1}
                  onChange={(e) => setBgImage1(e.target.value)}
                  placeholder="رابط الخلفية الأولى (URL)"
                  className="w-full text-sm bg-stone-950/60 border border-amber-200/10 rounded-xl px-3 py-2 text-stone-100 font-mono focus:border-amber-300 focus:outline-none placeholder-stone-600"
                />
                <input
                  type="url"
                  value={bgImage2}
                  onChange={(e) => setBgImage2(e.target.value)}
                  placeholder="رابط الخلفية الثانية (URL)"
                  className="w-full text-sm bg-stone-950/60 border border-amber-200/10 rounded-xl px-3 py-2 text-stone-100 font-mono focus:border-amber-300 focus:outline-none placeholder-stone-600"
                />
                <input
                  type="url"
                  value={bgImage3}
                  onChange={(e) => setBgImage3(e.target.value)}
                  placeholder="رابط الخلفية الثالثة (URL)"
                  className="w-full text-sm bg-stone-950/60 border border-amber-200/10 rounded-xl px-3 py-2 text-stone-100 font-mono focus:border-amber-300 focus:outline-none placeholder-stone-600"
                />
                <input
                  type="url"
                  value={bgImage4}
                  onChange={(e) => setBgImage4(e.target.value)}
                  placeholder="رابط الخلفية الرابعة (URL)"
                  className="w-full text-sm bg-stone-950/60 border border-amber-200/10 rounded-xl px-3 py-2 text-stone-100 font-mono focus:border-amber-300 focus:outline-none placeholder-stone-600"
                />
              </div>
              <p className="text-[11px] text-stone-400">إذا تُركت فارغة، سيتم عرض الخلفيات الفخمة الافتراضية للصالون.</p>
            </div>
          </div>
        </div>

        {/* 6. Google Maps Reviews Integration */}
        <div className="space-y-4 border-t border-amber-200/10 pt-5 pb-2">
          <h3 className="font-semibold text-amber-200 flex items-center gap-1.5 text-base">
            <span>٦. ربط تعليقات Google Maps الحقيقية</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-stone-300 block font-sans font-medium">معرف الموقع (Google Place ID)</label>
              <input
                type="text"
                value={googlePlaceId}
                onChange={(e) => setGooglePlaceId(e.target.value)}
                placeholder="مثال: ChIJs5x_Q5pYURUR4... (الحي أو الصالون)"
                className="w-full text-sm bg-stone-950/60 border border-amber-200/10 rounded-xl px-3 py-2 text-stone-100 font-mono focus:border-amber-300 focus:outline-none placeholder-stone-600"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-stone-300 block font-sans font-medium">مفتاح واجهة Google Places API Key</label>
              <input
                type="password"
                value={googleApiKey}
                onChange={(e) => setGoogleApiKey(e.target.value)}
                placeholder="مثال: AIzaSyA1B..."
                className="w-full text-sm bg-stone-950/60 border border-amber-200/10 rounded-xl px-3 py-2 text-stone-100 font-mono focus:border-amber-300 focus:outline-none placeholder-stone-600"
              />
            </div>
          </div>
          <p className="text-[11px] text-stone-400 leading-normal">
            * للحصول على تعليقات حقيقية ومباشرة من Google Maps، يتطلب الأمر توفير مفتاح Google Places API ومُعرّف موقع الصالون الخاص بك. (انظر أسفل الصفحة لشرح طريقة التفعيل في الدليل).
          </p>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-amber-200/10">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-amber-200 transition font-semibold cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>إعادة ضبط المصنع</span>
          </button>

          <button
            type="submit"
            disabled={saveStatus === "saving"}
            className="px-6 py-2 rounded-2xl text-sm font-bold bg-gradient-to-r from-amber-300 to-amber-100 text-stone-950 hover:from-amber-400 hover:to-amber-200 transition-all flex items-center gap-1.5 shadow-lg shadow-amber-950/40 font-sans cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>
              {saveStatus === "saving" ? "جاري الحفظ..." : saveStatus === "success" ? "تم الحفظ بنجاح!" : "حفظ الإعدادات"}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
