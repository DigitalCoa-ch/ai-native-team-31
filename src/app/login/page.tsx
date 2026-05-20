'use client';

import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Simulate auth flow
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (email && password) {
      window.location.href = '/';
    } else {
      setError('Please enter your credentials.');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#031427] flex items-center justify-center p-6">
      {/* Background */}
      <div className="absolute inset-0" style={{
        backgroundImage: 'linear-gradient(rgba(0,210,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,210,255,0.02) 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[#00D2FF]/5 rounded-full blur-[100px]" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 mx-auto rounded-lg bg-[#00D2FF]/20 border border-[#00D2FF]/40 flex items-center justify-center mb-4">
            <span className="text-[#00D2FF] text-lg font-mono font-bold">F</span>
          </div>
          <h1 className="text-2xl font-serif text-[#F5F7FA] mb-2">Welcome Back</h1>
          <p className="text-[#94A3B8] text-sm">Sign in to FamilyOffice AI</p>
        </div>

        {/* Form Card */}
        <div className="bg-[#0B1C30]/80 backdrop-blur-xl border border-[rgba(0,210,255,0.15)] rounded-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[#94A3B8] text-xs uppercase tracking-wider mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#031427] border border-[rgba(0,210,255,0.2)] rounded px-4 py-3 text-[#F5F7FA] text-sm placeholder-[#94A3B8]/50 focus:outline-none focus:border-[#00D2FF] transition-colors"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-[#94A3B8] text-xs uppercase tracking-wider mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#031427] border border-[rgba(0,210,255,0.2)] rounded px-4 py-3 text-[#F5F7FA] text-sm placeholder-[#94A3B8]/50 focus:outline-none focus:border-[#00D2FF] transition-colors"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="text-[#EF4444] text-xs text-center">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#00D2FF] text-[#031427] font-semibold py-3 rounded transition-all hover:bg-[#33DAFF] hover:shadow-[0_0_20px_rgba(0,210,255,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                  Authenticating...
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a href="#" className="text-[#00D2FF] text-xs hover:underline">Forgot password?</a>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <a href="/" className="text-[#94A3B8] hover:text-[#F5F7FA] text-sm transition-colors">
            ← Back to Home
          </a>
        </div>
      </div>
    </main>
  );
}
