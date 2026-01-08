'use client';

import Image from 'next/image';
import Link from 'next/link';

import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Code, ExternalLink, Github, Star, Tag } from 'lucide-react';

import type { Project } from '@/lib/personal-data';

interface ProjectDetailProps {
  project: Project;
}

export default function ProjectDetail({ project }: ProjectDetailProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-24">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </Link>
        </motion.div>

        {/* Project Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-12"
        >
          <div className="mb-4 flex items-center gap-2">
            {project.featured && (
              <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                <Star className="h-3 w-3" />
                Featured
              </span>
            )}
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              <Tag className="h-3 w-3" />
              {project.category}
            </span>
          </div>

          <h1 className="mb-6 text-4xl font-bold text-foreground md:text-6xl">{project.title}</h1>

          <p className="max-w-3xl text-xl text-muted-foreground">{project.description}</p>
        </motion.div>

        {/* Project Content */}
        <div className="grid gap-12 lg:grid-cols-3">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            {/* Project Image/Preview */}
            {project.image && (
              <div className="mb-8 overflow-hidden rounded-lg border">
                <Image
                  src={project.image}
                  alt={project.title}
                  width={800}
                  height={400}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 800px"
                  className="h-auto w-full transition-transform duration-300 hover:scale-105"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+IRjWjBqO6O2mhP//Z"
                  priority={false}
                />
              </div>
            )}

            {/* Project Details */}
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <h2 className="mb-4 text-2xl font-bold">About This Project</h2>
              <p className="mb-6 text-muted-foreground">
                {project.longDescription || project.description}
              </p>

              {project.challenges && (
                <div className="mb-6">
                  <h3 className="mb-3 text-xl font-semibold">Challenges & Solutions</h3>
                  <ul className="list-inside list-disc space-y-2 text-muted-foreground">
                    {project.challenges.map((challenge) => (
                      <li key={challenge}>{challenge}</li>
                    ))}
                  </ul>
                </div>
              )}

              {project.outcomes && (
                <div className="mb-6">
                  <h3 className="mb-3 text-xl font-semibold">Outcomes</h3>
                  <ul className="list-inside list-disc space-y-2 text-muted-foreground">
                    {project.outcomes.map((outcome) => (
                      <li key={outcome}>{outcome}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-6"
          >
            {/* Technologies */}
            <div className="rounded-lg border bg-card p-6">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <Code className="h-5 w-5" />
                Technologies Used
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Links */}
            <div className="rounded-lg border bg-card p-6">
              <h3 className="mb-4 text-lg font-semibold">Project Links</h3>
              <div className="space-y-3">
                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 transition-colors hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Live Demo
                  </a>
                )}
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    <Github className="h-4 w-4" />
                    Source Code
                  </a>
                )}
              </div>
            </div>

            {/* Project Stats */}
            {(project.stats || project.date) && (
              <div className="rounded-lg border bg-card p-6">
                <h3 className="mb-4 text-lg font-semibold">Project Info</h3>
                <div className="space-y-3">
                  {project.date && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {new Date(project.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                      })}
                    </div>
                  )}
                  {project.stats && (
                    <div className="text-sm text-muted-foreground">{project.stats}</div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
