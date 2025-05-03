
import { useState } from "react";
import { CheckCircle2, Clock, AlertCircle, Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Task } from "@/types/tasks";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { TaskForm } from "./TaskForm";

interface TaskItemProps {
  task: Task;
  onUpdate: (id: string, updates: Partial<Task>) => Promise<Task>;
  onDelete: (id: string) => Promise<boolean>;
}

export function TaskItem({ task, onUpdate, onDelete }: TaskItemProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="text-yellow-500" size={18} />;
      case 'in-progress':
        return <AlertCircle className="text-blue-500" size={18} />;
      case 'completed':
        return <CheckCircle2 className="text-green-500" size={18} />;
      default:
        return <Clock className="text-muted-foreground" size={18} />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'in-progress':
        return 'Em Progresso';
      case 'completed':
        return 'Concluída';
      case 'cancelled':
        return 'Cancelada';
      default:
        return 'Desconhecido';
    }
  };

  const handleUpdate = async (updatedTask: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => {
    setIsUpdateLoading(true);
    try {
      await onUpdate(task.id, updatedTask);
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating task:', error);
    } finally {
      setIsUpdateLoading(false);
    }
  };

  const handleDelete = async () => {
    if (confirm('Tem certeza de que deseja excluir esta tarefa?')) {
      setIsDeleting(true);
      try {
        await onDelete(task.id);
      } catch (error) {
        console.error('Error deleting task:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      await onUpdate(task.id, { status: newStatus });
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  return (
    <>
      <div className="flex items-start p-3 rounded-lg border border-border/40 bg-card/50 hover:bg-card/80 transition-colors">
        <div className="flex-shrink-0 mr-3 mt-1">
          {getStatusIcon(task.status)}
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-medium text-sm">{task.title}</h4>
              <span className="text-xs text-muted-foreground inline-block mt-0.5">
                {getStatusLabel(task.status)} - {task.module || 'Geral'}
              </span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {task.description}
          </p>
        </div>
        <div className="ml-2 flex flex-col gap-2">
          <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => setIsEditDialogOpen(true)}>
            <Edit size={14} className="mr-1" />
            Editar
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-7 text-xs text-red-600 hover:text-red-700" 
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 size={14} className="mr-1" />
            Excluir
          </Button>
        </div>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <TaskForm 
            initialData={task} 
            onSubmit={handleUpdate} 
            onCancel={() => setIsEditDialogOpen(false)} 
            isLoading={isUpdateLoading}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
