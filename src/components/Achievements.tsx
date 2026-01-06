'use client';
import { motion } from 'framer-motion';
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle,
  Github,
  Mic,
  Star,
  Target,
  TrendingUp,
  Trophy,
} from 'lucide-react';

import type { PersonalData } from '../lib/personal-data';

interface AchievementsProps {
  data: PersonalData;
}

export default function Achievements({ data }: AchievementsProps) {
  if (!data.achievements || data.achievements.length === 0) {
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

  // Get achievement icon based on type
  const getAchievementIcon = (type: string) => {
    const icons: Record<string, React.ReactElement> = {
      Award: <Trophy className="h-6 w-6 text-yellow-600" />,
      Publication: <BookOpen className="h-6 w-6 text-blue-600" />,
      Speaking: <Mic className="h-6 w-6 text-green-600" />,
      'Open Source': <Github className="h-6 w-6 text-purple-600" />,
    };
    return icons[type] || <Award className="h-6 w-6 text-gray-600" />;
  };

  // Get achievement colors and styles
  const getAchievementStyles = (type: string) => {
    switch (type) {
      case 'Award':
        return {
          bg: 'from-yellow-500/10 to-orange-500/10',
          border: 'border-yellow-500/20',
          text: 'text-yellow-700 dark:text-yellow-400',
          badge: 'bg-yellow-500',
          accent: 'from-yellow-500 to-orange-500',
        };
      case 'Publication':
        return {
          bg: 'from-blue-500/10 to-cyan-500/10',
          border: 'border-blue-500/20',
          text: 'text-blue-700 dark:text-blue-400',
          badge: 'bg-blue-500',
          accent: 'from-blue-500 to-cyan-500',
        };
      case 'Speaking':
        return {
          bg: 'from-green-500/10 to-emerald-500/10',
          border: 'border-green-500/20',
          text: 'text-green-700 dark:text-green-400',
          badge: 'bg-green-500',
          accent: 'from-green-500 to-emerald-500',
        };
      case 'Open Source':
        return {
          bg: 'from-purple-500/10 to-pink-500/10',
          border: 'border-purple-500/20',
          text: 'text-purple-700 dark:text-purple-400',
          badge: 'bg-purple-500',
          accent: 'from-purple-500 to-pink-500',
        };
      default:
        return {
          bg: 'from-gray-500/10 to-slate-500/10',
          border: 'border-gray-500/20',
          text: 'text-gray-700 dark:text-gray-400',
          badge: 'bg-gray-500',
          accent: 'from-gray-500 to-slate-500',
        };
    }
  };

  // Check if achievement is recent (within last 3 years)
  const isRecentAchievement = (date: string) => {
    const currentYear = new Date().getFullYear();
    const achievementYear = parseInt(date);
    return currentYear - achievementYear <= 3;
  };

  // Get achievement impact level (based on description keywords)
  const getAchievementImpact = (description: string) => {
    const highImpactKeywords = ['90%', '100%', '30%', '20%', '15%'];
    const mediumImpactKeywords = ['improvement', 'enhancement', 'reduction', 'efficiency'];

    if (highImpactKeywords.some((keyword) => description.includes(keyword))) {
      return 'High Impact';
    } else if (mediumImpactKeywords.some((keyword) => description.includes(keyword))) {
      return 'Significant Impact';
    }
    return 'Notable Achievement';
  };

  return (
    <section id="achievements" className="relative overflow-hidden py-24">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20" />
      <div className="absolute inset-0">
        <div className="absolute right-32 top-20 h-64 w-64 animate-pulse rounded-full bg-gradient-to-br from-yellow-400/20 to-orange-400/20 blur-3xl" />
        <div className="animation-delay-2000 absolute bottom-20 left-32 h-48 w-48 animate-pulse rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 blur-3xl" />
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
            <Trophy className="h-4 w-4" />
            Achievements & Recognition
          </div>
          <h2 className="mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
            Professional
            <span className="block bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
              Excellence
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Awards, certifications, and significant contributions that demonstrate commitment to
            excellence and continuous professional development
          </p>
        </motion.div>

        {/* Achievements Grid */}
        <motion.div
          className="mx-auto mb-16 grid max-w-7xl gap-6 md:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {data.achievements.map((achievement) => {
            const styles = getAchievementStyles(achievement.type);
            const isRecent = isRecentAchievement(achievement.date);
            const impact = getAchievementImpact(achievement.description);

            return (
              <motion.div
                key={achievement.id}
                variants={itemVariants}
                transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                className={`group relative bg-gradient-to-br ${styles.bg} border ${styles.border} overflow-hidden rounded-2xl p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/5`}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute right-4 top-4 h-16 w-16 rounded-full bg-primary/10" />
                  <div className="absolute bottom-4 left-4 h-12 w-12 rounded-full bg-primary/10" />
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
                      {getAchievementIcon(achievement.type)}
                      <div className="flex-1">
                        <h3
                          className={`text-lg font-bold ${styles.text} line-clamp-2 transition-transform duration-300 group-hover:scale-105`}
                        >
                          {achievement.title}
                        </h3>
                        <div className="mt-1 flex items-center gap-2">
                          <div className={`h-2 w-2 rounded-full ${styles.badge}`} />
                          <span className="text-sm font-medium text-muted-foreground">
                            {achievement.type}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                    {achievement.description}
                  </p>

                  {/* Impact Badge */}
                  <div className="mb-4">
                    <div
                      className={`inline-flex items-center gap-1 rounded-full bg-gradient-to-r px-3 py-1 text-xs font-medium ${styles.accent} text-white`}
                    >
                      <Target className="h-3 w-3" />
                      {impact}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs font-medium text-muted-foreground">
                        {achievement.date}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-xs text-muted-foreground">
                        {isRecent ? 'Current' : 'Achieved'}
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
              <div className="mb-1 text-3xl font-bold text-primary">{data.achievements.length}</div>
              <div className="text-sm text-muted-foreground">Total Achievements</div>
            </div>
            <div className="h-12 w-px bg-border" />
            <div className="text-center">
              <div className="mb-1 text-3xl font-bold text-green-500">
                {
                  data.achievements.filter((achievement) => isRecentAchievement(achievement.date))
                    .length
                }
              </div>
              <div className="text-sm text-muted-foreground">Recent (2022+)</div>
            </div>
            <div className="h-12 w-px bg-border" />
            <div className="text-center">
              <div className="mb-1 text-3xl font-bold text-yellow-500">
                {new Set(data.achievements.map((achievement) => achievement.type)).size}
              </div>
              <div className="text-sm text-muted-foreground">Categories</div>
            </div>
            <div className="h-12 w-px bg-border" />
            <div className="text-center">
              <div className="mb-1 text-3xl font-bold text-blue-500">
                {Math.max(...data.achievements.map((a) => parseInt(a.date))) -
                  Math.min(...data.achievements.map((a) => parseInt(a.date)))}
              </div>
              <div className="text-sm text-muted-foreground">Year Span</div>
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
            Driven by excellence and continuous improvement in professional endeavors
          </p>
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-6 py-3 text-sm font-medium text-primary">
            <TrendingUp className="h-4 w-4" />
            Building a legacy of achievement and innovation
          </div>
        </motion.div>
      </div>
    </section>
  );
}
