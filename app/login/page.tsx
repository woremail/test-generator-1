'use client';

import { useState, useLayoutEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import Head from 'next/head';
import Link from 'next/link';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase/firebase';


export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Teacher');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const cardRef = useRef(null);
  const iconRef = useRef(null);

  useLayoutEffect(() => {
    gsap.from(cardRef.current, {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: 'power3.out',
    });

    gsap.from(iconRef.current, {
      scale: 0,
      duration: 0.6,
      delay: 0.3,
      ease: 'back.out(1.7)',
    });
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Sign in with Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Assuming role is stored in a custom claim or user profile
      // You may need to adjust this based on how roles are managed in your Firebase setup
      const idTokenResult = await user.getIdTokenResult();
      const userRole = idTokenResult.claims.role || role; // Fallback to selected role if no claim

      // Redirect based on role
      if (userRole === 'Admin') {
        router.push('/admin/dashboard');
      } else if (userRole === 'Teacher') {
        router.push('/teacher/dashboard');
      } else if (userRole === 'Student') {
        router.push('/student/dashboard');
      } else {
        throw new Error('Invalid role');
      }
    } catch (err) {
      setError(err.message || 'Failed to log in. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <link rel="preload" href="/login-bg.svg" as="image" />
      </Head>

      {/* Navbar */}
      <nav className="w-full bg-[#002147] text-white shadow-md fixed top-0 left-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo only */}
          <div className="flex items-center">
            <img src="/logo.png" alt="Logo" className="w-25 h-12 object-contain" />
          </div>

          {/* Navigation Links */}
          <div className="space-x-6 text-sm font-medium hidden md:flex">
            <Link href="/" className="hover:text-gray-300 transition">Home</Link>
            <Link href="#features" className="hover:text-gray-300 transition">Features</Link>
            <Link href="/login" className="hover:text-gray-300 transition">Login</Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative min-h-screen bg-white flex items-center justify-center p-4 pt-24 overflow-hidden">
        {/* Background Illustration */}
        <div className="absolute inset-0 -z-10 bg-[url('/login-bg.svg')] bg-cover bg-center opacity-10 animate-fadeIn"></div>

        {/* Login Card */}
        <div className="w-full max-w-sm" ref={cardRef}>
          <div
            className="bg-white backdrop-blur-md rounded-xl shadow-xl p-6 border border-slate-200"
            style={{ willChange: 'opacity, transform', transform: 'translateZ(0)' }}
          >
            <div className="text-center mb-4">
              <div ref={iconRef} className="flex justify-center mb-3">
                <img src="/icon.png" alt="Logo" className="w-8 h-8 object-contain" />
              </div>
              <h1 className="text-xl font-semibold text-[#002147]">Welcome Back</h1>
              <p className="text-xs text-[#4b5563]">Log in to access your dashboard</p>
            </div>

            {error && (
              <div className="text-red-500 text-xs text-center mb-3">{error}</div>
            )}

            <form onSubmit={handleLogin} className="space-y-4 text-xs">
              <div>
                <label htmlFor="email" className="block text-[#002147] mb-1 font-medium">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#002147] focus:outline-none transition"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-[#002147] mb-1 font-medium">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#002147] focus:outline-none transition"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div>
                <label htmlFor="role" className="block text-[#002147] mb-1 font-medium">Role</label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#002147] focus:outline-none bg-white transition"
                >
                  <option value="Teacher">Teacher</option>
                  <option value="Admin">Admin</option>
                  <option value="Student">Student</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#002147] hover:bg-[#1e3a8a] text-white py-1.5 rounded-md transition flex items-center justify-center shadow-md"
              >
                {isLoading ? (
                  <>
                    <i className="ri-loader-4-line animate-spin mr-2"></i>
                    Logging in...
                  </>
                ) : (
                  <>
                    <i className="ri-login-circle-line mr-2"></i>
                    Login
                  </>
                )}
              </button>
            </form>

            <div className="mt-4 text-center text-xs text-[#4b5563]">
              {/* Demo login: use any email and password */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}