'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, User, Settings, LogOut } from 'lucide-react';
import { Avatar } from './Avatar';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '@/app/context/AuthContext';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const navLinks = [
    { href: '/feed', label: 'Feed', icon: Home },
    { href: `/profile/${user?.id}`, label: 'Profile', icon: User },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/feed" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">Vibe</span>
          </Link>

          <div className="flex items-center space-x-6">
            {navLinks.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center space-x-1 transition-colors ${
                    isActive 
                      ? 'text-blue-600 dark:text-blue-400' 
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  <Icon size={20} />
                  <span className="hidden sm:inline">{label}</span>
                </Link>
              );
            })}
            
            {user && (
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <Avatar src={user.avatar} alt={user.username} size="sm" />
                <button
                  onClick={handleLogout}
                  className="text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
