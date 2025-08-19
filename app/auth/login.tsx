'use client'

import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, AlertCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formTouched, setFormTouched] = useState(false);
  const router = useRouter();

  // Form validation
  const [emailValid, setEmailValid] = useState(true);
  const [passwordValid, setPasswordValid] = useState(true);

  useEffect(() => {
    if (formTouched) {
      validateEmail();
      validatePassword();
    }
  }, [email, password, formTouched]);

  const validateEmail = () => {
    const isValid = Boolean(email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
    setEmailValid(isValid);
    return isValid;
  };

  const validatePassword = () => {
    const isValid = Boolean(password && password.length >= 6);
    setPasswordValid(isValid);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormTouched(true);
    
    // Validate form
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    
    if (!isEmailValid || !isPasswordValid) {
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      // Mock login for development/testing
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Accept any email with valid format and any password with 6+ characters
      if (isEmailValid && isPasswordValid) {
        // Mock successful login
        const mockToken = 'mock-jwt-token-' + Math.random().toString(36).substring(2);
        const mockUserId = 'user-' + Math.random().toString(36).substring(2);
        
        // Store in session storage
        sessionStorage.setItem('token', mockToken);
        sessionStorage.setItem('userID', mockUserId);
        
        if (rememberMe) {
          // In a real app, you'd use a more secure method for "remember me"
          localStorage.setItem('rememberedEmail', email);
        }
        
        // Redirect to home page
        router.push('/');
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background with image and overlay */}
      <div className="absolute inset-0">
        {/* Background image */}
        <div 
          className="absolute inset-0 bg-cover bg-center animate-slow-shift"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80")',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/90 via-primary-800/80 to-primary-700/90" />
        
        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating circles */}
          <div className="absolute top-[10%] left-[15%] w-3 h-3 rounded-full bg-white opacity-20 animate-float-1"></div>
          <div className="absolute top-[20%] left-[35%] w-2 h-2 rounded-full bg-white opacity-15 animate-float-2"></div>
          <div className="absolute top-[15%] left-[75%] w-4 h-4 rounded-full bg-white opacity-10 animate-float-3"></div>
          <div className="absolute top-[45%] left-[80%] w-3 h-3 rounded-full bg-white opacity-20 animate-float-2"></div>
          <div className="absolute top-[65%] left-[25%] w-2 h-2 rounded-full bg-white opacity-15 animate-float-1"></div>
          <div className="absolute top-[75%] left-[85%] w-4 h-4 rounded-full bg-white opacity-10 animate-float-3"></div>
          <div className="absolute top-[85%] left-[50%] w-3 h-3 rounded-full bg-white opacity-20 animate-float-1"></div>
          
          {/* Financial icons */}
          <div className="absolute top-[30%] left-[10%] text-white opacity-10 animate-float-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-16 h-16">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
            </svg>
          </div>
          
          <div className="absolute top-[70%] left-[75%] text-white opacity-10 animate-float-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-20 h-20">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          </div>
          
          {/* Abstract shapes */}
          <div className="absolute top-[20%] left-[80%] w-32 h-32 animate-float-1">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-10">
              <path fill="#FFFFFF" d="M47.1,-57.8C59.5,-47.8,67.6,-31.5,71.5,-14.1C75.4,3.3,75.2,21.7,67.1,35.8C59,49.9,43,59.6,26.1,65.9C9.2,72.2,-8.7,75,-25.6,70.5C-42.5,66,-58.3,54.2,-67.2,38.5C-76.1,22.8,-78,3.2,-73.2,-14.3C-68.4,-31.8,-56.9,-47.2,-42.8,-56.8C-28.7,-66.4,-12,-70.2,3.2,-74.1C18.4,-78,36.8,-82,47.1,-57.8Z" transform="translate(100 100)" />
            </svg>
          </div>
          
          <div className="absolute top-[60%] left-[5%] w-40 h-40 animate-float-2">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-10">
              <path fill="#FFFFFF" d="M42.8,-62.2C54.9,-54.3,63.6,-40.9,69.7,-26.2C75.8,-11.5,79.3,4.6,75.9,19.5C72.5,34.4,62.2,48.2,48.9,57.9C35.6,67.6,19.3,73.2,2.2,70.6C-14.9,68,-32.8,57.2,-45.7,44C-58.6,30.8,-66.5,15.4,-69.2,-2.7C-71.9,-20.8,-69.4,-41.6,-58.5,-50.1C-47.6,-58.6,-28.3,-54.8,-11.9,-51.5C4.5,-48.2,30.7,-70.1,42.8,-62.2Z" transform="translate(100 100)" />
            </svg>
          </div>
        </div>
        
        {/* Light beams effect */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-1/2 h-full bg-gradient-to-b from-blue-400/30 to-transparent transform -rotate-45"></div>
          <div className="absolute top-0 left-1/3 w-1/3 h-full bg-gradient-to-b from-blue-300/20 to-transparent transform rotate-45"></div>
        </div>
        
        {/* Wave pattern at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-48 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%23FFFFFF' fill-opacity='1' d='M0,192L48,176C96,160,192,128,288,133.3C384,139,480,181,576,186.7C672,192,768,160,864,154.7C960,149,1056,171,1152,165.3C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'%3E%3C/path%3E%3C/svg%3E")`,
            backgroundSize: 'cover'
          }}
        />
      </div>
      
      {/* Header with logo */}
      <div className="absolute top-0 left-0 w-full p-6 z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3"
        >
          <div className="h-10 w-10 rounded-lg bg-white shadow-lg flex items-center justify-center">
            <span className="text-primary-600 font-bold text-lg">N</span>
          </div>
          <div className="text-white">
            <div className="text-xl font-semibold text-shadow-sm drop-shadow-sm">NVCCZ</div>
            <div className="text-xs font-medium text-white">Financial Hub</div>
          </div>
        </motion.div>
      </div>
      
      {/* Main content - centered login form */}
      <div className="relative min-h-screen flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-md mb-8 text-center text-white"
        >
         
        </motion.div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md relative"
        >
          {/* Card glow effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-200 to-blue-400 rounded-2xl blur opacity-30 animate-pulse"></div>
          
          <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/30 overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full opacity-20"></div>
            <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-gradient-to-tr from-blue-400 to-indigo-600 rounded-full opacity-20"></div>
            
            {/* Glass effect highlight */}
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white/40 to-transparent"></div>
            
            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 opacity-5" 
                style={{ 
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%230056A4' fill-opacity='0.2' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                }}
            ></div>
            {/* Error message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2"
                >
                  <AlertCircle size={18} className="flex-shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
              {/* Email */}
              <motion.div variants={itemVariants}>
                <label htmlFor="email" className="block text-sm font-medium text-primary-900 mb-2">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-primary-400 group-focus-within:text-primary-600 transition-colors" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className={`block w-full pl-11 pr-3 py-3.5 rounded-xl bg-white/80 backdrop-blur-sm border-2 ${!emailValid && formTouched ? 'border-red-300 ring-1 ring-red-300' : 'border-primary-200 hover:border-primary-300'} text-primary-900 placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all shadow-sm`}
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => setFormTouched(true)}
                  />
                  {emailValid && email && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <div className="h-5 w-5 text-green-500">✓</div>
                    </div>
                  )}
                </div>
                {!emailValid && formTouched && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-red-600 flex items-center gap-1.5 bg-red-50 p-2 rounded-lg"
                  >
                    <AlertCircle size={14} />
                    Please enter a valid email address
                  </motion.p>
                )}
              </motion.div>

              {/* Password */}
              <motion.div variants={itemVariants}>
                <label htmlFor="password" className="block text-sm font-medium text-primary-900 mb-2">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-primary-400 group-focus-within:text-primary-600 transition-colors" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    className={`block w-full pl-11 pr-11 py-3.5 rounded-xl bg-white/80 backdrop-blur-sm border-2 ${!passwordValid && formTouched ? 'border-red-300 ring-1 ring-red-300' : 'border-primary-200 hover:border-primary-300'} text-primary-900 placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-all shadow-sm`}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => setFormTouched(true)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-primary-400 hover:text-primary-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400 rounded-full"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {!passwordValid && formTouched && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-red-600 flex items-center gap-1.5 bg-red-50 p-2 rounded-lg"
                  >
                    <AlertCircle size={14} />
                    Password must be at least 6 characters
                  </motion.p>
                )}
              </motion.div>

              {/* Remember + Forgot */}
              <motion.div variants={itemVariants} className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-5 w-5 rounded-md border-2 border-primary-300 text-primary-600 focus:ring-primary-500 transition-colors"
                    />
                    <div className="absolute inset-0 bg-primary-100 rounded opacity-0 group-hover:opacity-30 transition-opacity"></div>
                  </div>
                  <span className="text-sm text-primary-700 group-hover:text-primary-900 transition-colors">Remember me</span>
                </label>
                <div className="text-sm">
                  <Link href="/forgot-password" className="font-medium text-primary-600 hover:text-primary-800 transition-colors hover:underline">
                    Forgot password?
                  </Link>
                </div>
              </motion.div>

              {/* Button */}
              <motion.div variants={itemVariants} className="pt-3">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl shadow-lg text-base font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'}`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in
                      <ArrowRight size={18} className="animate-pulse-slow" />
                    </>
                  )}
                </button>
              </motion.div>
            </form>

            {/* Signup link */}
            <motion.div variants={itemVariants} className="mt-6 text-center">
              <p className="text-sm text-primary-700">
                Don&apos;t have an account?{' '}
                <Link href="/auth/register" className="font-medium text-blue-600 hover:text-blue-800 transition-colors hover:underline">
                  Create an account
                </Link>
              </p>
            </motion.div>
            
            {/* Security note */}
            <motion.div variants={itemVariants} className="mt-8 pt-4 border-t border-primary-100">
              <p className="text-xs text-primary-500 flex items-center justify-center gap-1.5 bg-blue-50 py-2 px-4 rounded-full shadow-sm">
                <Lock size={14} className="text-blue-500" />
                <span className="text-blue-700">Secure, encrypted connection</span>
              </p>
            </motion.div>
            
            {/* Social login options */}
            <motion.div variants={itemVariants} className="mt-6">
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-primary-100"></div>
                </div>
                <div className="relative px-4 bg-white text-xs font-medium text-primary-500">
                  Or continue with
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-3 gap-3">
                <button
                  type="button"
                  className="flex justify-center items-center py-2.5 px-4 border-2 border-blue-100 rounded-xl shadow-sm bg-white text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition-all hover:scale-105 active:scale-95"
                >
                  <svg className="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.0003 2C6.47731 2 2.00031 6.477 2.00031 12C2.00031 16.991 5.65731 21.128 10.4383 21.879V14.89H7.89831V12H10.4383V9.797C10.4383 7.291 11.9313 5.907 14.2153 5.907C15.3103 5.907 16.4543 6.102 16.4543 6.102V8.562H15.1923C13.9503 8.562 13.5623 9.333 13.5623 10.124V12H16.3363L15.8933 14.89H13.5623V21.879C18.3433 21.129 22.0003 16.99 22.0003 12C22.0003 6.477 17.5233 2 12.0003 2Z" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="flex justify-center items-center py-2.5 px-4 border-2 border-blue-100 rounded-xl shadow-sm bg-white hover:bg-blue-50 hover:border-blue-200 transition-all hover:scale-105 active:scale-95"
                >
                  <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                </button>
                <button
                  type="button"
                  className="flex justify-center items-center py-2.5 px-4 border-2 border-blue-100 rounded-xl shadow-sm bg-white text-black hover:bg-blue-50 hover:border-blue-200 transition-all hover:scale-105 active:scale-95"
                >
                  <svg className="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Local styles for background animation */}
      <style jsx>{`
        @keyframes slowShift {
          0%   { transform: translate3d(0,0,0); }
          50%  { transform: translate3d(-1.5%, -1.5%, 0); }
          100% { transform: translate3d(0,0,0); }
        }
        .animate-slow-shift {
          animation: slowShift 18s ease-in-out infinite;
        }
        
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.05); opacity: 0.9; }
          100% { transform: scale(1); opacity: 0.7; }
        }
        
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-float-1 {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-2 {
          animation: float 8s ease-in-out infinite;
          animation-delay: 1s;
        }
        
        .animate-float-3 {
          animation: float 7s ease-in-out infinite;
          animation-delay: 2s;
        }
        
        .animate-pulse-slow {
          animation: pulse 8s ease-in-out infinite;
        }
        
        .animate-rotate-slow {
          animation: rotate 30s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
