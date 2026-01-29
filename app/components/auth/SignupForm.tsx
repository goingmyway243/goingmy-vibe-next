'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/app/components/shared/Input';
import { Button } from '@/app/components/shared/Button';
import { useAuth } from '@/app/context/AuthContext';

export function SignupForm() {
  const router = useRouter();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    displayName: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      await signup({
        email: formData.email,
        username: formData.username,
        displayName: formData.displayName,
        password: formData.password
      });
      router.push('/feed');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Create account</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Join our community today</p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <Input
        type="text"
        name="username"
        label="Username"
        value={formData.username}
        onChange={handleChange}
        placeholder="johndoe"
        required
      />

      <Input
        type="text"
        name="displayName"
        label="Display Name"
        value={formData.displayName}
        onChange={handleChange}
        placeholder="John Doe"
        required
      />

      <Input
        type="email"
        name="email"
        label="Email"
        value={formData.email}
        onChange={handleChange}
        placeholder="you@example.com"
        required
      />

      <Input
        type="password"
        name="password"
        label="Password"
        value={formData.password}
        onChange={handleChange}
        placeholder="••••••••"
        required
      />

      <Input
        type="password"
        name="confirmPassword"
        label="Confirm Password"
        value={formData.confirmPassword}
        onChange={handleChange}
        placeholder="••••••••"
        required
      />

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? 'Creating account...' : 'Sign up'}
      </Button>

      <p className="text-center text-sm text-gray-600 dark:text-gray-400">
        Already have an account?{' '}
        <Link href="/login" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
          Sign in
        </Link>
      </p>
    </form>
  );
}
