import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Navbar } from '@/app/components/shared/Navbar';
import { AuthProvider } from '@/app/context/AuthContext';
import { ThemeProvider } from '@/app/context/ThemeContext';
import { mockRouter } from '@/jest.setup';

const mockUser = {
  id: '1',
  email: 'test@example.com',
  username: 'testuser',
  displayName: 'Test User',
  bio: '',
  avatar: undefined,
  followers: [],
  following: [],
  createdAt: new Date(),
};

const renderWithAuth = (component: React.ReactElement) => {
  return render(
    <ThemeProvider>
      <AuthProvider>{component}</AuthProvider>
    </ThemeProvider>
  );
};

describe('Navbar Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('renders navigation links', () => {
    localStorage.setItem('mockUser', JSON.stringify(mockUser));
    renderWithAuth(<Navbar />);
    
    expect(screen.getByText('Vibe')).toBeInTheDocument();
    expect(screen.getByText('Feed')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('displays user avatar when logged in', () => {
    localStorage.setItem('mockUser', JSON.stringify(mockUser));
    renderWithAuth(<Navbar />);
    
    // Should display first letter of username
    expect(screen.getByText('T')).toBeInTheDocument();
  });

  it('shows logout button when user is logged in', () => {
    localStorage.setItem('mockUser', JSON.stringify(mockUser));
    renderWithAuth(<Navbar />);
    
    const logoutButton = screen.getByTitle('Logout');
    expect(logoutButton).toBeInTheDocument();
  });

  it('handles logout when logout button is clicked', async () => {
    const user = userEvent.setup();
    localStorage.setItem('mockUser', JSON.stringify(mockUser));
    
    renderWithAuth(<Navbar />);
    
    const logoutButton = screen.getByTitle('Logout');
    await user.click(logoutButton);
    
    expect(mockRouter.push).toHaveBeenCalledWith('/login');
  });

  it('has correct links to pages', () => {
    localStorage.setItem('mockUser', JSON.stringify(mockUser));
    renderWithAuth(<Navbar />);
    
    const feedLink = screen.getByRole('link', { name: /feed/i });
    const profileLink = screen.getByRole('link', { name: /profile/i });
    const settingsLink = screen.getByRole('link', { name: /settings/i });
    
    expect(feedLink).toHaveAttribute('href', '/feed');
    expect(profileLink).toHaveAttribute('href', '/profile/1');
    expect(settingsLink).toHaveAttribute('href', '/settings');
  });

  it('has logo link to feed', () => {
    localStorage.setItem('mockUser', JSON.stringify(mockUser));
    renderWithAuth(<Navbar />);
    
    const logoLink = screen.getByRole('link', { name: /vibe/i });
    expect(logoLink).toHaveAttribute('href', '/feed');
  });

  it('does not show user section when not logged in', () => {
    renderWithAuth(<Navbar />);
    
    const logoutButton = screen.queryByTitle('Logout');
    expect(logoutButton).not.toBeInTheDocument();
  });

  it('applies sticky positioning', () => {
    const { container } = renderWithAuth(<Navbar />);
    const nav = container.querySelector('nav');
    
    expect(nav).toHaveClass('sticky top-0 z-50');
  });

  it('has responsive design classes', () => {
    const { container } = renderWithAuth(<Navbar />);
    const nav = container.querySelector('nav');
    
    expect(nav).toHaveClass('bg-white dark:bg-gray-900');
  });
});
