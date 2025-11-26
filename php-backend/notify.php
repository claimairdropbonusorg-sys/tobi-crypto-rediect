<?php
// A simple notify endpoint for the PHP backend.
// Usage: POST /notify.php with JSON payload: { event: 'user_signup', username: 'bob', details: '...' }
// Requires TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID environment variables to send Telegram messages.

header('Content-Type: application/json');

// Read incoming JSON
$raw = file_get_contents('php://input');
$body = json_decode($raw, true);
if (!$body) {
  http_response_code(400);
  echo json_encode(['error' => 'Invalid JSON']);
  exit;
}

$event = $body['event'] ?? null;
$username = $body['username'] ?? 'anonymous';
$details = $body['details'] ?? '';

// Simple whitelist of events
$allowed = ['user_signup','user_signin','user_signout','user_signup_failed','user_signin_failed','token_added','token_view'];
if (!in_array($event, $allowed)) {
  http_response_code(400);
  echo json_encode(['error' => 'Invalid event']);
  exit;
}

// Persist log
$dir = __DIR__ . '/data';
if (!is_dir($dir)) mkdir($dir, 0755, true);
$file = $dir . '/logs.json';
$logs = [];
if (file_exists($file)) {
  $logs = json_decode(file_get_contents($file), true) ?: [];
}
$entry = [
  'event' => $event,
  'username' => $username,
  'details' => substr($details, 0, 512),
  'timestamp' => date(DATE_ATOM),
  'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown'
];
array_unshift($logs, $entry);
file_put_contents($file, json_encode($logs, JSON_PRETTY_PRINT));

// Send Telegram if configured
$botToken = getenv('TELEGRAM_BOT_TOKEN') ?: '';
$chatId = getenv('TELEGRAM_CHAT_ID') ?: '';
if ($botToken && $chatId) {
  $text = sprintf("*%s*\nUser: %s\nTime: %s\nIP: %s\nDetails: %s", $event, $username, $entry['timestamp'], $entry['ip'], $entry['details']);
  $url = 'https://api.telegram.org/bot' . $botToken . '/sendMessage';
  $payload = json_encode(['chat_id' => $chatId, 'text' => $text, 'parse_mode' => 'Markdown']);
  
  $ch = curl_init($url);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($ch, CURLOPT_POST, true);
  curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
  curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
  $resp = curl_exec($ch);
  $err = curl_error($ch);
  curl_close($ch);

  if ($err) {
    // ignore send errors, return success for the notify API
  }
}

echo json_encode(['ok' => true, 'entry' => $entry]);
