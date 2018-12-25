<?php
    session_start();
    if (isset($_POST['nameRegister']) &&
        isset($_POST['surnameRegister']) &&
        isset($_POST['email']) &&
        isset($_POST['passwordRegister']) &&
        isset($_POST['passwordConfirm']))
    {
        $all_valid = true;
        //TODO validacja danych
        $name = $_POST['nameRegister'];
        $surname = $_POST['surnameRegister'];
        $email = $_POST['email'];
        $emailSanitized = filter_var($email, FILTER_SANITIZE_EMAIL);

        if ((filter_var($emailSanitized, FILTER_VALIDATE_EMAIL) == false) ||
            ($emailSanitized != $email)) {
            $all_valid = false;
            $_SESSION['error_email'] = 'Podaj poprawny adres email!';
        }

        $password1 = $_POST['passwordRegister'];
        $password2 = $_POST['passwordConfirm'];
        
        if((strlen($password1) < 8) || (strlen($password1) > 20))
        {
            $all_valid = false;
            $_SESSION['error_password'] = 'Hasło musi posiadać od 8 do 20 znaków!';
        }

        if($password1 != $password2)
        {
            $all_valid = false;
            $_SESSION['error_password'] = 'Podane hasła są różne!';
        }

        $password_hash = password_hash($password1, PASSWORD_DEFAULT);

        $_SESSION['form_name'] = $name;
        $_SESSION['form_surname'] = $surname;
        $_SESSION['form_email'] = $email;
        $_SESSION['form_password_register'] = $password1;
        
        require_once 'db.php';

        try 
        {
            // Sprawdzamy czy nie ma juz konta dla podanego emaila (rola nie wazna):
            $sql = 'SELECT u.idUser id_user
                    FROM User u
                    WHERE u.email = :emailLogin;';
            $query = $db->prepare($sql);
            $query->bindValue(':emailLogin', $email, PDO::PARAM_STR);
            $query->execute();

            if ($query->rowCount() > 0) {
                $all_valid = false;
                $_SESSION['error_email'] = 'Konto o podanym email już istnieje!';
            }

            if ($all_valid) {
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
                $sql = 'INSERT INTO UserLogged
                        VALUES (
                            NULL,
                            :password_hash,
                            :id_user
                        );';
                $query = $db->prepare($sql);
                $query->bindValue(':password_hash', $password_hash, PDO::PARAM_STR);
                $query->bindValue(':id_user', $id_user, PDO::PARAM_STR);
                $query->execute();

                // Wstawienie do tabeli UserRole:
                $sql = 'INSERT INTO UserRole
                        VALUES (
                        :id_user_logged,
                        (SELECT idRole
                            FROM Role r
                            WHERE r.name = :user_role
                            LIMIT 1
                        )
                        );';
                $query = $db->prepare($sql);
                $query->bindValue(':id_user_logged', $db->lastInsertId(), PDO::PARAM_STR);
                $query->bindValue(':user_role', 'user_logged', PDO::PARAM_STR);
                $query->execute();

                $db->commit();
                
                // Zapamietujemy dane rejestrujacego( a potem logujacego):
                $_SESSION['id_user'] = $id_user;
                $_SESSION['surname'] = $surname;
                $_SESSION['name'] = $name;
                $_SESSION['email'] = $email;
                $_SESSION['id_role'] = 2; // mozna by tu z selecta wyciagnac
                $_SESSION['role_name'] = 'user_logged';
                $_SESSION['is_user_logged'] = true;
                $_SESSION['registered'] = true;

                header('Location: ../user.html');
            } else {
                header('Location: ../index.html');
            }
        } catch (Exception $e) 
        {
            echo '<br />'.$e;
        }
    }