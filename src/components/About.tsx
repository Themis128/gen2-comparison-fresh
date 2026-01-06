'use client';
import ModernAboutNew from './ModernAboutNew';

import type { PersonalData } from '../lib/personal-data';

interface AboutProps {
  data: PersonalData;
}

export default function About({ data }: AboutProps) {
  return <ModernAboutNew data={data} />;
}
