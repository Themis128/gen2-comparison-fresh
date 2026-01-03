'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  Check,
  Code,
  Copy,
  Download,
  FileText,
  Image as ImageIcon,
  Loader2,
  Play,
  RefreshCw,
  Sparkles,
  Wand2,
  Zap,
} from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Textarea } from './ui/textarea';

import { cn } from '@/lib/utils';

interface Model {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

interface GenerationResult {
  id: string;
  title: string;
  content: string;
  type: 'code' | 'text' | 'image';
  timestamp: Date;
  model: string;
}

const models: Model[] = [
  {
    id: 'gpt-4',
    name: 'GPT-4',
    description: 'Most capable model for complex tasks',
    icon: <Sparkles className="w-4 h-4" />,
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'claude-3',
    name: 'Claude 3',
    description: 'Advanced reasoning and analysis',
    icon: <Wand2 className="w-4 h-4" />,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'codex',
    name: 'Codex',
    description: 'Fast and efficient for code generation',
    icon: <Code className="w-4 h-4" />,
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: 'dall-e',
    name: 'DALL-E 3',
    description: 'Advanced image generation capabilities',
    icon: <ImageIcon className="w-4 h-4" />,
    color: 'from-orange-500 to-red-500',
  },
];

const AIProjectGenerator: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState<string>(models[0].id);
  const [projectName, setProjectName] = useState<string>('');
  const [projectDescription, setProjectDescription] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [results, setResults] = useState<GenerationResult[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [advancedMode, setAdvancedMode] = useState<boolean>(false);
  const [temperature, setTemperature] = useState<string>('0.7');
  const [maxTokens, setMaxTokens] = useState<string>('2000');
  const [errors, setErrors] = useState<{
    projectName?: string;
    projectDescription?: string;
  }>({});
  const [successMessage, setSuccessMessage] = useState<string>('');

  const selectedModelData = models.find((m) => m.id === selectedModel);

  // Load saved preferences on mount
  useEffect(() => {
    const savedModel = localStorage.getItem('ai-generator-selected-model');
    const savedAdvanced = localStorage.getItem('ai-generator-advanced-mode');
    const savedTemp = localStorage.getItem('ai-generator-temperature');
    const savedTokens = localStorage.getItem('ai-generator-max-tokens');

    if (savedModel && models.find((m) => m.id === savedModel)) {
      setSelectedModel(savedModel);
    }
    if (savedAdvanced) {
      setAdvancedMode(savedAdvanced === 'true');
    }
    if (savedTemp) {
      setTemperature(savedTemp);
    }
    if (savedTokens) {
      setMaxTokens(savedTokens);
    }
  }, []);

  // Save preferences when they change
  useEffect(() => {
    localStorage.setItem('ai-generator-selected-model', selectedModel);
  }, [selectedModel]);

  useEffect(() => {
    localStorage.setItem('ai-generator-advanced-mode', advancedMode.toString());
  }, [advancedMode]);

  useEffect(() => {
    localStorage.setItem('ai-generator-temperature', temperature);
  }, [temperature]);

  useEffect(() => {
    localStorage.setItem('ai-generator-max-tokens', maxTokens);
  }, [maxTokens]);

  const validateForm = useCallback((): boolean => {
    const newErrors: { projectName?: string; projectDescription?: string } = {};

    if (!projectName.trim()) {
      newErrors.projectName = 'Project name is required';
    } else if (projectName.length < 3) {
      newErrors.projectName = 'Project name must be at least 3 characters';
    }

    if (!projectDescription.trim()) {
      newErrors.projectDescription = 'Project description is required';
    } else if (projectDescription.length < 10) {
      newErrors.projectDescription =
        'Description must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [projectName, projectDescription]);

  const handleGenerate = useCallback(async () => {
    // Validate form first
    if (!validateForm()) return;

    // Check if required fields are filled
    if (!projectName.trim() || !projectDescription.trim()) {
      setErrors({
        projectName: projectName.trim()
          ? undefined
          : 'Project name is required',
        projectDescription: projectDescription.trim()
          ? undefined
          : 'Project description is required',
      });
      return;
    }

    setIsGenerating(true);
    setErrors({});

    try {
      const response = await fetch('/api/generate-project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectName,
          projectDescription,
          model: selectedModel,
          temperature: parseFloat(temperature),
          maxTokens: parseInt(maxTokens),
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();

      const newResult: GenerationResult = {
        id: Date.now().toString(),
        title: projectName,
        content: data.content,
        type: 'code',
        timestamp: new Date(),
        model: selectedModelData?.name || 'Unknown',
      };

      setResults((prev) => [newResult, ...prev]);
      setSuccessMessage('Project generated successfully!');

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Generation failed:', error);
      setErrors({
        projectDescription: 'Failed to generate project. Please try again.',
      });
    } finally {
      setIsGenerating(false);
    }
  }, [
    projectName,
    projectDescription,
    selectedModel,
    temperature,
    maxTokens,
    selectedModelData,
    validateForm,
  ]);

  const handleCopy = useCallback(async (id: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = content;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  }, []);

  const handleDownload = useCallback((result: GenerationResult) => {
    const blob = new Blob([result.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.title.replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 'Enter':
            if (
              !isGenerating &&
              projectName.trim() &&
              projectDescription.trim()
            ) {
              event.preventDefault();
              handleGenerate();
            }
            break;
          case '/':
            event.preventDefault();
            setAdvancedMode((prev) => !prev);
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isGenerating, projectName, projectDescription, handleGenerate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2 mb-8"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Zap className="w-8 h-8 text-yellow-500" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              AI Project Generator
            </h1>
          </div>
          <p className="text-slate-400">
            Create amazing projects with AI-powered generation
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-6"
          >
            <Card className="bg-slate-900/50 border-slate-800 p-6 backdrop-blur-sm">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-slate-300 mb-3 block">
                    Select AI Model
                  </Label>
                  <div className="space-y-2">
                    {models.map((model) => (
                      <motion.button
                        key={model.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedModel(model.id)}
                        className={cn(
                          'w-full p-4 rounded-lg border-2 transition-all text-left',
                          selectedModel === model.id
                            ? 'border-blue-500 bg-blue-500/10'
                            : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={cn(
                              'p-2 rounded-lg bg-gradient-to-br',
                              model.color
                            )}
                          >
                            {model.icon}
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-white">
                              {model.name}
                            </div>
                            <div className="text-xs text-slate-400 mt-1">
                              {model.description}
                            </div>
                          </div>
                          {selectedModel === model.id && (
                            <Check className="w-5 h-5 text-blue-500" />
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800">
                  <div className="flex items-center justify-between mb-4">
                    <Label className="text-sm font-medium text-slate-300">
                      Advanced Settings
                    </Label>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">
                        Press Ctrl+/ to toggle
                      </span>
                      <Switch
                        checked={advancedMode}
                        onCheckedChange={setAdvancedMode}
                        aria-label="Toggle advanced settings"
                      />
                    </div>
                  </div>
                  <AnimatePresence>
                    {advancedMode && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4"
                      >
                        <div>
                          <Label className="text-xs text-slate-400 mb-2 block">
                            Temperature: {temperature}
                          </Label>
                          <Input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={temperature}
                            onChange={(e) => setTemperature(e.target.value)}
                            className="w-full"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-slate-400 mb-2 block">
                            Max Tokens
                          </Label>
                          <Input
                            type="number"
                            value={maxTokens}
                            onChange={(e) => setMaxTokens(e.target.value)}
                            className="bg-slate-800 border-slate-700 text-white"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            <Card className="bg-slate-900/50 border-slate-800 p-6 backdrop-blur-sm">
              <div className="space-y-4">
                {successMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-green-500/10 border border-green-500/20 rounded-lg p-3"
                  >
                    <p className="text-green-400 text-sm text-center">
                      {successMessage}
                    </p>
                  </motion.div>
                )}
                <div>
                  <Label
                    htmlFor="project-name"
                    className="text-sm font-medium text-slate-300 mb-2 block"
                  >
                    Project Name
                  </Label>
                  <Input
                    id="project-name"
                    placeholder="Enter your project name..."
                    value={projectName}
                    onChange={(e) => {
                      setProjectName(e.target.value);
                      if (errors.projectName) {
                        setErrors((prev) => ({
                          ...prev,
                          projectName: undefined,
                        }));
                      }
                    }}
                    className={cn(
                      'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500',
                      errors.projectName &&
                        'border-red-500 focus-visible:ring-red-500'
                    )}
                    aria-describedby={
                      errors.projectName ? 'project-name-error' : undefined
                    }
                    aria-invalid={!!errors.projectName}
                  />
                  {errors.projectName && (
                    <p
                      id="project-name-error"
                      className="text-red-400 text-xs mt-1"
                      role="alert"
                    >
                      {errors.projectName}
                    </p>
                  )}
                </div>

                <div>
                  <Label
                    htmlFor="project-description"
                    className="text-sm font-medium text-slate-300 mb-2 block"
                  >
                    Project Description
                  </Label>
                  <Textarea
                    id="project-description"
                    placeholder="Describe what you want to build..."
                    value={projectDescription}
                    onChange={(e) => {
                      setProjectDescription(e.target.value);
                      if (errors.projectDescription) {
                        setErrors((prev) => ({
                          ...prev,
                          projectDescription: undefined,
                        }));
                      }
                    }}
                    className={cn(
                      'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 min-h-[120px]',
                      errors.projectDescription &&
                        'border-red-500 focus-visible:ring-red-500'
                    )}
                    aria-describedby={
                      errors.projectDescription
                        ? 'project-description-error'
                        : undefined
                    }
                    aria-invalid={!!errors.projectDescription}
                  />
                  {errors.projectDescription && (
                    <p
                      id="project-description-error"
                      className="text-red-400 text-xs mt-1"
                      role="alert"
                    >
                      {errors.projectDescription}
                    </p>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
                    aria-label="Generate project with AI"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2
                          className="w-4 h-4 mr-2 animate-spin"
                          aria-hidden="true"
                        />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" aria-hidden="true" />
                        Generate Project
                        <span className="ml-2 text-xs opacity-75">
                          (Ctrl+Enter)
                        </span>
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setProjectName('');
                      setProjectDescription('');
                      setErrors({});
                    }}
                    className="border-slate-700 hover:bg-slate-800"
                    aria-label="Clear all fields"
                  >
                    <RefreshCw className="w-4 h-4" aria-hidden="true" />
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">
                    Generated Results
                  </CardTitle>
                  <Badge
                    variant="secondary"
                    className="bg-slate-800 text-slate-300"
                  >
                    {results.length}{' '}
                    {results.length === 1 ? 'Result' : 'Results'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {isGenerating && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-slate-800/50 rounded-lg border border-slate-700 overflow-hidden"
                    >
                      <div className="p-4 border-b border-slate-700">
                        <div className="animate-pulse">
                          <div className="h-4 bg-slate-700 rounded w-1/3 mb-2"></div>
                          <div className="h-3 bg-slate-700 rounded w-1/4"></div>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="animate-pulse space-y-2">
                          <div className="h-3 bg-slate-700 rounded"></div>
                          <div className="h-3 bg-slate-700 rounded w-5/6"></div>
                          <div className="h-3 bg-slate-700 rounded w-4/6"></div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <AnimatePresence mode="popLayout">
                    {results.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12 text-slate-500"
                      >
                        <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No results yet. Generate your first project!</p>
                      </motion.div>
                    ) : (
                      results.map((result) => (
                        <motion.div
                          key={result.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="bg-slate-800/50 rounded-lg border border-slate-700 overflow-hidden"
                        >
                          <div className="p-4 border-b border-slate-700">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="font-semibold text-white mb-1">
                                  {result.title}
                                </h3>
                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                  <Badge
                                    variant="outline"
                                    className="border-slate-600 text-slate-300"
                                  >
                                    {result.model}
                                  </Badge>
                                  <span>•</span>
                                  <span>
                                    {result.timestamp.toLocaleTimeString()}
                                  </span>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() =>
                                    handleCopy(result.id, result.content)
                                  }
                                  className="hover:bg-slate-700"
                                >
                                  {copiedId === result.id ? (
                                    <Check className="w-4 h-4 text-green-500" />
                                  ) : (
                                    <Copy className="w-4 h-4" />
                                  )}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleDownload(result)}
                                  className="hover:bg-slate-700"
                                >
                                  <Download className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                          <div className="p-4">
                            <pre className="text-xs text-slate-300 whitespace-pre-wrap font-mono bg-slate-900/50 p-4 rounded overflow-x-auto">
                              {result.content}
                            </pre>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AIProjectGenerator;
