'use client';

import { ContactForm } from '../../components/ContactForm';
import { DashboardLayout } from '../../components/DashboardLayout';
import { Toaster } from '../../components/ui/sonner';
import { UIComponentsDemo } from '../../components/UIComponentsDemo';

export default function UIComponentsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold mb-6">UI Components Showcase</h2>
            <UIComponentsDemo />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6">Contact Form Example</h2>
            <ContactForm />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6">
              Dashboard Layout Example
            </h2>
            <div className="border rounded-lg overflow-hidden">
              <DashboardLayout />
            </div>
          </section>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
