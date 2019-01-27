<?php
    session_start();

    redirect();

    require_once "helpers/requestResult.php";

    try {
        // Mozna tu przyjść tylko z konkretnych formularzy:
        if (count($_POST) == 3 && 
            isset($_POST['dateFrom']) &&
            isset($_POST['dateTo']) && 
            isset($_POST['nrPersons'])) { // dodawanie typu pokoju
            checkAvailability($result_obj);
        } else {
            $result_obj->message = 'Nieznane zapytanie';
        }
    } catch (PDOException $error) {
        $result_obj->message = 'Niepowodzenie, błąd:'.$error->getMessage();
    }

    echo json_encode($result_obj);

/*****DEFINICJE METOD*****/
    function redirect() {
        // TODO chyba niepotrzebne bo nie trzeba być zalogowanym
    }

    function checkAvailability($result_obj) {
        $date_from = $_POST['dateFrom'];
        $date_to = $_POST['dateTo'];
        $persons = $_POST['nrPersons'];

        require_once "db.php";
        $sql = 'SELECT t.name as type, ro.price as price
                FROM room r
                INNER JOIN type t
                ON t.idType = r.idType
                INNER JOIN room_offer ro
                ON ro.idRoom = r.idRoom
                INNER JOIN offer o
                ON o.idOffer = ro.idOffer
                WHERE r.sleeps = :persons
                AND o.date_from <= :date_from
                AND o.date_to >= :date_to;';
        $query = $db->prepare($sql);
        $query->bindValue(':persons', $persons, PDO::PARAM_INT);
        $query->bindValue(':date_from', $date_from, PDO::PARAM_STR);
        $query->bindValue(':date_to', $date_to, PDO::PARAM_STR);
        $query->execute();
        $results = $query->fetchAll(PDO::FETCH_ASSOC);

        if ($query->rowCount() > 0) {
            $result_obj->result = 'OK';
            $result_obj->message = 'Dostępnych ofert:'.$query->rowCount();
            $result_obj->value = $results;
        } else {
            $result_obj->message = 'Brak dostępnych ofert w tym terminie od '.
            $date_from.' do '.$date_to;
        }
    }