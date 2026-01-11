'use client';

import React, { useRef, useState, useTransition } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Send, Mail, User, MessageSquare, Shield } from 'lucide-react';
import { useFormState } from 'react-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { contactFormSchema, type ContactFormState } from '@/lib/schemas';
import { submitContactForm } from '@/app/actions';

import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Checkbox } from './ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';

import type * as z from 'zod';

type ContactFormValues = z.infer<typeof contactFormSchema>;

export const ContactForm: React.FC = () => {
  const [isPending, startTransition] = useTransition();
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  const [state, formAction] = useFormState<ContactFormState, FormData>(submitContactForm, {});

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
      priority: 'medium',
      newsletter: false,
    },
  });

  // Handle server action response
  React.useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast.success(state.message);
        form.reset();
        recaptchaRef.current?.reset();
        setRecaptchaToken(null);
      } else {
        toast.error(state.message);
      }
    }
  }, [state, form]);

  const onSubmit = async (data: ContactFormValues) => {
    if (!recaptchaToken) {
      toast.error('Please complete the reCAPTCHA verification.');
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('subject', data.subject);
      formData.append('message', data.message);
      formData.append('priority', data.priority);
      formData.append('newsletter', data.newsletter.toString());
      formData.append('recaptchaToken', recaptchaToken);

      formAction(formData);
    });
  };

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Contact Us
        </CardTitle>
        <CardDescription>
          Send us a message and we&apos;ll get back to you as soon as possible.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form action={formAction} className="space-y-6" data-testid="contact-form" role="form">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <label htmlFor="name" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Name
                    </label>
                    <FormControl>
                      <Input id="name" placeholder="Your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                    {state.errors?.name && (
                      <p className="text-sm text-destructive">{state.errors.name[0]}</p>
                    )}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </label>
                    <FormControl>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    {state.errors?.email && (
                      <p className="text-sm text-destructive">{state.errors.email[0]}</p>
                    )}
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <FormControl>
                    <Input placeholder="What's this about?" {...field} />
                  </FormControl>
                  <FormMessage />
                  {state.errors?.subject && (
                    <p className="text-sm text-destructive">{state.errors.subject[0]}</p>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority Level</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="low">Low - General inquiry</SelectItem>
                      <SelectItem value="medium">Medium - Standard request</SelectItem>
                      <SelectItem value="high">High - Urgent matter</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                  {state.errors?.priority && (
                    <p className="text-sm text-destructive">{state.errors.priority[0]}</p>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <label htmlFor="message" className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Message
                  </label>
                  <FormControl>
                    <Textarea
                      id="message"
                      placeholder="Tell us more about your inquiry..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Please provide as much detail as possible so we can assist you better.
                  </FormDescription>
                  <FormMessage />
                  {state.errors?.message && (
                    <p className="text-sm text-destructive">{state.errors.message[0]}</p>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newsletter"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Subscribe to our newsletter</FormLabel>
                    <FormDescription>
                      Get updates about new features and announcements.
                    </FormDescription>
                  </div>
                  {state.errors?.newsletter && (
                    <p className="text-sm text-destructive">{state.errors.newsletter[0]}</p>
                  )}
                </FormItem>
              )}
            />

            <div className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-950/20">
              <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <div>
                <FormLabel className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  reCAPTCHA Protection
                </FormLabel>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  Verify you're not a robot
                </p>
              </div>
            </div>
            <div className="flex justify-center">
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={
                  process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ||
                  '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'
                }
                onChange={(token) => setRecaptchaToken(token)}
                onExpired={() => setRecaptchaToken(null)}
              />
            </div>
            {state.errors?.recaptchaToken && (
              <p className="text-center text-sm text-destructive">
                {state.errors.recaptchaToken[0]}
              </p>
            )}

            {/* Hidden input for reCAPTCHA token */}
            <input type="hidden" name="recaptchaToken" value={recaptchaToken || ''} />

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={isPending || !recaptchaToken}
                className="flex-1"
                tabIndex={0}
              >
                {isPending ? (
                  'Sending...'
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset();
                  recaptchaRef.current?.reset();
                  setRecaptchaToken(null);
                }}
                disabled={isPending}
              >
                Reset
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
