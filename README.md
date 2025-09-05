# 💹 ترکر ارزهای دیجیتال تلگرام

<div align="center">

![Crypto Tracker](https://img.shields.io/badge/Crypto-Tracker-purple?style=for-the-badge&logo=telegram)
![Cloudflare](https://img.shields.io/badge/Cloudflare-Workers-orange?style=for-the-badge&logo=cloudflare)
![Persian](https://img.shields.io/badge/Persian-Support-green?style=for-the-badge)

**ربات تلگرام و وب اپ زیبا برای نمایش قیمت‌های لحظه‌ای ارزهای دیجیتال از نوبیتکس**

[🚀 شروع سریع](#-شروع-سریع) • [📖 راهنما](#-راهنمای-کامل-نصب) • [🎨 ویژگی‌ها](#-ویژگی‌ها) • [🔧 تنظیمات](#-تنظیمات-پیشرفته)

</div>

---

## 🎯 این پروژه چیست؟

این پروژه شامل **سه بخش** است:
- 🤖 **ربات تلگرام** - ارسال قیمت‌ها به صورت خودکار
- 🌐 **وب اپ زیبا** - نمایش قیمت‌ها با طراحی مدرن
- ⏰ **بروزرسانی خودکار** - هر دقیقه قیمت‌ها آپدیت می‌شوند

---

## ✨ ویژگی‌ها

### 🤖 ربات تلگرام
- ✅ ارسال قیمت‌ها با فرمان `/start`
- ✅ منوی تعاملی با دکمه‌های شیک
- ✅ پشتیبانی از Inline Keyboard
- ✅ ارسال خودکار قیمت‌ها در زمان‌های مشخص

### 🌐 وب اپ
- ✅ طراحی مدرن و ریسپانسیو
- ✅ انیمیشن‌های زیبا و تعاملی
- ✅ پشتیبانی کامل از موبایل
- ✅ بروزرسانی خودکار هر 30 ثانیه
- ✅ فونت‌های فارسی زیبا

### 🔧 امکانات فنی
- ✅ میزبانی رایگان روی Cloudflare Workers
- ✅ API مستقل برای دریافت داده‌ها
- ✅ قابلیت کرون جاب برای بروزرسانی خودکار
- ✅ پشتیبانی کامل از فارسی (RTL)

---

## 🚀 شروع سریع

### پیش‌نیازها
- حساب کاربری رایگان [Cloudflare](https://dash.cloudflare.com/sign-up)
- ربات تلگرام از [@BotFather](https://t.me/BotFather)
- نصب [Node.js](https://nodejs.org/) روی سیستم

---

## 📖 راهنمای کامل نصب

### مرحله ۱: ساخت ربات تلگرام

1. **به [@BotFather](https://t.me/BotFather) پیام دهید**
2. **دستور `/newbot` را ارسال کنید**
3. **نام ربات را انتخاب کنید** (مثل: `ارزیار من`)
4. **یوزرنیم ربات را انتخاب کنید** (مثل: `my_crypto_bot`)
5. **توکن ربات را کپی کنید** (مثل: `5744015922:AAEOER...`)

### مرحله ۲: دریافت Chat ID

1. **ربات خودتان را استارت کنید**
2. **به آدرس زیر بروید:**
   ```
   https://api.telegram.org/bot[BOT_TOKEN]/getUpdates
   ```
   > توکن ربات را جایگزین `[BOT_TOKEN]` کنید

3. **عدد `chat.id` را کپی کنید**

### مرحله ۳: نصب Wrangler CLI

```bash
# نصب wrangler به صورت سراسری
npm install -g wrangler

# لاگین به cloudflare
npx wrangler login
```

### مرحله ۴: دانلود و آماده‌سازی پروژه

```bash
# کلون پروژه
git clone https://github.com/mrsinano/telegram-welcome-cf.git
cd telegram-welcome-cf

# نصب وابستگی‌ها
npm install
```

### مرحله ۵: تنظیم فایل wrangler.toml

فایل `wrangler.toml` را باز کرده و اطلاعات خود را وارد کنید:

```toml
name = "my-crypto-tracker"        # نام دلخواه پروژه
main = "src/index.js"
compatibility_date = "2025-08-31"
compatibility_flags = ["nodejs_compat"]

[vars]
BOT_TOKEN = "توکن_ربات_شما"
CURRENCY_LIST = '["usdt","btc","eth","bnb","ada"]'  # ارزهای مورد نظر
TELEGRAM_CHAT_ID = "چت_آی_دی_شما"

[triggers]
crons = ["*/5 * * * *"]  # هر 5 دقیقه یکبار (قابل تغییر)
```

### مرحله ۶: انتشار روی Cloudflare

```bash
# انتشار پروژه
npx wrangler deploy

# تنظیم webhook برای ربات تلگرام
curl -X POST "https://api.telegram.org/bot[BOT_TOKEN]/setWebhook" \
     -H "Content-Type: application/json" \
     -d '{"url": "https://my-crypto-tracker.[USERNAME].workers.dev/bot"}'
```

---

## 🔗 نحوه استفاده

پس از انتشار موفق پروژه، لینک‌های زیر در دسترس شما خواهند بود:

| بخش | آدرس | توضیح |
|-----|-------|--------|
| 🤖 **ربات تلگرام** | `@your_bot_username` | ربات را در تلگرام استارت کنید |
| 🌐 **وب اپ** | `https://your-worker.workers.dev/web` | نمایش قیمت‌ها در مرورگر |
| 🔗 **API** | `https://your-worker.workers.dev/api` | دریافت داده‌ها به صورت JSON |
| 📊 **داده‌های نوبیتکس** | `https://your-worker.workers.dev/nobitex` | قیمت‌های فیلتر شده |

---

## 🎨 تصاویر و نمونه‌ها

### 🤖 ربات تلگرام
```
💹 آخرین قیمت ارزها

1. USDT ➝ 69,850 ریال
2. BTC ➝ 2,890,000,000 ریال
3. ETH ➝ 185,000,000 ریال

🕒 بروزرسانی: 14:30:25
```

### 🌐 وب اپ
- طراحی Dark Mode زیبا
- انیمیشن‌های روان و تعاملی
- ریسپانسیو برای موبایل و دسکتاپ
- بروزرسانی خودکار

---

## 🔧 تنظیمات پیشرفته

### تغییر زمان‌بندی کرون جاب

در فایل `wrangler.toml`:
```toml
[triggers]
crons = ["0 */6 * * *"]    # هر 6 ساعت یکبار
# یا
crons = ["0 9 * * *"]      # هر روز ساعت 9 صبح
# یا  
crons = ["*/1 * * * *"]    # هر دقیقه یکبار
```

### اضافه کردن ارزهای جدید

```toml
CURRENCY_LIST = '["usdt","btc","eth","bnb","ada","dot","link","ltc"]'
```

### تنظیم متغیرهای محیطی (Secrets)

```bash
# تنظیم توکن به صورت مخفی
wrangler secret put BOT_TOKEN

# تنظیم Chat ID به صورت مخفی  
wrangler secret put TELEGRAM_CHAT_ID
```

---

## 🆘 رفع مشکلات رایج

### ❌ خطای "Webhook not set"
```bash
# بررسی وضعیت webhook
curl "https://api.telegram.org/bot[BOT_TOKEN]/getWebhookInfo"

# تنظیم مجدد webhook
curl -X POST "https://api.telegram.org/bot[BOT_TOKEN]/setWebhook" \
     -d "url=https://your-worker.workers.dev/bot"
```

### ❌ خطای "Invalid token"
- توکن ربات را از @BotFather دوباره دریافت کنید
- مطمئن شوید توکن در `wrangler.toml` درست وارد شده

### ❌ خطای "Chat not found"
- Chat ID را دوباره دریافت کنید
- مطمئن شوید عدد درست کپی شده (بدون پرانتز یا فاصله)

### ❌ ربات پاسخ نمی‌دهد
```bash
# بررسی logs
wrangler tail

# تست دستی webhook
curl -X POST https://your-worker.workers.dev/bot \
     -H "Content-Type: application/json" \
     -d '{"message":{"text":"/start","chat":{"id":123456}}}'
```

---

## 📚 API مستندات

### دریافت قیمت‌ها
```http
GET /nobitex
```

**پاسخ:**
```json
[
  {
    "name": "usdt",
    "price": 69850,
    "displayPrice": "69,850"
  }
]
```

### ارسال پیام تلگرام
```http
POST /bot
Content-Type: application/json

{
  "message": {
    "text": "/start",
    "chat": {"id": 123456}
  }
}
```

---

## 🤝 مشارکت و توسعه

### ساختار پروژه
```
├── src/
│   └── index.js          # فایل اصلی ربات و وب اپ
├── wrangler.toml         # تنظیمات Cloudflare
├── package.json          # وابستگی‌های npm  
└── README.md            # این فایل
```

### اضافه کردن ویژگی جدید
1. فورک پروژه را بگیرید
2. برنچ جدید بسازید: `git checkout -b feature/new-feature`
3. تغییرات را commit کنید: `git commit -m 'Add some feature'`
4. برنچ را push کنید: `git push origin feature/new-feature`
5. Pull Request بسازید

---

## 📞 پشتیبانی

اگر سوالی دارید یا به مشکل خوردید:

- 🐛 [Issues](https://github.com/mrsinano/telegram-welcome-cf/issues) - گزارش باگ
- 💬 [Discussions](https://github.com/mrsinano/telegram-welcome-cf/discussions) - سوال و بحث

---

## 📄 مجوز

این پروژه تحت مجوز MIT منتشر شده است. [جزئیات بیشتر](LICENSE)

---

## ⭐ حمایت از پروژه

اگر این پروژه برایتان مفید بود:
- ⭐ به پروژه ستاره بدهید
- 🍴 فورک کنید و توسعه دهید  
- 📢 با دوستان به اشتراک بگذارید
- ☕ قهوه‌ای برای توسعه‌دهنده بخرید

---

<div align="center">

**با ❤️ توسط [نام شما](https://github.com/mrsinano) ساخته شده**

![Footer](https://capsule-render.vercel.app/api?type=waving&color=gradient&height=100&section=footer)

</div>
