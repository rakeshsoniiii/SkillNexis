'use client';

import { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { motion } from 'framer-motion';
import { Lock, Mail, User, ArrowRight, Loader2, Eye, EyeOff, UserPlus, CheckCircle, Star, Zap } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    await register(name, email, password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/50 to-pink-100 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-800 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-40">
          <div className="w-full h-full bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5"></div>
        </div>
      </div>

      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Registration Form */}
        <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center p-4 sm:p-8">
          <div className="w-full max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 sm:p-8 pb-6">
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
                  >
                    <UserPlus className="text-white" size={32} />
                  </motion.div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Create Account</h2>
                  <p className="text-gray-600 dark:text-gray-400">Join thousands of learners today</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Full Name
                    </label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors" size={20} />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:border-purple-500 dark:focus:border-purple-400 focus:bg-white dark:focus:bg-gray-600 outline-none transition-all duration-300 placeholder:text-gray-400"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Email Address
                    </label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors" size={20} />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:border-purple-500 dark:focus:border-purple-400 focus:bg-white dark:focus:bg-gray-600 outline-none transition-all duration-300 placeholder:text-gray-400"
                        placeholder="Enter your email address"
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Password
                    </label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors" size={20} />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-12 pr-12 py-4 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:border-purple-500 dark:focus:border-purple-400 focus:bg-white dark:focus:bg-gray-600 outline-none transition-all duration-300 placeholder:text-gray-400"
                        placeholder="Create a strong password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Confirm Password
                    </label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors" size={20} />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-12 pr-12 py-4 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:border-purple-500 dark:focus:border-purple-400 focus:bg-white dark:focus:bg-gray-600 outline-none transition-all duration-300 placeholder:text-gray-400"
                        placeholder="Confirm your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </motion.div>

                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        Create Account
                        <ArrowRight size={20} />
                      </>
                    )}
                  </motion.button>
                </form>
              </div>

              {/* Footer */}
              <div className="px-6 sm:px-8 pb-6 sm:pb-8">
                <div className="flex items-center my-6">
                  <div className="flex-1 border-t border-gray-200 dark:border-gray-600"></div>
                  <span className="px-4 text-sm text-gray-500 dark:text-gray-400">or</span>
                  <div className="flex-1 border-t border-gray-200 dark:border-gray-600"></div>
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="text-center"
                >
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Already have an account?
                  </p>
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-500 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                  >
                    Sign In
                    <ArrowRight size={16} />
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right Side - Benefits & Features */}
        <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 bg-gradient-to-br from-purple-600 via-purple-700 to-pink-800 relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-20 right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 left-20 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-cyan-400/10 rounded-full blur-2xl"></div>
          </div>

          <div className="relative z-10 flex flex-col justify-center px-12 xl:px-16 text-white">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {/* Main Content */}
              <div className="mb-12">
                <h2 className="text-5xl xl:text-6xl font-bold leading-tight mb-6">
                  Start Your
                  <span className="block bg-gradient-to-r from-pink-300 to-cyan-300 bg-clip-text text-transparent">
                    Success Journey
                  </span>
                </h2>
                <p className="text-xl text-purple-100 leading-relaxed max-w-lg">
                  Join our community of learners and unlock your potential with cutting-edge courses and industry certifications.
                </p>
              </div>

              {/* Benefits */}
              <div className="space-y-6 mb-12">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-12 h-12 bg-green-400/20 rounded-xl flex items-center justify-center">
                    <CheckCircle className="text-green-300" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Free Access to Premium Content</h3>
                    <p className="text-purple-200 text-sm">Get started with our comprehensive learning materials</p>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-12 h-12 bg-yellow-400/20 rounded-xl flex items-center justify-center">
                    <Star className="text-yellow-300" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Industry-Recognized Certificates</h3>
                    <p className="text-purple-200 text-sm">Boost your career with verified credentials</p>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-12 h-12 bg-blue-400/20 rounded-xl flex items-center justify-center">
                    <Zap className="text-blue-300" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Fast-Track Learning</h3>
                    <p className="text-purple-200 text-sm">Accelerated programs designed for quick skill acquisition</p>
                  </div>
                </motion.div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-center"
                >
                  <div className="text-3xl font-bold mb-2">1000+</div>
                  <div className="text-purple-200 text-sm">Happy Students</div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="text-center"
                >
                  <div className="text-3xl font-bold mb-2">15+</div>
                  <div className="text-purple-200 text-sm">Expert Courses</div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="text-center"
                >
                  <div className="text-3xl font-bold mb-2">95%</div>
                  <div className="text-purple-200 text-sm">Success Rate</div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}