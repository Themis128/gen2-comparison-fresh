import { Badge } from '@/components/badge';
import { Card, CardContent } from '@/components/card';
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
    Terminal
} from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useRef } from 'react';
import { PersonalData } from '../lib/personal-data';

type BGVariantType = 'dots' | 'diagonal-stripes' | 'grid' | 'horizontal-lines' | 'vertical-lines' | 'checkerboard';
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
      className="bg-card/50 backdrop-blur-sm p-6 rounded-xl flex flex-col items-center text-center group hover:bg-card transition-colors duration-300 border border-border"
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
        className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary group-hover:bg-primary/20 transition-colors duration-300"
        whileHover={{ rotate: 360, transition: { duration: 0.8 } }}
      >
        {icon}
      </motion.div>
      <motion.div ref={countRef} className="text-3xl font-bold text-foreground flex items-center">
        <motion.span>{displayValue}</motion.span>
        <span>{suffix}</span>
      </motion.div>
      <p className="text-muted-foreground text-sm mt-1">{label}</p>
      <motion.div className="w-10 h-0.5 bg-primary mt-3 group-hover:w-16 transition-all duration-300" />
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
      <Card className="overflow-hidden border-border hover:border-primary/50 transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <motion.div
              className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors duration-300"
              whileHover={{ rotate: [0, -10, 10, -5, 0], transition: { duration: 0.5 } }}
            >
              {icon}
            </motion.div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-1">{label}</p>
              <p className="text-foreground font-medium group-hover:text-primary transition-colors duration-300">
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
    icon: <Terminal className="w-4 h-4" />
  }));

  const stats = [
    { icon: <Award />, value: 50, label: 'Projects Completed', suffix: '+' },
    { icon: <Briefcase />, value: 8, label: 'Years Experience', suffix: '' },
    { icon: <Calendar />, value: 100, label: 'Systems Deployed', suffix: '+' },
    { icon: <CheckCircle />, value: 99, label: 'Uptime Rate', suffix: '%' },
  ];

  const contacts = [
    {
      icon: <Mail className="w-5 h-5" />,
      label: 'Email',
      value: data.email || 'engineer@example.com',
      href: data.email ? `mailto:${data.email}` : undefined,
    },
    {
      icon: <Phone className="w-5 h-5" />,
      label: 'Phone',
      value: data.phone || '+1 (555) 123-4567',
      href: data.phone ? `tel:${data.phone}` : undefined,
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      label: 'Location',
      value: data.location || 'San Francisco, CA',
    },
    {
      icon: <Github className="w-5 h-5" />,
      label: 'GitHub',
      value: 'github.com/engineer',
      href: data.github || 'https://github.com',
    },
    {
      icon: <Linkedin className="w-5 h-5" />,
      label: 'LinkedIn',
      value: 'linkedin.com/in/engineer',
      href: data.linkedin || 'https://linkedin.com',
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="about"
      className="w-full min-h-screen py-24 px-4 bg-background text-foreground overflow-hidden relative"
    >
      <BGPattern variant="grid" mask="fade-edges" size={32} />

      <motion.div
        className="absolute top-20 left-10 w-64 h-64 rounded-full bg-primary/5 blur-3xl"
        style={{ y: y1, rotate: rotate1 }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-primary/5 blur-3xl"
        style={{ y: y2, rotate: rotate2 }}
      />

      <motion.div
        className="container mx-auto max-w-6xl relative z-10"
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        variants={containerVariants}
      >
        <motion.div className="flex flex-col items-center mb-16" variants={itemVariants}>
          <motion.span
            className="text-primary font-medium mb-2 flex items-center gap-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Server className="w-4 h-4" />
            ABOUT ME
          </motion.span>
          <h2 className="text-4xl md:text-5xl font-light mb-4 text-center">{data.name}</h2>
          <motion.div
            className="w-24 h-1 bg-primary"
            initial={{ width: 0 }}
            animate={{ width: 96 }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <motion.div className="lg:col-span-1 flex flex-col items-center" variants={itemVariants}>
            <motion.div
              className="relative mb-6"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 via-purple-500/20 to-pink-500/30 rounded-full blur-3xl animate-pulse" />
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400/20 to-blue-500/20 rounded-full blur-2xl" />
              <div className="relative z-10">
                <div className="relative w-96 h-96">
                  {/* Outer glow ring */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 opacity-20 blur-xl animate-pulse" />

                  {/* Main frame with gradient border */}
                  <div className="relative w-full h-full rounded-full p-1 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 shadow-2xl">
                    <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 p-1">
                      {/* Inner decorative ring */}
                      <div className="w-full h-full rounded-full p-0.5 bg-gradient-to-br from-cyan-300/50 via-blue-400/30 to-purple-500/50">
                        <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-blue-50/80 dark:from-gray-800/80 to-purple-50/60 dark:to-gray-900/60 backdrop-blur-sm shadow-inner">
                          {data.profilePicture ? (
                            <div className="relative w-full h-full group">
                              <Image
                                src={data.profilePicture}
                                alt={data.name}
                                width={384}
                                height={384}
                                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110 group-hover:contrast-105"
                                onError={(e) => {
                                  // Handle error by hiding the image and showing fallback
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  const fallback = document.createElement('div');
                                  fallback.className = 'w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center text-4xl font-bold text-white';
                                  fallback.textContent = data.name.split(' ').map(n => n[0]).join('');
                                  target.parentElement?.appendChild(fallback);
                                }}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
                            </div>
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center text-4xl font-bold text-white">
                              {data.name.split(' ').map(n => n[0]).join('')}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <motion.div
                  className="absolute -bottom-2 -right-2 w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center shadow-lg"
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
                  <Network className="w-10 h-10 text-primary" />
                </motion.div>
              </div>
            </motion.div>

            <h3 className="text-2xl font-semibold mb-2">{data.name}</h3>
            <p className="text-muted-foreground mb-4">{data.title}</p>

            <div className="flex gap-3 mb-6">
              {data.github && (
                <motion.a
                  href={data.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Github className="w-5 h-5" />
                </motion.a>
              )}
              {data.linkedin && (
                <motion.a
                  href={data.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Linkedin className="w-5 h-5" />
                </motion.a>
              )}
            </div>
          </motion.div>

          <motion.div className="lg:col-span-2 space-y-6" variants={itemVariants}>
            <div>
              <h3 className="text-2xl font-semibold mb-4">Professional Bio</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {data.bio || 'Experienced professional with expertise in modern technologies and innovative solutions.'}
              </p>
            </div>

            {data.company && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Company</h3>
                <Card className="border-border hover:border-primary/50 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <motion.div
                        className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary"
                        whileHover={{ rotate: [0, -10, 10, -5, 0], transition: { duration: 0.5 } }}
                      >
                        <Server className="w-6 h-6" />
                      </motion.div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-foreground mb-1">{data.company.name}</h4>
                        <p className="text-primary font-medium text-sm mb-2">{data.company.tagline}</p>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {data.company.description}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Founded</p>
                        <p className="text-foreground font-medium">{data.company.founded}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Location</p>
                        <p className="text-foreground font-medium">{data.company.location}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground mb-2">Focus Areas</p>
                      <div className="flex flex-wrap gap-2">
                        {data.company.focus.map((focus, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {focus}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground mb-2">Services</p>
                      <div className="flex flex-wrap gap-2">
                        {data.company.services.slice(0, 6).map((service, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
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
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
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
              <h3 className="text-xl font-semibold mb-4">Skills & Expertise</h3>
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
                      className="px-4 py-2 text-sm hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer flex items-center gap-2"
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
          <h3 className="text-2xl font-semibold mb-6 text-center">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          initial="hidden"
          animate={isStatsInView ? 'visible' : 'hidden'}
          variants={containerVariants}
        >
          {stats.map((stat, index) => (
            <StatCounter
              key={index}
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
