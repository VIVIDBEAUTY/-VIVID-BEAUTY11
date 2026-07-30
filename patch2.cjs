const fs = require('fs');
let code = fs.readFileSync('src/components/BookingForm.tsx', 'utf8');

// 1. Add loading phrases state and useEffect
const stateTarget = `const [ticketId, setTicketId] = useState<string | null>(null);`;
const stateReplacement = `const [ticketId, setTicketId] = useState<string | null>(null);
  const [loadingPhrase, setLoadingPhrase] = useState("نقوم الان بتجهيز حجزك");
  
  useEffect(() => {
    if (!isSubmitting) return;
    const phrases = ["نقوم الان بتجهيز حجزك", "نحفظ موعدك", "لحظات وتكتمل اناقتك", "جاري تأكيد الموعد"];
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % phrases.length;
      setLoadingPhrase(phrases[i]);
    }, 600);
    return () => clearInterval(interval);
  }, [isSubmitting]);`;

code = code.replace(stateTarget, stateReplacement);

// 2. Make webhooks fire-and-forget in handleSubmit
const webhookTarget = `let isSent = false;
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
        const messageText = \`🔔 *حجز جديد في صالون ڤيڤيد بيوتي!*\\n\\n\` +
          \`👤 *الاسم:* \${name}\\n\` +
          \`📱 *الجوال:* \${formattedPhone}\\n\` +
          \`📅 *الموعد:* \${date} | الساعة \${time}\\n\` +
          \`💆‍♀️ *الخدمات:* \${servicesNames}\\n\` +
          \`💰 *المجموع:* \${totalPrice} ر.س\\n\\n\` +
          \`━━━━━━━━━━━━━━\\n\` +
          \`💌 *الرسالة الجاهزة للإرسال للعميلة (نسخ سريع):*\\n\\n\` +
          \`أهلاً بكِ عزيزتي في صالون ڤيڤيد بيوتي ✨\\n\` +
          \`يسعدنا تأكيد طلب حجزكِ معنا:\\n\` +
          \`• نوع الخدمة: \${servicesNames}\\n\` +
          \`• الموعد: \${date} | الساعة \${time}\\n\` +
          \`• حالة الحجز: \\n\` +
          \`━━━━━━━━━━━━━━\`;
        const telegramResponse = await fetch(\`https://api.telegram.org/bot\${config.telegramToken}/sendMessage\`, {
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
                    url: \`https://wa.me/\${formattedPhone}\`
                  },
                  {
                    text: "📞 اتصال هاتفي",
                    url: \`tel:\${formattedPhone}\`
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
      }`;

const webhookReplacement = `// Fire and forget webhooks so the user doesn't wait
      if (config.appsScriptUrl) {
        fetch(config.appsScriptUrl, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bookingPayload),
        }).catch(console.error);
      }
      if (!config.appsScriptUrl && config.telegramToken && config.telegramChatId) {
        const servicesNames = selectedServices.map(s => s.name).join(" ، ");
        const messageText = \`🔔 *حجز جديد في صالون ڤيڤيد بيوتي!*\\n\\n\` +
          \`👤 *الاسم:* \${name}\\n\` +
          \`📱 *الجوال:* \${formattedPhone}\\n\` +
          \`📅 *الموعد:* \${date} | الساعة \${time}\\n\` +
          \`💆‍♀️ *الخدمات:* \${servicesNames}\\n\` +
          \`💰 *المجموع:* \${totalPrice} ر.س\\n\\n\` +
          \`━━━━━━━━━━━━━━\\n\` +
          \`💌 *الرسالة الجاهزة للإرسال للعميلة (نسخ سريع):*\\n\\n\` +
          \`أهلاً بكِ عزيزتي في صالون ڤيڤيد بيوتي ✨\\n\` +
          \`يسعدنا تأكيد طلب حجزكِ معنا:\\n\` +
          \`• نوع الخدمة: \${servicesNames}\\n\` +
          \`• الموعد: \${date} | الساعة \${time}\\n\` +
          \`• حالة الحجز: \\n\` +
          \`━━━━━━━━━━━━━━\`;
        fetch(\`https://api.telegram.org/bot\${config.telegramToken}/sendMessage\`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: config.telegramChatId,
            text: messageText,
            parse_mode: "Markdown",
            disable_web_page_preview: true,
            reply_markup: {
              inline_keyboard: [
                [{ text: "💬 تواصل واتساب", url: \`https://wa.me/\${formattedPhone}\` }, { text: "📞 اتصال هاتفي", url: \`tel:\${formattedPhone}\` }],
                [{ text: "📍 موقع صالون ڤيڤيد بيوتي", url: "https://maps.app.goo.gl/3H9jQ4Ditvi1mBS87" }]
              ]
            }
          })
        }).catch(console.error);
      }`;
code = code.replace(webhookTarget, webhookReplacement);

// 3. Update the button
const buttonTarget = `<button
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
        </button>`;

const buttonReplacement = `<button
          type="submit"
          disabled={isSubmitting || selectedServices.length === 0}
          className="relative w-full py-3.5 px-6 rounded-2xl font-bold bg-stone-800 text-amber-200 transition-all shadow-lg overflow-hidden flex items-center justify-center gap-2 mt-4 cursor-pointer group border border-amber-500/20"
        >
          {isSubmitting ? (
            <>
              <div className="absolute inset-0 bg-amber-500/20 origin-left animate-[loadingBar_2s_ease-in-out_infinite]"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-200/10 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]"></div>
              <span className="relative z-10 animate-pulse">{loadingPhrase}</span>
            </>
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-200 opacity-0 group-hover:opacity-10 transition-opacity"></div>
              <span className="relative z-10 text-stone-100">تأكيد وإرسال طلب الحجز</span>
            </>
          )}
        </button>`;

code = code.replace(buttonTarget, buttonReplacement);

fs.writeFileSync('src/components/BookingForm.tsx', code);
console.log('Patched patch2.cjs');
