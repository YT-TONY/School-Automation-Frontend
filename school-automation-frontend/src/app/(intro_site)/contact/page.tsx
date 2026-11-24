// src/app/(intro_site)/contact/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSchoolTheme } from '@/hooks/useSchoolTheme';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Mail, Phone, MapPin, ArrowLeft, Send } from 'lucide-react';

export default function ContactPage() {
  const { branding } = useSchoolTheme();
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50/60 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </Link>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-primary">Get In Touch</span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Contact & Directions to {branding.schoolName}
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <Card className="p-6 md:col-span-5 space-y-4 text-xs text-slate-600">
            <h2 className="font-bold text-sm text-slate-900">Administrative Desk</h2>
            <div className="space-y-3">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>Plot 4, Educational Corridor, Off Main Expressway</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <span>+234 803 123 4567</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <span>admissions@school.edu.ng</span>
              </p>
            </div>
          </Card>

          <Card className="p-6 md:col-span-7">
            {submitted ? (
              <div className="text-center py-8 space-y-2">
                <h3 className="font-bold text-slate-900">Message Delivered</h3>
                <p className="text-xs text-slate-500">The school administration office will contact you promptly.</p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitted(true);
                }}
                className="space-y-4 text-xs font-medium text-slate-700"
              >
                <div>
                  <label className="block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Parent or Guardian Name"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block mb-1">Email or Phone Number</label>
                  <input
                    type="text"
                    required
                    placeholder="08012345678 or parent@gmail.com"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block mb-1">Inquiry Details</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Inquire about admissions, school fees, or schedule a campus visit..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>
                <Button type="submit" className="w-full">
                  <Send className="w-4 h-4" /> Send Inquiry
                </Button>
              </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}