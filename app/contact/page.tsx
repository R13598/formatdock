'use client';

import { useState } from 'react';
import Link from 'next/link';
import SiteHeader from '@/components/site-header';
import SiteFooter from '@/components/site-footer';
import TrustBadgeBar from '@/components/trust-badge-bar';
import { Mail, MessageSquare, Send, CheckCircle2, ArrowLeft, Bug, HelpCircle } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Question',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background/80 text-foreground">
      <SiteHeader />
      <TrustBadgeBar />

      <main className="flex-1 py-12 lg:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="mb-8 text-center sm:text-left">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors mb-4"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
            </Link>

            <div className="inline-flex items-center gap-2 rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10 px-3.5 py-1 text-xs font-semibold text-fuchsia-600 dark:text-fuchsia-400 mb-3">
              <MessageSquare className="h-4 w-4" /> Get in Touch
            </div>

            <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
              Contact FormatDock
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Have a feature request, exam preset suggestion, or bug report? We&apos;d love to hear from you.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-12">
            
            {/* Direct Channels Column */}
            <div className="lg:col-span-5 space-y-4">
              <div className="rounded-2xl border border-border/80 bg-card/60 p-5 backdrop-blur-md specular-card">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/15 text-blue-500 mb-3">
                  <Mail className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-foreground">Direct Email Support</h3>
                <p className="mt-1 text-xs text-muted-foreground">For technical support and business inquiries:</p>
                <a
                  href="mailto:support@formatdock.com"
                  className="mt-2 inline-block font-mono text-xs font-bold text-primary hover:underline"
                >
                  support@formatdock.com
                </a>
              </div>

              <div className="rounded-2xl border border-border/80 bg-card/60 p-5 backdrop-blur-md specular-card">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-500 mb-3">
                  <Bug className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-foreground">Request an Exam Preset</h3>
                <p className="mt-1 text-xs text-muted-foreground">Need photo dimensions for a new state or national exam? Send us the specification link and we&apos;ll add it within 24 hours.</p>
              </div>

              <div className="rounded-2xl border border-border/80 bg-card/60 p-5 backdrop-blur-md specular-card">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/15 text-purple-500 mb-3">
                  <HelpCircle className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-foreground">Privacy Guarantee</h3>
                <p className="mt-1 text-xs text-muted-foreground">FormatDock runs client-side. We cannot view, access, or recover any files you process using our tools.</p>
              </div>
            </div>

            {/* Interactive Form Column */}
            <div className="lg:col-span-7">
              <div className="glass-panel rounded-3xl border border-border/80 p-6 sm:p-8 specular-card">
                {submitted ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-500 mb-4">
                      <CheckCircle2 className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">Message Received!</h3>
                    <p className="mt-2 text-xs text-muted-foreground max-w-sm">
                      Thank you for contacting FormatDock. Our developer team will review your message and respond shortly.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="mt-6 text-xs font-semibold text-primary underline"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <h3 className="text-base font-bold text-foreground mb-4">Send us a message</h3>
                    
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground mb-1">
                          Your Name
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Rahul Sharma"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full rounded-xl border border-border bg-card/80 px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground mb-1">
                          Your Email
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="rahul@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full rounded-xl border border-border bg-card/80 px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground mb-1">
                        Subject
                      </label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full rounded-xl border border-border bg-card/80 px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
                      >
                        <option value="General Question">General Question</option>
                        <option value="New Exam Preset Request">Request New Exam Resizer Preset</option>
                        <option value="Bug Report">Report a Bug / Issue</option>
                        <option value="Partnership">Partnership Inquiry</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground mb-1">
                        Message
                      </label>
                      <textarea
                        required
                        rows={4}
                        placeholder="How can we help you?"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full rounded-xl border border-border bg-card/80 px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn-primary-glow inline-flex w-full items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold text-white shadow-sm"
                    >
                      <Send className="h-3.5 w-3.5" /> Send Message
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>

        </div>
      </main>

      <SiteFooter />
    </div>
  );
}