<?php

//require 'class.phpmailer.php';

//require 'PHPMailerAutoload.php';

header('Content-Type: application/json; charset=utf-8', true);

require dirname(__FILE__).'/myphpclasses/PHPMailerAutoload.php';

$errors = array();  	// array to hold validation errors
$data = array(); 		// array to pass back data

// validate the variables ======================================================
	if (empty($_POST['emailname']))
		$errors['emailname'] = 'Name is required.';
	if (empty($_POST['emailaddress']))
		$errors['emailaddress'] = 'E-mail is required.';
	if (empty($_POST['emailmessage']))
		$errors['emailmessage'] = 'Message is required.';

	if ( ! empty($errors)) 
	{
		// if there are items in our errors array, return those errors
		$data["success"] = false;
		$data["errors"]  = $errors;
		
	} 
	else 
	{
		$config = parse_ini_file("../settings/commandandconquer.txt");
		$emailaddress = $_POST['emailaddress'];
		$message = $_POST['emailmessage'];
		$sender = $_POST['emailname'];
		
		$mail = new PHPMailer;
		
		$mail->isSMTP();                                      // Set mailer to use SMTP
		$mail->Host = 'box969.bluehost.com';  // Specify main and backup SMTP servers
		//$mail->SMTPDebug = 2;
		//$mail->Host = gethostbyname('smtp.gmail.com');
		//$mail->SMTPAuth = true;                               // Enable SMTP authentication
		
		$mail->Username = $config['user'];
		$mail->Password = $config['pass'];
		$mail->SMTPSecure = 'ssl';
		$mail->Port = 465;                                    // TCP port to connect to
		
		$mail->setFrom($emailaddress, $sender);
		
		
		$mail->addAddress('info@karlludwigsen.com', 'Karl Ludwigsen');     // Add a recipient
		
		//$mail->addAddress('ellen@example.com');               // Name is optional
		//$mail->addReplyTo('info@example.com', 'Information');
		//$mail->addCC('cc@example.com');
		//$mail->addBCC('bcc@example.com');
		
		
		//$mail->addAttachment('/var/tmp/file.tar.gz');         // Add attachments
		//$mail->addAttachment('/tmp/image.jpg', 'new.jpg');    // Optional name
		
		$mail->isHTML(true);                                  // Set email format to HTML

		$body = $message;
		//$body .= '<b>in bold!</b>';
		
		$mail->Subject = "$sender from karlludwigsen.com";
		$mail->Body    = $body;
		$mail->AltBody = $message;
		$mail->Send();
		$mail->SmtpClose();
		
		if($mail->IsError()) 		
		{
			//echo 'Message could not be sent.';
			//echo 'Mailer Error: ' . $mail->ErrorInfo;
			$errorinfo = $mail->ErrorInfo;
						
			$data["success"] = false;
			$data["errors"] = $errorinfo;
			$data["message"] = "Error Sending Email";
			$data["poop"] ='never believe the buttman';			
		}					
		else 
		{
			$data["success"] = true;
			$data["message"] = "Email Successfully Sent";
		}								
		//$response['mydata'] = $data;		
	}
	echo json_encode($data);
	//$mail->SMTPDebug = 3;                               // Enable verbose debug output
?>