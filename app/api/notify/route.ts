import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const { to, subject, html } = body;

  if (!to || !subject || !html) {
    return NextResponse.json({ message: 'Invalid payload' }, { status: 400 });
  }

  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.EMAIL_FROM || 'no-reply@care.xyz';

  if (!host || !user || !pass) {
    console.info('Email skipped: SMTP env variables are missing');
    return NextResponse.json({ message: 'Email skipped; configure SMTP to enable' });
  }

  const transporter = nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: { user, pass }
  });

  await transporter.sendMail({ from, to, subject, html });

  return NextResponse.json({ message: 'Email sent' });
}
