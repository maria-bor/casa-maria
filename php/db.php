<?php
    $dbconfig = require_once 'dbconfig.php';

    try {
        $db = new PDO("mysql:host={$dbconfig['host']};dbname={$dbconfig['name']};charset=utf8",
            $dbconfig['user'],
            $dbconfig['password'], [
                PDO::ATTR_EMULATE_PREPARES => false,
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
    }
    catch (PDOException $error) {
        echo $error->getMessage();
        exit('Database error');

    }