'use client';
import {
  Github,
  Globe,
  Linkedin,
  Mail,
  MapPin,
  Network,
  Shield,
  Sparkles,
  Zap,
} from 'lucide-react';

import type { PersonalData } from '../lib/personal-data';

interface AboutProps {
  data: PersonalData;
}

export default function About({ data }: AboutProps) {
  const skills = [
    { name: 'Network Engineering', icon: Network, color: 'from-blue-500 to-cyan-500' },
    { name: 'Cloud Solutions', icon: Zap, color: 'from-purple-500 to-pink-500' },
    { name: 'Cisco Infrastructure', icon: Shield, color: 'from-green-500 to-emerald-500' },
    { name: 'Azure AD', icon: Sparkles, color: 'from-orange-500 to-red-500' },
  ];

  return (
    <section id="about" className="relative overflow-hidden py-32">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950" />
      <div className="absolute inset-0">
        <div className="absolute left-20 top-20 h-72 w-72 animate-pulse rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 blur-3xl" />
        <div className="animation-delay-2000 absolute bottom-20 right-20 h-96 w-96 animate-pulse rounded-full bg-gradient-to-br from-purple-400/20 to-pink-400/20 blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-6">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-20 text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">About Me</span>
            </div>
            <h2 className="mb-6 text-4xl font-bold text-foreground md:text-6xl">
              Passionate About
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Technology & Innovation
              </span>
            </h2>
            <p className="mx-auto max-w-3xl text-xl leading-relaxed text-muted-foreground">
              Creating exceptional digital experiences through innovative technology solutions and
              cutting-edge infrastructure
            </p>
          </div>

          <div className="mb-20 grid items-center gap-16 lg:grid-cols-2">
            {/* Profile Section */}
            <div className="relative">
              <div className="relative z-10">
                {/* Main Avatar */}
                <div className="relative">
                  <div className="mx-auto h-80 w-80 rounded-3xl bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 p-1 shadow-2xl shadow-blue-500/25">
                    <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 text-6xl font-bold text-white">
                      {/* Animated background pattern */}
                      <div className="absolute inset-0 opacity-20">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
                        <div
                          className="absolute inset-0 animate-spin bg-[conic-gradient(from_0deg,transparent,rgba(255,255,255,0.1),transparent)]"
                          style={{ animationDuration: '20s' }}
                        />
                      </div>
                      <span className="relative z-10">
                        {data.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </span>
                    </div>
                  </div>

                  {/* Floating elements */}
                  <div className="absolute -right-4 -top-4 flex h-16 w-16 animate-bounce items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 shadow-lg">
                    <Network className="h-8 w-8 text-white" />
                  </div>
                  <div className="animation-delay-1000 absolute -bottom-4 -left-4 flex h-12 w-12 animate-bounce items-center justify-center rounded-xl bg-gradient-to-br from-purple-400 to-pink-500 shadow-lg">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>

              {/* Decorative background */}
              <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-xl" />
            </div>

            {/* Content Section */}
            <div className="space-y-8">
              <div>
                <h3 className="mb-4 text-3xl font-bold text-foreground">{data.title}</h3>
                <p className="mb-6 text-lg leading-relaxed text-muted-foreground">{data.bio}</p>

                {/* Key Highlights */}
                <div className="mb-8 grid grid-cols-2 gap-4">
                  <div className="rounded-xl border border-border/50 bg-background/60 p-4 backdrop-blur-sm">
                    <div className="mb-1 text-2xl font-bold text-primary">15+</div>
                    <div className="text-sm text-muted-foreground">Years Experience</div>
                  </div>
                  <div className="rounded-xl border border-border/50 bg-background/60 p-4 backdrop-blur-sm">
                    <div className="mb-1 text-2xl font-bold text-primary">50+</div>
                    <div className="text-sm text-muted-foreground">Projects Completed</div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="group rounded-xl border border-border/50 bg-background/60 p-6 backdrop-blur-sm transition-all duration-300 hover:shadow-lg">
                  <div className="mb-3 flex items-center">
                    <div className="mr-3 rounded-lg bg-blue-500/10 p-2">
                      <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">Email</span>
                  </div>
                  <p className="font-medium text-foreground">{data.email}</p>
                </div>

                <div className="group rounded-xl border border-border/50 bg-background/60 p-6 backdrop-blur-sm transition-all duration-300 hover:shadow-lg">
                  <div className="mb-3 flex items-center">
                    <div className="mr-3 rounded-lg bg-green-500/10 p-2">
                      <MapPin className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">Location</span>
                  </div>
                  <p className="font-medium text-foreground">{data.location}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div className="mb-16 text-center">
            <h3 className="mb-8 text-2xl font-bold text-foreground">Core Expertise</h3>
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {skills.map((skill) => {
                const Icon = skill.icon;
                return (
                  <div
                    key={skill.name}
                    className="group relative cursor-pointer overflow-hidden rounded-2xl border border-border/50 bg-background/60 p-6 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  >
                    {/* Background gradient */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${skill.color} opacity-0 transition-opacity duration-300 group-hover:opacity-10`}
                    />

                    <div className="relative z-10">
                      <div
                        className={`inline-flex rounded-xl bg-gradient-to-br p-3 ${skill.color} mb-4`}
                      >
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <h4 className="text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                        {skill.name}
                      </h4>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Social Links */}
          <div className="text-center">
            <p className="mb-6 text-muted-foreground">Connect with me</p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {data.github && (
                <a
                  href={data.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md border border-border/50 bg-background/60 px-6 py-3 font-medium backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:bg-primary/10"
                >
                  <Github className="h-4 w-4" />
                  GitHub
                </a>
              )}
              {data.linkedin && (
                <a
                  href={data.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md border border-border/50 bg-background/60 px-6 py-3 font-medium backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:bg-primary/10"
                >
                  <Linkedin className="h-4 w-4" />
                  LinkedIn
                </a>
              )}
              {data.website && (
                <a
                  href={data.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md border border-border/50 bg-background/60 px-6 py-3 font-medium backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:bg-primary/10"
                >
                  <Globe className="h-4 w-4" />
                  Portfolio
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
