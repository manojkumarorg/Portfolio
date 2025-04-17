<?php
// Set your email here
$my_email = 'manojkumarplr18@gmail.com';

if($_POST) {
   // Get form data
   $name = trim($_POST['name']);
   $email = trim($_POST['email']);
   $subject = trim($_POST['subject']);
   $message = trim($_POST['message']);

   // Set default subject if empty
   if (empty($subject)) { 
       $subject = "New Contact Form Submission"; 
   }

   // Prepare email content
   $email_content = "Name: $name\n";
   $email_content .= "Email: $email\n\n";
   $email_content .= "Message:\n$message\n\n";
   $email_content .= "Sent from your website contact form";

   // Set email headers
   $headers = "From: $name <$email>";

   // Attempt to send email
   if (mail($my_email, $subject, $email_content, $headers)) {
       echo "OK"; // Success
   } else {
       echo "Failed to send message. Please try again later.";
   }
   exit;
}
?>