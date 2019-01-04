<?php

session_start();

// Sprawdza czy wystapil blad logowania. Jesli tak to wyswietla formularz logowania (metoda z javascript.js):
if(isset($_SESSION['error_login'])) {
    unset($_SESSION['error_login']);
    echo "error_login";
} else {
    echo "";
}