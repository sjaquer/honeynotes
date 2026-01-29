'use client';

import { ListTodo, Plus, CheckCircle2, Circle, Star, Calendar, Clock } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { BeeIcon } from '@/components/icons/BeeIcon';
import { cn } from '@/lib/utils';

const sampleTasks = [
  { id: 1, text: 'Escribir carta de aniversario', done: false, priority: 'high' },
  { id: 2, text: 'Preparar sorpresa de cumpleaños', done: false, priority: 'medium' },
  { id: 3, text: 'Enviar carta de agradecimiento', done: true, priority: 'low' },
];

export default function TasksPage() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-1 flex-col bg-[#F0F4F8]">
      {/* Header */}
      <header className="sticky top-0 z-10 flex flex-col gap-2 bg-[#F0F4F8]/95 p-6 backdrop-blur-sm lg:p-8">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-4xl font-bold text-primary drop-shadow-sm">{t('tasksPage.title')}</h1>
          <button className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-white shadow-lg transition-all hover:scale-105 active:scale-95">
            <Plus className="size-5" />
            <span className="font-display text-sm font-bold">Nueva</span>
          </button>
        </div>
        <p className="font-handwriting text-xl text-gray-600">
          Recordatorios románticos
        </p>
      </header>

      {/* Content */}
      <div className="flex-1 p-4 lg:p-8">
        {/* Quick Stats */}
        <div className="mb-6 flex gap-3">
          <div className="flex flex-1 items-center gap-3 rounded-2xl bg-white/80 p-4 shadow-sm">
            <div className="rounded-xl bg-green-100 p-2">
              <CheckCircle2 className="size-5 text-green-600" />
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-gray-800">1</p>
              <p className="font-handwriting text-sm text-gray-500">Completadas</p>
            </div>
          </div>
          <div className="flex flex-1 items-center gap-3 rounded-2xl bg-white/80 p-4 shadow-sm">
            <div className="rounded-xl bg-orange-100 p-2">
              <Clock className="size-5 text-orange-600" />
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-gray-800">2</p>
              <p className="font-handwriting text-sm text-gray-500">Pendientes</p>
            </div>
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-3">
          {sampleTasks.map((task) => (
            <div
              key={task.id}
              className={cn(
                'group flex items-center gap-4 rounded-2xl border-2 border-dashed bg-white/80 p-4 transition-all hover:shadow-md',
                task.done ? 'border-gray-200 opacity-60' : 'border-gray-200 hover:border-primary/30'
              )}
            >
              <button className="transition-transform hover:scale-110">
                {task.done ? (
                  <CheckCircle2 className="size-6 text-green-500" />
                ) : (
                  <Circle className="size-6 text-gray-300 hover:text-primary" />
                )}
              </button>
              <span className={cn(
                'flex-1 font-handwriting text-lg',
                task.done ? 'text-gray-400 line-through' : 'text-gray-700'
              )}>
                {task.text}
              </span>
              {task.priority === 'high' && !task.done && (
                <Star className="size-5 fill-amber-400 text-amber-400" />
              )}
            </div>
          ))}
        </div>

        {/* Coming Soon Notice */}
        <div className="mt-8 rounded-2xl bg-white/50 p-6 text-center">
          <Calendar className="mx-auto size-12 text-primary/30" />
          <p className="mt-4 font-handwriting text-xl text-gray-500">
            {t('tasksPage.comingSoon')}
          </p>
          <p className="mt-2 font-display text-sm text-gray-400">
            {t('tasksPage.description')}
          </p>
        </div>
      </div>
    </div>
  );
}
