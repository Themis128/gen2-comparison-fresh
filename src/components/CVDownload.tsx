"use client";
import jsPDF from 'jspdf';
import { PersonalData } from '../lib/personal-data';
import { Button } from "./ui/button";

interface CVDownloadProps {
  data: PersonalData;
}

export default function CVDownload({ data }: CVDownloadProps) {
  const svgToPngDataUrl = async (svgText: string, width = 64, height = 64) => {
    try {
      const svg = `<?xml version="1.0" encoding="utf-8"?>${svgText}`;
      const svgUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
      const img = new Image();
      img.src = svgUrl;

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject();
      });

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return '';
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);
      return canvas.toDataURL('image/png');
    } catch {
      return '';
    }
  };

  const fetchSvg = async (path: string) => {
    try {
      const res = await fetch(path);
      if (!res.ok) return '';
      return await res.text();
    } catch {
      return '';
    }
  };

  const fetchSvgWithFallback = async (slug: string) => {
    const aliases: Record<string, string[]> = {
      'next-js': ['nextjs'],
      'node-js': ['nodejs'],
      'socket-io': ['socketio'],
      'tailwind-css': ['tailwindcss', 'tailwind'],
      's3': ['aws-s3'],
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

    const candidates = new Set<string>();
    candidates.add(slug);
    candidates.add(slug.replace(/-/g, ''));
    candidates.add(slug.replace(/-/g, '_'));
    const map = aliases[slug];
    if (map) map.forEach((s) => candidates.add(s));

    for (const s of Array.from(candidates)) {
      const path = `/icons/${s}.svg`;
      const svg = await fetchSvg(path);
      if (svg) return svg;
    }

    return '';
  };

  const handleDownload = async () => {
    const doc = new jsPDF();
    let yPosition = 20;

    // Set font
    doc.setFont('helvetica', 'normal');

    // Header - Name and Title
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text(data.name, 20, yPosition);
    yPosition += 10;

    doc.setFontSize(16);
    doc.setFont('helvetica', 'normal');
    doc.text(data.title, 20, yPosition);
    yPosition += 14;

    // Small tech badges under name (top 6 skills)
    const topSkills = data.skills.slice(0, 6);
    let xPos = 20;
    const badgeSize = 12;
    for (const skill of topSkills) {
      const slug = skill.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const svg = await fetchSvgWithFallback(slug);
      if (svg) {
        const dataUrl = await svgToPngDataUrl(svg, badgeSize * 2, badgeSize * 2);
        if (dataUrl) {
          doc.addImage(dataUrl, 'PNG', xPos, yPosition - 10, badgeSize, badgeSize);
        }
      }
      xPos += badgeSize + 8;
    }
    yPosition += 14;

    // Contact Information
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Contact Information', 20, yPosition);
    yPosition += 8;

    doc.setFont('helvetica', 'normal');
    doc.text(`Email: ${data.email}`, 20, yPosition);
    yPosition += 6;
    doc.text(`Location: ${data.location}`, 20, yPosition);
    yPosition += 6;

    if (data.phone) {
      doc.text(`Phone: ${data.phone}`, 20, yPosition);
      yPosition += 6;
    }
    if (data.website) {
      doc.text(`Website: ${data.website}`, 20, yPosition);
      yPosition += 6;
    }
    if (data.linkedin) {
      doc.text(`LinkedIn: ${data.linkedin}`, 20, yPosition);
      yPosition += 6;
    }
    if (data.github) {
      doc.text(`GitHub: ${data.github}`, 20, yPosition);
      yPosition += 6;
    }

    yPosition += 8;

    // Bio
    doc.setFont('helvetica', 'bold');
    doc.text('Professional Summary', 20, yPosition);
    yPosition += 8;

    doc.setFont('helvetica', 'normal');
    const bioLines = doc.splitTextToSize(data.bio, 170);
    doc.text(bioLines, 20, yPosition);
    yPosition += bioLines.length * 5 + 10;

    // Check if we need a new page
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }

    // Skills - render as badges with icons
    doc.setFont('helvetica', 'bold');
    doc.text('Skills', 20, yPosition);
    yPosition += 8;

    let x = 20;
    let rowHeight = 10;
    const pageWidth = doc.internal.pageSize.getWidth();
    for (const skill of data.skills) {
      const slug = skill.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const svg = await fetchSvgWithFallback(slug);
      const labelWidth = doc.getTextWidth(skill) + 18; // padding
      if (x + labelWidth > pageWidth - 20) {
        x = 20;
        yPosition += rowHeight + 6;
        rowHeight = 10;
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }
      }

      // draw badge background
      doc.setFillColor(245, 245, 245);
      doc.roundedRect(x, yPosition, labelWidth, 10, 3, 3, 'F');

      // draw icon if available
      if (svg) {
        const dataUrl = await svgToPngDataUrl(svg, 16, 16);
        if (dataUrl) {
          doc.addImage(dataUrl, 'PNG', x + 4, yPosition + 1, 8, 8);
        }
      }

      // draw text
      doc.setFontSize(10);
      doc.setTextColor(30, 30, 30);
      const textX = x + (svg ? 16 : 6);
      doc.text(skill, textX, yPosition + 8);

      x += labelWidth + 8;
      rowHeight = Math.max(rowHeight, 12);
    }

    yPosition += rowHeight + 12;

    // Experience
    if (yPosition > 200) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFont('helvetica', 'bold');
    doc.text('Professional Experience', 20, yPosition);
    yPosition += 10;

    data.experience.forEach((exp) => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFont('helvetica', 'bold');
      doc.text(`${exp.title} at ${exp.company}`, 20, yPosition);
      yPosition += 6;

      doc.setFont('helvetica', 'italic');
      doc.text(exp.period, 20, yPosition);
      yPosition += 8;

      doc.setFont('helvetica', 'normal');
      const descLines = doc.splitTextToSize(exp.description, 160);
      doc.text(descLines, 30, yPosition);
      yPosition += descLines.length * 5 + 8;
    });

    // Education
    if (yPosition > 200) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFont('helvetica', 'bold');
    doc.text('Education', 20, yPosition);
    yPosition += 10;

    data.education.forEach((edu) => {
      doc.setFont('helvetica', 'bold');
      doc.text(edu.degree, 20, yPosition);
      yPosition += 6;

      doc.setFont('helvetica', 'normal');
      doc.text(`${edu.school} - ${edu.year}`, 20, yPosition);
      yPosition += 10;
    });

    // Certifications
    if (data.certifications && data.certifications.length > 0) {
      if (yPosition > 200) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFont('helvetica', 'bold');
      doc.text('Certifications', 20, yPosition);
      yPosition += 10;

      data.certifications.forEach((cert) => {
        doc.setFont('helvetica', 'bold');
        doc.text(cert.name, 20, yPosition);
        yPosition += 6;

        doc.setFont('helvetica', 'normal');
        doc.text(`${cert.issuer} - ${cert.date}`, 20, yPosition);
        yPosition += 6;

        if (cert.credentialId) {
          doc.text(`Credential ID: ${cert.credentialId}`, 20, yPosition);
          yPosition += 6;
        }

        yPosition += 4;
      });
    }

    // Languages
    if (data.languages && data.languages.length > 0) {
      if (yPosition > 200) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFont('helvetica', 'bold');
      doc.text('Languages', 20, yPosition);
      yPosition += 10;

      data.languages.forEach((lang) => {
        doc.setFont('helvetica', 'normal');
        doc.text(`${lang.name}: ${lang.proficiency}`, 20, yPosition);
        yPosition += 6;
      });
    }

    // Save the PDF
    doc.save(`${data.name.replace(' ', '_')}_CV.pdf`);
  };

  return (
    <Button
      onClick={handleDownload}
      size="lg"
      className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-10 py-5 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 rounded-xl"
    >
      Download CV (PDF)
    </Button>
  );
}
