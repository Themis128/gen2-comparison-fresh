"use client";
import { Github, Globe, Linkedin, Mail, MapPin, Network, Shield, Sparkles, Zap } from 'lucide-react';
import { PersonalData } from '../lib/personal-data';

interface AboutProps {
  data: PersonalData;
}

export default function About({ data }: AboutProps) {
  const skills = [
    { name: "Network Engineering", icon: Network, color: "from-blue-500 to-cyan-500" },
    { name: "Cloud Solutions", icon: Zap, color: "from-purple-500 to-pink-500" },
    { name: "Cisco Infrastructure", icon: Shield, color: "from-green-500 to-emerald-500" },
    { name: "Azure AD", icon: Sparkles, color: "from-orange-500 to-red-500" },
  ];

  return (
    <section id="about" className="relative py-32 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950" />
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse animation-delay-2000" />
      </div>

      <div className="relative z-10 container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">About Me</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Passionate About
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Technology & Innovation
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Creating exceptional digital experiences through innovative technology solutions and cutting-edge infrastructure
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            {/* Profile Section */}
            <div className="relative">
              <div className="relative z-10">
                {/* Main Avatar */}
                <div className="relative">
                  <div className="w-80 h-80 mx-auto rounded-3xl bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 p-1 shadow-2xl shadow-blue-500/25">
                    <div className="w-full h-full rounded-3xl bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center text-white text-6xl font-bold relative overflow-hidden">
                      {/* Animated background pattern */}
                      <div className="absolute inset-0 opacity-20">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
                        <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent,rgba(255,255,255,0.1),transparent)] animate-spin" style={{animationDuration: '20s'}} />
                      </div>
                      <span className="relative z-10">{data.name.split(' ').map(n => n[0]).join('')}</span>
                    </div>
                  </div>

                  {/* Floating elements */}
                  <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg animate-bounce">
                    <Network className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg animate-bounce animation-delay-1000">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>

              {/* Decorative background */}
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl blur-xl -z-10" />
            </div>

            {/* Content Section */}
            <div className="space-y-8">
              <div>
                <h3 className="text-3xl font-bold text-foreground mb-4">
                  {data.title}
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  {data.bio}
                </p>

                {/* Key Highlights */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-background/60 backdrop-blur-sm rounded-xl p-4 border border-border/50">
                    <div className="text-2xl font-bold text-primary mb-1">15+</div>
                    <div className="text-sm text-muted-foreground">Years Experience</div>
                  </div>
                  <div className="bg-background/60 backdrop-blur-sm rounded-xl p-4 border border-border/50">
                    <div className="text-2xl font-bold text-primary mb-1">50+</div>
                    <div className="text-sm text-muted-foreground">Projects Completed</div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="group bg-background/60 backdrop-blur-sm rounded-xl p-6 border border-border/50 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center mb-3">
                    <div className="p-2 rounded-lg bg-blue-500/10 mr-3">
                      <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">Email</span>
                  </div>
                  <p className="text-foreground font-medium">{data.email}</p>
                </div>

                <div className="group bg-background/60 backdrop-blur-sm rounded-xl p-6 border border-border/50 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center mb-3">
                    <div className="p-2 rounded-lg bg-green-500/10 mr-3">
                      <MapPin className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">Location</span>
                  </div>
                  <p className="text-foreground font-medium">{data.location}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div className="text-center mb-16">
            <h3 className="text-2xl font-bold text-foreground mb-8">Core Expertise</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {skills.map((skill) => {
                const Icon = skill.icon;
                return (
                  <div
                    key={skill.name}
                    className="group relative bg-background/60 backdrop-blur-sm rounded-2xl p-6 border border-border/50 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden"
                  >
                    {/* Background gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${skill.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

                    <div className="relative z-10">
                      <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${skill.color} mb-4`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
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
            <p className="text-muted-foreground mb-6">Connect with me</p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {data.github && (
                <a
                  href={data.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-md border border-border/50 bg-background/60 backdrop-blur-sm hover:bg-primary/10 hover:border-primary/50 transition-all duration-300 font-medium"
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
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-md border border-border/50 bg-background/60 backdrop-blur-sm hover:bg-primary/10 hover:border-primary/50 transition-all duration-300 font-medium"
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
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-md border border-border/50 bg-background/60 backdrop-blur-sm hover:bg-primary/10 hover:border-primary/50 transition-all duration-300 font-medium"
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