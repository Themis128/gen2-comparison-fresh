"use client";
import { motion } from 'framer-motion';
import { Briefcase, Code, Cpu, ExternalLink, Eye, FolderOpen, Github, Star } from 'lucide-react';
import Image from 'next/image';
import { PersonalData } from '../lib/personal-data';
import IconImage from './IconImage';

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
      'Personal': <Star className="w-6 h-6 text-yellow-600" />,
      'Professional': <Briefcase className="w-6 h-6 text-blue-600" />,
      'Side Project': <Code className="w-6 h-6 text-green-600" />,
      'Infrastructure': <Cpu className="w-6 h-6 text-purple-600" />,
    };
    return icons[category] || <FolderOpen className="w-6 h-6 text-gray-600" />;
  };

  // Get project colors and styles
  const getProjectStyles = (category: string) => {
    switch (category) {
      case "Personal":
        return {
          bg: "from-yellow-500/10 to-orange-500/10",
          border: "border-yellow-500/20",
          text: "text-yellow-700 dark:text-yellow-400",
          badge: "bg-yellow-500",
          accent: "from-yellow-500 to-orange-500"
        };
      case "Professional":
        return {
          bg: "from-blue-500/10 to-cyan-500/10",
          border: "border-blue-500/20",
          text: "text-blue-700 dark:text-blue-400",
          badge: "bg-blue-500",
          accent: "from-blue-500 to-cyan-500"
        };
      case "Side Project":
        return {
          bg: "from-green-500/10 to-emerald-500/10",
          border: "border-green-500/20",
          text: "text-green-700 dark:text-green-400",
          badge: "bg-green-500",
          accent: "from-green-500 to-emerald-500"
        };
      case "Infrastructure":
        return {
          bg: "from-purple-500/10 to-pink-500/10",
          border: "border-purple-500/20",
          text: "text-purple-700 dark:text-purple-400",
          badge: "bg-purple-500",
          accent: "from-purple-500 to-pink-500"
        };
      default:
        return {
          bg: "from-gray-500/10 to-slate-500/10",
          border: "border-gray-500/20",
          text: "text-gray-700 dark:text-gray-400",
          badge: "bg-gray-500",
          accent: "from-gray-500 to-slate-500"
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
  const featuredProjects = data.projects.filter(project => project.featured);

  return (
    <section id="projects" className="relative py-24 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20" />
      <div className="absolute inset-0">
        <div className="absolute top-20 right-32 w-64 h-64 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-32 w-48 h-48 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse animation-delay-2000" />
      </div>

      <div className="relative z-10 container mx-auto px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Code className="w-4 h-4" />
            Featured Projects
          </div>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-6">
            Innovative
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Solutions
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Showcasing cutting-edge projects that demonstrate technical expertise and problem-solving capabilities
          </p>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto mb-16"
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
                className={`group relative bg-gradient-to-br ${styles.bg} border ${styles.border} rounded-2xl p-6 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 hover:-translate-y-1 overflow-hidden`}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-primary/10" />
                  <div className="absolute bottom-4 left-4 w-12 h-12 rounded-full bg-primary/10" />
                </div>

                {/* Featured Badge */}
                {project.featured && (
                  <div className="absolute top-4 right-4 z-10">
                    <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      Featured
                    </div>
                  </div>
                )}

                <div className="relative z-10">
                  {/* Project Image */}
                  <div className="relative h-48 mb-6 rounded-xl overflow-hidden bg-gradient-to-br from-muted to-muted/50">
                    {project.image ? (
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                        <div className="text-6xl font-bold text-primary/50">
                          {project.title.charAt(0)}
                        </div>
                      </div>
                    )}

                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                      {project.url && (
                        <motion.a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Eye className="w-5 h-5" />
                        </motion.a>
                      )}
                      {project.github && (
                        <motion.a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Github className="w-5 h-5" />
                        </motion.a>
                      )}
                    </div>
                  </div>

                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {getProjectIcon(project.category || 'Personal')}
                      <div className="flex-1">
                        <h3 className={`text-xl font-bold ${styles.text} group-hover:scale-105 transition-transform duration-300 line-clamp-2`}>
                          {project.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <div className={`w-2 h-2 rounded-full ${styles.badge}`} />
                          <span className="text-sm text-muted-foreground font-medium">
                            {project.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed line-clamp-3">
                    {project.description}
                  </p>

                  {/* Complexity Badge */}
                  <div className="mb-4">
                    <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${styles.accent} text-white`}>
                      <Code className="w-3 h-3" />
                      {complexity}
                    </div>
                  </div>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.slice(0, 4).map((tech) => {
                      const slug = tech.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                      return (
                        <span
                          key={tech}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-background/60 backdrop-blur-sm text-xs font-medium rounded-full border border-border/50"
                        >
                          <IconImage slug={slug} alt={`${tech} logo`} className="w-3 h-3" />
                          {tech}
                        </span>
                      );
                    })}
                    {project.technologies.length > 4 && (
                      <span className="px-2 py-1 bg-muted text-xs font-medium rounded-full">
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
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <ExternalLink className="w-4 h-4" />
                        View Live
                      </motion.a>
                    )}
                    {project.github && (
                      <motion.a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-muted text-muted-foreground text-sm font-medium rounded-lg hover:bg-muted/80 transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Github className="w-4 h-4" />
                        Code
                      </motion.a>
                    )}
                  </div>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Summary Stats */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="inline-flex items-center gap-4 bg-card border border-border rounded-2xl px-8 py-6 shadow-lg">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">{featuredProjects.length}</div>
              <div className="text-sm text-muted-foreground">Featured Projects</div>
            </div>
            <div className="w-px h-12 bg-border" />
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500 mb-1">
                {new Set(featuredProjects.map(project => project.category)).size}
              </div>
              <div className="text-sm text-muted-foreground">Categories</div>
            </div>
            <div className="w-px h-12 bg-border" />
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-500 mb-1">
                {featuredProjects.reduce((acc, project) => acc + project.technologies.length, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Technologies</div>
            </div>
            <div className="w-px h-12 bg-border" />
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-500 mb-1">
                {featuredProjects.filter(project => project.url).length}
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
          <p className="text-muted-foreground mb-4">
            Explore more projects and technical implementations
          </p>
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-6 py-3 rounded-full text-sm font-medium">
            <Github className="w-4 h-4" />
            View complete portfolio on GitHub
          </div>
        </motion.div>
      </div>
    </section>
  );
}
