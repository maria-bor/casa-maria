<?php
    session_start();

    // redirect(); ????

    require_once "helpers/requestResult.php";

    try {
        // Mozna tu przyjść tylko z konkretnych formularzy:
        if (count($_POST) == 1 && isset($_POST['booking'])) { // popbranie wszystkich rezerwacji użytkownika
            getAllUserBooking($result_obj);
        } else if (count($_POST) == 2 && isset($_POST['date_from'])
        && isset($_POST['date_from'])) { // usunięcie rezerwacji wybranej przez użytkownika
            deleteSelectedUserBooking($result_obj);
        } else {
            $result_obj->message = 'Nieznane zapytanie';
        }
    } catch (PDOException $error) {
        $result_obj->message = 'Niepowodzenie, błąd:'.$error->getMessage();
    }

    function getAllUserBooking($result_obj) {
        require_once "db.php";
        $id_user = $_SESSION['id_user'];
        $sql = 'SELECT b.date_to, b.date_from
                FROM booking b
                WHERE b.idUser = :id_user
                AND b.isDeleted = 0;';
        $query = $db->prepare($sql);
        $query->bindValue(':id_user', $id_user, PDO::PARAM_INT);
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

    function deleteSelectedUserBooking($result_obj) {
        require_once "db.php";
        $id_user = $_SESSION['id_user'];
        $date_from = $_POST['date_from'];
        $date_to = $_POST['date_to'];

        $sql = 'UPDATE booking
                SET isDeleted = 1
                WHERE idUser = :id_user
                AND date_from = :date_from
                AND date_to = :date_to';
        $query = $db->prepare($sql);
        $query->bindValue(':id_user', $id_user, PDO::PARAM_INT);
        $query->bindValue(':date_from', $date_from, PDO::PARAM_STR);
        $query->bindValue(':date_to', $date_to, PDO::PARAM_STR);
        $query->execute();

        $result_obj->result = 'OK';
        $result_obj->message = 'Rezerwacja usunięty.';
    }
    
    echo json_encode($result_obj);