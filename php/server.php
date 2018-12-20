<?php
session_start();

// initializing variables
$username = "";
$email    = "";
$errors = array(); 

// connect to the database
$db = mysqli_connect('localhost', 'root', '', 'casa-maria');

// REGISTER USER
if (isset($_POST['registerButt'])) {
  // receive all input values from the form
  $username = mysqli_real_escape_string($db, $_POST['nameRegister']);
  $surname = mysqli_real_escape_string($db, $_POST['surnameRegister']);
  $email = mysqli_real_escape_string($db, $_POST['email']);
  $password_1 = mysqli_real_escape_string($db, $_POST['passwordRegister']);
  $password_2 = mysqli_real_escape_string($db, $_POST['passwordConfirm']);

  // form validation: ensure that the form is correctly filled ...
  // by adding (array_push()) corresponding error unto $errors array
  if (empty($username)) { array_push($errors, "Username is required"); }
  if (empty($email)) { array_push($errors, "Email is required"); }
  if (empty($password_1)) { array_push($errors, "Password is required"); }
  if ($password_1 != $password_2) {
	array_push($errors, "The two passwords do not match");
  }

  // first check the database to make sure 
  // a user does not already exist with the same username and/or email
  $user_check_query = "SELECT * FROM userlogged 
                        INNER JOIN user 
                        ON user.id_user = userLogged.id_user 
                        WHERE name='$username' OR surname='$surname' email='$email' 
                        LIMIT 1";
  $result = mysqli_query($db, $user_check_query);
  $user = mysqli_fetch_assoc($result);
  
  if ($user) { // if user exists
    if ($user['nameRegister'] === $username) {
      array_push($errors, "Username already exists");
    }

    if ($user['email'] === $email) {
      array_push($errors, "email already exists");
    }
  }

  // Finally, register user if there are no errors in the form
  if (count($errors) == 0) {
  	$password = md5($password_1);//encrypt the password before saving in the database

  	$query = "INSERT INTO (surname, name, email, password) 
                SELECT surname, name, email, password
                FROM user u
                INNER JOIN userLogged ul
                ON u.id_user = ul.id_user";
  	mysqli_query($db, $query);
  	$_SESSION['username'] = $username;
  	$_SESSION['success'] = "You are now logged in";
  	header('location: index.php');
  }
}

// ... 