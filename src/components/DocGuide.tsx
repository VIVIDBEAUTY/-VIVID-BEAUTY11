import React, { useState } from "react";
import { Copy, Check, ExternalLink, HelpCircle, Database, MessageSquare } from "lucide-react";

export default function DocGuide() {
  const [copied, setCopied] = useState(false);

  const appsScriptCode = `// كود Google Apps Script لربط الموقع بجدول البيانات وبوت تلجرام
// قم بلصق هذا الكود في محرر نص البرمجة (Apps Script) المرتبط بملف Excel الخاص بك.

function doPost(e) {
  try {
    // 1. استقبال البيانات القادمة من نموذج الموقع
    var data = JSON.parse(e.postData.contents);
    
    // 2. فتح جدول البيانات النشط
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // 3. ترتيب البيانات في صف جديد
    // الأعمدة: التاريخ والوقت، الاسم، الجوال، تاريخ الحجز، الخدمات المختارة، السعر الإجمالي، حالة الحجز
    var timestamp = new Date();
    var formattedDate = Utilities.formatDate(timestamp, "Asia/Riyadh", "yyyy-MM-dd HH:mm:ss");
    
    // تجميع الخدمات المختارة في نص واحد
    var servicesList = data.selectedServices.map(function(s) { 
      return s.name + " (" + s.price + " ر.س)"; 
    }).join(", ");
    
    // إضافة الصف للجدول
    sheet.appendRow([
      formattedDate,
      data.name,
      data.phone,
      data.date + " " + data.time,
      servicesList,
      data.totalPrice + " ر.س",
      "قيد الانتظار"
    ]);
    
    // 4. إرسال الإشعار إلى بوت تلجرام تلقائياً
    // تذكر استبدال قيم التوكن والـ Chat ID في الموقع أو استخدام الثوابت أدناه إذا أردت تثبيتها برمجياً
    var telegramToken = data.telegramToken || "ضع_توكن_البوت_هنا"; 
    var chatId = data.telegramChatId || "ضع_معرف_الشات_هنا";
    
    if (telegramToken && chatId) {
      sendTelegramNotification(telegramToken, chatId, data, servicesList);
    }
    
    // إرجاع رد ناجح للموقع
    return ContentService.createTextOutput(JSON.stringify({ 
      "status": "success", 
      "message": "تم تسجيل الحجز وإرسال الإشعار بنجاح" 
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ 
      "status": "error", 
      "message": error.toString() 
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function sendTelegramNotification(token, chatId, data, servicesList) {
  var url = "https://api.telegram.org/bot" + token + "/sendMessage";
  
  var text = "🔔 *حجز جديد في صالون ڤيڤيد بيوتي!*\\n\\n" +
             "👤 *الاسم:* " + data.name + "\\n" +
             "📱 *الجوال:* " + data.phone + "\\n" +
             "📅 *التاريخ والوقت:* " + data.date + " | " + data.time + "\\n" +
             "💆‍♀️ *الخدمات المختارة:*\\n" + servicesList + "\\n\\n" +
             "💰 *المجموع الإجمالي:* " + data.totalPrice + " ر.س\\n\\n" +
             "💬 _تفضلي باستخدام الأزرار التفاعلية أدناه للتواصل المباشر مع العميلة:_";
             
  var payload = {
    "chat_id": chatId,
    "text": text,
    "parse_mode": "Markdown",
    "disable_web_page_preview": true,
    "reply_markup": {
      "inline_keyboard": [
        [
          {
            "text": "💬 تواصل واتساب",
            "url": "https://wa.me/" + data.phone.replace(/[^0-9]/g, "")
          },
          {
            "text": "📞 اتصال هاتفي",
            "url": "tel:" + data.phone.replace(/[^0-9]/g, "")
          }
        ],
        [
          {
            "text": "📍 موقع صالون ڤيڤيد بيوتي",
            "url": "https://maps.app.goo.gl/3H9jQ4Ditvi1mBS87"
          }
        ]
      ]
    }
  };
  
  var options = {
    "method": "post",
    "contentType": "application/json",
    "payload": JSON.stringify(payload),
    "muteHttpExceptions": true
  };
  
  UrlFetchApp.fetch(url, options);
}
`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(appsScriptCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-stone-900/90 border border-amber-200/15 rounded-[32px] p-6 text-stone-100 font-sans max-w-4xl mx-auto backdrop-blur-xl shadow-2xl">
      <div className="flex items-center gap-3 border-b border-amber-200/10 pb-4 mb-6">
        <HelpCircle className="w-8 h-8 text-amber-200" />
        <div>
          <h2 className="text-2xl font-bold text-amber-100">دليل إعداد النظام وقاعدة البيانات</h2>
          <p className="text-sm text-stone-400 font-medium">خطوات ربط نموذج الحجز بـ Google Sheets وبوت تلجرام</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Step 1 */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-lg font-bold text-amber-100">
            <span className="bg-amber-200/10 text-amber-200 border border-amber-200/20 w-7 h-7 rounded-full flex items-center justify-center text-sm">١</span>
            <h3>إنشاء جدول بيانات Google Sheets</h3>
          </div>
          <div className="mr-9 text-stone-300 leading-relaxed space-y-2">
            <p>
              ١. افتح حساب <a href="https://sheets.google.com" target="_blank" rel="noreferrer" className="text-amber-200 hover:underline font-bold inline-flex items-center gap-1">جداول بيانات جوجل <ExternalLink className="w-3.5 h-3.5" /></a> وقم بإنشاء جدول فارغ جديد.
            </p>
            <p>
              ٢. قم بتسمية العمود الأول في الصف الأول كالتالي لترتيب البيانات المستلمة:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono bg-stone-950/60 p-3 rounded-2xl border border-amber-200/10 text-center shadow-md">
              <span className="bg-amber-500/5 border border-amber-200/10 text-stone-300 p-1.5 rounded-xl font-semibold">وقت التسجيل (Timestamp)</span>
              <span className="bg-amber-500/5 border border-amber-200/10 text-stone-300 p-1.5 rounded-xl font-semibold">اسم العميلة</span>
              <span className="bg-amber-500/5 border border-amber-200/10 text-stone-300 p-1.5 rounded-xl font-semibold">رقم الجوال</span>
              <span className="bg-amber-500/5 border border-amber-200/10 text-stone-300 p-1.5 rounded-xl font-semibold">تاريخ ووقت الحجز</span>
              <span className="bg-amber-500/5 border border-amber-200/10 text-stone-300 p-1.5 rounded-xl font-semibold">الخدمات المختارة</span>
              <span className="bg-amber-500/5 border border-amber-200/10 text-stone-300 p-1.5 rounded-xl font-semibold">السعر الإجمالي</span>
              <span className="bg-amber-500/5 border border-amber-200/10 text-stone-300 p-1.5 rounded-xl font-semibold">حالة الحجز</span>
            </div>
          </div>
        </section>

        {/* Step 2 */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-lg font-bold text-amber-100">
            <span className="bg-amber-200/10 text-amber-200 border border-amber-200/20 w-7 h-7 rounded-full flex items-center justify-center text-sm">٢</span>
            <h3>الحصول على توكن بوت تلجرام ومعرف الشات</h3>
          </div>
          <div className="mr-9 text-stone-300 leading-relaxed space-y-3">
            <div className="bg-stone-950/60 p-4 rounded-2xl border border-amber-200/10 space-y-2 shadow-md">
              <div className="flex items-center gap-2 text-amber-200 text-sm font-bold mb-1">
                <MessageSquare className="w-4 h-4 text-amber-200" />
                <span>كيف تنشئ بوت تلجرام وتحصل على التوكن (Token)؟</span>
              </div>
              <p className="text-sm">
                افتح تطبيق تلجرام وابحث عن البوت الرسمي <span className="text-amber-200 font-mono font-bold">@BotFather</span>.
              </p>
              <p className="text-sm">
                أرسل له الأمر <code className="bg-amber-200/10 px-1.5 py-0.5 rounded font-mono text-xs text-amber-200 font-bold">/newbot</code> ثم اتبع التعليمات لتسمية بوتك والحصول على الـ <span className="text-amber-200 font-bold">HTTP API Token</span>.
              </p>
            </div>

            <div className="bg-stone-950/60 p-4 rounded-2xl border border-amber-200/10 space-y-2 shadow-md">
              <div className="flex items-center gap-2 text-amber-200 text-sm font-bold mb-1">
                <Database className="w-4 h-4 text-amber-200" />
                <span>كيف تحصل على معرف الدردشة الخاص بك (Chat ID)؟</span>
              </div>
              <p className="text-sm">
                ابحث في تلجرام عن البوت <span className="text-amber-200 font-mono font-bold">@userinfobot</span> وأرسل له أي رسالة، سيقوم فوراً بإرجاع معرف حسابك الخاص <span className="text-amber-200 font-bold">(Id)</span> المكون من أرقام. هذا هو المعرف الذي سيرسل لك البوت الإشعارات عليه.
              </p>
            </div>
          </div>
        </section>

        {/* Step 3 */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-lg font-bold text-amber-100">
            <span className="bg-amber-200/10 text-amber-200 border border-amber-200/20 w-7 h-7 rounded-full flex items-center justify-center text-sm">٣</span>
            <h3>برمجة وتفعيل Google Apps Script (Webhook)</h3>
          </div>
          <div className="mr-9 text-stone-300 leading-relaxed space-y-2">
            <p>
              ١. في ملف جداول بيانات جوجل الذي أنشأته، من القائمة العلوية اضغط على <b>الامتدادات (Extensions)</b> ثم اختر <b>Apps Script</b>.
            </p>
            <p>
              ٢. امسح أي كود موجود في المحرر وضَع الكود البرمجي الموضح بالأسفل تماماً.
            </p>
            <p>
              ٣. اضغط على أيقونة الحفظ (💾).
            </p>
            <p>
              ٤. اضغط على زر <b>نشر (Deploy)</b> في الأعلى ثم اختر <b>نشر جديد (New deployment)</b>.
            </p>
            <p>
              ٥. من نوع النشر، اضغط على الترس واختر <b>تطبيق ويب (Web app)</b>.
            </p>
            <p>
              ٦. قم بتهيئة الإعدادات كالتالي:
            </p>
            <ul className="list-disc list-inside mr-4 text-sm text-stone-400 space-y-1 font-medium">
              <li>الوصف: <span className="text-amber-100 font-bold">نظام حجز صالون ڤيڤيد</span></li>
              <li>تنفيذ التطبيق باسم (Execute as): <span className="text-amber-200 font-bold">أنا (بريدك الإلكتروني)</span></li>
              <li>من لديه صلاحية الدخول (Who has access): <span className="text-amber-200 font-bold">الجميع (Anyone)</span> <span className="text-amber-200 font-extrabold">*مهم جداً لعمل الاتصال الخارجي*</span></li>
            </ul>
            <p className="pt-2">
              ٧. اضغط على <b>Deploy</b>، ستظهر لك نافذة تطلب منك السماح بالصلاحيات (Authorize access)، وافق عليها بالدخول لحسابك واختيار Advanced ثم السماح بالوصول.
            </p>
            <p>
              ٨. بعد اكتمال النشر، انسخ <b>رابط تطبيق الويب (Web App URL)</b> وضعه في لوحة إعدادات الموقع هنا ليرتبط النموذج مباشرة!
            </p>
          </div>
        </section>

        {/* Code Block Section */}
        <div className="relative mt-4 border border-amber-200/15 rounded-2xl overflow-hidden bg-stone-950/60 shadow-md">
          <div className="flex items-center justify-between bg-amber-500/5 px-4 py-2.5 border-b border-amber-200/10 text-sm">
            <span className="font-mono text-amber-200 text-xs font-bold">google-apps-script.js</span>
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-amber-200 hover:bg-stone-800 rounded-xl transition font-bold cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">تم النسخ!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>نسخ الكود</span>
                </>
              )}
            </button>
          </div>
          <pre className="p-4 overflow-x-auto text-xs font-mono text-left leading-relaxed text-stone-200 max-h-[350px]">
            <code>{appsScriptCode}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
