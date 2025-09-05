import { Bot, InlineKeyboard } from "grammy/web";

export default {

    async sendPrices (env, chatId) {
      try {
      const allowed = JSON.parse(env.CURRENCY_LIST);

      // گرفتن داده‌ها از نوبیتکس
      const nobitexRes = await fetch(
        "https://apiv2.nobitex.ir/market/stats?srcCurrency=&dstCurrency=rls"
      );
      const prices = await nobitexRes.json();

      // فیلتر کردن ارزهای موردنظر
      const filtered = Object.entries(prices.stats)
        .filter(([key]) => allowed.includes(key.replace("-rls", "")))
        .map(([key, data]) => ({
          name: key.replace("-rls", ""),
          price: Number(data.latest),
          displayPrice: Number(data.latest).toLocaleString("en-US")
        }));
        const tehranTime = new Date().toLocaleString('fa-IR', {
  timeZone: 'Asia/Tehran',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit'
});
      // ساخت متن خوشگل
      const text =
        "💹 *آخرین قیمت ارزها*\n\n" +
        filtered
          .map(
            (item, i) =>
              `${i + 1}. *${item.name.toUpperCase()}* ➝ \`${item.displayPrice}\` ریال`
          )
          .join("\n") +
        `\n\n🕒 بروزرسانی: ${tehranTime}`;

      // ارسال پیام به تلگرام
      await fetch(
        `https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text,
            parse_mode: "Markdown"
          })
        }
      );
    } catch (err) {
      console.error("Cron error:", err.message);
    }
    },
    async scheduled(event, env, ctx) {
      await this.sendPrices(env, env.TELEGARM_CHAT_ID);
  },


  async fetch(request, env) {
    const url = new URL(request.url);
    const allowed = JSON.parse(env.CURRENCY_LIST);

    // ================== مسیر /bot برای تلگرام ==================
    if (request.method === "POST" && url.pathname === "/bot") {
      const bot = new Bot(env.BOT_TOKEN);
      await bot.init();

      bot.command("start", async (ctx) => { await this.sendPrices(env, ctx.message.from.id)});
      bot.command("menu", ctx =>
        ctx.reply("منو انتخاب کن:", {
          reply_markup: {
            keyboard: [
              [{ text: "📊 وضعیت" }, { text: "ℹ️ راهنما" }],
              [{ text: "❌ بستن کیبورد" }]
            ],
            resize_keyboard: true
          }
        })
      );
      bot.command("inline", ctx => {
        const kb = new InlineKeyboard()
          .text("📢 کانال", "channel")
          .row()
          .url("🌐 سایت", "https://example.com");
        return ctx.reply("انتخاب کن:", { reply_markup: kb });
      });
      bot.callbackQuery("channel", ctx =>
        ctx.answerCallbackQuery("لینک کانال ارسال شد!")
      );
      bot.on("message", ctx => ctx.reply("پیامت رسید ✅"));

      const update = await request.json();
      await bot.handleUpdate(update, request);
      return new Response("OK");
    }

    // ================== مسیر /api ==================
    if (url.pathname.startsWith("/api")) {
      return new Response(JSON.stringify({ msg: "API Response" }), {
        headers: { "content-type": "application/json" }
      });
    }

    // ================== مسیر /nobitex ==================
    if (url.pathname.startsWith("/nobitex")) {
      try {
        const nobitexRes = await fetch(
          "https://apiv2.nobitex.ir/market/stats?srcCurrency=&dstCurrency=rls",
          { method: "GET" }
        );

        if (!nobitexRes.ok) throw new Error(`HTTP error: ${nobitexRes.status}`);

        const prices = await nobitexRes.json();
        const filtered = Object.entries(prices.stats)
          .filter(([key]) => allowed.includes(key.replace("-rls", "")))
          .map(([key, data]) => ({
            name: key.replace("-rls", ""),
            price: Number(data.latest),
            displayPrice: Number(data.latest).toLocaleString("en-US")
          }));

        return new Response(JSON.stringify(filtered), {
          headers: { "Content-Type": "application/json" }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: { "content-type": "application/json" }
        });
      }
    }

    // ================== مسیر /web ==================
    if (url.pathname.startsWith("/web")) {
      try {
        const nobitexRes = await fetch(
          "https://apiv2.nobitex.ir/market/stats?srcCurrency=&dstCurrency=rls",
          { method: "GET" }
        );
        const prices = await nobitexRes.json();
        const filtered = Object.entries(prices.stats)
          .filter(([key]) => allowed.includes(key.replace("-rls", "")))
          .map(([key, data]) => ({
            name: key.replace("-rls", ""),
            price: Number(data.latest),
            displayPrice: Number(data.latest).toLocaleString("en-US")
          }));

        const html = `
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>💹 ترکر ارزهای دیجیتال</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * {
      font-family: 'Vazirmatn', sans-serif;
    }
    
    body {
      background: linear-gradient(135deg, #0f0f23, #1a1a2e, #16213e);
      min-height: 100vh;
    }
    
    .glass-card {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    }
    
    .neon-glow {
      box-shadow: 0 0 20px rgba(139, 92, 246, 0.3);
    }
    
    .floating-particles {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: -1;
    }
    
    .particle {
      position: absolute;
      width: 4px;
      height: 4px;
      background: rgba(139, 92, 246, 0.6);
      border-radius: 50%;
      animation: float 6s ease-in-out infinite;
    }
    
    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0; }
      50% { transform: translateY(-100px) rotate(180deg); opacity: 1; }
    }
    
    .currency-row {
      transition: all 0.3s ease;
    }
    
    .currency-row:hover {
      background: rgba(139, 92, 246, 0.1);
      transform: translateX(-5px);
    }
    
    .pulse-animation {
      animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }
    
    .slide-in {
      animation: slideIn 0.5s ease-out forwards;
    }
    
    @keyframes slideIn {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .gradient-text {
      background: linear-gradient(135deg, #8b5cf6, #a855f7, #c084fc);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    /* Mobile Card Style for Table */
    @media (max-width: 768px) {
      .desktop-table {
        display: none;
      }
      
      .mobile-cards {
        display: block;
      }
      
      .currency-card {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 16px;
        margin-bottom: 16px;
        padding: 20px;
        transition: all 0.3s ease;
      }
      
      .currency-card:hover {
        background: rgba(139, 92, 246, 0.1);
        transform: scale(1.02);
        box-shadow: 0 10px 30px rgba(139, 92, 246, 0.2);
      }
    }
    
    @media (min-width: 769px) {
      .desktop-table {
        display: block;
      }
      
      .mobile-cards {
        display: none;
      }
    }
    
    /* Enhanced hover effects for desktop */
    @media (min-width: 769px) {
      .currency-row:hover {
        background: linear-gradient(90deg, rgba(139, 92, 246, 0.1), rgba(168, 85, 247, 0.1));
        transform: translateX(-5px) scale(1.01);
        box-shadow: 0 5px 15px rgba(139, 92, 246, 0.2);
      }
    }
    
    /* Mobile optimizations */
    @media (max-width: 640px) {
      .particle {
        width: 2px;
        height: 2px;
      }
      
      .floating-particles {
        opacity: 0.5;
      }
    }
  </style>
</head>
<body class="min-h-screen relative">
  <!-- Floating Particles Background -->
  <div class="floating-particles">
    <div class="particle" style="left: 10%; animation-delay: 0s;"></div>
    <div class="particle" style="left: 20%; animation-delay: 1s;"></div>
    <div class="particle" style="left: 30%; animation-delay: 2s;"></div>
    <div class="particle" style="left: 40%; animation-delay: 3s;"></div>
    <div class="particle" style="left: 50%; animation-delay: 4s;"></div>
    <div class="particle" style="left: 60%; animation-delay: 5s;"></div>
    <div class="particle" style="left: 70%; animation-delay: 0.5s;"></div>
    <div class="particle" style="left: 80%; animation-delay: 1.5s;"></div>
    <div class="particle" style="left: 90%; animation-delay: 2.5s;"></div>
  </div>

  <!-- Main Container -->
  <div class="min-h-screen py-4 sm:py-8">
    <div class="w-full max-w-4xl mx-auto px-2 sm:px-4">
      <!-- Header -->
      <div class="text-center mb-6 sm:mb-8 slide-in">
        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold gradient-text mb-2 sm:mb-3 px-4">
          💹 ترکر ارزهای دیجیتال
        </h1>
        <p class="text-gray-300 text-sm sm:text-base lg:text-lg px-4">
          آخرین قیمت‌های ارزهای دیجیتال از نوبیتکس
        </p>
        <div class="w-16 sm:w-24 h-1 bg-gradient-to-r from-purple-500 to-violet-500 mx-auto mt-2 sm:mt-3 rounded-full"></div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div class="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center slide-in">
          <div class="text-2xl sm:text-3xl mb-2">🚀</div>
          <div class="text-xl sm:text-2xl font-bold text-green-400">${filtered.length}</div>
          <div class="text-sm sm:text-base text-gray-300">ارز فعال</div>
        </div>
        <div class="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center slide-in">
          <div class="text-2xl sm:text-3xl mb-2">⚡</div>
          <div class="text-xl sm:text-2xl font-bold text-blue-400 pulse-animation">زنده</div>
          <div class="text-sm sm:text-base text-gray-300">بروزرسانی</div>
        </div>
        <div class="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center slide-in sm:col-span-2 lg:col-span-1">
          <div class="text-2xl sm:text-3xl mb-2">📈</div>
          <div class="text-xl sm:text-2xl font-bold text-purple-400">ریالی</div>
          <div class="text-sm sm:text-base text-gray-300">قیمت‌گذاری</div>
        </div>
      </div>

      <!-- Main Table Container -->
      <div class="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 neon-glow slide-in">
        <div class="flex flex-col sm:flex-row items-center justify-between mb-4 sm:mb-6 gap-4">
          <h2 class="text-lg sm:text-xl lg:text-2xl font-bold text-white flex items-center gap-2 sm:gap-3">
            <span class="w-2 sm:w-3 h-2 sm:h-3 bg-green-500 rounded-full animate-ping"></span>
            قیمت‌های لحظه‌ای
          </h2>
          <button onclick="location.reload()" class="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 px-4 py-2 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 hover:scale-105 active:scale-95 touch-manipulation">
            🔄 بروزرسانی
          </button>
        </div>

        <!-- Desktop Table -->
        <div class="desktop-table overflow-x-auto rounded-xl sm:rounded-2xl">
          <table class="w-full min-w-full">
            <thead>
              <tr class="bg-gradient-to-r from-purple-600/20 to-violet-600/20 border-b border-white/10">
                <th class="text-right py-3 sm:py-4 px-3 sm:px-6 text-base sm:text-lg font-semibold text-purple-200 whitespace-nowrap">
                  🪙 نام ارز
                </th>
                <th class="text-right py-3 sm:py-4 px-3 sm:px-6 text-base sm:text-lg font-semibold text-purple-200 whitespace-nowrap">
                  💰 قیمت (ریال)
                </th>
                <th class="text-right py-3 sm:py-4 px-3 sm:px-6 text-base sm:text-lg font-semibold text-purple-200 whitespace-nowrap">
                  📊 وضعیت
                </th>
              </tr>
            </thead>
            <tbody>
              ${filtered.map((item, index) => `
                <tr class="currency-row border-b border-white/5 hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-violet-500/10" style="animation-delay: ${index * 0.1}s;">
                  <td class="py-3 sm:py-5 px-3 sm:px-6 whitespace-nowrap">
                    <div class="flex items-center gap-2 sm:gap-3">
                      <div class="w-8 sm:w-10 h-8 sm:h-10 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm">
                        ${item.name.charAt(0)}
                      </div>
                      <div>
                        <div class="text-base sm:text-xl font-bold text-white">${item.name.toUpperCase()}</div>
                        <div class="text-xs sm:text-sm text-gray-400">ارز دیجیتال</div>
                      </div>
                    </div>
                  </td>
                  <td class="py-3 sm:py-5 px-3 sm:px-6 whitespace-nowrap">
                    <div class="text-lg sm:text-2xl font-bold text-green-400 font-mono">
                      ${item.displayPrice}
                    </div>
                    <div class="text-xs sm:text-sm text-gray-400">ریال ایران</div>
                  </td>
                  <td class="py-3 sm:py-5 px-3 sm:px-6 whitespace-nowrap">
                    <span class="inline-flex items-center gap-1 sm:gap-2 bg-green-500/20 text-green-400 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                      <span class="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-green-500 rounded-full animate-pulse"></span>
                      فعال
                    </span>
                  </td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>

        <!-- Mobile Cards -->
        <div class="mobile-cards">
          ${filtered.map((item, index) => `
            <div class="currency-card slide-in" style="animation-delay: ${index * 0.1}s;">
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center font-bold text-lg">
                    ${item.name.charAt(0)}
                  </div>
                  <div>
                    <div class="text-xl font-bold text-white">${item.name.toUpperCase()}</div>
                    <div class="text-sm text-gray-400">ارز دیجیتال</div>
                  </div>
                </div>
                <span class="inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-3 py-1.5 rounded-full text-sm font-medium">
                  <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  فعال
                </span>
              </div>
              
              <div class="border-t border-white/10 pt-4">
                <div class="flex items-center justify-between">
                  <span class="text-gray-300">💰 قیمت:</span>
                  <div class="text-left">
                    <div class="text-2xl font-bold text-green-400 font-mono">
                      ${item.displayPrice}
                    </div>
                    <div class="text-sm text-gray-400">ریال ایران</div>
                  </div>
                </div>
              </div>
            </div>
          `).join("")}
        </div>

        <!-- Footer Info -->
        <div class="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
          <div class="text-gray-400 text-xs sm:text-sm text-center sm:text-right">
            📡 آخرین بروزرسانی: ${new Date().toLocaleString('fa-IR')}
          </div>
          <div class="flex items-center gap-2 text-gray-400 text-xs sm:text-sm">
            <span class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            داده‌ها از نوبیتکس
          </div>
        </div>
      </div>

      <!-- Bottom Action Bar -->
      <div class="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4">
        <button onclick="window.open('https://nobitex.ir', '_blank')" class="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 touch-manipulation">
          🔗 نوبیتکس
        </button>
        <button onclick="navigator.share && navigator.share({title: 'ترکر ارزهای دیجیتال', url: window.location.href}).catch(() => {})" class="w-full sm:w-auto bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 touch-manipulation">
          📤 اشتراک‌گذاری
        </button>
      </div>
    </div>
  </div>

  <script>
    // Auto refresh every 30 seconds
    setTimeout(() => {
      location.reload();
    }, 30000);

    // Add entrance animations
    document.addEventListener('DOMContentLoaded', () => {
      const rows = document.querySelectorAll('.currency-row');
      const cards = document.querySelectorAll('.currency-card');
      const elements = [...rows, ...cards];
      
      elements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        setTimeout(() => {
          element.style.transition = 'all 0.5s ease';
          element.style.opacity = '1';
          element.style.transform = 'translateY(0)';
        }, index * 100);
      });
    });

    // Add click ripple effect
    document.querySelectorAll('button').forEach(button => {
      button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = \`
          position: absolute;
          width: \${size}px;
          height: \${size}px;
          left: \${x}px;
          top: \${y}px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          transform: scale(0);
          animation: ripple 0.6s ease-out;
          pointer-events: none;
        \`;
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
      });
    });

    // Add ripple animation
    const style = document.createElement('style');
    style.textContent = \`
      @keyframes ripple {
        to {
          transform: scale(2);
          opacity: 0;
        }
      }
    \`;
    document.head.appendChild(style);
  </script>
</body>
</html>
        `;

        return new Response(html, {
          headers: { "content-type": "text/html; charset=UTF-8" }
        });
      } catch (err) {
        const errorHtml = `
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>خطا در بارگذاری</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;600&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Vazirmatn', sans-serif; }
  </style>
</head>
<body class="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-900 flex items-center justify-center p-4">
  <div class="bg-white/10 backdrop-blur-lg rounded-3xl p-8 max-w-md text-center border border-white/20">
    <div class="text-6xl mb-4">❌</div>
    <h1 class="text-2xl font-bold text-white mb-4">خطا در دریافت داده</h1>
    <p class="text-red-200 mb-6">${err.message}</p>
    <button onclick="location.reload()" class="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-xl text-white font-medium transition-all duration-300 hover:scale-105">
      🔄 تلاش مجدد
    </button>
  </div>
</body>
</html>
        `;
        
        return new Response(errorHtml, {
          status: 500,
          headers: { "content-type": "text/html; charset=UTF-8" }
        });
      }
    }

    // ================== Not Found ==================
    return new Response("Not Found", { status: 404 });
  }
};