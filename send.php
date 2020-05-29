<?php
//----Скрипт отправки почты через SMTP с использованием PHPMailer----
//Импорт классов PHPMailer в глобальное пространство имен. Они должны быть в верхней части скрипта, а не внутри функции
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
if (!empty($_POST["contact-button"])) {
$name = $_POST["contact-name"];
$name = check_symbol($name, "Имя", "1", "/^[A-ZА-ЯЁ]+\z/iu");
$email = $_POST["contact-email"];
$email = check_symbol($email, "E-mail", "1", "/^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z]{2,6}\z/i");
$subject = $_POST["contact-subject"];
$subject = check_symbol($subject, "Тема сообщения", "1", "0");
$comment = $_POST["contact-comment"];
$comment = check_symbol($comment, "Текст сообщения", "1", "0");
if (!empty($GLOBALS['alert'])) {
$alert = 'Данные из формы не отправлены. Обнаружены следующие ошибки: \n'.$alert;
include "alert.php";
}
else {
//Подключение библиотеки
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/SMTP.php';
$mail = new PHPMailer(); //Инициализация класса
$from = 'feedback@avtobezugona.ru'; //Адрес почты, с которой идет отправка письма
$to = 'admin@avtobezugona.ru'; //Адрес получателя
$mail -> isSMTP(); //Применение протокола SMTP
$mail -> Host = 'smtp.yandex.ru';//Адрес почтового сервера
$mail -> SMTPAuth = true; //Включение режима авторизации
$mail -> Username = 'emonocle'; //Логин от доменной почты, подключенной к стороннему почтовому сервису (в данном случае в Яндекс.Почта)
$mail -> Password = 'dollwlzumtjwdxgp'; //Пароль от доменной почты
$mail -> SMTPSecure = 'ssl'; //Протокол шифрования
$mail -> Port = '465'; //Порт сервера SMTP
$mail -> CharSet = 'UTF-8'; //Кодировка
$mail -> setFrom($from, 'emonocle@yandex.ru'); //Адрес и имя отправителя
$mail -> addAddress($to, 'vstarostin@emiia.ru'); //Адрес и имя получателя
$mail -> isHTML (true); //Установка формата электронной почты в HTML
$mail -> Subject = 'Отправлена форма обратной связи'; //Тема письма (заголовок)
$mail -> Body = "
<html>
<body>
<p>Имя отправителя: $name</p>
<p>Адрес отправителя: $email</p>
<p>Тема сообщения: $subject</p>
<p>Содержание сообщения: $comment</p>
</body>
</html>
"; //Содержимое письма
$mail -> AltBody = 'Текст альтернативного письма'; //Альтернативное письмо в случае, если почтовый клиент не поддерживает формат HTML
$mail -> SMTPDebug = 1; //Включение отладки SMTP: 0 - выкл (для штатного использования), 1 = сообщения клиента, 2 - сообщения клиента и сервера
if ($mail -> send()) {
$alert = 'Сообщение отправлено'; //Вывод сообщения в диалоговом окне браузера об успешной отправке письма
}
else {
$alert = 'Ошибка, письмо не может быть отправлено: '.$mail -> ErrorInfo; //Вывод сообщения об ошибке
}
include "send.php";
}
}
?>
