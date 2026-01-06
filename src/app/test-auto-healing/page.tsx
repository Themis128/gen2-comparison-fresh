'use client';

import { useState } from 'react';

import Link from 'next/link';

export default function TestAutoHealingPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Auto-Healing Test Page</h1>

      {/* Sign In Link */}
      <div className="mb-8">
        <Link
          href="/auth/signin"
          className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          data-testid="sign-in-link"
        >
          Sign In
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Navigation</h2>
        <div className="space-x-4">
          <Link href="/contact" className="text-blue-500 hover:underline">
            Contact
          </Link>
          <Link href="/dashboard" className="text-blue-500 hover:underline">
            Dashboard
          </Link>
        </div>
      </div>

      {/* Contact Form */}
      <div className="max-w-md">
        <h2 className="text-xl font-semibold mb-4">Contact Form</h2>

        {isSubmitted && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            Message sent successfully! Thank you for your feedback.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-1">
              Message
            </label>
            <textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              rows={4}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
