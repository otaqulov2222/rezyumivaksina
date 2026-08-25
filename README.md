# Farmatsevt onlayn anketa

Nomzodga qogʻoz oʻrniga **link** berasiz. U bosqichma-bosqich anketani toʻldiradi — sizga **Telegram** orqali chiroyli **PDF rezyume** keladi.

## Tezkor ishga tushirish

### 1. Telegram bot

1. Telegramda [@BotFather](https://t.me/BotFather) oching → `/newbot` → token oling  
2. Botga biror xabar yuboring (yoki guruhga qoʻshing)  
3. Chat ID ni oling: [@userinfobot](https://t.me/userinfobot) yoki  
   `https://api.telegram.org/bot<TOKEN>/getUpdates`

### 2. Sozlash

```bash
copy .env.example .env
```

`.env` ichida:

```
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_ID=...
```

### 3. Ishga tushirish

```bash
npm install
npm run dev
```

Brauzer: **http://localhost:5173**

Nomzodga shu manzilni (yoki hostingdagi linkni) bering.

## Skriptlar

| Buyruq | Vazifa |
|--------|--------|
| `npm run dev` | Frontend + API birga |
| `npm run server` | Faqat API (port 3001) |
| `npm run client` | Faqat Vite |
| `npm run build` | Production build |
| `npm start` | Build + server |

## Linkni internetga chiqarish (test)

Kompyuteringizda ishlayotganda:

```bash
npx localtunnel --port 5173
```

yoki [ngrok](https://ngrok.com) — chiqqan HTTPS linkni nomzodga yuboring.

## Nima yuboriladi

- Qisqa xabar (F.I.Sh., telefon, mutaxassislik…)
- Professional PDF anketa/rezyume
- Yuklangan pasport / diplom / rezyume fayllari (agar boʻlsa)

## Vercel deploy

1. GitHub repo ulangan boʻlsin (`otaqulov2222/rezyumivaksina`)
2. **Environment Variables** qoʻshing:
   - `TELEGRAM_BOT_TOKEN` — BotFather token
   - `TELEGRAM_CHAT_ID` — PDF keladigan chat ID
3. Framework: **Vite** → **Deploy**

Deploydan keyin ochilgan `*.vercel.app` linkni nomzodlarga bering.
