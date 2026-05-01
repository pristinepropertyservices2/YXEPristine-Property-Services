'use client';

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to send message");
      toast({ title: "Message sent", description: "We will get back to you shortly." });
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto grid gap-8 px-4 md:grid-cols-2">
        <div>
          <Badge className="mb-4 bg-amber-100 text-amber-900">Contact</Badge>
          <h1 className="mb-4 text-3xl font-bold md:text-4xl">Get in touch</h1>
          <p className="mb-6 text-muted-foreground">
            Questions, quotes, or custom service requests — we are here to help.
          </p>

          <div className="space-y-6 text-sm">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-purple-900 shadow-sm ring-1 ring-purple-950/35">
                <MapPin className="h-5 w-5 text-white" strokeWidth={2} />
              </div>
              <div>
                <p className="font-medium">Address</p>
                <p className="text-muted-foreground">1731 Ave D N, Saskatoon, SK, Canada S7L1R1</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-purple-900 shadow-sm ring-1 ring-purple-950/35">
                <Phone className="h-5 w-5 text-white" strokeWidth={2} />
              </div>
              <div>
                <p className="font-medium">Phone</p>
                <a href="tel:639-471-3393" className="text-amber-700 hover:underline">
                  639-471-3393
                </a>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-purple-900 shadow-sm ring-1 ring-purple-950/35">
                <Mail className="h-5 w-5 text-white" strokeWidth={2} />
              </div>
              <div>
                <p className="font-medium">Email</p>
                <a
                  href="mailto:info@yxepristinepropertyservices.ca"
                  className="text-amber-700 hover:underline"
                >
                  info@yxepristinepropertyservices.ca
                </a>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-purple-900 shadow-sm ring-1 ring-purple-950/35">
                <Clock className="h-5 w-5 text-white" strokeWidth={2} />
              </div>
              <div>
                <p className="font-medium">Working hours</p>
                <p className="text-muted-foreground">Monday–Friday · 8:00 AM–5:00 PM</p>
                <p className="text-muted-foreground">Saturday–Sunday · Closed</p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <Button asChild variant="outline">
              <Link href="/book">Book a service</Link>
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Send us a message</CardTitle>
            <CardDescription>We usually respond within one business day.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  required
                  value={form.name}
                  onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  rows={5}
                  required
                  value={form.message}
                  onChange={(e) => setForm((s) => ({ ...s, message: e.target.value }))}
                />
              </div>
              <Button type="submit" className="w-full bg-purple-700 hover:bg-purple-800" disabled={sending}>
                {sending ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

