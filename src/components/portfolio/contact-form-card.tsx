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
    <div className="glass flex h-full flex-col rounded-3xl border border-border bg-surface/70 lg:p-1 lg:shadow-glow">
      <div className="flex h-full flex-col rounded-[1.35rem] bg-background/50 p-6 md:p-8">
        <h3 className="flex items-center gap-2 font-heading text-xl font-bold tracking-tight">
          <Mail className="h-5 w-5 text-primary" />
          Contact Form
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-muted">
          Send a direct message to {recipientName}. All messages are routed directly to their inbox.
        </p>

        <form onSubmit={onSubmit} className="mt-6 flex flex-1 flex-col gap-4">
          <Input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Your Name (e.g. Jane Doe)"
            className="h-12 border-border/60 bg-surface/40 hover:bg-surface/80"
            required
          />
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email Address"
              className="h-12 border-border/60 bg-surface/40 hover:bg-surface/80"
              required
            />
            <Input
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              placeholder="Subject"
              className="h-12 border-border/60 bg-surface/40 hover:bg-surface/80"
              required
            />
          </div>
          <Textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Message (Tell me about your project, role, or collaboration idea)"
            rows={5}
            className="flex-1 resize-none border-border/60 bg-surface/40 hover:bg-surface/80"
            required
          />

          <Button type="submit" className="mt-2 h-12 w-full text-base font-medium shadow-none transition-transform hover:scale-[0.98]" disabled={sending}>
            {sending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Send className="mr-2 h-5 w-5" />}
            Send Message
          </Button>
        </form>
      </div>
    </div>
  );
}
