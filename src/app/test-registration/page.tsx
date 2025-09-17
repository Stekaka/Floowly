'use client';

import { useState } from 'react';

export default function TestRegistrationPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testRegistration = async () => {
    setLoading(true);
    setResult(null);

    try {
      const testData = {
        email: `test${Date.now()}@example.com`,
        password: 'password123',
        name: 'Test User',
        companyName: `Test Company ${Date.now()}`
      };

      console.log('Sending registration request:', testData);

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      const data = await response.json();
      console.log('Response data:', data);

      setResult({
        status: response.status,
        ok: response.ok,
        data: data,
        headers: Object.fromEntries(response.headers.entries())
      });

    } catch (error) {
      console.error('Registration test error:', error);
      setResult({
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-8">Registration Test</h1>
        
        <button
          onClick={testRegistration}
          disabled={loading}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Registration'}
        </button>

        {result && (
          <div className="mt-8 bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-white mb-4">Result:</h2>
            <pre className="text-green-400 text-sm overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
