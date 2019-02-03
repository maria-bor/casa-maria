<?php
    session_start();

    if (isset($_POST['nameRegister']) &&
        isset($_POST['surnameRegister']) &&
        isset($_POST['email']) &&
        isset($_POST['passwordRegister']) &&
        isset($_POST['passwordConfirm']))
    {
        $all_valid = true;
        $name = $_POST['nameRegister'];
        $surname = $_POST['surnameRegister'];
        $email = $_POST['email'];
        $name = htmlentities($name, ENT_QUOTES, "UTF-8");
        $surname = htmlentities($surname, ENT_QUOTES, "UTF-8");
        $email = htmlentities($email, ENT_QUOTES, "UTF-8");
        $emailSanitized = filter_var($email, FILTER_SANITIZE_EMAIL);

        if ((filter_var($emailSanitized, FILTER_VALIDATE_EMAIL) == false) ||
            ($emailSanitized != $email)) {
            $all_valid = false;
            $_SESSION['error_email'] = 'Podaj poprawny adres email!';
        }

        $password1 = $_POST['passwordRegister'];
        $password2 = $_POST['passwordConfirm'];
        $password1 = htmlentities($password1, ENT_QUOTES, "UTF-8");
        $password2 = htmlentities($password2, ENT_QUOTES, "UTF-8");
        
        if((strlen($password1) < 8) || (strlen($password1) > 20))
        {
            $all_valid = false;
            $_SESSION['error_password'] = 'Hasło musi posiadać od 8 do 20 znaków!';
        }

        if($password1 != $password2)
        {
            $all_valid = false;
            $_SESSION['error_confirm'] = 'Podane hasła są różne!';
        }

        $password_hash = password_hash($password1, PASSWORD_DEFAULT);

        $_SESSION['form_name'] = $name;
        $_SESSION['form_surname'] = $surname;
        $_SESSION['form_email'] = $email;

        require_once 'db.php';

        try 
        {
            if ($all_valid) {
                // Sprawdzamy czy nie ma już konta aktywnego dla podanego emaila (rola nie ważna):
                $sql = 'SELECT u.idUser id_user
                FROM User u
                INNER JOIN userlogged ul
                ON ul.idUser = u.idUser
                WHERE u.email = :emailLogin
                AND ul.activated = 1
                AND ul.isDeleted = 0;';
                $query = $db->prepare($sql);
                $query->bindValue(':emailLogin', $email, PDO::PARAM_STR);
                $query->execute();
                if ($query->rowCount() > 0) {
                    $all_valid = false;
                    $_SESSION['error_email'] = 'Konto już istnieje!';
                    header('Location: ../index.html');
                    exit();
                } else {
                    // Sprawdzamy czy jest konto ale nie aktywne:
                    $sql = 'SELECT u.idUser id_user
                        FROM User u
                        INNER JOIN userlogged ul
                        ON ul.idUser = u.idUser
                        WHERE u.email = :emailLogin
                        AND ul.activated = 0
                        AND ul.isDeleted = 0;';
                    $query = $db->prepare($sql);
                    $query->bindValue(':emailLogin', $email, PDO::PARAM_STR);
                    $query->execute();
                    if ($query->rowCount() > 0) {
                        $all_valid = false;
                        $_SESSION['error_email'] =  'Konto nieaktywne!'.
                                                    'Aktywuj je klikając w link wysłany na adres podany przy rejestracji.';
                        header('Location: ../index.html');
                        exit();
                    } else {

                        // Tworzymy wiadomość email:
                        $code = substr(md5(mt_rand()),0,15);
                        $verification_link = "http://localhost/casa-maria/php/activate.php?code=".$code."&email=".urlencode($email);
                        $htmlStr = "";
                        $htmlStr .= "Dzień dobry " . $email . ",<br /><br />";

                        $htmlStr .= "Kliknij w poniższy link w celu aktywacji swojego konta, dzięki czemu będziesz mógł dokonać rezeracji w systemie <b>CASA-MARIA</b>.<br /><br /><br />";
                        $htmlStr .= "<a href='{$verification_link}' target='_blank' style='padding:1em; font-weight:bold; background-color:blue; color:#fff;'>AKTYWUJ EMAIL</a><br /><br /><br />";

                        $htmlStr .= "Pozdrawiamy,<br />";
                        $htmlStr .= "<a href='http://localhost/casa-maria/' target='_blank'>CASA-MARIA</a><br />";

                        $from = "CASA-MARIA";
                        $email_sender = "kitdlainnychspam@gmail.com";
                        $subject = "Link aktywacyjny | CASA-MARIA";
                        $recipient_email = $email;

                        $headers  = "MIME-Version: 1.0\r\n";
                        $headers .= "Content-type: text/html; charset=iso-8859-1\r\n";
                        $headers .= "From: {$from} <{$email_sender}> \n";

                        $body = $htmlStr;

                        // Wysłanie emaila
                        if( mail($recipient_email, $subject, $body, $headers) ) {
                            $_SESSION['msg'] = 'Link aktywacyjny zostało wysłany na adres <b>'.$email.
                                            '</b> Prosimy otwórz swoją skrzynkę mailową i aktywuj swoje konto.';

                            // Wyciągnięcie roli jeszcze przed transakcją
                            $sql = 'SELECT idRole
                                    FROM Role r
                                    WHERE r.name = :user_role
                                    LIMIT 1;';
                            $query = $db->prepare($sql);
                            $role_name = '';
                            if (isset($_SESSION['is_admin_logged'])) {
                                $role_name = 'admin';
                            } else {
                                $role_name = 'user_logged';
                            }
                            $query->bindValue(':user_role', $role_name, PDO::PARAM_STR);
                            $query->execute();
                            $result = $query->fetch();
                            $id_role = $result['idRole'];

                            $db->beginTransaction();

                            // Wstawienie do tabeli User:
                            $sql = 'INSERT INTO User
                                    VALUES (
                                    NULL,
                                    :surname,
                                    :name,
                                    :email
                                    );';
                            $query = $db->prepare($sql);
                            $query->bindValue(':surname', $surname, PDO::PARAM_STR);
                            $query->bindValue(':name', $name, PDO::PARAM_STR);
                            $query->bindValue(':email', $email, PDO::PARAM_STR);
                            $query->execute();
                            $id_user = $db->lastInsertId();

                            // Wstawienie do tabeli UserLogged:
                            $sql = 'INSERT INTO UserLogged (
                                    idUserLogged, idUser, password, activated,
                                    activation_code, created_at, modified_at)
                                    VALUES (
                                        NULL,
                                        :id_user,
                                        :password_hash,
                                        :activated,
                                        :code,
                                        CURRENT_TIMESTAMP,
                                        CURRENT_TIMESTAMP);';
                            $query = $db->prepare($sql);
                            $query->bindValue(':id_user', $id_user, PDO::PARAM_INT);
                            $query->bindValue(':password_hash', $password_hash, PDO::PARAM_STR);
                            $query->bindValue(':activated', 0, PDO::PARAM_INT);
                            $query->bindValue(':code', $code, PDO::PARAM_INT);
                            $query->execute();

                            // Wstawienie do tabeli UserRole:
                            $sql = 'INSERT INTO UserRole
                                    VALUES (:id_user_logged, :id_role);';
                            $query = $db->prepare($sql);
                            $query->bindValue(':id_user_logged', $db->lastInsertId(), PDO::PARAM_INT);
                            $query->bindValue(':id_role', $id_role, PDO::PARAM_INT);
                            $query->execute();

                            $db->commit();

                        } else {
                            $_SESSION['error_register'] = true;
                        }
                        header('Location: ../index.html');
                    }
                }
            } else {
                $_SESSION['error_register'] = true;
                header('Location: ../index.html');
            }
        } catch (Exception $e) 
        {
            echo '<br />'.$e;
        }
    }