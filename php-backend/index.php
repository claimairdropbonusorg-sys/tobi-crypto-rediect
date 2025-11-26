<?php
// Simple PHP landing page for the PHP backend
$title = 'Tobi Crypto Redirect - PHP Backend';
?>
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?php echo htmlentities($title) ?></title>
    <style>body{font-family:system-ui,Arial;background:#f7fafc;color:#111;padding:2rem}</style>
  </head>
  <body>
    <h1><?php echo htmlentities($title) ?></h1>
    <p>This PHP backend exposes a notify endpoint to persist logs and forward alerts via Telegram.</p>
    <ul>
      <li><a href="/notify.php">POST /notify.php</a></li>
      <li><a href="/logs.php">GET /logs.php</a> - protected with ADMIN_SECRET (query or header)</li>
    </ul>
    <p>If you want to send notifications from your Next.js app, use the /api/notify route on the Node app, or call this PHP endpoint directly from your server.</p>
  </body>
</html>
