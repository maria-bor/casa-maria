<?php
    session_start();

    redirect();

    require_once "db.php";

    // Mozna tu przyjsc tylko z konkretnych formularzy:
    if (isset($_POST['nameType'])) { // dodawania typu pokoju
        $name_type = $_POST['nameType'];
        $_SESSION['form_name_type'] = $name_type;

        // Sprawdzamy czy nie ma juz takiego typu:
        $sql = 'SELECT idType as id_type
                FROM type t
                WHERE t.name = :nameType';
        $query = $db->prepare($sql);
		$query->bindValue(':nameType', $name_type, PDO::PARAM_STR);
        $query->execute();

        $user = $query->fetch();
        // print_r($user);
        // Jak jest to info, ze juz jest
        if ($query->rowCount() != 0) {
            $_SESSION['error_name_type'] = 'Typ '.$name_type.' juz istnieje';
            header('Location: ../admin.html');
		    exit();
        }

        // Wstawienie do tabeli Type:
        $sql = 'INSERT INTO Type
            VALUES (
                NULL,
                :name_type,
                :id_user
            );';
        $query = $db->prepare($sql);
        $query->bindValue(':name_type', $name_type, PDO::PARAM_STR);
        $query->bindValue(':id_user', $_SESSION['id_user'], PDO::PARAM_STR);
        $query->execute();
        $id = $db->lastInsertId();
        if ($id) {
            header('Location: ../index.html');
            $_SESSION['error_name_type'] = 'Typ '.$name_type.' zostal dodany';
            exit();
        }

    } else {
        if (isset($_SESSION['is_admin_logged']))
            header('Location: ../admin.html');
        else
            header('Location: ../index.html');
		exit();
    }


    function redirect() {
        // Admin musi byc zalogowany:
        if (!isset($_SESSION['is_admin_logged'])) {
            header('Location: ../index.html');
            exit();
        }
    }