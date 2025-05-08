import { NextRequest, NextResponse } from 'next/server';
import * as Brevo from '@getbrevo/brevo';

// Initialize Brevo API
const apiInstance = new Brevo.TransactionalEmailsApi();
apiInstance.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY || '');

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

    // Compose email content for sending to yourself
    const internalEmailContent = `
      <h3>New Support Message</h3>
      <p><strong>Reason:</strong> ${reason}</p>
      <p><strong>Preferred Contact Method:</strong> ${preferredContact}</p>
      <p><strong>Contact Information:</strong> ${contactInfo}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `;

    // Configure email for sending to yourself
    const sendSmtpEmailInternal = new Brevo.SendSmtpEmail();
    sendSmtpEmailInternal.subject = `Support Request: ${subject}`;
    sendSmtpEmailInternal.htmlContent = internalEmailContent;
    sendSmtpEmailInternal.sender = { name: 'Novation Contact Form', email: process.env.SENDER_EMAIL || '' }; // Replace with your "sender" email configured in Brevo
    sendSmtpEmailInternal.to = [{ email: process.env.RECIPIENT_EMAIL || '' }]; // Replace with your actual recipient email or use env variable

    // Send email to yourself
    await apiInstance.sendTransacEmail(sendSmtpEmailInternal);
    // Optionally, send a confirmation email to the user
    // const sendSmtpEmailUser = new Brevo.SendSmtpEmail();
    // sendSmtpEmailUser.subject = "We've received your message";
    // sendSmtpEmailUser.htmlContent = "<h1>Thank You!</h1><p>We have received your message and will get back to you shortly.</p>";
    // sendSmtpEmailUser.sender = { name: "Novation App", email: "noreply@yourdomain.com" };
    // if (preferredContact === 'email' && contactInfo) { // Only send if they prefer email and provided an email
    //   sendSmtpEmailUser.to = [{ email: contactInfo }];
    //   await apiInstance.sendTransacEmail(sendSmtpEmailUser);
    // }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    // Brevo errors might have more details in error.response.body
    const errorMessage = (error as any).response?.body?.message || 'Failed to send email';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
