import nodemailer from 'nodemailer';

// Configure Nodemailer transporter using Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use Gmail service
  auth: {
    user: process.env.GMAIL_USER, // Your Gmail address from .env
    pass: process.env.GMAIL_APP_PASSWORD, // Your Gmail App Password from .env
  },
});

const receiver_email = process.env.EMAIL; // Your receiving email address

export async function POST(request) {
  try {
    // Parse the request body
    const formData = await request.json();
    const { name, email, message } = formData;

    // Validate required fields
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Please fill all required fields'
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded?.split(',')[0]?.trim() || 'IP not found';

    // Define email options
    const mailOptions = {
      from: `"Portfolio Contact" <${process.env.GMAIL_USER}>`, // Sender address (must be the authenticated Gmail user)
      to: receiver_email, // List of receivers
      subject: `New Contact Form Submission from ${name}`, // Subject line
      html: `
        <div>
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>IP:</strong> ${ip}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        </div>
      `, // HTML body
    };

    // Send the email using Nodemailer
    await transporter.sendMail(mailOptions);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Email sent successfully'
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    // Check for specific Nodemailer errors if needed
    let errorMessage = 'Failed to send email';
    if (error.code === 'EAUTH') {
        errorMessage = 'Authentication failed. Check Gmail credentials in .env file.';
    } else if (error.code === 'ECONNECTION') {
        errorMessage = 'Connection error. Check network or Gmail SMTP server status.';
    }
    
    return new Response(
      JSON.stringify({
        success: false,
        message: errorMessage,
        // Optionally include error details in development
        // error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
