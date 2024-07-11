<?php
    include_once "../config/database.php";

    $database = new Database();
    $db = $database->getConnection();

    global $db;
    $query = "SELECT id, `date`, artist, genre, `location`, title, likes FROM song";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $songs = $stmt->fetchAll(PDO::FETCH_ASSOC);    
    echo json_encode($songs);  
?>
