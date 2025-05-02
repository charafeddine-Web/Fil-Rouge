<?php

require __DIR__ . '/vendor/autoload.php';

// Use Laravel environment variables
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

// Get the API token from the command line
$token = $argv[1] ?? null;

if (!$token) {
    echo "Please provide a valid API token as the first argument\n";
    exit(1);
}

// Make a request to the messages endpoint
$ch = curl_init();

// Set up the curl options
curl_setopt($ch, CURLOPT_URL, 'http://localhost:8000/api/messages');
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$headers = [
    'Authorization: Bearer ' . $token,
    'Content-Type: application/json',
    'Accept: application/json'
];

// Request data - adjust user IDs as needed
$data = [
    'to_id' => 2, // Replace with valid recipient ID
    'content' => 'Test message from API test script ' . date('Y-m-d H:i:s')
];

curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

// Execute the request
$response = curl_exec($ch);
$statusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);

curl_close($ch);

// Output the results
echo "Status Code: $statusCode\n";

if ($error) {
    echo "Error: $error\n";
} else {
    echo "Response:\n";
    $formattedJson = json_encode(json_decode($response), JSON_PRETTY_PRINT);
    echo $formattedJson . "\n";
} 