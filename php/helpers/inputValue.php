<?php

// Sesje powinien wystartowac skrypt wolajacy funkcje
// session_start();

// Metoda sprawdza czy zmienna  formularza zostala podana. Jesli tak to  ja wypelnia:
function inputValue($value_name) {
    return isset($_SESSION[$value_name]) ? 'value="'.$_SESSION[$value_name].'"' : '';
}