<?php
// Simple health check endpoint for uptime monitoring.
header('Content-Type: application/json');

echo json_encode([
    'status' => 'ok',
    'timestamp' => gmdate('c'),
]);
