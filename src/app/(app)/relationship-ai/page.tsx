'use client';

import {useCallback, useEffect, useMemo, useState} from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  BrainCircuit,
  CalendarHeart,
  CheckCircle2,
  Clock3,
  GitBranch,
  Handshake,
  HeartHandshake,
  Loader2,
  MessageCircleHeart,
  Plus,
  Sparkles,
  Wallet,
} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Textarea} from '@/components/ui/textarea';
import {Input} from '@/components/ui/input';
import {useFirebase, useUser} from '@/firebase';
import {addDoc, collection, getDocs, limit, orderBy, query, serverTimestamp} from 'firebase/firestore';
import {
  anniversaryCapsule,
  analyzeRelationshipTimeline,
  buildMemoryGraph,
  coWritingSeed,
  conflictMediation,
  contextualMemoryRescue,
  multimodalLetterPack,
  relationshipDetailPlanner,
  weeklyRelationshipCheckin,
  type AnniversaryCapsuleOutput,
  type CoWritingSeedOutput,
  type ConflictMediationOutput,
  type ContextualRescueOutput,
  type DetailPlannerOutput,
  type MemoryGraphOutput,
  type MultimodalPackOutput,
  type TimelineInsightOutput,
  type WeeklyCheckinOutput,
} from '@/ai/flows/relationship-ai-assistant';
import {useToast} from '@/hooks/use-toast';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';

type MemoryType = 'milestone' | 'favorite-letter' | 'promise' | 'trip' | 'music' | 'goal' | 'other';

type RelationshipMemory = {
  id: string;
  title: string;
  details: string;
  memoryDate: string;
  type: MemoryType;
  tags: string[];
};

const memoryTypeLabels: Record<MemoryType, string> = {
  milestone: 'Hito',
  'favorite-letter': 'Carta favorita',
  promise: 'Promesa',
  trip: 'Viaje',
  music: 'Música',
  goal: 'Meta',
  other: 'Otro',
};

export default function RelationshipAIPage() {
  const {toast} = useToast();
  const {firestore} = useFirebase();
  const {user} = useUser();

  const [myFeeling, setMyFeeling] = useState('');
  const [whatINeed, setWhatINeed] = useState('');
  const [gratitude, setGratitude] = useState('');
  const [partnerName, setPartnerName] = useState('');
  const [stressLevel, setStressLevel] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<WeeklyCheckinOutput | null>(null);

  const [memories, setMemories] = useState<RelationshipMemory[]>([]);
  const [isMemoriesLoading, setIsMemoriesLoading] = useState(false);

  const [memoryTitle, setMemoryTitle] = useState('');
  const [memoryDetails, setMemoryDetails] = useState('');
  const [memoryDate, setMemoryDate] = useState('');
  const [memoryTags, setMemoryTags] = useState('');
  const [memoryType, setMemoryType] = useState<MemoryType>('milestone');

  const [timelineResult, setTimelineResult] = useState<TimelineInsightOutput | null>(null);
  const [graphResult, setGraphResult] = useState<MemoryGraphOutput | null>(null);
  const [rescueDraft, setRescueDraft] = useState('');
  const [rescueResult, setRescueResult] = useState<ContextualRescueOutput | null>(null);

  const [isTimelineLoading, setIsTimelineLoading] = useState(false);
  const [isGraphLoading, setIsGraphLoading] = useState(false);
  const [isRescueLoading, setIsRescueLoading] = useState(false);

  const [conflictTopic, setConflictTopic] = useState('');
  const [myPerspective, setMyPerspective] = useState('');
  const [partnerPerspective, setPartnerPerspective] = useState('');
  const [desiredOutcome, setDesiredOutcome] = useState('');
  const [mediationResult, setMediationResult] = useState<ConflictMediationOutput | null>(null);
  const [isMediationLoading, setIsMediationLoading] = useState(false);

  const [availableTime, setAvailableTime] = useState('');
  const [budgetLevel, setBudgetLevel] = useState<'low' | 'medium' | 'high'>('low');
  const [partnerPreferences, setPartnerPreferences] = useState('');
  const [cityOrContext, setCityOrContext] = useState('');
  const [detailPlanResult, setDetailPlanResult] = useState<DetailPlannerOutput | null>(null);
  const [isDetailPlannerLoading, setIsDetailPlannerLoading] = useState(false);

  const [multimodalInput, setMultimodalInput] = useState('');
  const [multimodalTone, setMultimodalTone] = useState<'warm' | 'romantic' | 'playful' | 'nostalgic'>('romantic');
  const [multimodalResult, setMultimodalResult] = useState<MultimodalPackOutput | null>(null);
  const [isMultimodalLoading, setIsMultimodalLoading] = useState(false);

  const [coWriteTopic, setCoWriteTopic] = useState('');
  const [coWriteContext, setCoWriteContext] = useState('');
  const [partnerUid, setPartnerUid] = useState('');
  const [coWriteResult, setCoWriteResult] = useState<CoWritingSeedOutput | null>(null);
  const [isCoWriteLoading, setIsCoWriteLoading] = useState(false);

  const [anniversaryYear, setAnniversaryYear] = useState('');
  const [anniversaryResult, setAnniversaryResult] = useState<AnniversaryCapsuleOutput | null>(null);
  const [isAnniversaryLoading, setIsAnniversaryLoading] = useState(false);

  const memoriesRef = useMemo(() => {
    if (!user) return null;
    return collection(firestore, 'users', user.uid, 'relationshipMemories');
  }, [firestore, user]);

  const aiMemoryPayload = useMemo(
    () => memories.map((memory) => ({
      title: memory.title,
      details: memory.details,
      memoryDate: memory.memoryDate,
      type: memory.type,
      tags: memory.tags,
    })),
    [memories],
  );

  const loadMemories = useCallback(async () => {
    if (!memoriesRef) {
      setMemories([]);
      return;
    }

    setIsMemoriesLoading(true);
    try {
      const snapshot = await getDocs(query(memoriesRef, orderBy('memoryDate', 'desc'), limit(60)));
      const nextMemories: RelationshipMemory[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data() as Omit<RelationshipMemory, 'id'>;
        return {
          id: docSnap.id,
          title: data.title,
          details: data.details,
          memoryDate: data.memoryDate,
          type: data.type,
          tags: Array.isArray(data.tags) ? data.tags : [],
        };
      });
      setMemories(nextMemories);
    } catch (e) {
      console.error(e);
      toast({variant: 'destructive', title: 'No se pudieron cargar recuerdos'});
    } finally {
      setIsMemoriesLoading(false);
    }
  }, [memoriesRef, toast]);

  useEffect(() => {
    loadMemories();
  }, [loadMemories]);

  const handleGenerateCheckin = async () => {
    if (!user) {
      toast({variant: 'destructive', title: 'Inicia sesion para continuar'});
      return;
    }

    if (!myFeeling.trim() || !whatINeed.trim() || !gratitude.trim()) {
      toast({variant: 'destructive', title: 'Completa los campos principales'});
      return;
    }

    setIsLoading(true);
    try {
      const aiResult = await weeklyRelationshipCheckin({
        myFeeling,
        whatINeed,
        gratitude,
        stressLevel,
        partnerName,
        language: 'es',
      });

      setResult(aiResult);

      await addDoc(collection(firestore, 'relationshipCheckins'), {
        userId: user.uid,
        myFeeling,
        whatINeed,
        gratitude,
        stressLevel,
        partnerName: partnerName || null,
        aiResult,
        createdAt: serverTimestamp(),
      });

      toast({
        title: 'Check-in guardado',
        description: 'Tu resumen semanal y acciones quedaron guardados.',
      });
    } catch (e) {
      console.error(e);
      toast({variant: 'destructive', title: 'No se pudo generar el check-in'});
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveMemory = async () => {
    if (!user || !memoriesRef) {
      toast({variant: 'destructive', title: 'Inicia sesión para guardar recuerdos'});
      return;
    }

    if (!memoryTitle.trim() || !memoryDetails.trim() || !memoryDate) {
      toast({variant: 'destructive', title: 'Completa titulo, detalle y fecha'});
      return;
    }

    try {
      const tags = memoryTags
        .split(',')
        .map((tag) => tag.trim().toLowerCase())
        .filter(Boolean)
        .slice(0, 8);

      await addDoc(memoriesRef, {
        userId: user.uid,
        title: memoryTitle.trim(),
        details: memoryDetails.trim(),
        memoryDate,
        type: memoryType,
        tags,
        createdAt: serverTimestamp(),
      });

      setMemoryTitle('');
      setMemoryDetails('');
      setMemoryDate('');
      setMemoryTags('');
      setMemoryType('milestone');
      toast({title: 'Recuerdo guardado'});
      await loadMemories();
    } catch (e) {
      console.error(e);
      toast({variant: 'destructive', title: 'No se pudo guardar el recuerdo'});
    }
  };

  const handleGenerateTimeline = async () => {
    if (!aiMemoryPayload.length) {
      toast({variant: 'destructive', title: 'Agrega recuerdos para generar timeline'});
      return;
    }

    setIsTimelineLoading(true);
    try {
      const output = await analyzeRelationshipTimeline({
        memories: aiMemoryPayload,
        language: 'es',
      });
      setTimelineResult(output);
    } catch (e) {
      console.error(e);
      toast({variant: 'destructive', title: 'No se pudo generar el timeline'});
    } finally {
      setIsTimelineLoading(false);
    }
  };

  const handleBuildGraph = async () => {
    if (!aiMemoryPayload.length) {
      toast({variant: 'destructive', title: 'Agrega recuerdos para construir el grafo'});
      return;
    }

    setIsGraphLoading(true);
    try {
      const output = await buildMemoryGraph({
        memories: aiMemoryPayload,
        language: 'es',
      });
      setGraphResult(output);
    } catch (e) {
      console.error(e);
      toast({variant: 'destructive', title: 'No se pudo construir el grafo'});
    } finally {
      setIsGraphLoading(false);
    }
  };

  const handleContextRescue = async () => {
    if (!rescueDraft.trim()) {
      toast({variant: 'destructive', title: 'Escribe un borrador para rescatar contexto'});
      return;
    }

    if (!aiMemoryPayload.length) {
      toast({variant: 'destructive', title: 'Primero guarda recuerdos en Memoria'});
      return;
    }

    setIsRescueLoading(true);
    try {
      const output = await contextualMemoryRescue({
        currentDraft: rescueDraft,
        memories: aiMemoryPayload,
        language: 'es',
      });
      setRescueResult(output);
    } catch (e) {
      console.error(e);
      toast({variant: 'destructive', title: 'No se pudo generar rescate contextual'});
    } finally {
      setIsRescueLoading(false);
    }
  };

  const handleConflictMediation = async () => {
    if (!conflictTopic.trim() || !myPerspective.trim() || !desiredOutcome.trim()) {
      toast({variant: 'destructive', title: 'Completa tema, tu perspectiva y resultado deseado'});
      return;
    }

    setIsMediationLoading(true);
    try {
      const output = await conflictMediation({
        conflictTopic,
        myPerspective,
        partnerPerspective,
        desiredOutcome,
        language: 'es',
      });
      setMediationResult(output);

      if (user) {
        await addDoc(collection(firestore, 'users', user.uid, 'relationshipCopilotSessions'), {
          type: 'mediation',
          input: {conflictTopic, myPerspective, partnerPerspective, desiredOutcome},
          output,
          createdAt: serverTimestamp(),
        });
      }
    } catch (e) {
      console.error(e);
      toast({variant: 'destructive', title: 'No se pudo generar la mediación'});
    } finally {
      setIsMediationLoading(false);
    }
  };

  const handleDetailPlanner = async () => {
    if (!availableTime.trim() || !partnerPreferences.trim()) {
      toast({variant: 'destructive', title: 'Completa tiempo disponible y preferencias'});
      return;
    }

    setIsDetailPlannerLoading(true);
    try {
      const output = await relationshipDetailPlanner({
        availableTime,
        budgetLevel,
        partnerPreferences,
        cityOrContext,
        language: 'es',
      });
      setDetailPlanResult(output);

      if (user) {
        await addDoc(collection(firestore, 'users', user.uid, 'relationshipCopilotSessions'), {
          type: 'detail-planner',
          input: {availableTime, budgetLevel, partnerPreferences, cityOrContext},
          output,
          createdAt: serverTimestamp(),
        });
      }
    } catch (e) {
      console.error(e);
      toast({variant: 'destructive', title: 'No se pudo generar el plan de detalles'});
    } finally {
      setIsDetailPlannerLoading(false);
    }
  };

  const handleMultimodalPack = async () => {
    if (!multimodalInput.trim()) {
      toast({variant: 'destructive', title: 'Escribe una carta para crear experiencia multimodal'});
      return;
    }

    setIsMultimodalLoading(true);
    try {
      const output = await multimodalLetterPack({
        letterText: multimodalInput,
        tone: multimodalTone,
        language: 'es',
      });
      setMultimodalResult(output);
    } catch (e) {
      console.error(e);
      toast({variant: 'destructive', title: 'No se pudo generar experiencia multimodal'});
    } finally {
      setIsMultimodalLoading(false);
    }
  };

  const handleCoWritingSeed = async () => {
    if (!coWriteTopic.trim()) {
      toast({variant: 'destructive', title: 'Ingresa un tema para co-escritura'});
      return;
    }

    setIsCoWriteLoading(true);
    try {
      const output = await coWritingSeed({
        topic: coWriteTopic,
        relationshipContext: coWriteContext,
        language: 'es',
      });
      setCoWriteResult(output);

      if (user && partnerUid.trim()) {
        await addDoc(collection(firestore, 'sharedLetters'), {
          participants: [user.uid, partnerUid.trim()],
          createdBy: user.uid,
          title: output.sharedTitle,
          seedContent: output.openingParagraph,
          contributionPrompts: output.contributionPrompts,
          status: 'active',
          createdAt: serverTimestamp(),
        });
      }
    } catch (e) {
      console.error(e);
      toast({variant: 'destructive', title: 'No se pudo generar inicio co-escrito'});
    } finally {
      setIsCoWriteLoading(false);
    }
  };

  const handleAnniversaryCapsule = async () => {
    if (!anniversaryYear.trim()) {
      toast({variant: 'destructive', title: 'Ingresa el año o periodo de la cápsula'});
      return;
    }

    if (!aiMemoryPayload.length) {
      toast({variant: 'destructive', title: 'Necesitas recuerdos guardados para la cápsula anual'});
      return;
    }

    setIsAnniversaryLoading(true);
    try {
      const output = await anniversaryCapsule({
        relationshipYear: anniversaryYear,
        memories: aiMemoryPayload,
        language: 'es',
      });
      setAnniversaryResult(output);

      if (user) {
        await addDoc(collection(firestore, 'users', user.uid, 'anniversaryCapsules'), {
          relationshipYear: anniversaryYear,
          output,
          createdAt: serverTimestamp(),
        });
      }
    } catch (e) {
      console.error(e);
      toast({variant: 'destructive', title: 'No se pudo generar la cápsula anual'});
    } finally {
      setIsAnniversaryLoading(false);
    }
  };

  return (
    <div className="paper-app-bg paper-noise flex flex-1 flex-col">
      <header className="sticky top-0 z-10 bg-[#FFF8F0]/90 p-4 backdrop-blur-sm lg:p-6">
        <div className="flex items-center justify-between gap-2">
          <Link href="/settings" className="glass-paper inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-gray-700">
            <ArrowLeft className="size-4" /> Volver
          </Link>
          <h1 className="flex items-center gap-2 text-base font-bold text-primary sm:text-2xl">
            <BrainCircuit className="size-5 sm:size-6" /> Coach IA de Pareja
          </h1>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-3 pb-32 sm:p-4 lg:p-6">
        <Tabs defaultValue="memory" className="space-y-3">
          <TabsList className="glass-paper grid h-12 w-full grid-cols-4 rounded-2xl border border-white/70 bg-white/80 p-1">
            <TabsTrigger value="memory" className="rounded-xl text-xs sm:text-sm">Memoria</TabsTrigger>
            <TabsTrigger value="checkin" className="rounded-xl text-xs sm:text-sm">Check-in</TabsTrigger>
            <TabsTrigger value="rescue" className="rounded-xl text-xs sm:text-sm">Rescate</TabsTrigger>
            <TabsTrigger value="copilot" className="rounded-xl text-xs sm:text-sm">Copiloto</TabsTrigger>
          </TabsList>

          <TabsContent value="memory" className="space-y-3">
            <div className="glass-paper rounded-2xl border border-white/70 p-4 sm:p-5">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-primary">
                <CalendarHeart className="size-5" /> Línea de tiempo inteligente
              </h2>
              <p className="mt-1 text-sm text-gray-600">Guarda recuerdos, hitos y promesas. La IA los convierte en historia emocional y conexiones.</p>

              <div className="mt-4 grid gap-3">
                <Input value={memoryTitle} onChange={(e) => setMemoryTitle(e.target.value)} placeholder="Título del recuerdo" />
                <Textarea value={memoryDetails} onChange={(e) => setMemoryDetails(e.target.value)} placeholder="Qué pasó y por qué fue importante" className="min-h-20" />
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <Input type="date" value={memoryDate} onChange={(e) => setMemoryDate(e.target.value)} />
                  <select
                    value={memoryType}
                    onChange={(e) => setMemoryType(e.target.value as MemoryType)}
                    className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                  >
                    {Object.entries(memoryTypeLabels).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
                <Input value={memoryTags} onChange={(e) => setMemoryTags(e.target.value)} placeholder="Tags separados por coma: viaje, playa, promesa" />
                <Button onClick={handleSaveMemory} className="w-full sm:w-auto">
                  <Plus className="mr-2 size-4" /> Guardar recuerdo
                </Button>
              </div>
            </div>

            <div className="grid gap-3 lg:grid-cols-2">
              <div className="glass-paper rounded-2xl border border-white/70 p-4 sm:p-5">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-primary/80">Timeline IA</h3>
                  <Button onClick={handleGenerateTimeline} disabled={isTimelineLoading || !memories.length} size="sm">
                    {isTimelineLoading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
                  </Button>
                </div>

                {timelineResult ? (
                  <div className="mt-3 space-y-3">
                    <p className="text-sm text-gray-700">{timelineResult.timelineSummary}</p>
                    <ul className="space-y-1">
                      {timelineResult.highlights.map((highlight, index) => (
                        <li key={`${highlight}-${index}`} className="text-sm text-gray-700">- {highlight}</li>
                      ))}
                    </ul>
                    <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-sm text-primary">
                      {timelineResult.nextMeaningfulStep}
                    </div>
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-gray-500">Genera insights cuando tengas recuerdos guardados.</p>
                )}
              </div>

              <div className="glass-paper rounded-2xl border border-white/70 p-4 sm:p-5">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-primary/80">
                    <GitBranch className="size-4" /> Grafo de recuerdos
                  </h3>
                  <Button onClick={handleBuildGraph} disabled={isGraphLoading || !memories.length} size="sm" variant="secondary">
                    {isGraphLoading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
                  </Button>
                </div>

                {graphResult ? (
                  <div className="mt-3 space-y-2">
                    {graphResult.themes.map((theme, index) => (
                      <div key={`${theme.theme}-${index}`} className="rounded-xl border border-amber-200 bg-amber-50/70 p-3">
                        <p className="text-sm font-semibold text-amber-800">{theme.theme}</p>
                        <p className="mt-1 text-xs text-gray-600">{theme.connectedMemories.join(' • ')}</p>
                        <p className="mt-2 text-sm text-gray-700">{theme.emotionalMeaning}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-gray-500">La IA agrupará temas recurrentes de su historia.</p>
                )}
              </div>
            </div>

            <div className="glass-paper rounded-2xl border border-white/70 p-4 sm:p-5">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-primary/80">Tus recuerdos</h3>
              {isMemoriesLoading ? (
                <p className="mt-2 text-sm text-gray-500">Cargando recuerdos...</p>
              ) : memories.length ? (
                <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                  {memories.map((memory) => (
                    <div key={memory.id} className="rounded-xl border border-gray-100 bg-white/70 p-3">
                      <div className="flex items-center justify-between gap-2">
                        <p className="line-clamp-1 text-sm font-semibold text-gray-800">{memory.title}</p>
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-primary">
                          {memoryTypeLabels[memory.type]}
                        </span>
                      </div>
                      <p className="mt-1 line-clamp-2 text-xs text-gray-600">{memory.details}</p>
                      <p className="mt-2 text-[11px] text-gray-400">{memory.memoryDate}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-sm text-gray-500">Aún no hay recuerdos guardados.</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="checkin" className="space-y-3">
            <div className="glass-paper rounded-2xl border border-white/70 p-4 sm:p-6">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-primary">
                <HeartHandshake className="size-5" /> Ritual semanal guiado
              </h2>
              <p className="mt-1 text-sm text-gray-600">Check-in emocional con resumen privado y acciones claras.</p>

              <div className="mt-4 grid gap-3">
                <Textarea value={myFeeling} onChange={(e) => setMyFeeling(e.target.value)} className="min-h-20" placeholder="¿Cómo te sientes hoy en la relación?" />
                <Textarea value={whatINeed} onChange={(e) => setWhatINeed(e.target.value)} className="min-h-20" placeholder="¿Qué necesitas esta semana de tu pareja?" />
                <Textarea value={gratitude} onChange={(e) => setGratitude(e.target.value)} className="min-h-20" placeholder="¿Qué agradeces de tu pareja esta semana?" />
                <Input value={partnerName} onChange={(e) => setPartnerName(e.target.value)} placeholder="Nombre de tu pareja (opcional)" />
                <div className="rounded-xl border border-primary/10 bg-primary/5 p-3">
                  <div className="mb-2 flex items-center justify-between text-sm text-gray-600">
                    <span>Nivel de estrés</span>
                    <span className="font-semibold text-primary">{stressLevel}/10</span>
                  </div>
                  <input type="range" min={1} max={10} value={stressLevel} onChange={(e) => setStressLevel(Number(e.target.value))} className="w-full" />
                </div>
              </div>

              <Button onClick={handleGenerateCheckin} disabled={isLoading} className="mt-4 w-full">
                {isLoading ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Sparkles className="mr-2 size-4" />}
                Generar plan semanal con IA
              </Button>
            </div>

            {result && (
              <div className="glass-paper space-y-3 rounded-2xl border border-white/70 p-4 sm:p-6">
                <div className="rounded-xl border border-primary/15 bg-white/70 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary/70">Resumen de conexión</p>
                  <p className="mt-1 text-sm text-gray-700">{result.connectionSummary}</p>
                </div>
                <div className="rounded-xl border border-primary/15 bg-white/70 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary/70">Acciones recomendadas</p>
                  <ul className="mt-2 space-y-2">
                    {result.suggestedActions.map((action, index) => (
                      <li key={`${action}-${index}`} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-xl border border-primary/15 bg-white/70 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary/70">Mensaje sugerido</p>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-gray-700">{result.messageDraft}</p>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="rescue" className="space-y-3">
            <div className="glass-paper rounded-2xl border border-white/70 p-4 sm:p-6">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-primary">
                <MessageCircleHeart className="size-5" /> Rescate contextual
              </h2>
              <p className="mt-1 text-sm text-gray-600">La IA conecta tu borrador con recuerdos históricos para responder con más empatía.</p>

              <Textarea
                value={rescueDraft}
                onChange={(e) => setRescueDraft(e.target.value)}
                className="mt-4 min-h-28"
                placeholder="Escribe tu borrador actual para enriquecerlo con contexto emocional"
              />

              <Button onClick={handleContextRescue} disabled={isRescueLoading} className="mt-4 w-full sm:w-auto">
                {isRescueLoading ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Sparkles className="mr-2 size-4" />}
                Generar rescate contextual
              </Button>
            </div>

            {rescueResult && (
              <div className="glass-paper space-y-3 rounded-2xl border border-white/70 p-4 sm:p-6">
                <div className="rounded-xl border border-primary/15 bg-white/70 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary/70">Mensaje rescatado</p>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-gray-700">{rescueResult.rescuedMessage}</p>
                </div>
                <div className="rounded-xl border border-primary/15 bg-white/70 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary/70">Recuerdos usados</p>
                  <ul className="mt-2 space-y-1">
                    {rescueResult.memoryReferences.map((reference, index) => (
                      <li key={`${reference}-${index}`} className="text-sm text-gray-700">- {reference}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-xl border border-primary/15 bg-white/70 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary/70">Tips de empatía</p>
                  <ul className="mt-2 space-y-1">
                    {rescueResult.empathyTips.map((tip, index) => (
                      <li key={`${tip}-${index}`} className="text-sm text-gray-700">- {tip}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="copilot" className="space-y-3">
            <div className="grid gap-3 lg:grid-cols-2">
              <div className="glass-paper rounded-2xl border border-white/70 p-4 sm:p-6">
                <h2 className="flex items-center gap-2 text-lg font-semibold text-primary">
                  <Handshake className="size-5" /> Mediación de conflicto
                </h2>
                <p className="mt-1 text-sm text-gray-600">Guía por turnos, límites sanos y acuerdo final para conversar sin culpas.</p>

                <div className="mt-4 grid gap-3">
                  <Input value={conflictTopic} onChange={(e) => setConflictTopic(e.target.value)} placeholder="Tema del conflicto" />
                  <Textarea value={myPerspective} onChange={(e) => setMyPerspective(e.target.value)} className="min-h-20" placeholder="Tu perspectiva" />
                  <Textarea value={partnerPerspective} onChange={(e) => setPartnerPerspective(e.target.value)} className="min-h-20" placeholder="Perspectiva de tu pareja (opcional)" />
                  <Textarea value={desiredOutcome} onChange={(e) => setDesiredOutcome(e.target.value)} className="min-h-16" placeholder="¿Qué resultado quieres lograr?" />
                  <Button onClick={handleConflictMediation} disabled={isMediationLoading} className="w-full">
                    {isMediationLoading ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Sparkles className="mr-2 size-4" />}
                    Generar mediación
                  </Button>
                </div>

                {mediationResult && (
                  <div className="mt-4 space-y-2 rounded-xl border border-primary/15 bg-white/70 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-primary/70">Resumen neutral</p>
                    <p className="text-sm text-gray-700">{mediationResult.neutralSummary}</p>

                    <p className="pt-1 text-xs font-semibold uppercase tracking-wide text-primary/70">Guía por turnos</p>
                    <ul className="space-y-1">
                      {mediationResult.turnByTurnGuide.map((step, index) => (
                        <li key={`${step}-${index}`} className="text-sm text-gray-700">{index + 1}. {step}</li>
                      ))}
                    </ul>

                    <p className="pt-1 text-xs font-semibold uppercase tracking-wide text-primary/70">Límites saludables</p>
                    <ul className="space-y-1">
                      {mediationResult.healthyBoundaries.map((boundary, index) => (
                        <li key={`${boundary}-${index}`} className="text-sm text-gray-700">- {boundary}</li>
                      ))}
                    </ul>

                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-2">
                      <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Acuerdo sugerido</p>
                      <p className="mt-1 text-sm text-gray-700">{mediationResult.agreementDraft}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="glass-paper rounded-2xl border border-white/70 p-4 sm:p-6">
                <h2 className="flex items-center gap-2 text-lg font-semibold text-primary">
                  <Wallet className="size-5" /> Planificador de detalles
                </h2>
                <p className="mt-1 text-sm text-gray-600">Micro-acciones semanales basadas en tiempo, presupuesto y gustos.</p>

                <div className="mt-4 grid gap-3">
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <Input value={availableTime} onChange={(e) => setAvailableTime(e.target.value)} placeholder="Tiempo disponible" />
                    <select
                      value={budgetLevel}
                      onChange={(e) => setBudgetLevel(e.target.value as 'low' | 'medium' | 'high')}
                      className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                    >
                      <option value="low">Presupuesto bajo</option>
                      <option value="medium">Presupuesto medio</option>
                      <option value="high">Presupuesto alto</option>
                    </select>
                  </div>
                  <Textarea value={partnerPreferences} onChange={(e) => setPartnerPreferences(e.target.value)} className="min-h-20" placeholder="Gustos de tu pareja" />
                  <Input value={cityOrContext} onChange={(e) => setCityOrContext(e.target.value)} placeholder="Ciudad o contexto (en casa, distancia, etc.)" />
                  <Button onClick={handleDetailPlanner} disabled={isDetailPlannerLoading} className="w-full" variant="secondary">
                    {isDetailPlannerLoading ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Clock3 className="mr-2 size-4" />}
                    Generar plan de detalles
                  </Button>
                </div>

                {detailPlanResult && (
                  <div className="mt-4 space-y-2 rounded-xl border border-primary/15 bg-white/70 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-primary/70">Micro-acciones</p>
                    <div className="space-y-2">
                      {detailPlanResult.microActions.map((action, index) => (
                        <div key={`${action.title}-${index}`} className="rounded-lg border border-amber-200 bg-amber-50/70 p-2">
                          <p className="text-sm font-semibold text-amber-800">{action.title}</p>
                          <p className="text-xs text-gray-700">{action.whyItWorks}</p>
                          <p className="mt-1 text-xs text-gray-500">Costo: {action.estimatedCost} | Tiempo: {action.estimatedTime}</p>
                          <p className="text-xs text-primary">Primer paso: {action.firstStep}</p>
                        </div>
                      ))}
                    </div>

                    <p className="pt-1 text-xs font-semibold uppercase tracking-wide text-primary/70">Plan semanal</p>
                    <ul className="space-y-1">
                      {detailPlanResult.weeklyPlan.map((step, index) => (
                        <li key={`${step}-${index}`} className="text-sm text-gray-700">{index + 1}. {step}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="grid gap-3 lg:grid-cols-3">
              <div className="glass-paper rounded-2xl border border-white/70 p-4 sm:p-5">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-primary/80">Experiencia multimodal</h3>
                <p className="mt-1 text-xs text-gray-600">Convierte carta en guion de audio, postal visual y mini recuerdo.</p>
                <div className="mt-3 space-y-2">
                  <Textarea value={multimodalInput} onChange={(e) => setMultimodalInput(e.target.value)} className="min-h-24" placeholder="Texto base de la carta" />
                  <select
                    value={multimodalTone}
                    onChange={(e) => setMultimodalTone(e.target.value as 'warm' | 'romantic' | 'playful' | 'nostalgic')}
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option value="romantic">Romántico</option>
                    <option value="warm">Cálido</option>
                    <option value="playful">Juguetón</option>
                    <option value="nostalgic">Nostálgico</option>
                  </select>
                  <Button onClick={handleMultimodalPack} disabled={isMultimodalLoading} className="w-full" size="sm">
                    {isMultimodalLoading ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Sparkles className="mr-2 size-4" />}
                    Generar pack
                  </Button>
                </div>
                {multimodalResult && (
                  <div className="mt-3 space-y-2 rounded-lg border border-primary/15 bg-white/70 p-2">
                    <p className="text-xs font-semibold text-primary/80">Guion de audio</p>
                    <p className="text-xs text-gray-700">{multimodalResult.audioNarrationScript}</p>
                    <p className="text-xs font-semibold text-primary/80">Prompt postal</p>
                    <p className="text-xs text-gray-700">{multimodalResult.visualPostcardPrompt}</p>
                    <p className="text-xs font-semibold text-primary/80">Mini recuerdo</p>
                    <p className="text-xs text-gray-700">{multimodalResult.miniMemoryCard}</p>
                  </div>
                )}
              </div>

              <div className="glass-paper rounded-2xl border border-white/70 p-4 sm:p-5">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-primary/80">Co-escritura</h3>
                <p className="mt-1 text-xs text-gray-600">Genera inicio compartido y, si agregas UID, crea sesión colaborativa.</p>
                <div className="mt-3 space-y-2">
                  <Input value={coWriteTopic} onChange={(e) => setCoWriteTopic(e.target.value)} placeholder="Tema de la carta compartida" />
                  <Textarea value={coWriteContext} onChange={(e) => setCoWriteContext(e.target.value)} className="min-h-16" placeholder="Contexto opcional" />
                  <Input value={partnerUid} onChange={(e) => setPartnerUid(e.target.value)} placeholder="UID de tu pareja (opcional para crear sesión)" />
                  <Button onClick={handleCoWritingSeed} disabled={isCoWriteLoading} className="w-full" size="sm" variant="secondary">
                    {isCoWriteLoading ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Sparkles className="mr-2 size-4" />}
                    Generar inicio co-escrito
                  </Button>
                </div>
                {coWriteResult && (
                  <div className="mt-3 space-y-2 rounded-lg border border-primary/15 bg-white/70 p-2">
                    <p className="text-xs font-semibold text-primary/80">{coWriteResult.sharedTitle}</p>
                    <p className="text-xs text-gray-700">{coWriteResult.openingParagraph}</p>
                    <ul className="space-y-1">
                      {coWriteResult.contributionPrompts.map((prompt, index) => (
                        <li key={`${prompt}-${index}`} className="text-xs text-gray-700">{index + 1}. {prompt}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="glass-paper rounded-2xl border border-white/70 p-4 sm:p-5">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-primary/80">Cápsula anual</h3>
                <p className="mt-1 text-xs text-gray-600">Resume el año de la relación con recuerdos reales.</p>
                <div className="mt-3 space-y-2">
                  <Input value={anniversaryYear} onChange={(e) => setAnniversaryYear(e.target.value)} placeholder="Año o periodo (ej: 2025)" />
                  <Button onClick={handleAnniversaryCapsule} disabled={isAnniversaryLoading} className="w-full" size="sm">
                    {isAnniversaryLoading ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Sparkles className="mr-2 size-4" />}
                    Generar cápsula
                  </Button>
                </div>
                {anniversaryResult && (
                  <div className="mt-3 space-y-2 rounded-lg border border-primary/15 bg-white/70 p-2">
                    <p className="text-xs font-semibold text-primary/80">{anniversaryResult.capsuleTitle}</p>
                    <p className="text-xs text-gray-700">{anniversaryResult.yearStory}</p>
                    <ul className="space-y-1">
                      {anniversaryResult.topMoments.map((moment, index) => (
                        <li key={`${moment}-${index}`} className="text-xs text-gray-700">- {moment}</li>
                      ))}
                    </ul>
                    <p className="text-xs text-primary">{anniversaryResult.gratitudeClosing}</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
