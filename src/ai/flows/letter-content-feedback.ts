'use server';

/**
 * @fileOverview Provides AI-powered feedback on letter content, including sentiment analysis,
 *               structure check, and predicted recipient reaction.  This allows users to improve
 *               the effectiveness of their letters before sending.
 *
 * - getLetterFeedback - A function that accepts letter content and a selected feedback style
 *                       and returns AI-generated feedback.
 * - LetterFeedbackInput - The input type for the getLetterFeedback function.
 * - LetterFeedbackOutput - The return type for the getLetterFeedback function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const LetterFeedbackInputSchema = z.object({
  letterContent: z
    .string()
    .describe('The content of the letter to be reviewed.'),
  feedbackStyle: z
    .enum(['Friendly', 'Rational'])
    .describe('The desired style of feedback (Friendly or Rational).'),
  language: z.string().optional().describe('The language for the feedback output.'),
});
export type LetterFeedbackInput = z.infer<typeof LetterFeedbackInputSchema>;

const LetterFeedbackOutputSchema = z.object({
  sentimentAnalysis: z.string().describe('Analysis of the overall sentiment expressed in the letter.'),
  structureCheck: z.string().describe('Feedback on the letter structure, including organization and clarity.'),
  predictedReaction: z.string().describe('Prediction of the recipient’s likely reaction to the letter.'),
});
export type LetterFeedbackOutput = z.infer<typeof LetterFeedbackOutputSchema>;

export async function getLetterFeedback(input: LetterFeedbackInput): Promise<LetterFeedbackOutput> {
  return letterContentFeedbackFlow(input);
}

const letterContentFeedbackPrompt = ai.definePrompt({
  name: 'letterContentFeedbackPrompt',
  input: {schema: LetterFeedbackInputSchema},
  output: {schema: LetterFeedbackOutputSchema},
  prompt: `You are "La Abeja Guía" (The Bee Guide), an AI assistant providing feedback on love letters.

ANALYZE this letter content and provide:
1. Sentiment Analysis
2. Structure Check (organization and clarity)
3. Predicted Reaction (emotional response)

IMPORTANT - Feedback Style:
- If {{{feedbackStyle}}} is "Friendly": Use warm, encouraging tone with emojis. Be supportive and sweet like a best friend. Use phrases like "¡Qué lindo!" or "This is so sweet!" Focus on the positive aspects.
- If {{{feedbackStyle}}} is "Rational": Be analytical and objective. Use professional language. Provide constructive criticism with specific suggestions for improvement.

IMPORTANT - Language:
The output MUST be in the following language: {{{language}}}. Respond ONLY in this language.

Letter Content:
{{{letterContent}}}

Output MUST be a JSON object with sentimentAnalysis, structureCheck, and predictedReaction fields.
`,
});

const letterContentFeedbackFlow = ai.defineFlow(
  {
    name: 'letterContentFeedbackFlow',
    inputSchema: LetterFeedbackInputSchema,
    outputSchema: LetterFeedbackOutputSchema,
  },
  async input => {
    const {output} = await letterContentFeedbackPrompt(input);
    return output!;
  }
);
