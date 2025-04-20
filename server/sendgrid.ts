import { MailService } from '@sendgrid/mail';

// Initialize SendGrid with API key if present
let mailService: MailService | null = null;

export function initSendGrid(apiKey?: string) {
  if (apiKey) {
    mailService = new MailService();
    mailService.setApiKey(apiKey);
    console.log('SendGrid email service initialized');
    return true;
  } else {
    console.warn('SendGrid API key not provided. Email functionality disabled.');
    return false;
  }
}

interface EmailParams {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
  replyTo?: string;
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  if (!mailService) {
    console.warn('SendGrid email service not initialized. Email not sent.');
    return false;
  }

  try {
    await mailService.send({
      to: params.to,
      from: params.from,
      subject: params.subject,
      text: params.text,
      html: params.html,
      replyTo: params.replyTo
    });
    console.log(`Email sent to ${params.to}`);
    return true;
  } catch (error) {
    console.error('SendGrid email error:', error);
    return false;
  }
}

// Helper function to create HTML content for contact form emails
export function createContactFormEmailHtml(name: string, email: string, subject: string, message: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #4a5568; border-bottom: 1px solid #e0e0e0; padding-bottom: 10px;">New Contact Form Submission</h2>
      
      <div style="margin: 20px 0;">
        <p style="margin: 10px 0;"><strong style="color: #4a5568;">Name:</strong> ${name}</p>
        <p style="margin: 10px 0;"><strong style="color: #4a5568;">Email:</strong> <a href="mailto:${email}" style="color: #3182ce;">${email}</a></p>
        <p style="margin: 10px 0;"><strong style="color: #4a5568;">Subject:</strong> ${subject}</p>
      </div>
      
      <div style="background-color: #f7fafc; padding: 15px; border-radius: 6px; margin: 20px 0;">
        <h3 style="color: #4a5568; margin-top: 0;">Message:</h3>
        <p style="white-space: pre-line;">${message}</p>
      </div>
      
      <div style="font-size: 0.875rem; color: #718096; border-top: 1px solid #e0e0e0; padding-top: 15px; margin-top: 20px;">
        <p>This email was sent from your portfolio website's contact form.</p>
      </div>
    </div>
  `;
}