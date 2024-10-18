'use client';
import React, { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import jwt from 'jsonwebtoken';
import { useUser } from '@/context/UserContext';

interface OTPFormProps {
  email: string;
}

const OTPForm: React.FC<OTPFormProps> = () => {
  const router = useRouter();
  const [otp, setOtp] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [id, setId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [phone, setPhone] = useState<string | null>(null);
  
  console.log("otp verify front")

  useEffect(() => {
    // Retrieve and decode the token when the component mounts
    const token = localStorage.getItem('authToken');
    console.log("otp verify front token",token)
    if (!token) {
      console.log('No token found, redirecting to login...');
      router.push('/signin2');
      return;
    }
    try {
      const decodedToken = jwt.decode(token) as { id: string; email: string; phone: string };
      if (decodedToken) {
        setId(decodedToken.id);
        console.log(id)
        setEmail(decodedToken.email);
        setPhone(decodedToken.phone);
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      router.push('/signin2');
    }
  }, [router]);

  const handleOTPSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    console.log("this is hadle of otp front")
    try {
      const response = await fetch('/api/otpverify', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ id, otp }),
      });

      const result = await response.json();
      console.log(result)

      if (result.success) {
        setSuccess('OTP verified successfully!');
        alert('OTP verified successfully!')
        router.push('/')
      } else {
        setError('OTP verification failed! Please try again.');
      }
    } catch (err) {
      setError('An error occurred while verifying OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Verify OTP</h2>
        <p className="text-center text-gray-600 mb-6">
          We sent an OTP to <span className="font-semibold">{email}</span>. Please enter it below to verify your account.
        </p>

        <form onSubmit={handleOTPSubmit} className="space-y-4">
          {error && <p className="text-red-500 text-center">{error}</p>}
          {success && <p className="text-green-500 text-center">{success}</p>}

          <div>
            <input
              type="text"
              name="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full p-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all duration-300"
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>

        {success && (
          <div className="mt-6 text-center">
            <button
              onClick={() => window.location.href = '/'}
              className="text-blue-500 hover:underline"
            >
              Go to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OTPForm;
