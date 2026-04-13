"use client";

import { FormEvent, useState } from "react";
import { Mail, Send } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type ContactFormCardProps = {
  recipientEmail?: string | null;
  recipientName: string;
};

export function ContactFormCard({ recipientEmail, recipientName }: ContactFormCardProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!recipientEmail) {
      toast.error("Email is not configured for this portfolio yet.");
      return;
    }

    const subject = `${name || "New contact"} reached out via BYOP portfolio`;
    const body = [
      `Hi ${recipientName},`,
      "",
      message || "I would like to connect with you.",
      "",
      `Sender Name: ${name || "Not provided"}`,
      `Sender Email: ${email || "Not provided"}`
    ].join("\n");

    const mailtoUrl = `mailto:${encodeURIComponent(recipientEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoUrl;
    toast.success("Opening your email app.");

    setName("");
    setEmail("");
    setMessage("");
  }

  return (
    <div className="glass rounded-2xl border border-border bg-surface/70 p-5">
      <h3 className="flex items-center gap-2 text-lg font-semibold">
        <Mail className="h-5 w-5 text-primary" />
        Contact Form
      </h3>
      <p className="mt-1 text-sm text-muted">
        Send a quick message directly to {recipientName}.
      </p>

      <form onSubmit={onSubmit} className="mt-4 grid gap-3">
        <Input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Your name"
          required
        />
        <Input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Your email"
          required
        />
        <Textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Tell me about your project, role, or collaboration idea"
          rows={5}
          required
        />

        <Button type="submit" className="w-fit">
          <Send className="mr-2 h-4 w-4" />
          Send Message
        </Button>
      </form>
    </div>
  );
}
