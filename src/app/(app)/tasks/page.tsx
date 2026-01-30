'use client';

import { ListTodo, Plus, CheckCircle2, Circle, Star, Calendar, Clock, Gift, Loader2, RefreshCw, Trophy } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
// BeeIcon is now an emoji component
import { cn } from '@/lib/utils';
import { useWeeklyTasks } from '@/hooks/use-weekly-tasks';
import { useEconomy } from '@/hooks/use-economy';
import { WEEKLY_TASKS } from '@/lib/shop-data';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

export default function TasksPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { economy } = useEconomy();
  const { 
    userTasks, 
    isLoading, 
    claimReward, 
    getTasksWithDefinitions, 
    getCompletionStats,
    getDaysUntilReset,
  } = useWeeklyTasks();

  const tasks = getTasksWithDefinitions();
  const stats = getCompletionStats();
  const daysUntilReset = getDaysUntilReset();

  const handleClaimReward = async (taskId: string) => {
    const success = await claimReward(taskId);
    if (success) {
      const task = WEEKLY_TASKS.find(t => t.id === taskId);
      toast({
        title: '¡Recompensa reclamada! 🎉',
        description: `Has ganado ${task?.reward.amount} ${task?.reward.currency === 'polen' ? '🌼 Polen' : '👑 Jalea Real'}`,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="size-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col bg-[#F0F4F8]">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[#F0F4F8]/95 p-4 backdrop-blur-sm lg:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary lg:text-3xl">📋 {t('tasksPage.title')}</h1>
            <p className="text-sm text-gray-500">Completa tareas para ganar recompensas</p>
          </div>
          
          {/* Currency Display */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1.5 shadow-sm">
              <span className="text-sm font-bold text-amber-700">{economy?.polen ?? 0}</span>
              <span className="text-base">🌼</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-purple-100 px-3 py-1.5 shadow-sm">
              <span className="text-sm font-bold text-purple-700">{economy?.jaleaReal ?? 0}</span>
              <span className="text-base">👑</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 space-y-4 overflow-y-auto p-4 pb-32 lg:p-6">
        {/* Weekly Progress Card */}
        <div className="rounded-2xl bg-gradient-to-r from-primary to-pink-500 p-4 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-white/20 p-2">
                <Trophy className="size-6" />
              </div>
              <div>
                <h3 className="font-bold">Progreso Semanal</h3>
                <p className="text-sm opacity-90">
                  {stats.completed} de {stats.total} tareas completadas
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-sm">
                <RefreshCw className="size-4" />
                <span>{daysUntilReset} días</span>
              </div>
              <p className="text-xs opacity-75">para reinicio</p>
            </div>
          </div>
          
          <div className="mt-3">
            <Progress 
              value={(stats.completed / stats.total) * 100} 
              className="h-2 bg-white/30"
            />
          </div>
          
          {(stats.unclaimed ?? 0) > 0 && (
            <div className="mt-3 flex items-center gap-2 rounded-lg bg-white/20 p-2">
              <Gift className="size-4" />
              <span className="text-sm font-medium">
                ¡Tienes {stats.unclaimed} recompensa{(stats.unclaimed ?? 0) > 1 ? 's' : ''} por reclamar!
              </span>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col items-center rounded-2xl bg-white p-4 shadow-sm">
            <div className="rounded-xl bg-green-100 p-2">
              <CheckCircle2 className="size-5 text-green-600" />
            </div>
            <p className="mt-2 text-2xl font-bold text-gray-800">{stats.completed}</p>
            <p className="text-xs text-gray-500">Completadas</p>
          </div>
          <div className="flex flex-col items-center rounded-2xl bg-white p-4 shadow-sm">
            <div className="rounded-xl bg-orange-100 p-2">
              <Clock className="size-5 text-orange-600" />
            </div>
            <p className="mt-2 text-2xl font-bold text-gray-800">{stats.total - stats.completed}</p>
            <p className="text-xs text-gray-500">Pendientes</p>
          </div>
          <div className="flex flex-col items-center rounded-2xl bg-white p-4 shadow-sm">
            <div className="rounded-xl bg-purple-100 p-2">
              <Gift className="size-5 text-purple-600" />
            </div>
            <p className="mt-2 text-2xl font-bold text-gray-800">{stats.claimed}</p>
            <p className="text-xs text-gray-500">Reclamadas</p>
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-700">Tareas de esta semana</h3>
          
          {tasks.map((task) => {
            const def = task.definition!;
            const progressPercent = Math.min((task.progress / def.target) * 100, 100);
            
            return (
              <div
                key={task.taskId}
                className={cn(
                  'rounded-2xl border-2 bg-white p-4 shadow-sm transition-all',
                  task.completed && !task.claimed && 'border-green-400 bg-green-50',
                  task.claimed && 'border-gray-200 opacity-60',
                  !task.completed && 'border-gray-100'
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="flex size-10 items-center justify-center text-2xl">
                    {def.icon}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className={cn(
                        'font-semibold',
                        task.claimed ? 'text-gray-400 line-through' : 'text-gray-800'
                      )}>
                        {def.title}
                      </h4>
                      {task.completed && (
                        <CheckCircle2 className="size-5 text-green-500" />
                      )}
                    </div>
                    
                    <p className="mt-0.5 text-sm text-gray-500">{def.description}</p>
                    
                    {/* Progress bar */}
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{task.progress} / {def.target}</span>
                        <span className="flex items-center gap-1">
                          +{def.reward.amount} {def.reward.currency === 'polen' ? '🌼' : '👑'}
                        </span>
                      </div>
                      <Progress 
                        value={progressPercent} 
                        className={cn(
                          "mt-1 h-2",
                          task.completed && "bg-green-200"
                        )} 
                      />
                    </div>
                    
                    {/* Claim button */}
                    {task.completed && !task.claimed && (
                      <Button
                        size="sm"
                        className="mt-3 w-full bg-green-500 hover:bg-green-600"
                        onClick={() => handleClaimReward(task.taskId)}
                      >
                        <Gift className="mr-2 size-4" />
                        Reclamar Recompensa
                      </Button>
                    )}
                    
                    {task.claimed && (
                      <div className="mt-3 text-center text-sm font-medium text-green-600">
                        ✓ Recompensa reclamada
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Info Note */}
        <div className="rounded-2xl bg-amber-50 p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🐝</span>
            <div>
              <h4 className="font-semibold text-amber-800">¿Cómo funcionan las tareas?</h4>
              <p className="mt-1 text-sm text-amber-700">
                Completa acciones como enviar cartas, leer mensajes de tu amor o usar diferentes 
                diseños para ganar Polen y Jalea Real. Las tareas se reinician cada lunes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
