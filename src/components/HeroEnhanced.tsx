"use client";
import { PersonalData } from '../lib/personal-data';
import ModernHeroSection from './ModernHero';

interface HeroProps {
  data: PersonalData;
}

export default function Hero({ data }: HeroProps) {
  return <ModernHeroSection data={data} />;
}
