'use client'

import React, { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import Prism from 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-python'

const formatCode = (code: string) => {
  // Simple formatting for demonstration purposes
  // You might want to use a more sophisticated code formatter in production
  return code
    .replace(/\{/g, '{\n  ')
    .replace(/\}/g, '\n}')
    .replace(/;/g, ';\n  ')
    .replace(/\s+$/gm, '')  // Remove trailing spaces
    .trim()
}

// Define the structure of a quiz question
interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  code?: string;
  language?: string;
}

// Define the props for the Quiz component
interface QuizProps {
  quiz: QuizQuestion[];
  onReset: () => void;
}

const Quiz: React.FC<QuizProps> = ({ quiz, onReset }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) setScore(score + 1)
    if (currentQuestion < quiz.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setShowResult(true)
    }
  }

  useEffect(() => {
    Prism.highlightAll()
  }, [currentQuestion])

  if (showResult) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Quiz Results</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">You scored {score} out of {quiz.length}</p>
          <Button onClick={onReset}>Start New Quiz</Button>
        </CardContent>
      </Card>
    )
  }

  const question = quiz[currentQuestion]

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Question {currentQuestion + 1} of {quiz.length}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">{question.question}</p>
        {question.code && (
          <pre className="rounded mb-4 overflow-x-auto p-4 bg-muted whitespace-pre-wrap">
            <code className={`language-${question.language || 'javascript'}`}>
              {formatCode(question.code)}
            </code>
          </pre>
        )}
        <div className="space-y-2">
          {question.options.map((option, index) => (
            <Button
              key={index}
              onClick={() => handleAnswer(option === question.correctAnswer)}
              className="w-full text-left justify-start"
              variant="outline"
            >
              {option}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default Quiz