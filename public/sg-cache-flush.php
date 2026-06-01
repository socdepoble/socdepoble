<?php
/**
 * SiteGround Dynamic Cache Purge Bridge for Sóc de Poble
 * This script runs locally on the SG server to clear the NGINX cache programmatically.
 */

// Simple security token (hardcoded for simplicity in this stateless architecture)
$VALID_TOKEN = "trellat_purga_maxima_482"; // Token de seguretat

// Ensure JSON response
header('Content-Type: application/json');

// Check token
$provided_token = isset($_GET['token']) ? $_GET['token'] : '';
if ($provided_token !== $VALID_TOKEN) {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Unauthorized access. Token invalid."]);
    exit;
}

$domains = [
    "socdepoble.org",
    "socdepoble.com",
    "socdepoble.cat",
    "somdepoble.com"
];

$results = [];
$all_success = true;

foreach ($domains as $domain) {
    $ch = curl_init();
    
    // Send a PURGE request to the local NGINX proxy
    curl_setopt($ch, CURLOPT_URL, "http://127.0.0.1/*");
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PURGE");
    curl_setopt($ch, CURLOPT_HTTPHEADER, ["Host: $domain"]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 5); // 5 seconds timeout

    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curl_error = curl_error($ch);
    
    // curl_close() no és necessari des de PHP 8.0+ i deprecat en 8.5+

    // SiteGround's cache proxy normally returns 200 or 204 on successful PURGE
    $success = ($http_code === 200 || $http_code === 204 || $http_code === 404); // 404 might mean not cached, which is fine
    
    if (!$success) {
        $all_success = false;
    }

    $results[$domain] = [
        "success" => $success,
        "http_code" => $http_code,
        "response" => $response,
        "error" => $curl_error
    ];
}

if ($all_success) {
    http_response_code(200);
    echo json_encode([
        "status" => "success", 
        "message" => "Caché dinàmica purgada amb èxit en tots els dominis.", 
        "details" => $results
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        "status" => "warning", 
        "message" => "S'ha intentat purgar la caché, però alguns dominis han reportat errors.", 
        "details" => $results
    ]);
}
?>
