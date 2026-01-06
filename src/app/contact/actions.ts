'use server';

import { revalidatePath } from 'next/cache';

import { z } from 'zod';

const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  priority: z.enum(['low', 'medium', 'high']),
  newsletter: z.boolean(),
  recaptchaToken: z.string().min(1, 'reCAPTCHA verification required'),
});

export async function submitContactForm(formData: FormData) {
  'use server';

  try {
    const data = Object.fromEntries(formData) as Record<string, string | boolean>;
    const validatedData = contactFormSchema.parse({
      ...data,
      newsletter: data.newsletter === 'on',
    });

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Here you would typically send email or save to database
    // eslint-disable-next-line no-console
    console.log('Contact form submitted via server action:', validatedData);

    // Simulate successful submission
    revalidatePath('/contact');

    return { success: true, message: 'Message sent successfully' };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.reduce((acc, err) => {
          acc[err.path[0] as string] = err.message;
          return acc;
        }, {} as Record<string, string>),
      };
    }

    return { success: false, message: 'An error occurred while sending your message' };
  }
}
