'use client'

import { motion } from 'framer-motion';
import { Mail, Lock, User, Phone } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ChatbotProvider } from '@/components/chatbot';

// Ensure Poppins in globals.css:
// @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');
// html, body { font-family: 'Poppins', sans-serif; }

const RegisterPage = () => {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [agree, setAgree] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!agree) {
      setError('Please accept the Terms & Privacy Policy.');
      return;
    }
    if (password.length < 8) {
      setError('Password should be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('https://nvccz-pi.vercel.app/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fullName,
          phone,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (data?.success) {
        setSuccess('Account created successfully. Redirecting to login…');
        // Optionally auto-login or redirect
        setTimeout(() => router.push('/login'), 900);
      } else {
        setError(data?.message || 'Registration failed.');
      }
    } catch {
      setError('An error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  // Simple strength hint
  const strengthHint =
    password.length >= 12 ? 'Strong' :
    password.length >= 8 ? 'Good' : 'Weak';

  return (
    <ChatbotProvider position="bottom-left">
      <div className="relative min-h-screen overflow-hidden font-poppins">
        {/* Background image */}
        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="absolute inset-0 -z-10"
        >
          <Image
            src="/login/bg-login.jpg"  // update extension if needed
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>

        {/* Blue/Gray overlay */}
        <motion.div
          aria-hidden
          className="absolute inset-0 -z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.9 }}
          transition={{ duration: 0.8 }}
          style={{
            background:
              'linear-gradient(135deg, rgba(0,86,164,0.45), rgba(203,213,225,0.55))',
          }}
        />
        <div
          className="absolute inset-0 -z-10 pointer-events-none animate-slow-shift"
          style={{
            background:
              'radial-gradient(1200px 600px at 80% 20%, rgba(0,86,164,0.18), transparent 60%), radial-gradient(1000px 500px at 10% 90%, rgba(148,163,184,0.22), transparent 60%)',
          }}
        />

        {/* Content */}
        <div className="flex items-center justify-center min-h-screen p-4">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="w-full max-w-xl"
          >
            <div
              className="p-8 md:p-10 rounded-2xl shadow-xl backdrop-blur-md"
              style={{
                backgroundColor: 'rgba(255,255,255,0.92)',
                border: '1px solid rgba(0,0,0,0.08)',
              }}
            >
              <div className="text-center mb-8">
                <h1 className="text-4xl font-light text-black mb-2 tracking-wide">
                  Create your account
                </h1>
                <p className="text-lg text-gray-700">
                  Join NVCCZ and get started
                </p>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 bg-gray-200 text-gray-800 rounded-lg text-base"
                >
                  {error}
                </motion.div>
              )}

              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 bg-gray-100 text-gray-800 border border-gray-300 rounded-lg text-base"
                >
                  {success}
                </motion.div>
              )}

              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Full Name */}
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                  <label htmlFor="fullName" className="block text-lg font-light text-black mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      required
                      className="block w-full pl-10 pr-3 py-3 rounded-lg bg-gray-100 border border-gray-400 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0056A4] focus:border-transparent transition"
                      placeholder="Jane Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                </motion.div>

                {/* Phone (optional) */}
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
                  <label htmlFor="phone" className="block text-lg font-light text-black mb-1">
                    Phone (optional)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      className="block w-full pl-10 pr-3 py-3 rounded-lg bg-gray-100 border border-gray-400 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0056A4] focus:border-transparent transition"
                      placeholder="+263 7x xxx xxxx"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </motion.div>

                {/* Email */}
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                  <label htmlFor="email" className="block text-lg font-light text-black mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="block w-full pl-10 pr-3 py-3 rounded-lg bg-gray-100 border border-gray-400 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0056A4] focus:border-transparent transition"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </motion.div>

                {/* Password */}
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
                  <label htmlFor="password" className="block text-lg font-light text-black mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      className="block w-full pl-10 pr-3 py-3 rounded-lg bg-gray-100 border border-gray-400 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0056A4] focus:border-transparent transition"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="mt-1 text-sm text-gray-600">
                    Strength: {strengthHint}
                  </div>
                </motion.div>

                {/* Confirm Password */}
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                  <label htmlFor="confirm" className="block text-lg font-light text-black mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                      id="confirm"
                      name="confirm"
                      type="password"
                      required
                      className="block w-full pl-10 pr-3 py-3 rounded-lg bg-gray-100 border border-gray-400 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0056A4] focus:border-transparent transition"
                      placeholder="••••••••"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                    />
                  </div>
                </motion.div>

                {/* Terms */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="flex items-start gap-2">
                  <input
                    id="agree"
                    name="agree"
                    type="checkbox"
                    checked={agree}
                    onChange={(e) => setAgree(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded bg-gray-200 border-gray-500 text-[#0056A4] focus:ring-[#0056A4]"
                  />
                  <label htmlFor="agree" className="text-base text-gray-700">
                    I agree to the{' '}
                    <Link href="/terms" className="text-[#0056A4] hover:underline">Terms</Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-[#0056A4] hover:underline">Privacy Policy</Link>.
                  </label>
                </motion.div>

                {/* Submit */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full flex justify-center py-3 px-4 rounded-lg shadow-md text-lg font-semibold text-white bg-[#0056A4] hover:bg-[#064f94] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0056A4] transition-colors duration-300 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {loading ? 'Creating account…' : 'Create account'}
                  </button>
                </motion.div>
              </form>

              {/* Login link */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }} className="mt-6 text-center">
                <p className="text-lg text-gray-700">
                  Already have an account?{' '}
                  <Link href="/login" className="font-medium text-[#0056A4] hover:underline">
                    Sign in
                  </Link>
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Local styles for background animation (same as Login) */}
        <style jsx>{`
          @keyframes slowShift {
            0%   { transform: translate3d(0,0,0); }
            50%  { transform: translate3d(-1.5%, -1.5%, 0); }
            100% { transform: translate3d(0,0,0); }
          }
          .animate-slow-shift {
            animation: slowShift 18s ease-in-out infinite;
          }
        `}</style>
      </div>
    </ChatbotProvider>
  );
};

export default RegisterPage;
