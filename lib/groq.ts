import Groq from 'groq-sdk'

let groqClient: Groq | null = null

function getGroqClient(): Groq {
  if (!groqClient) {
    if (!process.env.GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY environment variable is required')
    }
    groqClient = new Groq({
      apiKey: process.env.GROQ_API_KEY
    })
  }
  return groqClient
}

export async function analyzeWithAI<T>(
  prompt: string,
  systemPrompt: string
): Promise<T> {
  const groq = getGroqClient()

  const response = await groq.chat.completions.create({
    model: 'llama-3.1-70b-versatile',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt }
    ],
    temperature: 0.1,
    max_tokens: 4096,
    response_format: { type: 'json_object' }
  })

  const content = response.choices[0]?.message?.content
  if (!content) throw new Error('No response from AI')

  return JSON.parse(content) as T
}
