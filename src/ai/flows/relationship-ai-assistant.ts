'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RewriteIntentSchema = z.enum([
  'reconcile',
  'gratitude',
  'celebration',
  'apology',
  'support',
]);

const ReplyToneSchema = z.enum(['warm', 'romantic', 'calm', 'playful']);

const RewriteLetterInputSchema = z.object({
  originalLetter: z.string().describe('Carta original escrita por el usuario.'),
  intent: RewriteIntentSchema.describe('Intencion emocional de la carta.'),
  relationshipContext: z.string().optional().describe('Contexto adicional de la relacion.'),
  language: z.string().optional().describe('Idioma de salida.'),
});

const RewriteLetterOutputSchema = z.object({
  rewrittenLetter: z.string().describe('Carta reescrita manteniendo autenticidad y mejorando claridad emocional.'),
  emotionalShift: z.string().describe('Resumen breve de como cambio el tono emocional.'),
  cautionNote: z.string().optional().describe('Advertencia breve si detecta posible malentendido.'),
});

export type RewriteLetterInput = z.infer<typeof RewriteLetterInputSchema>;
export type RewriteLetterOutput = z.infer<typeof RewriteLetterOutputSchema>;

const SuggestReplyInputSchema = z.object({
  receivedMessage: z.string().describe('Mensaje recibido de la pareja.'),
  preferredTone: ReplyToneSchema.describe('Tono preferido para responder.'),
  relationshipContext: z.string().optional().describe('Contexto breve de la relacion.'),
  language: z.string().optional().describe('Idioma de salida.'),
});

const SuggestReplyOutputSchema = z.object({
  replies: z
    .array(
      z.object({
        label: z.string().describe('Etiqueta corta de estilo.'),
        text: z.string().describe('Texto sugerido para responder.'),
      })
    )
    .min(3)
    .max(3)
    .describe('Tres respuestas alternativas listas para usar.'),
  recommendation: z.string().describe('Consejo sobre cual opcion usar segun contexto.'),
});

export type SuggestReplyInput = z.infer<typeof SuggestReplyInputSchema>;
export type SuggestReplyOutput = z.infer<typeof SuggestReplyOutputSchema>;

const WeeklyCheckinInputSchema = z.object({
  myFeeling: z.string().describe('Como se siente el usuario hoy en la relacion.'),
  whatINeed: z.string().describe('Que necesita del vinculo esta semana.'),
  gratitude: z.string().describe('Algo que agradece de su pareja.'),
  stressLevel: z.number().min(1).max(10).describe('Nivel de estres del 1 al 10.'),
  partnerName: z.string().optional().describe('Nombre de la pareja para personalizar respuesta.'),
  language: z.string().optional().describe('Idioma de salida.'),
});

const WeeklyCheckinOutputSchema = z.object({
  connectionSummary: z.string().describe('Resumen emocional corto del estado de la semana.'),
  suggestedActions: z.array(z.string()).min(3).max(3).describe('Tres acciones concretas y realistas para mejorar conexion.'),
  messageDraft: z.string().describe('Borrador breve para enviar a la pareja con tono saludable.'),
});

export type WeeklyCheckinInput = z.infer<typeof WeeklyCheckinInputSchema>;
export type WeeklyCheckinOutput = z.infer<typeof WeeklyCheckinOutputSchema>;

const EmotionalStyleSchema = z.enum(['direct', 'sensitive', 'warm', 'romantic', 'calm']);

const DetectToneRiskInputSchema = z.object({
  letterContent: z.string().describe('Carta a evaluar antes de enviar.'),
  language: z.string().optional().describe('Idioma de salida.'),
});

const DetectToneRiskOutputSchema = z.object({
  riskLevel: z.enum(['low', 'medium', 'high']).describe('Riesgo de malentendido emocional.'),
  summary: z.string().describe('Resumen breve del riesgo detectado.'),
  riskyPhrases: z.array(z.string()).describe('Frases potencialmente frias, ambiguas o hirientes.'),
  saferAlternative: z.string().describe('Version sugerida mas empatica para enviar.'),
});

export type DetectToneRiskInput = z.infer<typeof DetectToneRiskInputSchema>;
export type DetectToneRiskOutput = z.infer<typeof DetectToneRiskOutputSchema>;

const TranslateEmotionalStyleInputSchema = z.object({
  text: z.string().describe('Texto base a traducir de estilo emocional.'),
  fromStyle: EmotionalStyleSchema.describe('Estilo emocional actual percibido.'),
  toStyle: EmotionalStyleSchema.describe('Estilo emocional objetivo.'),
  preserveMeaning: z.boolean().optional().describe('Mantener fondo del mensaje sin cambiar intencion.'),
  language: z.string().optional().describe('Idioma de salida.'),
});

const TranslateEmotionalStyleOutputSchema = z.object({
  translatedText: z.string().describe('Texto transformado al estilo objetivo conservando intencion.'),
  changeNotes: z.string().describe('Que ajustes emocionales se hicieron.'),
});

export type TranslateEmotionalStyleInput = z.infer<typeof TranslateEmotionalStyleInputSchema>;
export type TranslateEmotionalStyleOutput = z.infer<typeof TranslateEmotionalStyleOutputSchema>;

const MemoryTypeSchema = z.enum(['milestone', 'favorite-letter', 'promise', 'trip', 'music', 'goal', 'other']);

const MemoryItemSchema = z.object({
  title: z.string(),
  details: z.string(),
  memoryDate: z.string().optional(),
  type: MemoryTypeSchema,
  tags: z.array(z.string()).optional(),
});

const TimelineInsightInputSchema = z.object({
  memories: z.array(MemoryItemSchema).max(80),
  language: z.string().optional(),
});

const TimelineInsightOutputSchema = z.object({
  timelineSummary: z.string().describe('Resumen de la evolucion de la relacion.'),
  highlights: z.array(z.string()).min(3).max(6).describe('Hitos clave detectados en orden emocional.'),
  nextMeaningfulStep: z.string().describe('Siguiente paso sugerido para fortalecer la relacion.'),
});

export type TimelineInsightInput = z.infer<typeof TimelineInsightInputSchema>;
export type TimelineInsightOutput = z.infer<typeof TimelineInsightOutputSchema>;

const MemoryGraphInputSchema = z.object({
  memories: z.array(MemoryItemSchema).max(80),
  language: z.string().optional(),
});

const MemoryGraphOutputSchema = z.object({
  themes: z.array(
    z.object({
      theme: z.string(),
      connectedMemories: z.array(z.string()).min(2).max(6),
      emotionalMeaning: z.string(),
    })
  ).min(2).max(5),
});

export type MemoryGraphInput = z.infer<typeof MemoryGraphInputSchema>;
export type MemoryGraphOutput = z.infer<typeof MemoryGraphOutputSchema>;

const ContextualRescueInputSchema = z.object({
  currentDraft: z.string(),
  memories: z.array(MemoryItemSchema).max(80),
  language: z.string().optional(),
});

const ContextualRescueOutputSchema = z.object({
  rescuedMessage: z.string().describe('Mensaje sugerido que incorpora memoria relevante con empatia.'),
  memoryReferences: z.array(z.string()).min(1).max(4).describe('Recuerdos usados para construir la sugerencia.'),
  empathyTips: z.array(z.string()).min(2).max(4).describe('Tips para responder con mas conexion emocional.'),
});

export type ContextualRescueInput = z.infer<typeof ContextualRescueInputSchema>;
export type ContextualRescueOutput = z.infer<typeof ContextualRescueOutputSchema>;

const ConflictMediationInputSchema = z.object({
  myPerspective: z.string().describe('Como ve el conflicto la persona usuaria.'),
  partnerPerspective: z.string().optional().describe('Como cree que lo ve su pareja.'),
  conflictTopic: z.string().describe('Tema del conflicto.'),
  desiredOutcome: z.string().describe('Resultado que desea lograr con la conversacion.'),
  language: z.string().optional().describe('Idioma de salida.'),
});

const ConflictMediationOutputSchema = z.object({
  neutralSummary: z.string().describe('Resumen neutral del conflicto sin culpas.'),
  turnByTurnGuide: z.array(z.string()).min(4).max(6).describe('Guion por turnos para conversar en orden sano.'),
  healthyBoundaries: z.array(z.string()).min(2).max(4).describe('Limites saludables para evitar escalada.'),
  agreementDraft: z.string().describe('Borrador de acuerdo concreto y realista.'),
});

export type ConflictMediationInput = z.infer<typeof ConflictMediationInputSchema>;
export type ConflictMediationOutput = z.infer<typeof ConflictMediationOutputSchema>;

const DetailPlannerInputSchema = z.object({
  availableTime: z.string().describe('Disponibilidad de tiempo, por ejemplo: 1 hora entre semana.'),
  budgetLevel: z.enum(['low', 'medium', 'high']).describe('Nivel de presupuesto disponible.'),
  partnerPreferences: z.string().describe('Gustos o preferencias de la pareja.'),
  cityOrContext: z.string().optional().describe('Ciudad o contexto, ejemplo: en casa, relación a distancia.'),
  language: z.string().optional().describe('Idioma de salida.'),
});

const DetailPlannerOutputSchema = z.object({
  microActions: z.array(
    z.object({
      title: z.string(),
      whyItWorks: z.string(),
      estimatedCost: z.string(),
      estimatedTime: z.string(),
      firstStep: z.string(),
    })
  ).min(3).max(5),
  weeklyPlan: z.array(z.string()).min(3).max(5).describe('Secuencia simple para aplicar las acciones durante la semana.'),
});

export type DetailPlannerInput = z.infer<typeof DetailPlannerInputSchema>;
export type DetailPlannerOutput = z.infer<typeof DetailPlannerOutputSchema>;

const MultimodalPackInputSchema = z.object({
  letterText: z.string().describe('Texto base de la carta.'),
  tone: z.enum(['warm', 'romantic', 'playful', 'nostalgic']).describe('Tono deseado para el paquete multimodal.'),
  language: z.string().optional().describe('Idioma de salida.'),
});

const MultimodalPackOutputSchema = z.object({
  audioNarrationScript: z.string().describe('Guion narrado para audio corto.'),
  visualPostcardPrompt: z.string().describe('Prompt visual para generar una postal ilustrada.'),
  miniMemoryCard: z.string().describe('Texto breve para mini recuerdo compartible.'),
});

export type MultimodalPackInput = z.infer<typeof MultimodalPackInputSchema>;
export type MultimodalPackOutput = z.infer<typeof MultimodalPackOutputSchema>;

const CoWritingSeedInputSchema = z.object({
  topic: z.string().describe('Tema principal de la carta compartida.'),
  relationshipContext: z.string().optional().describe('Contexto de la pareja.'),
  language: z.string().optional().describe('Idioma de salida.'),
});

const CoWritingSeedOutputSchema = z.object({
  sharedTitle: z.string().describe('Titulo sugerido para la carta compartida.'),
  openingParagraph: z.string().describe('Parrafo inicial para comenzar la co-escritura.'),
  contributionPrompts: z.array(z.string()).min(3).max(5).describe('Preguntas o prompts para que ambos aporten.'),
});

export type CoWritingSeedInput = z.infer<typeof CoWritingSeedInputSchema>;
export type CoWritingSeedOutput = z.infer<typeof CoWritingSeedOutputSchema>;

const AnniversaryCapsuleInputSchema = z.object({
  relationshipYear: z.string().describe('Año o periodo a resumir, por ejemplo 2025.'),
  memories: z.array(MemoryItemSchema).max(80),
  language: z.string().optional().describe('Idioma de salida.'),
});

const AnniversaryCapsuleOutputSchema = z.object({
  capsuleTitle: z.string().describe('Titulo emocional de la cápsula anual.'),
  yearStory: z.string().describe('Resumen narrativo del año de la relación.'),
  topMoments: z.array(z.string()).min(3).max(6).describe('Momentos más significativos del periodo.'),
  gratitudeClosing: z.string().describe('Cierre de gratitud para compartir con la pareja.'),
});

export type AnniversaryCapsuleInput = z.infer<typeof AnniversaryCapsuleInputSchema>;
export type AnniversaryCapsuleOutput = z.infer<typeof AnniversaryCapsuleOutputSchema>;

const rewritePrompt = ai.definePrompt({
  name: 'rewriteLetterByIntentPrompt',
  input: {schema: RewriteLetterInputSchema},
  output: {schema: RewriteLetterOutputSchema},
  prompt: `Actua como coach emocional para parejas. Reescribe la carta manteniendo autenticidad y evitando manipulación.

Intencion: {{{intent}}}
Contexto de relacion: {{{relationshipContext}}}
Idioma de salida: {{{language}}}

Carta original:
"""
{{{originalLetter}}}
"""

Reglas:
- Mantener el mensaje central del usuario.
- Mejorar claridad y empatia.
- Evitar culpas, sarcasmo o amenazas.
- Entregar texto final natural (no robotico).

Devuelve JSON con: rewrittenLetter, emotionalShift, cautionNote.`,
});

const suggestReplyPrompt = ai.definePrompt({
  name: 'suggestReplyOptionsPrompt',
  input: {schema: SuggestReplyInputSchema},
  output: {schema: SuggestReplyOutputSchema},
  prompt: `Eres asistente experto en comunicacion de pareja. Genera 3 respuestas distintas al mensaje recibido.

Mensaje recibido:
"""
{{{receivedMessage}}}
"""

Tono preferido: {{{preferredTone}}}
Contexto de relacion: {{{relationshipContext}}}
Idioma: {{{language}}}

Reglas:
- Cada respuesta debe ser breve y enviable.
- Sin ataques pasivo-agresivos.
- Deben sonar humanas y afectivas.
- Etiquetas sugeridas ejemplo: "Suave", "Profunda", "Ligera".

Devuelve JSON con: replies (3 elementos con label/text), recommendation.`,
});

const checkinPrompt = ai.definePrompt({
  name: 'weeklyRelationshipCheckinPrompt',
  input: {schema: WeeklyCheckinInputSchema},
  output: {schema: WeeklyCheckinOutputSchema},
  prompt: `Eres terapeuta de comunicacion no clinica para parejas. Analiza este check-in semanal y propone pasos accionables.

- Como me siento: {{{myFeeling}}}
- Lo que necesito: {{{whatINeed}}}
- Lo que agradezco: {{{gratitude}}}
- Nivel de estres: {{{stressLevel}}}/10
- Nombre de mi pareja: {{{partnerName}}}
- Idioma: {{{language}}}

Objetivo:
1) connectionSummary: resumen breve y empatico.
2) suggestedActions: exactamente 3 acciones concretas para esta semana.
3) messageDraft: mensaje listo para enviar a la pareja, con tono claro y amoroso.

Evita consejos extremos o culpabilizantes.
Devuelve JSON con: connectionSummary, suggestedActions, messageDraft.`,
});

const toneRiskPrompt = ai.definePrompt({
  name: 'detectLetterToneRiskPrompt',
  input: {schema: DetectToneRiskInputSchema},
  output: {schema: DetectToneRiskOutputSchema},
  prompt: `Analiza una carta para detectar riesgo de sonar fria, ambigua o hiriente.

Idioma de salida: {{{language}}}

Carta:
"""
{{{letterContent}}}
"""

Reglas:
- Clasifica riesgo: low, medium o high.
- Identifica frases concretas de riesgo (si existen).
- Propone una alternativa segura y empatica lista para enviar.

Devuelve JSON con: riskLevel, summary, riskyPhrases, saferAlternative.`,
});

const emotionalTranslationPrompt = ai.definePrompt({
  name: 'translateEmotionalStylePrompt',
  input: {schema: TranslateEmotionalStyleInputSchema},
  output: {schema: TranslateEmotionalStyleOutputSchema},
  prompt: `Transforma el texto de estilo emocional sin cambiar su fondo ni intencion.

Estilo actual: {{{fromStyle}}}
Estilo objetivo: {{{toStyle}}}
Conservar significado: {{{preserveMeaning}}}
Idioma: {{{language}}}

Texto base:
"""
{{{text}}}
"""

Reglas:
- Mantener la idea central.
- Cambiar tono, no hechos.
- Evitar manipulación o culpa.

Devuelve JSON con: translatedText, changeNotes.`,
});

const timelineInsightPrompt = ai.definePrompt({
  name: 'analyzeRelationshipTimelinePrompt',
  input: {schema: TimelineInsightInputSchema},
  output: {schema: TimelineInsightOutputSchema},
  prompt: `Analiza recuerdos de pareja y genera una linea de tiempo emocional.

Idioma: {{{language}}}
Recuerdos:
{{#each memories}}
- Titulo: {{{title}}}
  Tipo: {{{type}}}
  Fecha: {{{memoryDate}}}
  Detalles: {{{details}}}
  Tags: {{#if tags}}{{#each tags}}{{{this}}} {{/each}}{{/if}}
{{/each}}

Objetivo:
- timelineSummary: historia emocional en pocas lineas.
- highlights: 3 a 6 hitos concretos.
- nextMeaningfulStep: una accion simple y valiosa.

Evita lenguaje generico. Usa detalles reales de los recuerdos.
Devuelve JSON con: timelineSummary, highlights, nextMeaningfulStep.`,
});

const memoryGraphPrompt = ai.definePrompt({
  name: 'buildMemoryGraphPrompt',
  input: {schema: MemoryGraphInputSchema},
  output: {schema: MemoryGraphOutputSchema},
  prompt: `Construye un grafo conceptual de recuerdos de pareja.

Idioma: {{{language}}}
Recuerdos:
{{#each memories}}
- Titulo: {{{title}}}
  Tipo: {{{type}}}
  Fecha: {{{memoryDate}}}
  Detalles: {{{details}}}
  Tags: {{#if tags}}{{#each tags}}{{{this}}} {{/each}}{{/if}}
{{/each}}

Crea de 2 a 5 temas. Para cada tema devuelve:
- theme
- connectedMemories (titulos de recuerdos conectados)
- emotionalMeaning (por que ese tema importa en el vinculo)

Devuelve JSON con: themes.`,
});

const contextualRescuePrompt = ai.definePrompt({
  name: 'contextualMemoryRescuePrompt',
  input: {schema: ContextualRescueInputSchema},
  output: {schema: ContextualRescueOutputSchema},
  prompt: `Tienes un borrador actual y recuerdos historicos de pareja. Crea una respuesta mas empatica conectando contexto real.

Idioma: {{{language}}}
Borrador actual:
"""
{{{currentDraft}}}
"""

Recuerdos:
{{#each memories}}
- Titulo: {{{title}}}
  Tipo: {{{type}}}
  Fecha: {{{memoryDate}}}
  Detalles: {{{details}}}
  Tags: {{#if tags}}{{#each tags}}{{{this}}} {{/each}}{{/if}}
{{/each}}

Objetivo:
- rescuedMessage: version mejorada del mensaje incorporando un recuerdo pertinente.
- memoryReferences: cuales recuerdos usaste.
- empathyTips: 2 a 4 tips concretos.

Evita inventar hechos fuera de recuerdos dados.
Devuelve JSON con: rescuedMessage, memoryReferences, empathyTips.`,
});

const conflictMediationPrompt = ai.definePrompt({
  name: 'conflictMediationPrompt',
  input: {schema: ConflictMediationInputSchema},
  output: {schema: ConflictMediationOutputSchema},
  prompt: `Actua como mediador de pareja con comunicacion no violenta.

Idioma: {{{language}}}
Tema del conflicto: {{{conflictTopic}}}
Mi perspectiva: {{{myPerspective}}}
Perspectiva de mi pareja (estimada): {{{partnerPerspective}}}
Resultado deseado: {{{desiredOutcome}}}

Objetivo:
- neutralSummary: resumen sin culpas ni etiquetas.
- turnByTurnGuide: 4 a 6 pasos de conversacion por turnos.
- healthyBoundaries: 2 a 4 limites para cuidar el dialogo.
- agreementDraft: borrador de acuerdo concreto.

Evita consejos extremos. Prioriza claridad y calma.
Devuelve JSON con: neutralSummary, turnByTurnGuide, healthyBoundaries, agreementDraft.`,
});

const detailPlannerPrompt = ai.definePrompt({
  name: 'relationshipDetailPlannerPrompt',
  input: {schema: DetailPlannerInputSchema},
  output: {schema: DetailPlannerOutputSchema},
  prompt: `Eres un planificador de detalles realistas para parejas.

Idioma: {{{language}}}
Tiempo disponible: {{{availableTime}}}
Presupuesto: {{{budgetLevel}}}
Preferencias de mi pareja: {{{partnerPreferences}}}
Ciudad/contexto: {{{cityOrContext}}}

Genera entre 3 y 5 micro-acciones romanticas y posibles.
Para cada accion incluye:
- title
- whyItWorks
- estimatedCost
- estimatedTime
- firstStep

Ademas devuelve weeklyPlan con 3 a 5 pasos para ejecutar durante la semana.
Evita ideas costosas si presupuesto es low.
Devuelve JSON con: microActions, weeklyPlan.`,
});

const multimodalPackPrompt = ai.definePrompt({
  name: 'multimodalLetterPackPrompt',
  input: {schema: MultimodalPackInputSchema},
  output: {schema: MultimodalPackOutputSchema},
  prompt: `Convierte una carta en una experiencia multimodal.

Idioma: {{{language}}}
Tono: {{{tone}}}

Carta base:
"""
{{{letterText}}}
"""

Devuelve:
- audioNarrationScript: guion de 30-60 segundos.
- visualPostcardPrompt: prompt descriptivo para generar una postal artística.
- miniMemoryCard: microtexto emotivo de 1-2 lineas.

Devuelve JSON con: audioNarrationScript, visualPostcardPrompt, miniMemoryCard.`,
});

const coWritingSeedPrompt = ai.definePrompt({
  name: 'coWritingSeedPrompt',
  input: {schema: CoWritingSeedInputSchema},
  output: {schema: CoWritingSeedOutputSchema},
  prompt: `Genera inicio para una carta co-escrita por dos personas.

Idioma: {{{language}}}
Tema: {{{topic}}}
Contexto: {{{relationshipContext}}}

Devuelve:
- sharedTitle
- openingParagraph
- contributionPrompts (3 a 5 preguntas para que ambos aporten)

Devuelve JSON con: sharedTitle, openingParagraph, contributionPrompts.`,
});

const anniversaryCapsulePrompt = ai.definePrompt({
  name: 'anniversaryCapsulePrompt',
  input: {schema: AnniversaryCapsuleInputSchema},
  output: {schema: AnniversaryCapsuleOutputSchema},
  prompt: `Crea una cápsula anual romántica basada en recuerdos reales.

Idioma: {{{language}}}
Periodo: {{{relationshipYear}}}

Recuerdos:
{{#each memories}}
- Titulo: {{{title}}}
  Tipo: {{{type}}}
  Fecha: {{{memoryDate}}}
  Detalles: {{{details}}}
{{/each}}

Devuelve:
- capsuleTitle
- yearStory
- topMoments (3 a 6)
- gratitudeClosing

Devuelve JSON con: capsuleTitle, yearStory, topMoments, gratitudeClosing.`,
});

const rewriteFlow = ai.defineFlow(
  {
    name: 'rewriteLetterByIntentFlow',
    inputSchema: RewriteLetterInputSchema,
    outputSchema: RewriteLetterOutputSchema,
  },
  async (input) => {
    const {output} = await rewritePrompt(input);
    return output!;
  }
);

const suggestReplyFlow = ai.defineFlow(
  {
    name: 'suggestReplyOptionsFlow',
    inputSchema: SuggestReplyInputSchema,
    outputSchema: SuggestReplyOutputSchema,
  },
  async (input) => {
    const {output} = await suggestReplyPrompt(input);
    return output!;
  }
);

const checkinFlow = ai.defineFlow(
  {
    name: 'weeklyRelationshipCheckinFlow',
    inputSchema: WeeklyCheckinInputSchema,
    outputSchema: WeeklyCheckinOutputSchema,
  },
  async (input) => {
    const {output} = await checkinPrompt(input);
    return output!;
  }
);

const toneRiskFlow = ai.defineFlow(
  {
    name: 'detectLetterToneRiskFlow',
    inputSchema: DetectToneRiskInputSchema,
    outputSchema: DetectToneRiskOutputSchema,
  },
  async (input) => {
    const {output} = await toneRiskPrompt(input);
    return output!;
  }
);

const emotionalTranslationFlow = ai.defineFlow(
  {
    name: 'translateEmotionalStyleFlow',
    inputSchema: TranslateEmotionalStyleInputSchema,
    outputSchema: TranslateEmotionalStyleOutputSchema,
  },
  async (input) => {
    const {output} = await emotionalTranslationPrompt(input);
    return output!;
  }
);

const timelineInsightFlow = ai.defineFlow(
  {
    name: 'analyzeRelationshipTimelineFlow',
    inputSchema: TimelineInsightInputSchema,
    outputSchema: TimelineInsightOutputSchema,
  },
  async (input) => {
    const {output} = await timelineInsightPrompt(input);
    return output!;
  }
);

const memoryGraphFlow = ai.defineFlow(
  {
    name: 'buildMemoryGraphFlow',
    inputSchema: MemoryGraphInputSchema,
    outputSchema: MemoryGraphOutputSchema,
  },
  async (input) => {
    const {output} = await memoryGraphPrompt(input);
    return output!;
  }
);

const contextualRescueFlow = ai.defineFlow(
  {
    name: 'contextualMemoryRescueFlow',
    inputSchema: ContextualRescueInputSchema,
    outputSchema: ContextualRescueOutputSchema,
  },
  async (input) => {
    const {output} = await contextualRescuePrompt(input);
    return output!;
  }
);

const conflictMediationFlow = ai.defineFlow(
  {
    name: 'conflictMediationFlow',
    inputSchema: ConflictMediationInputSchema,
    outputSchema: ConflictMediationOutputSchema,
  },
  async (input) => {
    const {output} = await conflictMediationPrompt(input);
    return output!;
  }
);

const detailPlannerFlow = ai.defineFlow(
  {
    name: 'relationshipDetailPlannerFlow',
    inputSchema: DetailPlannerInputSchema,
    outputSchema: DetailPlannerOutputSchema,
  },
  async (input) => {
    const {output} = await detailPlannerPrompt(input);
    return output!;
  }
);

const multimodalPackFlow = ai.defineFlow(
  {
    name: 'multimodalLetterPackFlow',
    inputSchema: MultimodalPackInputSchema,
    outputSchema: MultimodalPackOutputSchema,
  },
  async (input) => {
    const {output} = await multimodalPackPrompt(input);
    return output!;
  }
);

const coWritingSeedFlow = ai.defineFlow(
  {
    name: 'coWritingSeedFlow',
    inputSchema: CoWritingSeedInputSchema,
    outputSchema: CoWritingSeedOutputSchema,
  },
  async (input) => {
    const {output} = await coWritingSeedPrompt(input);
    return output!;
  }
);

const anniversaryCapsuleFlow = ai.defineFlow(
  {
    name: 'anniversaryCapsuleFlow',
    inputSchema: AnniversaryCapsuleInputSchema,
    outputSchema: AnniversaryCapsuleOutputSchema,
  },
  async (input) => {
    const {output} = await anniversaryCapsulePrompt(input);
    return output!;
  }
);

export async function rewriteLetterByIntent(input: RewriteLetterInput): Promise<RewriteLetterOutput> {
  return rewriteFlow(input);
}

export async function suggestReplyOptions(input: SuggestReplyInput): Promise<SuggestReplyOutput> {
  return suggestReplyFlow(input);
}

export async function weeklyRelationshipCheckin(input: WeeklyCheckinInput): Promise<WeeklyCheckinOutput> {
  return checkinFlow(input);
}

export async function detectLetterToneRisk(input: DetectToneRiskInput): Promise<DetectToneRiskOutput> {
  return toneRiskFlow(input);
}

export async function translateEmotionalStyle(input: TranslateEmotionalStyleInput): Promise<TranslateEmotionalStyleOutput> {
  return emotionalTranslationFlow(input);
}

export async function analyzeRelationshipTimeline(input: TimelineInsightInput): Promise<TimelineInsightOutput> {
  return timelineInsightFlow(input);
}

export async function buildMemoryGraph(input: MemoryGraphInput): Promise<MemoryGraphOutput> {
  return memoryGraphFlow(input);
}

export async function contextualMemoryRescue(input: ContextualRescueInput): Promise<ContextualRescueOutput> {
  return contextualRescueFlow(input);
}

export async function conflictMediation(input: ConflictMediationInput): Promise<ConflictMediationOutput> {
  return conflictMediationFlow(input);
}

export async function relationshipDetailPlanner(input: DetailPlannerInput): Promise<DetailPlannerOutput> {
  return detailPlannerFlow(input);
}

export async function multimodalLetterPack(input: MultimodalPackInput): Promise<MultimodalPackOutput> {
  return multimodalPackFlow(input);
}

export async function coWritingSeed(input: CoWritingSeedInput): Promise<CoWritingSeedOutput> {
  return coWritingSeedFlow(input);
}

export async function anniversaryCapsule(input: AnniversaryCapsuleInput): Promise<AnniversaryCapsuleOutput> {
  return anniversaryCapsuleFlow(input);
}
