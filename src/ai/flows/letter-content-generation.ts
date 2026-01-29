'use server';

/**
 * @fileOverview Generates a draft letter from a short prompt describing the letter's goal.
 *
 * - generateLetterContent - A function that generates the letter content.
 * - GenerateLetterContentInput - The input type for the generateLetterContent function.
 * - GenerateLetterContentOutput - The return type for the generateLetterContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateLetterContentInputSchema = z.object({
  prompt: z.string().describe('A short prompt describing the letter\'s goal.'),
});
export type GenerateLetterContentInput = z.infer<typeof GenerateLetterContentInputSchema>;

const GenerateLetterContentOutputSchema = z.object({
  letterContent: z.string().describe('The generated letter content.'),
});
export type GenerateLetterContentOutput = z.infer<typeof GenerateLetterContentOutputSchema>;

export async function generateLetterContent(input: GenerateLetterContentInput): Promise<GenerateLetterContentOutput> {
  return generateLetterContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateLetterContentPrompt',
  input: {schema: GenerateLetterContentInputSchema},
  output: {schema: GenerateLetterContentOutputSchema},
  prompt: `You are a helpful assistant that generates letter content based on a short prompt. The letter should be well-written and engaging.

  Prompt: {{{prompt}}}`,
});

const generateLetterContentFlow = ai.defineFlow(
  {
    name: 'generateLetterContentFlow',
    inputSchema: GenerateLetterContentInputSchema,
    outputSchema: GenerateLetterContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
