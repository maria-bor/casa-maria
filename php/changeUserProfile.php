<?php
session_start();

$result_obj = new stdClass();
$result_obj->result = 'ERROR';
$result_obj->message = 'Niepoprawne dane';
$result_obj->value = '';

if (!isset($_SESSION['id_user'])) {
    $result_obj->message = 'Nieznany użytkownik';
    echo json_encode($result_obj);
    exit();
}

if (isset($_POST['name']) && isset($_POST['value'])) {
    if ($_POST['name'] == 'new_name')
        $result = changeName($_POST['value'], $result_obj);
    else if ($_POST['name'] == 'new_surname')
        $result = changeSurname($_POST['value'], $result_obj);
    else if ($_POST['name'] == 'new_email')
        $result = changeEmail($_POST['value'], $result_obj);
    echo json_encode($result);
} else {
    echo json_encode($result_obj);
}


/*****METODY ZMIENIAJĄCE DANE*****/
function changeName($new_name, $result_obj) {
    $id_user = $_SESSION['id_user'];
    require_once 'db.php';
    try
    {
        $sql = 'UPDATE User
                SET name = :new_name
                WHERE idUser = :id_user;';
        $query = $db->prepare($sql);
        $query->bindValue(':new_name', $new_name, PDO::PARAM_STR);
        $query->bindValue(':id_user', $id_user, PDO::PARAM_STR);
        $query->execute();
        $_SESSION['name'] = $new_name;
        $result_obj->result = 'OK';
        $result_obj->message = 'Imię zostało zmienione';
        $result_obj->value = $new_name;
        return $result_obj;
    } catch (Exception $e)
    {
        $result_obj->message = $e;
        return $result_obj;
    }
}

function changeSurname($new_surname, $result_obj) {
    $id_user = $_SESSION['id_user'];
    require_once 'db.php';
    try
    {
        $sql = 'UPDATE User
                SET surname = :new_surname
                WHERE idUser = :id_user;';
        $query = $db->prepare($sql);
        $query->bindValue(':new_surname', $new_surname, PDO::PARAM_STR);
        $query->bindValue(':id_user', $id_user, PDO::PARAM_STR);
        $query->execute();
        $_SESSION['surname'] = $new_surname;
        $result_obj->result = 'OK';
        $result_obj->message = 'Nazwisko zostało zmienione';
        $result_obj->value = $new_surname;
        return $result_obj;
    } catch (Exception $e)
    {
        $result_obj->message = $e;
        return $result_obj;
    }
}

function changeEmail($new_email, $result_obj) {
    $id_user = $_SESSION['id_user'];
    require_once 'db.php';
    try
    {
        // Sprawdzamy czy nie ma juz konta dla podanego emaila (rola nie wazna):
        $sql = 'SELECT u.idUser id_user
            FROM User u
            WHERE u.email = :emailLogin;';
        $query = $db->prepare($sql);
        $query->bindValue(':emailLogin', $new_email, PDO::PARAM_STR);
        $query->execute();

        if ($query->rowCount() > 0) {
            $result_obj->result = 'ERROR';
            $result_obj->message = 'Konto o podanym email już istnieje!';
            $result_obj->value = $_SESSION['email'];
            return $result_obj;
        }

        $sql = 'UPDATE User
                SET email = :new_email
                WHERE idUser = :id_user;';
        $query = $db->prepare($sql);
        $query->bindValue(':new_email', $new_email, PDO::PARAM_STR);
        $query->bindValue(':id_user', $id_user, PDO::PARAM_STR);
        $query->execute();
        $_SESSION['email'] = $new_email;
        $result_obj->result = 'OK';
        $result_obj->message = 'Email został zmieniony';
        $result_obj->value = $new_email;
        return $result_obj;
    } catch (Exception $e)
    {
        $result_obj->message = $e;
        return $result_obj;
    }
}