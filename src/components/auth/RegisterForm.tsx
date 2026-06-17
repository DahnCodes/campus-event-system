'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { registerSchema } from '@/schemas/auth.schema';
import { AlertCircle, Check } from 'lucide-react';

export default function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    // Clear general error
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setErrors({});
    setIsLoading(true);

    try {
      // Validate form data
      const validationResult = registerSchema.safeParse(formData);
      if (!validationResult.success) {
        const fieldErrors: Record<string, string> = {};
        validationResult.error.issues.forEach((issue) => {
          if (issue.path[0]) {
            fieldErrors[issue.path[0] as string] = issue.message;
          }
        });
        setErrors(fieldErrors);
        setIsLoading(false);
        return;
      }

      // Call register API
      const response = await api.post('/auth/register', {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
      });

      if (response.data.success) {
        // Redirect to dashboard or home after successful registration
        router.push('/');
      } else {
        setError(response.data.message || 'Registration failed');
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || 'An error occurred during registration';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-foreground mb-2">
          Full Name
        </label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          autoComplete="name"
          value={formData.fullName}
          onChange={handleChange}
          disabled={isLoading}
          className={`w-full px-4 py-2.5 rounded-lg border text-foreground bg-background transition-colors focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed ${
            errors.fullName ? 'border-red-300' : 'border-border'
          }`}
          placeholder="John Doe"
        />
        {errors.fullName && <p className="text-sm text-red-600 mt-1.5">{errors.fullName}</p>}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
          Email Address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={formData.email}
          onChange={handleChange}
          disabled={isLoading}
          className={`w-full px-4 py-2.5 rounded-lg border text-foreground bg-background transition-colors focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed ${
            errors.email ? 'border-red-300' : 'border-border'
          }`}
          placeholder="you@example.com"
        />
        {errors.email && <p className="text-sm text-red-600 mt-1.5">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          value={formData.password}
          onChange={handleChange}
          disabled={isLoading}
          className={`w-full px-4 py-2.5 rounded-lg border text-foreground bg-background transition-colors focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed ${
            errors.password ? 'border-red-300' : 'border-border'
          }`}
          placeholder="••••••••"
        />
        {errors.password && <p className="text-sm text-red-600 mt-1.5">{errors.password}</p>}
        <p className="text-xs text-muted-foreground mt-2">
          Must be at least 6 characters long
        </p>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-4 py-2.5 bg-foreground text-background font-semibold rounded-lg hover:bg-opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Creating account...' : 'Create Account'}
      </button>
    </form>
  );
}
