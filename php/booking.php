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
    } else if (count($_POST) == 4 &&
        isset($_POST['bookingType']) &&
        isset($_POST['name']) &&
        isset($_POST['surname']) &&
        isset($_POST['email'])) { // rezerwowanie
        reserve($result_obj);
    } else {
        $result_obj->message = 'Nieznane zapytanie';
    }
} catch (PDOException $error) {
    $result_obj->message = 'Niepowodzenie, błąd:' . $error->getMessage();
}

echo json_encode($result_obj);

/*****DEFINICJE METOD*****/
function redirect()
{
        // TODO chyba niepotrzebne bo nie trzeba być zalogowanym
}

function checkAvailability($result_obj)
{
    $date_from = $_POST['dateFrom'];
    $date_to = $_POST['dateTo'];
    $persons = $_POST['nrPersons'];
    $_SESSION['date_from'] = $date_from;
    $_SESSION['date_to'] = $date_to;
    $_SESSION['persons'] = $persons;

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

        // $sql = 'SELECT r.idRoom, o.date_from, o.date_to, ro.price, t.name as type
        //         FROM room_offer ro
        //         INNER JOIN room r
        //         ON r.idRoom = ro.idRoom
        //         INNER JOIN type t
        //         ON t.idType = r.idType
        //         INNER JOIN offer o
        //         ON o.idOffer = ro.idOffer
        //         WHERE ro.idRoom IN
        //         (SELECT r.idRoom
        //         FROM room r
        //         INNER JOIN room_offer ro
        //         ON ro.idRoom = r.idRoom
        //         INNER JOIN offer o
        //         ON o.idOffer = ro.idOffer
        //         WHERE r.sleeps = :persons1
        //         AND o.date_from <= :date_from1
        //         AND o.date_to >= :date_to1
        //         AND ro.isDeleted = 0
        //         AND r.isDeleted = 0
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
        //         AND b.date_to >= :date_to2
        //         AND ro.isDeleted = 0
        //         AND r.isDeleted = 0));';

        // $sql = 'SELECT r.idRoom, o.date_from, o.date_to, ro.price, t.name as type
    $sql = 'SELECT DISTINCT ro.price, t.name as type
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
                (SELECT DISTINCT r.idRoom
                FROM room r
                INNER JOIN booking b
                ON b.idRoom = r.idRoom
                INNER JOIN room_offer ro
                ON ro.idRoom = r.idRoom
                INNER JOIN offer o
                ON o.idOffer = ro.idOffer
                WHERE r.sleeps = :persons2
                AND NOT (b.date_from > :date_to2
                OR b.date_to < :date_from2)
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
        $result_obj->message = 'Dostępnych ofert:' . $query->rowCount();
        $result_obj->value = $results;
    } else {
        $result_obj->message = 'Brak dostępnych ofert w tym terminie od ' .
            $date_from . ' do ' . $date_to;
    }
}

function reserve($result_obj)
{
    $name = $_POST['name'];
    $surname = $_POST['surname'];
    $email = $_POST['email'];
    
    // Sprawdzamy czy dane zalogowanego są identyczne z podanymi w rezerwacji
    if (!isset($_SESSION['is_user_logged']) || !isset($_SESSION['id_user']) || 
        ($name != $_SESSION['name']) || ($surname != $_SESSION['surname']) ||
        ($email != $_SESSION['email'])) {
        $result_obj->message = 'Dane konta i rezerwacji nie zgadzają się';
        return;
    }

    require_once "db.php";
    $date_from = $_SESSION['date_from'];
    $date_to = $_SESSION['date_to'];
    $persons = $_SESSION['persons'];

    // Szukamy id pierwszego dostępnego pokoju
    $sql = 'SELECT r.idRoom as id_room, r.nrRoom
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
                (SELECT DISTINCT r.idRoom
                FROM room r
                INNER JOIN booking b
                ON b.idRoom = r.idRoom
                INNER JOIN room_offer ro
                ON ro.idRoom = r.idRoom
                INNER JOIN offer o
                ON o.idOffer = ro.idOffer
                WHERE r.sleeps = :persons2
                AND NOT (b.date_from > :date_to2
                OR b.date_to < :date_from2)
                AND ro.isDeleted = 0
                AND r.isDeleted = 0))
                ORDER BY r.nrRoom
                LIMIT 1;';

    $query = $db->prepare($sql);
    $query->bindValue(':persons1', $persons, PDO::PARAM_INT);
    $query->bindValue(':date_from1', $date_from, PDO::PARAM_STR);
    $query->bindValue(':date_to1', $date_to, PDO::PARAM_STR);
    $query->bindValue(':persons2', $persons, PDO::PARAM_INT);
    $query->bindValue(':date_from2', $date_from, PDO::PARAM_STR);
    $query->bindValue(':date_to2', $date_to, PDO::PARAM_STR);
    $query->execute();
    $results = $query->fetchAll(PDO::FETCH_ASSOC);

    if ($query->rowCount() != 1) {
        $result_obj->message = 'Przykro nam, ktoś cię ubiegł';
        return;
    }
    // $result_obj->message = 'init'.$results[0]['id_room'];
    // echo json_encode($result_obj);
    // exit();
        
    $sql = 'INSERT INTO Booking(idUser, idRoom, date_from, date_to, price, guests)
                VALUES (:id_user, :id_room, :date_from, :date_to, :price, :guests);';
    $query = $db->prepare($sql);
    $query->bindValue(':id_user', $_SESSION['id_user'], PDO::PARAM_INT);
    $query->bindValue(':id_room', $results[0]['id_room'], PDO::PARAM_INT);
    $query->bindValue(':date_from', $date_from, PDO::PARAM_STR);
    $query->bindValue(':date_to', $date_to, PDO::PARAM_STR);
    $query->bindValue(':price', 0, PDO::PARAM_INT);
    $query->bindValue(':guests', $persons, PDO::PARAM_INT);
    $query->execute();

    $id = $db->lastInsertId();
    if ($id) {
        $result_obj->result = 'OK';
        $result_obj->message = 'Rezerwacja dokonana';
    } else {
        $result_obj->message = 'Nie udało się dokonać rezerwacji, spróbuj jeszcze raz';
    }

    // TODO dodanie usera niezalogowanego
    // TRANSAKCJA
}