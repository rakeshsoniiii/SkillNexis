import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json();

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Prepare email data for Brevo API
    const emailData = {
      sender: {
        name: process.env.FROM_NAME || 'SkillNexis Contact Form',
        email: process.env.FROM_EMAIL || 'skillnexis.official@gmail.com'
      },
      to: [
        {
          email: process.env.CONTACT_EMAIL || 'skillnexis.official@gmail.com',
          name: 'SkillNexis Team'
        }
      ],
      replyTo: {
        email: email,
        name: name
      },
      subject: `Contact Form: ${subject}`,
      htmlContent: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">New Contact Form Submission</h1>
            <p style="color: #e8f4fd; margin: 10px 0 0 0; font-size: 16px;">SkillNexis Website</p>
          </div>
          
          <div style="padding: 40px 30px; background-color: #f8fafc; border-radius: 0 0 10px 10px;">
            <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); margin-bottom: 20px;">
              <h2 style="color: #2d3748; margin: 0 0 20px 0; font-size: 20px; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">Contact Details</h2>
              
              <div style="margin-bottom: 15px;">
                <strong style="color: #4a5568; display: inline-block; width: 80px;">Name:</strong>
                <span style="color: #2d3748; font-size: 16px;">${name}</span>
              </div>
              
              <div style="margin-bottom: 15px;">
                <strong style="color: #4a5568; display: inline-block; width: 80px;">Email:</strong>
                <a href="mailto:${email}" style="color: #3182ce; text-decoration: none; font-size: 16px;">${email}</a>
              </div>
              
              <div style="margin-bottom: 15px;">
                <strong style="color: #4a5568; display: inline-block; width: 80px;">Subject:</strong>
                <span style="color: #2d3748; font-size: 16px;">${subject}</span>
              </div>
            </div>
            
            <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <h3 style="color: #2d3748; margin: 0 0 15px 0; font-size: 18px;">Message:</h3>
              <div style="background-color: #f7fafc; padding: 20px; border-left: 4px solid #3182ce; border-radius: 6px; line-height: 1.6; color: #2d3748;">
                ${message.replace(/\n/g, '<br>')}
              </div>
            </div>
            
            <div style="margin-top: 30px; padding: 20px; background-color: #edf2f7; border-radius: 10px; text-align: center;">
              <p style="margin: 0; color: #718096; font-size: 14px;">
                This email was sent from the SkillNexis contact form.<br>
                Reply directly to this email to respond to <strong>${name}</strong> at <strong>${email}</strong>
              </p>
            </div>
          </div>
        </div>
      `,
      textContent: `
        New Contact Form Submission - SkillNexis
        
        Contact Details:
        Name: ${name}
        Email: ${email}
        Subject: ${subject}
        
        Message:
        ${message}
        
        ---
        This email was sent from the SkillNexis contact form.
        Reply directly to this email to respond to ${name} at ${email}
      `
    };

    // Send email using Brevo API
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY || ''
      },
      body: JSON.stringify(emailData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Brevo API Error:', errorData);
      return NextResponse.json(
        { error: 'Failed to send email. Please try again later.' },
        { status: 500 }
      );
    }

    const result = await response.json();
    // Email sent successfully

    return NextResponse.json(
      { message: 'Email sent successfully', messageId: result.messageId },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}