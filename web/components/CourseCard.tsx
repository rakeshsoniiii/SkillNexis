
'use client';

import Link from 'next/link';
import { Course } from '@/lib/courses';
import { ArrowRight, BookOpen, CheckCircle, Play, Clock, Users, Star } from 'lucide-react';
import { useAuth } from './AuthProvider';
import { motion } from 'framer-motion';

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  const { user, enrollInCourse } = useAuth();
  
  const isEnrolled = user?.enrolledCourses.includes(course.id) || false;
  const isCompleted = user?.completedCourses.includes(course.id) || false;
  const progress = user?.progress[course.id] || 0;

  const handleEnroll = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (user && !isEnrolled) {
      try {
        enrollInCourse(course.id);
      } catch (error) {
        console.error('Error enrolling in course:', error);
      }
    }
  };

  return (
    <motion.div 
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 hover:shadow-2xl hover:border-blue-300 dark:hover:border-blue-600"
      whileHover={{ 
        y: -8, 
        scale: 1.02,
        transition: { type: "spring", stiffness: 300, damping: 20 }
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-purple-50/0 group-hover:from-blue-50/30 group-hover:to-purple-50/20 dark:group-hover:from-blue-900/10 dark:group-hover:to-purple-900/5 transition-all duration-300 rounded-2xl" />
      
      {/* Floating badge */}
      {isCompleted && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          className="absolute top-4 right-4 z-10 bg-gradient-to-r from-green-500 to-emerald-500 text-white p-2 rounded-full shadow-lg"
        >
          <CheckCircle size={16} />
        </motion.div>
      )}
      
      <div className="p-8 relative z-10">
        {/* Icon with animation */}
        <motion.div 
          className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-600 dark:text-blue-400 group-hover:from-blue-500 group-hover:to-purple-500 group-hover:text-white transition-all duration-300"
          whileHover={{ rotate: 10, scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <BookOpen size={24} />
        </motion.div>
        
        {/* Category and status badges */}
        <div className="mb-4 flex items-center gap-2 text-xs font-medium">
          <motion.span 
            className="rounded-full bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 px-3 py-1.5 text-gray-700 dark:text-gray-300 group-hover:from-blue-100 group-hover:to-purple-100 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
          >
            {course.category}
          </motion.span>
          
          {isCompleted && (
            <motion.span 
              className="rounded-full bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 px-3 py-1.5 text-green-700 dark:text-green-400 flex items-center gap-1.5"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <CheckCircle size={12} />
              Completed
            </motion.span>
          )}
          
          {isEnrolled && !isCompleted && (
            <motion.span 
              className="rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 px-3 py-1.5 text-blue-700 dark:text-blue-400"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              Enrolled
            </motion.span>
          )}
        </div>
        
        {/* Title with hover effect */}
        <motion.h3 
          className="mb-3 text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 leading-tight"
          whileHover={{ x: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {course.title}
        </motion.h3>
        
        <p className="mb-6 text-sm text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed">
          {course.description}
        </p>

        {/* Course stats */}
        <div className="mb-6 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <Clock size={12} />
            <span>8-12 weeks</span>
          </div>
          <div className="flex items-center gap-1">
            <Users size={12} />
            <span>500+ enrolled</span>
          </div>
          <div className="flex items-center gap-1">
            <Star size={12} className="text-amber-400" fill="currentColor" />
            <span>4.8</span>
          </div>
        </div>

        {/* Progress Bar for Enrolled Courses */}
        {isEnrolled && (
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-2">
              <span className="font-medium">Progress</span>
              <span className="font-bold text-blue-600 dark:text-blue-400">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
              <motion.div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 rounded-full" 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        )}
        
        {/* Action buttons */}
        <div className="flex items-center justify-between gap-3">
          {user ? (
            isEnrolled ? (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href={`/courses/${course.slug}`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 text-sm font-semibold shadow-lg hover:shadow-xl"
                >
                  <Play size={16} />
                  {isCompleted ? 'Review' : 'Continue'}
                </Link>
              </motion.div>
            ) : (
              <motion.button
                onClick={handleEnroll}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 text-sm font-semibold shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Enroll Now
              </motion.button>
            )
          ) : (
            <motion.div whileHover={{ scale: 1.05 }}>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300"
              >
                Login to Enroll 
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          )}
          
          <motion.div whileHover={{ scale: 1.05 }}>
            <Link
              href={`/courses/${course.slug}`}
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300 font-medium"
            >
              View Details
            </Link>
          </motion.div>
        </div>
      </div>
      
      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-blue-500/5 to-purple-500/5 pointer-events-none" />
    </motion.div>
  );
}
