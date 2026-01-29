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
  prompt: `You are an AI assistant providing feedback on letter content.

You will analyze the letter content, provide a sentiment analysis, check the structure, and predict the recipient's reaction.

Provide the feedback in a {{{feedbackStyle}}} style.

Letter Content: {{{letterContent}}}

Output a JSON object with sentimentAnalysis, structureCheck, and predictedReaction fields.  The structureCheck should comment on organization and clarity. The predictedReaction should try to evaluate the emotional response.
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
