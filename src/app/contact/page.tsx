'use client';

import { ContactForm } from '@/components/ContactForm';
import { MobileNavigation } from '@/components/MobileNavigation';

export default function ContactPage() {
  return (
    <>
      <MobileNavigation />
      <main className="container mx-auto px-4 py-8 safe-area-bottom">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-4">Get in Touch</h1>
            <p className="text-muted-foreground">
              Have a question or want to work together? Send us a message.
            </p>
          </div>
          <ContactForm />
        </div>
      </main>
    </>
  );
}