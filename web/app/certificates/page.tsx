'use client';

import { useAuth } from '@/components/AuthProvider';
import { courses } from '@/lib/courses';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, Calendar, Download, Eye, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function CertificatesPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const completedCourses = courses.filter(course => 
    user.completedCourses.includes(course.id)
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Award className="text-primary" size={32} />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              My Certificates
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            View and download your earned certificates
          </p>
        </motion.div>

        {completedCourses.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {completedCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Certificate Preview */}
                <div className="relative h-48 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 p-6">
                  <div className="absolute inset-2 border-2 border-dashed border-blue-300 dark:border-blue-600 rounded-lg"></div>
                  <div className="relative h-full flex flex-col items-center justify-center text-center">
                    <Award className="text-blue-600 dark:text-blue-400 mb-2" size={32} />
                    <h3 className="font-bold text-gray-800 dark:text-white text-sm">
                      Certificate of Completion
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {course.title}
                    </p>
                  </div>
                </div>

                {/* Certificate Info */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">
                      {course.category}
                    </span>
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded text-xs font-medium">
                      Completed
                    </span>
                  </div>
                  
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                    {course.title}
                  </h3>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <Calendar size={14} />
                    <span>Completed: {new Date().toLocaleDateString()}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      href={`/certificates/${course.slug}`}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary text-white rounded-lg hover:bg-accent transition-colors text-sm font-medium"
                    >
                      <Eye size={14} />
                      View
                    </Link>
                    <Link
                      href={`/certificates/${course.slug}`}
                      className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
                    >
                      <Download size={14} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Award className="text-gray-400" size={48} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              No Certificates Yet
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Complete courses to earn certificates. Each certificate validates your skills and knowledge.
            </p>
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-accent transition-colors font-medium"
            >
              <BookOpen size={20} />
              Browse Courses
            </Link>
          </motion.div>
        )}

        {/* Certificate Stats */}
        {completedCourses.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Achievement Summary
            </h2>
            
            <div className="grid gap-6 md:grid-cols-3">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Award className="text-blue-600 dark:text-blue-400" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {completedCourses.length}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">Certificates Earned</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="text-green-600 dark:text-green-400" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {Array.from(new Set(completedCourses.map(c => c.category))).length}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">Skill Areas</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Calendar className="text-purple-600 dark:text-purple-400" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {new Date().getFullYear()}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">Year Started</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}