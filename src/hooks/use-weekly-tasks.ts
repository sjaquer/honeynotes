'use client';

import { useState, useEffect, useCallback } from 'react';
import { useFirebase, useUser } from '@/firebase';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import type { UserTaskProgress, UserWeeklyTasks, WeeklyTask } from '@/lib/types';
import { WEEKLY_TASKS, getWeekStartDate } from '@/lib/shop-data';
import { useEconomy } from './use-economy';

export function useWeeklyTasks() {
  const { firestore } = useFirebase();
  const { user } = useUser();
  const { economy, addCurrency } = useEconomy();
  const [userTasks, setUserTasks] = useState<UserWeeklyTasks | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load or reset weekly tasks
  useEffect(() => {
    if (!user) {
      setUserTasks(null);
      setIsLoading(false);
      return;
    }

    const loadTasks = async () => {
      setIsLoading(true);
      try {
        const tasksRef = doc(firestore, 'userTasks', user.uid);
        const tasksSnap = await getDoc(tasksRef);
        const currentWeek = getWeekStartDate();

        if (tasksSnap.exists()) {
          const data = tasksSnap.data() as UserWeeklyTasks;
          
          // Check if it's a new week
          if (data.weekStartDate !== currentWeek) {
            // Reset tasks for new week
            const newTasks = createInitialTasks();
            await setDoc(tasksRef, {
              weekStartDate: currentWeek,
              tasks: newTasks,
              lastUpdated: serverTimestamp(),
            });
            setUserTasks({ weekStartDate: currentWeek, tasks: newTasks, lastUpdated: data.lastUpdated });
          } else {
            setUserTasks(data);
          }
        } else {
          // Create initial tasks
          const newTasks = createInitialTasks();
          await setDoc(tasksRef, {
            weekStartDate: currentWeek,
            tasks: newTasks,
            lastUpdated: serverTimestamp(),
          });
          setUserTasks({ weekStartDate: currentWeek, tasks: newTasks, lastUpdated: {} as any });
        }
      } catch (e) {
        console.error('Error loading tasks:', e);
        setError('Error al cargar las tareas');
      } finally {
        setIsLoading(false);
      }
    };

    loadTasks();
  }, [user, firestore]);

  // Create initial task progress
  const createInitialTasks = (): UserTaskProgress[] => {
    return WEEKLY_TASKS.map(task => ({
      taskId: task.id,
      progress: 0,
      completed: false,
      claimed: false,
    }));
  };

  // Update task progress
  const updateTaskProgress = useCallback(async (
    taskType: WeeklyTask['type'], 
    incrementAmount: number = 1,
    additionalData?: { letterLength?: number; paperColor?: string; stamp?: string }
  ): Promise<void> => {
    if (!user || !userTasks) return;

    try {
      const tasksRef = doc(firestore, 'userTasks', user.uid);
      const updatedTasks = userTasks.tasks.map(taskProgress => {
        const taskDef = WEEKLY_TASKS.find(t => t.id === taskProgress.taskId);
        if (!taskDef || taskDef.type !== taskType) return taskProgress;
        if (taskProgress.claimed) return taskProgress; // Already claimed, don't update

        let newProgress = taskProgress.progress;

        // Special handling for different task types
        switch (taskType) {
          case 'write_long_letter':
            if (additionalData?.letterLength && additionalData.letterLength >= 500) {
              newProgress = 1;
            }
            break;
          case 'use_different_colors':
          case 'use_stamps':
            // These need tracking of unique items used - simplified for now
            newProgress = Math.min(taskProgress.progress + incrementAmount, taskDef.target);
            break;
          default:
            newProgress = Math.min(taskProgress.progress + incrementAmount, taskDef.target);
        }

        const completed = newProgress >= taskDef.target;

        return {
          ...taskProgress,
          progress: newProgress,
          completed,
        };
      });

      await updateDoc(tasksRef, {
        tasks: updatedTasks,
        lastUpdated: serverTimestamp(),
      });

      setUserTasks(prev => prev ? { ...prev, tasks: updatedTasks } : null);
    } catch (e) {
      console.error('Error updating task progress:', e);
    }
  }, [user, userTasks, firestore]);

  // Claim task reward
  const claimReward = useCallback(async (taskId: string): Promise<boolean> => {
    if (!user || !userTasks) return false;

    const taskProgress = userTasks.tasks.find(t => t.taskId === taskId);
    const taskDef = WEEKLY_TASKS.find(t => t.id === taskId);

    if (!taskProgress || !taskDef) {
      setError('Tarea no encontrada');
      return false;
    }

    if (!taskProgress.completed) {
      setError('Tarea no completada');
      return false;
    }

    if (taskProgress.claimed) {
      setError('Recompensa ya reclamada');
      return false;
    }

    try {
      // Add reward to economy
      const success = await addCurrency(taskDef.reward.amount, taskDef.reward.currency);
      if (!success) return false;

      // Mark as claimed
      const tasksRef = doc(firestore, 'userTasks', user.uid);
      const updatedTasks = userTasks.tasks.map(t => 
        t.taskId === taskId ? { ...t, claimed: true } : t
      );

      await updateDoc(tasksRef, {
        tasks: updatedTasks,
        lastUpdated: serverTimestamp(),
      });

      setUserTasks(prev => prev ? { ...prev, tasks: updatedTasks } : null);
      return true;
    } catch (e) {
      console.error('Error claiming reward:', e);
      setError('Error al reclamar la recompensa');
      return false;
    }
  }, [user, userTasks, firestore, addCurrency]);

  // Get task with definition
  const getTasksWithDefinitions = useCallback(() => {
    if (!userTasks) return [];

    return userTasks.tasks.map(taskProgress => {
      const definition = WEEKLY_TASKS.find(t => t.id === taskProgress.taskId);
      return {
        ...taskProgress,
        definition,
      };
    }).filter(t => t.definition);
  }, [userTasks]);

  // Get completion stats
  const getCompletionStats = useCallback(() => {
    if (!userTasks) return { completed: 0, total: WEEKLY_TASKS.length, claimed: 0 };

    const completed = userTasks.tasks.filter(t => t.completed).length;
    const claimed = userTasks.tasks.filter(t => t.claimed).length;

    return {
      completed,
      total: WEEKLY_TASKS.length,
      claimed,
      unclaimed: completed - claimed,
    };
  }, [userTasks]);

  // Get days until reset
  const getDaysUntilReset = useCallback((): number => {
    const now = new Date();
    const day = now.getDay();
    const daysUntilMonday = day === 0 ? 1 : 8 - day;
    return daysUntilMonday;
  }, []);

  return {
    userTasks,
    isLoading,
    error,
    updateTaskProgress,
    claimReward,
    getTasksWithDefinitions,
    getCompletionStats,
    getDaysUntilReset,
    clearError: () => setError(null),
  };
}
