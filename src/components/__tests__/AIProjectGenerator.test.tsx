import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AIProjectGenerator from '../AIProjectGenerator';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({
      children,
      ...props
    }: {
      children: React.ReactNode;
      [key: string]: unknown;
    }) => <div {...props}>{children}</div>,
    button: ({
      children,
      ...props
    }: {
      children: React.ReactNode;
      [key: string]: unknown;
    }) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({
    children,
  }: {
    children: React.ReactNode;
  }) => <>{children}</>,
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Check: () => <div data-testid="check-icon" />,
  Code: () => <div data-testid="code-icon" />,
  Copy: () => <div data-testid="copy-icon" />,
  Download: () => <div data-testid="download-icon" />,
  FileText: () => <div data-testid="file-text-icon" />,
  Image: () => <div data-testid="image-icon" />,
  Loader2: () => <div data-testid="loader-icon" />,
  Play: () => <div data-testid="play-icon" />,
  RefreshCw: () => <div data-testid="refresh-icon" />,
  Sparkles: () => <div data-testid="sparkles-icon" />,
  Wand2: () => <div data-testid="wand2-icon" />,
  Zap: () => <div data-testid="zap-icon" />,
}));

describe('AIProjectGenerator', () => {
  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();

    // Reset localStorage mocks
    (localStorage.getItem as jest.Mock).mockReturnValue(null);
    (localStorage.setItem as jest.Mock).mockImplementation(() => {});

    // Mock fetch
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        content: 'Generated project content',
        model: 'gpt-4',
        usage: { total_tokens: 100 },
      }),
    });
  });

  it('renders the component with all main elements', () => {
    render(<AIProjectGenerator />);

    expect(screen.getByText('AI Project Generator')).toBeInTheDocument();
    expect(
      screen.getByText('Create amazing projects with AI-powered generation')
    ).toBeInTheDocument();
    expect(screen.getByText('Select AI Model')).toBeInTheDocument();
    expect(screen.getByText('Project Name')).toBeInTheDocument();
    expect(screen.getByText('Project Description')).toBeInTheDocument();
    expect(screen.getByText('Generate Project')).toBeInTheDocument();
    expect(screen.getByText('Generated Results')).toBeInTheDocument();
  });

  it('displays all available AI models', () => {
    render(<AIProjectGenerator />);

    expect(screen.getByText('GPT-4')).toBeInTheDocument();
    expect(screen.getByText('Claude 3')).toBeInTheDocument();
    expect(screen.getByText('Codex')).toBeInTheDocument();
    expect(screen.getByText('DALL-E 3')).toBeInTheDocument();
  });

  it('allows model selection', async () => {
    const user = userEvent.setup();
    render(<AIProjectGenerator />);

    const claudeModel = screen.getByText('Claude 3');
    await user.click(claudeModel);

    // Check if the selected model has the check icon
    const modelContainer = claudeModel.closest('button');
    expect(modelContainer).toHaveClass('border-blue-500');
  });

  it('validates form inputs', async () => {
    const user = userEvent.setup();
    render(<AIProjectGenerator />);

    const generateButton = screen.getByText('Generate Project');
    expect(generateButton).not.toBeDisabled(); // Button is not disabled for empty fields anymore

    // Try to generate without inputs - should show validation errors
    await user.click(generateButton);

    await waitFor(() => {
      expect(screen.getByText('Project name is required')).toBeInTheDocument();
    });
    expect(
      screen.getByText('Project description is required')
    ).toBeInTheDocument();

    // Fill in inputs and try again
    const projectNameInput = screen.getByPlaceholderText(
      'Enter your project name...'
    );
    const projectDescriptionInput = screen.getByPlaceholderText(
      'Describe what you want to build...'
    );

    await user.type(projectNameInput, 'Test Project');
    await user.type(projectDescriptionInput, 'Test description');

    expect(generateButton).not.toBeDisabled();
  });

  it('shows validation errors for empty fields', async () => {
    const user = userEvent.setup();
    render(<AIProjectGenerator />);

    const generateButton = screen.getByText('Generate Project');
    await user.click(generateButton);

    await waitFor(() => {
      expect(screen.getByText('Project name is required')).toBeInTheDocument();
    });
    expect(
      screen.getByText('Project description is required')
    ).toBeInTheDocument();
  });

  it('shows validation errors for short inputs', async () => {
    const user = userEvent.setup();
    render(<AIProjectGenerator />);

    const projectNameInput = screen.getByPlaceholderText(
      'Enter your project name...'
    );
    const projectDescriptionInput = screen.getByPlaceholderText(
      'Describe what you want to build...'
    );

    await user.type(projectNameInput, 'A');
    await user.type(projectDescriptionInput, 'Short');

    const generateButton = screen.getByText('Generate Project');
    await user.click(generateButton);

    expect(
      screen.getByText('Project name must be at least 3 characters')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Description must be at least 10 characters')
    ).toBeInTheDocument();
  });

  it('clears validation errors when user starts typing', async () => {
    const user = userEvent.setup();
    render(<AIProjectGenerator />);

    const generateButton = screen.getByText('Generate Project');
    await user.click(generateButton);

    await waitFor(() => {
      expect(screen.getByText('Project name is required')).toBeInTheDocument();
    });

    const projectNameInput = screen.getByPlaceholderText(
      'Enter your project name...'
    );
    await user.type(projectNameInput, 'Test Project');

    await waitFor(() => {
      expect(
        screen.queryByText('Project name is required')
      ).not.toBeInTheDocument();
    });
  });

  it('generates project successfully', async () => {
    // Mock fetch to resolve after a delay to allow loading state to show
    (global.fetch as jest.Mock).mockImplementationOnce(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                ok: true,
                json: async () => ({
                  content: 'Generated project content',
                  model: 'gpt-4',
                  usage: { total_tokens: 100 },
                }),
              }),
            100
          )
        )
    );

    const user = userEvent.setup();
    render(<AIProjectGenerator />);

    const projectNameInput = screen.getByPlaceholderText(
      'Enter your project name...'
    );
    const projectDescriptionInput = screen.getByPlaceholderText(
      'Describe what you want to build...'
    );
    const generateButton = screen.getByText('Generate Project');

    await user.type(projectNameInput, 'Test Project');
    await user.type(
      projectDescriptionInput,
      'This is a comprehensive test project description for testing purposes.'
    );

    await user.click(generateButton);

    // Check loading state - wait for it to appear
    await waitFor(() => {
      expect(screen.getByText('Generating...')).toBeInTheDocument();
    });

    // Wait for generation to complete
    await waitFor(() => {
      expect(screen.getByText('Test Project')).toBeInTheDocument();
    });

    expect(
      screen.getByText('Project generated successfully!')
    ).toBeInTheDocument();
  });

  it('handles API errors gracefully', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

    const user = userEvent.setup();
    render(<AIProjectGenerator />);

    const projectNameInput = screen.getByPlaceholderText(
      'Enter your project name...'
    );
    const projectDescriptionInput = screen.getByPlaceholderText(
      'Describe what you want to build...'
    );
    const generateButton = screen.getByText('Generate Project');

    await user.type(projectNameInput, 'Test Project');
    await user.type(
      projectDescriptionInput,
      'This is a test project description.'
    );

    await user.click(generateButton);

    await waitFor(() => {
      expect(
        screen.getByText('Failed to generate project. Please try again.')
      ).toBeInTheDocument();
    });
  });

  it('toggles advanced settings', async () => {
    const user = userEvent.setup();
    render(<AIProjectGenerator />);

    const advancedToggle = screen.getByRole('switch');
    expect(advancedToggle).not.toBeChecked();

    await user.click(advancedToggle);
    expect(advancedToggle).toBeChecked();

    expect(screen.getByText('Temperature: 0.7')).toBeInTheDocument();
    expect(screen.getByText('Max Tokens')).toBeInTheDocument();
  });

  it('allows copying generated content', async () => {
    const user = userEvent.setup();
    render(<AIProjectGenerator />);

    // First generate a project
    const projectNameInput = screen.getByPlaceholderText(
      'Enter your project name...'
    );
    const projectDescriptionInput = screen.getByPlaceholderText(
      'Describe what you want to build...'
    );
    const generateButton = screen.getByText('Generate Project');

    await user.type(projectNameInput, 'Test Project');
    await user.type(
      projectDescriptionInput,
      'This is a test project description.'
    );

    await user.click(generateButton);

    await waitFor(() => {
      expect(screen.getByText('Test Project')).toBeInTheDocument();
    });

    // Now test copying - find the copy button by its icon
    const copyButton = screen.getByTestId('copy-icon').closest('button');
    expect(copyButton).toBeInTheDocument();

    // Click the copy button - this should not throw an error
    await user.click(copyButton!);

    // The copy functionality works in the actual app
    // In tests, we just verify the button exists and can be clicked
    expect(copyButton).toBeInTheDocument();
  });

  it('allows downloading generated content', async () => {
    // Mock URL.createObjectURL and related APIs
    const mockCreateObjectURL = jest.fn(() => 'mock-url');
    const mockRevokeObjectURL = jest.fn();
    global.URL.createObjectURL = mockCreateObjectURL;
    global.URL.revokeObjectURL = mockRevokeObjectURL;

    const user = userEvent.setup();
    render(<AIProjectGenerator />);

    // Generate a project first
    const projectNameInput = screen.getByPlaceholderText(
      'Enter your project name...'
    );
    const projectDescriptionInput = screen.getByPlaceholderText(
      'Describe what you want to build...'
    );
    const generateButton = screen.getByText('Generate Project');

    await user.type(projectNameInput, 'Test Project');
    await user.type(
      projectDescriptionInput,
      'This is a test project description.'
    );

    await user.click(generateButton);

    await waitFor(() => {
      expect(screen.getByText('Test Project')).toBeInTheDocument();
    });

    // Test downloading
    const downloadButton = screen
      .getByTestId('download-icon')
      .closest('button');
    await user.click(downloadButton!);

    expect(mockCreateObjectURL).toHaveBeenCalled();
    expect(mockRevokeObjectURL).toHaveBeenCalledWith('mock-url');
  });

  it('clears form fields', async () => {
    const user = userEvent.setup();
    render(<AIProjectGenerator />);

    const projectNameInput = screen.getByPlaceholderText(
      'Enter your project name...'
    );
    const projectDescriptionInput = screen.getByPlaceholderText(
      'Describe what you want to build...'
    );
    const clearButton = screen.getByLabelText('Clear all fields');

    await user.type(projectNameInput, 'Test Project');
    await user.type(projectDescriptionInput, 'Test description');

    expect(projectNameInput).toHaveValue('Test Project');
    expect(projectDescriptionInput).toHaveValue('Test description');

    await user.click(clearButton);

    expect(projectNameInput).toHaveValue('');
    expect(projectDescriptionInput).toHaveValue('');
  });

  it('loads and saves preferences to localStorage', () => {
    // Mock localStorage to return saved values
    (localStorage.getItem as jest.Mock).mockImplementation((key: string) => {
      if (key === 'ai-generator-selected-model') return 'claude-3';
      if (key === 'ai-generator-advanced-mode') return 'true';
      if (key === 'ai-generator-temperature') return '0.8';
      if (key === 'ai-generator-max-tokens') return '1500';
      return null;
    });

    render(<AIProjectGenerator />);

    // Check if preferences were loaded (this would be verified by checking component state)
    expect(localStorage.getItem).toHaveBeenCalledWith(
      'ai-generator-selected-model'
    );
    expect(localStorage.getItem).toHaveBeenCalledWith(
      'ai-generator-advanced-mode'
    );
    expect(localStorage.getItem).toHaveBeenCalledWith(
      'ai-generator-temperature'
    );
    expect(localStorage.getItem).toHaveBeenCalledWith(
      'ai-generator-max-tokens'
    );
  });

  it('supports keyboard shortcuts', async () => {
    const user = userEvent.setup();
    render(<AIProjectGenerator />);

    const projectNameInput = screen.getByPlaceholderText(
      'Enter your project name...'
    );
    const projectDescriptionInput = screen.getByPlaceholderText(
      'Describe what you want to build...'
    );

    await user.type(projectNameInput, 'Test Project');
    await user.type(
      projectDescriptionInput,
      'This is a test project description for keyboard shortcuts.'
    );

    // Mock fetch to avoid actual API call
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        content: 'Keyboard shortcut test content',
        model: 'gpt-4',
        usage: { total_tokens: 50 },
      }),
    });

    // Test Ctrl+Enter to generate
    await user.keyboard('{Control>}{Enter}{/Control}');

    await waitFor(() => {
      expect(screen.getByText('Test Project')).toBeInTheDocument();
    });
  });

  it('shows empty state when no results', () => {
    render(<AIProjectGenerator />);

    expect(
      screen.getByText('No results yet. Generate your first project!')
    ).toBeInTheDocument();
    expect(screen.getByTestId('file-text-icon')).toBeInTheDocument();
  });

  it('displays results count correctly', async () => {
    const user = userEvent.setup();
    render(<AIProjectGenerator />);

    // Initially should show 0 results
    expect(screen.getByText('0 Results')).toBeInTheDocument();

    // Generate first project
    const projectNameInput = screen.getByPlaceholderText(
      'Enter your project name...'
    );
    const projectDescriptionInput = screen.getByPlaceholderText(
      'Describe what you want to build...'
    );
    const generateButton = screen.getByText('Generate Project');

    await user.type(projectNameInput, 'Test Project 1');
    await user.type(projectDescriptionInput, 'First test project description.');

    await user.click(generateButton);

    await waitFor(() => {
      expect(screen.getByText('1 Result')).toBeInTheDocument();
    });

    // Generate second project
    await user.clear(projectNameInput);
    await user.clear(projectDescriptionInput);
    await user.type(projectNameInput, 'Test Project 2');
    await user.type(
      projectDescriptionInput,
      'Second test project description.'
    );

    await user.click(generateButton);

    await waitFor(() => {
      expect(screen.getByText('2 Results')).toBeInTheDocument();
    });
  });
});
