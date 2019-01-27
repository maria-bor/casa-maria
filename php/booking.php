<?php
    session_start();

    redirect();

    require_once "helpers/requestResult.php";

    try {
        // Mozna tu przyjść tylko z konkretnych formularzy:
        if (count($_POST) == 3 && 
            isset($_POST['dateFrom']) &&
            isset($_POST['dateTo']) && 
            isset($_POST['nrPersons'])) { // dodawanie typu pokoju
            checkAvailability($result_obj);
        } else {
            $result_obj->message = 'Nieznane zapytanie';
        }
    } catch (PDOException $error) {
        $result_obj->message = 'Niepowodzenie, błąd:'.$error->getMessage();
    }

    echo json_encode($result_obj);

/*****DEFINICJE METOD*****/
    function redirect() {
        // TODO chyba niepotrzebne bo nie trzeba być zalogowanym
    }

    function checkAvailability($result_obj) {
        
        require_once "db.php";
        $result_obj->result = 'OK';
        $result_obj->message = 'test';
        // $result_obj->value = $results;
    }