"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MessageSquare } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Missing information", {
        description: "Please fill in all required fields",
      });
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      toast.success("Message sent successfully", {
        description: "Thank you for contacting us. We'll get back to you soon!",
      });

      setFormData({ name: "", email: "", subject: "", message: "" });
      setIsLoading(false);
    }, 1000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      {/* Contact Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-2xl">
            <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
              <MessageSquare className="text-primary h-5 w-5" />
            </div>
            <span>Send us a message</span>
          </CardTitle>
          <p className="text-muted-foreground">
            We&apos;d love to hear from you. Send us a message and we&apos;ll
            respond as soon as possible.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="What is this regarding?"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us how we can help you..."
                className="min-h-[120px]"
                required
                disabled={isLoading}
              />
            </div>

            <Button type="submit" className="w-full" loading={isLoading}>
              Send Message
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-2xl">
              <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
                <Mail className="text-primary h-5 w-5" />
              </div>
              <span>Get in touch</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-foreground mb-2 font-semibold">
                Email Support
              </h3>
              <p className="text-muted-foreground mb-2">
                For general inquiries and support
              </p>
              <a
                href="mailto:support@fajrring.com"
                className="text-primary hover:underline"
              >
                support@fajrring.com
              </a>
            </div>

            <div>
              <h3 className="text-foreground mb-2 font-semibold">
                Technical Issues
              </h3>
              <p className="text-muted-foreground mb-2">
                Having trouble with the service?
              </p>
              <a
                href="mailto:technical@fajrring.com"
                className="text-primary hover:underline"
              >
                technical@fajrring.com
              </a>
            </div>

            <div>
              <h3 className="text-foreground mb-2 font-semibold">
                Privacy & Security
              </h3>
              <p className="text-muted-foreground mb-2">
                Questions about your data and privacy
              </p>
              <a
                href="mailto:privacy@fajrring.com"
                className="text-primary hover:underline"
              >
                privacy@fajrring.com
              </a>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-foreground mb-4 font-semibold">
              Frequently Asked Questions
            </h3>
            <p className="text-muted-foreground mb-4">
              Before reaching out, you might find your answer in our FAQ
              section.
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/faq">Visit FAQ</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-primary/5">
          <CardContent className="p-6">
            <h3 className="text-foreground mb-2 font-semibold">
              Response Time
            </h3>
            <p className="text-muted-foreground text-sm">
              We typically respond to all inquiries within 24 hours. For urgent
              technical issues, we aim to respond within 2-4 hours during
              business hours.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
