'use client';

import {
  Alert,
  Authenticator,
  Badge,
  Button,
  Card,
  Flex,
  SelectField,
  Text,
} from '@aws-amplify/ui-react';
import { AIConversation } from '@aws-amplify/ui-react-ai';
import { Amplify } from 'aws-amplify';
import {
  Bot,
  Copy,
  Cpu,
  MessageCircle,
  Mic,
  Paperclip,
  RefreshCcw,
  Send,
  Settings,
  Sparkles,
  Zap,
} from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useAIConversation } from '../lib/client';

// Enhanced Chat Bubble Components
interface ChatBubbleProps {
  variant?: 'sent' | 'received';
  className?: string;
  children: React.ReactNode;
}

function ChatBubble({
  variant = 'received',
  className,
  children,
}: ChatBubbleProps) {
  return (
    <div
      className={`flex items-start gap-3 mb-4 ${
        variant === 'sent' ? 'flex-row-reverse' : ''
      } ${className || ''}`}
    >
      {children}
    </div>
  );
}

interface ChatBubbleMessageProps {
  variant?: 'sent' | 'received';
  isLoading?: boolean;
  className?: string;
  children?: React.ReactNode;
}

function ChatBubbleMessage({
  variant = 'received',
  isLoading,
  className,
  children,
}: ChatBubbleMessageProps) {
  return (
    <div
      className={`rounded-2xl p-4 shadow-sm ${
        variant === 'sent'
          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
          : 'bg-white border border-gray-200 text-gray-800'
      } ${className || ''}`}
    >
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
          <div
            className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
            style={{ animationDelay: '0.1s' }}
          ></div>
          <div
            className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
            style={{ animationDelay: '0.2s' }}
          ></div>
        </div>
      ) : (
        children
      )}
    </div>
  );
}

interface ChatBubbleAvatarProps {
  src?: string;
  fallback?: string;
  className?: string;
}

function ChatBubbleAvatar({
  src,
  fallback = 'AI',
  className,
}: ChatBubbleAvatarProps) {
  return (
    <div
      className={`p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex-shrink-0 ${
        className || ''
      }`}
    >
      {src ? (
        <Image
          src={src}
          alt={fallback}
          width={32}
          height={32}
          className="w-8 h-8 rounded-full"
        />
      ) : (
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
          <span className="text-white text-sm font-medium">
            {fallback.slice(0, 2)}
          </span>
        </div>
      )}
    </div>
  );
}

interface ChatBubbleActionProps {
  icon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

function ChatBubbleAction({ icon, onClick, className }: ChatBubbleActionProps) {
  return (
    <button
      onClick={onClick}
      className={`p-2 hover:bg-gray-100 rounded-lg transition-colors ${
        className || ''
      }`}
    >
      {icon}
    </button>
  );
}

interface GeminiModel {
  name: string;
  displayName: string;
  description: string;
  inputTokenLimit: number;
  outputTokenLimit: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const GEMINI_MODELS: GeminiModel[] = [
  {
    name: 'gemini-2.5-flash',
    displayName: 'Gemini 2.5 Flash',
    description: 'Latest fast model with 1M token context',
    inputTokenLimit: 1048576,
    outputTokenLimit: 65536,
    icon: Zap,
    color: 'text-yellow-500',
  },
  {
    name: 'gemini-2.5-pro',
    displayName: 'Gemini 2.5 Pro',
    description: 'Most capable model for complex tasks',
    inputTokenLimit: 1048576,
    outputTokenLimit: 65536,
    icon: Cpu,
    color: 'text-purple-500',
  },
  {
    name: 'gemini-2.0-flash-lite',
    displayName: 'Gemini 2.0 Flash-Lite',
    description: 'Fast and efficient for quick responses',
    inputTokenLimit: 1048576,
    outputTokenLimit: 8192,
    icon: Sparkles,
    color: 'text-blue-500',
  },
];

// Separate component for the AI conversation to avoid conditional hook calls
function AIConversationWrapper() {
  const [
    {
      data: { messages },
      isLoading,
    },
    handleSendMessage,
  ] = useAIConversation('chat');

  return (
    <AIConversation
      messages={messages}
      isLoading={isLoading}
      handleSendMessage={handleSendMessage}
    />
  );
}

// Enhanced Gemini Chat Component
function GeminiChatWrapper({ selectedModel }: { selectedModel: string }) {
  const [messages, setMessages] = useState<
    Array<{ role: 'user' | 'assistant'; content: string; timestamp: Date }>
  >([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const selectedModelInfo = GEMINI_MODELS.find((m) => m.name === selectedModel);
  const IconComponent = selectedModelInfo?.icon || Sparkles;

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      role: 'user' as const,
      content: inputMessage,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      // Simulate API call with typing effect
      setTimeout(() => {
        const assistantMessage = {
          role: 'assistant' as const,
          content: `Hello! I'm ${selectedModelInfo?.displayName} from Google AI Studio. I received your message: "${userMessage.content}". Once the API quota resets, I'll be able to provide intelligent responses using the latest Gemini capabilities! In the meantime, I can help you with general questions about development, technology, and best practices.`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setIsLoading(false);
        setIsTyping(false);
      }, 2000);
    } catch (error) {
      console.error('Gemini API error:', error);
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const regenerateResponse = () => {
    // Simulate regeneration
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === 'assistant') {
      setIsTyping(true);
      setTimeout(() => {
        const newResponse = {
          ...lastMessage,
          content: lastMessage.content + ' (Regenerated response)',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev.slice(0, -1), newResponse]);
        setIsTyping(false);
      }, 1500);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-gradient-to-br from-white via-blue-50/20 to-purple-50/20 rounded-xl border border-gray-200/60 shadow-lg">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200/60 bg-white/80 backdrop-blur-sm rounded-t-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
            <IconComponent className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">
              {selectedModelInfo?.displayName}
            </h3>
            <p className="text-sm text-gray-600">
              {selectedModelInfo?.description}
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-600">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
            <div className="p-6 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full">
              <MessageCircle className="w-12 h-12 text-blue-600" />
            </div>
            <div className="space-y-3 max-w-md">
              <h4 className="text-xl font-medium text-gray-800">
                Start a conversation
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Ask {selectedModelInfo?.displayName} anything about development,
                technology, or get help with your projects.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 justify-center max-w-lg">
              {[
                'How do I optimize React performance?',
                'Explain TypeScript generics',
                'Best practices for API design',
                'Help with AWS deployment',
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setInputMessage(suggestion)}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:bg-gray-50 hover:border-blue-300 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <ChatBubble
              key={index}
              variant={message.role === 'user' ? 'sent' : 'received'}
            >
              {message.role === 'assistant' && (
                <ChatBubbleAvatar fallback="AI" />
              )}

              <div className="flex-1 min-w-0">
                <ChatBubbleMessage
                  variant={message.role === 'user' ? 'sent' : 'received'}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </ChatBubbleMessage>

                {message.role === 'assistant' && (
                  <div className="flex items-center gap-1 mt-2">
                    <ChatBubbleAction
                      icon={<Copy className="w-4 h-4" />}
                      onClick={() => copyToClipboard(message.content)}
                    />
                    <ChatBubbleAction
                      icon={<RefreshCcw className="w-4 h-4" />}
                      onClick={regenerateResponse}
                    />
                  </div>
                )}

                <div
                  className={`text-xs text-gray-500 mt-1 ${
                    message.role === 'user' ? 'text-right' : 'text-left'
                  }`}
                >
                  {formatTime(message.timestamp)}
                </div>
              </div>

              {message.role === 'user' && <ChatBubbleAvatar fallback="US" />}
            </ChatBubble>
          ))
        )}

        {/* Enhanced Typing Indicator */}
        {isTyping && (
          <ChatBubble variant="received">
            <ChatBubbleAvatar fallback="AI" />
            <div className="flex-1">
              <ChatBubbleMessage isLoading />
            </div>
          </ChatBubble>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200/60 bg-white/80 backdrop-blur-sm rounded-b-xl">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Ask ${selectedModelInfo?.displayName} anything...`}
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={1}
              disabled={isLoading}
              style={{ minHeight: '48px', maxHeight: '120px' }}
            />
            <button
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
              title="Attach file"
            >
              <Paperclip className="w-4 h-4" />
            </button>
          </div>

          <div className="flex gap-2">
            <button
              className="p-3 text-gray-400 hover:text-gray-600 transition-colors border border-gray-300 rounded-xl hover:bg-gray-50"
              title="Voice input"
              disabled={isLoading}
            >
              <Mic className="w-4 h-4" />
            </button>

            <button
              onClick={handleSendMessage}
              disabled={isLoading || !inputMessage.trim()}
              className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
          <span>Press Enter to send, Shift+Enter for new line</span>
          <span>{inputMessage.length} characters</span>
        </div>
      </div>
    </div>
  );
}

export default function AIChat() {
  const [isClient, setIsClient] = useState(false);
  const [isAmplifyReady, setIsAmplifyReady] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gemini-2.5-flash');
  const [activeTab, setActiveTab] = useState('aws');

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsClient(true);

    // Check if Amplify is configured
    const checkAmplify = () => {
      try {
        Amplify.getConfig();
        setIsAmplifyReady(true);
      } catch {
        setTimeout(checkAmplify, 100);
      }
    };

    checkAmplify();
  }, []);

  const selectedModelInfo = GEMINI_MODELS.find((m) => m.name === selectedModel);

  if (!isClient || !isAmplifyReady) {
    return (
      <div className="py-16 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/60">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Loading AI Assistant
              </h2>
              <p className="text-gray-600">
                Initializing your AI chat experience...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Assistant
              </h2>
              <p className="text-gray-600 mt-1">
                Chat with advanced AI models powered by AWS and Google
              </p>
            </div>
          </div>

          <Alert
            variation="info"
            className="bg-blue-50 border-blue-200 rounded-xl shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <Sparkles className="w-4 h-4 text-blue-600" />
              </div>
              <Text className="text-sm text-blue-800">
                <strong>🚀 Enhanced:</strong> Now featuring Google Gemini 2.5
                models with advanced conversational AI capabilities
              </Text>
            </div>
          </Alert>
        </div>

        {/* Model Selection for Gemini */}
        {activeTab === 'gemini' && (
          <Card className="mb-6 border border-gray-200/60 bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <Flex direction="column" gap="medium">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
                  <Settings className="w-5 h-5 text-white" />
                </div>
                <div>
                  <Text fontWeight="semibold" className="text-gray-800 text-lg">
                    Google Gemini Model Selection
                  </Text>
                  <Text className="text-gray-600 text-sm">
                    Choose your AI assistant for the conversation
                  </Text>
                </div>
              </div>

              <SelectField
                label=""
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                variation="quiet"
                size="large"
                className="border-gray-300 focus:border-blue-500"
              >
                {GEMINI_MODELS.map((model) => (
                  <option key={model.name} value={model.name}>
                    {model.displayName} - {model.description}
                  </option>
                ))}
              </SelectField>

              {/* Model Info Display */}
              {selectedModelInfo && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-100 shadow-sm">
                  <Flex direction="column" gap="small">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-3 bg-gradient-to-r ${selectedModelInfo.color
                          .replace('text-', 'from-')
                          .replace('-500', '-500 to-')
                          .replace('-500', '-600')} rounded-full`}
                      >
                        <selectedModelInfo.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <Text
                          fontWeight="bold"
                          className="text-gray-800 text-lg"
                        >
                          {selectedModelInfo.displayName}
                        </Text>
                        <Text className="text-gray-600">
                          {selectedModelInfo.description}
                        </Text>
                      </div>
                    </div>
                    <Flex gap="small" wrap="wrap" className="mt-3">
                      <Badge
                        variation="info"
                        className="text-xs bg-blue-100 text-blue-800 border-blue-200 font-medium px-3 py-1"
                      >
                        Context:{' '}
                        {(selectedModelInfo.inputTokenLimit / 1000).toFixed(0)}K
                        tokens
                      </Badge>
                      <Badge
                        variation="success"
                        className="text-xs bg-green-100 text-green-800 border-green-200 font-medium px-3 py-1"
                      >
                        Response:{' '}
                        {(selectedModelInfo.outputTokenLimit / 1000).toFixed(0)}
                        K tokens
                      </Badge>
                    </Flex>
                  </Flex>
                </div>
              )}
            </Flex>
          </Card>
        )}

        {/* Provider Selection */}
        <div className="flex justify-center gap-4 mb-8">
          <Button
            onClick={() => setActiveTab('aws')}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-3 ${
              activeTab === 'aws'
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg transform scale-105'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:shadow-md'
            }`}
          >
            <Bot className="w-5 h-5" />
            <div className="text-left">
              <div className="font-semibold">AWS Amplify AI</div>
              <div className="text-xs opacity-80">
                Cloud-powered conversations
              </div>
            </div>
          </Button>
          <Button
            onClick={() => setActiveTab('gemini')}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-3 ${
              activeTab === 'gemini'
                ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg transform scale-105'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:shadow-md'
            }`}
          >
            {selectedModelInfo?.icon && (
              <selectedModelInfo.icon className="w-5 h-5" />
            )}
            <div className="text-left">
              <div className="font-semibold">Google Gemini AI</div>
              <div className="text-xs opacity-80">Advanced AI models</div>
            </div>
          </Button>
        </div>

        {/* Chat Interface */}
        {activeTab === 'aws' && (
          <Authenticator>
            <AIConversationWrapper />
          </Authenticator>
        )}

        {activeTab === 'gemini' && (
          <GeminiChatWrapper selectedModel={selectedModel} />
        )}

        {/* Footer Note */}
        {activeTab === 'gemini' && (
          <div className="mt-6 text-center">
            <Alert
              variation="warning"
              className="bg-yellow-50 border-yellow-200 rounded-xl inline-block"
            >
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">!</span>
                </div>
                <Text fontSize="xs" className="text-yellow-800">
                  <strong>Note:</strong> Gemini chat is currently in demo mode.
                  Full functionality will be available once API quota resets.
                </Text>
              </div>
            </Alert>
          </div>
        )}
      </div>
    </div>
  );
}
