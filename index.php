<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Document</title>
	<link rel="stylesheet"  href="https://fonts.googleapis.com/css?family=Roboto+Condensed:400,700">
	<link rel="stylesheet" type="text/css" href="style.css">
</head>
<body>
	<main>
		<p>SEND E-MAIL</p>
		<form class="contact-form" action="contactform.php" method="POST">
			<input type="text" name="name" placeholder="Full name">
			<input type="text" name="mail" placeholder="Your e-mail">
			<input type="text" name="subject" placeholder="Subject">
			<textarea name="message" placeholder="Message"></textarea>
			<button type="submit" name="submit">SEND MAIL</button>
		</form>	
	</main>
</body>
</html>
