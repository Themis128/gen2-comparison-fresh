"use client";
import ModernSkills from './ModernSkills';

import type { PersonalData } from '../lib/personal-data';

interface SkillsProps {
  data: PersonalData;
}

export default function Skills({ data }: SkillsProps) {
  return <ModernSkills data={data} />;
}
