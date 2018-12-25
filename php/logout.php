<?php
    session_start();

    if (isset($_SESSION['is_user_logged']))
        unset($_SESSION['is_user_logged']);
    
    if (isset($_SESSION['is_admin_logged']))
        unset($_SESSION['is_admin_logged']);
    
    unset($_SESSION['id_user']);
    unset($_SESSION['surname']);
    unset($_SESSION['name']);
    unset($_SESSION['id_role']);        
    unset($_SESSION['role_name']);
    unset($_SESSION['id_user']);
    unset($_SESSION['id_user']);

    header('Location: ../index.html');
