import LoginForm from '@/components/auth/LoginForm';

export const metadata = {
  title: 'Login - Campus Event System',
  description: 'Sign in to your Campus Event System account',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-3">Sign In</h1>
          <p className="text-muted-foreground text-base">
            Access your campus events and manage your account
          </p>
        </div>
        <LoginForm />
        <p className="text-center text-muted-foreground text-sm mt-8">
          Don&apos;t have an account?{' '}
          <a href="/register" className="text-foreground font-semibold hover:underline">
            Create one
          </a>
        </p>
      </div>
    </div>
  );
}
