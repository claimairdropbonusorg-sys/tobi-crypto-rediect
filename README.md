# Tobi Crypto Redirect

This project is a simple Next.js app that lists popular cryptocurrencies using the CoinGecko API. It includes:

- Home page with quick links
- Tokens list (search & pagination)
- Token detail page with current data and external redirect (CoinGecko and Uniswap)
- Add Token page that allows adding a custom token stored in localStorage
 - Sign in: `pages/auth/signin.js` — Sign in to a local demo account
 - Sign up: `pages/auth/signup.js` — Create a local demo account (demo only — stored in localStorage)

Quick start (Windows PowerShell):

```powershell
cd "c:\Users\user\Downloads\tobi"
npm install
npm run dev
```

 - Home: http://localhost:3000 (or the static landing at http://localhost:3000/index.html)
- To add more features (persist custom tokens, webhooks, or authenticated area), add a JSON store or a backend with a simple CRUD API.

Deploying on Vercel:
1. Create a free Vercel account and install the CLI or connect your Git repository.
2. Push your code to a GitHub repo and import it into Vercel.
3. Vercel will auto-deploy with no additional configuration. The app is static/SSR and works out of the box.


Local custom tokens: The Add Token page saves custom tokens in your browser's localStorage. These tokens are visible only in the browser where they're added. To persist them globally, you can add a backend to store them.

Auth: This project includes a simple local-only sign-in/sign-up system. It stores users and sessions in localStorage for demonstration purposes only — this is not secure for production. Use a backend to add security and persistent authentication.

Environment variables
1. Copy the example env file to a local env file:

```powershell
cp .env.example .env.local
```

2. Edit `.env.local` and set `NEXT_PUBLIC_COINGECKO_API_KEY` if you have a Pro API key from CoinGecko to increase rate limits, otherwise leave it empty.

3. You can change the default price currency via `NEXT_PUBLIC_DEFAULT_VS_CURRENCY`, e.g. `usd`, `eur`, `gbp`. Only `usd` is used by default.

Production: Set the same build-time env variables in your hosting provider (Vercel, Netlify) and deploy.

Notes on implementation
 - The code uses a small axios client in `lib/api.js` which reads `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_COINGECKO_API_KEY` to call the CoinGecko API. This allows replacing the API endpoint or using your Pro API key without code changes.
 - When running locally, change `NEXT_PUBLIC_DEFAULT_VS_CURRENCY` to test EUR/GBP or USD prices. Restart the dev server after changing `.env.local` for the changes to take effect.

Telegram monitoring
1. Create a Telegram bot via BotFather and get the bot token. See: https://core.telegram.org/bots#6-botfather
2. Obtain the chat ID where the bot should send messages. You can get your user chat id by messaging the bot and using `https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates` or tools like @userinfobot. Set that chat id in `TELEGRAM_CHAT_ID`.
3. Set `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` in `.env.local` (server-side only); restart the server.
4. Set an admin secret `ADMIN_SECRET` to later read logs via `/admin/logs` UI or `GET /api/logs?secret=...`.

The app will automatically send notifications to the configured Telegram chat for the following events:
- user_signup, user_signin, user_signout, user_signup_failed, user_signin_failed
- token_added, token_view

Logs and admin UI
- Events are persisted in `data/logs.json` (demo-only). The admin UI is at `/admin/logs` and requires the `ADMIN_SECRET` to fetch logs.
 - For production, replace file persistence with a database and secure the API with proper authentication.

Security notes for `/api/notify`
- Configure `NOTIFY_API_KEY` in your server environment. The API will reject requests that don't include `x-notify-key` matching `NOTIFY_API_KEY` (server-side key) or `NEXT_PUBLIC_NOTIFY_API_KEY` (for quick client-side testing).
- Client-side `NEXT_PUBLIC_NOTIFY_API_KEY` is available to the browser and therefore insecure. For production, avoid using client-side notify key; instead, have your server send notify events on behalf of users (not exposing server keys to browsers).
- Rate limiting: `/api/notify` has a basic IP rate-limiter (20 requests per minute by default). Adjust `RATE_LIMIT_MAX` and `RATE_LIMIT_WINDOW` in `pages/api/notify.js` if needed.
- Allowed events are limited to a known set (signup/signin/signout/signin_failed/signup_failed/token_view/token_added) and details are truncated to prevent abuse.
 
Demo auth flow
1. Visit `/auth/signup` and create a local user. (This stores the account in localStorage for demo purposes.)
2. You will be redirected and will see your username displayed in the header. The Add Token page is protected; if you try to access `/add-token` while signed out, you'll be redirected to `/auth/signin`.
3. Sign in at `/auth/signin` with the same username and password to restore the session.
4. Sign out using the 'Sign out' button in the header.

Important: This auth flow is purely client-side for demo use. For a secure application, add a backend and store hashed passwords in a database.

Test the notify API locally
1. Start your Next.js dev server:

```powershell
npm run dev
```

2. With your server running, set your `.env.local` variables (use `.env.local` or set environment variables in your shell):

```powershell
# .env.local
NOTIFY_API_KEY=your_server_secret
NEXT_PUBLIC_NOTIFY_API_KEY=your_public_test_key # optional, for client use only
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id
```

3. Send a test event using the included script:

```powershell
npm run test-notify -- token_added testuser "Test token added from local script"
```

Notes:
- The script posts to `http://localhost:3000/api/notify` and will add an entry to `data/logs.json` as well as send a Telegram message if configured.
- Ensure `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` are set if you want to receive Telegram messages.

Deployment: Use Vercel for simple deployment (connect the repo and deploy). The app doesn't require any secret keys.
