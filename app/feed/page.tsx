'use client';

import { CreatePost } from '@/app/components/feed/CreatePost';
import { PostCard } from '@/app/components/feed/PostCard';
import { useAuth } from '@/app/context/AuthContext';

// Mock data for demonstration
const mockPosts = [
  {
    id: '1',
    content: 'Just launched my new social app! 🚀 What do you think?',
    author: {
      id: '1',
      username: 'johndoe',
      displayName: 'John Doe',
      avatar: undefined
    },
    likes: ['2', '3'],
    commentCount: 5,
    createdAt: new Date(Date.now() - 3600000)
  },
  {
    id: '2',
    content: 'Beautiful day for coding! ☀️ Working on some exciting features.',
    author: {
      id: '2',
      username: 'janedoe',
      displayName: 'Jane Doe',
      avatar: undefined
    },
    likes: ['1'],
    commentCount: 2,
    createdAt: new Date(Date.now() - 7200000)
  },
  {
    id: '3',
    content: 'Anyone else loving the new Next.js 16 features? The App Router is amazing! 💯',
    author: {
      id: '3',
      username: 'devuser',
      displayName: 'Dev User',
      avatar: undefined
    },
    likes: ['1', '2', '4'],
    commentCount: 8,
    createdAt: new Date(Date.now() - 10800000)
  }
];

export default function FeedPage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto py-6 px-4 space-y-6">
      <CreatePost user={user} />
      
      <div className="space-y-4">
        {mockPosts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            currentUserId={user.id}
          />
        ))}
      </div>
    </div>
  );
}
