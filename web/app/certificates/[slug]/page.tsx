'use client';

import { useAuth } from '@/components/AuthProvider';
import { courses } from '@/lib/courses';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useMemo, use } from 'react';
import { motion } from 'framer-motion';
import { Download, Share2, Award, Calendar, CheckCircle } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Image from 'next/image';

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default function CertificatePage({ params }: PageProps) {
    const { slug } = use(params);
    const { user } = useAuth();
    const router = useRouter();
    const certificateRef = useRef<HTMLDivElement>(null);

    const course = courses.find(c => c.slug === slug);

    const certificateId = useMemo(() => {
        if (!course || !user) return '';
        // Use a stable hash based on course and user IDs to avoid re-renders
        const stableId = `${course.id}-${user.id}`.split('').reduce((a, b) => {
            a = ((a << 5) - a) + b.charCodeAt(0);
            return a & a;
        }, 0);
        return `SN-${course.id}-${user.id}-${Math.abs(stableId).toString().slice(-6)}`;
    }, [course, user]);

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }

        if (!course) {
            router.push('/courses');
            return;
        }

        // Check if user has completed the course
        if (!user.completedCourses.includes(course.id)) {
            router.push(`/courses/${slug}`);
            return;
        }
    }, [user, course, slug, router]);

    const downloadCertificate = async () => {
        if (!certificateRef.current) return;

        try {
            const canvas = await html2canvas(certificateRef.current, {
                scale: 2,
                backgroundColor: '#ffffff',
                width: 1200,
                height: 800
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'px',
                format: [1200, 800]
            });

            pdf.addImage(imgData, 'PNG', 0, 0, 1200, 800);
            pdf.save(`${course?.title.replace(/\s+/g, '_')}_Certificate.pdf`);
        } catch (error) {
            console.error('Error generating certificate:', error);
        }
    };

    const shareCertificate = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `${course?.title} Certificate`,
                    text: `I just completed ${course?.title} at Skill Nexis!`,
                    url: window.location.href,
                });
            } catch (error) {
                console.error('Error sharing:', error);
            }
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href);
            alert('Certificate link copied to clipboard!');
        }
    };

    if (!user || !course) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    const completionDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

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
                        <CheckCircle className="text-green-500" size={32} />
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Congratulations!
                        </h1>
                    </div>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        You have successfully completed {course.title}
                    </p>
                </motion.div>

                {/* Certificate */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-xl shadow-2xl overflow-hidden mb-8"
                >
                    <div
                        ref={certificateRef}
                        className="relative p-12 bg-linear-to-br from-blue-50 to-indigo-100"
                        style={{ aspectRatio: '3/2' }}
                    >
                        {/* Decorative Border */}
                        <div className="absolute inset-4 border-4 border-double border-blue-300 rounded-lg"></div>

                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="flex items-center justify-center mb-4">
                                <Image
                                    src="/Skill_Nexis_logo.svg"
                                    alt="Skill Nexis"
                                    width={64}
                                    height={64}
                                    className="h-16 w-auto"
                                />
                            </div>
                            <h1 className="text-4xl font-bold text-gray-800 mb-2">
                                Certificate of Completion
                            </h1>
                            <div className="w-24 h-1 bg-linear-to-r from-blue-500 to-indigo-600 mx-auto"></div>
                        </div>

                        {/* Content */}
                        <div className="text-center space-y-6">
                            <p className="text-lg text-gray-600">
                                This is to certify that
                            </p>

                            <h2 className="text-3xl font-bold text-gray-800 border-b-2 border-gray-300 pb-2 inline-block">
                                {user.name}
                            </h2>

                            <p className="text-lg text-gray-600">
                                has successfully completed the course
                            </p>

                            <h3 className="text-2xl font-semibold text-blue-600">
                                {course.title}
                            </h3>

                            <p className="text-gray-600">
                                demonstrating proficiency in {course.category.toLowerCase()} and
                                meeting all requirements for certification.
                            </p>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-between items-end mt-12">
                            <div className="text-left">
                                <div className="flex items-center gap-2 text-gray-600 mb-2">
                                    <Calendar size={16} />
                                    <span>Date of Completion</span>
                                </div>
                                <p className="font-semibold text-gray-800">{completionDate}</p>
                            </div>

                            <div className="text-center">
                                <div className="w-32 h-16 bg-linear-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mb-2">
                                    <Award className="text-white" size={32} />
                                </div>
                                <p className="text-sm text-gray-600">Verified Certificate</p>
                            </div>

                            <div className="text-right">
                                <div className="mb-2">
                                    <div className="w-24 border-b-2 border-gray-400 mb-1"></div>
                                    <p className="text-sm text-gray-600">Authorized Signature</p>
                                </div>
                                <p className="text-xs text-gray-500">Certificate ID: {certificateId}</p>
                            </div>
                        </div>

                        {/* Decorative Elements */}
                        <div className="absolute top-8 left-8 w-16 h-16 bg-blue-200 rounded-full opacity-20"></div>
                        <div className="absolute top-12 right-12 w-12 h-12 bg-indigo-200 rounded-full opacity-20"></div>
                        <div className="absolute bottom-8 left-12 w-20 h-20 bg-blue-100 rounded-full opacity-20"></div>
                        <div className="absolute bottom-12 right-8 w-14 h-14 bg-indigo-100 rounded-full opacity-20"></div>
                    </div>
                </motion.div>

                {/* Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
                >
                    <button
                        onClick={downloadCertificate}
                        className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-accent transition-colors font-medium"
                    >
                        <Download size={20} />
                        Download Certificate
                    </button>

                    <button
                        onClick={shareCertificate}
                        className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                        <Share2 size={20} />
                        Share Achievement
                    </button>
                </motion.div>

                {/* Certificate Info */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
                >
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                        Certificate Information
                    </h2>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Course Details</h3>
                            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                <li><strong>Course:</strong> {course.title}</li>
                                <li><strong>Category:</strong> {course.category}</li>
                                <li><strong>Completion Date:</strong> {completionDate}</li>
                                <li><strong>Certificate ID:</strong> {certificateId}</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Verification</h3>
                            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                <li><strong>Issued by:</strong> Skill Nexis</li>
                                <li><strong>Status:</strong> <span className="text-green-600 dark:text-green-400">Verified</span></li>
                                <li><strong>Validity:</strong> Lifetime</li>
                                <li><strong>Blockchain:</strong> Secured</li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <p className="text-sm text-blue-800 dark:text-blue-300">
                            <strong>Note:</strong> This certificate can be verified on our platform using the certificate ID.
                            It demonstrates your successful completion of all course requirements including video lectures,
                            quizzes, and practical assessments.
                        </p>
                    </div>
                </motion.div>

                {/* Next Steps */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="mt-8 text-center"
                >
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                        What&apos;s Next?
                    </h2>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={() => router.push('/courses')}
                            className="px-6 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                            Explore More Courses
                        </button>
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-accent transition-colors"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}