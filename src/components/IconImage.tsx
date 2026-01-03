'use client';

import Image from 'next/image';
import { useState } from 'react';

interface IconImageProps {
  slug: string;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
}

const ALIASES: Record<string, string[]> = {
  'next-js': ['nextjs'],
  'node-js': ['nodejs'],
  'socket-io': ['socketio'],
  'tailwind-css': ['tailwindcss', 'tailwind'],
  's3': ['aws-s3', 'aws-s3'],
  'aws-amplify': ['aws-amplify'],
  'express': ['express'],
  'mcp-sdk': ['mcp-protocol'],
  'mcpsdk': ['mcp-protocol'],
  'mcp_sdk': ['mcp-protocol'],
  'cross-platform-development': ['microservices'],
  'crossplatformdevelopment': ['microservices'],
  'cross_platform_development': ['microservices'],
  'wsl-integration': ['wsl-integration'],
  'path-resolution-algorithms': ['path-resolution-algorithms'],
  'error-handling': ['error-handling'],
  'aws-cdk': ['aws-cdk'],
  'awscdk': ['aws-cdk'],
  'aws_cdk': ['aws-cdk'],
  'github-actions': ['ci-cd'],
  'prometheus': ['prometheus'],
  'grafana': ['grafana'],
  'kubernetes': ['kubernetes'],
  'terraform': ['terraform'],
  'scikit-learn': ['python'],
  'pandas': ['python'],
  'tcp-ip': ['network-security'],
  'dns-dhcp': ['network-security'],
  'virtualization': ['docker'],
  'cloud-migration': ['serverless'],
  'project-management': ['devops'],
  'network-troubleshooting': ['network-security'],
  'android-app-development': ['react'],
  'data-analytics': ['python'],
  'big-data': ['python'],
  'problem-solving': ['devops'],
  'data-visualization': ['grafana'],
  'cisco-systems': ['devops'], // fallback to devops
  'azure-active-directory': ['devops'], // fallback to devops
  'microsoft-365': ['devops'], // fallback to devops
  'aws-cloud-practitioner': ['aws'],
  'network-security': ['network-security'],
  'microsoft-intune': ['devops'], // fallback to devops
  'servicenow': ['devops'], // fallback to devops
  'cyberark-pam': ['network-security'],
  'windows-server': ['devops'], // fallback to devops
};

function getCandidates(slug: string) {
  const candidates = new Set<string>();

  // Check if there's an explicit alias
  const alias = ALIASES[slug];

  if (alias) {
    // If alias exists, only use alias variations
    alias.forEach((s) => candidates.add(s));
    alias.forEach((s) => {
      candidates.add(s.replace(/-/g, ''));
      candidates.add(s.replace(/-/g, '_'));
    });
  } else {
    // No alias, use original slug variations
    candidates.add(slug);
    candidates.add(slug.replace(/-/g, ''));
    candidates.add(slug.replace(/-/g, '_'));
  }

  return Array.from(candidates).map((s) => `/icons/${s}.svg`);
}

export default function IconImage({ slug, alt = '', className, style }: IconImageProps) {
  const [index, setIndex] = useState(0);
  const candidates = getCandidates(slug);

  const handleError = () => {
    setIndex((i) => i + 1);
  };

  if (index < candidates.length) {
    return (
      <Image
        src={candidates[index]}
        alt={alt}
        className={className}
        style={style}
        width={24}
        height={24}
        onError={handleError}
      />
    );
  }

  // final fallback: basic inline SVG (generic)
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}
