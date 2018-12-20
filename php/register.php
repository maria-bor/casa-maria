<?php
    session_start();
    if(isset($_POST['nameRegister']) && isset($_POST['surnameRegister']) && isset($_POST['email']) &&  isset($_POST['passwordRegister']) && isset($_POST['passwordConfirm'])) 
    {
        $allvalid = true;
        //TODO validacja danych
        $name = $_POST['nameRegister'];
        $surname = $_POST['surnameRegister'];
        $email = $_POST['email'];
        $emailSanitized = filter_var($email, FILTER_SANITIZE_EMAIL);

        if((filter_var($emailSanitized, FILTER_VALIDATE_EMAIL)==false) || ($emailSanitized!=$email))
        {
            $allvalid = false;
            $_SESSION['errorEmail'] = 'Podaj poprawny adres email!';
        }

        $password1 = $_POST['passwordRegister'];
        $password2 = $_POST['passwordConfirm'];
        
        if((strlen($password1)<8) || (strlen($password1)>20)) 
        {
            $allvalid = false;
            $_SESSION['errorPassword'] = 'Hasło musi posiadać od 8 do 20 znaków!';
        }

        if($password1!=$password2) 
        {
            $allvalid = false;
            $_SESSION['errorPassword'] = 'Podane hasła są różne!';
        }

        $password_hash = password_hash($password1, PASSWORD_DEFAULT);

        $_SESSION['name'] = $name;            
        $_SESSION['surname'] = $surname;
        $_SESSION['email'] = $email;
        $_SESSION['passwordRegister'] = $password1;
        $_SESSION['passwordConfirm'] = $password2;
        
        require_once 'connect.php';
        mysqli_report(MYSQLI_REPORT_STRICT);
        try 
        {
            $db_connection = new mysqli($host, $db_user, $db_password, $db_name);

            if($db_connection->connect_errno!=0)
            {
                throw new Exception(mysqli_connect_errno());
            } 
            else
            {
                $result = $db_connection->query("SELECT ul.id FROM userlogged ul INNER JOIN user u ON ul.id_user = u.id WHERE u.email='$email'");
                if(!$result) throw new Exception($db_connection->error);

                if($result->num_rows>0) 
                {
                    $allvalid = false;
                    $_SESSION['errorEmail'] = 'Konto o podanym email już istnieje!';
                } 
                
                if($allvalid==true) 
                {
                    if($db_connection->query("INSERT INTO user VALUES (NULL, '$surname', '$name', '$email')")) 
                    {
                        if($db_connection->query("INSERT INTO userLogged VALUES (NULL, '$password1', LAST_INSERT_ID())"))
                        {
                            $_SESSION['registered'] = true;
                            header('Location: ../userLogged.html');
                        }
                        else 
                        {
                            throw new Exception($db_connection->error);
                        }
                    }
                    else 
                    {
                        throw new Exception($db_connection->error);
                    }
                }
                $db_connection->close();
            }
        } catch (Exception $e) 
        {
            echo '<br />'.$e;
        }
    }
?>