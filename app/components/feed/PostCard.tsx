'use client';

import { useState } from 'react';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { Avatar } from '@/app/components/shared/Avatar';
import { formatDistanceToNow } from 'date-fns';

interface PostCardProps {
  post: {
    id: string;
    content: string;
    author: {
      id: string;
      username: string;
      displayName: string;
      avatar?: string;
    };
    likes: string[];
    commentCount: number;
    createdAt: Date;
  };
  currentUserId?: string;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
}

export function PostCard({ post, currentUserId, onLike, onComment }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(
    currentUserId ? post.likes.includes(currentUserId) : false
  );
  const [likeCount, setLikeCount] = useState(post.likes.length);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    onLike?.(post.id);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4 space-y-3">
      {/* Author Header */}
      <div className="flex items-center space-x-3">
        <Avatar 
          src={post.author.avatar} 
          alt={post.author.username} 
          size="md" 
        />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">{post.author.displayName}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">@{post.author.username}</p>
        </div>
        <span className="text-sm text-gray-400 dark:text-gray-500 flex-shrink-0">
          {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
        </span>
      </div>

      {/* Content */}
      <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words">{post.content}</p>

      {/* Actions */}
      <div className="flex items-center space-x-6 pt-2 border-t border-gray-100 dark:border-gray-700">
        <button
          onClick={handleLike}
          className={`flex items-center space-x-2 transition-colors ${
            isLiked ? 'text-red-500' : 'text-gray-500 dark:text-gray-400 hover:text-red-500'
          }`}
        >
          <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
          <span className="text-sm">{likeCount}</span>
        </button>

        <button
          onClick={() => onComment?.(post.id)}
          className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-colors"
        >
          <MessageCircle size={20} />
          <span className="text-sm">{post.commentCount}</span>
        </button>

        <button className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-green-500 transition-colors">
          <Share2 size={20} />
        </button>
      </div>
    </div>
  );
}
