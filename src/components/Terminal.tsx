'use client';
import { useState, useEffect } from 'react';

interface TerminalProps {
  commands?: string[];
  className?: string;
}

export default function Terminal({ commands = [], className = '' }: TerminalProps) {
  const [currentCommand, setCurrentCommand] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  const defaultCommands = [
    'npm install portfolio-skills',
    'git clone https://github.com/themis128/my-portfolio-aws.git',
    'cd my-portfolio-aws && npm run dev',
    '🚀 Portfolio running on http://localhost:3000',
    'Full-Stack Developer | Cloud Solutions Expert',
    'Specialized in React, Next.js, AWS, Node.js',
    'Experience: 5+ years | Projects: 50+ completed',
  ];

  const terminalCommands = commands.length > 0 ? commands : defaultCommands;

  useEffect(() => {
    if (currentCommand < terminalCommands.length) {
      const command = terminalCommands[currentCommand];
      let charIndex = 0;

      const typeInterval = setInterval(() => {
        if (charIndex < command.length) {
          setDisplayedText((prev) => prev + command[charIndex]);
          charIndex++;
        } else {
          clearInterval(typeInterval);
          setTimeout(() => {
            setDisplayedText((prev) => prev + '\n');
            setCurrentCommand((prev) => prev + 1);
            setIsTyping(true);
          }, 1000);
        }
      }, 50);

      return () => clearInterval(typeInterval);
    } else {
      setIsTyping(false);
    }
  }, [currentCommand, terminalCommands]);

  return (
    <div
      className={`overflow-hidden rounded-lg border border-gray-700 bg-gray-900 shadow-2xl ${className}`}
    >
      {/* Terminal Header */}
      <div className="flex items-center space-x-2 bg-gray-800 px-4 py-3">
        <div className="h-3 w-3 rounded-full bg-red-500" />
        <div className="h-3 w-3 rounded-full bg-yellow-500" />
        <div className="h-3 w-3 rounded-full bg-green-500" />
        <span className="ml-4 font-mono text-sm text-gray-400">themis@portfolio:~$</span>
      </div>

      {/* Terminal Content */}
      <div className="min-h-[300px] p-6 font-mono text-sm text-green-400">
        <div className="whitespace-pre-wrap">
          {displayedText}
          {isTyping && currentCommand < terminalCommands.length && (
            <span className="animate-pulse">|</span>
          )}
        </div>

        {/* Static terminal prompt */}
        <div className="mt-4 flex items-center">
          <span className="text-blue-400">themis@portfolio</span>
          <span className="text-gray-400">:</span>
          <span className="text-yellow-400">~</span>
          <span className="text-gray-400">$</span>
          <span className="ml-2 animate-pulse text-green-400">_</span>
        </div>
      </div>
    </div>
  );
}
