'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/app/components/shared/Input';
import { Button } from '@/app/components/shared/Button';
import { Avatar } from '@/app/components/shared/Avatar';
import { useAuth } from '@/app/context/AuthContext';

export default function SettingsPage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    displayName: '',
    username: '',
    email: '',
    bio: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.displayName,
        username: user.username,
        email: user.email,
        bio: user.bio || '',
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // TODO: Implement save settings
    console.log(formData);
    
    setTimeout(() => {
      setIsSaving(false);
      alert('Settings saved successfully!');
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Settings</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Profile Picture
            </label>
            <div className="flex items-center space-x-4">
              <Avatar alt={formData.username} size="xl" />
              <Button type="button" variant="secondary" size="sm">
                Change Photo
              </Button>
            </div>
          </div>

          {/* Display Name */}
          <Input
            type="text"
            name="displayName"
            label="Display Name"
            value={formData.displayName}
            onChange={handleChange}
            required
          />

          {/* Username */}
          <Input
            type="text"
            name="username"
            label="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />

          {/* Email */}
          <Input
            type="email"
            name="email"
            label="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              rows={4}
              maxLength={160}
            />
            <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
              {formData.bio.length}/160
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={() => window.history.back()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
