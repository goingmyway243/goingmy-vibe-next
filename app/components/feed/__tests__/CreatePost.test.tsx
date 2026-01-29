import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CreatePost } from '@/app/components/feed/CreatePost';

const mockUser = {
  username: 'testuser',
  avatar: undefined,
};

describe('CreatePost Component', () => {
  it('renders create post form', () => {
    render(<CreatePost user={mockUser} />);
    
    expect(screen.getByPlaceholderText(/what's on your mind/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /post/i })).toBeInTheDocument();
  });

  it('displays user avatar', () => {
    render(<CreatePost user={mockUser} />);
    // Avatar should show first letter of username
    expect(screen.getByText('T')).toBeInTheDocument();
  });

  it('updates content on user input', async () => {
    const user = userEvent.setup();
    render(<CreatePost user={mockUser} />);
    
    const textarea = screen.getByPlaceholderText(/what's on your mind/i);
    await user.type(textarea, 'Hello world!');
    
    expect(textarea).toHaveValue('Hello world!');
  });

  it('displays character count', async () => {
    const user = userEvent.setup();
    render(<CreatePost user={mockUser} />);
    
    // Initially shows 0/500
    expect(screen.getByText('0/500')).toBeInTheDocument();
    
    const textarea = screen.getByPlaceholderText(/what's on your mind/i);
    await user.type(textarea, 'Test');
    
    // Should update to 4/500
    expect(screen.getByText('4/500')).toBeInTheDocument();
  });

  it('disables post button when content is empty', () => {
    render(<CreatePost user={mockUser} />);
    
    const postButton = screen.getByRole('button', { name: /post/i });
    expect(postButton).toBeDisabled();
  });

  it('enables post button when content is entered', async () => {
    const user = userEvent.setup();
    render(<CreatePost user={mockUser} />);
    
    const textarea = screen.getByPlaceholderText(/what's on your mind/i);
    await user.type(textarea, 'Hello');
    
    const postButton = screen.getByRole('button', { name: /post/i });
    expect(postButton).toBeEnabled();
  });

  it('disables button for whitespace-only content', async () => {
    const user = userEvent.setup();
    render(<CreatePost user={mockUser} />);
    
    const textarea = screen.getByPlaceholderText(/what's on your mind/i);
    await user.type(textarea, '   ');
    
    const postButton = screen.getByRole('button', { name: /post/i });
    expect(postButton).toBeDisabled();
  });

  it('calls onPost callback when form is submitted', async () => {
    const onPost = jest.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    
    render(<CreatePost user={mockUser} onPost={onPost} />);
    
    const textarea = screen.getByPlaceholderText(/what's on your mind/i);
    await user.type(textarea, 'New post content');
    
    const postButton = screen.getByRole('button', { name: /post/i });
    await user.click(postButton);
    
    await waitFor(() => {
      expect(onPost).toHaveBeenCalledWith('New post content');
    });
  });

  it('clears content after successful post', async () => {
    const onPost = jest.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    
    render(<CreatePost user={mockUser} onPost={onPost} />);
    
    const textarea = screen.getByPlaceholderText(/what's on your mind/i);
    await user.type(textarea, 'Test post');
    
    const postButton = screen.getByRole('button', { name: /post/i });
    await user.click(postButton);
    
    await waitFor(() => {
      expect(textarea).toHaveValue('');
    });
  });

  it('shows loading state during submission', async () => {
    const onPost = jest.fn(() => new Promise(resolve => setTimeout(resolve, 100)));
    const user = userEvent.setup();
    
    render(<CreatePost user={mockUser} onPost={onPost} />);
    
    const textarea = screen.getByPlaceholderText(/what's on your mind/i);
    await user.type(textarea, 'Test');
    
    const postButton = screen.getByRole('button', { name: /post/i });
    await user.click(postButton);
    
    expect(screen.getByText(/posting/i)).toBeInTheDocument();
    expect(postButton).toBeDisabled();
  });

  it('respects maxLength of 500 characters', () => {
    render(<CreatePost user={mockUser} />);
    
    const textarea = screen.getByPlaceholderText(/what's on your mind/i);
    expect(textarea).toHaveAttribute('maxLength', '500');
  });

  it('prevents form submission with empty content', async () => {
    const onPost = jest.fn();
    const user = userEvent.setup();
    
    render(<CreatePost user={mockUser} onPost={onPost} />);
    
    const form = screen.getByRole('textbox').closest('form');
    if (form) {
      await user.click(screen.getByRole('button', { name: /post/i }));
    }
    
    expect(onPost).not.toHaveBeenCalled();
  });

  it('handles submission without onPost callback', async () => {
    const user = userEvent.setup();
    render(<CreatePost user={mockUser} />);
    
    const textarea = screen.getByPlaceholderText(/what's on your mind/i);
    await user.type(textarea, 'Test');
    
    const postButton = screen.getByRole('button', { name: /post/i });
    
    // Should not throw error
    await expect(user.click(postButton)).resolves.not.toThrow();
  });
});
