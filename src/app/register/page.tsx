import RegisterForm from '@/components/auth/RegisterForm';

export const metadata = {
  title: 'Register - Campus Event System',
  description: 'Create a new Campus Event System account',
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-3">Create Account</h1>
          <p className="text-muted-foreground text-base">
            Join to discover and manage campus events
          </p>
        </div>
        <RegisterForm />
        <p className="text-center text-muted-foreground text-sm mt-8">
          Already have an account?{' '}
          <a href="/login" className="text-foreground font-semibold hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
