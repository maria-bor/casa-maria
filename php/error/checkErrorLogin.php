<?php

session_start();

// Metoda sprawdza czy wystapil blad logowania. Jesli tak to wyswietla formularz logowania (metoda z javascript.js):
function checkErrorLogin() {
    if(isset($_SESSION['error_login'])) {
        unset($_SESSION['error_login']);
        return '<script>showLoginForm();</script>';
    } else {
        return '';
    }
}

return checkErrorLogin();