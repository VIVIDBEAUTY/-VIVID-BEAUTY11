import React, { useState } from "react";
import { ServiceItem, IntegrationConfig } from "../types";
import { 
  Calendar, 
  Phone, 
  User, 
  Clock, 
  CheckCircle2, 
  MessageSquare, 
  AlertCircle, 
  ShoppingBag, 
  X, 
  Star, 
  Heart, 
  Award,
  CalendarDays
} from "lucide-react";

interface BookingFormProps {
  selectedServices: ServiceItem[];
  onRemoveService: (service: ServiceItem) => void;
  config: IntegrationConfig;
  onSuccess: () => void;
  hasAgreedPrivacy: boolean;
  setHasAgreedPrivacy: (val: boolean) => void;
  hasOpenedPrivacy: boolean;
  setHasOpenedPrivacy: (val: boolean) => void;
  onOpenPrivacy: () => void;
}

export default function BookingForm({ 
  selectedServices, 
  onRemoveService, 
  config, 
  onSuccess,
  hasAgreedPrivacy,
  setHasAgreedPrivacy,
  hasOpenedPrivacy,
  setHasOpenedPrivacy,
  onOpenPrivacy
}: BookingFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  // Calculate total price
  const totalPrice = selectedServices.reduce((sum, item) => sum + item.price, 0);

  // Helper: Next 10 available days
  const next10Days = React.useMemo(() => {
    const days = [];
    const arabicWeekdays = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
    const arabicMonths = [
      "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
      "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
    ];

    for (let i = 0; i < 10; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const dateStr = String(d.getDate()).padStart(2, "0");
      const fullDate = `${year}-${month}-${dateStr}`;

      days.push({
        isoString: fullDate,
        dayName: arabicWeekdays[d.getDay()],
        dayNumber: d.getDate(),
        monthName: arabicMonths[d.getMonth()]
      });
    }
    return days;
  }, []);

  // Helper: Time slots within configured working hours (default: 13:00 to 22:00)
  const timeSlots = React.useMemo(() => {
    const startStr = config.workingHoursStart || "13:00";
    const endStr = config.workingHoursEnd || "22:00";
    
    const slots = [];
    const [startHour, startMin] = startStr.split(":").map(Number);
    const [endHour, endMin] = endStr.split(":").map(Number);
    
    let currentHour = startHour;
    let currentMin = startMin;
    
    while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
      const isPM = currentHour >= 12;
      let displayHour = currentHour % 12;
      if (displayHour === 0) displayHour = 12;
      
      const ampmStr = isPM ? "م" : "ص";
      const timeStr24 = `${String(currentHour).padStart(2, "0")}:${String(currentMin).padStart(2, "0")}`;
      const timeStr12 = `${displayHour}:${String(currentMin).padStart(2, "0")} ${ampmStr}`;
      
      slots.push({
        value24: timeStr24,
        label12: timeStr12
      });
      
      currentMin += 30;
      if (currentMin >= 60) {
        currentMin = 0;
        currentHour += 1;
      }
    }
    return slots;
  }, [config.workingHoursStart, config.workingHoursEnd]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    // Simple Validations
    if (!name.trim()) {
      setErrorMsg("الرجاء إدخال الاسم الكريم");
      return;
    }

    // Phone validation (Saudi standard: 05xxxxxxxx or 9665xxxxxxxx)
    const cleanPhone = phone.trim().replace(/\s+/g, "");
    if (!/^05[0-9]{8}$/.test(cleanPhone) && !/^9665[0-9]{8}$/.test(cleanPhone)) {
      setErrorMsg("الرجاء إدخال رقم جوال سعودي صحيح يبدأ بـ 05 (مثال: 0512345678)");
      return;
    }

    if (!date) {
      setErrorMsg("الرجاء اختيار تاريخ الحجز المناسب");
      return;
    }

    if (!time) {
      setErrorMsg("الرجاء اختيار وقت الحجز المناسب");
      return;
    }

    if (selectedServices.length === 0) {
      setErrorMsg("الرجاء تحديد خدمة واحدة على الأقل لإكمال الحجز");
      return;
    }

    if (!hasOpenedPrivacy) {
      setErrorMsg("يرجى قراءة سياسة الخصوصية بالضغط على الرابط أسفل قبل تأكيد الحجز");
      setHasOpenedPrivacy(true);
      onOpenPrivacy();
      return;
    }

    if (!hasAgreedPrivacy) {
      setErrorMsg("يجب تحديد مربع الموافقة على سياسة الخصوصية للمتابعة وتأكيد الحجز");
      return;
    }

    setIsSubmitting(true);

    // Format phone to standard international 9665xxxxxxxx for WhatsApp redirection
    let formattedPhone = cleanPhone;
    if (cleanPhone.startsWith("05")) {
      formattedPhone = "966" + cleanPhone.substring(1);
    }

    const bookingPayload = {
      name,
      phone: formattedPhone,
      date,
      time,
      selectedServices,
      totalPrice,
      // Pass config details so Apps Script can read them dynamically if needed
      telegramToken: config.telegramToken,
      telegramChatId: config.telegramChatId
    };

    try {
      let isSent = false;

      // 1. If Google Apps Script Webhook is configured, send to it
      if (config.appsScriptUrl) {
        const response = await fetch(config.appsScriptUrl, {
          method: "POST",
          mode: "no-cors", // Standard CORS mode for external web app script triggers
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bookingPayload),
        });
        isSent = true;
      }

      // 2. If Telegram is configured and Apps Script is NOT used, send directly from client
      // (This serves as a fully static client-side fallback)
      if (!config.appsScriptUrl && config.telegramToken && config.telegramChatId) {
        const servicesNames = selectedServices.map(s => s.name).join(" ، ");
        const messageText = `🔔 *حجز جديد في صالون ڤيڤيد بيوتي!*\n\n` +
          `👤 *الاسم:* ${name}\n` +
          `📱 *الجوال:* ${formattedPhone}\n` +
          `📅 *الموعد:* ${date} | الساعة ${time}\n` +
          `💆‍♀️ *الخدمات:* ${servicesNames}\n` +
          `💰 *المجموع:* ${totalPrice} ر.س\n\n` +
          `━━━━━━━━━━━━━━\n` +
          `💌 *الرسالة الجاهزة للإرسال للعميلة (نسخ سريع):*\n\n` +
          `أهلاً بكِ عزيزتي في صالون ڤيڤيد بيوتي ✨\n` +
          `يسعدنا تأكيد طلب حجزكِ معنا:\n` +
          `• نوع الخدمة: ${servicesNames}\n` +
          `• الموعد: ${date} | الساعة ${time}\n` +
          `• حالة الحجز: \n` +
          `━━━━━━━━━━━━━━`;

        const telegramResponse = await fetch(`https://api.telegram.org/bot${config.telegramToken}/sendMessage`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chat_id: config.telegramChatId,
            text: messageText,
            parse_mode: "Markdown",
            disable_web_page_preview: true,
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: "💬 تواصل واتساب",
                    url: `https://wa.me/${formattedPhone}`
                  },
                  {
                    text: "📞 اتصال هاتفي",
                    url: `tel:${formattedPhone}`
                  }
                ],
                [
                  {
                    text: "📍 موقع صالون ڤيڤيد بيوتي",
                    url: "https://maps.app.goo.gl/3H9jQ4Ditvi1mBS87"
                  }
                ]
              ]
            }
          })
        });

        if (telegramResponse.ok) {
          isSent = true;
        }
      }

      // If neither is configured, we'll still allow mock success so user can experience the flow and use WhatsApp direct link
      setIsSuccess(true);
      onSuccess();
    } catch (err: any) {
      console.error("Submission Error", err);
      // Even if API fails due to CORS or local environment network constraints,
      // we'll guide the user gracefully and let them complete booking via WhatsApp.
      setIsSuccess(true);
      onSuccess();
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate WhatsApp message content for instant checkout
  const getWhatsappUrl = () => {
    const servicesList = selectedServices.map(s => `• ${s.name} (${s.price} ر.س)`).join("%0A");
    const message = `أهلاً صالون ڤيڤيد بيوتي 👋%0A` +
      `أود تأكيد حجزي الذي قمت به عبر الموقع للتاريخ والموعد الموضح أدناه:%0A%0A` +
      `👤 *الاسم:* ${name}%0A` +
      `📱 *الجوال:* ${phone}%0A` +
      `📅 *الموعد:* ${date} | الساعة ${time}%0A%0A` +
      `💆‍♀️ *الخدمات المطلوبة:*%0A${servicesList}%0A%0A` +
      `💰 *الإجمالي:* ${totalPrice} ر.س%0A%0A` +
      `أرجو منكم تأكيد موعدي بالرد على هذه الرسالة. شكراً لكم!`;
    
    return `https://wa.me/${config.whatsappNumber}?text=${message}`;
  };

  if (isSuccess) {
    return (
      <div className="bg-stone-900/95 border border-amber-200/15 rounded-[32px] p-8 text-stone-100 text-center max-w-lg mx-auto shadow-2xl relative overflow-hidden font-sans">
        {/* Abstract luxury ambient glow background */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/5 rounded-full blur-2xl animate-pulse" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-amber-500/5 rounded-full blur-2xl animate-pulse" />

        <div className="relative z-10 space-y-6">
          {/* Cute Personalized Client Badge */}
          <div className="mx-auto relative bg-gradient-to-b from-amber-200/10 to-amber-200/5 w-24 h-24 rounded-full flex items-center justify-center border border-amber-200/20 shadow-inner">
            <Award className="w-10 h-10 text-amber-200" />
            <div className="absolute -bottom-1 -right-1 bg-amber-200 text-stone-950 w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black border-2 border-stone-900 shadow-md">
              👑
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-black text-amber-100">تم استلام طلب حجزكِ بنجاح!</h3>
            
            {/* Cute Personalized Greeting */}
            <div className="bg-stone-950/40 border border-amber-200/10 rounded-2xl py-3 px-4 inline-block mx-auto">
              <p className="text-sm font-semibold text-amber-200 flex items-center gap-1.5 justify-center">
                <Heart className="w-4 h-4 fill-amber-200 text-amber-200 animate-pulse" />
                <span>عزيزتي {name || "الجميلة"}، تاجكِ يكتمل في صالون ڤيڤيد بيوتي!</span>
              </p>
            </div>

            <p className="text-stone-300 text-sm leading-relaxed max-w-sm mx-auto">
              لقد تم تسجيل موعدكِ المقترح بنجاح. سنتواصل معكِ فورا عبر واتساب لتأكيد الحجز النهائي وتجهيز استقبالكِ الملكي.
            </p>
          </div>

          {/* Rating invitation */}
          <div className="bg-amber-500/5 border border-amber-200/15 rounded-3xl p-5 space-y-3.5 relative overflow-hidden">
            <div className="flex justify-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-5 h-5 fill-amber-200 text-amber-200" />
              ))}
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-extrabold text-amber-200 tracking-wider">شاركينا تجربتكِ الرائعة!</h4>
              <p className="text-[11px] text-stone-300 leading-relaxed max-w-xs mx-auto">
                رأيكِ يصنع الفرق! نسعد بمشاركتنا تقييمكِ لخدماتنا عبر خرائط جوجل لمساعدتنا على مواصلة تقديم أفضل المعايير دائماً.
              </p>
            </div>
            <a
              href={`https://search.google.com/local/writereview?placeid=${config.googlePlaceId || "ChIJW0_QVQBXfxURqYqkcSzIp08"}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-200 hover:bg-amber-300 text-stone-950 text-xs font-bold transition shadow-md cursor-pointer mx-auto"
            >
              <Star className="w-3.5 h-3.5 fill-stone-950 text-stone-950" />
              <span>قيّمينا الآن على Google Maps</span>
            </a>
          </div>

          <div className="bg-stone-950/80 border border-amber-200/10 rounded-2xl p-4 text-right text-xs space-y-2 text-stone-300">
            <div className="flex justify-between border-b border-amber-200/15 pb-1.5 font-bold text-amber-100 text-sm">
              <span>تفاصيل الفاتورة المبدئية</span>
              <span>الإجمالي: {totalPrice} ر.س</span>
            </div>
            <div>• <b>الاسم:</b> {name}</div>
            <div>• <b>رقم الجوال:</b> {phone}</div>
            <div>• <b>الموعد المقترح:</b> {date} في تمام الساعة {time}</div>
            <div className="truncate">• <b>الخدمات المختارة ({selectedServices.length}):</b> {selectedServices.map(s => s.name).join(" ، ")}</div>
          </div>

          <div className="space-y-3 pt-2">
            <a
              href={getWhatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 font-bold text-white transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-emerald-200/30 text-base cursor-pointer"
            >
              <MessageSquare className="w-5 h-5 fill-current text-white" />
              <span>تأكيد فوري عبر واتساب الآن</span>
            </a>
            
            <p className="text-[11px] text-stone-400 font-medium">
              * الضغط على الزر بالأعلى يفتح محادثة واتساب آمنة ومباشرة مع الصالون لإتمام الحجز فوراً وتفادي أي تأخير.
            </p>

            <button
              onClick={() => {
                setIsSuccess(false);
                setName("");
                setPhone("");
                setDate("");
                setTime("");
              }}
              className="text-xs text-amber-200 hover:text-amber-100 hover:underline mt-4 cursor-pointer block mx-auto font-semibold"
            >
              تقديم حجز جديد آخر
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-stone-900/90 border border-amber-200/15 rounded-[32px] p-6 text-stone-100 max-w-xl mx-auto backdrop-blur-xl font-sans shadow-2xl">
      <div className="flex items-center justify-between border-b border-amber-200/10 pb-4 mb-5">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-amber-200" />
          <h3 className="text-lg font-bold text-amber-100">إكمال تفاصيل حجز موعدكِ</h3>
        </div>
        <span className="text-xs bg-amber-200/10 text-amber-200 border border-amber-200/20 px-2.5 py-1 rounded-full font-bold">
          {selectedServices.length} خدمات مختارة
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Selected Services Review */}
        {selectedServices.length > 0 ? (
          <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
            <p className="text-xs text-amber-200/70 font-semibold">الخدمات المختارة:</p>
            {selectedServices.map((service) => (
              <div key={service.id} className="flex items-center justify-between bg-stone-950/60 border border-amber-200/10 rounded-xl p-2.5 text-xs shadow-md">
                <span className="text-stone-200 font-medium">{service.name}</span>
                <div className="flex items-center gap-2.5">
                  <span className="text-amber-100 font-bold">{service.price} ر.س</span>
                  <button
                    type="button"
                    onClick={() => onRemoveService(service)}
                    className="text-stone-400 hover:text-amber-200 transition cursor-pointer p-0.5 rounded-full hover:bg-stone-800"
                    title="حذف الخدمة"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-stone-950/60 border border-amber-200/10 rounded-2xl p-5 text-center text-sm text-stone-300">
            الرجاء العودة لقائمة الخدمات واختيار خدمة واحدة على الأقل لإضافتها لطلبكِ.
          </div>
        )}

        {/* Pricing Summary */}
        {selectedServices.length > 0 && (
          <div className="flex justify-between items-center bg-amber-500/5 border border-amber-200/10 rounded-2xl p-3 px-4 text-sm font-semibold text-stone-200">
            <span>المجموع الإجمالي للخدمات:</span>
            <span className="text-base text-amber-100 font-extrabold">{totalPrice} ر.س</span>
          </div>
        )}

        <div className="space-y-4 pt-2">
          {/* Client Name */}
          <div className="space-y-1.5">
            <label className="text-xs text-stone-300 block font-semibold flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-amber-200" />
              <span>اسم العميلـة بالكامل</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: سارة محمد"
              className="w-full text-sm bg-stone-950/60 border border-amber-200/10 rounded-xl px-3 py-2.5 text-stone-100 focus:border-amber-300 focus:outline-none placeholder-stone-600"
            />
          </div>

          {/* Client Phone */}
          <div className="space-y-1.5">
            <label className="text-xs text-stone-300 block font-semibold flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-amber-200" />
              <span>رقم الجوال الخاص بكِ</span>
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="مثال: 0512345678"
              className="w-full text-sm bg-stone-950/60 border border-amber-200/10 rounded-xl px-3 py-2.5 text-stone-100 font-mono focus:border-amber-300 focus:outline-none placeholder-stone-600 text-right"
              dir="ltr"
            />
          </div>

          {/* Date & Time fields */}
          <div className="space-y-4">
            {/* Custom Interactive Calendar */}
            <div className="space-y-2">
              <label className="text-xs text-stone-300 block font-semibold flex items-center gap-1.5">
                <CalendarDays className="w-4 h-4 text-amber-200" />
                <span>تاريخ الحجز المفضل</span>
              </label>
              
              <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-amber-200/10" dir="rtl">
                {next10Days.map((d) => {
                  const isSelected = date === d.isoString;
                  return (
                    <button
                      key={d.isoString}
                      type="button"
                      onClick={() => setDate(d.isoString)}
                      className={`flex-shrink-0 w-20 py-3.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                        isSelected
                          ? "bg-gradient-to-b from-amber-300 to-amber-100 text-stone-950 border-amber-200 shadow-md scale-105"
                          : "bg-stone-950/40 hover:bg-stone-850/60 text-stone-300 border-amber-200/10 hover:border-amber-200/30"
                      }`}
                    >
                      <span className={`text-[10px] font-medium tracking-wide ${isSelected ? "text-stone-900" : "text-stone-400"}`}>
                        {d.dayName}
                      </span>
                      <span className="text-lg font-extrabold font-sans">
                        {d.dayNumber}
                      </span>
                      <span className={`text-[9px] font-bold ${isSelected ? "text-stone-900" : "text-amber-200/70"}`}>
                        {d.monthName}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Time Slots Grid */}
            <div className="space-y-2 pt-1.5">
              <label className="text-xs text-stone-300 block font-semibold flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-200" />
                <span>الوقت المفضل</span>
              </label>

              {timeSlots.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2" dir="rtl">
                  {timeSlots.map((slot) => {
                    const isSelected = time === slot.value24;
                    return (
                      <button
                        key={slot.value24}
                        type="button"
                        onClick={() => setTime(slot.value24)}
                        className={`py-2 px-1 text-xs font-sans font-bold rounded-xl border text-center transition-all cursor-pointer ${
                          isSelected
                            ? "bg-gradient-to-r from-amber-300 to-amber-100 text-stone-950 border-amber-200 shadow-sm"
                            : "bg-stone-950/40 hover:bg-stone-850/60 text-stone-300 border-amber-200/10 hover:border-amber-200/20"
                        }`}
                      >
                        {slot.label12}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-stone-400 text-center py-2">برجاء مراجعة لوحة التحكم للتأكد من تهيئة أوقات الدوام بشكل صحيح.</p>
              )}
            </div>
          </div>
        </div>

        {/* Privacy Policy Checkbox */}
        <div className="bg-stone-950/45 border border-amber-200/5 rounded-2xl p-4.5 space-y-2 mt-4">
          <div className="flex items-start gap-3">
            <input
              id="privacyAgreementCheckbox"
              type="checkbox"
              checked={hasAgreedPrivacy}
              onChange={(e) => {
                if (e.target.checked && !hasOpenedPrivacy) {
                  setHasOpenedPrivacy(true);
                  onOpenPrivacy();
                } else {
                  setHasAgreedPrivacy(e.target.checked);
                }
              }}
              className="mt-1 w-4.5 h-4.5 text-amber-300 bg-stone-900 border-amber-200/20 rounded focus:ring-0 focus:ring-offset-0 accent-amber-200 cursor-pointer"
            />
            <label htmlFor="privacyAgreementCheckbox" className="text-xs text-stone-300 leading-relaxed select-none text-right">
              أقر وأوافق على{" "}
              <button
                type="button"
                onClick={() => {
                  setHasOpenedPrivacy(true);
                  onOpenPrivacy();
                }}
                className="text-amber-200 hover:text-amber-100 underline font-bold cursor-pointer inline bg-transparent p-0 border-0"
              >
                سياسة الخصوصية وسرية البيانات
              </button>{" "}
              الخاصة بصالون ڤيڤيد بيوتي لضمان سرية وأمان معلوماتي المسجلة.
            </label>
          </div>
        </div>

        {errorMsg && (
          <div className="bg-amber-500/5 border border-amber-200/20 rounded-2xl p-3 text-xs text-stone-200 flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 text-amber-200 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting || selectedServices.length === 0}
          className="w-full py-3.5 px-6 rounded-2xl font-bold bg-gradient-to-r from-amber-300 to-amber-100 text-stone-950 hover:from-amber-400 hover:to-amber-200 transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed shadow-lg shadow-amber-950/40 flex items-center justify-center gap-2 mt-4 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-4 w-4 text-stone-950" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>جاري تسجيل حجزكِ الآن...</span>
            </>
          ) : (
            <span>تأكيد وإرسال طلب الحجز</span>
          )}
        </button>
      </form>
    </div>
  );
}
