<?php
    session_start();

    redirect();

    require_once "helpers/requestResult.php";

    try {
        // Mozna tu przyjść tylko z konkretnych formularzy:
        if (count($_POST) == 2 && isset($_POST['nameType']) && isset($_POST['description'])) { // dodawanie typu pokoju
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
        } else if (count($_POST) == 3 && isset($_POST['nameOffer']) &&
                isset($_POST['nrRoom']) && isset($_POST['price'])) { // dodanie pokoju do oferty
            addRoomToOffer($result_obj);
        } else if (count($_POST) == 1 && isset($_POST['room']) && $_POST['room'] == 'nr') { // pobranie wszystkich numerow pokoi
            getAllRoomsNumbers($result_obj);
        } else if (count($_POST) == 1 && isset($_POST['booking'])) { // pobranie wszystkich rezerwacji
            getAllBooking($result_obj);
        } else if(count($_POST) == 3 && isset($_POST['nrRoom']) &&
            isset($_POST['dateFrom']) && isset($_POST['dateTo'])) { // usuniecie rezerwacji
            deleteSelectedAdminBooking($result_obj);
        } else if(count($_POST) == 1 && isset($_POST['admins'])) { // pobranie wszystkich adminow
            getAllAdmins($result_obj);
        } else if(count($_POST) == 1 && isset($_POST['email'])) { // usuniecie admina
            deleteSelectedAdmin($result_obj);
        } else if(count($_POST) == 1 && isset($_POST['nrRoomForDelete'])) { // usuniecie pokoju
            deleteSelectedRoom($result_obj);
        } else if(count($_POST) == 1 && isset($_POST['nameOfferToDelete'])) { // usuniecie oferty
            deleteSelectedOffer($result_obj);
        } else if(count($_POST) == 1 && isset($_POST['name']) && isset($_POST['name']) == 'offersName') { //wypelienie comboxa z nazwami ofert
            getAllOffersName($result_obj);
        } else {
            $result_obj->message = 'Nieznane zapytanie';
        }
    } catch (PDOException $error) {
        $result_obj->message = 'Niepowodzenie, błąd:'.$error->getMessage();
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
        $description = $_POST['description'];
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
                    :description,
                    :id_user
                );';
            $query = $db->prepare($sql);
            $query->bindValue(':name_type', $name_type, PDO::PARAM_STR);
		    $query->bindValue(':description', $description, PDO::PARAM_STR);
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
                    idType = :id_type AND
                    isDeleted = 0
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
        $sql = 'INSERT INTO Room(idRoom, nrRoom, floor, sleeps, idType, idUserLogged)
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
                    date_to = :date_to AND
                    isDeleted = 0
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
        $sql = 'INSERT INTO Offer(idOffer, name, date_from, date_to, idUserLogged)
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

    function getAllBooking($result_obj) {
        require_once "db.php";
        $sql = 'SELECT r.nrRoom, u.name, u.surname, u.email, b.guests, b.price, b.date_to, b.date_from
                FROM room r
                INNER JOIN booking b
                ON r.idRoom = b.idRoom
                INNER JOIN user u
                ON u.idUser = b.idUser
                WHERE b.isDeleted = 0;';
        $query = $db->prepare($sql);
        $query->execute();
        $results = $query->fetchAll(PDO::FETCH_ASSOC);

        if ($query->rowCount() >= 0) {
            $result_obj->result = 'OK';
            $result_obj->message = 'Pobrano '.$query->rowCount().' rezerwacji';
            $result_obj->value = $results;
        }
        else {
            $result_obj->message = 'Brak zdefiniowanych rezerwacji.';
        }
    }

    function getAllAdmins($result_obj) {
        require_once "db.php";
        $email = $_SESSION['email'];
        $sql = 'SELECT u.name, u.surname, u.email
                FROM user u
                INNER JOIN userlogged l
                ON u.idUser = l.idUser
                INNER JOIN userrole ur
                ON ur.idUserLogged = l.idUserLogged
                INNER JOIN role r
                ON r.idRole = ur.idRole
                WHERE r.name = "admin"
                AND u.email != :email
                AND l.isDeleted = 0;';
        $query = $db->prepare($sql);
        $query->bindValue(':email', $email, PDO::PARAM_STR);
        $query->execute();
        $results = $query->fetchAll(PDO::FETCH_ASSOC);

        if ($query->rowCount() >= 0) {
            $result_obj->result = 'OK';
            $result_obj->message = 'Pobrano '.$query->rowCount().' adminów.';
            $result_obj->value = $results;
        }
        else {
            $result_obj->message = 'Brak zdefiniowanych adminów.';
        }
    }

    function getAllOffers($result_obj) {
        require_once "db.php";
        $sql = 'SELECT o.idOffer, o.name, ro.price, r.nrRoom, o.date_from, o.date_to
                FROM offer o
                LEFT JOIN room_offer ro
                ON ro.idOffer = o.idOffer
                LEFT JOIN room r
                ON r.idRoom = ro.idRoom
                WHERE o.isDeleted = 0
                AND ro.isDeleted = 0
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
            $result_obj->message = 'Brak zdefiniowanych ofert.';
        }
    }

    function getAllRooms($result_obj) {
        require_once "db.php";
        $sql = 'SELECT r.nrRoom, r.floor, r.sleeps, t.name as name
                FROM room r
                INNER JOIN type t
                ON r.idType = t.idType
                WHERE r.isDeleted = 0;';
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
        $sql = 'SELECT nrRoom
                FROM room r
                WHERE r.isDeleted = 0
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
            $result_obj->message = 'Brak zdefiniowanych pokoi.';
        }
    }

    function getAllOffersName($result_obj) {
        require_once "db.php";
        $sql = 'SELECT o.name as name
                FROM offer o
                WHERE o.isDeleted = 0
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
            $result_obj->message = 'Brak zdefiniowanych ofert.';
        }
    }

    function addRoomToOffer($result_obj) {
        require_once "db.php";
        $name_offer = $_POST['nameOffer'];
        $nr_room = $_POST['nrRoom'];
        $price = $_POST['price'];

        try {
            $sql = 'SELECT idOffer, date_from, date_to
                    FROM offer o
                    WHERE o.name = :name_offer
                    AND isDeleted = 0;';
            $query = $db->prepare($sql);
            $query->bindValue(':name_offer', $name_offer, PDO::PARAM_STR);
            $query->execute();
            $result = $query->fetch();
            if ($query->rowCount() != 1) {
                $result_obj->message = "Nieznana oferta.".$name_offer;
                return;
            }
            $id_offer = $result['idOffer'];
            $date_from = $result['date_from'];
            $date_to = $result['date_to'];

            $sql = 'SELECT count(o.idOffer) as nrOffers
                    FROM offer o
                    INNER JOIN room_offer ro
                    ON o.idOffer = ro.idOffer
                    INNER JOIN room r
                    ON r.idRoom = ro.idRoom
                    WHERE r.nrRoom = :nr_room
                    AND ((o.date_from BETWEEN :date_from AND :date_to) OR (o.date_to BETWEEN :date_from1 AND :date_to1));';
            $query = $db->prepare($sql);
            $query->bindValue(':nr_room', $nr_room, PDO::PARAM_INT);
            $query->bindValue(':date_from', $date_from, PDO::PARAM_STR);
            $query->bindValue(':date_to', $date_to, PDO::PARAM_STR);
            $query->bindValue(':date_from1', $date_from, PDO::PARAM_STR);
            $query->bindValue(':date_to1', $date_to, PDO::PARAM_STR);
            $query->execute();

            $result = $query->fetch();
            if($result['nrOffers'] > 0) {
                $result_obj->message = "Nie można dodać pokoju do innej oferty w tych samych datach.";
                return;
            }

            $sql = 'INSERT INTO room_offer(idOffer, idRoom, price)
                    VALUES (
                        :id_offer,
                        (SELECT idRoom FROM room WHERE nrRoom = :nr_room),
                        :price);';
            $query = $db->prepare($sql);
            $query->bindValue(':id_offer', $id_offer, PDO::PARAM_INT);
            $query->bindValue(':nr_room', $nr_room, PDO::PARAM_INT);
            $query->bindValue(':price', $price, PDO::PARAM_INT);
            $query->execute();

            $result_obj->result = 'OK';
            $result_obj->message = 'Pokój został dodany do oferty';
        }
        catch (PDOException $error) {
            $result_obj->message = 'Nie udało się dodać pokoju do oferty, spróbuj jeszcze raz'.$error->getMessage();
        }
    }

    function deleteSelectedAdminBooking($result_obj) {
        require_once "db.php";
        $nr_room = $_POST['nrRoom'];
        $date_from = $_POST['dateFrom'];
        $date_to = $_POST['dateTo'];
        $sql = 'UPDATE booking
                SET isDeleted = 1
                WHERE idRoom = (SELECT idRoom FROM room WHERE nrRoom = :nr_room)
                AND date_from = :date_from
                AND date_to = :date_to';
        $query = $db->prepare($sql);
        $query->bindValue(':nr_room', $nr_room, PDO::PARAM_INT);
        $query->bindValue(':date_from', $date_from, PDO::PARAM_STR);
        $query->bindValue(':date_to', $date_to, PDO::PARAM_STR);
        $query->execute();

        $result_obj->result = 'OK';
        $result_obj->message = 'Rezerwacja usunięta.';
    }

    function deleteSelectedAdmin($result_obj) {
        require_once "db.php";
        $email = $_POST['email'];

        $sql = 'UPDATE userlogged ul
                INNER JOIN user u
                ON u.idUser = ul.idUser
                INNER JOIN userrole ur
                ON ur.idUserLogged = ul.idUserLogged
                INNER JOIN role r
                ON r.idRole = ur.idRole
                SET isDeleted = 1
                WHERE u.email = :email
                AND r.name = :role_name
                AND ul.isDeleted = 0;';
        $query = $db->prepare($sql);
        $query->bindValue(':email', $email, PDO::PARAM_STR);
        $query->bindValue(':role_name', 'admin', PDO::PARAM_STR);
        $query->execute();

        $result_obj->result = 'OK';
        $result_obj->message = 'Admin usunięty.';
    }

    function deleteSelectedRoom($result_obj) {
        require_once "db.php";
        $nr_room = $_POST['nrRoomForDelete'];

        $sql = 'UPDATE room
                SET isDeleted = 1
                WHERE nrRoom = :nr_room';
        $query = $db->prepare($sql);
        $query->bindValue(':nr_room', $nr_room, PDO::PARAM_INT);
        $query->execute();

        $result_obj->result = 'OK';
        $result_obj->message = 'Pokój usunięty.';
    }

    function deleteSelectedOffer($result_obj) {
        require_once "db.php";
        $name_offer = $_POST['nameOfferToDelete'];

        $sql = 'UPDATE offer o
                SET isDeleted = 1
                WHERE name = :name_offer
                AND o.isDeleted =  0';
        $query = $db->prepare($sql);
        $query->bindValue(':name_offer', $name_offer, PDO::PARAM_STR);
        $query->execute();

        $sql = 'UPDATE room_offer
                SET isDeleted = 1
                WHERE idOffer = (SELECT idOffer FROM offer WHERE name = :name_offer)';
        $query = $db->prepare($sql);
        $query->bindValue(':name_offer', $name_offer, PDO::PARAM_STR);
        $query->execute();

        $result_obj->result = 'OK';
        $result_obj->message = 'Oferta została usunięta.';
    }