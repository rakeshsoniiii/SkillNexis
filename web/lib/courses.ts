
import { adminDataManager, AdminCourse } from './adminData';

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  videoUrl?: string; // YouTube link
  pdfUrl?: string;   // PDF download link
  category: 'Programming' | 'Web Development' | 'Data Science' | 'Cloud & IoT' | 'Mobile';
}

// Convert AdminCourse to Course interface for compatibility
function adminCourseToCourse(adminCourse: AdminCourse): Course {
  return {
    id: adminCourse.id,
    title: adminCourse.title,
    slug: adminCourse.slug,
    description: adminCourse.description,
    videoUrl: adminCourse.videoUrl,
    pdfUrl: adminCourse.pdfUrl,
    category: adminCourse.category
  };
}

// Get courses from admin data manager
export function getCourses(): Course[] {
  try {
    const adminCourses = adminDataManager.getCourses();
    return adminCourses.map(adminCourseToCourse);
  } catch (error) {
    console.error('Error getting courses:', error);
    return staticCourses; // Fallback to static courses
  }
}

// Get single course by slug
export function getCourseBySlug(slug: string): Course | undefined {
  try {
    const adminCourses = adminDataManager.getCourses();
    const adminCourse = adminCourses.find(c => c.slug === slug);
    return adminCourse ? adminCourseToCourse(adminCourse) : undefined;
  } catch (error) {
    console.error('Error getting course by slug:', error);
    return staticCourses.find(c => c.slug === slug); // Fallback to static courses
  }
}

// Get single course by id
export function getCourseById(id: string): Course | undefined {
  try {
    const adminCourses = adminDataManager.getCourses();
    const adminCourse = adminCourses.find(c => c.id === id);
    return adminCourse ? adminCourseToCourse(adminCourse) : undefined;
  } catch (error) {
    console.error('Error getting course by id:', error);
    return staticCourses.find(c => c.id === id); // Fallback to static courses
  }
}

// Static fallback data for initial setup (will be replaced by admin data)
export const staticCourses: Course[] = [
  {
    id: '1',
    title: 'C Programming',
    slug: 'c-programming',
    description: 'Master the fundamentals of C programming language.',
    category: 'Programming',
    videoUrl: 'https://www.youtube.com/embed/KJgsSFOSQv0',
    pdfUrl: 'https://www.tutorialspoint.com/cprogramming/cprogramming_tutorial.pdf',
  },
  {
    id: '2',
    title: 'C++',
    slug: 'cpp',
    description: 'Deep dive into object-oriented programming with C++.',
    category: 'Programming',
    videoUrl: 'https://www.youtube.com/embed/vLnPwxZdW4Y',
    pdfUrl: 'https://www.tutorialspoint.com/cplusplus/cplusplus_tutorial.pdf',
  },
  {
    id: '3',
    title: 'PYTHON',
    slug: 'python',
    description: 'Learn Python from scratch to advanced concepts.',
    category: 'Programming',
    videoUrl: 'https://www.youtube.com/embed/rfscVS0vtbw',
    pdfUrl: 'https://www.tutorialspoint.com/python/python_tutorial.pdf',
  },
  {
    id: '4',
    title: 'Web Development (HTML, CSS, JavaScript)',
    slug: 'web-development',
    description: 'Build responsive websites using HTML, CSS, and JavaScript.',
    category: 'Web Development',
    videoUrl: 'https://www.youtube.com/embed/zJSY8tbf_ys',
    pdfUrl: 'https://www.tutorialspoint.com/html/html_tutorial.pdf',
  },
  {
    id: '5',
    title: 'Data Science with Python',
    slug: 'data-science-python',
    description: 'Analyze data and build models using Python libraries.',
    category: 'Data Science',
    videoUrl: 'https://www.youtube.com/embed/LHBE6Q9XlzI',
    pdfUrl: 'https://www.tutorialspoint.com/python_data_science/python_data_science_tutorial.pdf',
  },
  {
    id: '6',
    title: 'Machine Learning & AI',
    slug: 'machine-learning-ai',
    description: 'Introduction to Machine Learning algorithms and Artificial Intelligence.',
    category: 'Data Science',
    videoUrl: 'https://www.youtube.com/embed/i_LwzRVP7bg',
    pdfUrl: 'https://www.tutorialspoint.com/machine_learning_with_python/machine_learning_with_python_tutorial.pdf',
  },
  {
    id: '7',
    title: 'Full Stack Web Development (MERN)',
    slug: 'mern-stack',
    description: 'Become a full-stack developer with MongoDB, Express, React, and Node.js.',
    category: 'Web Development',
    videoUrl: 'https://www.youtube.com/embed/7CqJlxBYj-M',
    pdfUrl: 'https://www.tutorialspoint.com/mern_stack/mern_stack_tutorial.pdf',
  },
  {
    id: '8',
    title: 'Java Programming (OOP + Projects)',
    slug: 'java-programming',
    description: 'Learn Java with a focus on Object-Oriented Programming and real-world projects.',
    category: 'Programming',
    videoUrl: 'https://www.youtube.com/embed/A74TOX803D0',
    pdfUrl: 'https://www.tutorialspoint.com/java/java_tutorial.pdf',
  },
  {
    id: '9',
    title: 'Data Structures & Algorithms (DSA)',
    slug: 'dsa',
    description: 'Master DSA to crack coding interviews and optimize code.',
    category: 'Programming',
    videoUrl: 'https://www.youtube.com/embed/8hly31xKli0',
    pdfUrl: 'https://www.tutorialspoint.com/data_structures_algorithms/data_structures_algorithms_tutorial.pdf',
  },
  {
    id: '10',
    title: 'Mobile App Development (Flutter)',
    slug: 'flutter-development',
    description: 'Build cross-platform mobile apps using Flutter.',
    category: 'Mobile',
    videoUrl: 'https://www.youtube.com/embed/VPvVD8t02U8',
    pdfUrl: 'https://www.tutorialspoint.com/flutter/flutter_tutorial.pdf',
  },
  {
    id: '11',
    title: 'Cloud Computing with AWS',
    slug: 'aws-cloud',
    description: 'Learn cloud computing concepts and services on AWS.',
    category: 'Cloud & IoT',
    videoUrl: 'https://www.youtube.com/embed/3hLmDS179YE',
    pdfUrl: 'https://www.tutorialspoint.com/amazon_web_services/amazon_web_services_tutorial.pdf',
  },
  {
    id: '12',
    title: 'Data Analyst',
    slug: 'data-analyst',
    description: 'Learn data analysis techniques and tools.',
    category: 'Data Science',
    videoUrl: 'https://www.youtube.com/embed/r-uOLxNrNk8',
    pdfUrl: 'https://www.tutorialspoint.com/data_analysis/data_analysis_tutorial.pdf',
  },
  {
    id: '13',
    title: 'Power BI',
    slug: 'power-bi',
    description: 'Visualize data and share insights with Power BI.',
    category: 'Data Science',
    videoUrl: 'https://www.youtube.com/embed/AGrl-H87pRU',
    pdfUrl: 'https://www.tutorialspoint.com/power_bi/power_bi_tutorial.pdf',
  },
  {
    id: '14',
    title: 'IoT (Internet of Things)',
    slug: 'iot',
    description: 'Connect devices and build smart IoT solutions.',
    category: 'Cloud & IoT',
    videoUrl: 'https://www.youtube.com/embed/h0gWfVCSGmg',
    pdfUrl: 'https://www.tutorialspoint.com/internet_of_things/internet_of_things_tutorial.pdf',
  },
];

// For backward compatibility, export courses as static fallback
export const courses = staticCourses;
