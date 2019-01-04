<?php

session_start();

// Metoda sprawdza czy wystapil blad rejestracji. Jesli tak to wyswietla formularz rejestracji (metoda z javascript.js):
function checkErrorRegistration() {
    if(isset($_SESSION['error_registration'])) {
        unset($_SESSION['error_registration']);
        return '<script>showRegistrationForm();</script>';
    } else {
        return '';
    }
}

return checkErrorRegistration();