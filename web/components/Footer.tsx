
import Link from 'next/link';
import { GraduationCap, Mail, MapPin, Globe, Award, Users, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        <div className="absolute top-20 right-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="container mx-auto px-4 pt-20 pb-12">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4 mb-16">
            {/* Brand Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2"
            >
              <div className="flex items-center gap-3 font-bold text-3xl mb-6">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                  <GraduationCap size={36} className="text-white" />
                </div>
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Skill Nexis
                </span>
              </div>
              
              <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-md">
                MSME-registered tech training and internship startup dedicated to bridging the gap between education and industry requirements through hands-on learning and real-world projects.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-500/20 rounded-xl mb-2 mx-auto">
                    <Users size={24} className="text-blue-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">1000+</div>
                  <div className="text-sm text-gray-400">Students</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-green-500/20 rounded-xl mb-2 mx-auto">
                    <BookOpen size={24} className="text-green-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">15+</div>
                  <div className="text-sm text-gray-400">Programs</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-amber-500/20 rounded-xl mb-2 mx-auto">
                    <Award size={24} className="text-amber-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">95%</div>
                  <div className="text-sm text-gray-400">Success Rate</div>
                </div>
              </div>

              {/* MSME Badge */}
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-xl px-4 py-3">
                <Award className="text-amber-400" size={20} />
                <div>
                  <div className="text-sm font-semibold text-amber-400">MSME Registered</div>
                  <div className="text-xs text-gray-300">UDYAM-WB-10-0193090</div>
                </div>
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h3 className="font-bold text-xl mb-6 text-blue-400">Quick Links</h3>
              <ul className="space-y-4">
                {[
                  { name: 'Verify Certificate', href: '#', icon: Award },
                  { name: 'Resume Builder', href: '#', icon: BookOpen },
                  { name: 'Internship Programs', href: '#courses', icon: GraduationCap },
                  { name: 'Contact Us', href: '/contact', icon: Mail }
                ].map((link, index) => (
                  <li key={index}>
                    <Link 
                      href={link.href} 
                      className="flex items-center gap-3 text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-300 group"
                    >
                      <link.icon size={16} className="text-blue-400 group-hover:text-blue-300" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Popular Programs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="font-bold text-xl mb-6 text-purple-400">Popular Programs</h3>
              <ul className="space-y-4">
                {[
                  'Full Stack Development',
                  'Data Science & AI',
                  'Cloud Computing',
                  'Mobile App Development',
                  'Digital Marketing',
                  'UI/UX Design'
                ].map((program, index) => (
                  <li key={index}>
                    <a 
                      href="#" 
                      className="text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-300 block"
                    >
                      {program}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-8 mb-12"
          >
            <h3 className="font-bold text-2xl mb-6 text-center text-white">Get In Touch</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                <div className="p-3 bg-blue-500/20 rounded-xl">
                  <Mail className="text-blue-400" size={24} />
                </div>
                <div>
                  <div className="font-semibold text-white">Email Us</div>
                  <a 
                    href="mailto:skillnexis.official@gmail.com" 
                    className="text-gray-300 hover:text-blue-400 transition-colors text-sm"
                  >
                    skillnexis.official@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                <div className="p-3 bg-green-500/20 rounded-xl">
                  <MapPin className="text-green-400" size={24} />
                </div>
                <div>
                  <div className="font-semibold text-white">Location</div>
                  <div className="text-gray-300 text-sm">West Bengal, India</div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                <div className="p-3 bg-purple-500/20 rounded-xl">
                  <Globe className="text-purple-400" size={24} />
                </div>
                <div>
                  <div className="font-semibold text-white">Website</div>
                  <div className="text-gray-300 text-sm">skillnexis.com</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 bg-black/20 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-gray-400 text-sm">
                © {currentYear} Skill Nexis. All rights reserved. | MSME Registered Startup
              </div>
              <div className="flex gap-8 text-sm">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Terms of Service
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
