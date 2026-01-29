import { Avatar } from '@/app/components/shared/Avatar';
import { Button } from '@/app/components/shared/Button';
import { PostCard } from '@/app/components/feed/PostCard';

interface ProfilePageProps {
  params: Promise<{ userId: string }>;
}

// Mock data
const mockUserProfile = {
  id: '1',
  username: 'johndoe',
  displayName: 'John Doe',
  bio: 'Software developer | Tech enthusiast | Coffee lover ☕',
  avatar: undefined,
  followers: ['2', '3', '4'],
  following: ['2', '5'],
  createdAt: new Date('2024-01-15')
};

const mockUserPosts = [
  {
    id: '1',
    content: 'Just launched my new social app! 🚀 What do you think?',
    author: mockUserProfile,
    likes: ['2', '3'],
    commentCount: 5,
    createdAt: new Date(Date.now() - 3600000)
  },
  {
    id: '4',
    content: 'Learning Next.js 16 has been such a great experience. The documentation is fantastic!',
    author: mockUserProfile,
    likes: ['2'],
    commentCount: 3,
    createdAt: new Date(Date.now() - 86400000)
  }
];

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { userId } = await params;
  const isOwnProfile = userId === '1'; // Replace with actual auth check

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <Avatar 
            src={mockUserProfile.avatar} 
            alt={mockUserProfile.username} 
            size="xl" 
          />
          
          <div className="flex-1 space-y-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {mockUserProfile.displayName}
              </h1>
              <p className="text-gray-500 dark:text-gray-400">@{mockUserProfile.username}</p>
            </div>
            
            {mockUserProfile.bio && (
              <p className="text-gray-700 dark:text-gray-300">{mockUserProfile.bio}</p>
            )}
            
            <div className="flex gap-6 text-sm">
              <div>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {mockUserProfile.following.length}
                </span>{' '}
                <span className="text-gray-500 dark:text-gray-400">Following</span>
              </div>
              <div>
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {mockUserProfile.followers.length}
                </span>{' '}
                <span className="text-gray-500 dark:text-gray-400">Followers</span>
              </div>
            </div>
          </div>
          
          {isOwnProfile ? (
            <Button variant="secondary" size="md">Edit Profile</Button>
          ) : (
            <Button variant="primary" size="md">Follow</Button>
          )}
        </div>
      </div>

      {/* User Posts */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 px-1">Posts</h2>
        {mockUserPosts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            currentUserId="1"
          />
        ))}
      </div>
    </div>
  );
}
