
import React, { memo } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemToDelete: {id: string, type: 'user' | 'company' | 'role'} | null;
  onDelete: () => Promise<void>;
  loading: boolean;
}

const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = memo(({
  open,
  onOpenChange,
  itemToDelete,
  onDelete,
  loading
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmação de exclusão</AlertDialogTitle>
          <AlertDialogDescription>
            {itemToDelete?.type === 'user' && "Esta ação não pode ser desfeita. O usuário será removido permanentemente do sistema."}
            {itemToDelete?.type === 'company' && "Esta ação não pode ser desfeita. A empresa e todos os seus dados serão removidos permanentemente."}
            {itemToDelete?.type === 'role' && "Esta ação não pode ser desfeita. O papel será removido permanentemente do sistema."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onDelete} 
            disabled={loading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
});

DeleteConfirmDialog.displayName = "DeleteConfirmDialog";

export default DeleteConfirmDialog;
