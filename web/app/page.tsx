
'use client';

import Image from 'next/image';
import { courses } from '@/lib/courses';
import { CourseCard } from '@/components/CourseCard';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Award, Briefcase, CheckCircle, Sparkles, TrendingUp, Users, Star } from 'lucide-react';
import { useRef } from 'react';

export default function Home() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { 
        duration: 0.8,
        ease: "easeOut" as const
      }
    }
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut" as const
      }
    }
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut" as const
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans transition-colors duration-300">
      <Navbar />

      {/* Hero Section */}
      <section ref={heroRef} className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/10 pt-20 pb-32 lg:pt-32 lg:pb-40 transition-colors duration-300">
        {/* Animated Background Elements */}
        <motion.div 
          style={{ y, opacity }}
          className="absolute inset-0 -z-10"
        >
          <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-r from-amber-400/15 to-orange-400/15 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl" />
        </motion.div>

        {/* Floating Icons */}
        <motion.div variants={floatingVariants} animate="animate" className="absolute top-32 left-10 text-blue-400/30 dark:text-blue-300/20">
          <Sparkles size={32} />
        </motion.div>
        <motion.div variants={floatingVariants} animate="animate" className="absolute top-40 right-16 text-purple-400/30 dark:text-purple-300/20" style={{ animationDelay: '1s' }}>
          <TrendingUp size={28} />
        </motion.div>
        <motion.div variants={floatingVariants} animate="animate" className="absolute bottom-40 left-20 text-amber-400/30 dark:text-amber-300/20" style={{ animationDelay: '2s' }}>
          <Users size={30} />
        </motion.div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="mx-auto max-w-5xl"
          >
            {/* Animated Badge */}
            <motion.div 
              variants={itemVariants}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 px-6 py-3 rounded-full text-sm font-semibold mb-8 border border-blue-200/50 dark:border-blue-700/50 backdrop-blur-sm"
            >
              <motion.div variants={pulseVariants} animate="animate">
                <Star className="w-4 h-4 text-amber-500" fill="currentColor" />
              </motion.div>
              MSME Registered • Industry Certified • Job Ready
            </motion.div>
            
            <motion.h1 
              variants={itemVariants} 
              className="mb-8 text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white lg:text-7xl leading-tight"
            >
              Bridging the Gap Between{' '}
              <motion.span 
                className="relative inline-block"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 dark:from-blue-400 dark:via-purple-400 dark:to-blue-200">
                  Education
                </span>
                <motion.div
                  className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 1.5, duration: 0.8 }}
                />
              </motion.span>
              {' & '}
              <motion.span 
                className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600 dark:from-amber-400 dark:to-orange-400"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                Industry
              </motion.span>
            </motion.h1>
            
            <motion.p 
              variants={itemVariants} 
              className="mx-auto mb-12 max-w-3xl text-xl text-gray-600 dark:text-gray-300 leading-relaxed"
            >
              Skill Nexis is an MSME-registered tech training and internship startup. We provide industry-standard training, real-world projects, and recognized certifications to kickstart your career in technology.
            </motion.p>
            
            <motion.div 
              variants={itemVariants} 
              className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16"
            >
              <motion.a 
                href="#courses" 
                className="group relative w-full sm:w-auto rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-10 py-4 text-lg font-bold text-white shadow-2xl shadow-blue-900/25 overflow-hidden"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  Explore Internships
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600"
                  initial={{ x: "100%" }}
                  whileHover={{ x: "0%" }}
                  transition={{ duration: 0.3 }}
                />
              </motion.a>
              
              <motion.a 
                href="#" 
                className="group w-full sm:w-auto rounded-full border-2 border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-10 py-4 text-lg font-bold text-gray-700 dark:text-gray-200 hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span className="flex items-center gap-2">
                  Verify Certificate
                  <Award className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                </span>
              </motion.a>
            </motion.div>

            {/* Enhanced Features/Stats */}
            <motion.div 
              variants={itemVariants} 
              className="grid grid-cols-2 gap-8 md:grid-cols-4 border-t border-gray-200/50 dark:border-gray-700/50 pt-12"
            >
              {[
                { icon: Briefcase, title: "Industry Projects", color: "blue", bgColor: "bg-blue-50 dark:bg-blue-900/30" },
                { icon: Award, title: "Valid Certification", color: "amber", bgColor: "bg-amber-50 dark:bg-amber-900/30" },
                { icon: CheckCircle, title: "Job Assistance", color: "green", bgColor: "bg-green-50 dark:bg-green-900/30" },
                { icon: TrendingUp, title: "Career Growth", color: "purple", bgColor: "bg-purple-50 dark:bg-purple-900/30" }
              ].map((feature, index) => (
                <motion.div 
                  key={index}
                  className="flex flex-col items-center gap-3 group cursor-pointer"
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <motion.div 
                    className={`flex h-16 w-16 items-center justify-center rounded-2xl ${feature.bgColor} text-${feature.color}-600 dark:text-${feature.color}-400 group-hover:shadow-lg transition-all`}
                    whileHover={{ rotate: 5 }}
                  >
                    <feature.icon size={28} />
                  </motion.div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-center group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {feature.title}
                  </h3>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Courses Grid */}
      <section id="courses" className="py-24 bg-gradient-to-b from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16 text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold mb-6"
            >
              <Sparkles className="w-4 h-4" />
              Premium Training Programs
            </motion.div>
            
            <h2 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent mb-6">
              Available Internship Programs
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
              Choose from our wide range of technical programs designed to make you industry-ready with hands-on projects and real-world experience.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {courses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1,
                  ease: [0.25, 0.25, 0, 1]
                }}
              >
                <CourseCard course={course} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white overflow-hidden relative">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360]
            }}
            transition={{ 
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"
          />
          <motion.div 
            animate={{ 
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0]
            }}
            transition={{ 
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute bottom-0 left-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl"
          />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.h2 
              className="text-4xl md:text-5xl font-bold mb-6"
              initial={{ scale: 0.9 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              Ready to Boost Your Career?
            </motion.h2>
            <motion.p 
              className="mb-10 text-blue-100 max-w-3xl mx-auto text-xl leading-relaxed"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Join thousands of students who have transformed their careers with Skill Nexis. 
              Get certified, build your portfolio, and get hired by top companies.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <motion.a 
                href="#" 
                className="group relative inline-block rounded-full bg-white text-blue-600 font-bold px-10 py-4 text-lg shadow-2xl overflow-hidden"
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  Build Your Resume Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-400"
                  initial={{ x: "100%" }}
                  whileHover={{ x: "0%" }}
                  transition={{ duration: 0.3 }}
                />
              </motion.a>
              
              <motion.a 
                href="#courses" 
                className="group inline-block rounded-full border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white font-bold px-10 py-4 text-lg hover:bg-white/20 transition-all"
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span className="flex items-center gap-2">
                  View All Programs
                  <Briefcase className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                </span>
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16 text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 text-green-700 dark:text-green-300 px-4 py-2 rounded-full text-sm font-semibold mb-6"
            >
              <Star className="w-4 h-4 text-amber-500" fill="currentColor" />
              Success Stories
            </motion.div>
            
            <h2 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-green-800 to-blue-800 dark:from-white dark:via-green-200 dark:to-blue-200 bg-clip-text text-transparent mb-6">
              What Our Students Say
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
              Hear from students who have successfully transformed their careers with Skill Nexis and landed their dream jobs.
            </p>
          </motion.div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Priya Sharma",
                role: "Software Developer at TCS",
                course: "Full Stack Web Development",
                image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
                testimonial: "The MERN stack course was incredible! The hands-on projects and industry mentorship helped me land my dream job. The certificate is recognized by top companies."
              },
              {
                name: "Rahul Kumar",
                role: "Data Scientist at Wipro",
                course: "Data Science with Python",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
                testimonial: "Skill Nexis provided exactly what I needed - practical skills and real-world projects. The assessment process was thorough and the certificate opened many doors."
              },
              {
                name: "Anita Patel",
                role: "Cloud Engineer at Infosys",
                course: "Cloud Computing with AWS",
                image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
                testimonial: "The AWS course was comprehensive and up-to-date. The instructors were knowledgeable and the hands-on labs were excellent. Highly recommend!"
              },
              {
                name: "Vikash Singh",
                role: "Mobile App Developer",
                course: "Flutter Development",
                image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
                testimonial: "Learning Flutter through Skill Nexis was amazing. The course structure and practical approach helped me build real apps and get hired quickly."
              },
              {
                name: "Sneha Reddy",
                role: "Frontend Developer at Accenture",
                course: "Web Development",
                image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
                testimonial: "The web development course covered everything from basics to advanced concepts. The projects in my portfolio directly helped me get my current job."
              },
              {
                name: "Arjun Mehta",
                role: "Java Developer at HCL",
                course: "Java Programming",
                image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
                testimonial: "Excellent course content and great support from instructors. The Java course with OOP concepts and projects was exactly what I needed for my career switch."
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ 
                  delay: index * 0.1, 
                  duration: 0.6,
                  ease: [0.25, 0.25, 0, 1]
                }}
                whileHover={{ 
                  y: -10, 
                  scale: 1.02,
                  transition: { type: "spring", stiffness: 300 }
                }}
                className="group bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-2xl hover:border-blue-200 dark:hover:border-blue-700 transition-all duration-300 relative overflow-hidden"
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-purple-50/0 group-hover:from-blue-50/50 group-hover:to-purple-50/30 dark:group-hover:from-blue-900/20 dark:group-hover:to-purple-900/10 transition-all duration-300 rounded-2xl" />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        width={56}
                        height={56}
                        className="w-14 h-14 rounded-full object-cover ring-2 ring-blue-100 dark:ring-blue-800"
                      />
                    </motion.div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white text-lg">{testimonial.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">{testimonial.role}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 dark:text-gray-300 mb-6 italic leading-relaxed">
                    &ldquo;{testimonial.testimonial}&rdquo;
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-semibold">
                      {testimonial.course}
                    </span>
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <motion.span 
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: (index * 0.1) + (i * 0.1), duration: 0.3 }}
                          whileHover={{ scale: 1.2 }}
                        >
                          ⭐
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
