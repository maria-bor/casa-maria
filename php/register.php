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
            $_SESSION['error_confirm'] = 'Podane hasła są różne!';
        }

        $password_hash = password_hash($password1, PASSWORD_DEFAULT);

        $_SESSION['form_name'] = $name;
        $_SESSION['form_surname'] = $surname;
        $_SESSION['form_email'] = $email;
        $_SESSION['form_password'] = $password1;
        $_SESSION['form_confirm'] = $password2;

        require_once 'db.php';

        try 
        {
            // TODO INŻ może być tak, że ktoś zarezerwuje a potem będzie chciał założyć
            // konto. Poniższy SQL spowoduje, że będzie dwóch userów o tych samych danych
            // bo on będzie w DB a inne spowoduje, że go nie znajdziemy.
            // SOLUTION sprawdzać tylko user.emil bez joina i jeśli jest to spr. imie i
            // nazwisko i dodać userlogged i role

            // Sprawdzamy czy nie ma juz konta dla podanego emaila (rola nie wazna):
            $sql = 'SELECT u.idUser id_user
                    FROM User u
                    INNER JOIN userlogged ul
                    ON ul.idUser = u.idUser
                    WHERE u.email = :emailLogin
                    AND ul.isDeleted = 0;';
            $query = $db->prepare($sql);
            $query->bindValue(':emailLogin', $email, PDO::PARAM_STR);
            $query->execute();
            if ($query->rowCount() > 0) {
                $all_valid = false;
                $_SESSION['error_email'] = 'Konto o podanym email już istnieje!';
            }

            if ($all_valid) {
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
                $sql = 'INSERT INTO UserLogged (idUserLogged, password, idUser)
                        VALUES (
                            NULL,
                            :password_hash,
                            :id_user);';
                $query = $db->prepare($sql);
                $query->bindValue(':password_hash', $password_hash, PDO::PARAM_STR);
                $query->bindValue(':id_user', $id_user, PDO::PARAM_STR);
                $query->execute();

                // Wstawienie do tabeli UserRole:
                $sql = 'INSERT INTO UserRole
                        VALUES (:id_user_logged, :id_role);';
                $query = $db->prepare($sql);
                $query->bindValue(':id_user_logged', $db->lastInsertId(), PDO::PARAM_STR);
                $query->bindValue(':id_role', $id_role, PDO::PARAM_STR);
                $query->execute();

                $db->commit();
            
                // Zapamietujemy dane rejestrujacego( a potem logujacego):
                if (!isset($_SESSION['is_admin_logged'])) {
                    $_SESSION['id_user'] = $id_user;
                    $_SESSION['surname'] = $surname;
                    $_SESSION['name'] = $name;
                    $_SESSION['email'] = $email;
                    $_SESSION['id_role'] = $id_role;
                    $_SESSION['role_name'] = $role_name;
                    $_SESSION['is_user_logged'] = true;
                    $_SESSION['registered'] = true;

                    header('Location: ../user.html');
                } else {
                    header('Location: ../admin.html');
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