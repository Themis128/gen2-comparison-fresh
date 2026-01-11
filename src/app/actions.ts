'use server';

import { revalidatePath } from 'next/cache';

import { contactFormSchema, type ContactFormData, type ContactFormState } from '@/lib/schemas';

// Re-export types for convenience (but they come from schemas.ts now)
export type { ContactFormState } from '@/lib/schemas';

// Rate limiting store (in production, use Redis or similar)
const submissionStore = new Map<string, { count: number; resetTime: number }>();

// Rate limiting: max 3 submissions per hour per IP
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour

// Helper functions for rate limiting
function getClientIP(): string | null {
  return null; // For now, disable IP-based rate limiting
}

function isWithinRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = submissionStore.get(ip);

  if (!record) {
    return true;
  }

  if (now > record.resetTime) {
    submissionStore.delete(ip);
    return true;
  }

  return record.count < RATE_LIMIT_MAX;
}

function updateRateLimit(ip: string): void {
  const now = Date.now();
  const record = submissionStore.get(ip);

  if (!record) {
    submissionStore.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
  } else {
    record.count += 1;
  }

  if (Math.random() < 0.1) {
    for (const [key, value] of submissionStore.entries()) {
      if (now > value.resetTime) {
        submissionStore.delete(key);
      }
    }
  }
}

// Server action for submitting contact form
export async function submitContactForm(
  prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  try {
    const clientIP = getClientIP();
    if (clientIP && !isWithinRateLimit(clientIP)) {
      return {
        message: 'Too many submissions. Please try again later.',
      };
    }

    const rawData = {
      name: (formData.get('name') as string)?.trim(),
      email: (formData.get('email') as string)?.trim().toLowerCase(),
      subject: (formData.get('subject') as string)?.trim(),
      message: (formData.get('message') as string)?.trim(),
      priority: formData.get('priority') as string,
      newsletter: formData.get('newsletter') === 'on',
      recaptchaToken: formData.get('recaptchaToken') as string,
    };

    const validatedData = contactFormSchema.safeParse(rawData);

    if (!validatedData.success) {
      const fieldErrors = validatedData.error.flatten().fieldErrors;
      return {
        errors: fieldErrors,
        message: 'Please check the form and try again.',
      };
    }

    const data = validatedData.data;

    const isValidRecaptcha = await verifyRecaptcha(data.recaptchaToken);
    if (!isValidRecaptcha) {
      return {
        errors: {
          recaptchaToken: ['reCAPTCHA verification failed. Please try again.'],
        },
        message: 'Security verification failed. Please try again.',
      };
    }

    await saveContactMessage(data);

    if (data.newsletter) {
      await subscribeToNewsletter(data.email, data.name);
    }

    if (clientIP) {
      updateRateLimit(clientIP);
    }

    revalidatePath('/contact');

    return {
      message: "Thank you for your message! We'll get back to you within 24 hours.",
      success: true,
    };
  } catch (error) {
    console.error('Contact form submission error:', error);

    if (error instanceof Error) {
      if (error.message.includes('network') || error.message.includes('fetch')) {
        return {
          message: 'Network error. Please check your connection and try again.',
        };
      }
      if (error.message.includes('database') || error.message.includes('save')) {
        return {
          message: 'Database error. Please try again in a few minutes.',
        };
      }
    }

    return {
      message: 'An unexpected error occurred. Please try again later.',
    };
  }
}

async function verifyRecaptcha(token: string): Promise<boolean> {
  try {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;

    if (!secretKey) {
      console.warn('RECAPTCHA_SECRET_KEY not set, accepting token in development mode');
      return process.env.NODE_ENV === 'development';
    }

    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: secretKey,
        response: token,
      }),
    });

    const result = await response.json();
    return result.success === true;
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return false;
  }
}

async function saveContactMessage(data: ContactFormData): Promise<void> {
  try {
    const { client } = await import('@/lib/amplify-client');

    await client.models.ContactMessage.create({
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
      priority: data.priority,
      newsletter: data.newsletter,
      recaptchaToken: data.recaptchaToken,
    });

    console.warn('Contact message saved successfully:', { name: data.name, email: data.email });
  } catch (error) {
    console.error('Failed to save contact message:', error);
    throw new Error('Failed to save your message. Please try again.');
  }
}

async function subscribeToNewsletter(email: string, name: string): Promise<void> {
  try {
    console.warn('Newsletter subscription requested:', { email, name });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
  }
}
