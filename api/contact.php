<?php
// Basic contact form handler. Expects JSON: { name, email, message, hp (honeypot optional) }
// Configure a recipient address via environment variable CONTACT_TO (recommended) or edit $fallbackRecipient.

header('Content-Type', 'application/json');
header('Referrer-Policy: no-referrer');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Read input
$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON']);
    exit;
}


$name = trim($data['name'] ?? '');
$email = trim($data['email'] ?? '');
$message = trim($data['message'] ?? '');

if ($name === '' || $email === '' || $message === '') {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid email']);
    exit;
}

$recipient = getenv('CONTACT_TO');
$fallbackRecipient = 'vp.office@woxsen.edu.in';
$to = $recipient ?: $fallbackRecipient;

// Store submission (JSON Lines)
$storageDir = __DIR__ . '/data';
$storageFile = $storageDir . '/contact-submissions.jsonl';


$record = [
    'timestamp' => gmdate('c'),
    'name' => $name,
    'email' => $email,
    'message' => $message,
    'ip' => $_SERVER['REMOTE_ADDR'] ?? null,
    'userAgent' => $_SERVER['HTTP_USER_AGENT'] ?? null,
];

@file_put_contents(
    $storageFile,
    json_encode($record, JSON_UNESCAPED_UNICODE) . "\n",
    FILE_APPEND | LOCK_EX
);

$subject = 'New website contact form submission';
$body = "Name: {$name}\nEmail: {$email}\n\nMessage:\n{$message}\n";
$headers = [];
$headers[] = 'Content-Type: text/plain; charset=UTF-8';
$headers[] = 'Reply-To: ' . $email;

$sent = mail($to, $subject, $body, implode("\r\n", $headers));

if (!$sent) {
    http_response_code(500);
    echo json_encode(['error' => 'Unable to send message']);
    exit;
}

echo json_encode(['ok' => true]);
