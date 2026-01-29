import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeToggle } from '@/app/components/shared/ThemeToggle';
import { ThemeProvider } from '@/app/context/ThemeContext';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('ThemeToggle Component', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  it('renders theme toggle button with correct background color', () => {
    renderWithTheme(<ThemeToggle />);
    
    const button = screen.getByRole('button', { name: /theme selector/i });
    expect(button).toBeInTheDocument();
    
    // Verify Tailwind classes that define colors
    expect(button).toHaveClass('bg-gray-100'); // #f3f4f6 = rgb(243, 244, 246)
    expect(button).toHaveClass('dark:bg-gray-800'); // #1f2937
    expect(button).toHaveClass('rounded-xl');
  });

  it('opens dropdown with correct background and border colors', async () => {
    const user = userEvent.setup();
    renderWithTheme(<ThemeToggle />);
    
    const button = screen.getByRole('button', { name: /theme selector/i });
    await user.click(button);
    
    const lightOption = screen.getByText('Light');
    const darkOption = screen.getByText('Dark');
    const systemOption = screen.getByText('System');
    
    expect(lightOption).toBeInTheDocument();
    expect(darkOption).toBeInTheDocument();
    expect(systemOption).toBeInTheDocument();
    
    // Check dropdown container has correct color classes
    const dropdown = lightOption.closest('div.absolute') as HTMLElement;
    expect(dropdown).toHaveClass('bg-white'); // #ffffff = rgb(255, 255, 255)
    expect(dropdown).toHaveClass('dark:bg-gray-900'); // #111827
    expect(dropdown).toHaveClass('border-gray-200'); // #e5e7eb = rgb(229, 231, 235)
    expect(dropdown).toHaveClass('dark:border-gray-700'); // #374151
    expect(dropdown).toHaveClass('rounded-xl');
  });

  it('changes theme when option is clicked', async () => {
    const user = userEvent.setup();
    renderWithTheme(<ThemeToggle />);
    
    const button = screen.getByRole('button', { name: /theme selector/i });
    await user.click(button);
    
    const darkOption = screen.getByText('Dark');
    await user.click(darkOption);
    
    await waitFor(() => {
      expect(localStorage.getItem('theme')).toBe('dark');
    });
  });

  it('closes dropdown after selecting theme', async () => {
    const user = userEvent.setup();
    renderWithTheme(<ThemeToggle />);
    
    const button = screen.getByRole('button', { name: /theme selector/i });
    await user.click(button);
    
    const lightOption = screen.getByText('Light');
    await user.click(lightOption);
    
    await waitFor(() => {
      expect(screen.queryByText('Light')).not.toBeInTheDocument();
    });
  });

  it('closes dropdown when clicking outside', async () => {
    const user = userEvent.setup();
    renderWithTheme(
      <div>
        <ThemeToggle />
        <div data-testid="outside">Outside</div>
      </div>
    );
    
    const button = screen.getByRole('button', { name: /theme selector/i });
    await user.click(button);
    
    expect(screen.getByText('Light')).toBeInTheDocument();
    
    const outside = screen.getByTestId('outside');
    await user.click(outside);
    
    await waitFor(() => {
      expect(screen.queryByText('Light')).not.toBeInTheDocument();
    });
  });

  it('shows checkmark with correct colors on selected theme', async () => {
    const user = userEvent.setup();
    renderWithTheme(<ThemeToggle />);
    
    const button = screen.getByRole('button', { name: /theme selector/i });
    await user.click(button);
    
    // System is default
    const systemOption = screen.getByText('System').closest('button') as HTMLElement;
    expect(systemOption).toHaveTextContent('✓');
    
    // Verify color classes that define the actual colors
    expect(systemOption).toHaveClass('text-indigo-600'); // #4f46e5 = rgb(79, 70, 229)
    expect(systemOption).toHaveClass('dark:text-indigo-400'); // #818cf8
    expect(systemOption).toHaveClass('bg-indigo-50'); // #eef2ff = rgb(238, 242, 255)
    expect(systemOption).toHaveClass('dark:bg-indigo-950/50'); // rgba indigo-950
    
    // Check checkmark has color class
    const checkmark = systemOption?.querySelector('span:last-child') as HTMLElement;
    expect(checkmark).toHaveClass('text-indigo-600'); // #4f46e5 = rgb(79, 70, 229)
    expect(checkmark).toHaveClass('dark:text-indigo-400');
  });

  it('applies correct highlight colors to selected theme option', async () => {
    const user = userEvent.setup();
    renderWithTheme(<ThemeToggle />);
    
    const button = screen.getByRole('button', { name: /theme selector/i });
    await user.click(button);
    
    await user.click(screen.getByText('Dark'));
    await user.click(button);
    
    const darkOption = screen.getByText('Dark').closest('button') as HTMLElement;
    // Verify selected option has indigo colors
    expect(darkOption).toHaveClass('text-indigo-600'); // #4f46e5 = rgb(79, 70, 229)
    expect(darkOption).toHaveClass('dark:text-indigo-400'); // #818cf8
    expect(darkOption).toHaveClass('bg-indigo-50'); // #eef2ff = rgb(238, 242, 255)
    expect(darkOption).toHaveClass('dark:bg-indigo-950/50');
    expect(darkOption).toHaveClass('font-medium');
    
    // Verify icon also has correct color class
    const icon = darkOption?.querySelector('svg') as SVGElement;
    expect(icon).toHaveClass('text-indigo-600'); // #4f46e5 = rgb(79, 70, 229)
    expect(icon).toHaveClass('dark:text-indigo-400');
  });

  it('displays correct text colors for each theme option', async () => {
    const user = userEvent.setup();
    renderWithTheme(<ThemeToggle />);
    
    const button = screen.getByRole('button', { name: /theme selector/i });
    await user.click(button);
    
    // Check unselected options have gray text color classes
    const lightOption = screen.getByText('Light').closest('button') as HTMLElement;
    const darkOption = screen.getByText('Dark').closest('button') as HTMLElement;
    
    expect(lightOption).toHaveClass('text-gray-700'); // #374151 = rgb(55, 65, 81)
    expect(lightOption).toHaveClass('dark:text-gray-300'); // #d1d5db
    expect(darkOption).toHaveClass('text-gray-700');
    expect(darkOption).toHaveClass('dark:text-gray-300');
    
    // Selected option should have indigo color
    const systemOption = screen.getByText('System').closest('button') as HTMLElement;
    expect(systemOption).toHaveClass('text-indigo-600'); // #4f46e5 = rgb(79, 70, 229)
    expect(systemOption).toHaveClass('dark:text-indigo-400'); // #818cf8
  });

  it('applies correct button icon color', async () => {
    renderWithTheme(<ThemeToggle />);
    
    const button = screen.getByRole('button', { name: /theme selector/i });
    const icon = button.querySelector('svg') as SVGElement;
    
    // Verify icon has correct color classes
    expect(icon).toHaveClass('text-gray-700'); // #374151 = rgb(55, 65, 81)
    expect(icon).toHaveClass('dark:text-gray-300'); // #d1d5db
  });

  it('unselected options have correct hover colors', async () => {
    const user = userEvent.setup();
    renderWithTheme(<ThemeToggle />);
    
    const button = screen.getByRole('button', { name: /theme selector/i });
    await user.click(button);
    
    const lightOption = screen.getByText('Light').closest('button') as HTMLElement;
    
    // Unselected options should have hover classes that define gray colors
    expect(lightOption).toHaveClass('hover:bg-gray-100'); // #f3f4f6 = rgb(243, 244, 246)
    expect(lightOption).toHaveClass('dark:hover:bg-gray-800'); // #1f2937
    // Should not have selected state colors
    expect(lightOption).not.toHaveClass('bg-indigo-50');
  });
});
