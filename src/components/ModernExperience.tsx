"use client";
import { motion } from 'framer-motion';
import { Building, Calendar, Circle } from 'lucide-react';
import { PersonalData } from '../lib/personal-data';
import { Badge } from './badge';
import { Card, CardContent } from './card';

interface ExperienceProps {
  data: PersonalData;
}

const getStatusConfig = (status: string) => {
  const configs = {
    current: {
      progressColor: "bg-blue-600 dark:bg-blue-400",
      borderColor: "border-blue-600/20 dark:border-blue-400/20",
      badgeBg: "bg-blue-100 dark:bg-blue-900/30",
      badgeText: "text-blue-800 dark:text-blue-200"
    },
    past: {
      progressColor: "bg-green-600 dark:bg-green-400",
      borderColor: "border-green-600/20 dark:border-green-400/20",
      badgeBg: "bg-green-100 dark:bg-green-900/30",
      badgeText: "text-green-800 dark:text-green-200"
    }
  }
  return configs[status as keyof typeof configs] || configs.past;
}

export default function ModernExperience({ data }: ExperienceProps) {
  // Transform experience data to match the timeline format
  const timelineItems = data.experience.map((exp, index) => ({
    ...exp,
    status: index === 0 ? "current" : "past" as "current" | "past",
    category: exp.company,
    date: exp.period
  }));

  return (
    <section id="experience" className="relative py-32 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950" />
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse animation-delay-2000" />
      </div>

      <div className="relative z-10 container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Building className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Professional Journey</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Career
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Timeline
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              A journey through innovation, leadership, and technological excellence
            </p>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-400 to-purple-400"></div>

            <motion.div
              className="absolute left-8 top-0 w-0.5 bg-primary origin-top"
              initial={{ scaleY: 0 }}
              whileInView={{
                scaleY: 1,
                transition: {
                  duration: 1.2,
                  ease: "easeOut",
                  delay: 0.2
                }
              }}
              viewport={{ once: true }}
            />

            <div className="space-y-8 sm:space-y-12 relative">
              {timelineItems.map((item, index) => {
                const config = getStatusConfig(item.status);

                return (
                  <motion.div
                    key={item.id}
                    className="relative group"
                    initial={{ opacity: 0, y: 40, scale: 0.98 }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      transition: {
                        duration: 0.5,
                        delay: index * 0.1,
                        ease: [0.25, 0.46, 0.45, 0.94]
                      }
                    }}
                    viewport={{ once: true, margin: "-30px" }}
                  >
                    <div className="flex items-start gap-4 sm:gap-6">
                      {/* Timeline dot */}
                      <div className="relative flex-shrink-0">
                        <motion.div
                          className="relative"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-background shadow-lg relative z-10">
                            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                              {item.company.charAt(0)}
                            </div>
                          </div>
                        </motion.div>
                      </div>

                      <motion.div
                        className="flex-1 min-w-0"
                        whileHover={{ y: -2 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Card className={`border transition-all duration-300 hover:shadow-md relative bg-card/50 backdrop-blur-sm ${config.borderColor} group-hover:border-primary/30`}>
                          <CardContent className="p-4 sm:p-6">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4 mb-3">
                              <div className="flex-1 min-w-0">
                                <motion.h3
                                  className="text-lg sm:text-xl font-semibold text-foreground mb-1 group-hover:text-primary transition-colors duration-300"
                                  layoutId={`title-${index}`}
                                >
                                  {item.title}
                                </motion.h3>

                                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-2">
                                  <Building className="h-4 w-4" />
                                  <span className="font-medium">{item.company}</span>
                                </div>

                                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                                  <Calendar className="h-4 w-4" />
                                  <time>{item.period}</time>
                                </div>
                              </div>

                              <Badge
                                className={`w-fit text-xs font-medium border ${config.badgeBg} ${config.badgeText} border-current/20`}
                              >
                                {item.status === "current" ? "Current Position" : "Past Experience"}
                              </Badge>
                            </div>

                            <motion.p
                              className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4"
                              initial={{ opacity: 0.8 }}
                              whileHover={{ opacity: 1 }}
                            >
                              {item.description}
                            </motion.p>

                            {/* Progress bar */}
                            <div
                              className="h-1 bg-muted rounded-full overflow-hidden"
                              role="progressbar"
                              aria-valuenow={item.status === "current" ? 75 : 100}
                              aria-valuemin={0}
                              aria-valuemax={100}
                              aria-label={`Experience progress for ${item.title}`}
                            >
                              <motion.div
                                className={`h-full rounded-full ${config.progressColor}`}
                                initial={{ width: 0 }}
                                animate={{
                                  width: item.status === "current" ? "75%" : "100%"
                                }}
                                transition={{
                                  duration: 1.2,
                                  delay: index * 0.2 + 0.8,
                                  ease: "easeOut"
                                }}
                              />
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Timeline end marker */}
            <motion.div
              className="absolute left-8 -bottom-6 transform -translate-x-1/2"
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{
                opacity: 1,
                scale: 1,
                transition: {
                  duration: 0.4,
                  delay: timelineItems.length * 0.1 + 0.3,
                  type: "spring",
                  stiffness: 400
                }
              }}
              viewport={{ once: true }}
            >
              <div className="w-3 h-3 bg-primary rounded-full shadow-sm" />
            </motion.div>
          </div>

          {/* Call to action */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center space-x-3 bg-background/60 backdrop-blur-sm rounded-full px-8 py-4 border border-border/50 shadow-lg">
              <span className="text-muted-foreground font-medium">Always evolving and embracing new challenges</span>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Circle className="w-6 h-6 text-primary" />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}