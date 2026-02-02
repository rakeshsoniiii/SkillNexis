'use client';

import { useState, useRef, useEffect, useCallback, use } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { courses } from '@/lib/courses';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Camera, Square, Play, Upload, CheckCircle, AlertCircle, FileVideo, Mic, MicOff } from 'lucide-react';
import Webcam from 'react-webcam';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function AssessmentPage({ params }: PageProps) {
  const { slug } = use(params);
  const { user, completeCourse } = useAuth();
  const router = useRouter();

  const webcamRef = useRef<Webcam>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasPermission, setHasPermission] = useState(false);
  const [permissionError, setPermissionError] = useState('');
  const [audioEnabled, setAudioEnabled] = useState(true);

  const course = courses.find(c => c.slug === slug);

  const requestPermissions = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: audioEnabled
      });
      setHasPermission(true);
      // Stop the stream immediately as we just needed to check permissions
      stream.getTracks().forEach(track => track.stop());
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Permission denied';
      setPermissionError(errorMessage);
      setHasPermission(false);
    }
  }, [audioEnabled]);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (!course) {
      router.push('/courses');
      return;
    }

    // Check if user has access to assessment (must have passed quiz)
    const progress = user.progress[course.id] || 0;
    if (progress < 66) {
      router.push(`/quiz/${slug}`);
      return;
    }

    // Request camera and microphone permissions
    const initPermissions = async () => {
      await requestPermissions();
    };
    initPermissions();
  }, [user, course, slug, router, requestPermissions]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (capturing) {
      timer = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [capturing]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartCapture = () => {
    if (!webcamRef.current) return;

    setRecordedChunks([]);
    setRecordingTime(0);

    const stream = webcamRef.current.stream;
    if (!stream) return;

    mediaRecorderRef.current = new MediaRecorder(stream, {
      mimeType: 'video/webm'
    });

    mediaRecorderRef.current.addEventListener('dataavailable', (event) => {
      if (event.data.size > 0) {
        setRecordedChunks(prev => [...prev, event.data]);
      }
    });

    mediaRecorderRef.current.addEventListener('stop', () => {
      // This will be handled in the stop function
    });

    mediaRecorderRef.current.start();
    setCapturing(true);
  };

  const handleStopCapture = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setCapturing(false);
    }
  };

  useEffect(() => {
    if (recordedChunks.length > 0 && !capturing) {
      const processRecording = () => {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);
      };
      processRecording();
    }
  }, [recordedChunks, capturing]);

  const handleSubmitAssessment = async () => {
    if (!videoUrl || !user || !course) return;

    // In a real application, you would upload the video to a server
    // For this demo, we'll just simulate the submission

    setIsSubmitted(true);

    // Complete the course
    completeCourse(course.id);

    // Simulate upload delay
    setTimeout(() => {
      router.push(`/certificates/${course.slug}`);
    }, 2000);
  };

  const handleRetakeRecording = () => {
    setVideoUrl('');
    setRecordedChunks([]);
    setRecordingTime(0);
  };

  if (!user || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!hasPermission) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-md w-full mx-4 text-center"
        >
          <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Camera Permission Required
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            To complete your assessment, we need access to your camera and microphone to record your explanation.
          </p>
          {permissionError && (
            <p className="text-red-600 dark:text-red-400 text-sm mb-4">
              Error: {permissionError}
            </p>
          )}
          <button
            onClick={requestPermissions}
            className="w-full bg-primary text-white py-3 rounded-lg hover:bg-accent transition-colors"
          >
            Grant Permission
          </button>
        </motion.div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-md w-full mx-4 text-center"
        >
          <CheckCircle className="text-green-500 mx-auto mb-4" size={64} />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Assessment Submitted!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Congratulations! You have successfully completed the course. Your certificate is being generated...
          </p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6"
        >
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {course.title} - Final Assessment
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Record a video explaining what you learned and demonstrate your understanding of the course material.
          </p>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 mb-6"
        >
          <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-3">
            Assessment Instructions
          </h2>
          <ul className="text-blue-800 dark:text-blue-400 space-y-2 text-sm">
            <li>• Record a 2-5 minute video explaining key concepts from the course</li>
            <li>• Demonstrate practical examples or code if applicable</li>
            <li>• Speak clearly and maintain good lighting</li>
            <li>• You can retake the recording if needed</li>
            <li>• Once submitted, your assessment will be reviewed for certification</li>
          </ul>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recording Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Record Your Assessment
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAudioEnabled(!audioEnabled)}
                  className={`p-2 rounded-lg transition-colors ${audioEnabled
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                    : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                    }`}
                >
                  {audioEnabled ? <Mic size={16} /> : <MicOff size={16} />}
                </button>
              </div>
            </div>

            {/* Camera View */}
            <div className="relative bg-black rounded-lg overflow-hidden mb-4" style={{ aspectRatio: '16/9' }}>
              {!videoUrl ? (
                <Webcam
                  ref={webcamRef}
                  audio={audioEnabled}
                  className="w-full h-full object-cover"
                  mirrored
                />
              ) : (
                <video
                  src={videoUrl}
                  controls
                  className="w-full h-full object-cover"
                />
              )}

              {capturing && (
                <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  REC {formatTime(recordingTime)}
                </div>
              )}
            </div>

            {/* Recording Controls */}
            <div className="flex items-center justify-center gap-4">
              {!videoUrl ? (
                <>
                  {!capturing ? (
                    <button
                      onClick={handleStartCapture}
                      className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                      <Camera size={20} />
                      Start Recording
                    </button>
                  ) : (
                    <button
                      onClick={handleStopCapture}
                      className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                    >
                      <Square size={20} />
                      Stop Recording
                    </button>
                  )}
                </>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={handleRetakeRecording}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Camera size={16} />
                    Retake
                  </button>
                  <button
                    onClick={handleSubmitAssessment}
                    className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    <Upload size={16} />
                    Submit Assessment
                  </button>
                </div>
              )}
            </div>
          </motion.div>

          {/* Tips Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recording Tips
            </h2>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <FileVideo className="text-blue-600 dark:text-blue-400" size={16} />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Good Lighting</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Ensure you have good lighting on your face. Natural light works best.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mic className="text-green-600 dark:text-green-400" size={16} />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Clear Audio</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Speak clearly and at a moderate pace. Avoid background noise.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                  <Play className="text-purple-600 dark:text-purple-400" size={16} />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Content Structure</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Start with an introduction, explain key concepts, and provide examples.
                  </p>
                </div>
              </div>
            </div>

            {/* Suggested Topics */}
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                Topics to Cover:
              </h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• What you learned in this course</li>
                <li>• Key concepts and their applications</li>
                <li>• How you plan to use this knowledge</li>
                <li>• Any challenges you overcame</li>
                <li>• Practical examples or demonstrations</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}