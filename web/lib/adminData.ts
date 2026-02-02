// Admin Data Management System
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  enrolledCourses: string[];
  completedCourses: string[];
  certificates: string[];
  progress: Record<string, number>;
  joinedDate: string;
  lastActive: string;
}

export interface AdminCourse {
  id: string;
  title: string;
  slug: string;
  description: string;
  videoUrl?: string;
  pdfUrl?: string;
  category: 'Programming' | 'Web Development' | 'Data Science' | 'Cloud & IoT' | 'Mobile';
  createdAt: string;
  updatedAt: string;
  enrolledCount: number;
  completedCount: number;
}

export interface AdminQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface AdminQuiz {
  courseSlug: string;
  questions: AdminQuestion[];
  createdAt: string;
  updatedAt: string;
  totalAttempts: number;
  averageScore: number;
}

export interface AdminStats {
  totalStudents: number;
  totalCourses: number;
  totalCertificates: number;
  completionRate: number;
  totalQuizzes: number;
  totalEnrollments: number;
  activeUsers: number;
  newUsersThisMonth: number;
}

class AdminDataManager {
  private static instance: AdminDataManager;
  private readonly USERS_KEY = 'skillnexis_admin_users';
  private readonly COURSES_KEY = 'skillnexis_admin_courses';
  private readonly QUIZZES_KEY = 'skillnexis_admin_quizzes';
  private readonly STATS_KEY = 'skillnexis_admin_stats';

  private constructor() {
    this.initializeData();
  }

  public static getInstance(): AdminDataManager {
    if (!AdminDataManager.instance) {
      AdminDataManager.instance = new AdminDataManager();
    }
    return AdminDataManager.instance;
  }

  private initializeData() {
    // Only initialize on client side
    if (typeof window === 'undefined') return;
    
    try {
      // Initialize with sample data if not exists
      if (!this.getUsers().length) {
        this.initializeSampleData();
      }
    } catch (error) {
      console.error('Error initializing admin data:', error);
    }
  }

  private initializeSampleData() {
    // Initialize with existing static courses if no courses exist
    const staticCoursesData = [
      {
        id: '1',
        title: 'C Programming',
        slug: 'c-programming',
        description: 'Master the fundamentals of C programming language with hands-on projects and real-world applications.',
        category: 'Programming' as const,
        videoUrl: 'https://www.youtube.com/embed/KJgsSFOSQv0',
        pdfUrl: 'https://www.tutorialspoint.com/cprogramming/cprogramming_tutorial.pdf',
      },
      {
        id: '2',
        title: 'C++',
        slug: 'cpp',
        description: 'Deep dive into object-oriented programming with C++ and build advanced applications.',
        category: 'Programming' as const,
        videoUrl: 'https://www.youtube.com/embed/vLnPwxZdW4Y',
        pdfUrl: 'https://www.tutorialspoint.com/cplusplus/cplusplus_tutorial.pdf',
      },
      {
        id: '3',
        title: 'PYTHON',
        slug: 'python',
        description: 'Learn Python from scratch to advanced concepts including data structures, algorithms, and frameworks.',
        category: 'Programming' as const,
        videoUrl: 'https://www.youtube.com/embed/rfscVS0vtbw',
        pdfUrl: 'https://www.tutorialspoint.com/python/python_tutorial.pdf',
      },
      {
        id: '4',
        title: 'Web Development (HTML, CSS, JavaScript)',
        slug: 'web-development',
        description: 'Build responsive websites using HTML, CSS, and JavaScript with modern development practices.',
        category: 'Web Development' as const,
        videoUrl: 'https://www.youtube.com/embed/zJSY8tbf_ys',
        pdfUrl: 'https://www.tutorialspoint.com/html/html_tutorial.pdf',
      },
      {
        id: '5',
        title: 'Data Science with Python',
        slug: 'data-science-python',
        description: 'Analyze data and build predictive models using Python libraries like Pandas, NumPy, and Scikit-learn.',
        category: 'Data Science' as const,
        videoUrl: 'https://www.youtube.com/embed/LHBE6Q9XlzI',
        pdfUrl: 'https://www.tutorialspoint.com/python_data_science/python_data_science_tutorial.pdf',
      },
      {
        id: '6',
        title: 'Machine Learning & AI',
        slug: 'machine-learning-ai',
        description: 'Introduction to Machine Learning algorithms and Artificial Intelligence concepts with practical implementations.',
        category: 'Data Science' as const,
        videoUrl: 'https://www.youtube.com/embed/i_LwzRVP7bg',
        pdfUrl: 'https://www.tutorialspoint.com/machine_learning_with_python/machine_learning_with_python_tutorial.pdf',
      },
      {
        id: '7',
        title: 'Full Stack Web Development (MERN)',
        slug: 'mern-stack',
        description: 'Become a full-stack developer with MongoDB, Express, React, and Node.js. Build complete web applications.',
        category: 'Web Development' as const,
        videoUrl: 'https://www.youtube.com/embed/7CqJlxBYj-M',
        pdfUrl: 'https://www.tutorialspoint.com/mern_stack/mern_stack_tutorial.pdf',
      },
      {
        id: '8',
        title: 'Java Programming (OOP + Projects)',
        slug: 'java-programming',
        description: 'Learn Java with a focus on Object-Oriented Programming and real-world projects including enterprise applications.',
        category: 'Programming' as const,
        videoUrl: 'https://www.youtube.com/embed/A74TOX803D0',
        pdfUrl: 'https://www.tutorialspoint.com/java/java_tutorial.pdf',
      },
      {
        id: '9',
        title: 'Data Structures & Algorithms (DSA)',
        slug: 'dsa',
        description: 'Master DSA to crack coding interviews and optimize code performance with comprehensive problem-solving techniques.',
        category: 'Programming' as const,
        videoUrl: 'https://www.youtube.com/embed/8hly31xKli0',
        pdfUrl: 'https://www.tutorialspoint.com/data_structures_algorithms/data_structures_algorithms_tutorial.pdf',
      },
      {
        id: '10',
        title: 'Mobile App Development (Flutter)',
        slug: 'flutter-development',
        description: 'Build cross-platform mobile apps using Flutter and Dart for both iOS and Android platforms.',
        category: 'Mobile' as const,
        videoUrl: 'https://www.youtube.com/embed/VPvVD8t02U8',
        pdfUrl: 'https://www.tutorialspoint.com/flutter/flutter_tutorial.pdf',
      },
      {
        id: '11',
        title: 'Cloud Computing with AWS',
        slug: 'aws-cloud',
        description: 'Learn cloud computing concepts and services on AWS including EC2, S3, Lambda, and deployment strategies.',
        category: 'Cloud & IoT' as const,
        videoUrl: 'https://www.youtube.com/embed/3hLmDS179YE',
        pdfUrl: 'https://www.tutorialspoint.com/amazon_web_services/amazon_web_services_tutorial.pdf',
      },
      {
        id: '12',
        title: 'Data Analyst',
        slug: 'data-analyst',
        description: 'Learn data analysis techniques and tools including Excel, SQL, and statistical analysis for business insights.',
        category: 'Data Science' as const,
        videoUrl: 'https://www.youtube.com/embed/r-uOLxNrNk8',
        pdfUrl: 'https://www.tutorialspoint.com/data_analysis/data_analysis_tutorial.pdf',
      },
      {
        id: '13',
        title: 'Power BI',
        slug: 'power-bi',
        description: 'Visualize data and share insights with Power BI. Create interactive dashboards and business intelligence reports.',
        category: 'Data Science' as const,
        videoUrl: 'https://www.youtube.com/embed/AGrl-H87pRU',
        pdfUrl: 'https://www.tutorialspoint.com/power_bi/power_bi_tutorial.pdf',
      }
    ];

    // Convert static courses to AdminCourse format
    const sampleCourses: AdminCourse[] = staticCoursesData.map(course => ({
      ...course,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
      enrolledCount: Math.floor(Math.random() * 500) + 100, // Random enrollment between 100-600
      completedCount: Math.floor(Math.random() * 200) + 50   // Random completion between 50-250
    }));

    // Sample users
    const sampleUsers: AdminUser[] = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        role: 'student',
        enrolledCourses: ['1', '2', '3'],
        completedCourses: ['1'],
        certificates: ['1'],
        progress: { '1': 100, '2': 65, '3': 30 },
        joinedDate: '2024-01-15',
        lastActive: '2024-02-01'
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        role: 'student',
        enrolledCourses: ['2', '4', '5'],
        completedCourses: ['2', '4'],
        certificates: ['2', '4'],
        progress: { '2': 100, '4': 100, '5': 80 },
        joinedDate: '2024-01-20',
        lastActive: '2024-02-02'
      },
      {
        id: '3',
        name: 'Mike Johnson',
        email: 'mike.johnson@example.com',
        role: 'student',
        enrolledCourses: ['1', '3', '6'],
        completedCourses: ['3'],
        certificates: ['3'],
        progress: { '1': 45, '3': 100, '6': 20 },
        joinedDate: '2024-01-25',
        lastActive: '2024-02-01'
      },
      {
        id: '4',
        name: 'Sarah Wilson',
        email: 'sarah.wilson@example.com',
        role: 'student',
        enrolledCourses: ['5', '7', '8'],
        completedCourses: ['5', '7'],
        certificates: ['5', '7'],
        progress: { '5': 100, '7': 100, '8': 90 },
        joinedDate: '2024-01-30',
        lastActive: '2024-02-02'
      },
      {
        id: '5',
        name: 'David Brown',
        email: 'david.brown@example.com',
        role: 'student',
        enrolledCourses: ['9', '10'],
        completedCourses: ['9'],
        certificates: ['9'],
        progress: { '9': 100, '10': 75 },
        joinedDate: '2024-02-01',
        lastActive: '2024-02-02'
      }
    ];

    // Sample quizzes for multiple courses
    const sampleQuizzes: AdminQuiz[] = [
      {
        courseSlug: 'c-programming',
        questions: [
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
            question: 'What is the size of int data type in C (on most systems)?',
            options: ['2 bytes', '4 bytes', '8 bytes', '1 byte'],
            correctAnswer: 1,
            explanation: 'On most modern systems, int is 4 bytes (32 bits).'
          }
        ],
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
        totalAttempts: 45,
        averageScore: 85
      },
      {
        courseSlug: 'cpp',
        questions: [
          {
            id: 1,
            question: 'Which of the following is a feature of Object-Oriented Programming?',
            options: ['Encapsulation', 'Inheritance', 'Polymorphism', 'All of the above'],
            correctAnswer: 3,
            explanation: 'OOP includes all these features: Encapsulation, Inheritance, and Polymorphism.'
          },
          {
            id: 2,
            question: 'What is the correct syntax for creating a class in C++?',
            options: ['class MyClass {}', 'Class MyClass {}', 'create class MyClass {}', 'new class MyClass {}'],
            correctAnswer: 0,
            explanation: 'In C++, classes are declared using the "class" keyword followed by the class name and curly braces.'
          }
        ],
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
        totalAttempts: 32,
        averageScore: 78
      },
      {
        courseSlug: 'python',
        questions: [
          {
            id: 1,
            question: 'Which of the following is the correct way to create a list in Python?',
            options: ['list = []', 'list = ()', 'list = {}', 'list = ""'],
            correctAnswer: 0,
            explanation: 'Square brackets [] are used to create lists in Python.'
          },
          {
            id: 2,
            question: 'What is the output of print(type([]))?',
            options: ['<class "list">', '<class "array">', '<class "tuple">', '<class "dict">'],
            correctAnswer: 0,
            explanation: 'Empty square brackets create a list object, so type([]) returns <class "list">.'
          }
        ],
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
        totalAttempts: 67,
        averageScore: 92
      },
      {
        courseSlug: 'web-development',
        questions: [
          {
            id: 1,
            question: 'Which HTML tag is used to create a hyperlink?',
            options: ['<link>', '<a>', '<href>', '<url>'],
            correctAnswer: 1,
            explanation: 'The <a> tag with href attribute is used to create hyperlinks in HTML.'
          },
          {
            id: 2,
            question: 'Which CSS property is used to change the text color?',
            options: ['font-color', 'text-color', 'color', 'foreground-color'],
            correctAnswer: 2,
            explanation: 'The "color" property in CSS is used to set the text color.'
          }
        ],
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
        totalAttempts: 89,
        averageScore: 87
      },
      {
        courseSlug: 'java-programming',
        questions: [
          {
            id: 1,
            question: 'Which keyword is used to create a class in Java?',
            options: ['class', 'Class', 'create', 'new'],
            correctAnswer: 0,
            explanation: 'The "class" keyword is used to declare a class in Java.'
          },
          {
            id: 2,
            question: 'What is the main method signature in Java?',
            options: ['public static void main(String args[])', 'public void main(String args[])', 'static void main(String args[])', 'void main(String args[])'],
            correctAnswer: 0,
            explanation: 'The main method must be public, static, void, and take String array as parameter.'
          }
        ],
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
        totalAttempts: 54,
        averageScore: 81
      }
    ];

    this.saveUsers(sampleUsers);
    this.saveCourses(sampleCourses);
    this.saveQuizzes(sampleQuizzes);
    this.updateStats();
  }

  // Users Management
  public getUsers(): AdminUser[] {
    if (typeof window === 'undefined') return [];
    try {
      const users = localStorage.getItem(this.USERS_KEY);
      return users ? JSON.parse(users) : [];
    } catch (error) {
      console.error('Error reading users from localStorage:', error);
      return [];
    }
  }

  public saveUsers(users: AdminUser[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
      this.updateStats();
    } catch (error) {
      console.error('Error saving users to localStorage:', error);
    }
  }

  public addUser(user: AdminUser): void {
    const users = this.getUsers();
    users.push(user);
    this.saveUsers(users);
  }

  public updateUser(userId: string, updates: Partial<AdminUser>): void {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === userId);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates } as AdminUser;
      this.saveUsers(users);
    }
  }

  public deleteUser(userId: string): void {
    const users = this.getUsers().filter(u => u.id !== userId);
    this.saveUsers(users);
  }

  // Courses Management
  public getCourses(): AdminCourse[] {
    if (typeof window === 'undefined') return [];
    try {
      const courses = localStorage.getItem(this.COURSES_KEY);
      return courses ? JSON.parse(courses) : [];
    } catch (error) {
      console.error('Error reading courses from localStorage:', error);
      return [];
    }
  }

  public saveCourses(courses: AdminCourse[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(this.COURSES_KEY, JSON.stringify(courses));
      this.updateStats();
    } catch (error) {
      console.error('Error saving courses to localStorage:', error);
    }
  }

  public addCourse(course: Omit<AdminCourse, 'id' | 'createdAt' | 'updatedAt' | 'enrolledCount' | 'completedCount'>): void {
    const courses = this.getCourses();
    const newCourse: AdminCourse = {
      ...course,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      enrolledCount: 0,
      completedCount: 0
    };
    courses.push(newCourse);
    this.saveCourses(courses);
  }

  public updateCourse(courseId: string, updates: Partial<AdminCourse>): void {
    const courses = this.getCourses();
    const index = courses.findIndex(c => c.id === courseId);
    if (index !== -1) {
      courses[index] = { 
        ...courses[index], 
        ...updates, 
        updatedAt: new Date().toISOString() 
      } as AdminCourse;
      this.saveCourses(courses);
    }
  }

  public deleteCourse(courseId: string): void {
    const courses = this.getCourses().filter(c => c.id !== courseId);
    this.saveCourses(courses);
    
    // Also remove related quizzes
    const quizzes = this.getQuizzes().filter(q => q.courseSlug !== this.getCourseSlug(courseId));
    this.saveQuizzes(quizzes);
  }

  private getCourseSlug(courseId: string): string {
    const course = this.getCourses().find(c => c.id === courseId);
    return course?.slug || '';
  }

  // Quizzes Management
  public getQuizzes(): AdminQuiz[] {
    if (typeof window === 'undefined') return [];
    try {
      const quizzes = localStorage.getItem(this.QUIZZES_KEY);
      return quizzes ? JSON.parse(quizzes) : [];
    } catch (error) {
      console.error('Error reading quizzes from localStorage:', error);
      return [];
    }
  }

  public saveQuizzes(quizzes: AdminQuiz[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(this.QUIZZES_KEY, JSON.stringify(quizzes));
      this.updateStats();
    } catch (error) {
      console.error('Error saving quizzes to localStorage:', error);
    }
  }

  public addQuiz(quiz: Omit<AdminQuiz, 'createdAt' | 'updatedAt' | 'totalAttempts' | 'averageScore'>): void {
    const quizzes = this.getQuizzes();
    const newQuiz: AdminQuiz = {
      ...quiz,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      totalAttempts: 0,
      averageScore: 0
    };
    
    // Remove existing quiz for the same course
    const filteredQuizzes = quizzes.filter(q => q.courseSlug !== quiz.courseSlug);
    filteredQuizzes.push(newQuiz);
    this.saveQuizzes(filteredQuizzes);
  }

  public updateQuiz(courseSlug: string, updates: Partial<AdminQuiz>): void {
    const quizzes = this.getQuizzes();
    const index = quizzes.findIndex(q => q.courseSlug === courseSlug);
    if (index !== -1) {
      quizzes[index] = { 
        ...quizzes[index], 
        ...updates, 
        updatedAt: new Date().toISOString() 
      } as AdminQuiz;
      this.saveQuizzes(quizzes);
    }
  }

  public deleteQuiz(courseSlug: string): void {
    const quizzes = this.getQuizzes().filter(q => q.courseSlug !== courseSlug);
    this.saveQuizzes(quizzes);
  }

  // Stats Management
  public getStats(): AdminStats {
    if (typeof window === 'undefined') {
      return {
        totalStudents: 0,
        totalCourses: 0,
        totalCertificates: 0,
        completionRate: 0,
        totalQuizzes: 0,
        totalEnrollments: 0,
        activeUsers: 0,
        newUsersThisMonth: 0
      };
    }
    
    const stats = localStorage.getItem(this.STATS_KEY);
    return stats ? JSON.parse(stats) : this.calculateStats();
  }

  private calculateStats(): AdminStats {
    const users = this.getUsers();
    const courses = this.getCourses();
    const quizzes = this.getQuizzes();

    const totalStudents = users.filter(u => u.role === 'student').length;
    const totalCourses = courses.length;
    const totalCertificates = users.reduce((sum, user) => sum + user.certificates.length, 0);
    const totalEnrollments = users.reduce((sum, user) => sum + user.enrolledCourses.length, 0);
    const totalCompletions = users.reduce((sum, user) => sum + user.completedCourses.length, 0);
    const completionRate = totalEnrollments > 0 ? Math.round((totalCompletions / totalEnrollments) * 100) : 0;
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const newUsersThisMonth = users.filter(user => {
      const joinedDate = new Date(user.joinedDate);
      return joinedDate.getMonth() === currentMonth && joinedDate.getFullYear() === currentYear;
    }).length;

    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    const activeUsers = users.filter(user => new Date(user.lastActive) >= lastWeek).length;

    const stats: AdminStats = {
      totalStudents,
      totalCourses,
      totalCertificates,
      completionRate,
      totalQuizzes: quizzes.length,
      totalEnrollments,
      activeUsers,
      newUsersThisMonth
    };

    this.saveStats(stats);
    return stats;
  }

  private saveStats(stats: AdminStats): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(this.STATS_KEY, JSON.stringify(stats));
    } catch (error) {
      console.error('Error saving stats to localStorage:', error);
    }
  }

  public updateStats(): void {
    this.calculateStats();
  }

  // Enrollment Management
  public enrollUserInCourse(userId: string, courseId: string): void {
    const users = this.getUsers();
    const courses = this.getCourses();
    
    const userIndex = users.findIndex(u => u.id === userId);
    const courseIndex = courses.findIndex(c => c.id === courseId);
    
    if (userIndex !== -1 && courseIndex !== -1) {
      const user = users[userIndex];
      const course = courses[courseIndex];
      
      if (user && course && !user.enrolledCourses.includes(courseId)) {
        user.enrolledCourses.push(courseId);
        user.progress[courseId] = 0;
        course.enrolledCount++;
        
        this.saveUsers(users);
        this.saveCourses(courses);
      }
    }
  }

  public completeCourse(userId: string, courseId: string): void {
    const users = this.getUsers();
    const courses = this.getCourses();
    
    const userIndex = users.findIndex(u => u.id === userId);
    const courseIndex = courses.findIndex(c => c.id === courseId);
    
    if (userIndex !== -1 && courseIndex !== -1) {
      const user = users[userIndex];
      const course = courses[courseIndex];
      
      if (user && course && !user.completedCourses.includes(courseId)) {
        user.completedCourses.push(courseId);
        user.certificates.push(courseId);
        user.progress[courseId] = 100;
        course.completedCount++;
        
        this.saveUsers(users);
        this.saveCourses(courses);
      }
    }
  }
}

export const adminDataManager = AdminDataManager.getInstance();