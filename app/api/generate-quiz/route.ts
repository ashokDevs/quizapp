import OpenAI from 'openai'
import { NextResponse } from 'next/server'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  const { topic, numQuestions, difficulty } = await request.json()

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant that generates quizzes for software developers.' },
        { role: 'user', content: `Generate a ${difficulty} difficulty quiz about ${topic} with ${numQuestions} questions. Return the result as a JSON array where each question is an object with the following properties: question, options (an array of 4 strings), correctAnswer (the correct option), and optionally a code property for code snippets. Make sure to use full code snippets and not just code snippets whenever it is relevant. ` },
      ],
      functions: [
        {
          name: 'generate_quiz',
          description: 'Generate a quiz with the specified parameters',
          parameters: {
            type: 'object',
            properties: {
              questions: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    question: { type: 'string' },
                    options: { type: 'array', items: { type: 'string' } },
                    correctAnswer: { type: 'string' },
                    code: { type: 'string', optional: true },
                  },
                  required: ['question', 'options', 'correctAnswer'],
                },
              },
            },
            required: ['questions'],
          },
        },
      ],
      function_call: { name: 'generate_quiz' },
    })

    const functionCall = completion.choices[0].message.function_call
    if (functionCall && functionCall.name === 'generate_quiz') {
      const quizData = JSON.parse(functionCall.arguments || '{}')
      return NextResponse.json(quizData.questions)
    } else {
      throw new Error('Unexpected response format')
    }
  } catch (error) {
    console.error('Error generating quiz:', error)
    return NextResponse.json({ message: 'Error generating quiz' }, { status: 500 })
  }
}