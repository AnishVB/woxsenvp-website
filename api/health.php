<?php
// Organization: Woxsen University | Category: Health Check API
header('Content-Type: application/json');

echo json_encode([
    'status' => 'ok',
    'timestamp' => gmdate('c'),
]);
