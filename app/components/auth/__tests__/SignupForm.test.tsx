import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SignupForm } from '@/app/components/auth/SignupForm';
import { AuthProvider } from '@/app/context/AuthContext';
import { mockRouter } from '@/jest.setup';

const renderWithAuth = (component: React.ReactElement) => {
  return render(<AuthProvider>{component}</AuthProvider>);
};

describe('SignupForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('renders signup form with all fields', () => {
    renderWithAuth(<SignupForm />);
    
    expect(screen.getByText('Create account')).toBeInTheDocument();
    expect(screen.getByText('Join our community today')).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/display name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
  });

  it('updates input values on user input', async () => {
    const user = userEvent.setup();
    renderWithAuth(<SignupForm />);
    
    await user.type(screen.getByLabelText(/username/i), 'newuser');
    await user.type(screen.getByLabelText(/display name/i), 'New User');
    await user.type(screen.getByLabelText(/^email$/i), 'new@example.com');
    await user.type(screen.getByLabelText(/^password$/i), 'password123');
    await user.type(screen.getByLabelText(/confirm password/i), 'password123');
    
    expect(screen.getByLabelText(/username/i)).toHaveValue('newuser');
    expect(screen.getByLabelText(/display name/i)).toHaveValue('New User');
    expect(screen.getByLabelText(/^email$/i)).toHaveValue('new@example.com');
  });

  it('shows error when passwords do not match', async () => {
    const user = userEvent.setup();
    renderWithAuth(<SignupForm />);
    
    await user.type(screen.getByLabelText(/username/i), 'testuser');
    await user.type(screen.getByLabelText(/display name/i), 'Test User');
    await user.type(screen.getByLabelText(/^email$/i), 'test@example.com');
    await user.type(screen.getByLabelText(/^password$/i), 'password123');
    await user.type(screen.getByLabelText(/confirm password/i), 'differentpassword');
    
    await user.click(screen.getByRole('button', { name: /sign up/i }));
    
    expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
  });

  it('shows error for short password', async () => {
    const user = userEvent.setup();
    renderWithAuth(<SignupForm />);
    
    await user.type(screen.getByLabelText(/username/i), 'testuser');
    await user.type(screen.getByLabelText(/display name/i), 'Test User');
    await user.type(screen.getByLabelText(/^email$/i), 'test@example.com');
    await user.type(screen.getByLabelText(/^password$/i), '12345');
    await user.type(screen.getByLabelText(/confirm password/i), '12345');
    
    await user.click(screen.getByRole('button', { name: /sign up/i }));
    
    expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument();
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    renderWithAuth(<SignupForm />);
    
    await user.type(screen.getByLabelText(/username/i), 'newuser');
    await user.type(screen.getByLabelText(/display name/i), 'New User');
    await user.type(screen.getByLabelText(/^email$/i), 'newuser@example.com');
    await user.type(screen.getByLabelText(/^password$/i), 'password123');
    await user.type(screen.getByLabelText(/confirm password/i), 'password123');
    
    await user.click(screen.getByRole('button', { name: /sign up/i }));
    
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/feed');
    });
  });

  it('shows loading state during submission', async () => {
    const user = userEvent.setup();
    renderWithAuth(<SignupForm />);
    
    await user.type(screen.getByLabelText(/username/i), 'newuser');
    await user.type(screen.getByLabelText(/display name/i), 'New User');
    await user.type(screen.getByLabelText(/^email$/i), 'newuser@example.com');
    await user.type(screen.getByLabelText(/^password$/i), 'password123');
    await user.type(screen.getByLabelText(/confirm password/i), 'password123');
    
    await user.click(screen.getByRole('button', { name: /sign up/i }));
    
    expect(screen.getByText(/creating account/i)).toBeInTheDocument();
  });

  it('has link to login page', () => {
    renderWithAuth(<SignupForm />);
    
    const loginLink = screen.getByRole('link', { name: /sign in/i });
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute('href', '/login');
  });

  it('requires all fields', () => {
    renderWithAuth(<SignupForm />);
    
    expect(screen.getByLabelText(/username/i)).toBeRequired();
    expect(screen.getByLabelText(/display name/i)).toBeRequired();
    expect(screen.getByLabelText(/^email$/i)).toBeRequired();
    expect(screen.getByLabelText(/^password$/i)).toBeRequired();
    expect(screen.getByLabelText(/confirm password/i)).toBeRequired();
  });

  it('clears error message when user submits again', async () => {
    const user = userEvent.setup();
    renderWithAuth(<SignupForm />);
    
    // Fill in all required fields first
    await user.type(screen.getByLabelText(/username/i), 'testuser');
    await user.type(screen.getByLabelText(/display name/i), 'Test User');
    await user.type(screen.getByLabelText(/^email$/i), 'test@example.com');
    
    // Trigger password mismatch error
    await user.type(screen.getByLabelText(/^password$/i), 'password123');
    await user.type(screen.getByLabelText(/confirm password/i), 'different');
    await user.click(screen.getByRole('button', { name: /sign up/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });
    
    // Fix the passwords and submit again
    await user.clear(screen.getByLabelText(/confirm password/i));
    await user.type(screen.getByLabelText(/confirm password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign up/i }));
    
    // Error should be cleared and redirected to feed
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/feed');
    });
  });
});
