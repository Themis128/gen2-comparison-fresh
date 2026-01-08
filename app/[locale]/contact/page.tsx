'use client';

import { ContactForm } from '@/components/ContactForm';
import { MobileNavigation } from '@/components/MobileNavigation';

export default function ContactPage() {
  return (
    <>
      <MobileNavigation />
      <main className="safe-area-bottom container mx-auto px-4 py-8">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-3xl font-bold tracking-tight">Get in Touch</h1>
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
