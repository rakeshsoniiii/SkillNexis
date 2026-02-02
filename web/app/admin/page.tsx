'use client';

import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Users, BookOpen, Award, TrendingUp, Plus, Edit, Trash2, Video, FileText, Brain, Save, X, UserCheck, Calendar, Activity, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { adminDataManager, AdminCourse, AdminUser, AdminQuestion, AdminStats } from '@/lib/adminData';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  videoUrl?: string;
  pdfUrl?: string;
  category: 'Programming' | 'Web Development' | 'Data Science' | 'Cloud & IoT' | 'Mobile';
}

interface Notification {
  id: string;
  type: 'success' | 'error';
  message: string;
}

export default function AdminPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'courses' | 'quizzes' | 'users'>('dashboard');
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editingQuiz, setEditingQuiz] = useState<{ courseSlug: string; questions: Question[] } | null>(null);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  // Real data states
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [quizzes, setQuizzes] = useState<Record<string, Question[]>>({});
  const [stats, setStats] = useState<AdminStats>({
    totalStudents: 0,
    totalCourses: 0,
    totalCertificates: 0,
    completionRate: 0,
    totalQuizzes: 0,
    totalEnrollments: 0,
    activeUsers: 0,
    newUsersThisMonth: 0
  });

  // Load data on component mount
  useEffect(() => {
    // Only load data on client side
    if (typeof window !== 'undefined') {
      try {
        loadData();
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading admin data:', error);
        setHasError(true);
        setIsLoading(false);
        showNotification('error', 'Failed to load admin data. Please refresh the page.');
      }
    }
  }, []);

  const loadData = () => {
    try {
      const loadedCourses = adminDataManager.getCourses();
      const loadedUsers = adminDataManager.getUsers();
      const loadedQuizzes = adminDataManager.getQuizzes();
      const loadedStats = adminDataManager.getStats();

      setCourses(loadedCourses);
      setUsers(loadedUsers);
      setStats(loadedStats);

      // Convert quizzes to the format expected by the UI
      const quizMap: Record<string, Question[]> = {};
      loadedQuizzes.forEach(quiz => {
        quizMap[quiz.courseSlug] = quiz.questions;
      });
      setQuizzes(quizMap);
      setHasError(false);
    } catch (error) {
      console.error('Error in loadData:', error);
      setHasError(true);
      throw error;
    }
  };

  // Notification system
  const showNotification = (type: 'success' | 'error', message: string) => {
    const id = Date.now().toString();
    const notification: Notification = { id, type, message };
    setNotifications(prev => [...prev, notification]);
    
    // Auto-remove notification after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.push('/login');
    }
  }, [user, router]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Loading Admin Dashboard
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Please wait while we load your data...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="text-red-600 dark:text-red-400 mb-4">
            <AlertCircle size={48} className="mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Error Loading Dashboard
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            There was an error loading the admin dashboard.
          </p>
          <button
            onClick={() => {
              setHasError(false);
              setIsLoading(true);
              try {
                loadData();
                setIsLoading(false);
              } catch (error) {
                setHasError(true);
                setIsLoading(false);
              }
            }}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            You need admin privileges to access this page.
          </p>
        </div>
      </div>
    );
  }

  const handleSaveCourse = (courseData: Course) => {
    try {
      if (courseData.id) {
        // Update existing course
        adminDataManager.updateCourse(courseData.id, courseData);
        showNotification('success', `Course "${courseData.title}" updated successfully!`);
      } else {
        // Add new course
        adminDataManager.addCourse(courseData);
        showNotification('success', `Course "${courseData.title}" created successfully!`);
      }
      loadData(); // Refresh data
      setShowCourseModal(false);
      setEditingCourse(null);
    } catch (error) {
      showNotification('error', 'Failed to save course. Please try again.');
      console.error('Error saving course:', error);
    }
  };

  const handleDeleteCourse = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    const courseName = course?.title || 'Course';
    
    if (confirm(`Are you sure you want to delete "${courseName}"? This will also delete associated quizzes.`)) {
      try {
        adminDataManager.deleteCourse(courseId);
        showNotification('success', `Course "${courseName}" deleted successfully!`);
        loadData(); // Refresh data
      } catch (error) {
        showNotification('error', 'Failed to delete course. Please try again.');
        console.error('Error deleting course:', error);
      }
    }
  };

  const handleSaveQuiz = (courseSlug: string, questions: Question[]) => {
    try {
      const course = courses.find(c => c.slug === courseSlug);
      const courseName = course?.title || 'Course';
      
      adminDataManager.addQuiz({
        courseSlug,
        questions: questions as AdminQuestion[]
      });
      
      showNotification('success', `Quiz for "${courseName}" saved successfully!`);
      loadData(); // Refresh data
      setShowQuizModal(false);
      setEditingQuiz(null);
    } catch (error) {
      showNotification('error', 'Failed to save quiz. Please try again.');
      console.error('Error saving quiz:', error);
    }
  };

  const handleDeleteQuiz = (courseSlug: string) => {
    const course = courses.find(c => c.slug === courseSlug);
    const courseName = course?.title || 'Course';
    
    if (confirm(`Are you sure you want to delete the quiz for "${courseName}"?`)) {
      try {
        adminDataManager.deleteQuiz(courseSlug);
        showNotification('success', `Quiz for "${courseName}" deleted successfully!`);
        loadData(); // Refresh data
      } catch (error) {
        showNotification('error', 'Failed to delete quiz. Please try again.');
        console.error('Error deleting quiz:', error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/10">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Admin Dashboard
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Welcome back, {user.name}! 👋
          </p>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl p-1 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
              { id: 'courses', label: 'Course Management', icon: BookOpen },
              { id: 'quizzes', label: 'Quiz Management', icon: Brain },
              { id: 'users', label: 'User Management', icon: Users }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'dashboard' | 'courses' | 'quizzes' | 'users')}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
              >
                <tab.icon size={20} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'Total Students', value: stats.totalStudents, icon: Users, color: 'blue', bgColor: 'from-blue-500 to-cyan-500' },
                { title: 'Total Courses', value: stats.totalCourses, icon: BookOpen, color: 'green', bgColor: 'from-green-500 to-emerald-500' },
                { title: 'Certificates Issued', value: stats.totalCertificates, icon: Award, color: 'yellow', bgColor: 'from-amber-500 to-orange-500' },
                { title: 'Completion Rate', value: `${stats.completionRate}%`, icon: TrendingUp, color: 'purple', bgColor: 'from-purple-500 to-violet-500' }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
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

            {/* Additional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
              {[
                { title: 'Active Users', value: stats.activeUsers, icon: Activity, color: 'green', bgColor: 'from-green-500 to-teal-500' },
                { title: 'New This Month', value: stats.newUsersThisMonth, icon: UserCheck, color: 'blue', bgColor: 'from-blue-500 to-indigo-500' },
                { title: 'Total Quizzes', value: stats.totalQuizzes, icon: Brain, color: 'purple', bgColor: 'from-purple-500 to-pink-500' },
                { title: 'Total Enrollments', value: stats.totalEnrollments, icon: BookOpen, color: 'orange', bgColor: 'from-orange-500 to-red-500' }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (index + 4) * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
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

            {/* Course Overview */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50">
              <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Course Overview
                </h2>
              </div>
              <div className="p-6">
                <div className="grid gap-4">
                  {courses.slice(0, 5).map((course) => (
                    <div key={course.id} className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-600/50 transition-colors">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {course.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {course.category}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          Created: {formatDate(course.createdAt)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          Active
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {course.enrolledCount} enrolled
                        </p>
                        <p className="text-xs text-green-600 dark:text-green-400">
                          {course.completedCount} completed
                        </p>
                      </div>
                    </div>
                  ))}
                  {courses.length === 0 && (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      No courses available. Create your first course!
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Recent Users */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50">
              <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Recent Users
                </h2>
              </div>
              <div className="p-6">
                <div className="grid gap-4">
                  {users.slice(0, 5).map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-600/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {user.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {user.email}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            Joined: {formatDate(user.joinedDate)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {user.enrolledCourses.length} courses
                        </p>
                        <p className="text-xs text-green-600 dark:text-green-400">
                          {user.certificates.length} certificates
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Last active: {formatDate(user.lastActive)}
                        </p>
                      </div>
                    </div>
                  ))}
                  {users.length === 0 && (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      No users registered yet.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Course Management Tab */}
        {activeTab === 'courses' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Course Management</h2>
              <button
                onClick={() => {
                  setEditingCourse({
                    id: '',
                    title: '',
                    slug: '',
                    description: '',
                    videoUrl: '',
                    pdfUrl: '',
                    category: 'Programming'
                  });
                  setShowCourseModal(true);
                }}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg"
              >
                <Plus size={20} />
                Add New Course
              </button>
            </div>

            <div className="grid gap-6">
              {courses.map((course) => (
                <div key={course.id} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{course.title}</h3>
                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                          {course.category}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">{course.description}</p>

                      <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400 mb-3">
                        <div className="flex items-center gap-2">
                          <Video size={16} />
                          <span>{course.videoUrl ? 'Video Available' : 'No Video'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText size={16} />
                          <span>{course.pdfUrl ? 'PDF Available' : 'No PDF'}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                          <Users size={16} className="text-blue-500" />
                          <span className="text-gray-700 dark:text-gray-300">{course.enrolledCount} enrolled</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Award size={16} className="text-green-500" />
                          <span className="text-gray-700 dark:text-gray-300">{course.completedCount} completed</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-purple-500" />
                          <span className="text-gray-700 dark:text-gray-300">Created {formatDate(course.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingCourse(course);
                          setShowCourseModal(true);
                        }}
                        className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteCourse(course.id)}
                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {courses.length === 0 && (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">No courses yet</h3>
                  <p>Create your first course to get started!</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Quiz Management Tab */}
        {activeTab === 'quizzes' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Quiz Management</h2>
              <button
                onClick={() => {
                  setEditingQuiz({ courseSlug: '', questions: [] });
                  setShowQuizModal(true);
                }}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg"
              >
                <Plus size={20} />
                Create New Quiz
              </button>
            </div>

            <div className="grid gap-6">
              {courses.map((course) => {
                const quiz = quizzes[course.slug];
                return (
                  <div key={course.id} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{course.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-2">
                          <span>{quiz ? `${quiz.length} questions` : 'No quiz available'}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${quiz ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'
                            }`}>
                            {quiz ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Course: {course.category} • Created: {formatDate(course.createdAt)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingQuiz({ courseSlug: course.slug, questions: quiz || [] });
                            setShowQuizModal(true);
                          }}
                          className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                        >
                          <Edit size={18} />
                        </button>
                        {quiz && (
                          <button
                            onClick={() => handleDeleteQuiz(course.slug)}
                            className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              {courses.length === 0 && (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <Brain size={48} className="mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">No courses available</h3>
                  <p>Create courses first to add quizzes!</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* User Management Tab */}
        {activeTab === 'users' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h2>
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Total Users: {users.length}
                </div>
              </div>
            </div>

            <div className="grid gap-6">
              {users.map((user) => (
                <div key={user.id} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{user.name}</h3>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${user.role === 'admin' 
                            ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' 
                            : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                          }`}>
                            {user.role}
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-3">{user.email}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <BookOpen size={16} className="text-blue-500" />
                            <span className="text-gray-700 dark:text-gray-300">{user.enrolledCourses.length} enrolled</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Award size={16} className="text-green-500" />
                            <span className="text-gray-700 dark:text-gray-300">{user.certificates.length} certificates</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-purple-500" />
                            <span className="text-gray-700 dark:text-gray-300">Joined {formatDate(user.joinedDate)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Activity size={16} className="text-orange-500" />
                            <span className="text-gray-700 dark:text-gray-300">Active {formatDate(user.lastActive)}</span>
                          </div>
                        </div>

                        {user.enrolledCourses.length > 0 && (
                          <div className="mt-4">
                            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Course Progress:</h4>
                            <div className="space-y-2">
                              {user.enrolledCourses.slice(0, 3).map(courseId => {
                                const course = courses.find(c => c.id === courseId);
                                const progress = user.progress[courseId] || 0;
                                return course ? (
                                  <div key={courseId} className="flex items-center gap-3">
                                    <span className="text-sm text-gray-600 dark:text-gray-400 min-w-0 flex-1 truncate">
                                      {course.title}
                                    </span>
                                    <div className="flex items-center gap-2">
                                      <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <div 
                                          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                                          style={{ width: `${progress}%` }}
                                        ></div>
                                      </div>
                                      <span className="text-xs text-gray-500 dark:text-gray-400 min-w-0">
                                        {progress}%
                                      </span>
                                    </div>
                                  </div>
                                ) : null;
                              })}
                              {user.enrolledCourses.length > 3 && (
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  +{user.enrolledCourses.length - 3} more courses
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {users.length === 0 && (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <Users size={48} className="mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">No users registered</h3>
                  <p>Users will appear here when they register for the platform.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Course Modal */}
        <CourseModal
          key={editingCourse?.id || 'new'}
          isOpen={showCourseModal}
          onClose={() => {
            setShowCourseModal(false);
            setEditingCourse(null);
          }}
          course={editingCourse}
          onSave={handleSaveCourse}
        />

        {/* Quiz Modal */}
        <QuizModal
          key={editingQuiz?.courseSlug || 'new'}
          isOpen={showQuizModal}
          onClose={() => {
            setShowQuizModal(false);
            setEditingQuiz(null);
          }}
          quiz={editingQuiz}
          courses={courses}
          onSave={handleSaveQuiz}
        />
      </div>

      {/* Notification System */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        <AnimatePresence>
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 300, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 300, scale: 0.8 }}
              className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-lg backdrop-blur-xl border max-w-sm ${
                notification.type === 'success'
                  ? 'bg-green-50/90 dark:bg-green-900/30 border-green-200 dark:border-green-700 text-green-800 dark:text-green-200'
                  : 'bg-red-50/90 dark:bg-red-900/30 border-red-200 dark:border-red-700 text-red-800 dark:text-red-200'
              }`}
            >
              {notification.type === 'success' ? (
                <CheckCircle size={20} className="text-green-600 dark:text-green-400 shrink-0" />
              ) : (
                <AlertCircle size={20} className="text-red-600 dark:text-red-400 shrink-0" />
              )}
              <p className="text-sm font-medium flex-1">{notification.message}</p>
              <button
                onClick={() => removeNotification(notification.id)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Course Modal Component
function CourseModal({ isOpen, onClose, course, onSave }: {
  isOpen: boolean;
  onClose: () => void;
  course: Course | null;
  onSave: (course: Course) => void;
}) {
  const [formData, setFormData] = useState<Course>({
    id: '',
    title: '',
    slug: '',
    description: '',
    videoUrl: '',
    pdfUrl: '',
    category: 'Programming'
  });

  // Reset form data when modal opens or course changes
  useEffect(() => {
    if (isOpen) {
      setFormData(course || {
        id: '',
        title: '',
        slug: '',
        description: '',
        videoUrl: '',
        pdfUrl: '',
        category: 'Programming'
      });
    }
  }, [isOpen, course]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.title.trim() || !formData.slug.trim() || !formData.description.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    // Generate slug from title if not provided
    const slug = formData.slug.trim() || formData.title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const courseData = {
      ...formData,
      title: formData.title.trim(),
      slug: slug,
      description: formData.description.trim(),
      videoUrl: formData.videoUrl?.trim() || '',
      pdfUrl: formData.pdfUrl?.trim() || ''
    };

    onSave(courseData);
  };

  const handleInputChange = (field: keyof Course, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-generate slug from title
    if (field === 'title' && !course?.id) {
      const autoSlug = value.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData(prev => ({ ...prev, slug: autoSlug }));
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {course?.id ? 'Edit Course' : 'Add New Course'}
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Course Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Enter course title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Course Slug *
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="course-slug (auto-generated from title)"
                  required
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  URL-friendly version of the title (auto-generated)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  placeholder="Enter course description"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="Programming">Programming</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Cloud & IoT">Cloud & IoT</option>
                  <option value="Mobile">Mobile</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  YouTube Video URL
                </label>
                <input
                  type="url"
                  value={formData.videoUrl || ''}
                  onChange={(e) => handleInputChange('videoUrl', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="https://www.youtube.com/embed/..."
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Optional: YouTube embed URL for course video
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  PDF Resource URL
                </label>
                <input
                  type="url"
                  value={formData.pdfUrl || ''}
                  onChange={(e) => handleInputChange('pdfUrl', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="https://example.com/course-material.pdf"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Optional: PDF resource for course materials
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Save size={18} />
                  {course?.id ? 'Update Course' : 'Save Course'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Quiz Modal Component
function QuizModal({ isOpen, onClose, quiz, courses, onSave }: {
  isOpen: boolean;
  onClose: () => void;
  quiz: { courseSlug: string; questions: Question[] } | null;
  courses: Course[];
  onSave: (courseSlug: string, questions: Question[]) => void;
}) {
  const [courseSlug, setCourseSlug] = useState(() => quiz?.courseSlug || '');
  const [questions, setQuestions] = useState<Question[]>(() => quiz?.questions || []);

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now(),
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: ''
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (index: number, field: keyof Question, value: string | number | string[]) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value } as Question;
    setQuestions(updatedQuestions);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(courseSlug, questions);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {quiz?.courseSlug ? 'Edit Quiz' : 'Create New Quiz'}
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Course
                </label>
                <select
                  value={courseSlug}
                  onChange={(e) => setCourseSlug(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                >
                  <option value="">Select a course</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.slug}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Questions</h3>
                  <button
                    type="button"
                    onClick={addQuestion}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Plus size={16} />
                    Add Question
                  </button>
                </div>

                {questions.map((question, index) => (
                  <div key={question.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-gray-900 dark:text-white">Question {index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => removeQuestion(index)}
                        className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Question Text
                      </label>
                      <input
                        type="text"
                        value={question.question}
                        onChange={(e) => updateQuestion(index, 'question', e.target.value)}
                        className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Options
                      </label>
                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center gap-2 mb-2">
                          <input
                            type="radio"
                            name={`correct-${question.id}`}
                            checked={question.correctAnswer === optionIndex}
                            onChange={() => updateQuestion(index, 'correctAnswer', optionIndex)}
                            className="text-blue-600"
                          />
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...question.options];
                              newOptions[optionIndex] = e.target.value;
                              updateQuestion(index, 'options', newOptions);
                            }}
                            className="flex-1 px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder={`Option ${optionIndex + 1}`}
                            required
                          />
                        </div>
                      ))}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Explanation
                      </label>
                      <textarea
                        value={question.explanation}
                        onChange={(e) => updateQuestion(index, 'explanation', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                        placeholder="Explain why this is the correct answer"
                        required
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Save size={18} />
                  Save Quiz
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}