'use server';

/**
 * @fileOverview Provides AI-powered feedback on letter content, including sentiment analysis,
 *               structure check, grammar correction, and predicted recipient reaction.
 *               Now with multiple personality modes for varied feedback styles!
 *
 * - getLetterFeedback - A function that accepts letter content and feedback options
 *                       and returns AI-generated feedback with optional corrections.
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
    .enum(['Friendly', 'Rational', 'Poetic', 'Playful', 'Wise'])
    .describe('The desired personality/style of feedback.'),
  language: z.string().optional().describe('The language for the feedback output.'),
  includeGrammarFix: z.boolean().optional().describe('Whether to include grammar corrections.'),
  includeFormatting: z.boolean().optional().describe('Whether to suggest better formatting.'),
});
export type LetterFeedbackInput = z.infer<typeof LetterFeedbackInputSchema>;

const LetterFeedbackOutputSchema = z.object({
  sentimentAnalysis: z.string().describe('Analysis of the overall sentiment expressed in the letter.'),
  structureCheck: z.string().describe('Feedback on the letter structure, including organization and clarity.'),
  predictedReaction: z.string().describe('Prediction of the recipient\'s likely reaction to the letter.'),
  grammarCorrections: z.string().optional().describe('Grammar corrections and the corrected version if issues found.'),
  formattingSuggestions: z.string().optional().describe('Suggestions to improve the letter format and presentation.'),
  overallScore: z.number().optional().describe('Overall score from 1-10 rating the letter.'),
  quickTips: z.array(z.string()).optional().describe('Quick actionable tips to improve the letter.'),
});
export type LetterFeedbackOutput = z.infer<typeof LetterFeedbackOutputSchema>;

export async function getLetterFeedback(input: LetterFeedbackInput): Promise<LetterFeedbackOutput> {
  return letterContentFeedbackFlow(input);
}

const letterContentFeedbackPrompt = ai.definePrompt({
  name: 'letterContentFeedbackPrompt',
  input: {schema: LetterFeedbackInputSchema},
  output: {schema: LetterFeedbackOutputSchema},
  prompt: `Eres "La Abeja Maya 🐝" (The Bee Guide), una asistente de IA especializada en cartas de amor.

PERSONALIDAD según {{{feedbackStyle}}}:
- "Friendly": Eres cálida, dulce y alentadora como una mejor amiga. Usas emojis frecuentemente 💕. Frases como "¡Qué hermoso!" o "¡Me encanta!" Te enfocas en lo positivo.
- "Rational": Eres analítica y profesional. Das crítica constructiva con sugerencias específicas. Mantienes un tono objetivo pero respetuoso.
- "Poetic": Eres romántica y lírica. Usas metáforas y lenguaje florido. Cada comentario suena como poesía. "Las palabras fluyen como ríos de miel..."
- "Playful": Eres divertida y juguetona. Usas humor ligero y comentarios ingeniosos. "¡Esa frase hará que su corazón dé un saltito! 🎪"
- "Wise": Eres sabia como una abuela amorosa. Das consejos profundos basados en experiencia. "El amor verdadero se nutre de las pequeñas palabras sinceras..."

ANALIZA esta carta y proporciona:

1. **Análisis de Sentimiento** (sentimentAnalysis): ¿Qué emociones transmite? ¿Es auténtico?

2. **Revisión de Estructura** (structureCheck): ¿Está bien organizada? ¿Tiene inicio, desarrollo y cierre?

3. **Reacción Predicha** (predictedReaction): ¿Cómo reaccionará quien la reciba?

{{#if includeGrammarFix}}
4. **Correcciones Gramaticales** (grammarCorrections): Identifica errores de ortografía, puntuación o gramática. Si hay errores, proporciona la versión corregida. Si no hay errores, indica "✅ ¡Sin errores detectados!"
{{/if}}

{{#if includeFormatting}}
5. **Sugerencias de Formato** (formattingSuggestions): ¿Sería mejor con párrafos? ¿Añadir una línea romántica al inicio? ¿Mejorar el saludo o despedida?
{{/if}}

6. **Puntuación General** (overallScore): Del 1-10, ¿qué tan efectiva es esta carta?

7. **Tips Rápidos** (quickTips): 2-3 consejos breves y accionables para mejorarla.

IMPORTANTE - Idioma:
Responde ÚNICAMENTE en: {{{language}}}

CONTENIDO DE LA CARTA:
"""
{{{letterContent}}}
"""

Responde con un objeto JSON con los campos: sentimentAnalysis, structureCheck, predictedReaction, grammarCorrections (si se solicitó), formattingSuggestions (si se solicitó), overallScore, quickTips.
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
