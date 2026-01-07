'use client';

import { Button } from './ui/button';

interface HeroActionsProps {
  email: string;
}

export default function HeroActions({ email }: HeroActionsProps) {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
    <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
      <Button
        size="lg"
        className="bg-blue-600 px-8 py-3 text-white hover:bg-blue-700"
        onClick={() => scrollToSection('projects')}
      >
        View My Work
      </Button>
      <Button
        variant="outline"
        size="lg"
        className="border-blue-600 px-8 py-3 text-blue-600 hover:bg-blue-600 hover:text-white"
        onClick={() => (window.location.href = `mailto:${email}`)}
      >
        Get In Touch
      </Button>
    </div>
  );
}
