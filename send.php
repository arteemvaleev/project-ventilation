<?
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require $_SERVER['DOCUMENT_ROOT'] . '/PHPMailer/src/Exception.php';
require $_SERVER['DOCUMENT_ROOT'] . '/PHPMailer/src/PHPMailer.php';
require $_SERVER['DOCUMENT_ROOT'] . '/PHPMailer/src/SMTP.php';

function dump($array) {
	if (!empty($array)) {
		echo "<pre>";
		print_r($array);
		echo "</pre>";
	} else {
		echo "<b style='color:red'>Array is empty!</b>";
	}
}

$data = $_POST;

if (!empty($data)) {
    $mail = new PHPMailer;
    $mail->setFrom('arteemvaleev@gmail.com', 'Administrator');
    $mail->addAddress('arteemvaleev@gmail.com', 'Administrator');
    $mail->Subject = 'Заявка с квиза';

    foreach ($data as $name => $value) {
        $message .= "<b>{$name}:</b> {$value}<br>";
    }

    $mail->msgHTML($message);

    if (!empty($_FILES['quiz__file'])) {
        $uploadfile = tempnam(sys_get_temp_dir(), sha1($_FILES['quiz__file']['name']));
        if (move_uploaded_file($_FILES['quiz__file']['tmp_name'], $uploadfile)) {
            $mail->addAttachment($uploadfile, $_FILES['quiz__file']['name']);
        }
    }

    $resultSend = $mail->send();
    echo $resultSend;
} else {
	echo false;
}