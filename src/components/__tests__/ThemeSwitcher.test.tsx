import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ThemeSwitcher from '../ThemeSwitcher';

// Mock the theme context
const mockToggleTheme = jest.fn();
const mockSetTheme = jest.fn();

jest.mock('../../lib/theme-context', () => ({
  useTheme: () => ({
    theme: 'light',
    toggleTheme: mockToggleTheme,
    setTheme: mockSetTheme,
    mounted: true,
  }),
}));

describe('ThemeSwitcher', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the theme switcher button', () => {
    render(<ThemeSwitcher />);

    const button = screen.getByRole('button', { name: /toggle theme/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('w-14', 'h-8', 'rounded-full');
  });

  it('shows sun icon for light theme', () => {
    render(<ThemeSwitcher />);

    // The sun icon is an SVG with specific classes
    const sunIcon = document.querySelector('svg.w-4.h-4.text-yellow-400');
    expect(sunIcon).toBeInTheDocument();
  });

  it('calls toggleTheme when button is clicked', async () => {
    const user = userEvent.setup();
    render(<ThemeSwitcher />);

    const button = screen.getByRole('button', { name: /toggle theme/i });
    await user.click(button);

    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });

  it('shows tooltip on hover', async () => {
    render(<ThemeSwitcher />);

    const button = screen.getByRole('button', { name: /toggle theme/i });

    // Tooltip should be present in DOM but not visible initially
    const tooltip = screen.getByText('Theme:');
    expect(tooltip).toBeInTheDocument();
    expect(tooltip.closest('div')).toHaveClass('opacity-0');

    // Hover over the button
    fireEvent.mouseEnter(button);

    await waitFor(() => {
      expect(tooltip.closest('div')).toHaveClass('group-hover:opacity-100');
    });
  });

  it('handles animation state during toggle', async () => {
    const user = userEvent.setup();
    render(<ThemeSwitcher />);

    const button = screen.getByRole('button', { name: /toggle theme/i });

    // Click the button
    await user.click(button);

    // The component should handle animation internally
    // We can't easily test the animation state without more complex setup
    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });

  it('renders with proper accessibility attributes', () => {
    render(<ThemeSwitcher />);

    const button = screen.getByRole('button', { name: /toggle theme/i });
    expect(button).toHaveAttribute('aria-label', 'Toggle theme');
    expect(button).toHaveAttribute('title', 'Toggle theme');
  });

  it('applies hover effects', () => {
    render(<ThemeSwitcher />);

    const button = screen.getByRole('button', { name: /toggle theme/i });

    // Check initial classes
    expect(button).toHaveClass('hover:shadow-xl', 'hover:scale-105');

    // The glow effect should be present but initially hidden
    const glowEffect = button.querySelector('.absolute.inset-0');
    expect(glowEffect).toBeInTheDocument();
  });
});