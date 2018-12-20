<?php
    session_start();
    if ((!isset($_POST['emailLogin'])) || (!isset($_POST['passwordLogin'])))
	{
		header('Location: index.html');
		exit();
    }

    require_once "connect.php";

    $db_connection = @new mysqli($host, $db_user, $db_password, $db_name);
    if ($db_connection->connect_errno != 0)
	{
		echo "Błąd: ".$db_connection->connect_errno." Skontaktuj się z Administratorem";
	}
	else
	{
        $login = $_POST['emailLogin'];
        $password = $_POST['passwordLogin'];

        $login = htmlentities($login, ENT_QUOTES, "UTF-8");

        if ($result = @$db_connection->query(
            sprintf("SELECT * FROM userlogged ul JOIN user u ON u.id = ul.id_user WHERE u.email='%s'",
                    mysqli_real_escape_string($db_connection, $login))))
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
                    header('Location: userLogged.html');
                }
                else
                {
                    $_SESSION['error'] = '<span style="color:red">Wprowadzono nieprawidłowy login lub hasło!</span>';
                    header('Location: index.php');
                }
            }
            else
            {
                $_SESSION['error'] = '<span style="color:red">Wprowadzono nieprawidłowy login lub hasło!</span>';
                header('Location: index.php');
            }
        }
        else
        if ($result = @$db_connection->query(
            sprintf("SELECT * FROM admin a JOIN user u ON u.id = a.id_user WHERE u.email='%s'",
                    mysqli_real_escape_string($db_connection, $login))))
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
                    header('Location: adminLogged.html');
                }
                else
                {
                    $_SESSION['error'] = '<span style="color:red">Wprowadzono nieprawidłowy login lub hasło!</span>';
                    header('Location: index.php');
                }
            }
            else
            {
                $_SESSION['error'] = '<span style="color:red">Wprowadzono nieprawidłowy login lub hasło!</span>';
                header('Location: index.php');
            }
        }
        $db_connection->close();
    }
?>