
'use client';

import { getCourseBySlug, Course } from '@/lib/courses';
import { useAuth } from '@/components/AuthProvider';
import Link from 'next/link';
import { notFound, useRouter } from 'next/navigation';
import { ArrowLeft, PlayCircle, FileText, CheckCircle, Clock, Award, Users, BookOpen } from 'lucide-react';
import { useState, useEffect, use } from 'react';
import { motion } from 'framer-motion';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function CoursePage({ params }: PageProps) {
  const { slug } = use(params);
  const { user, enrollInCourse, updateProgress } = useAuth();
  const router = useRouter();
  const [isVideoCompleted, setIsVideoCompleted] = useState(false);
  const [course, setCourse] = useState<Course | null>(null);
  
  // Load course data
  useEffect(() => {
    const loadCourse = () => {
      try {
        const foundCourse = getCourseBySlug(slug);
        if (foundCourse) {
          setCourse(foundCourse);
        } else {
          notFound();
        }
      } catch (error) {
        console.error('Error loading course:', error);
        notFound();
      }
    };

    loadCourse();

    // Listen for storage changes to update course when admin makes changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'skillnexis_admin_courses') {
        loadCourse();
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }
  }, [slug]);

  // Handle user authentication
  useEffect(() => {
    if (user === null && typeof window !== 'undefined') {
      router.push('/login');
    }
  }, [user, router]);

  // Show loading state
  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show loading if user is still being determined
  if (user === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const isEnrolled = user?.enrolledCourses.includes(course.id) || false;
  const isCompleted = user?.completedCourses.includes(course.id) || false;
  const progress = user?.progress[course.id] || 0;

  const handleEnroll = () => {
    if (user && !isEnrolled) {
      try {
        enrollInCourse(course.id);
      } catch (error) {
        console.error('Error enrolling in course:', error);
      }
    }
  };

  const handleVideoProgress = () => {
    if (user && isEnrolled && !isVideoCompleted) {
      try {
        setIsVideoCompleted(true);
        updateProgress(course.id, 33); // 33% for video completion
      } catch (error) {
        console.error('Error updating video progress:', error);
      }
    }
  };

  const steps = [
    {
      id: 1,
      title: 'Watch Training Video',
      description: 'Complete the video lecture',
      completed: progress >= 33,
      locked: !isEnrolled
    },
    {
      id: 2,
      title: 'Take the Quiz',
      description: 'Pass with 80% score',
      completed: progress >= 66,
      locked: progress < 33
    },
    {
      id: 3,
      title: 'Submit Assessment',
      description: 'Record and explain your work',
      completed: progress >= 100,
      locked: progress < 66
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Navigation */}
      <nav className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
        <div className="container mx-auto">
          <Link
            href="/courses"
            className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
          >
            <ArrowLeft size={16} />
            Back to Courses
          </Link>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Course Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  {course.category}
                </span>
                {isCompleted && (
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full text-sm font-medium flex items-center gap-1">
                    <CheckCircle size={14} />
                    Completed
                  </span>
                )}
              </div>
              
              <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">{course.title}</h1>
              <p className="mb-6 text-lg text-gray-600 dark:text-gray-400">{course.description}</p>

              {/* Course Stats */}
              <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400 mb-6">
                <div className="flex items-center gap-1">
                  <Clock size={16} />
                  <span>2-3 hours</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users size={16} />
                  <span>1,234 students</span>
                </div>
                <div className="flex items-center gap-1">
                  <Award size={16} />
                  <span>Certificate included</span>
                </div>
              </div>

              {/* Enrollment Button */}
              {!isEnrolled && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleEnroll}
                  className="mb-8 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2"
                >
                  <BookOpen size={20} />
                  Enroll in Course
                </motion.button>
              )}
            </motion.div>

            {/* Video Player */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8 overflow-hidden rounded-xl bg-black aspect-video shadow-lg"
            >
              {course.videoUrl && isEnrolled ? (
                <iframe
                  width="100%"
                  height="100%"
                  src={course.videoUrl}
                  title={course.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full"
                  onLoad={handleVideoProgress}
                ></iframe>
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center text-gray-400">
                  <PlayCircle size={64} className="mb-4 opacity-50" />
                  <p>{isEnrolled ? 'Video content loading...' : 'Enroll to access video content'}</p>
                </div>
              )}
            </motion.div>

            {/* Study Material */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm"
            >
              <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
                <FileText className="text-blue-600 dark:text-blue-400" />
                Study Material
              </h2>
              {course.pdfUrl && isEnrolled ? (
                <a
                  href={course.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-lg border border-gray-200 dark:border-gray-600 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="rounded bg-red-100 dark:bg-red-900/30 p-2 text-red-600 dark:text-red-400">
                    <FileText size={24} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Course Guide PDF</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Download and read the material</p>
                  </div>
                </a>
              ) : (
                <div className="rounded-lg border border-dashed border-gray-300 dark:border-gray-600 p-8 text-center text-gray-500 dark:text-gray-400">
                  {isEnrolled ? 'No PDF material available yet.' : 'Enroll to access study materials.'}
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar / Progress */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="sticky top-24 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm"
            >
              <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">Your Progress</h3>
              
              {/* Progress Bar */}
              {isEnrolled && (
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span>Overall Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div 
                      className="bg-primary h-3 rounded-full transition-all duration-500" 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              <div className="space-y-4">
                {steps.map((step) => (
                  <div key={step.id} className="flex items-start gap-3">
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      step.completed 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
                        : step.locked 
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-400' 
                        : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    }`}>
                      {step.completed ? <CheckCircle size={16} /> : step.id}
                    </div>
                    <div>
                      <p className={`font-medium ${
                        step.locked ? 'text-gray-400' : 'text-gray-900 dark:text-white'
                      }`}>
                        {step.title}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 space-y-3">
                <Link
                  href={`/quiz/${course.slug}`}
                  className={`w-full rounded-lg px-4 py-2 font-medium text-center block transition-colors ${
                    progress >= 33 
                      ? 'bg-primary text-white hover:bg-accent' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {progress >= 66 ? 'Retake Quiz' : 'Start Quiz'}
                </Link>
                
                <Link
                  href={`/assessments/${course.slug}`}
                  className={`w-full rounded-lg border px-4 py-2 font-medium text-center block transition-colors ${
                    progress >= 66 
                      ? 'border-primary text-primary hover:bg-primary hover:text-white' 
                      : 'border-gray-200 dark:border-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Submit Assessment
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
