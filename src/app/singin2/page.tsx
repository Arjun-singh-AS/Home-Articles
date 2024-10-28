'use client';
import { useState } from 'react';
import jwt from 'jsonwebtoken';
// import cookie from 'cookie';
// import { cookies } from 'next/headers';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
export const dynamic = 'force-dynamic';

const AuthForm = () => {
  const route=useRouter()
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { setHasIdToken, user}=useUser()
  
  const toggleForm = () => {
    setIsLogin((prev) => !prev);
    setFormData({ username: '', email: '', phone: '', password: '' });
    setError('');
    setSuccess('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const endpoint = isLogin ? '/api/signin' : '/api/signup'; // Ensure correct endpoint
      const { email, password, username, phone } = formData;

      const requestData = isLogin ? { email, password } : { username, email, phone, password };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });
      
      const data = await response.json();
      console.log('This is the response:', response.headers);
      
      console.log("token",data.token)
      console.log('token setup')
      if (response.ok) {
   
        localStorage.setItem('authToken', data.token);
        setSuccess(isLogin ? 'Logged in successfully!' : 'User registered successfully ! Now verify your email');
        const decodedToken = jwt.decode(data.token) as { id: string; email: string; phone: string};
        console.log('decodedtoken',decodedToken)
        
        if(!isLogin){
          // Redirect to OTP check page and pass email as query parameter
          route.push('/otpverify')
        }
        else{
          alert('Sign In Successfully')
          route.push('/')
        }
        
        setFormData({ username: '', email: 
          '', phone: '', password: '' });
        setHasIdToken(data.token)
        console.log(user)
          
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Something went wrong. Please try again later.');
      console.log(err)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[50rem] flex justify-center items-center min-h-screen bg-dark-200">
      <div
        className={`relative w-3/4 h-[500px] transition-all duration-700 ease-in-out ${
          isLogin ? '' : 'rotate-180'
        }`}
        style={{
          background: 'linear-gradient(45deg, white 50%, black 50%)',
        }}
      >
        {/* Form Container */}
        <div
          className={`absolute inset-0 flex justify-center items-center transition-all duration-700 ease-in-out ${
            isLogin ? '' : 'rotate-180'
          }`}
        >
          <div className="flex-1 p-10">
            {isLogin ? (
              <div className="text-white">
                <h2 className="text-3xl font-bold mb-6 text-black">Login</h2>
                <form onSubmit={handleSubmit}>
                  {error && <p className="text-red-500 mb-4">{error}</p>}
                  {success && <p className="text-green-500 mb-4">{success}</p>}
                  <div className="mb-4">
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleChange}
                      className="p-2 rounded w-full bg-black text-white focus:outline-none"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                      className="p-2 rounded w-full bg-black text-white focus:outline-none"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    disabled={loading}
                  >
                    {loading ? 'Logging in...' : 'Login'}
                  </button>
                  <p className="mt-4 text-black">
                    Do not have an account?{' '}
                    <span onClick={toggleForm} className="cursor-pointer text-blue-400">
                      Sign Up
                    </span>
                  </p>
                </form>
              </div>
            ) : (
              <div className="text-black">
                <h2 className="text-3xl font-bold mb-6 text-white">Sign Up</h2>
                <form onSubmit={handleSubmit}>
                  {error && <p className="text-red-500 mb-4">{error}</p>}
                  {success && <p className="text-green-500 mb-4">{success}</p>}
                  <div className="mb-4">
                    <input
                      type="text"
                      name="username"
                      placeholder="Username"
                      value={formData.username}
                      onChange={handleChange}
                      className="p-2 rounded w-full bg-white text-black focus:outline-none"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleChange}
                      className="p-2 rounded w-full bg-white text-black focus:outline-none"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <input
                      type="text"
                      name="phone"
                      placeholder="Phone No."
                      value={formData.phone}
                      onChange={handleChange}
                      className="p-2 rounded w-full bg-white text-black focus:outline-none"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                      className="p-2 rounded w-full bg-white text-black focus:outline-none"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    // disabled={loading}
                  >
                    {loading ? 'Signing up...' : 'Sign Up'}
                  </button>
                  <p className="mt-4 text-white">
                    Already have an account?{' '}
                    <span onClick={toggleForm} className="cursor-pointer text-blue-400">
                      Login
                    </span>
                  </p>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
