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

  // Snapchat and custom social icons state
  const [snapchatUrl, setSnapchatUrl] = useState(config.snapchatUrl || "https://www.snapchat.com/add/vividbeautysa");
  const [snapchatIconUrl, setSnapchatIconUrl] = useState(config.snapchatIconUrl || "");
  const [whatsappIconUrl, setWhatsappIconUrl] = useState(config.whatsappIconUrl || "");

  // 4 Custom Reviews editors
  const defaultReviews = [
    {
      id: 1,
      name: "عميلة قوقل ماب",
      text: "الصالون جداً نظيف ومرتب وشغلهم بطل مررره! سويت عندهم رموش وبدكير ومنكير، دقة في الشغل ونظافة تفوق الخيال والأدوات كلها معقمة تفتح قدامك. تعامل الموظفات راقي وعسل وهدوء المكان في حي النهضة يفتح النفس بجد.",
      date: "قبل أسبوعين",
    },
    {
      id: 2,
      name: "عميلة قوقل ماب",
      text: "أفضل صالون لقص الشعر والصبغات في بريدة بلا منازع. جربت عندهم صبغة وطلعت النتيجة روعة وتفتح النفس وبدون أي تلف للشعر. الموظفات مبدعات وبشوشات والخدمة سريعة وممتازة.",
      date: "قبل شهر",
    },
    {
      id: 3,
      name: "عميلة قوقل ماب",
      text: "شغل الحواجب والبدكير والمنكير عندهم نظيف ومتقن لدرجة مو طبيعية، والأسعار مناسبة جداً مقارنة بالنظافة والخدمة الملكية الرائعة. المشغل هادئ وراقي جداً.",
      date: "قبل ٣ أيام",
    },
    {
      id: 4,
      name: "عميلة قوقل ماب",
      text: "سويت عندهم تسريحة ومكياج ناعم وبدون مبالغة كل البنات بالجمعة يسألوني عنها! ميك اب نظيف والتسريحة ثابتة وتجنن. ممتنة جداً لتعاملهم الراقي واللطيف وأكيد راح أكون زبونتهم الدائمة.",
      date: "قبل أسبوع",
    }
  ];

  const [review1Name, setReview1Name] = useState("");
  const [review1Text, setReview1Text] = useState("");
  const [review1Date, setReview1Date] = useState("");

  const [review2Name, setReview2Name] = useState("");
  const [review2Text, setReview2Text] = useState("");
  const [review2Date, setReview2Date] = useState("");

  const [review3Name, setReview3Name] = useState("");
  const [review3Text, setReview3Text] = useState("");
  const [review3Date, setReview3Date] = useState("");

  const [review4Name, setReview4Name] = useState("");
  const [review4Text, setReview4Text] = useState("");
  const [review4Date, setReview4Date] = useState("");

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

    setSnapchatUrl(config.snapchatUrl || "https://www.snapchat.com/add/vividbeautysa");
    setSnapchatIconUrl(config.snapchatIconUrl || "");
    setWhatsappIconUrl(config.whatsappIconUrl || "");

    const currentReviews = config.customReviews && config.customReviews.length === 4 ? config.customReviews : defaultReviews;
    setReview1Name(currentReviews[0].name);
    setReview1Text(currentReviews[0].text);
    setReview1Date(currentReviews[0].date);

    setReview2Name(currentReviews[1].name);
    setReview2Text(currentReviews[1].text);
    setReview2Date(currentReviews[1].date);

    setReview3Name(currentReviews[2].name);
    setReview3Text(currentReviews[2].text);
    setReview3Date(currentReviews[2].date);

    setReview4Name(currentReviews[3].name);
    setReview4Text(currentReviews[3].text);
    setReview4Date(currentReviews[3].date);
  }, [config]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus("saving");

    const backgroundImages = [bgImage1, bgImage2, bgImage3, bgImage4].filter(img => img.trim() !== "");
    
    const customReviews = [
      { id: 1, name: review1Name.trim() || "عميلة قوقل ماب", text: review1Text.trim(), date: review1Date.trim() || "مؤخراً" },
      { id: 2, name: review2Name.trim() || "عميلة قوقل ماب", text: review2Text.trim(), date: review2Date.trim() || "مؤخراً" },
      { id: 3, name: review3Name.trim() || "عميلة قوقل ماب", text: review3Text.trim(), date: review3Date.trim() || "مؤخراً" },
      { id: 4, name: review4Name.trim() || "عميلة قوقل ماب", text: review4Text.trim(), date: review4Date.trim() || "مؤخراً" }
    ];

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
      googleApiKey: googleApiKey.trim(),
      snapchatUrl: snapchatUrl.trim(),
      snapchatIconUrl: snapchatIconUrl.trim(),
      whatsappIconUrl: whatsappIconUrl.trim(),
      customReviews
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

        {/* 7. Custom Social Links & Icons */}
        <div className="space-y-4 border-t border-amber-200/10 pt-5 pb-2">
          <h3 className="font-semibold text-amber-200 flex items-center gap-1.5 text-base">
            <span>٧. تخصيص روابط وأيقونات شبكات التواصل الاجتماعي</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-stone-300 block font-sans font-medium">رابط حساب سناب شات (Snapchat Link)</label>
              <input
                type="url"
                value={snapchatUrl}
                onChange={(e) => setSnapchatUrl(e.target.value)}
                placeholder="https://www.snapchat.com/add/..."
                className="w-full text-sm bg-stone-950/60 border border-amber-200/10 rounded-xl px-3 py-2 text-stone-100 font-mono focus:border-amber-300 focus:outline-none placeholder-stone-600"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-stone-300 block font-sans font-medium">رابط أيقونة سناب شات مخصصة (اختياري)</label>
              <input
                type="url"
                value={snapchatIconUrl}
                onChange={(e) => setSnapchatIconUrl(e.target.value)}
                placeholder="https://example.com/snapchat-icon.png"
                className="w-full text-sm bg-stone-950/60 border border-amber-200/10 rounded-xl px-3 py-2 text-stone-100 font-mono focus:border-amber-300 focus:outline-none placeholder-stone-600"
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs text-stone-300 block font-sans font-medium">رابط أيقونة واتساب مخصصة (اختياري)</label>
              <input
                type="url"
                value={whatsappIconUrl}
                onChange={(e) => setWhatsappIconUrl(e.target.value)}
                placeholder="https://example.com/whatsapp-icon.png"
                className="w-full text-sm bg-stone-950/60 border border-amber-200/10 rounded-xl px-3 py-2 text-stone-100 font-mono focus:border-amber-300 focus:outline-none placeholder-stone-600"
              />
              <p className="text-[11px] text-stone-400">إذا تركت روابط الأيقونات فارغة، سيتم عرض الأيقونات الرسمية الفخمة المطورة تلقائياً.</p>
            </div>
          </div>
        </div>

        {/* 8. Custom Customer Reviews */}
        <div className="space-y-4 border-t border-amber-200/10 pt-5 pb-2">
          <h3 className="font-semibold text-amber-200 flex items-center gap-1.5 text-base">
            <span>٨. تعديل آراء العميلات والتقييمات يدوياً (التعليقات)</span>
          </h3>
          <p className="text-xs text-stone-300 leading-normal font-sans">
            يمكنك هنا تعديل التعليقات والتقييمات الـ 4 المعروضة بالصفحة الرئيسية لصالونك لإزالة أي تعليقات غير حقيقية وكتابة تقييمات عميلاتك الحقيقية والواقعية:
          </p>
          
          <div className="space-y-4">
            {/* Review 1 */}
            <div className="bg-stone-950/40 p-4 rounded-2xl border border-amber-200/5 space-y-3">
              <span className="text-xs font-bold text-amber-200 block">التعليق الأول:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] text-stone-400">اسم العميلة</label>
                  <input
                    type="text"
                    value={review1Name}
                    onChange={(e) => setReview1Name(e.target.value)}
                    className="w-full text-xs bg-stone-900 border border-amber-200/10 rounded-lg px-2.5 py-1.5 text-stone-100 focus:outline-none focus:border-amber-300"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-stone-400">تاريخ التقييم</label>
                  <input
                    type="text"
                    value={review1Date}
                    onChange={(e) => setReview1Date(e.target.value)}
                    className="w-full text-xs bg-stone-900 border border-amber-200/10 rounded-lg px-2.5 py-1.5 text-stone-100 focus:outline-none focus:border-amber-300"
                  />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[11px] text-stone-400">نص التقييم</label>
                  <textarea
                    rows={2}
                    value={review1Text}
                    onChange={(e) => setReview1Text(e.target.value)}
                    className="w-full text-xs bg-stone-900 border border-amber-200/10 rounded-lg px-2.5 py-1.5 text-stone-100 focus:outline-none focus:border-amber-300"
                  />
                </div>
              </div>
            </div>

            {/* Review 2 */}
            <div className="bg-stone-950/40 p-4 rounded-2xl border border-amber-200/5 space-y-3">
              <span className="text-xs font-bold text-amber-200 block">التعليق الثاني:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] text-stone-400">اسم العميلة</label>
                  <input
                    type="text"
                    value={review2Name}
                    onChange={(e) => setReview2Name(e.target.value)}
                    className="w-full text-xs bg-stone-900 border border-amber-200/10 rounded-lg px-2.5 py-1.5 text-stone-100 focus:outline-none focus:border-amber-300"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-stone-400">تاريخ التقييم</label>
                  <input
                    type="text"
                    value={review2Date}
                    onChange={(e) => setReview2Date(e.target.value)}
                    className="w-full text-xs bg-stone-900 border border-amber-200/10 rounded-lg px-2.5 py-1.5 text-stone-100 focus:outline-none focus:border-amber-300"
                  />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[11px] text-stone-400">نص التقييم</label>
                  <textarea
                    rows={2}
                    value={review2Text}
                    onChange={(e) => setReview2Text(e.target.value)}
                    className="w-full text-xs bg-stone-900 border border-amber-200/10 rounded-lg px-2.5 py-1.5 text-stone-100 focus:outline-none focus:border-amber-300"
                  />
                </div>
              </div>
            </div>

            {/* Review 3 */}
            <div className="bg-stone-950/40 p-4 rounded-2xl border border-amber-200/5 space-y-3">
              <span className="text-xs font-bold text-amber-200 block">التعليق الثالث:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] text-stone-400">اسم العميلة</label>
                  <input
                    type="text"
                    value={review3Name}
                    onChange={(e) => setReview3Name(e.target.value)}
                    className="w-full text-xs bg-stone-900 border border-amber-200/10 rounded-lg px-2.5 py-1.5 text-stone-100 focus:outline-none focus:border-amber-300"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-stone-400">تاريخ التقييم</label>
                  <input
                    type="text"
                    value={review3Date}
                    onChange={(e) => setReview3Date(e.target.value)}
                    className="w-full text-xs bg-stone-900 border border-amber-200/10 rounded-lg px-2.5 py-1.5 text-stone-100 focus:outline-none focus:border-amber-300"
                  />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[11px] text-stone-400">نص التقييم</label>
                  <textarea
                    rows={2}
                    value={review3Text}
                    onChange={(e) => setReview3Text(e.target.value)}
                    className="w-full text-xs bg-stone-900 border border-amber-200/10 rounded-lg px-2.5 py-1.5 text-stone-100 focus:outline-none focus:border-amber-300"
                  />
                </div>
              </div>
            </div>

            {/* Review 4 */}
            <div className="bg-stone-950/40 p-4 rounded-2xl border border-amber-200/5 space-y-3">
              <span className="text-xs font-bold text-amber-200 block">التعليق الرابع:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] text-stone-400">اسم العميلة</label>
                  <input
                    type="text"
                    value={review4Name}
                    onChange={(e) => setReview4Name(e.target.value)}
                    className="w-full text-xs bg-stone-900 border border-amber-200/10 rounded-lg px-2.5 py-1.5 text-stone-100 focus:outline-none focus:border-amber-300"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-stone-400">تاريخ التقييم</label>
                  <input
                    type="text"
                    value={review4Date}
                    onChange={(e) => setReview4Date(e.target.value)}
                    className="w-full text-xs bg-stone-900 border border-amber-200/10 rounded-lg px-2.5 py-1.5 text-stone-100 focus:outline-none focus:border-amber-300"
                  />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[11px] text-stone-400">نص التقييم</label>
                  <textarea
                    rows={2}
                    value={review4Text}
                    onChange={(e) => setReview4Text(e.target.value)}
                    className="w-full text-xs bg-stone-900 border border-amber-200/10 rounded-lg px-2.5 py-1.5 text-stone-100 focus:outline-none focus:border-amber-300"
                  />
                </div>
              </div>
            </div>
          </div>
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
