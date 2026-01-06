"use client";
import ModernExperience from './ModernExperience';

import type { PersonalData } from '../lib/personal-data';

interface ExperienceProps {
  data: PersonalData;
}

export default function Experience({ data }: ExperienceProps) {
  return <ModernExperience data={data} />;
}
