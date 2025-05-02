<?php

require __DIR__ . '/vendor/autoload.php';

// Use Laravel environment variables
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

// Get database configuration from .env
$host = $_ENV['DB_HOST'] ?? 'localhost';
$database = $_ENV['DB_DATABASE'];
$username = $_ENV['DB_USERNAME'];
$password = $_ENV['DB_PASSWORD'];
$port = $_ENV['DB_PORT'] ?? 5432;

try {
    // Connect to PostgreSQL
    $pdo = new PDO(
        "pgsql:host=$host;port=$port;dbname=$database", 
        $username, 
        $password
    );
    
    // Set error mode to exceptions
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "Connected to PostgreSQL successfully!\n";
    
    // 1. Enable UUID extension
    try {
        $pdo->exec('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
        echo "UUID extension enabled (or already exists).\n";
    } catch (PDOException $e) {
        echo "Error enabling UUID extension: " . $e->getMessage() . "\n";
    }
    
    // 2. Test if UUID generation works
    try {
        $stmt = $pdo->query('SELECT uuid_generate_v4() AS uuid');
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        echo "Successfully generated UUID: " . $result['uuid'] . "\n";
        
        // 3. Test insert with UUID
        $uuid = $result['uuid'];
        $fromId = 1; // Replace with valid user ID
        $toId = 2;   // Replace with valid user ID
        $content = "Test message with UUID " . rand(1000, 9999);
        
        $sql = "
            INSERT INTO messages (id, from_id, to_id, body, seen, created_at, updated_at) 
            VALUES (:id, :from_id, :to_id, :body, false, NOW(), NOW())
        ";
        
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':id', $uuid);
        $stmt->bindParam(':from_id', $fromId);
        $stmt->bindParam(':to_id', $toId);
        $stmt->bindParam(':body', $content);
        $stmt->execute();
        
        echo "Message inserted successfully with UUID: $uuid\n";
    } catch (PDOException $e) {
        echo "Error testing UUID: " . $e->getMessage() . "\n";
    }
    
} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage() . "\n";
} 