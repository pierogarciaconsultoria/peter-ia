
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { Task } from "@/types/tasks";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch all tasks
  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      setTasks(data || []);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch tasks'));
      toast.error('Erro ao carregar tarefas');
    } finally {
      setLoading(false);
    }
  };

  // Create a new task
  const createTask = async (newTask: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([newTask])
        .select();
        
      if (error) {
        throw error;
      }
      
      toast.success('Tarefa criada com sucesso');
      return data?.[0] as Task;
    } catch (err) {
      console.error('Error creating task:', err);
      toast.error('Erro ao criar tarefa');
      throw err;
    }
  };

  // Update an existing task
  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select();
        
      if (error) {
        throw error;
      }
      
      // Update the local state
      setTasks(tasks.map(task => (task.id === id ? { ...task, ...updates } : task)));
      
      toast.success('Tarefa atualizada com sucesso');
      return data?.[0] as Task;
    } catch (err) {
      console.error('Error updating task:', err);
      toast.error('Erro ao atualizar tarefa');
      throw err;
    }
  };

  // Delete a task
  const deleteTask = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      // Remove from local state
      setTasks(tasks.filter(task => task.id !== id));
      
      toast.success('Tarefa removida com sucesso');
      return true;
    } catch (err) {
      console.error('Error deleting task:', err);
      toast.error('Erro ao remover tarefa');
      throw err;
    }
  };

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask
  };
}
