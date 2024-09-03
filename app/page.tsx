'use client'

import { useState } from 'react'
import QuizForm from '../components/QuizForm'
import Quiz from '../components/Quiz'
import React from 'react'

// Define the QuizQuestion interface here as well, or import it from a shared types file
interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  code?: string;
  language?: string;
}

export default function Home() {
  const [quiz, setQuiz] = useState<QuizQuestion[] | null>(null)

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Developer Quiz Generator</h1>
      
      {!quiz ? (
        <QuizForm onQuizGenerated={setQuiz} />
      ) : (
        <Quiz quiz={quiz} onReset={() => setQuiz(null)} />
      )}
    </main>
  );
}
