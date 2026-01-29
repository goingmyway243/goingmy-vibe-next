import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PostCard } from '@/app/components/feed/PostCard';

const mockPost = {
  id: '1',
  content: 'This is a test post! 🚀',
  author: {
    id: '1',
    username: 'testuser',
    displayName: 'Test User',
    avatar: undefined,
  },
  likes: ['2', '3'],
  commentCount: 5,
  createdAt: new Date('2024-01-15T10:00:00'),
};

describe('PostCard Component', () => {
  it('renders post content', () => {
    render(<PostCard post={mockPost} currentUserId="1" />);
    expect(screen.getByText(/this is a test post/i)).toBeInTheDocument();
  });

  it('displays author information', () => {
    render(<PostCard post={mockPost} currentUserId="1" />);
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('@testuser')).toBeInTheDocument();
  });

  it('shows like count', () => {
    render(<PostCard post={mockPost} currentUserId="1" />);
    expect(screen.getByText('2')).toBeInTheDocument(); // likes count
  });

  it('shows comment count', () => {
    render(<PostCard post={mockPost} currentUserId="1" />);
    expect(screen.getByText('5')).toBeInTheDocument(); // comment count
  });

  it('displays relative time', () => {
    render(<PostCard post={mockPost} currentUserId="1" />);
    // Should show something like "2 years ago"
    expect(screen.getByText(/ago$/i)).toBeInTheDocument();
  });

  it('shows liked state when current user has liked', () => {
    const { container } = render(
      <PostCard post={{ ...mockPost, likes: ['1', '2'] }} currentUserId="1" />
    );
    
    // Heart icon should have fill
    const heartButton = screen.getByRole('button', { name: /2/i });
    expect(heartButton).toHaveClass('text-red-500');
  });

  it('shows unliked state when current user has not liked', () => {
    render(<PostCard post={mockPost} currentUserId="4" />);
    
    const heartButton = screen.getAllByRole('button')[0];
    expect(heartButton).not.toHaveClass('text-red-500');
  });

  it('toggles like when heart button is clicked', async () => {
    const user = userEvent.setup();
    render(<PostCard post={mockPost} currentUserId="4" />);
    
    // Initial state: 2 likes, not liked by current user
    expect(screen.getByText('2')).toBeInTheDocument();
    
    // Click like button
    const heartButton = screen.getAllByRole('button')[0];
    await user.click(heartButton);
    
    // Should now show 3 likes
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('calls onLike callback when like button is clicked', async () => {
    const onLike = jest.fn();
    const user = userEvent.setup();
    
    render(<PostCard post={mockPost} currentUserId="1" onLike={onLike} />);
    
    const heartButton = screen.getAllByRole('button')[0];
    await user.click(heartButton);
    
    expect(onLike).toHaveBeenCalledWith('1');
  });

  it('calls onComment callback when comment button is clicked', async () => {
    const onComment = jest.fn();
    const user = userEvent.setup();
    
    render(<PostCard post={mockPost} currentUserId="1" onComment={onComment} />);
    
    const commentButton = screen.getAllByRole('button')[1];
    await user.click(commentButton);
    
    expect(onComment).toHaveBeenCalledWith('1');
  });

  it('renders share button', () => {
    render(<PostCard post={mockPost} currentUserId="1" />);
    
    // Share button is the third button
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(3);
  });

  it('handles multiline content correctly', () => {
    const multilinePost = {
      ...mockPost,
      content: 'Line 1\nLine 2\nLine 3',
    };
    
    render(<PostCard post={multilinePost} currentUserId="1" />);
    expect(screen.getByText(/Line 1/)).toBeInTheDocument();
  });

  it('renders without currentUserId', () => {
    render(<PostCard post={mockPost} />);
    expect(screen.getByText(/this is a test post/i)).toBeInTheDocument();
  });
});
