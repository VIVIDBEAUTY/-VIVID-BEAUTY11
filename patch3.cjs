const fs = require('fs');
let code = fs.readFileSync('src/components/BookingForm.tsx', 'utf8');

// Replace await fetch with fetch and remove .ok logic
const telegramTarget = /const telegramResponse = await fetch\(`https:\/\/api\.telegram\.org\/bot\$\{config\.telegramToken\}\/sendMessage\`, \{\s*method: "POST",\s*headers: \{\s*"Content-Type": "application\/json",\s*\},\s*body: JSON\.stringify\(\{\s*chat_id: config\.telegramChatId,\s*text: messageText,[\s\S]*?\}\)\s*\}\);\s*if \(telegramResponse\.ok\) \{\s*isSent = true;\s*\}/g;

code = code.replace(telegramTarget, `// Async background fetch
        fetch(\`https://api.telegram.org/bot\${config.telegramToken}/sendMessage\`, {
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
        }).catch(e => console.error(e));`);

const appScriptTarget = /const response = await fetch\(config\.appsScriptUrl, \{\s*method: "POST",\s*mode: "no-cors",\s*\/\/\s*Standard CORS mode for external web app script triggers\s*headers: \{\s*"Content-Type": "application\/json",\s*\},\s*body: JSON\.stringify\(bookingPayload\),\s*\}\);\s*isSent = true;/g;

code = code.replace(appScriptTarget, `fetch(config.appsScriptUrl, {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bookingPayload),
        }).catch(e => console.error(e));`);

// replace button
const buttonTarget = /<button\s*type="submit"\s*disabled=\{isSubmitting \|\| selectedServices\.length === 0\}\s*className="w-full py-3\.5 px-6 rounded-2xl font-bold bg-gradient-to-r from-amber-300 to-amber-100 text-stone-950 hover:from-amber-400 hover:to-amber-200 transition-all transform hover:scale-\[1\.01\] active:scale-\[0\.99\] disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed shadow-lg shadow-amber-950\/40 flex items-center justify-center gap-2 mt-4 cursor-pointer"\s*>[\s\S]*?<\/button>/g;

const buttonReplacement = `<button
          type="submit"
          disabled={isSubmitting || selectedServices.length === 0}
          className="relative w-full py-3.5 px-6 rounded-2xl font-bold bg-stone-800 text-amber-200 transition-all shadow-lg overflow-hidden flex items-center justify-center gap-2 mt-4 cursor-pointer group border border-amber-500/20 disabled:opacity-80"
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
console.log('done');
