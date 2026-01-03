"use client";
import { PersonalData } from '../lib/personal-data';
import ModernAboutNew from './ModernAboutNew';

interface AboutProps {
  data: PersonalData;
}

export default function About({ data }: AboutProps) {
  return <ModernAboutNew data={data} />;
}
