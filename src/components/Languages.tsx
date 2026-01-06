'use client';
import { motion } from 'framer-motion';
import { CheckCircle, Globe, Languages as LanguagesIcon, MessageCircle, Star } from 'lucide-react';

import type { PersonalData } from '../lib/personal-data';

interface LanguagesProps {
  data: PersonalData;
}

export default function Languages({ data }: LanguagesProps) {
  if (!data.languages || data.languages.length === 0) {
    return null;
  }

  // Animation variants
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

  // Get language icon based on language
  const getLanguageIcon = (name: string) => {
    const icons: Record<string, React.ReactElement> = {
      Greek: <Globe className="h-6 w-6 text-blue-600" />,
      English: <MessageCircle className="h-6 w-6 text-green-600" />,
    };
    return icons[name] || <LanguagesIcon className="h-6 w-6 text-purple-600" />;
  };

  // Get proficiency colors and styles
  const getProficiencyStyles = (proficiency: string) => {
    switch (proficiency) {
      case 'Native':
        return {
          bg: 'from-emerald-500/10 to-green-500/10',
          border: 'border-emerald-500/20',
          text: 'text-emerald-700 dark:text-emerald-400',
          badge: 'bg-emerald-500',
          progress: 'from-emerald-500 to-green-500',
          width: 'w-full',
        };
      case 'Fluent':
        return {
          bg: 'from-blue-500/10 to-cyan-500/10',
          border: 'border-blue-500/20',
          text: 'text-blue-700 dark:text-blue-400',
          badge: 'bg-blue-500',
          progress: 'from-blue-500 to-cyan-500',
          width: 'w-5/6',
        };
      case 'Intermediate':
        return {
          bg: 'from-yellow-500/10 to-orange-500/10',
          border: 'border-yellow-500/20',
          text: 'text-yellow-700 dark:text-yellow-400',
          badge: 'bg-yellow-500',
          progress: 'from-yellow-500 to-orange-500',
          width: 'w-3/5',
        };
      case 'Beginner':
        return {
          bg: 'from-orange-500/10 to-red-500/10',
          border: 'border-orange-500/20',
          text: 'text-orange-700 dark:text-orange-400',
          badge: 'bg-orange-500',
          progress: 'from-orange-500 to-red-500',
          width: 'w-2/5',
        };
      default:
        return {
          bg: 'from-gray-500/10 to-slate-500/10',
          border: 'border-gray-500/20',
          text: 'text-gray-700 dark:text-gray-400',
          badge: 'bg-gray-500',
          progress: 'from-gray-500 to-slate-500',
          width: 'w-1/2',
        };
    }
  };

  // Get proficiency level number for calculations
  const getProficiencyLevel = (proficiency: string) => {
    switch (proficiency) {
      case 'Native':
        return 100;
      case 'Fluent':
        return 85;
      case 'Intermediate':
        return 60;
      case 'Beginner':
        return 35;
      default:
        return 50;
    }
  };

  return (
    <section id="languages" className="relative overflow-hidden py-24">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20" />
      <div className="absolute inset-0">
        <div className="absolute right-32 top-20 h-64 w-64 animate-pulse rounded-full bg-gradient-to-br from-blue-400/20 to-cyan-400/20 blur-3xl" />
        <div className="animation-delay-2000 absolute bottom-20 left-32 h-48 w-48 animate-pulse rounded-full bg-gradient-to-br from-green-400/20 to-emerald-400/20 blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-6">
        {/* Header */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <LanguagesIcon className="h-4 w-4" />
            Language Proficiency
          </div>
          <h2 className="mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
            Multilingual
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
              Communication
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Strong communication skills across multiple languages, enabling effective global
            collaboration and professional interactions
          </p>
        </motion.div>

        {/* Languages Grid */}
        <motion.div
          className="mx-auto mb-16 grid max-w-4xl gap-6 md:grid-cols-2"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {data.languages.map((language, index) => {
            const styles = getProficiencyStyles(language.proficiency);
            const level = getProficiencyLevel(language.proficiency);

            return (
              <motion.div
                key={language.id}
                variants={itemVariants}
                transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                className={`group relative bg-gradient-to-br ${styles.bg} border ${styles.border} overflow-hidden rounded-2xl p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/5`}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute right-4 top-4 h-16 w-16 rounded-full bg-primary/10" />
                  <div className="absolute bottom-4 left-4 h-12 w-12 rounded-full bg-primary/10" />
                </div>

                <div className="relative z-10">
                  {/* Header */}
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {getLanguageIcon(language.name)}
                      <div>
                        <h3
                          className={`text-xl font-bold ${styles.text} transition-transform duration-300 group-hover:scale-105`}
                        >
                          {language.name}
                        </h3>
                        <div className="mt-1 flex items-center gap-2">
                          <div className={`h-2 w-2 rounded-full ${styles.badge}`} />
                          <span className="text-sm font-medium text-muted-foreground">
                            {language.proficiency}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Proficiency Badge */}
                    <div
                      className={`rounded-full px-3 py-1 text-xs font-bold text-white ${styles.badge} flex items-center gap-1`}
                    >
                      <Star className="h-3 w-3" />
                      {level}%
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Proficiency Level</span>
                      <span className="font-mono text-sm text-muted-foreground">{level}%</span>
                    </div>
                    <div className="relative h-3 overflow-hidden rounded-full bg-muted">
                      <motion.div
                        className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${styles.progress}`}
                        initial={{ width: 0 }}
                        whileInView={{ width: styles.width }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, delay: 0.5 + index * 0.2, ease: 'easeOut' }}
                      />
                      {/* Animated shine effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        initial={{ x: '-100%' }}
                        whileInView={{ x: '100%' }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, delay: 1 + index * 0.2, ease: 'easeOut' }}
                      />
                    </div>
                  </div>

                  {/* Status Indicator */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-xs text-muted-foreground">
                        {language.proficiency === 'Native' ? 'Mother Tongue' : 'Professional Level'}
                      </span>
                    </div>
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
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="inline-flex items-center gap-4 rounded-2xl border border-border bg-card px-8 py-6 shadow-lg">
            <div className="text-center">
              <div className="mb-1 text-3xl font-bold text-primary">{data.languages.length}</div>
              <div className="text-sm text-muted-foreground">Languages</div>
            </div>
            <div className="h-12 w-px bg-border" />
            <div className="text-center">
              <div className="mb-1 text-3xl font-bold text-green-500">
                {data.languages.filter((lang) => lang.proficiency === 'Native').length}
              </div>
              <div className="text-sm text-muted-foreground">Native</div>
            </div>
            <div className="h-12 w-px bg-border" />
            <div className="text-center">
              <div className="mb-1 text-3xl font-bold text-blue-500">
                {Math.round(
                  data.languages.reduce(
                    (acc, lang) => acc + getProficiencyLevel(lang.proficiency),
                    0
                  ) / data.languages.length
                )}
              </div>
              <div className="text-sm text-muted-foreground">Avg Proficiency</div>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <p className="mb-4 text-muted-foreground">
            Effective communication across cultures and professional environments
          </p>
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-6 py-3 text-sm font-medium text-primary">
            <Globe className="h-4 w-4" />
            Global communication expertise
          </div>
        </motion.div>
      </div>
    </section>
  );
}
