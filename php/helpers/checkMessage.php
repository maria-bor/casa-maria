<?php

// Sesje powinien wystartować skrypt wołajacy funkcję
// session_start();

// Metoda do pobierania wiadomości z serwera
function getMessage() {
    if (isset($_SESSION['msg'])) {
        $msg = $_SESSION['msg'];
        unset($_SESSION['msg']);
        return $msg;
    } else {
        return '';
    }
}

// Metoda do sprawdzania czy jest jakaś wiadomość z serwera, jeśli tak to pokazuje okienko
function checkIsMessage() {
    if (isset($_SESSION['msg'])) {
        return 'display:block;';
    } else {
        return 'display:none;';
    }
}