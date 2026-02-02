'use client';

import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { courses } from '@/lib/courses';
import { BookOpen, Award, TrendingUp, Users, Settings, LogOut, Play, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const enrolledCourses = courses.filter(course => user.enrolledCourses.includes(course.id));
  const averageProgress = user.enrolledCourses.length > 0 
    ? Math.round(user.enrolledCourses.reduce((sum, courseId) => sum + (user.progress[courseId] || 0), 0) / user.enrolledCourses.length)
    : 0;

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/10 transition-colors duration-300">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4"
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              {user.role === 'admin' ? 'Admin Dashboard' : 'Student Dashboard'}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">Welcome back, {user.name}! 👋</p>
          </div>
          <div className="flex items-center gap-3">
            {user.role === 'admin' && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/admin"
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 text-sm font-semibold flex items-center gap-2 shadow-lg"
                >
                  <Settings size={18} />
                  Admin Panel
                </Link>
              </motion.div>
            )}
            <motion.button
              onClick={logout}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-300 text-sm font-semibold flex items-center gap-2 shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <LogOut size={18} />
              Sign Out
            </motion.button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
          {[
            {
              title: 'Enrolled Courses',
              value: user.enrolledCourses.length,
              icon: BookOpen,
              color: 'blue',
              bgColor: 'from-blue-500 to-cyan-500',
              delay: 0
            },
            {
              title: 'Certificates',
              value: user.certificates.length,
              icon: Award,
              color: 'green',
              bgColor: 'from-green-500 to-emerald-500',
              delay: 0.1
            },
            {
              title: 'Avg Progress',
              value: `${averageProgress}%`,
              icon: TrendingUp,
              color: 'purple',
              bgColor: 'from-purple-500 to-violet-500',
              delay: 0.2
            },
            {
              title: 'Completed',
              value: user.completedCourses.length,
              icon: Users,
              color: 'amber',
              bgColor: 'from-amber-500 to-orange-500',
              delay: 0.3
            }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: stat.delay, duration: 0.5 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br opacity-5 dark:opacity-10" style={{
                backgroundImage: `linear-gradient(135deg, var(--tw-gradient-stops))`,
              }}></div>
              <div className="relative z-10 flex items-center gap-4">
                <div className={`p-4 bg-gradient-to-br ${stat.bgColor} rounded-2xl shadow-lg`}>
                  <stat.icon className="text-white" size={28} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                    {stat.title}
                  </h3>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                    {stat.value}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Course Sections */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Enrolled Courses */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">My Courses</h2>
            {enrolledCourses.length > 0 ? (
              <div className="space-y-4">
                {enrolledCourses.map((course) => (
                  <div key={course.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{course.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{course.category}</p>
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${user.progress[course.id] || 0}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {user.progress[course.id] || 0}% complete
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {user.completedCourses.includes(course.id) ? (
                        <CheckCircle className="text-green-500" size={20} />
                      ) : (
                        <Link
                          href={`/courses/${course.slug}`}
                          className="p-2 bg-primary text-white rounded-lg hover:bg-accent transition-colors"
                        >
                          <Play size={16} />
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <BookOpen className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-600 dark:text-gray-400 mb-4">No courses enrolled yet</p>
                <Link
                  href="/courses"
                  className="inline-block px-6 py-2 bg-primary text-white rounded-lg hover:bg-accent transition-colors"
                >
                  Browse Courses
                </Link>
              </div>
            )}
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                href="/courses"
                className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
              >
                <BookOpen className="text-blue-600 dark:text-blue-400" size={20} />
                <span className="font-medium text-blue-900 dark:text-blue-300">Browse All Courses</span>
              </Link>
              
              <Link
                href="/practice"
                className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
              >
                <Play className="text-green-600 dark:text-green-400" size={20} />
                <span className="font-medium text-green-900 dark:text-green-300">Code Practice</span>
              </Link>
              
              <Link
                href="/certificates"
                className="flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
              >
                <Award className="text-purple-600 dark:text-purple-400" size={20} />
                <span className="font-medium text-purple-900 dark:text-purple-300">My Certificates</span>
              </Link>
              
              <Link
                href="/assessments"
                className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
              >
                <TrendingUp className="text-amber-600 dark:text-amber-400" size={20} />
                <span className="font-medium text-amber-900 dark:text-amber-300">Take Assessment</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}