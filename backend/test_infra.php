<?php
echo "Starting test...\n";
try {
    $dsn = "pgsql:host=postgres;port=5432;dbname=hackathon;user=admin;password=secret";
    $pdo = new PDO($dsn);
    if ($pdo) {
        echo "Postgres: SUCCESS\n";
    }
} catch (Exception $e) {
    echo "Postgres: FAILED - " . $e->getMessage() . "\n";
}

try {
    $redis = new Redis();
    $redis->connect('redis', 6379);
    echo "Redis: SUCCESS - " . $redis->ping() . "\n";
} catch (Exception $e) {
    echo "Redis: FAILED - " . $e->getMessage() . "\n";
}
echo "Test finished.\n";
