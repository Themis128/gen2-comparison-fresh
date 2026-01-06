'use client';

import dynamic from 'next/dynamic';

import type { PersonalData } from '../lib/personal-data';

// Dynamically import Contact component with SSR disabled
const Contact = dynamic(() => import('../components/Contact'), {
  ssr: false,
  loading: () => (
    <section id="contact" className="py-24">
      <div className="container mx-auto px-4 text-center">
        <h2 className="mb-4 text-3xl font-bold">Contact Me</h2>
        <p>Loading contact form...</p>
      </div>
    </section>
  ),
});

interface ContactSectionProps {
  data: PersonalData;
}

export default function ContactSection({ data }: ContactSectionProps) {
  return <Contact data={data} />;
}
