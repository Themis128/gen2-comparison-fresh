'use server';

import { revalidatePath } from 'next/cache';

import { z } from 'zod';

// Server action schema
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  priority: z.enum(['low', 'medium', 'high']),
  newsletter: z.boolean(),
});

export type ContactFormData = z.infer<typeof contactSchema>;

export async function submitContactForm(formData: FormData) {
  'use server';

  try {
    // Extract form data
    const rawData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      subject: formData.get('subject') as string,
      message: formData.get('message') as string,
      priority: formData.get('priority') as string,
      newsletter: formData.get('newsletter') === 'on',
    };

    // Validate data
    const validatedData = contactSchema.parse(rawData);

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 200));

    // Simulate database operation
    console.warn('Server action: Contact form submitted', validatedData);

    // Revalidate the contact page
    revalidatePath('/contact');

    // Return success
    return {
      success: true,
      message: 'Message sent successfully!',
      data: validatedData
    };

  } catch (error) {
    console.error('Server action error:', error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: 'Validation failed',
        errors: error.errors
      };
    }

    return {
      success: false,
      message: 'Failed to send message. Please try again.'
    };
  }
}

// Server action for newsletter subscription
export async function subscribeToNewsletter(email: string) {
  'use server';

  try {
    // Validate email
    const emailSchema = z.string().email();
    emailSchema.parse(email);

    // Simulate subscription
    await new Promise(resolve => setTimeout(resolve, 100));

    console.warn('Server action: Newsletter subscription', { email });

    return {
      success: true,
      message: 'Successfully subscribed to newsletter!'
    };

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return {
      success: false,
      message: 'Invalid email address'
    };
  }
}
