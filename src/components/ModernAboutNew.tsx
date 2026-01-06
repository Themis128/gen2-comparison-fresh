import React, { useEffect, useRef } from 'react';

import Image from 'next/image';

import { motion, useInView, useScroll, useSpring, useTransform } from 'framer-motion';
import {
  Award,
  Briefcase,
  Calendar,
  CheckCircle,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Network,
  Phone,
  Server,
  Terminal,
} from 'lucide-react';

import { Badge } from '@/components/badge';
import { Card, CardContent } from '@/components/card';

import type { PersonalData } from '../lib/personal-data';

type BGVariantType =
  | 'dots'
  | 'diagonal-stripes'
  | 'grid'
  | 'horizontal-lines'
  | 'vertical-lines'
  | 'checkerboard';
type BGMaskType =
  | 'fade-center'
  | 'fade-edges'
  | 'fade-top'
  | 'fade-bottom'
  | 'fade-left'
  | 'fade-right'
  | 'fade-x'
  | 'fade-y'
  | 'none';

type BGPatternProps = React.ComponentProps<'div'> & {
  variant?: BGVariantType;
  mask?: BGMaskType;
  size?: number;
  fill?: string;
};

const maskClasses: Record<BGMaskType, string> = {
  'fade-edges': '[mask-image:radial-gradient(ellipse_at_center,var(--background),transparent)]',
  'fade-center': '[mask-image:radial-gradient(ellipse_at_center,transparent,var(--background))]',
  'fade-top': '[mask-image:linear-gradient(to_bottom,transparent,var(--background))]',
  'fade-bottom': '[mask-image:linear-gradient(to_bottom,var(--background),transparent)]',
  'fade-left': '[mask-image:linear-gradient(to_right,transparent,var(--background))]',
  'fade-right': '[mask-image:linear-gradient(to_right,var(--background),transparent)]',
  'fade-x': '[mask-image:linear-gradient(to_right,transparent,var(--background),transparent)]',
  'fade-y': '[mask-image:linear-gradient(to_bottom,transparent,var(--background),transparent)]',
  none: '',
};

function getBgImage(variant: BGVariantType, fill: string, size: number) {
  switch (variant) {
    case 'dots':
      return `radial-gradient(${fill} 1px, transparent 1px)`;
    case 'grid':
      return `linear-gradient(to right, ${fill} 1px, transparent 1px), linear-gradient(to bottom, ${fill} 1px, transparent 1px)`;
    case 'diagonal-stripes':
      return `repeating-linear-gradient(45deg, ${fill}, ${fill} 1px, transparent 1px, transparent ${size}px)`;
    case 'horizontal-lines':
      return `linear-gradient(to bottom, ${fill} 1px, transparent 1px)`;
    case 'vertical-lines':
      return `linear-gradient(to right, ${fill} 1px, transparent 1px)`;
    case 'checkerboard':
      return `linear-gradient(45deg, ${fill} 25%, transparent 25%), linear-gradient(-45deg, ${fill} 25%, transparent 25%), linear-gradient(45deg, transparent 75%, ${fill} 75%), linear-gradient(-45deg, transparent 75%, ${fill} 75%)`;
    default:
      return undefined;
  }
}

const BGPattern = ({
  variant = 'grid',
  mask = 'none',
  size = 24,
  fill = 'hsl(var(--border))',
  className = '',
  style,
  ...props
}: BGPatternProps) => {
  const bgSize = `${size}px ${size}px`;
  const backgroundImage = getBgImage(variant, fill, size);

  return (
    <div
      className={`absolute inset-0 z-[-10] size-full ${maskClasses[mask]} ${className}`}
      style={{
        backgroundImage,
        backgroundSize: bgSize,
        ...style,
      }}
      {...props}
    />
  );
};

interface StatCounterProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  suffix: string;
  delay: number;
}

function StatCounter({ icon, value, label, suffix, delay }: StatCounterProps) {
  const countRef = useRef(null);
  const isInView = useInView(countRef, { once: false });
  const hasAnimatedRef = useRef(false);

  const springValue = useSpring(0, {
    stiffness: 50,
    damping: 10,
  });

  useEffect(() => {
    if (isInView && !hasAnimatedRef.current) {
      springValue.set(value);
      hasAnimatedRef.current = true;
    } else if (!isInView && hasAnimatedRef.current) {
      springValue.set(0);
      hasAnimatedRef.current = false;
    }
  }, [isInView, value, springValue]);

  const displayValue = useTransform(springValue, (latest) => Math.floor(latest));

  return (
    <motion.div
      className="group flex flex-col items-center rounded-xl border border-border bg-card/50 p-6 text-center backdrop-blur-sm transition-colors duration-300 hover:bg-card"
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, delay },
        },
      }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <motion.div
        className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary/20"
        whileHover={{ rotate: 360, transition: { duration: 0.8 } }}
      >
        {icon}
      </motion.div>
      <motion.div ref={countRef} className="flex items-center text-3xl font-bold text-foreground">
        <motion.span>{displayValue}</motion.span>
        <span>{suffix}</span>
      </motion.div>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
      <motion.div className="mt-3 h-0.5 w-10 bg-primary transition-all duration-300 group-hover:w-16" />
    </motion.div>
  );
}

interface ContactCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
  delay: number;
}

function ContactCard({ icon, label, value, href, delay }: ContactCardProps) {
  const content = (
    <motion.div
      className="group"
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, delay },
        },
      }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <Card className="overflow-hidden border-border transition-all duration-300 hover:border-primary/50">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <motion.div
              className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary/20"
              whileHover={{ rotate: [0, -10, 10, -5, 0], transition: { duration: 0.5 } }}
            >
              {icon}
            </motion.div>
            <div className="flex-1">
              <p className="mb-1 text-sm text-muted-foreground">{label}</p>
              <p className="font-medium text-foreground transition-colors duration-300 group-hover:text-primary">
                {value}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="block">
        {content}
      </a>
    );
  }

  return content;
}

interface ModernAboutProps {
  data: PersonalData;
}

export default function ModernAbout({ data }: ModernAboutProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.1 });
  const isStatsInView = useInView(statsRef, { once: false, amount: 0.3 });

  const { scrollYProgress } = useScroll();

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 20]);
  const rotate2 = useTransform(scrollYProgress, [0, 1], [0, -20]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6 },
    },
  };

  const skills = data.skills.slice(0, 8).map((skill) => ({
    name: skill,
    icon: <Terminal className="h-4 w-4" />,
  }));

  const stats = [
    { icon: <Award />, value: 50, label: 'Projects Completed', suffix: '+' },
    { icon: <Briefcase />, value: 8, label: 'Years Experience', suffix: '' },
    { icon: <Calendar />, value: 100, label: 'Systems Deployed', suffix: '+' },
    { icon: <CheckCircle />, value: 99, label: 'Uptime Rate', suffix: '%' },
  ];

  const contacts = [
    {
      icon: <Mail className="h-5 w-5" />,
      label: 'Email',
      value: data.email || 'engineer@example.com',
      href: data.email ? `mailto:${data.email}` : undefined,
    },
    {
      icon: <Phone className="h-5 w-5" />,
      label: 'Phone',
      value: data.phone || '+1 (555) 123-4567',
      href: data.phone ? `tel:${data.phone}` : undefined,
    },
    {
      icon: <MapPin className="h-5 w-5" />,
      label: 'Location',
      value: data.location || 'San Francisco, CA',
    },
    {
      icon: <Github className="h-5 w-5" />,
      label: 'GitHub',
      value: 'github.com/engineer',
      href: data.github || 'https://github.com',
    },
    {
      icon: <Linkedin className="h-5 w-5" />,
      label: 'LinkedIn',
      value: 'linkedin.com/in/engineer',
      href: data.linkedin || 'https://linkedin.com',
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative min-h-screen w-full overflow-hidden bg-background px-4 py-24 text-foreground"
    >
      <BGPattern variant="grid" mask="fade-edges" size={32} />

      <motion.div
        className="absolute left-10 top-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl"
        style={{ y: y1, rotate: rotate1 }}
      />
      <motion.div
        className="absolute bottom-20 right-10 h-80 w-80 rounded-full bg-primary/5 blur-3xl"
        style={{ y: y2, rotate: rotate2 }}
      />

      <motion.div
        className="container relative z-10 mx-auto max-w-6xl"
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        variants={containerVariants}
      >
        <motion.div className="mb-16 flex flex-col items-center" variants={itemVariants}>
          <motion.span
            className="mb-2 flex items-center gap-2 font-medium text-primary"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Server className="h-4 w-4" />
            ABOUT ME
          </motion.span>
          <h2 className="mb-4 text-center text-4xl font-light md:text-5xl">{data.name}</h2>
          <motion.div
            className="h-1 w-24 bg-primary"
            initial={{ width: 0 }}
            animate={{ width: 96 }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </motion.div>

        <div className="mb-16 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <motion.div className="flex flex-col items-center lg:col-span-1" variants={itemVariants}>
            <motion.div
              className="relative mb-6"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-br from-blue-500/30 via-purple-500/20 to-pink-500/30 blur-3xl" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-400/20 to-blue-500/20 blur-2xl" />
              <div className="relative z-10">
                <div className="relative h-96 w-96">
                  {/* Outer glow ring */}
                  <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 opacity-20 blur-xl" />

                  {/* Main frame with gradient border */}
                  <div className="relative h-full w-full rounded-full bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 p-1 shadow-2xl">
                    <div className="h-full w-full rounded-full bg-white p-1 dark:bg-gray-900">
                      {/* Inner decorative ring */}
                      <div className="h-full w-full rounded-full bg-gradient-to-br from-cyan-300/50 via-blue-400/30 to-purple-500/50 p-0.5">
                        <div className="h-full w-full overflow-hidden rounded-full bg-gradient-to-br from-blue-50/80 to-purple-50/60 shadow-inner backdrop-blur-sm dark:from-gray-800/80 dark:to-gray-900/60">
                          {data.profilePicture ? (
                            <div className="group relative h-full w-full">
                              <Image
                                src={data.profilePicture}
                                alt={data.name}
                                width={384}
                                height={384}
                                className="group-hover:contrast-105 h-full w-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
                                onError={(e) => {
                                  // Handle error by hiding the image and showing fallback
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  const fallback = document.createElement('div');
                                  fallback.className =
                                    'w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center text-4xl font-bold text-white';
                                  fallback.textContent = data.name
                                    .split(' ')
                                    .map((n) => n[0])
                                    .join('');
                                  target.parentElement?.appendChild(fallback);
                                }}
                              />
                              <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                            </div>
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500/20 to-purple-500/20 text-4xl font-bold text-white">
                              {data.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <motion.div
                  className="absolute -bottom-2 -right-2 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 shadow-lg"
                  animate={{
                    y: [0, -10, 0],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <Network className="h-10 w-10 text-primary" />
                </motion.div>
              </div>
            </motion.div>

            <h3 className="mb-2 text-2xl font-semibold">{data.name}</h3>
            <p className="mb-4 text-muted-foreground">{data.title}</p>

            <div className="mb-6 flex gap-3">
              {data.github && (
                <motion.a
                  href={data.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Github className="h-5 w-5" />
                </motion.a>
              )}
              {data.linkedin && (
                <motion.a
                  href={data.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Linkedin className="h-5 w-5" />
                </motion.a>
              )}
            </div>
          </motion.div>

          <motion.div className="space-y-6 lg:col-span-2" variants={itemVariants}>
            <div>
              <h3 className="mb-4 text-2xl font-semibold">Professional Bio</h3>
              <p className="mb-4 leading-relaxed text-muted-foreground">
                {data.bio ||
                  'Experienced professional with expertise in modern technologies and innovative solutions.'}
              </p>
            </div>

            {data.company && (
              <div>
                <h3 className="mb-4 text-xl font-semibold">Company</h3>
                <Card className="border-border transition-all duration-300 hover:border-primary/50">
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-start gap-4">
                      <motion.div
                        className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary"
                        whileHover={{ rotate: [0, -10, 10, -5, 0], transition: { duration: 0.5 } }}
                      >
                        <Server className="h-6 w-6" />
                      </motion.div>
                      <div className="flex-1">
                        <h4 className="mb-1 text-lg font-semibold text-foreground">
                          {data.company.name}
                        </h4>
                        <p className="mb-2 text-sm font-medium text-primary">
                          {data.company.tagline}
                        </p>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {data.company.description}
                        </p>
                      </div>
                    </div>

                    <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <p className="mb-1 text-sm text-muted-foreground">Founded</p>
                        <p className="font-medium text-foreground">{data.company.founded}</p>
                      </div>
                      <div>
                        <p className="mb-1 text-sm text-muted-foreground">Location</p>
                        <p className="font-medium text-foreground">{data.company.location}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="mb-2 text-sm text-muted-foreground">Focus Areas</p>
                      <div className="flex flex-wrap gap-2">
                        {data.company.focus.map((focus, _index) => (
                          <Badge key={focus} variant="outline" className="text-xs">
                            {focus}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="mb-2 text-sm text-muted-foreground">Services</p>
                      <div className="flex flex-wrap gap-2">
                        {data.company.services.slice(0, 6).map((service, _index) => (
                          <Badge key={service} variant="secondary" className="text-xs">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <motion.a
                        href={data.company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Visit Website
                      </motion.a>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            <div>
              <h3 className="mb-4 text-xl font-semibold">Skills & Expertise</h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Badge
                      variant="secondary"
                      className="flex cursor-pointer items-center gap-2 px-4 py-2 text-sm transition-colors hover:bg-primary hover:text-primary-foreground"
                    >
                      {skill.icon}
                      {skill.name}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="mb-16"
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={containerVariants}
        >
          <h3 className="mb-6 text-center text-2xl font-semibold">Contact Information</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {contacts.map((contact, index) => (
              <ContactCard
                key={contact.label}
                icon={contact.icon}
                label={contact.label}
                value={contact.value}
                href={contact.href}
                delay={index * 0.1}
              />
            ))}
          </div>
        </motion.div>

        <motion.div
          ref={statsRef}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
          initial="hidden"
          animate={isStatsInView ? 'visible' : 'hidden'}
          variants={containerVariants}
        >
          {stats.map((stat, index) => (
            <StatCounter
              key={`${stat.label}-${stat.value}`}
              icon={stat.icon}
              value={stat.value}
              label={stat.label}
              suffix={stat.suffix}
              delay={index * 0.1}
            />
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
