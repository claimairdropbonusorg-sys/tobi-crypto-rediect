<?php
// Admin logs viewer for the PHP backend. Requires ADMIN_SECRET as query param or X-ADMIN-SECRET header.
header('Content-Type: application/json');

$adminSecret = getenv('ADMIN_SECRET') ?: '';
$provided = $_GET['secret'] ?? ($_SERVER['HTTP_X_ADMIN_SECRET'] ?? '');
if (!$adminSecret || $provided !== $adminSecret) {
  http_response_code(403);
  echo json_encode(['error' => 'Forbidden']);
  exit;
}

$file = __DIR__ . '/data/logs.json';
$logs = [];
if (file_exists($file)) $logs = json_decode(file_get_contents($file), true) ?: [];
echo json_encode(['logs' => array_slice($logs, 0, 200)]);
