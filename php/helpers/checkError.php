<?php

// Sesje powinien wystartowac skrypt wolajacy funkcje
// session_start();

// Metoda sprawdza czy wystapil blad logowania. Jesli tak to wyswietla formularz logowania (metoda z javascript.js):
function checkError($error_name) {
    if (isset($_SESSION[$error_name])) {
        $error = $_SESSION[$error_name];
        unset($_SESSION[$error_name]);
        return '<p>'.$error.'</p>';
    } else {
        return '';
    }
}