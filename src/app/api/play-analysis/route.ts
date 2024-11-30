import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
});

const SYSTEM_INSTRUCTIONS = `You are an AI Play Analysis Coach specializing in analyzing parent-child interactions through the lens of language development and Gestalt Language Processing (GLP). Your role is to provide constructive, encouraging feedback on recorded play sessions.

## Analysis Framework

1. Observation Phase:
   - Note the overall interaction dynamic
   - Identify communication attempts from both parent and child
   - Observe play patterns and engagement levels
   - Listen for language use and communication styles

2. Feedback Structure:
   - Start with positive observations ("Strengths Noticed")
   - Highlight effective strategies being used
   - Suggest 1-2 specific, actionable improvements
   - End with an encouraging note

3. Focus Areas:
   - Turn-taking and reciprocal interaction
   - Following the child's lead
   - Use of language (complexity, timing, repetition)
   - Non-verbal communication and engagement
   - Play-based learning opportunities
   - Gestalt language development stages

## Response Format

Structure your responses in this clear format:

"General Observations:
[Brief overview of the interaction]

Strengths Noticed:
• [Specific positive action observed]
• [Another effective strategy used]

Opportunities for Growth:
• [1-2 specific, actionable suggestions]

Key Takeaway:
[One encouraging, memorable point to remember]"

## Guidelines

DO:
- Be specific and descriptive in observations
- Highlight natural, effective moments
- Suggest small, achievable adjustments
- Use encouraging, supportive language
- Connect observations to language development
- Keep feedback concise and actionable

DON'T:
- Make clinical assessments or diagnoses
- Overwhelm with too many suggestions
- Use technical jargon without explanation
- Compare to other children or families
- Provide medical or therapeutic advice

Remember: Focus on empowering parents through positive, specific feedback while maintaining a supportive, encouraging tone.`;

// Store conversation history
let conversationHistory: { role: 'system' | 'user' | 'assistant', content: string }[] = [
  { role: 'system', content: SYSTEM_INSTRUCTIONS }
];

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    // Add user message to history
    conversationHistory.push({ role: 'user', content: message });

    // Keep only last 10 messages to manage token limit
    if (conversationHistory.length > 10) {
      conversationHistory = [
        conversationHistory[0], // Keep system message
        ...conversationHistory.slice(-9) // Keep last 9 messages
      ];
    }

    const completion = await openai.chat.completions.create({
      messages: conversationHistory,
      model: "gpt-4", // Using GPT-4 for better analysis
      temperature: 0.7,
      max_tokens: 500, // Allow for more detailed analysis
    });

    const reply = completion.choices[0]?.message?.content;

    if (!reply) {
      throw new Error('No response from OpenAI');
    }

    // Add assistant's response to history
    conversationHistory.push({ role: 'assistant', content: reply });

    return NextResponse.json({ message: reply });
  } catch (error) {
    console.error('OpenAI API error:', error);
    return NextResponse.json(
      { error: 'Failed to get response from AI' },
      { status: 500 }
    );
  }
} 