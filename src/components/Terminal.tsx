"use client";
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
    'Experience: 5+ years | Projects: 50+ completed'
  ];

  const terminalCommands = commands.length > 0 ? commands : defaultCommands;

  useEffect(() => {
    if (currentCommand < terminalCommands.length) {
      const command = terminalCommands[currentCommand];
      let charIndex = 0;

      const typeInterval = setInterval(() => {
        if (charIndex < command.length) {
          setDisplayedText(prev => prev + command[charIndex]);
          charIndex++;
        } else {
          clearInterval(typeInterval);
          setTimeout(() => {
            setDisplayedText(prev => prev + '\n');
            setCurrentCommand(prev => prev + 1);
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
    <div className={`bg-gray-900 rounded-lg shadow-2xl border border-gray-700 overflow-hidden ${className}`}>
      {/* Terminal Header */}
      <div className="bg-gray-800 px-4 py-3 flex items-center space-x-2">
        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        <span className="text-gray-400 text-sm ml-4 font-mono">themis@portfolio:~$</span>
      </div>

      {/* Terminal Content */}
      <div className="p-6 font-mono text-sm text-green-400 min-h-[300px]">
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
          <span className="ml-2 text-green-400 animate-pulse">_</span>
        </div>
      </div>
    </div>
  );
}