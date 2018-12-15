<?php
if(isset($_POST['nameContact']) && isset($_POST['emailContact']) && isset($_POST['emailContact'])) {
	$n = $_POST['nameContact'];
	$e = $_POST['emailContact'];
	$m = nl2br($_POST['emailContact']);
	$to = 'syrotamaria@gmail.com';
	$from = $e;
	$subject = 'Contact Form Message';
	$message = '<b>Imie:</b> '.$n.' <br><b>Email:</b> '.$e.' <p>'.$m.'</p>';
	$headers = 'From: $from\n';
	$headers .= 'MIME-Version: 1.0\n';
	$headers .= 'Content-type: text/html; charset=iso-8859-1\n';
	if(mail($to, $subject, $message, $headers)) {
		echo 'success';
	} else {
		echo 'Something go wrong..';
	}
} 
?>
