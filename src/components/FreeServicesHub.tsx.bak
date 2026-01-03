'use client';

import * as React from 'react';
import { Flex, Card, Heading, Text, Button, Badge, Alert, View, Grid } from '@aws-amplify/ui-react';
import { useAIGeneration } from "../lib/client";

interface FreeService {
  name: string;
  description: string;
  category: 'ai' | 'development' | 'deployment' | 'analysis' | 'design';
  provider: string;
  isActive: boolean;
  freeTier: string;
  tools: string[];
}

const FREE_SERVICES: FreeService[] = [
  // AI Services (Free Tiers)
  {
    name: "AWS Amplify AI",
    description: "Conversational AI and content generation with 1,000 free requests/month",
    category: 'ai',
    provider: 'Amazon Web Services',
    isActive: true,
    freeTier: '1,000 requests/month',
    tools: ['Chat', 'Content Generation', 'Q&A']
  },
  {
    name: "Google Gemini AI Studio",
    description: "Access to Gemini models with free tier for model info and limited generation",
    category: 'ai',
    provider: 'Google',
    isActive: true,
    freeTier: 'Free model listing & info, limited generation',
    tools: ['Model Info', 'Limited Text Generation', 'Model Comparison']
  },
  {
    name: "Documentation AI",
    description: "AI-powered document processing and knowledge base management",
    category: 'ai',
    provider: 'Portfolio MCP',
    isActive: true,
    freeTier: 'Unlimited document processing',
    tools: ['Document Search', 'Content Extraction', 'Knowledge Base']
  },

  // Development Tools (Free)
  {
    name: "Next.js DevTools",
    description: "Enhanced Next.js development experience with debugging and optimization",
    category: 'development',
    provider: 'Vercel',
    isActive: true,
    freeTier: 'Full development features',
    tools: ['Error Monitoring', 'Performance Analysis', 'Build Optimization']
  },
  {
    name: "Playwright Testing",
    description: "End-to-end testing framework for web applications",
    category: 'development',
    provider: 'Microsoft',
    isActive: true,
    freeTier: 'Complete testing suite',
    tools: ['E2E Testing', 'Screenshot Testing', 'API Testing']
  },

  // Deployment & Hosting (Free Tiers)
  {
    name: "AWS Amplify Hosting",
    description: "Static website hosting with CDN, SSL, and continuous deployment",
    category: 'deployment',
    provider: 'Amazon Web Services',
    isActive: true,
    freeTier: '5GB storage, 5GB data transfer',
    tools: ['CDN Hosting', 'SSL Certificates', 'Auto Deployment']
  },

  // Analysis & Monitoring (Free Tiers)
  {
    name: "Google Analytics",
    description: "Website analytics and user behavior tracking",
    category: 'analysis',
    provider: 'Google',
    isActive: false,
    freeTier: '10M hits/month',
    tools: ['Traffic Analysis', 'User Behavior', 'Conversion Tracking']
  },
  {
    name: "AWS CloudWatch",
    description: "Monitoring and logging for applications and infrastructure",
    category: 'analysis',
    provider: 'Amazon Web Services',
    isActive: true,
    freeTier: 'Free tier metrics',
    tools: ['Error Monitoring', 'Performance Metrics', 'Log Analysis']
  },

  // Design Tools (Free)
  {
    name: "Figma Developer MCP",
    description: "Access to Figma design files and collaborative features",
    category: 'design',
    provider: 'Figma',
    isActive: true,
    freeTier: 'Free tier access',
    tools: ['Design File Access', 'Component Libraries', 'Prototyping']
  }
];

const CATEGORY_COLORS = {
  ai: 'blue',
  development: 'green',
  deployment: 'purple',
  analysis: 'orange',
  design: 'pink'
};

export default function FreeServicesHub() {
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  const [expandedService, setExpandedService] = React.useState<string | null>(null);

  const [{ data, isLoading }, generateServiceDemo] =
    useAIGeneration("generateProjectIdea");

  const filteredServices = selectedCategory === 'all'
    ? FREE_SERVICES
    : FREE_SERVICES.filter(service => service.category === selectedCategory);

  const handleServiceDemo = async (service: FreeService) => {
    if (service.category === 'ai' && service.name === 'AWS Amplify AI') {
      generateServiceDemo({
        technologies: 'React, Next.js, AWS Amplify',
        category: 'web application'
      });
    }
  };

  const getCategoryStats = () => {
    const categories = ['ai', 'development', 'deployment', 'analysis', 'design'];
    return categories.map(category => ({
      name: category,
      count: FREE_SERVICES.filter(s => s.category === category).length,
      active: FREE_SERVICES.filter(s => s.category === category && s.isActive).length
    }));
  };

  return (
    <div className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Heading level={1} className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            🚀 Free Services Hub
          </Heading>
          <Text className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Maximize your portfolio with all available free services and tools.
            Integrated AI, development tools, hosting, and analytics - all at no cost.
          </Text>
        </div>

        {/* Stats Overview */}
        <Card className="mb-8">
          <Heading level={3} className="mb-4">📊 Services Overview</Heading>
          <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap="1rem">
            {getCategoryStats().map(stat => (
              <Card key={stat.name} variation="outlined" className="text-center">
                <Text className="font-semibold capitalize text-lg">{stat.name}</Text>
                <Text className="text-2xl font-bold text-blue-600">{stat.count}</Text>
                <Text className="text-sm text-green-600">{stat.active} active</Text>
              </Card>
            ))}
          </Grid>
        </Card>

        {/* Category Filter */}
        <Flex justifyContent="center" gap="small" className="mb-8 flex-wrap">
          <Button
            onClick={() => setSelectedCategory('all')}
            className={selectedCategory === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}
          >
            All Services ({FREE_SERVICES.length})
          </Button>
          {Object.keys(CATEGORY_COLORS).map(category => (
            <Button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)} ({FREE_SERVICES.filter(s => s.category === category).length})
            </Button>
          ))}
        </Flex>

        {/* Services Grid */}
        <Grid templateColumns="repeat(auto-fit, minmax(400px, 1fr))" gap="1.5rem">
          {filteredServices.map(service => (
            <Card key={service.name} className="hover:shadow-lg transition-shadow">
              <Flex direction="column" gap="medium">
                {/* Header */}
                <Flex justifyContent="space-between" alignItems="flex-start">
                  <div>
                    <Heading level={4} className="mb-2">{service.name}</Heading>
                    <Badge
                      variation={service.isActive ? 'success' : 'warning'}
                      size="small"
                    >
                      {service.isActive ? 'Active' : 'Available'}
                    </Badge>
                  </div>
                  <Badge
                    variation="info"
                    className={`bg-${CATEGORY_COLORS[service.category]}-100 text-${CATEGORY_COLORS[service.category]}-800`}
                  >
                    {service.category}
                  </Badge>
                </Flex>

                {/* Description */}
                <Text className="text-gray-600 dark:text-gray-300">
                  {service.description}
                </Text>

                {/* Provider & Free Tier */}
                <Flex justifyContent="space-between" className="text-sm">
                  <Text><strong>Provider:</strong> {service.provider}</Text>
                  <Text><strong>Free Tier:</strong> {service.freeTier}</Text>
                </Flex>

                {/* Tools */}
                <div>
                  <Text className="font-semibold mb-2">🛠️ Available Tools:</Text>
                  <Flex gap="small" wrap="wrap">
                    {service.tools.map(tool => (
                      <Badge key={tool} variation="info" size="small">
                        {tool}
                      </Badge>
                    ))}
                  </Flex>
                </div>

                {/* Actions */}
                <Flex gap="small" marginTop="auto">
                  <Button
                    onClick={() => setExpandedService(
                      expandedService === service.name ? null : service.name
                    )}
                    variation="link"
                    size="small"
                  >
                    {expandedService === service.name ? '🔽 Less Info' : '▶️ More Info'}
                  </Button>

                  {service.isActive && service.category === 'ai' && (
                    <Button
                      onClick={() => handleServiceDemo(service)}
                      variation="primary"
                      size="small"
                      isDisabled={isLoading}
                    >
                      🚀 Try Demo
                    </Button>
                  )}
                </Flex>

                {/* Expanded Info */}
                {expandedService === service.name && (
                  <Card variation="outlined" className="mt-4">
                    <Heading level={5} className="mb-3">📋 Detailed Information</Heading>

                    <div className="space-y-3">
                      <div>
                        <Text className="font-semibold">Service Status:</Text>
                        <Text className={`ml-2 ${service.isActive ? 'text-green-600' : 'text-yellow-600'}`}>
                          {service.isActive ? '✅ Active & Ready to Use' : '⚠️ Available but Not Configured'}
                        </Text>
                      </div>

                      <div>
                        <Text className="font-semibold">Integration:</Text>
                        <Text className="ml-2 text-gray-600">
                          {service.isActive ? 'Fully integrated into your portfolio' : 'Requires additional setup'}
                        </Text>
                      </div>

                      {service.category === 'ai' && (
                        <Alert variation="info">
                          <Text>
                            <strong>AI Integration:</strong> This service is connected to your AI components
                            and provides enhanced capabilities for content generation and user interaction.
                          </Text>
                        </Alert>
                      )}

                      {service.category === 'deployment' && (
                        <Alert variation="success">
                          <Text>
                            <strong>Hosting Ready:</strong> Your portfolio is deployed and optimized using this service.
                          </Text>
                        </Alert>
                      )}
                    </div>
                  </Card>
                )}
              </Flex>
            </Card>
          ))}
        </Grid>

        {/* Demo Results */}
        {data && (
          <Card className="mt-8">
            <Heading level={3} className="mb-4">🎯 AI Demo Result</Heading>
            <Text fontWeight="bold">{data.title}</Text>
            <Text>{data.description}</Text>
            <Text fontWeight="bold" className="mt-3">Technologies:</Text>
            <View as="ul" className="mt-2">
              {data.technologies?.filter((tech: string | null): tech is string => tech !== null).map((tech: string) => (
                <View as="li" key={tech} className="ml-4">• {tech}</View>
              ))}
            </View>
            <Text className="mt-3"><strong>Complexity:</strong> {data.complexity}</Text>
          </Card>
        )}

        {/* Footer */}
        <Card className="mt-12 text-center">
          <Heading level={3} className="mb-4">💡 Getting Started</Heading>
          <Text className="mb-6">
            All these services are integrated and ready to use in your portfolio.
            Explore the different categories to discover how each service can enhance your project.
          </Text>

          <Alert variation="success">
            <Text>
              <strong>🎉 Total Value:</strong> You are leveraging ${' '}
              <span className="font-bold text-green-600">
                {Math.round(FREE_SERVICES.filter(s => s.isActive).length * 50)}
              </span>
              &nbsp;worth of services completely free!
            </Text>
          </Alert>
        </Card>
      </div>
    </div>
  );
}
