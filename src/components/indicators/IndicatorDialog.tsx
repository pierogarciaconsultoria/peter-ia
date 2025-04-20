
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { IndicatorForm } from '@/components/indicators/IndicatorForm';
import { IndicatorType } from '@/types/indicators';

interface IndicatorDialogProps {
  open: boolean;
  mode: 'create' | 'edit';
  indicator: IndicatorType | null;
  onClose: () => void;
  afterSubmit: (data: Omit<IndicatorType, 'id' | 'created_at' | 'updated_at'>) => void;
  defaultProcess?: string;
}

export function IndicatorDialog({ 
  open, 
  mode, 
  indicator, 
  onClose, 
  afterSubmit,
  defaultProcess 
}: IndicatorDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Novo Indicador' : 'Editar Indicador'}
          </DialogTitle>
        </DialogHeader>
        <IndicatorForm 
          indicator={indicator}
          onClose={onClose}
          afterSubmit={afterSubmit}
          defaultProcess={defaultProcess}
        />
      </DialogContent>
    </Dialog>
  );
}
