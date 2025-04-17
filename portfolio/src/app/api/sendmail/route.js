import { Resend } from 'resend';

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY);
const reciever_email = process.env.EMAIL;

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
    
    // Send the email using Resend
    const data = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>', // Replace with your domain when verified
      to: reciever_email,
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <div>
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>IP:</strong> ${ip}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        </div>
      `,
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email sent successfully' 
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'Failed to send email' 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
