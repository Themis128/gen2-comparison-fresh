'use client';
import { motion } from 'framer-motion';
import {
  Award,
  Star,
  Trophy,
  Shield,
  Calendar,
  CheckCircle,
  ExternalLink,
  Clock,
} from 'lucide-react';

import type { PersonalData } from '../lib/personal-data';

interface CertificationsProps {
  data: PersonalData;
}

export default function Certifications({ data }: CertificationsProps) {
  const certifications = data.certifications || [];
  if (!certifications || certifications.length === 0) {
    return null;
  }

  // Get certification icon based on issuer
  const getCertificationIcon = (issuer: string) => {
    const icons: Record<string, React.ReactElement> = {
      'Amazon Web Services': <Shield className="h-6 w-6 text-orange-500" />,
      Cisco: <Shield className="h-6 w-6 text-blue-600" />,
      Microsoft: <Shield className="h-6 w-6 text-blue-700" />,
    };
    return icons[issuer] || <Award className="h-6 w-6 text-primary" />;
  };

  // Get certification color scheme based on issuer
  const getCertificationColors = (issuer: string) => {
    const colors: Record<string, { bg: string; border: string; text: string }> = {
      'Amazon Web Services': {
        bg: 'from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20',
        border: 'border-orange-200 dark:border-orange-800',
        text: 'text-orange-700 dark:text-orange-300',
      },
      Cisco: {
        bg: 'from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20',
        border: 'border-blue-200 dark:border-blue-800',
        text: 'text-blue-700 dark:text-blue-300',
      },
      Microsoft: {
        bg: 'from-blue-50 to-indigo-100 dark:from-blue-950/20 dark:to-indigo-900/20',
        border: 'border-blue-200 dark:border-blue-800',
        text: 'text-blue-700 dark:text-blue-300',
      },
    };
    return (
      colors[issuer] || {
        bg: 'from-primary/5 to-primary/10',
        border: 'border-primary/20',
        text: 'text-primary',
      }
    );
  };

  // Check if certification is recent (within last 2 years)
  const isRecentCertification = (date: string) => {
    const certYear = parseInt(date);
    const currentYear = new Date().getFullYear();
    return currentYear - certYear <= 2;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section
      id="certifications"
      className="bg-gradient-to-br from-background via-background to-muted/20 py-24"
    >
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <Trophy className="h-4 w-4" />
            Professional Credentials
          </div>
          <h2 className="mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
            Certifications & Credentials
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Industry-recognized certifications demonstrating expertise in cloud technologies,
            networking, and enterprise solutions
          </p>
        </motion.div>

        {/* Certifications Grid */}
        <motion.div
          className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {certifications?.map((cert) => {
            const colors = getCertificationColors(cert.issuer);
            const isRecent = isRecentCertification(cert.date);

            return (
              <motion.div
                key={cert.id}
                variants={itemVariants}
                transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                className={`group relative bg-gradient-to-br ${colors.bg} border ${colors.border} overflow-hidden rounded-2xl p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/5`}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute right-4 top-4 h-20 w-20 rounded-full bg-primary/10" />
                  <div className="absolute bottom-4 left-4 h-16 w-16 rounded-full bg-primary/10" />
                </div>

                {/* Recent Badge */}
                {isRecent && (
                  <div className="absolute right-4 top-4 z-10">
                    <div className="flex items-center gap-1 rounded-full bg-green-500 px-2 py-1 text-xs font-medium text-white">
                      <Star className="h-3 w-3" />
                      Recent
                    </div>
                  </div>
                )}

                <div className="relative z-10">
                  {/* Header */}
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {getCertificationIcon(cert.issuer)}
                      <div>
                        <h3
                          className={`text-lg font-bold ${colors.text} transition-transform duration-300 group-hover:scale-105`}
                        >
                          {cert.name}
                        </h3>
                        <p className="text-sm font-medium text-muted-foreground">{cert.issuer}</p>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="mb-4 space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Issued {cert.date}</span>
                    </div>

                    {cert.credentialId && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4" />
                        <span className="rounded bg-muted px-2 py-1 font-mono text-xs">
                          {cert.credentialId}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Status Indicator */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-2 w-2 rounded-full ${isRecent ? 'bg-green-500' : 'bg-yellow-500'}`}
                      />
                      <span className="text-xs text-muted-foreground">
                        {isRecent ? 'Active' : 'Valid'}
                      </span>
                    </div>

                    {cert.url && (
                      <motion.a
                        href={cert.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/link flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        View
                        <ExternalLink className="h-3 w-3 transition-transform group-hover/link:translate-x-0.5" />
                      </motion.a>
                    )}
                  </div>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 via-transparent to-primary/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Summary Stats */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="inline-flex items-center gap-4 rounded-2xl border border-border bg-card px-8 py-6 shadow-lg">
            <div className="text-center">
              <div className="mb-1 text-3xl font-bold text-primary">
                {certifications.length}
              </div>
              <div className="text-sm text-muted-foreground">Total Certifications</div>
            </div>
            <div className="h-12 w-px bg-border" />
            <div className="text-center">
              <div className="mb-1 text-3xl font-bold text-green-500">
                {certifications.filter((cert) => isRecentCertification(cert.date)).length}
              </div>
              <div className="text-sm text-muted-foreground">Recently Earned</div>
            </div>
            <div className="h-12 w-px bg-border" />
            <div className="text-center">
              <div className="mb-1 text-3xl font-bold text-blue-500">
                {new Set(certifications?.map((cert) => cert.issuer)).size}
              </div>
              <div className="text-sm text-muted-foreground">Issuing Organizations</div>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <p className="mb-4 text-muted-foreground">
            Committed to continuous learning and professional development
          </p>
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-6 py-3 text-sm font-medium text-primary">
            <Clock className="h-4 w-4" />
            Always expanding expertise in emerging technologies
          </div>
        </motion.div>
      </div>
    </section>
  );
}
