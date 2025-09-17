'use client';

import Link from 'next/link';

export default function TestPage() {
  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-6">
        <h1 className="text-3xl font-bold text-white mb-8">Test Navigation</h1>
        
        <div className="space-y-4">
          <Link 
            href="/dashboard" 
            className="block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Go to Dashboard
          </Link>
          
          <Link 
            href="/customers" 
            className="block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Go to Customers
          </Link>
          
          <Link 
            href="/quotes" 
            className="block bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Go to Quotes
          </Link>
          
          <Link 
            href="/calendar" 
            className="block bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Go to Calendar
          </Link>
          
          <Link 
            href="/profile" 
            className="block bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Go to Profile
          </Link>
        </div>
        
        <div className="mt-8 p-4 bg-slate-800 rounded-lg">
          <h2 className="text-xl font-semibold text-white mb-4">Debug Info</h2>
          <p className="text-slate-300">If you can see this page and click the links above, navigation is working.</p>
          <p className="text-slate-300 mt-2">If the links don't work, there's a JavaScript or routing issue.</p>
        </div>
      </div>
    </div>
  );
}
