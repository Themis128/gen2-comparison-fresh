'use server';

import { revalidatePath } from 'next/cache';

import { z } from 'zod';

// Contact form validation schema (client and server shared)
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .trim(),
  email: z.string().email('Please enter a valid email address').toLowerCase().trim(),
  subject: z
    .string()
    .min(5, 'Subject must be at least 5 characters')
    .max(200, 'Subject must be less than 200 characters')
    .trim(),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message must be less than 2000 characters')
    .trim(),
  priority: z.enum(['low', 'medium', 'high'], {
    errorMap: () => ({ message: 'Please select a valid priority level' }),
  }),
  newsletter: z.boolean(),
  recaptchaToken: z.string().min(1, 'Please complete the reCAPTCHA verification'),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export type ContactFormState = {
  errors?: {
    name?: string[];
    email?: string[];
    subject?: string[];
    message?: string[];
    priority?: string[];
    newsletter?: string[];
    recaptchaToken?: string[];
  };
  message?: string;
  success?: boolean;
};

// Rate limiting store (in production, use Redis or similar)
const submissionStore = new Map<string, { count: number; resetTime: number }>();

// Rate limiting: max 3 submissions per hour per IP
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour

// Helper functions for rate limiting
function getClientIP(): string | null {
  // In server actions, we don't have direct access to request headers
  // This is a simplified implementation - in production, you'd get IP from headers
  return null; // For now, disable IP-based rate limiting
}

function isWithinRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = submissionStore.get(ip);

  if (!record) {
    return true; // No previous submissions
  }

  // Reset count if window has passed
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

  // Clean up old entries periodically
  if (Math.random() < 0.1) {
    // 10% chance to clean up
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
    // Basic rate limiting
    const clientIP = getClientIP();
    if (clientIP && !isWithinRateLimit(clientIP)) {
      return {
        message: 'Too many submissions. Please try again later.',
      };
    }

    // Extract form data with better error handling
    const rawData = {
      name: (formData.get('name') as string)?.trim(),
      email: (formData.get('email') as string)?.trim().toLowerCase(),
      subject: (formData.get('subject') as string)?.trim(),
      message: (formData.get('message') as string)?.trim(),
      priority: formData.get('priority') as string,
      newsletter: formData.get('newsletter') === 'on',
      recaptchaToken: formData.get('recaptchaToken') as string,
    };

    // Validate the data
    const validatedData = contactFormSchema.safeParse(rawData);

    if (!validatedData.success) {
      const fieldErrors = validatedData.error.flatten().fieldErrors;
      return {
        errors: fieldErrors,
        message: 'Please check the form and try again.',
      };
    }

    const data = validatedData.data;

    // Verify reCAPTCHA token
    const isValidRecaptcha = await verifyRecaptcha(data.recaptchaToken);
    if (!isValidRecaptcha) {
      return {
        errors: {
          recaptchaToken: ['reCAPTCHA verification failed. Please try again.'],
        },
        message: 'Security verification failed. Please try again.',
      };
    }

    // Save contact message to database
    await saveContactMessage(data);

    // Handle newsletter subscription if requested
    if (data.newsletter) {
      await subscribeToNewsletter(data.email, data.name);
    }

    // Update rate limiting
    if (clientIP) {
      updateRateLimit(clientIP);
    }

    // Revalidate the contact page to show updated data
    revalidatePath('/contact');

    return {
      message: "Thank you for your message! We'll get back to you within 24 hours.",
      success: true,
    };
  } catch (error) {
    console.error('Contact form submission error:', error);

    // Provide more specific error messages based on error type
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

// Helper function to verify reCAPTCHA token
async function verifyRecaptcha(token: string): Promise<boolean> {
  try {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;

    if (!secretKey) {
      // In development, accept all tokens if no secret key is set
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

// Helper function to save contact message (integrates with your existing Amplify setup)
async function saveContactMessage(data: ContactFormData): Promise<void> {
  try {
    // Import your Amplify client here to avoid circular dependencies
    const { client } = await import('@/lib/amplify-client');

    // Create the contact message using your existing schema
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

// Helper function to handle newsletter subscription
async function subscribeToNewsletter(email: string, name: string): Promise<void> {
  try {
    // This could integrate with your email service (Mailchimp, ConvertKit, etc.)
    // For now, we'll just log it
    console.warn('Newsletter subscription requested:', { email, name });

    // You could implement actual newsletter subscription here
    // await subscribeToMailchimp(email, name);
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    // Don't throw here - newsletter subscription failure shouldn't block form submission
  }
}
