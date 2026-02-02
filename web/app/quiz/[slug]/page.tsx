'use client';

import { useState, useEffect, useCallback, useMemo, use } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { courses } from '@/lib/courses';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, X, ArrowRight, ArrowLeft, Award } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

// Mock quiz data - in a real app, this would come from an API
const quizData: Record<string, Question[]> = {
  'c-programming': [
    {
      id: 1,
      question: 'What is the correct way to declare a variable in C?',
      options: ['var x = 5;', 'int x = 5;', 'x = 5;', 'declare x = 5;'],
      correctAnswer: 1,
      explanation: 'In C, variables must be declared with their data type. "int x = 5;" correctly declares an integer variable.'
    },
    {
      id: 2,
      question: 'Which header file is required for printf() function?',
      options: ['<stdlib.h>', '<string.h>', '<stdio.h>', '<math.h>'],
      correctAnswer: 2,
      explanation: 'The printf() function is declared in <stdio.h> (standard input/output header).'
    },
    {
      id: 3,
      question: 'What does the & operator do in C?',
      options: ['Logical AND', 'Bitwise AND', 'Address of operator', 'Reference operator'],
      correctAnswer: 2,
      explanation: 'The & operator returns the memory address of a variable.'
    }
  ],
  'python': [
    {
      id: 1,
      question: 'Which of the following is the correct way to create a list in Python?',
      options: ['list = []', 'list = ()', 'list = {}', 'list = ""'],
      correctAnswer: 0,
      explanation: 'Square brackets [] are used to create lists in Python.'
    },
    {
      id: 2,
      question: 'What is the output of print(2 ** 3)?',
      options: ['6', '8', '9', '23'],
      correctAnswer: 1,
      explanation: 'The ** operator is used for exponentiation in Python. 2 ** 3 = 2³ = 8.'
    }
  ],
  'web-development': [
    {
      id: 1,
      question: 'Which HTML tag is used to create a hyperlink?',
      options: ['<link>', '<a>', '<href>', '<url>'],
      correctAnswer: 1,
      explanation: 'The <a> tag with the href attribute is used to create hyperlinks in HTML.'
    },
    {
      id: 2,
      question: 'Which CSS property is used to change the text color?',
      options: ['text-color', 'font-color', 'color', 'text-style'],
      correctAnswer: 2,
      explanation: 'The "color" property in CSS is used to set the text color.'
    }
  ]
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function QuizPage({ params }: PageProps) {
  const { slug } = use(params);
  const { user, updateProgress } = useAuth();
  const router = useRouter();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [quizStarted, setQuizStarted] = useState(false);

  const course = courses.find(c => c.slug === slug);
  const questions = useMemo(() => quizData[slug] || [], [slug]);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (!course) {
      router.push('/courses');
      return;
    }

    // Check if user has access to this quiz (must have watched video)
    const progress = user.progress[course.id] || 0;
    if (progress < 33) {
      router.push(`/courses/${slug}`);
      return;
    }
  }, [user, course, slug, router]);

  const handleSubmitQuiz = useCallback(() => {
    setShowResults(true);
    
    // Calculate score
    const correctAnswers = selectedAnswers.filter((answer, index) => 
      answer === questions[index]?.correctAnswer
    ).length;
    
    const score = Math.round((correctAnswers / questions.length) * 100);
    
    // Update progress if passed (80% or higher)
    if (score >= 80 && user && course) {
      const currentProgress = user.progress[course.id] || 0;
      if (currentProgress < 66) {
        updateProgress(course.id, 66); // 66% for completing quiz
      }
    }
  }, [selectedAnswers, questions, user, course, updateProgress]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (quizStarted && timeLeft > 0 && !showResults) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && !showResults) {
      // Use a timeout to avoid calling setState directly in effect
      setTimeout(() => handleSubmitQuiz(), 0);
    }
    return () => clearTimeout(timer);
  }, [timeLeft, quizStarted, showResults, handleSubmitQuiz]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };



  const startQuiz = () => {
    setQuizStarted(true);
    setSelectedAnswers(new Array(questions.length).fill(-1));
  };

  if (!user || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Quiz Not Available</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The quiz for this course is not yet available.
          </p>
          <button
            onClick={() => router.push(`/courses/${slug}`)}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-accent transition-colors"
          >
            Back to Course
          </button>
        </div>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-md w-full mx-4"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="text-primary" size={32} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {course.title} Quiz
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Test your knowledge with {questions.length} questions. You need 80% to pass.
            </p>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Quiz Rules:</h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• {questions.length} multiple choice questions</li>
                <li>• 10 minutes time limit</li>
                <li>• 80% score required to pass</li>
                <li>• You can retake the quiz if needed</li>
              </ul>
            </div>
            
            <button
              onClick={startQuiz}
              className="w-full bg-primary text-white py-3 rounded-lg hover:bg-accent transition-colors font-medium"
            >
              Start Quiz
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (showResults) {
    const correctAnswers = selectedAnswers.filter((answer, index) => 
      answer === questions[index]?.correctAnswer
    ).length;
    const score = Math.round((correctAnswers / questions.length) * 100);
    const passed = score >= 80;

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8"
          >
            <div className="text-center mb-8">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
                passed ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'
              }`}>
                {passed ? (
                  <CheckCircle className="text-green-600 dark:text-green-400" size={40} />
                ) : (
                  <X className="text-red-600 dark:text-red-400" size={40} />
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Quiz {passed ? 'Completed!' : 'Failed'}
              </h1>
              
              <div className="text-4xl font-bold mb-2">
                <span className={passed ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                  {score}%
                </span>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400">
                You got {correctAnswers} out of {questions.length} questions correct
              </p>
              
              {passed && (
                <p className="text-green-600 dark:text-green-400 mt-2 font-medium">
                  Great job! You can now proceed to the assessment.
                </p>
              )}
            </div>

            {/* Question Review */}
            <div className="space-y-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Review Answers</h2>
              {questions.map((question, index) => {
                const userAnswer = selectedAnswers[index];
                const isCorrect = userAnswer === question.correctAnswer;
                
                return (
                  <div key={question.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isCorrect ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'
                      }`}>
                        {isCorrect ? (
                          <CheckCircle className="text-green-600 dark:text-green-400" size={16} />
                        ) : (
                          <X className="text-red-600 dark:text-red-400" size={16} />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                          {index + 1}. {question.question}
                        </h3>
                        <div className="space-y-1 text-sm">
                          <p className="text-gray-600 dark:text-gray-400">
                            Your answer: <span className={isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                              {userAnswer !== undefined && userAnswer >= 0 ? question.options[userAnswer] : 'Not answered'}
                            </span>
                          </p>
                          {!isCorrect && (
                            <p className="text-gray-600 dark:text-gray-400">
                              Correct answer: <span className="text-green-600 dark:text-green-400">
                                {question.options[question.correctAnswer]}
                              </span>
                            </p>
                          )}
                          <p className="text-gray-500 dark:text-gray-400 italic">
                            {question.explanation}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => router.push(`/courses/${slug}`)}
                className="px-6 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Back to Course
              </button>
              
              {!passed && (
                <button
                  onClick={() => {
                    setShowResults(false);
                    setQuizStarted(false);
                    setCurrentQuestion(0);
                    setSelectedAnswers([]);
                    setTimeLeft(600);
                  }}
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-accent transition-colors"
                >
                  Retake Quiz
                </button>
              )}
              
              {passed && (
                <button
                  onClick={() => router.push(`/assessments/${slug}`)}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  Continue to Assessment <ArrowRight size={16} />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {course.title} Quiz
            </h1>
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <Clock size={20} />
              <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 mb-6"
        >
          {question && (
            <>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                {question.question}
              </h2>
              
              <div className="space-y-3">
                {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  selectedAnswers[currentQuestion] === index
                    ? 'border-primary bg-primary/5 dark:bg-primary/10'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedAnswers[currentQuestion] === index
                      ? 'border-primary bg-primary'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}>
                    {selectedAnswers[currentQuestion] === index && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                  <span className="text-gray-900 dark:text-white">{option}</span>
                </div>
              </button>
            ))}
              </div>
            </>
          )}
          {!question && (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400">Question not found.</p>
            </div>
          )}
        </motion.div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevQuestion}
            disabled={currentQuestion === 0}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft size={16} />
            Previous
          </button>
          
          <div className="flex items-center gap-2">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                  index === currentQuestion
                    ? 'bg-primary text-white'
                    : (selectedAnswers[index] !== undefined && selectedAnswers[index] >= 0)
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
          
          {currentQuestion === questions.length - 1 ? (
            <button
              onClick={handleSubmitQuiz}
              className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Submit Quiz
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-accent transition-colors"
            >
              Next
              <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}