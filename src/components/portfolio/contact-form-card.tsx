"use client";

import { FormEvent, useState } from "react";
import { Loader2, Mail, Send } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type ContactFormCardProps = {
  recipientUsername: string;
  recipientName: string;
};

export function ContactFormCard({ recipientUsername, recipientName }: ContactFormCardProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSending(true);
    try {
      const response = await fetch(`/api/contact/${recipientUsername}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          email,
          subject,
          message
        })
      });

      const data = (await response.json()) as { ok?: boolean; message?: string };

      if (!response.ok || !data.ok) {
        toast.error(data.message || "Failed to send message.");
        return;
      }

      toast.success("Message sent successfully.");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
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
        <Input
          value={subject}
          onChange={(event) => setSubject(event.target.value)}
          placeholder="Subject"
          required
        />
        <Textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Tell me about your project, role, or collaboration idea"
          rows={5}
          required
        />

        <Button type="submit" className="w-fit" disabled={sending}>
          {sending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
          Send Message
        </Button>
      </form>
    </div>
  );
}
