import { z } from 'zod';

// Contact form validation schema (shared between client and server)
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

export type ContactFormData = z.infer<typeof contactFormSchema>;

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
