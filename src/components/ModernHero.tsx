'use client';

import { useEffect, useRef, useState } from 'react';

import { motion } from 'framer-motion';
import {
  ArrowRight,
  Cloud,
  Github,
  Globe,
  Linkedin,
  Network,
  Server,
  Shield,
  type LucideIcon,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

// Particle class for the background animation
class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * canvasHeight;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.size = Math.random() * 2 + 1;
    this.color = Math.random() > 0.5 ? '#3b82f6' : '#06b6d4';
    this.alpha = Math.random() * 0.5 + 0.2;
  }

  update(canvasWidth: number, canvasHeight: number) {
    this.x += this.vx;
    this.y += this.vy;

    // Wrap around edges
    if (this.x < 0) this.x = canvasWidth;
    if (this.x > canvasWidth) this.x = 0;
    if (this.y < 0) this.y = canvasHeight;
    if (this.y > canvasHeight) this.y = 0;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

const ParticlesBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create particles
    const particles: Particle[] = [];
    const particleCount = 100;

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle(canvas.width, canvas.height));
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      particles.forEach((particle, i) => {
        particles.slice(i + 1).forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            ctx.save();
            ctx.globalAlpha = ((120 - distance) / 120) * 0.2;
            ctx.strokeStyle = particle.color;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
            ctx.restore();
          }
        });
      });

      // Update and draw particles
      particles.forEach((particle) => {
        particle.update(canvas.width, canvas.height);
        particle.draw(ctx);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20" />

      {/* Particles canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        style={{ background: 'transparent' }}
      />

      {/* Animated shapes for extra effect */}
      <motion.div
        className="absolute left-10 top-20 h-32 w-32 rounded-full bg-blue-200/20 blur-2xl dark:bg-blue-500/10"
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute right-20 top-40 h-24 w-24 rounded-full bg-purple-200/20 blur-2xl dark:bg-purple-500/10"
        animate={{
          x: [0, -40, 0],
          y: [0, 25, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      />
      <motion.div
        className="dark:bg-indigo-500/8 absolute bottom-32 left-1/4 h-40 w-40 rounded-full bg-indigo-200/15 blur-3xl"
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 4,
        }}
      />

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:50px_50px] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)]" />
    </div>
  );
};

const FeatureCards = ({ features }: { features: Array<{ icon: LucideIcon; label: string }> }) => {
  return (
    <motion.div
      className="mx-auto grid max-w-4xl grid-cols-2 gap-4 md:grid-cols-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
    >
      {features.map((feature, _index) => {
        const Icon = feature.icon;
        return (
          <motion.div
            key={feature.label}
            className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-gray-200/50 bg-white/80 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl dark:border-gray-700/50 dark:bg-gray-800/80"
            whileHover={{ y: -5 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/50">
              <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-center text-sm font-medium text-gray-700 dark:text-gray-300">
              {feature.label}
            </span>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

const AnimatedName = ({ name }: { name: string }) => {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let index = 0;
    const typeWriter = () => {
      if (index < name.length) {
        setDisplayText(name.slice(0, index + 1));
        index++;
        setTimeout(typeWriter, 100);
      } else {
        setIsTyping(false);
      }
    };

    const timer = setTimeout(typeWriter, 500);
    return () => clearTimeout(timer);
  }, [name]);

  return (
    <motion.h1
      className="mb-6 text-5xl font-black text-blue-600 md:text-7xl lg:text-8xl dark:text-blue-400"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
        {displayText}
      </span>
      {isTyping && (
        <motion.span
          className="ml-1 inline-block h-12 w-1 bg-blue-600 md:h-16 lg:h-20"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
      )}
      {!isTyping && (
        <motion.span
          className="ml-2 inline-block"
          animate={{
            textShadow: [
              '0 0 0px rgba(59, 130, 246, 0)',
              '0 0 20px rgba(59, 130, 246, 0.5)',
              '0 0 0px rgba(59, 130, 246, 0)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          ✨
        </motion.span>
      )}
    </motion.h1>
  );
};

const AnimatedBio = ({ bio }: { bio: string }) => {
  const words = bio.split(' ');
  const [visibleWords, setVisibleWords] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleWords((prev) => {
        if (prev < words.length) {
          return prev + 1;
        }
        clearInterval(timer);
        return prev;
      });
    }, 150);

    return () => clearInterval(timer);
  }, [words.length]);

  return (
    <motion.p
      className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-gray-600 md:text-xl dark:text-gray-400"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
    >
      {words.map((word, index) => (
        <motion.span
          key={word}
          className="mr-1 inline-block"
          initial={{ opacity: 0, y: 10 }}
          animate={{
            opacity: index < visibleWords ? 1 : 0,
            y: index < visibleWords ? 0 : 10,
          }}
          transition={{
            duration: 0.3,
            delay: index * 0.05,
            ease: 'easeOut',
          }}
        >
          {word}
        </motion.span>
      ))}
    </motion.p>
  );
};

interface PersonalData {
  name: string;
  title: string;
  bio: string;
  email: string;
  location: string;
  phone?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  skills: string[];
}

interface ModernHeroProps {
  data: PersonalData;
}

const ModernHeroSection = ({ data }: ModernHeroProps) => {
  const features = [
    { icon: Network, label: 'Network Engineering' },
    { icon: Cloud, label: 'Cloud Solutions' },
    { icon: Server, label: 'Cisco Systems' },
    { icon: Shield, label: 'Azure AD' },
  ];

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <ParticlesBackground />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-20">
        <div className="mx-auto w-full max-w-6xl text-center">
          {/* Name */}
          <AnimatedName name={data.name.split(' ')[0]} />

          {/* Title */}
          <motion.h2
            className="mb-6 text-2xl font-bold text-gray-800 md:text-4xl dark:text-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {data.title}
          </motion.h2>

          {/* Bio */}
          <AnimatedBio bio={data.bio} />

          {/* CTA Buttons */}
          <motion.div
            className="mb-16 flex flex-col items-center justify-center gap-4 sm:flex-row"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <Button
              size="lg"
              className="group relative w-full transform overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white shadow-xl transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 hover:shadow-2xl sm:w-auto"
              onClick={() =>
                document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              <span className="relative z-10 flex items-center gap-2">
                View My Work
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full border-blue-200 bg-white/80 text-blue-700 backdrop-blur-sm hover:bg-blue-50 sm:w-auto dark:border-blue-800 dark:bg-gray-800/80 dark:text-blue-300 dark:hover:bg-blue-900/20"
              onClick={() =>
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              Get In Touch
            </Button>
          </motion.div>

          {/* Feature Cards */}
          <FeatureCards features={features} />

          {/* Social Links */}
          <motion.div
            className="mt-20 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <p className="mb-6 text-gray-500 dark:text-gray-400">Connect with me</p>
            <div className="flex flex-wrap items-center justify-center gap-6">
              {data.github && (
                <motion.a
                  href={data.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white/60 px-4 py-2 font-medium text-gray-700 backdrop-blur-sm transition-all duration-200 hover:bg-white hover:shadow-md dark:border-gray-700 dark:bg-gray-800/60 dark:text-gray-300 dark:hover:bg-gray-800"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Github className="h-4 w-4" />
                  GitHub
                </motion.a>
              )}
              {data.linkedin && (
                <motion.a
                  href={data.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white/60 px-4 py-2 font-medium text-gray-700 backdrop-blur-sm transition-all duration-200 hover:bg-white hover:shadow-md dark:border-gray-700 dark:bg-gray-800/60 dark:text-gray-300 dark:hover:bg-gray-800"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Linkedin className="h-4 w-4" />
                  LinkedIn
                </motion.a>
              )}
              {data.website && (
                <motion.a
                  href={data.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white/60 px-4 py-2 font-medium text-gray-700 backdrop-blur-sm transition-all duration-200 hover:bg-white hover:shadow-md dark:border-gray-700 dark:bg-gray-800/60 dark:text-gray-300 dark:hover:bg-gray-800"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Globe className="h-4 w-4" />
                  Portfolio
                </motion.a>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ModernHeroSection;
