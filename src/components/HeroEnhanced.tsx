"use client";
import ModernHeroSection from './ModernHero';

import type { PersonalData } from '../lib/personal-data';

interface HeroProps {
  data: PersonalData;
}

export default function Hero({ data }: HeroProps) {
  return <ModernHeroSection data={data} />;
}
