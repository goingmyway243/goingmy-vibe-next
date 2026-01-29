'use client';

import { useState } from 'react';
import { Button } from '@/app/components/shared/Button';
import { Avatar } from '@/app/components/shared/Avatar';

interface CreatePostProps {
  user: {
    username: string;
    avatar?: string;
  };
  onPost?: (content: string) => Promise<void>;
}

export function CreatePost({ user, onPost }: CreatePostProps) {
  const [content, setContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsPosting(true);
    try {
      await onPost?.(content);
      setContent('');
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex space-x-3">
          <Avatar src={user.avatar} alt={user.username} size="md" />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            className="flex-1 resize-none border-none focus:ring-0 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 bg-transparent"
            rows={3}
            maxLength={500}
          />
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400 dark:text-gray-500">
            {content.length}/500
          </span>
          <Button
            type="submit"
            disabled={!content.trim() || isPosting}
            variant="primary"
            size="md"
          >
            {isPosting ? 'Posting...' : 'Post'}
          </Button>
        </div>
      </form>
    </div>
  );
}
