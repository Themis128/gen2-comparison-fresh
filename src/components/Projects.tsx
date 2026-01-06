'use client';
import Image from 'next/image';

import { motion } from 'framer-motion';
import { Briefcase, Code, Cpu, ExternalLink, Eye, FolderOpen, Github, Star } from 'lucide-react';

import IconImage from './IconImage';

import type { PersonalData } from '../lib/personal-data';

interface ProjectsProps {
  data: PersonalData;
}

export default function Projects({ data }: ProjectsProps) {
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

  // Get project icon based on category
  const getProjectIcon = (category: string) => {
    const icons: Record<string, React.ReactElement> = {
      Personal: <Star className="h-6 w-6 text-yellow-600" />,
      Professional: <Briefcase className="h-6 w-6 text-blue-600" />,
      'Side Project': <Code className="h-6 w-6 text-green-600" />,
      Infrastructure: <Cpu className="h-6 w-6 text-purple-600" />,
    };
    return icons[category] || <FolderOpen className="h-6 w-6 text-gray-600" />;
  };

  // Get project colors and styles
  const getProjectStyles = (category: string) => {
    switch (category) {
      case 'Personal':
        return {
          bg: 'from-yellow-500/10 to-orange-500/10',
          border: 'border-yellow-500/20',
          text: 'text-yellow-700 dark:text-yellow-400',
          badge: 'bg-yellow-500',
          accent: 'from-yellow-500 to-orange-500',
        };
      case 'Professional':
        return {
          bg: 'from-blue-500/10 to-cyan-500/10',
          border: 'border-blue-500/20',
          text: 'text-blue-700 dark:text-blue-400',
          badge: 'bg-blue-500',
          accent: 'from-blue-500 to-cyan-500',
        };
      case 'Side Project':
        return {
          bg: 'from-green-500/10 to-emerald-500/10',
          border: 'border-green-500/20',
          text: 'text-green-700 dark:text-green-400',
          badge: 'bg-green-500',
          accent: 'from-green-500 to-emerald-500',
        };
      case 'Infrastructure':
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

  // Get project complexity level based on technologies
  const getProjectComplexity = (technologies: string[]) => {
    if (technologies.length >= 6) return 'Advanced';
    if (technologies.length >= 4) return 'Intermediate';
    return 'Simple';
  };

  // Filter featured projects
  const featuredProjects = data.projects.filter((project) => project.featured);

  return (
    <section id="projects" className="relative overflow-hidden py-24">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20" />
      <div className="absolute inset-0">
        <div className="absolute right-32 top-20 h-64 w-64 animate-pulse rounded-full bg-gradient-to-br from-blue-400/20 to-cyan-400/20 blur-3xl" />
        <div className="animation-delay-2000 absolute bottom-20 left-32 h-48 w-48 animate-pulse rounded-full bg-gradient-to-br from-purple-400/20 to-pink-400/20 blur-3xl" />
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
            <Code className="h-4 w-4" />
            Featured Projects
          </div>
          <h2 className="mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
            Innovative
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Solutions
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Showcasing cutting-edge projects that demonstrate technical expertise and
            problem-solving capabilities
          </p>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          className="mx-auto mb-16 grid max-w-7xl gap-6 md:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {featuredProjects.map((project) => {
            const styles = getProjectStyles(project.category || 'Personal');
            const complexity = getProjectComplexity(project.technologies);

            return (
              <motion.div
                key={project.id}
                variants={itemVariants}
                transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                className={`group relative bg-gradient-to-br ${styles.bg} border ${styles.border} overflow-hidden rounded-2xl p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/5`}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute right-4 top-4 h-16 w-16 rounded-full bg-primary/10" />
                  <div className="absolute bottom-4 left-4 h-12 w-12 rounded-full bg-primary/10" />
                </div>
                {/* Featured Badge */}
                {project.featured && (
                  <div className="absolute right-4 top-4 z-10">
                    <div className="flex items-center gap-1 rounded-full bg-green-500 px-2 py-1 text-xs font-medium text-white">
                      <Star className="h-3 w-3" />
                      Featured
                    </div>
                  </div>
                )}
                <div className="relative z-10">
                  {/* Project Image */}
                  <div className="relative mb-6 h-48 overflow-hidden rounded-xl bg-gradient-to-br from-muted to-muted/50">
                    {project.image ? (
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                        <div className="text-6xl font-bold text-primary/50">
                          {project.title.charAt(0)}
                        </div>
                      </div>
                    )}

                    {/* Overlay on hover */}
                    <div className="absolute inset-0 flex items-center justify-center gap-4 bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      {project.url && (
                        <motion.a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-full bg-white/20 p-3 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Eye className="h-5 w-5" />
                        </motion.a>
                      )}
                      {project.github && (
                        <motion.a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-full bg-white/20 p-3 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Github className="h-5 w-5" />
                        </motion.a>
                      )}
                    </div>
                  </div>

                  {/* Header */}
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {getProjectIcon(project.category || 'Personal')}
                      <div className="flex-1">
                        <h3
                          className={`text-xl font-bold ${styles.text} line-clamp-2 transition-transform duration-300 group-hover:scale-105`}
                        >
                          {project.title}
                        </h3>
                        <div className="mt-1 flex items-center gap-2">
                          <div className={`h-2 w-2 rounded-full ${styles.badge}`} />
                          <span className="text-sm font-medium text-muted-foreground">
                            {project.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {project.description}
                  </p>

                  {/* Complexity Badge */}
                  <div className="mb-4">
                    <div
                      className={`inline-flex items-center gap-1 rounded-full bg-gradient-to-r px-3 py-1 text-xs font-medium ${styles.accent} text-white`}
                    >
                      <Code className="h-3 w-3" />
                      {complexity}
                    </div>
                  </div>

                  {/* Technologies */}
                  <div className="mb-4 flex flex-wrap gap-2">
                    {project.technologies.slice(0, 4).map((tech) => {
                      const slug = tech.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                      return (
                        <span
                          key={tech}
                          className="inline-flex items-center gap-1 rounded-full border border-border/50 bg-background/60 px-2 py-1 text-xs font-medium backdrop-blur-sm"
                        >
                          <IconImage slug={slug} alt={`${tech} logo`} className="h-3 w-3" />
                          {tech}
                        </span>
                      );
                    })}
                    {project.technologies.length > 4 && (
                      <span className="rounded-full bg-muted px-2 py-1 text-xs font-medium">
                        +{project.technologies.length - 4}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {project.url && (
                      <motion.a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <ExternalLink className="h-4 w-4" />
                        View Live
                      </motion.a>
                    )}
                    {project.github && (
                      <motion.a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-muted px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/80"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Github className="h-4 w-4" />
                        Code
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
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="inline-flex items-center gap-4 rounded-2xl border border-border bg-card px-8 py-6 shadow-lg">
            <div className="text-center">
              <div className="mb-1 text-3xl font-bold text-primary">{featuredProjects.length}</div>
              <div className="text-sm text-muted-foreground">Featured Projects</div>
            </div>
            <div className="h-12 w-px bg-border" />
            <div className="text-center">
              <div className="mb-1 text-3xl font-bold text-green-500">
                {new Set(featuredProjects.map((project) => project.category)).size}
              </div>
              <div className="text-sm text-muted-foreground">Categories</div>
            </div>
            <div className="h-12 w-px bg-border" />
            <div className="text-center">
              <div className="mb-1 text-3xl font-bold text-blue-500">
                {featuredProjects.reduce((acc, project) => acc + project.technologies.length, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Technologies</div>
            </div>
            <div className="h-12 w-px bg-border" />
            <div className="text-center">
              <div className="mb-1 text-3xl font-bold text-purple-500">
                {featuredProjects.filter((project) => project.url).length}
              </div>
              <div className="text-sm text-muted-foreground">Live Demos</div>
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
            Explore more projects and technical implementations
          </p>
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-6 py-3 text-sm font-medium text-primary">
            <Github className="h-4 w-4" />
            View complete portfolio on GitHub
          </div>
        </motion.div>
      </div>
    </section>
  );
}
