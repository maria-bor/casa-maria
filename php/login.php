<?php
    session_start();

    redirect();

    require_once "db.php";

    // Mozna tu przyjsc tylko z formularza logowania:
    if (isset($_POST['emailLogin']) && isset($_POST['passwordLogin'])) {
        $login = $_POST['emailLogin'];
        $password = $_POST['passwordLogin'];
        $_SESSION['form_login_email'] = $login;
        $_SESSION['form_login_password'] = $password;

        $sql = 'SELECT u.idUser id_user,
                       surname,
                       u.name,
                       email,
                       ul.idUserLogged id_user_logged,
                       password,
                       r.idRole id_role,
                       r.name role_name
                FROM userlogged ul
                JOIN user u
                ON u.idUser = ul.idUser
                JOIN userrole ur
                ON ul.idUserLogged = ur.idUserLogged
                JOIN role r
                ON ur.idRole = r.idRole
                WHERE u.email = :emailLogin';
        $query = $db->prepare($sql);
		$query->bindValue(':emailLogin', $login, PDO::PARAM_STR);
        $query->execute();

        $user = $query->fetch();
        // print_r($user);
        // Sprawdzenie czy jest taki user o podanym emailu:
        if ($query->rowCount() == 0) {
            $_SESSION['error_login_email'] = 'Konto nie istnieje!';
            header('Location: ../index.html');
		    exit();
        }

        // Sprawdzamy haslo:
        if ($user && password_verify($password, $user['password'])) {
            // Zapamietujemy dane logujacego:
            $_SESSION['id_user'] = $user['id_user'];
            $_SESSION['surname'] = $user['surname'];
            $_SESSION['name'] = $user['name'];
            $_SESSION['email'] = $user['email'];
            $_SESSION['password'] = $password;
            $_SESSION['id_role'] = $user['id_role'];
            $_SESSION['role_name'] = $user['role_name'];
            if ($user['role_name'] == 'admin')
                $_SESSION['is_admin_logged'] = true;
            else if ($user['role_name'] == 'user_logged')
                $_SESSION['is_user_logged'] = true;
        } else {
            $_SESSION['error_login_password'] = 'Nieprawidłowe hasło!';
            $_SESSION['error_login'] = true;
			header('Location: ../index.html');
			exit();
        }
    } else {
        $_SESSION['error_login'] = true;
        header('Location: ../index.html');
		exit();
    }

    redirect();

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