<!-- обработка почты необходим phpmailer-->
<?php
require 'class.phpmailer.php';

$cname = htmlspecialchars(strip_tags(trim($_POST['cname'])));
$cphone = htmlspecialchars(strip_tags(trim($_POST['ctel'])));
$ctip = htmlspecialchars(strip_tags(trim($_POST['ctip'])));

if($ctip=="call"){    
        $subject = 'Перезвоните мне.';     
        $message = 'Просьба о звонке от <b>' . $cname . '</b><br/>';
        $message .= 'Телефон: <b>' . $cphone . '</b><br/>';
}

if($ctip=="order"){ 
        $subject = 'Новая заявка';
        $message = 'Новая заявка от <b>' . $cname . '</b><br/>';
        $message .= 'Телефон: <b>' . $cphone . '</b><br/>';
}


$mail = new PHPMailer; 
        $mail->CharSet = 'utf-8';
        $mail->From = 'emonocle@yandex.ru';      // от кого 
        $mail->FromName = 'Andrew';   // от кого 
        $mail->AddAddress('vstarostin@emiia.ru'); // кому - адрес, Имя 
        $mail->IsHTML(true);        // выставляем формат письма HTML 
        $mail->Subject = $subject;  // тема письма 
        $mail->Body = $message; 
        if(isset($_FILES['attachfile'])) { 
                if($_FILES['attachfile']['error'] == 0){ 
                        $mail->AddAttachment($_FILES['attachfile']['tmp_name'], $_FILES['attachfile']['name']); 
                } 
         } 

        // отправляем наше письмо 
        if(!$mail->send()) {
            echo 0;
        } else {
            echo 1;
        }
?>
<!-- обработка почты -->
