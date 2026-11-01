'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Building2, Sparkles, ArrowRight, ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useWorkspaceStore } from '@/stores/workspaceStore';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'login';

  const { login, createOrgAndUser } = useWorkspaceStore();

  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [signupStep, setSignupStep] = useState<1 | 2>(1);

  // Form Fields
  const [name, setName] = useState('');
  const [emailOrUser, setEmailOrUser] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Organisation Creation (Step 2 of Signup)
  const [orgName, setOrgName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [industry, setIndustry] = useState('Technology & SaaS');

  // Feedback / Error
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const userClean = emailOrUser.trim().toLowerCase();
    const passClean = password.trim();

    // Check credential condition specified:
    // "keep the user name as crosstech and the password as crosstech123"
    setTimeout(() => {
      if (
        (userClean === 'crosstech' || userClean === 'crosstech@synergy.io' || userClean === 'crosstech@crosstech.io' || userClean === 'admin') &&
        passClean === 'crosstech123'
      ) {
        login(userClean);
        router.push('/dashboard');
      } else {
        setLoading(false);
        setError('Invalid credentials. Use username "crosstech" and password "crosstech123"');
      }
    }, 400);
  };

  const handleSignupStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!emailOrUser.trim() || !emailOrUser.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    // Move to step 2: Create an Organisation
    setSignupStep(2);
  };

  const handleSignupComplete = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!orgName.trim()) {
      setError('Please enter an organization name');
      return;
    }
    if (!businessName.trim()) {
      setError('Please enter a business workspace name');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      createOrgAndUser(name, emailOrUser, orgName, businessName, industry);
      router.push('/dashboard');
    }, 500);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-8 bg-[#f5f6f8]">
      {/* Outer Card Container */}
      <div className="w-full max-w-5xl bg-white rounded-[2rem] shadow-2xl border border-slate-100 flex flex-col lg:flex-row overflow-hidden min-h-[640px]">
        {/* Left Side: Auth Form */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-between">
          <div>
            {/* Logo / Brand Header */}
            <div className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                S
              </div>
              <span className="font-heading font-extrabold text-lg text-neutral-900 tracking-tight">
                Synergy<span className="text-blue-600 ml-0.5">OS</span>
              </span>
            </div>

            {/* LOGIN MODE */}
            {mode === 'login' && (
              <div>
                <h1 className="text-3xl font-heading font-bold text-neutral-900 mb-2">
                  Welcome back
                </h1>
                <p className="text-sm text-slate-500 mb-6">
                  Sign in to access your autonomous AI marketing workforce
                </p>

                {error && (
                  <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium animate-fade-in">
                    {error}
                  </div>
                )}

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      required
                      value={emailOrUser}
                      onChange={(e) => setEmailOrUser(e.target.value)}
                      placeholder="Username or Email (crosstech)"
                      className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl text-sm text-neutral-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all shadow-sm"
                    />
                  </div>

                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password (crosstech123)"
                      className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl text-sm text-neutral-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all shadow-sm pr-11"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-4 bg-[#8d6268] hover:bg-[#7b5157] text-white font-semibold rounded-xl text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-60 cursor-pointer mt-2"
                  >
                    {loading ? 'Signing in...' : 'Sign in'}
                  </button>
                </form>

                <div className="mt-5 text-center">
                  <span className="text-xs text-slate-500">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setMode('signup');
                        setSignupStep(1);
                        setError(null);
                      }}
                      className="font-bold text-[#8d6268] hover:underline"
                    >
                      Create account
                    </button>
                  </span>
                </div>
              </div>
            )}

            {/* SIGN UP MODE - STEP 1 */}
            {mode === 'signup' && signupStep === 1 && (
              <div>
                <h1 className="text-3xl font-heading font-bold text-neutral-900 mb-2">
                  Create account
                </h1>
                <p className="text-sm text-slate-500 mb-6">
                  Let&apos;s get started with your 30 days trial
                </p>

                {error && (
                  <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium animate-fade-in">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSignupStep1} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Name"
                      className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl text-sm text-neutral-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all shadow-sm"
                    />
                  </div>

                  <div>
                    <input
                      type="email"
                      required
                      value={emailOrUser}
                      onChange={(e) => setEmailOrUser(e.target.value)}
                      placeholder="Email"
                      className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl text-sm text-neutral-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all shadow-sm"
                    />
                  </div>

                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl text-sm text-neutral-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all shadow-sm pr-11"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 bg-[#8d6268] hover:bg-[#7b5157] text-white font-semibold rounded-xl text-sm transition-all shadow-md hover:shadow-lg cursor-pointer mt-2"
                  >
                    Create account
                  </button>
                </form>

                <div className="mt-5 text-center">
                  <span className="text-xs text-slate-500">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setMode('login');
                        setError(null);
                      }}
                      className="font-bold text-[#8d6268] hover:underline"
                    >
                      Login
                    </button>
                  </span>
                </div>
              </div>
            )}

            {/* SIGN UP MODE - STEP 2: CREATE ORGANISATION */}
            {mode === 'signup' && signupStep === 2 && (
              <div className="animate-page-enter">
                <button
                  type="button"
                  onClick={() => setSignupStep(1)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-4 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to credentials
                </button>

                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold uppercase tracking-wider">
                    Step 2 of 2
                  </span>
                  <span className="text-xs text-slate-400">Account Ready</span>
                </div>

                <h1 className="text-2xl font-heading font-bold text-neutral-900 mb-1">
                  Create your Organisation
                </h1>
                <p className="text-xs text-slate-500 mb-6">
                  Set up your multi-tenant workspace to orchestrate your marketing workforce
                </p>

                {error && (
                  <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium animate-fade-in">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSignupComplete} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Organization Name
                    </label>
                    <input
                      type="text"
                      required
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      placeholder="e.g. CrossTech, Zenith Group"
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-neutral-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Primary Business Name
                    </label>
                    <input
                      type="text"
                      required
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="e.g. DTC Streetwear, B2B SaaS"
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-neutral-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Industry
                    </label>
                    <select
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all shadow-sm"
                    >
                      <option value="Technology & SaaS">Technology & SaaS</option>
                      <option value="E-Commerce & Retail">E-Commerce & Retail</option>
                      <option value="Fashion & Apparel">Fashion & Apparel</option>
                      <option value="Hospitality & Dining">Hospitality & Dining</option>
                      <option value="Agency & Professional Services">Agency & Professional Services</option>
                      <option value="Healthcare & Wellness">Healthcare & Wellness</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-4 bg-[#8d6268] hover:bg-[#7b5157] text-white font-semibold rounded-xl text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2 mt-2"
                  >
                    <span>{loading ? 'Launching Workspace...' : 'Launch Workspace'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Social Sign-in Icons (only shown on step 1) */}
          {(mode === 'login' || signupStep === 1) && (
            <div className="pt-6 mt-6 border-t border-slate-100">
              <div className="flex items-center justify-center gap-4">
                {/* Google */}
                <button
                  type="button"
                  title="Sign in with Google"
                  onClick={() => {
                    setEmailOrUser('crosstech');
                    setPassword('crosstech123');
                  }}
                  className="w-14 h-12 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow hover:border-slate-300 flex items-center justify-center transition-all cursor-pointer group"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                </button>

                {/* Apple */}
                <button
                  type="button"
                  title="Sign in with Apple"
                  onClick={() => {
                    setEmailOrUser('crosstech');
                    setPassword('crosstech123');
                  }}
                  className="w-14 h-12 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow hover:border-slate-300 flex items-center justify-center transition-all cursor-pointer group"
                >
                  <svg className="w-5 h-5 fill-neutral-900" viewBox="0 0 170 170">
                    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.6-7.85-11.75-14.43-6.42-10.13-11.45-21.72-15.09-34.78-3.64-13.06-5.46-25.26-5.46-36.6 0-14.36 3.48-26.4 10.45-36.14 6.97-9.74 15.82-14.76 26.56-15.04 4.71 0 10.02 1.3 15.93 3.91 5.92 2.61 9.54 3.97 10.88 4.09 1.74-.18 5.63-1.61 11.66-4.3 6.04-2.69 11.2-3.84 15.5-3.46 11.83.94 21.2 5.34 28.1 13.2-10.43 6.35-15.53 15.22-15.31 26.62.22 9.04 3.65 16.7 10.3 22.97 6.64 6.27 14.54 9.87 23.68 10.8-2.3 6.78-4.99 13.43-8.08 19.93zM119.22 33.15c0-6.73 2.45-13.1 7.35-19.1 4.9-6 10.98-9.84 18.23-11.53.5 2.18.75 4.3.75 6.36 0 6.62-2.52 13-7.55 19.14-5.04 6.13-11.28 9.93-18.73 11.4-.04-2.12-.05-4.21-.05-6.27z" />
                  </svg>
                </button>

                {/* Facebook */}
                <button
                  type="button"
                  title="Sign in with Facebook"
                  onClick={() => {
                    setEmailOrUser('crosstech');
                    setPassword('crosstech123');
                  }}
                  className="w-14 h-12 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow hover:border-slate-300 flex items-center justify-center transition-all cursor-pointer group"
                >
                  <svg className="w-5 h-5 fill-[#1877F2]" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Artwork Card Matching the User's Sunset Landscape */}
        <div className="w-full lg:w-1/2 p-4 lg:p-6 bg-slate-50 flex items-center justify-center">
          <div className="w-full h-full min-h-[460px] rounded-[1.75rem] overflow-hidden relative shadow-lg flex flex-col justify-between p-8 text-white select-none">
            {/* Background SVG Artwork replicating the sunset / mountain gradient & trees */}
            <svg
              className="absolute inset-0 w-full h-full object-cover"
              viewBox="0 0 500 700"
              preserveAspectRatio="xMidYMid slice"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Sky Gradient */}
                <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#f7d4b2" />
                  <stop offset="25%" stopColor="#f3b89f" />
                  <stop offset="50%" stopColor="#df8e8e" />
                  <stop offset="75%" stopColor="#9c6d86" />
                  <stop offset="100%" stopColor="#675574" />
                </linearGradient>

                {/* Sun Glow */}
                <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                  <stop offset="30%" stopColor="#fff2dc" stopOpacity="0.8" />
                  <stop offset="65%" stopColor="#fcd3a8" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#fcd3a8" stopOpacity="0" />
                </radialGradient>

                {/* Soft Horizon Mist */}
                <linearGradient id="mistGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#e3d6e5" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#c5b7cb" stopOpacity="0.95" />
                </linearGradient>

                {/* Foreground Mountain / Valley */}
                <linearGradient id="snowValley" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#e8dfec" />
                  <stop offset="50%" stopColor="#d5c8dc" />
                  <stop offset="100%" stopColor="#baa9c3" />
                </linearGradient>
              </defs>

              {/* Sky Backdrop */}
              <rect width="500" height="700" fill="url(#skyGrad)" />

              {/* Radiant Sunset Orb */}
              <circle cx="340" cy="240" r="100" fill="url(#sunGlow)" />
              <circle cx="340" cy="240" r="42" fill="#fffcf7" />

              {/* Distant Mountain Ridge */}
              <path
                d="M-20 400 Q 120 350 250 370 T 520 330 L 520 720 L -20 720 Z"
                fill="#ba7c6f"
                opacity="0.85"
              />

              {/* Midground Hill Slope */}
              <path
                d="M-20 440 Q 160 410 320 450 T 520 410 L 520 720 L -20 720 Z"
                fill="#8f5b68"
              />

              {/* Foreground Snowy Plateau (Right Curve) */}
              <path
                d="M520 360 C 440 370 380 430 380 480 C 380 540 450 560 520 570 Z"
                fill="url(#snowValley)"
              />

              {/* Main Foreground Soft Snow Valley */}
              <path
                d="M-20 480 Q 180 460 380 500 T 520 540 L 520 720 L -20 720 Z"
                fill="url(#snowValley)"
              />

              {/* Stylized Modern Striped Shell / Flora Element */}
              <g transform="translate(390, 270) scale(0.65)">
                <ellipse cx="60" cy="50" rx="45" ry="35" fill="#2d2538" />
                <path d="M 25 50 Q 60 20 95 50" stroke="#d5c8dc" strokeWidth="4" fill="none" />
                <path d="M 32 50 Q 60 28 88 50" stroke="#d5c8dc" strokeWidth="4" fill="none" />
                <path d="M 40 50 Q 60 36 80 50" stroke="#d5c8dc" strokeWidth="3" fill="none" />
              </g>

              {/* Silhouetted Bare Trees (Center Foreground) */}
              <g stroke="#261b2e" strokeWidth="3" strokeLinecap="round" opacity="0.92">
                {/* Main Tall Tree */}
                <path d="M295 690 L295 520" strokeWidth="5" />
                <path d="M295 610 Q 280 580 270 560" />
                <path d="M295 590 Q 315 565 325 540" />
                <path d="M295 550 Q 285 530 280 510" />
                <path d="M295 540 Q 308 520 315 505" />
                <path d="M270 560 Q 260 550 255 535" strokeWidth="2" />
                <path d="M325 540 Q 335 530 340 515" strokeWidth="2" />
                <path d="M295 520 L290 490" strokeWidth="3" />
                <path d="M295 520 L300 488" strokeWidth="2.5" />

                {/* Left Smaller Tree */}
                <path d="M190 680 L190 560" strokeWidth="4" />
                <path d="M190 630 Q 178 610 170 595" />
                <path d="M190 615 Q 205 595 212 580" />
                <path d="M190 580 Q 182 565 178 550" />
                <path d="M190 560 L186 535" strokeWidth="2.5" />
                <path d="M190 560 L195 538" strokeWidth="2" />

                {/* Right Accent Tree */}
                <path d="M410 690 L410 550" strokeWidth="4" />
                <path d="M410 620 Q 395 600 388 580" />
                <path d="M410 600 Q 425 580 435 560" />
                <path d="M410 570 Q 402 550 398 535" />
                <path d="M410 550 L406 525" strokeWidth="2.5" />
                <path d="M410 550 L416 528" strokeWidth="2" />
              </g>
            </svg>

            {/* Overlay Text Cards inside the Artwork */}
            <div className="relative z-10 flex justify-between items-start">
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-bold tracking-wide uppercase border border-white/30 text-white">
                Synergy Platform
              </span>
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </div>

            <div className="relative z-10 space-y-2">
              <h2 className="font-heading font-extrabold text-2xl lg:text-3xl leading-tight drop-shadow-sm">
                One workspace.
                <br />
                Entire AI marketing workforce.
              </h2>
              <p className="text-xs text-white/90 max-w-sm drop-shadow-sm font-medium">
                Strategists, copywriters, visual designers, and QA agents coordinating
                autonomously for your brand.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#f5f6f8] text-slate-400 text-sm">
          Loading...
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
