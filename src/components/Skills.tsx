"use client";
import { PersonalData } from '../lib/personal-data';
import ModernSkills from './ModernSkills';

interface SkillsProps {
  data: PersonalData;
}

export default function Skills({ data }: SkillsProps) {
  return <ModernSkills data={data} />;
}
