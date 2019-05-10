<?php
if(isset($_POST['nameContact']) && isset($_POST['emailContact']) && isset($_POST['emailContact'])) {
	$n = $_POST['nameContact'];
	$e = $_POST['emailContact'];
	$m = nl2br($_POST['messageContact']);
	$to = 'kitdlainnychspam@gmail.com';
	$from = $e;
	$subject = 'Wiadomość kontaktowa z casa-maria';
	$message = "Pan/Pani: " . $n . "\r\n" . "Email: " . $e . "\r\n" . "Wiadomość: " . $m ;
	if(mail($to, $subject, $message)) {
		echo 'success';
	} else {
		echo 'Something go wrong..';
	}
}
?>