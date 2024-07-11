<?php
    include_once "../config/database.php";

    $database = new Database();
    $db = $database->getConnection();

    $title = $_GET['title'];
    $likes = $_GET['likes'];

    global $db;
    $query = "UPDATE song SET likes=:likes WHERE title=:title";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':title', $title);
    $stmt->bindParam(':likes', $likes);
    $stmt->execute();
?>
