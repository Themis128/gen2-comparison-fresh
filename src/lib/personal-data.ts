export interface Project {
  id: string;
  title: string;
  description: string;
  image?: string;
  github?: string;
  url?: string;
  credentialId?: string;
  featured?: boolean;
  category?: string;
  technologies: string[];
  date?: string;
  longDescription?: string;
  challenges?: string[];
  outcomes?: string[];
  stats?: string;
}

export interface PersonalData {
  name: string;
  title: string;
  bio: string;
  email: string;
  phone?: string;
  location?: string;
  twitter?: string;
  linkedin?: string;
  github?: string;
  website?: string;
  skills: string[];
  experience: {
    id: string;
    title: string;
    company: string;
    period: string;
    description: string;
    location?: string;
    technologies?: string[];
  }[];
  education: {
    id: string;
    degree: string;
    school: string;
    year: string;
    description?: string;
  }[];
  languages: {
    id: string;
    name: string;
    proficiency: string;
  }[];
  projects: Project[];
  certifications?: {
    id: string;
    name: string;
    issuer: string;
    date: string;
    url?: string;
    credentialId?: string;
  }[];
  achievements?: {
    id: string;
    title: string;
    type: string;
    description: string;
    date: string;
  }[];
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
  experience: [
    {
      id: '1',
      title: 'ML/LLM Engineer',
      company: 'Tech Company',
      period: '2023 - Present',
      description: 'Developing machine learning models and LLM applications.',
      location: 'Greece',
      technologies: ['Python', 'TensorFlow', 'AWS'],
    },
    {
      id: '2',
      title: 'Cloud Solutions Architect',
      company: 'Cloud Corp',
      period: '2020 - 2023',
      description: 'Designing and implementing cloud infrastructure solutions.',
      location: 'Greece',
      technologies: ['AWS', 'Terraform', 'Docker'],
    },
  ],
  education: [
    {
      id: '1',
      degree: "Master's in Computer Science",
      school: 'University of Athens',
      year: '2015 - 2017',
      description: 'Specialized in machine learning and data science.',
    },
    {
      id: '2',
      degree: "Bachelor's in Computer Engineering",
      school: 'National Technical University',
      year: '2011 - 2015',
      description: 'Focus on software engineering and networking.',
    },
  ],
  languages: [
    {
      id: '1',
      name: 'English',
      proficiency: 'Professional',
    },
    {
      id: '2',
      name: 'Greek',
      proficiency: 'Native',
    },
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
  certifications: [
    {
      id: '1',
      name: 'AWS Certified Solutions Architect',
      issuer: 'Amazon Web Services',
      date: '2024',
      url: 'https://aws.amazon.com/certification/',
      credentialId: 'AWS-123456',
    },
    {
      id: '2',
      name: 'Cisco Certified Network Associate',
      issuer: 'Cisco',
      date: '2023',
      url: 'https://www.cisco.com/c/en/us/training-events/training-certifications/certifications/associate/ccna.html',
      credentialId: 'CCNA-789012',
    },
    {
      id: '3',
      name: 'Microsoft Azure Fundamentals',
      issuer: 'Microsoft',
      date: '2023',
      url: 'https://learn.microsoft.com/en-us/certifications/azure-fundamentals/',
      credentialId: 'AZ-900-345678',
    },
  ],
  achievements: [
    {
      id: '1',
      title: 'AWS Community Builder',
      type: 'Award',
      description:
        'Received recognition for outstanding research contribution in machine learning applications',
      date: '2024',
    },
    {
      id: '2',
      title: 'Open Source Contributor',
      type: 'Open Source',
      description: 'Contributed to major open source projects in the AI/ML ecosystem',
      date: '2023',
    },
    {
      id: '3',
      title: 'Tech Conference Speaker',
      type: 'Speaking',
      description: 'Presented on advanced cloud architecture and DevOps practices',
      date: '2023',
    },
  ],
};

export function getPersonalDataServer(): PersonalData {
  return personalData;
}
