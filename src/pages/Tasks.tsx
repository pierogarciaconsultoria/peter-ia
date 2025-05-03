
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTasks } from "@/hooks/useTasks";
import { TaskItem } from "@/components/tasks/TaskItem";
import { TaskForm } from "@/components/tasks/TaskForm";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Task } from "@/types/tasks";
import { Input } from "@/components/ui/input";

export function Tasks() {
  const { tasks, loading, error, createTask, updateTask, deleteTask } = useTasks();
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = async (newTask: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => {
    setIsSubmitting(true);
    try {
      await createTask(newTask);
      setIsCreatingTask(false);
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tarefas</h1>
        <Button onClick={() => setIsCreatingTask(true)}>
          <Plus size={16} className="mr-2" /> Nova Tarefa
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-[300px]">
          <Input
            placeholder="Pesquisar tarefas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-8">Carregando...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">Erro ao carregar tarefas</div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {searchTerm ? "Nenhuma tarefa encontrada com esses critérios." : "Nenhuma tarefa cadastrada."}
          </div>
        ) : (
          filteredTasks.map(task => (
            <TaskItem 
              key={task.id} 
              task={task} 
              onUpdate={updateTask} 
              onDelete={deleteTask} 
            />
          ))
        )}
      </div>

      <Dialog open={isCreatingTask} onOpenChange={setIsCreatingTask}>
        <DialogContent className="sm:max-w-[500px]">
          <TaskForm 
            onSubmit={handleSubmit} 
            onCancel={() => setIsCreatingTask(false)} 
            isLoading={isSubmitting} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Tasks;
