
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StakeholderForm } from "./StakeholderForm";

interface StakeholderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: Parameters<typeof StakeholderForm>[0]["onSubmit"];
  loading?: boolean;
}

export function StakeholderDialog({ open, onOpenChange, onSubmit, loading }: StakeholderDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nova Parte Interessada</DialogTitle>
        </DialogHeader>
        <StakeholderForm onSubmit={onSubmit} onCancel={() => onOpenChange(false)} loading={loading} />
      </DialogContent>
    </Dialog>
  );
}
