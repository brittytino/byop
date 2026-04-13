import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";

import { getUserByUsername } from "@/lib/repositories";

const contactSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email().max(120),
  subject: z.string().min(4).max(120),
  message: z.string().min(10).max(2000)
});

function readEnv(name: string) {
  return process.env[name]?.trim();
}

function parseBoolean(value?: string) {
  if (!value) {
    return false;
  }

  return ["1", "true", "yes", "on"].includes(value.toLowerCase());
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function getTransport() {
  const host = readEnv("SMTP_HOST");
  const portValue = readEnv("SMTP_PORT");
  const port = Number(portValue || 587);
  const user = readEnv("SMTP_USER");
  const rawPass = readEnv("SMTP_PASS");

  if (!host || !user || !rawPass) {
    return null;
  }

  const normalizedPass =
    host.toLowerCase().includes("gmail") ? rawPass.replace(/\s+/g, "") : rawPass;
  const safePort = Number.isFinite(port) ? port : 587;

  return nodemailer.createTransport({
    host,
    port: safePort,
    secure: parseBoolean(readEnv("SMTP_SECURE")) || safePort === 465,
    auth: {
      user,
      pass: normalizedPass
    }
  });
}

export async function POST(
  request: Request,
  { params }: { params: { username: string } }
) {
  try {
    const payload = await request.json();
    const parsed = contactSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json({ ok: false, message: "Invalid form data" }, { status: 400 });
    }

    const user = await getUserByUsername(params.username.toLowerCase());
    if (!user || !user.email) {
      return NextResponse.json(
        { ok: false, message: "Recipient email is not configured." },
        { status: 404 }
      );
    }

    const transport = getTransport();
    if (!transport) {
      return NextResponse.json(
        { ok: false, message: "SMTP is not configured." },
        { status: 503 }
      );
    }

    const { name, email, subject, message } = parsed.data;
    const fromAddress = readEnv("SMTP_FROM") || readEnv("SMTP_USER") || "noreply@byop.dev";

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeSubject = escapeHtml(subject);
    const safeMessage = escapeHtml(message);

    await transport.sendMail({
      from: fromAddress,
      to: user.email,
      replyTo: {
        name,
        address: email
      },
      subject: `[BYOP Contact] ${subject}`,
      text: [
        `A new contact request was sent to your BYOP portfolio.`,
        "",
        `Sender Name: ${name}`,
        `Sender Email: ${email}`,
        "",
        `Message:`,
        message
      ].join("\n"),
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #111;">
          <h2 style="margin-bottom: 8px;">New BYOP Portfolio Contact</h2>
          <p style="margin: 0 0 12px;">A visitor sent you a message from your BYOP portfolio.</p>
          <p style="margin: 0;"><strong>Sender:</strong> ${safeName}</p>
          <p style="margin: 0;"><strong>Email:</strong> ${safeEmail}</p>
          <p style="margin: 12px 0 4px;"><strong>Subject:</strong> ${safeSubject}</p>
          <p style="margin: 0; white-space: pre-wrap;">${safeMessage}</p>
        </div>
      `
    });

    return NextResponse.json({ ok: true, message: "Message sent successfully." });
  } catch (error) {
    console.error("[contact] Failed to send portfolio contact email", error);
    return NextResponse.json(
      { ok: false, message: "Failed to send message. Please try again later." },
      { status: 500 }
    );
  }
}
