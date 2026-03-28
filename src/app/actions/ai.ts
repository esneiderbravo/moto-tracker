'use server'

import { GoogleGenerativeAI } from '@google/generative-ai'
import { getMotorcycleSearchPrompt } from '@/ia/prompts/motorcycle-search'

export interface MotorcycleAIResult {
  make: string
  model: string
  year: number | null
  color: string
  engineCC: number | null
  horsepower: number | null
  serviceIntervalKm: number | null
  description: string
}

/**
 * Server action that uses Google Gemini to look up motorcycle specs from a freeform query.
 */
export async function searchMotorcycleWithAI(query: string): Promise<{ data?: MotorcycleAIResult; error?: string }> {
  const apiKey = process.env.GOOGLE_AI_API_KEY
  if (!apiKey) return { error: 'AI service not configured.' }
  if (!query.trim()) return { error: 'Please enter a motorcycle name or model.' }

  try {
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' })

    const prompt = getMotorcycleSearchPrompt(query)

    const result = await model.generateContent(prompt)
    const response = result.response
    const text = response.text().trim()

    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return { error: 'Could not parse AI response.' }

    try {
      const parsed = JSON.parse(jsonMatch[0])
      if (parsed.error === 'not_found') return { error: 'Motorcycle not found. Try a more specific name.' }
      return { data: parsed }
    } catch (parseErr) {
      return { error: 'AI response format error.' }
    }
  } catch (err: any) {
    if (err.message?.includes('API_KEY_INVALID')) return { error: 'Invalid AI API Key.' }
    if (err.message?.includes('quota') || err.status === 429) return { error: 'AI quota exceeded. Please try again later.' }

    return { error: 'AI search failed. Please fill in the details manually.' }
  }
}
