import { NextRequest, NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

// Set your SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { reason, preferredContact, contactInfo, subject, message } = body;

    // Validate inputs
    if (!reason || !preferredContact || !contactInfo || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Compose email content
    const emailContent = `
      <h3>New Support Message</h3>
      <p><strong>Reason:</strong> ${reason}</p>
      <p><strong>Preferred Contact Method:</strong> ${preferredContact}</p>
      <p><strong>Contact Information:</strong> ${contactInfo}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `;

    // Configure email message
    const msg = {
      to: 'info@novationapp.com', // Replace with your email
      from: 'noreply@novationapp.com', // Must be verified in SendGrid
      subject: `Support Request: ${subject}`,
      text: `New support message from ${contactInfo}`,
      html: emailContent,
    };

    // Send email
    await sgMail.send(msg);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
