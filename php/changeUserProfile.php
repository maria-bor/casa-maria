<?php
session_start();

print_r($_SESSION);
print_r($_POST);

if (!isset($_SESSION['id_user'])) {
    echo "ERROR: unknown user.";
    exit();
}

if (isset($_POST['name']) && isset($_POST['value']))
    if ($_POST['name'] == 'new_name')
        changeName($_POST['value']);
    else if ($_POST['name'] == 'new_surname')
        changeSurname($_POST['value']);
    else if ($_POST['name'] == 'new_email')
        changeEmail($_POST['value']);

echo "Dane zostały zmienione";


function changeName($new_name) {
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
    } catch (Exception $e)
    {
        echo '<br />'.$e;
    }
}

function changeSurname($new_surname) {
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
    } catch (Exception $e)
    {
        echo '<br />'.$e;
    }
}

function changeEmail($new_email) {
    $id_user = $_SESSION['id_user'];
    require_once 'db.php';
    try
    {
        $sql = 'UPDATE User
                SET email = :new_email
                WHERE idUser = :id_user;';
        $query = $db->prepare($sql);
        $query->bindValue(':new_email', $new_email, PDO::PARAM_STR);
        $query->bindValue(':id_user', $id_user, PDO::PARAM_STR);
        $query->execute();
        $_SESSION['email'] = $new_email;
    } catch (Exception $e)
    {
        echo '<br />'.$e;
    }
}