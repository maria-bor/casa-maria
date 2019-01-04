<?php

session_start();

// Sprawdza czy wystapil blad rejestracji. Jesli tak to wyswietla formularz rejestracji (metoda z javascript.js):
if(isset($_SESSION['error_register'])) {
    unset($_SESSION['error_register']);
    echo "error_register";
} else {
    echo "";
}