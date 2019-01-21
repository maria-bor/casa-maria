<?php
    session_start();

    redirect();

    require_once "helpers/requestResult.php";

    // Mozna tu przyjsc tylko z konkretnych formularzy:
    if (isset($_POST['nameType'])) { // dodawanie typu pokoju
        require_once "db.php";
        addNewRoomType($result_obj);
        // todo przeniesc do metody
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
            $result_obj->message = 'tttTyp '.$name_type.' juz istnieje';
        } else {
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
            if ($id) { // TODO jak sukces to w errorem wyswietlamy sukces, zrobic to jsonem
                $result_obj->result = 'OK';
                $result_obj->message = 'Typ '.$name_type.' zostal dodany';
                $_SESSION['error_name_type'] = 'Typ '.$name_type.' zostal dodany';
            }
        }
    } else if (isset($_POST['roomTypes'])) { // pobranie wszystkich typów pokoi
        getAllRoomTypes($result_obj);
    } else {
        $result_obj->message = 'Nieznane zapytanie';        
    }

    echo json_encode($result_obj);

//*****DEFINICJE METOD*****/
    function redirect() {
        // Admin musi byc zalogowany:
        if (!isset($_SESSION['is_admin_logged'])) {
            $result_obj->message = 'Brak zalogowanego Administratora';
            // header('Location: ../index.html');
            echo json_encode($result_obj);
            exit();
        }
    }

    function addNewRoomType($result_obj) {
        
    }

    function getAllRoomTypes($result_obj) {
        $column = $_POST['roomTypes'];
        if ($column != 'name' &&
            $column != 'all') {
                $result_obj->message = 'Niepoprawne żądanie';
            return;
        }
        
        if ($column == 'all') { 
            $column = '*';
        }

        require_once "db.php";
        $sql = 'SELECT '.$column.'
                FROM type
                ORDER BY name;';
        $query = $db->prepare($sql);
        $query->execute();
        $results = $query->fetchAll(PDO::FETCH_ASSOC);

        if ($query->rowCount() > 0) {
            $result_obj->result = 'OK';
            $result_obj->message = 'Pobrano '.$query->rowCount().' typów.';
            $result_obj->value = $results;
        }
        else {
            $result_obj->message = 'Brak zdefiniowanych typów pokoi.';
        }
    }