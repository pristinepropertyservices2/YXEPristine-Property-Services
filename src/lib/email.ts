import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

// Create transporter
function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
}

// Send email
export async function sendEmail({ to, subject, html, text }: EmailOptions): Promise<{ success: boolean; message: string }> {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@yxepristinepropertyservices.ca',
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''),
    };

    await transporter.sendMail(mailOptions);
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, message: 'Failed to send email' };
  }
}

// Send verification email
export async function sendVerificationEmail(
  email: string,
  name: string,
  token: string
): Promise<{ success: boolean; message: string }> {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const verificationUrl = `${baseUrl}/api/auth/verify-email?token=${token}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #7c3aed 0%, #9333ea 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">YXE Pristine Property Services</h1>
      </div>
      <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
        <h2 style="color: #1f2937;">Hello ${name}!</h2>
        <p style="color: #4b5563;">Thank you for creating an account with YXE Pristine Property Services. Please verify your email address to activate your account.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" style="background: #7c3aed; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Verify Email Address</a>
        </div>
        <p style="color: #6b7280; font-size: 14px;">Or copy and paste this link into your browser:</p>
        <p style="color: #7c3aed; font-size: 12px; word-break: break-all;">${verificationUrl}</p>
        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">This link will expire in 24 hours. If you did not create an account, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        <p style="color: #9ca3af; font-size: 12px; text-align: center;">
          YXE Pristine Property Services<br>
          1731 Ave D N, Saskatoon, SK Canada S7L1R1<br>
          Phone: 639-471-3393
        </p>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: 'Verify Your Email - YXE Pristine Property Services',
    html,
  });
}

// Send password reset email
export async function sendPasswordResetEmail(
  email: string,
  name: string,
  token: string
): Promise<{ success: boolean; message: string }> {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const resetUrl = `${baseUrl}/reset-password?token=${token}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #7c3aed 0%, #9333ea 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">YXE Pristine Property Services</h1>
      </div>
      <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
        <h2 style="color: #1f2937;">Hello ${name}!</h2>
        <p style="color: #4b5563;">We received a request to reset your password. Click the button below to create a new password.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background: #7c3aed; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Reset Password</a>
        </div>
        <p style="color: #6b7280; font-size: 14px;">Or copy and paste this link into your browser:</p>
        <p style="color: #7c3aed; font-size: 12px; word-break: break-all;">${resetUrl}</p>
        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">This link will expire in 1 hour. If you did not request a password reset, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        <p style="color: #9ca3af; font-size: 12px; text-align: center;">
          YXE Pristine Property Services<br>
          1731 Ave D N, Saskatoon, SK Canada S7L1R1<br>
          Phone: 639-471-3393
        </p>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: 'Reset Your Password - YXE Pristine Property Services',
    html,
  });
}

// Send welcome email after verification
export async function sendWelcomeEmail(
  email: string,
  name: string
): Promise<{ success: boolean; message: string }> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome!</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #7c3aed 0%, #9333ea 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">Welcome to YXE Pristine!</h1>
      </div>
      <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
        <h2 style="color: #1f2937;">Hello ${name}!</h2>
        <p style="color: #4b5563;">Your email has been verified and your account is now active. Welcome to YXE Pristine Property Services!</p>
        <p style="color: #4b5563;">You can now:</p>
        <ul style="color: #4b5563;">
          <li>Book professional cleaning services</li>
          <li>Subscribe to our money-saving plans</li>
          <li>Manage your bookings and appointments</li>
          <li>Access exclusive member offers</li>
        </ul>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}#services" style="background: #7c3aed; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Book Your First Service</a>
        </div>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        <p style="color: #9ca3af; font-size: 12px; text-align: center;">
          YXE Pristine Property Services<br>
          1731 Ave D N, Saskatoon, SK Canada S7L1R1<br>
          Phone: 639-471-3393
        </p>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: 'Welcome to YXE Pristine Property Services!',
    html,
  });
}
