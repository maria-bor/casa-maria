<?php
    session_start();

    redirect();

    require_once "helpers/requestResult.php";

    // Mozna tu przyjść tylko z konkretnych formularzy:
    if (count($_POST) == 1 && isset($_POST['nameType'])) { // dodawanie typu pokoju
        addNewRoomType($result_obj);
    } else if (count($_POST) == 1 && isset($_POST['roomTypes'])) { // pobranie wszystkich typów pokoi
        getAllRoomTypes($result_obj);
    } else if(count($_POST) == 4 && isset($_POST['nrRoom']) && isset($_POST['nrFloor']) &&
              isset($_POST['sleeps']) && isset($_POST['nameType'])) {
        addNewRoom($result_obj);
    } else if(count($_POST) == 3 && isset($_POST['name']) &&
        isset($_POST['from']) && isset($_POST['to'])) {
        addNewOffer($result_obj);
    } else if (count($_POST) == 1 && isset($_POST['offer'])) { // pobranie wszystkich ofert
        getAllOffers($result_obj);
    } else if (count($_POST) == 1 && isset($_POST['room']) && $_POST['room'] == 'all') { // pobranie wszystkich pokoi
        getAllRooms($result_obj);
    } else if (count($_POST) == 1 && isset($_POST['room']) && $_POST['room'] == 'nr') { // pobranie wszystkich numerow pokoi
        getAllRoomsNumbers($result_obj);
    } else if (count($_POST) == 2 && isset($_POST['idOffer']) && isset($_POST['nrRoom'])) { // dodanie pokoju do oferty
        addRoomToOffer($result_obj);
    } else {
        $result_obj->message = 'Nieznane zapytanie';
    }

    echo json_encode($result_obj);

/*****DEFINICJE METOD*****/
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
        $name_type = $_POST['nameType'];
        $_SESSION['form_name_type'] = $name_type;

        require_once "db.php";
        // TODO wykorzystać getNameTypeId()
        // Sprawdzamy czy nie ma już takiego typu:
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
            $result_obj->message = 'Typ '.$name_type.' juz istnieje';
            $result_obj->value = $name_type;
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
            if ($id) {
                $result_obj->result = 'OK';
                $result_obj->message = 'Typ '.$name_type.' został dodany';
            }
        }
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

    function getNameTypeId($db, $name_type) {
        $sql = 'SELECT idType as id_type
                FROM type t
                WHERE t.name = :nameType';
        $query = $db->prepare($sql);
		$query->bindValue(':nameType', $name_type, PDO::PARAM_STR);
        $query->execute();

        $type = $query->fetch();
        // print_r($user);
        // Jak jest to info, ze juz jest
        if ($query->rowCount() != 0) {
            return $type['id_type'];
        } else {
            return -1;
        }
    }

    function addNewRoom($result_obj) {
        $nr_room = $_POST['nrRoom'];
        $nr_floor = $_POST['nrFloor'];
        $sleeps = $_POST['sleeps'];
        $name_type = $_POST['nameType'];

        if (!preg_match('/^\d{3}$/', $nr_room)) {
            $result_obj->message = 'Niepoprawny numer pokoju'.$nr_room;
            return;
        } else if (!preg_match('/^[1-9]\d*$/', $nr_floor)) {
            $result_obj->message = 'Niepoprawny numer piętra';
            return;
        } else if (!preg_match('/^[1-9]$/', $sleeps)) {
            $result_obj->message = 'Niepoprawna liczba osób w pokoju';
            return;
        }
        require_once "db.php";
        $id_type = getNameTypeId($db, $name_type);
        if ($id_type == -1) {
            $result_obj->message = 'Niepoprawan nazwa pokoju: '.$name_type;
            return;
        }

        $sql = 'SELECT idRoom FROM Room WHERE
                    nrRoom = :nr_room AND
                    floor = :nr_floor AND
                    sleeps = :sleeps AND
                    idType = :id_type
                ;';
        $query = $db->prepare($sql);
        $query->bindValue(':nr_room', $nr_room, PDO::PARAM_STR);
        $query->bindValue(':nr_floor', $nr_floor, PDO::PARAM_INT);
        $query->bindValue(':sleeps', $sleeps, PDO::PARAM_INT);
        $query->bindValue(':id_type', $id_type, PDO::PARAM_INT);
        $query->execute();
        if ($query->rowCount() != 0) {
            $result_obj->message = 'Istnieje już pokój o podanych parametrach';
            return;
        }
        // Wstawienie do tabeli:
        $sql = 'INSERT INTO Room
                VALUES (NULL, :nr_room, :nr_floor, :sleeps, :id_type, :id_user
                );';
        $query = $db->prepare($sql);
        $query->bindValue(':nr_room', $nr_room, PDO::PARAM_STR);
        $query->bindValue(':nr_floor', $nr_floor, PDO::PARAM_INT);
        $query->bindValue(':sleeps', $sleeps, PDO::PARAM_INT);
        $query->bindValue(':id_type', $id_type, PDO::PARAM_INT);
        $query->bindValue(':id_user', $_SESSION['id_user'], PDO::PARAM_INT);
        $query->execute();
        $id = $db->lastInsertId();
        if ($id) {
            $result_obj->result = 'OK';
            $result_obj->message = 'Nowy pokój został dodany';
        } else {
            $result_obj->message = 'Nie udało się dodać pokoju, spróbuj jeszcze raz';
        }
    }

    function addNewOffer($result_obj) {
        $name = $_POST['name'];
        $from = new DateTime($_POST['from']);
        $to = new DateTime($_POST['to']);
        require_once "db.php";
        $sql = 'SELECT idOffer FROM Offer WHERE
                    name = :name AND
                    date_from = :date_from AND
                    date_to = :date_to
        ;';
        $query = $db->prepare($sql);
        $query->bindValue(':name', $name, PDO::PARAM_STR);
        $query->bindValue(':date_from', $from->format('Y-m-d'), PDO::PARAM_STR);
        $query->bindValue(':date_to', $to->format('Y-m-d'), PDO::PARAM_STR);
        $query->execute();
        if ($query->rowCount() != 0) {
            $result_obj->message = 'Istnieje już oferta o podanych parametrach';
            return;
        }
        // Wstawienie do tabeli:
        $sql = 'INSERT INTO Offer
                VALUES (NULL, :name, :date_from, :date_to, :id_user);';
        $query = $db->prepare($sql);
        $query->bindValue(':name', $name, PDO::PARAM_STR);
        $query->bindValue(':date_from', $from->format('Y-m-d'), PDO::PARAM_STR);
        $query->bindValue(':date_to', $to->format('Y-m-d'), PDO::PARAM_STR);
        $query->bindValue(':id_user', $_SESSION['id_user'], PDO::PARAM_INT);
        $query->execute();
        $id = $db->lastInsertId();
        if ($id) {
            $result_obj->result = 'OK';
            $result_obj->message = 'Nowa oferta została dodana';
        } else {
            $result_obj->message = 'Nie udało się dodać oferty, spróbuj jeszcze raz';
        }
    }

    function getAllOffers($result_obj) {
        require_once "db.php";
        $sql = 'SELECT *
                FROM offer
                ORDER BY name;';
        $query = $db->prepare($sql);
        $query->execute();
        $results = $query->fetchAll(PDO::FETCH_ASSOC);

        if ($query->rowCount() >= 0) {
            $result_obj->result = 'OK';
            $result_obj->message = 'Pobrano '.$query->rowCount().' ofert';
            $result_obj->value = $results;
        }
        else {
            $result_obj->message = 'Brak zdefiniowanych typów pokoi.';
        }
    }

    function getAllRooms($result_obj) {
        require_once "db.php";
        $sql = 'SELECT r.nrRoom, r.floor, r.sleeps, t.name as name
                FROM room r
                INNER JOIN type t 
                ON r.idType = t.idType;';
        $query = $db->prepare($sql);
        $query->execute();
        $results = $query->fetchAll(PDO::FETCH_ASSOC);

        if ($query->rowCount() >= 0) {
            $result_obj->result = 'OK';
            $result_obj->message = 'Pobrano '.$query->rowCount().' pokoi';
            $result_obj->value = $results;
        }
        else {
            $result_obj->message = 'Brak zdefiniowanych pokoi.';
        }
    }

    function getAllRoomsNumbers($result_obj) {
        require_once "db.php";
        $sql = 'SELECT *
                FROM room
                ORDER BY nrRoom;';
        $query = $db->prepare($sql);
        $query->execute();
        $results = $query->fetchAll(PDO::FETCH_ASSOC);

        if ($query->rowCount() >= 0) {
            $result_obj->result = 'OK';
            $result_obj->message = 'Pobrano '.$query->rowCount().' pokoi';
            $result_obj->value = $results;
        }
        else {
            $result_obj->message = 'Brak zdefiniowanych typów pokoi.';
        }
    }

    function addRoomToOffer($result_obj) {
        require_once "db.php";
        $id_offer = $_POST['idOffer'];
        $nr_room = $_POST['nrRoom'];
        // $price = $_POST['price'];

        $sql = 'INSERT INTO room_offer
                VALUES (:id_offer, :nr_room, :price);';
        $query = $db->prepare($sql);
        $query->bindValue(':id_offer', $id_offer, PDO::PARAM_INT);
        $query->bindValue(':nr_room', $nr_room, PDO::PARAM_INT);
        $query->bindValue(':price', 100, PDO::PARAM_INT);
        $query->execute();
        $id = $db->lastInsertId();
        if ($id) {
            $result_obj->result = 'OK';
            $result_obj->message = 'Pokój został dodany do oferty';
        } else {
            $result_obj->message = 'Nie udało się dodać pokoju do oferty, spróbuj jeszcze raz';
        }
    }