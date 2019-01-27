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
        // Oferty w ogóle w podanym zakresie
        // $sql = 'SELECT o.idOffer, t.name as type, ro.price as price
        //         FROM room r
        //         INNER JOIN type t
        //         ON t.idType = r.idType
        //         INNER JOIN room_offer ro
        //         ON ro.idRoom = r.idRoom
        //         INNER JOIN offer o
        //         ON o.idOffer = ro.idOffer
        //         WHERE r.sleeps = :persons
        //         AND o.date_from <= :date_from
        //         AND o.date_to >= :date_to;';

        // Oferty zarezerwowane w podanym zakresie
        // $sql = 'SELECT o.idOffer, t.name as type, ro.price as price
        //         FROM booking b
        //         INNER JOIN room r
        //         ON r.idRoom = b.idRoom
        //         INNER JOIN room_offer ro
        //         ON ro.idRoom = r.idRoom
        //         INNER JOIN offer o
        //         ON o.idOffer = ro.idOffer
        //         INNER JOIN type t
        //         ON t.idType = r.idType
        //         WHERE r.sleeps = :persons
        //         AND b.date_from <= :date_from
        //         AND b.date_to >= :date_to;';

        // Pokoje w ogóle w podanym zakresie
        // NOT IN
        // Pokoje zarezerwowane w podanym zakresie
        // $sql = 'SELECT r.idRoom
        //         FROM room r
        //         INNER JOIN room_offer ro
        //         ON ro.idRoom = r.idRoom
        //         INNER JOIN offer o
        //         ON o.idOffer = ro.idOffer
        //         WHERE r.sleeps = :persons1
        //         AND o.date_from <= :date_from1
        //         AND o.date_to >= :date_to1
        //         AND r.idRoom NOT IN
        //         (SELECT r.idRoom
        //         FROM room r
        //         INNER JOIN booking b
        //         ON b.idRoom = r.idRoom
        //         INNER JOIN room_offer ro
        //         ON ro.idRoom = r.idRoom
        //         INNER JOIN offer o
        //         ON o.idOffer = ro.idOffer
        //         WHERE r.sleeps = :persons2
        //         AND b.date_from <= :date_from2
        //         AND b.date_to >= :date_to2);';

        $sql = 'SELECT r.idRoom, o.date_from, o.date_to, ro.price, t.name as type
                FROM room_offer ro
                INNER JOIN room r
                ON r.idRoom = ro.idRoom
                INNER JOIN type t
                ON t.idType = r.idType
                INNER JOIN offer o
                ON o.idOffer = ro.idOffer
                WHERE ro.idRoom IN
                (SELECT r.idRoom
                FROM room r
                INNER JOIN room_offer ro
                ON ro.idRoom = r.idRoom
                INNER JOIN offer o
                ON o.idOffer = ro.idOffer
                WHERE r.sleeps = :persons1
                AND o.date_from <= :date_from1
                AND o.date_to >= :date_to1
                AND ro.isDeleted = 0
                AND r.isDeleted = 0
                AND r.idRoom NOT IN
                (SELECT r.idRoom
                FROM room r
                INNER JOIN booking b
                ON b.idRoom = r.idRoom
                INNER JOIN room_offer ro
                ON ro.idRoom = r.idRoom
                INNER JOIN offer o
                ON o.idOffer = ro.idOffer
                WHERE r.sleeps = :persons2
                AND b.date_from <= :date_from2
                AND b.date_to >= :date_to2
                AND ro.isDeleted = 0
                AND r.isDeleted = 0));';

        $query = $db->prepare($sql);
        $query->bindValue(':persons1', $persons, PDO::PARAM_INT);
        $query->bindValue(':date_from1', $date_from, PDO::PARAM_STR);
        $query->bindValue(':date_to1', $date_to, PDO::PARAM_STR);
        $query->bindValue(':persons2', $persons, PDO::PARAM_INT);
        $query->bindValue(':date_from2', $date_from, PDO::PARAM_STR);
        $query->bindValue(':date_to2', $date_to, PDO::PARAM_STR);
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