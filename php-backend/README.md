PHP Backend for Tobi Crypto Redirect (demo)
=========================================

This small PHP backend is a demo server that accepts notification events, persists them to `php-backend/data/logs.json`, and forwards messages to Telegram using the Bot API.

Files
- `index.php` — landing page that documents the API
- `notify.php` — POST endpoint to create a log entry and send a Telegram message
- `logs.php` — GET endpoint to read recent log entries (requires `ADMIN_SECRET`)
- `data/logs.json` — file where events are stored (ignored by git)

Environment
- `TELEGRAM_BOT_TOKEN` — Your telegram bot token (from @BotFather)
- `TELEGRAM_CHAT_ID` — Chat ID to send messages to
- `ADMIN_SECRET` — small secret to access `logs.php`

Run locally using the PHP built-in web server:

```powershell
cd php-backend
php -S 0.0.0.0:8080
```

Set environment variables before running (PowerShell example):

```powershell
$env:TELEGRAM_BOT_TOKEN = "<your-token>"
$env:TELEGRAM_CHAT_ID = "<chat-id>"
$env:ADMIN_SECRET = "changeme"
php -S 0.0.0.0:8080
```

Test notify with curl:

```powershell
curl -X POST http://localhost:8080/notify.php -H "Content-Type: application/json" -d "{ \"event\": \"user_signup\", \"username\": \"bob\", \"details\": \"PHP backend test\" }"
```

View logs (protected):

```powershell
curl "http://localhost:8080/logs.php?secret=changeme"
```

Use with Next.js
---------------
If you prefer, call the PHP backend's `notify.php` endpoint from your server or from a Next.js API route instead of the Node notify route. For example, update `NOTIFY_TEST_URL` or call this endpoint directly for server-only notifications.

Security
--------
This is a demo backend. For production:
- Protect the endpoint with proper authentication and CSRF protections.
- Don't store sensitive secrets in `.env.local` or text files that may be committed.
- Use a database for persistence instead of a flat JSON file.
