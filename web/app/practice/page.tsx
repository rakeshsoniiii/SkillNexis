'use client';

import { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Editor } from '@monaco-editor/react';
import { Play, Save, RotateCcw, Code, Terminal, CheckCircle, X } from 'lucide-react';

const codingChallenges = [
  {
    id: 1,
    title: 'Hello World',
    description: 'Write a program that prints "Hello, World!" to the console.',
    language: 'javascript',
    starterCode: '// Write your code here\nconsole.log("Hello, World!");',
    expectedOutput: 'Hello, World!',
    difficulty: 'Easy'
  },
  {
    id: 2,
    title: 'Sum of Two Numbers',
    description: 'Create a function that takes two numbers and returns their sum.',
    language: 'javascript',
    starterCode: 'function sum(a, b) {\n  // Write your code here\n  return a + b;\n}\n\nconsole.log(sum(5, 3));',
    expectedOutput: '8',
    difficulty: 'Easy'
  },
  {
    id: 3,
    title: 'Reverse String',
    description: 'Write a function that reverses a string.',
    language: 'javascript',
    starterCode: 'function reverseString(str) {\n  // Write your code here\n  return str.split("").reverse().join("");\n}\n\nconsole.log(reverseString("hello"));',
    expectedOutput: 'olleh',
    difficulty: 'Medium'
  },
  {
    id: 4,
    title: 'FizzBuzz',
    description: 'Print numbers 1-15, but replace multiples of 3 with "Fizz", multiples of 5 with "Buzz", and multiples of both with "FizzBuzz".',
    language: 'javascript',
    starterCode: 'for (let i = 1; i <= 15; i++) {\n  // Write your code here\n  if (i % 15 === 0) {\n    console.log("FizzBuzz");\n  } else if (i % 3 === 0) {\n    console.log("Fizz");\n  } else if (i % 5 === 0) {\n    console.log("Buzz");\n  } else {\n    console.log(i);\n  }\n}',
    expectedOutput: '1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz',
    difficulty: 'Medium'
  }
];

export default function PracticePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [selectedChallenge, setSelectedChallenge] = useState<typeof codingChallenges[0] | null>(codingChallenges[0] || null);
  const [code, setCode] = useState(codingChallenges[0]?.starterCode || '');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [theme, setTheme] = useState<'vs-dark' | 'light'>('vs-dark');
  const [language, setLanguage] = useState('javascript');
  const [testResults, setTestResults] = useState<{ passed: boolean; message: string } | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const handleChallengeChange = (challenge: typeof codingChallenges[0]) => {
    setSelectedChallenge(challenge);
    setCode(challenge.starterCode);
    setOutput('');
    setTestResults(null);
  };

  const runCode = async () => {
    if (!selectedChallenge) return;
    
    setIsRunning(true);
    setOutput('');
    setTestResults(null);

    try {
      // Create a mock console for capturing output
      let consoleOutput = '';
      const mockConsole = {
        log: (...args: unknown[]) => {
          consoleOutput += args.join(' ') + '\n';
        }
      };

      // Execute the code in a safe environment
      const func = new Function('console', code);
      func(mockConsole);

      const result = consoleOutput.trim();
      setOutput(result);

      // Check if output matches expected
      const passed = result === selectedChallenge.expectedOutput;
      setTestResults({
        passed,
        message: passed ? 'Test passed! Great job!' : 'Output doesn\'t match expected result.'
      });

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setOutput(`Error: ${errorMessage}`);
      setTestResults({
        passed: false,
        message: 'Code execution failed. Check for syntax errors.'
      });
    }

    setIsRunning(false);
  };

  const resetCode = () => {
    if (!selectedChallenge) return;
    setCode(selectedChallenge.starterCode);
    setOutput('');
    setTestResults(null);
  };

  const saveCode = () => {
    if (!selectedChallenge) return;
    localStorage.setItem(`practice_${selectedChallenge.id}`, code);
    // Show a toast or notification here
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!selectedChallenge) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            No Challenge Selected
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Please select a challenge to start practicing.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Code Practice</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Practice your coding skills with interactive challenges
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-4">
          {/* Challenge List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Challenges</h2>
              <div className="space-y-3">
                {codingChallenges.map((challenge) => (
                  <button
                    key={challenge.id}
                    onClick={() => handleChallengeChange(challenge)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedChallenge.id === challenge.id
                        ? 'bg-primary text-white'
                        : 'bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                  >
                    <div className="font-medium">{challenge.title}</div>
                    <div className={`text-sm ${
                      selectedChallenge.id === challenge.id ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {challenge.difficulty}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-3"
          >
            {/* Challenge Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedChallenge.title}</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  selectedChallenge.difficulty === 'Easy' 
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                    : selectedChallenge.difficulty === 'Medium'
                    ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                    : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                }`}>
                  {selectedChallenge.difficulty}
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400">{selectedChallenge.description}</p>
            </div>

            {/* Editor Controls */}
            <div className="bg-white dark:bg-gray-800 rounded-t-xl shadow-sm border border-gray-200 dark:border-gray-700 border-b-0 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Code size={20} className="text-gray-500 dark:text-gray-400" />
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-1 text-sm"
                    >
                      <option value="javascript">JavaScript</option>
                      <option value="python">Python</option>
                      <option value="java">Java</option>
                      <option value="cpp">C++</option>
                    </select>
                  </div>
                  <button
                    onClick={() => setTheme(theme === 'vs-dark' ? 'light' : 'vs-dark')}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    {theme === 'vs-dark' ? '☀️ Light' : '🌙 Dark'}
                  </button>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={resetCode}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-1 text-sm"
                  >
                    <RotateCcw size={14} />
                    Reset
                  </button>
                  <button
                    onClick={saveCode}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors flex items-center gap-1 text-sm"
                  >
                    <Save size={14} />
                    Save
                  </button>
                  <button
                    onClick={runCode}
                    disabled={isRunning}
                    className="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center gap-1 text-sm disabled:opacity-50"
                  >
                    <Play size={14} />
                    {isRunning ? 'Running...' : 'Run Code'}
                  </button>
                </div>
              </div>
            </div>

            {/* Code Editor */}
            <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 border-b-0">
              <Editor
                height="400px"
                language={language}
                theme={theme}
                value={code}
                onChange={(value) => setCode(value || '')}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  roundedSelection: false,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                }}
              />
            </div>

            {/* Output Panel */}
            <div className="bg-white dark:bg-gray-800 rounded-b-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Terminal size={16} className="text-gray-500 dark:text-gray-400" />
                <span className="font-medium text-gray-700 dark:text-gray-300">Output</span>
                {testResults && (
                  <div className={`flex items-center gap-1 text-sm ${
                    testResults.passed ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {testResults.passed ? <CheckCircle size={14} /> : <X size={14} />}
                    {testResults.message}
                  </div>
                )}
              </div>
              
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm min-h-[100px] overflow-auto">
                {output || (isRunning ? 'Running code...' : 'Click "Run Code" to see output')}
              </div>
              
              {selectedChallenge.expectedOutput && (
                <div className="mt-4">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Expected Output:</div>
                  <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm font-mono">
                    {selectedChallenge.expectedOutput}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}