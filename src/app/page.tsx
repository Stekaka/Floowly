'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  // Add timeout for loading state
  useEffect(() => {
    if (status === 'loading') {
      const timer = setTimeout(() => {
        // If still loading after 5 seconds, clear session and redirect to login
        fetch('/api/auth/logout', { method: 'POST' })
          .then(() => router.push('/login'))
          .catch(() => router.push('/login'));
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [status, router]);

  // Countdown timer
  useEffect(() => {
    if (status === 'loading') {
      const interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [status]);

  // Always show loading while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading... Status: {status}</p>
          <p className="text-slate-300 text-sm mt-2">Clearing session and redirecting to login in {countdown} seconds...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show loading while redirecting
  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-slate-300">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-6xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              CarWrap Pro
            </span>
          </h1>
          <p className="text-xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            The exclusive car wrapping CRM that transforms your business. 
            <span className="text-purple-400 font-semibold"> Premium features</span> for 
            <span className="text-pink-400 font-semibold"> elite professionals</span>.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Link 
              href="/dashboard" 
              className="group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-purple-500/25"
            >
              <span className="flex items-center justify-center">
                Go to Dashboard
                <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
            <Link 
              href="/customers" 
              className="group bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-pink-500/25"
            >
              <span className="flex items-center justify-center">
                Manage Customers
                <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
            <Link 
              href="/quotes" 
              className="group bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-indigo-500/25"
            >
              <span className="flex items-center justify-center">
                Create Quotes
                <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="group bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-8 rounded-2xl hover:border-purple-500/50 transition-all duration-300 hover:transform hover:scale-105">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Premium Customer Management</h2>
            <p className="text-slate-300 leading-relaxed">Advanced customer profiles with complete history tracking, communication logs, and relationship insights.</p>
          </div>

          <div className="group bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-8 rounded-2xl hover:border-pink-500/50 transition-all duration-300 hover:transform hover:scale-105">
            <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Smart Quote & Job System</h2>
            <p className="text-slate-300 leading-relaxed">Intelligent pricing with real-time profit calculations, material tracking, and automated workflow management.</p>
          </div>

          <div className="group bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-8 rounded-2xl hover:border-indigo-500/50 transition-all duration-300 hover:transform hover:scale-105">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Advanced Calendar</h2>
            <p className="text-slate-300 leading-relaxed">Visualize your entire operation with drag-and-drop scheduling, resource allocation, and deadline management.</p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/30 rounded-2xl p-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-8">Exclusive Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-4xl font-bold text-purple-400 mb-2">100%</div>
              <div className="text-slate-300">Secure</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-pink-400 mb-2">24/7</div>
              <div className="text-slate-300">Support</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-indigo-400 mb-2">∞</div>
              <div className="text-slate-300">Scalable</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">Pro</div>
              <div className="text-slate-300">Grade</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
