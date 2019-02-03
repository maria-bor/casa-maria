<?php
    session_start();

    redirect();

    require_once "db.php";

    // Można tu przyjść tylko linkiem z emaila
    if (isset($_GET['code']) && isset($_GET['email'])) {
        $code = $_GET['code'];
        $email = $_GET['email'];
        $email = htmlentities($email, ENT_QUOTES, "UTF-8");

        // Sprawdzamy zgodność kodu
        $sql = 'SELECT u.idUser id_user
        FROM User u
        INNER JOIN userlogged ul
        ON ul.idUser = u.idUser
        WHERE u.email = :emailLogin
        AND ul.activated = 0
        AND ul.activation_code = :activation_code
        AND ul.isDeleted = 0;';
        $query = $db->prepare($sql);
        $query->bindValue(':emailLogin', $email, PDO::PARAM_STR);
        $query->bindValue(':activation_code', $code, PDO::PARAM_STR);
        $query->execute();
        if ($query->rowCount() != 1 ) {
            $_SESSION['msg'] = 'Nieprawidłowy kod aktywacyjny lub konto jest już aktywne.';
        } else {
            // Aktywujemy konto
            $sql = 'UPDATE userlogged ul
            INNER JOIN user u
            ON u.idUser = ul.idUser
            SET activated = 1
            WHERE u.email = :email
            AND ul.isDeleted = 0;';
            $query = $db->prepare($sql);
            $query->bindValue(':email', $email, PDO::PARAM_STR);
            if ($query->execute()) {
                $_SESSION['msg'] = 'Twoje konto zostało aktywowane!<br>'
                .'Teraz możesz się zalogować i cieszyć się korzystaniem z systemu rezerwacji<br><b>CASA-MARIA</b>';
            } else {
                $_SESSION['msg'] = 'Aktywacja nieudana!<br>'
                .'Prosimy spróbować aktywować konto.';
            }
        }
    } else {
        $_SESSION['msg'] = 'Nieprawidłowe parametry zapytania!';
    }
    header('Location: ../index.html');


    function redirect() {
        // Jesli ktos jest juz zalogowany:
        if (isset($_SESSION['is_user_logged'])) {
            header('Location: ../user.html');
            exit();
        } else
        if (isset($_SESSION['is_admin_logged'])) {
            header('Location: ../admin.html');
            exit();
        }
    }