'use client'

import React, { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import { Loader2 } from "lucide-react"

// Define the structure of a quiz question
interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  code?: string;
  language?: string;
}

// Define the props for the QuizForm component
interface QuizFormProps {
  onQuizGenerated: (quiz: QuizQuestion[]) => void;
}

const QuizForm: React.FC<QuizFormProps> = ({ onQuizGenerated }) => {
  const [topic, setTopic] = useState('')
  const [numQuestions, setNumQuestions] = useState('5')
  const [difficulty, setDifficulty] = useState('medium')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic, numQuestions: parseInt(numQuestions), difficulty }),
      })
      const quiz: QuizQuestion[] = await response.json()
      onQuizGenerated(quiz)
    } catch (error) {
      console.error('Error generating quiz:', error)
      // Handle error (e.g., show an error message to the user)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
      <Input
        type="text"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="Enter quiz topic"
        required
      />
      <Select value={numQuestions} onValueChange={setNumQuestions}>
        <SelectTrigger>
          <SelectValue placeholder="Number of questions" />
        </SelectTrigger>
        <SelectContent>
          {[5, 10, 15, 20].map((num) => (
            <SelectItem key={num} value={num.toString()}>
              {num} questions
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={difficulty} onValueChange={setDifficulty}>
        <SelectTrigger>
          <SelectValue placeholder="Select difficulty" />
        </SelectTrigger>
        <SelectContent>
          {['easy', 'medium', 'hard'].map((level) => (
            <SelectItem key={level} value={level}>
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating Quiz...
          </>
        ) : (
          'Start Quiz'
        )}
      </Button>
    </form>
  )
}

export default QuizForm