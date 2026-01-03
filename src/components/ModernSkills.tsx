"use client";
import { motion } from 'framer-motion';
import { Award, BarChart3, Brain, Calendar, Cloud, Code2, Cpu, Database, ExternalLink, GitBranch, Globe, Lock, Network, Server, Settings, Shield, Smartphone, Sparkles, Star, Zap } from 'lucide-react';
import { useState } from 'react';
import { PersonalData } from '../lib/personal-data';

interface SkillsProps {
  data: PersonalData;
}

export default function Skills({ data }: SkillsProps) {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  // Enhanced skill categories based on CV analysis
  const skillCategories = [
    {
      title: "Network & Infrastructure",
      icon: Network,
      description: "Core networking and infrastructure expertise",
      skills: [
        { name: "Cisco Systems", level: 95, icon: Network, description: "Enterprise networking solutions and infrastructure" },
        { name: "Network Security", level: 92, icon: Shield, description: "Secure network architectures and protocols" },
        { name: "TCP/IP Protocols", level: 90, icon: Globe, description: "Network communication protocols" },
        { name: "DNS/DHCP", level: 88, icon: Settings, description: "Network services and configuration" },
        { name: "Windows Server", level: 85, icon: Server, description: "Server administration and management" },
      ]
    },
    {
      title: "Cloud & Azure",
      icon: Cloud,
      description: "Cloud platforms and Azure ecosystem",
      skills: [
        { name: "Azure Active Directory", level: 93, icon: Cloud, description: "Identity and access management" },
        { name: "Microsoft 365", level: 90, icon: Server, description: "Office 365 administration and support" },
        { name: "Microsoft Intune", level: 87, icon: Smartphone, description: "Mobile device and application management" },
        { name: "AWS Cloud", level: 85, icon: Cloud, description: "Amazon Web Services platform" },
        { name: "Cloud Migration", level: 82, icon: Zap, description: "Cloud migration strategies and execution" },
      ]
    },
    {
      title: "Data & Analytics",
      icon: BarChart3,
      description: "Data analysis and visualization technologies",
      skills: [
        { name: "Python", level: 88, icon: Code2, description: "Programming and data analysis" },
        { name: "Pandas", level: 85, icon: Database, description: "Data manipulation and analysis" },
        { name: "Scikit-Learn", level: 82, icon: Brain, description: "Machine learning algorithms" },
        { name: "Data Visualization", level: 80, icon: BarChart3, description: "Data presentation and insights" },
        { name: "Big Data Analytics", level: 78, icon: Database, description: "Large-scale data processing" },
      ]
    },
    {
      title: "Security & Compliance",
      icon: Lock,
      description: "Cybersecurity and compliance frameworks",
      skills: [
        { name: "CyberArk PAM", level: 87, icon: Shield, description: "Privileged access management" },
        { name: "RBAC & Access Control", level: 85, icon: Lock, description: "Role-based access control" },
        { name: "Network Security", level: 83, icon: Shield, description: "Network protection and monitoring" },
        { name: "Compliance Management", level: 80, icon: Shield, description: "Regulatory compliance" },
        { name: "Security Protocols", level: 78, icon: Lock, description: "Security best practices" },
      ]
    },
    {
      title: "Development & Tools",
      icon: Cpu,
      description: "Development tools and methodologies",
      skills: [
        { name: "ServiceNow", level: 85, icon: Settings, description: "IT service management platform" },
        { name: "DevNet Associate", level: 83, icon: Code2, description: "Cisco network programmability" },
        { name: "Android Development", level: 80, icon: Smartphone, description: "Mobile application development" },
        { name: "Git & Version Control", level: 82, icon: GitBranch, description: "Source code management" },
        { name: "Virtualization", level: 78, icon: Server, description: "Virtual infrastructure management" },
      ]
    },
    {
      title: "Project Management",
      icon: Settings,
      description: "Project delivery and organizational skills",
      skills: [
        { name: "Project Management", level: 88, icon: Settings, description: "Project planning and execution" },
        { name: "Problem Solving", level: 90, icon: Brain, description: "Technical troubleshooting" },
        { name: "Network Troubleshooting", level: 87, icon: Network, description: "Network issue resolution" },
        { name: "IT Support", level: 85, icon: Shield, description: "Technical support services" },
        { name: "Team Collaboration", level: 83, icon: Zap, description: "Cross-functional teamwork" },
      ]
    }
  ];

  const getSkillColor = (level: number) => {
    if (level >= 90) return "from-emerald-500 to-green-500";
    if (level >= 85) return "from-blue-500 to-cyan-500";
    if (level >= 80) return "from-purple-500 to-pink-500";
    return "from-orange-500 to-red-500";
  };

  return (
    <section id="skills" className="relative py-32 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950" />
      <div className="absolute inset-0">
        <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-40 left-20 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse animation-delay-2000" />
      </div>

      <div className="relative z-10 container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Skills & Expertise</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Technical
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Proficiency
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Comprehensive expertise in network engineering, cloud solutions, and modern infrastructure technologies
            </p>
          </div>

          {/* Skills Grid */}
          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-20">
            {skillCategories.map((category) => {
              const CategoryIcon = category.icon;
              return (
                <div
                  key={category.title}
                  className="group bg-background/60 backdrop-blur-sm rounded-3xl p-8 border border-border/50 hover:shadow-2xl transition-all duration-500 hover:border-primary/20"
                >
                  {/* Category Header */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 group-hover:scale-110 transition-transform duration-300">
                      <CategoryIcon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">{category.title}</h3>
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                    </div>
                  </div>

                  {/* Skills List */}
                  <div className="space-y-5">
                    {category.skills.map((skill) => {
                      const SkillIcon = skill.icon;
                      const isHovered = hoveredSkill === skill.name;
                      return (
                        <div
                          key={skill.name}
                          className="group/skill relative"
                          onMouseEnter={() => setHoveredSkill(skill.name)}
                          onMouseLeave={() => setHoveredSkill(null)}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-3 flex-1">
                              <div className={`p-2 rounded-lg bg-gradient-to-br ${getSkillColor(skill.level)} transition-all duration-300 ${isHovered ? 'scale-110 shadow-lg' : ''}`}>
                                <SkillIcon className="h-4 w-4 text-white" />
                              </div>
                              <div className="flex-1">
                                <span className="font-semibold text-foreground text-sm">{skill.name}</span>
                                <p className="text-xs text-muted-foreground mt-1 opacity-0 group-hover/skill:opacity-100 transition-opacity duration-200">
                                  {skill.description}
                                </p>
                              </div>
                            </div>
                            <span className="text-xs font-mono text-muted-foreground ml-2">{skill.level}%</span>
                          </div>

                          {/* Progress Bar */}
                          <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${getSkillColor(skill.level)} transition-all duration-1000 ease-out`}
                              style={{
                                width: isHovered ? `${skill.level}%` : '0%',
                                transitionDelay: isHovered ? '200ms' : '0ms'
                              }}
                            />
                            {/* Animated shine effect */}
                            <div
                              className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 ${isHovered ? 'translate-x-full' : '-translate-x-full'}`}
                              style={{
                                transitionDelay: isHovered ? '600ms' : '0ms'
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Certifications Highlight */}
          <div className="text-center mb-16">
            <motion.div
              className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Award className="w-4 h-4" />
              Professional Credentials
            </motion.div>
            <motion.h3
              className="text-3xl font-bold text-foreground mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Industry Certifications
            </motion.h3>
            <div className="flex flex-wrap justify-center gap-4 max-w-5xl mx-auto">
              {data.certifications?.slice(0, 6).map((cert, index) => {
                const isRecent = new Date().getFullYear() - parseInt(cert.date) <= 2;
                const colors = {
                  'Amazon Web Services': 'from-orange-500/10 to-orange-600/10 hover:from-orange-500/20 hover:to-orange-600/20',
                  'Cisco': 'from-blue-500/10 to-blue-600/10 hover:from-blue-500/20 hover:to-blue-600/20',
                  'Microsoft': 'from-blue-500/10 to-indigo-600/10 hover:from-blue-500/20 hover:to-indigo-600/20',
                }[cert.issuer] || 'from-primary/10 to-primary/20 hover:from-primary/20 hover:to-primary/30';

                return (
                  <motion.div
                    key={cert.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`group relative bg-gradient-to-br ${colors} backdrop-blur-sm border border-border/50 rounded-xl px-6 py-4 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden min-w-[280px]`}
                  >
                    {/* Background gradient on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />

                    {/* Recent badge */}
                    {isRecent && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <Star className="w-3 h-3 text-white" />
                      </div>
                    )}

                    <div className="relative z-10 text-center">
                      <div className="text-sm font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                        {cert.name}
                      </div>
                      <div className="text-xs text-muted-foreground mb-2">
                        {cert.issuer}
                      </div>
                      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {cert.date}
                        {cert.url && (
                          <ExternalLink
                            className="w-3 h-3 ml-1 opacity-50 group-hover:opacity-100 transition-opacity cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(cert.url, '_blank');
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Technologies Cloud */}
          <div className="text-center mb-16">
            <h3 className="text-2xl font-bold text-foreground mb-8">Technologies & Tools</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {data.skills.map((skill) => (
                <div
                  key={skill}
                  className="group relative bg-background/60 backdrop-blur-sm border border-border/50 rounded-full px-4 py-2 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden"
                >
                  {/* Background gradient on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <span className="relative z-10 text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    {skill}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center space-y-8">
            <div className="inline-flex items-center gap-3 bg-background/60 backdrop-blur-sm rounded-full px-8 py-4 border border-border/50">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-muted-foreground font-medium">Always learning and exploring new technologies</span>
              <Sparkles className="h-4 w-4 text-primary" />
            </div>

            {/* Skills Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">15+</div>
                <div className="text-sm text-muted-foreground">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">25+</div>
                <div className="text-sm text-muted-foreground">Technologies</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">5</div>
                <div className="text-sm text-muted-foreground">Certifications</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">100%</div>
                <div className="text-sm text-muted-foreground">SLA Compliance</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}