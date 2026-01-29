import { render, screen } from '@testing-library/react';
import { Avatar } from '@/app/components/shared/Avatar';

describe('Avatar Component', () => {
  it('renders with default size (md)', () => {
    render(<Avatar alt="John Doe" />);
    const avatar = screen.getByText('J');
    expect(avatar).toBeInTheDocument();
  });

  it('displays first letter of alt text when no src provided', () => {
    render(<Avatar alt="Jane Smith" />);
    expect(screen.getByText('J')).toBeInTheDocument();
  });

  it('renders image when src is provided', () => {
    render(<Avatar src="/avatar.jpg" alt="User Avatar" />);
    const img = screen.getByAltText('User Avatar');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', expect.stringContaining('avatar.jpg'));
  });

  it('applies small size styles', () => {
    const { container } = render(<Avatar alt="User" size="sm" />);
    const avatarDiv = container.firstChild;
    expect(avatarDiv).toHaveClass('w-8 h-8');
  });

  it('applies medium size styles', () => {
    const { container } = render(<Avatar alt="User" size="md" />);
    const avatarDiv = container.firstChild;
    expect(avatarDiv).toHaveClass('w-12 h-12');
  });

  it('applies large size styles', () => {
    const { container } = render(<Avatar alt="User" size="lg" />);
    const avatarDiv = container.firstChild;
    expect(avatarDiv).toHaveClass('w-16 h-16');
  });

  it('applies extra large size styles', () => {
    const { container } = render(<Avatar alt="User" size="xl" />);
    const avatarDiv = container.firstChild;
    expect(avatarDiv).toHaveClass('w-24 h-24');
  });

  it('accepts custom className', () => {
    const { container } = render(<Avatar alt="User" className="custom-avatar" />);
    const avatarDiv = container.firstChild;
    expect(avatarDiv).toHaveClass('custom-avatar');
  });

  it('converts alt text to uppercase for initial', () => {
    render(<Avatar alt="john" />);
    expect(screen.getByText('J')).toBeInTheDocument();
  });

  it('has rounded-full styling', () => {
    const { container } = render(<Avatar alt="User" />);
    const avatarDiv = container.firstChild;
    expect(avatarDiv).toHaveClass('rounded-full');
  });
});
