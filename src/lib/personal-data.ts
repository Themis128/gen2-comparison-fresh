export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  category: string;
  featured: boolean;
  url?: string;
  github?: string;
  technologies: string[];
  date?: string;
  image?: string;
  challenges?: string[];
  outcomes?: string[];
  stats?: any;
}

export interface PersonalData {
  name: string;
  title: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  twitter: string;
  linkedin: string;
  github: string;
  website: string;
  profilePicture?: string;
  company?: {
    name: string;
    tagline: string;
    description: string;
    founded: string;
    location: string;
    focus: string[];
    services: string[];
    website: string;
  };
  skills: string[];
  projects: Project[];
  experience: any[];
  education: any[];
  languages: any[];
  certifications: { id: string; name: string; issuer: string; date: string; url: string; credentialId?: string; }[]; // TODO: Define proper type
  achievements: any[];
}

export const personalData: PersonalData = {
  name: 'Themistoklis Baltzakis',
  title: 'ML/LLM Engineer',
  bio: 'ML/LLM Engineer with over 15 years of experience in IT support, cloud solutions, and Cisco infrastructure management.',
  email: 'contact@baltzakis.com',
  phone: '+30 XXX XXX XXXX',
  location: 'Greece',
  twitter: 'https://twitter.com/your-handle',
  linkedin: 'https://www.linkedin.com/in/baltzakis-themis',
  github: 'https://github.com/Themis128',
  website: 'https://baltzakisthemis.com',
  skills: [
    'Machine Learning',
    'Large Language Models',
    'Python',
    'TensorFlow',
    'PyTorch',
    'AWS Cloud',
    'Cisco Networking',
    'Data Analytics',
    'TypeScript',
    'Next.js',
    'React',
    'Node.js',
  ],
  projects: [
    {
      id: '1',
      title: 'Portfolio Website',
      description: 'Modern portfolio website built with Next.js and TailwindCSS.',
      category: 'Web Development',
      featured: true,
      url: 'https://baltzakisthemis.com',
      github: 'https://github.com/Themis128/portfolio',
      technologies: ['Next.js', 'TypeScript', 'TailwindCSS'],
    },
    {
      id: '2',
      title: 'ML Model Trainer',
      description: 'Tool for training and deploying ML models on AWS.',
      category: 'Machine Learning',
      featured: true,
      github: 'https://github.com/Themis128/ml-trainer',
      technologies: ['Python', 'AWS SageMaker', 'Docker'],
    },
  ],
  experience: [],
  education: [],
  languages: [],
  certifications: [],
  achievements: [],
};
