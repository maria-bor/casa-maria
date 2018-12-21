<?php
    session_start();
    if ((!isset($_POST['emailLogin'])) || (!isset($_POST['passwordLogin'])))
	{
		header('Location: ../index.html');
		exit();
    }

    require_once "connect.php";
    mysqli_report(MYSQLI_REPORT_STRICT);

    try {
        $db_connection = new mysqli($host, $db_user, $db_password, $db_name);
        if ($db_connection->connect_errno != 0)
            throw new Exception(mysqli_connect_errno());
        else
        {
            $login = $_POST['emailLogin'];
            $password = $_POST['passwordLogin'];

            $login = htmlentities($login, ENT_QUOTES, "UTF-8");

            if ($result = $db_connection->query(
                sprintf("SELECT * FROM userlogged ul JOIN user u ON u.id = ul.id_user WHERE u.email='%s'",
                        mysqli_real_escape_string($db_connection, $login))))
                loginUserLogged();
            else
            if ($result = $db_connection->query(
                sprintf("SELECT * FROM admin a JOIN user u ON u.id = a.id_user WHERE u.email='%s'",
                        mysqli_real_escape_string($db_connection, $login))))
                loginAdmin();

            $db_connection->close();
        }
    }
    catch(Exception $e)
    {
		echo '<span style="color:red;"> System niedostępny. Prosimy spróbować później/span>';
		echo '<br />Erro code: '.$e;
    }

    function error()
    {
        $_SESSION['error'] = '<span style="color:red">Wprowadzono nieprawidłowy login lub hasło!</span>';
        header('Location: ../index.php');
    }

    function loginUserLogged()
    {
        $user_logged_count = $result->num_rows;
                if ($user_logged_count > 0)
                {
                    $row = $rezultat->fetch_assoc();
                    if (password_verify($password, $row['password']))
                    {
                        $_SESSION['isUserLogged'] = true;
                        $_SESSION['id'] = $row['ul.id'];
                        $_SESSION['surname'] = $wiersz['surname'];
                        $_SESSION['name'] = $wiersz['name'];
                        $_SESSION['email'] = $wiersz['email'];
                        unset($_SESSION['error']);
                        $result->free_result();
                        header('Location: ../userLogged.html');
                    }
                    else
                        error();
                }
                else
                    error();
    }

    function loginAdmin()
    {
        $user_logged_count = $result->num_rows;
                if ($user_logged_count > 0)
                {
                    $row = $rezultat->fetch_assoc();
                    if (password_verify($password, $row['password']))
                    {
                        $_SESSION['isAdminLogged'] = true;
                        $_SESSION['id'] = $row['ul.id'];
                        $_SESSION['surname'] = $wiersz['surname'];
                        $_SESSION['name'] = $wiersz['name'];
                        $_SESSION['email'] = $wiersz['email'];
                        unset($_SESSION['error']);
                        $result->free_result();
                        header('Location: ../adminLogged.html');
                    }
                    else
                        error();
                }
                else
                    error();
    }
?>