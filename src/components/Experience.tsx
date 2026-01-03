"use client";
import { PersonalData } from '../lib/personal-data';
import ModernExperience from './ModernExperience';

interface ExperienceProps {
  data: PersonalData;
}

export default function Experience({ data }: ExperienceProps) {
  return <ModernExperience data={data} />;
}
