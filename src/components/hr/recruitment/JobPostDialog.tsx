
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

interface JobPostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateJob: () => void;
}

export function JobPostDialog({ open, onOpenChange, onCreateJob }: JobPostDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Criar Novo Processo Seletivo</DialogTitle>
          <DialogDescription>
            Preencha os dados da nova vaga. Marque como "Publicar" para disponibilizar para candidaturas externas.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right" htmlFor="job-title">
              Título
            </Label>
            <Input id="job-title" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right" htmlFor="department">
              Departamento
            </Label>
            <Input id="department" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right" htmlFor="positions">
              Vagas
            </Label>
            <Input id="positions" className="col-span-3" type="number" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right" htmlFor="job-description">
              Descrição
            </Label>
            <Textarea id="job-description" className="col-span-3" rows={5} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right" htmlFor="publish">
              Publicar
            </Label>
            <div className="flex items-center space-x-2 col-span-3">
              <Switch id="publish" />
              <Label htmlFor="publish">Disponibilizar para candidaturas externas</Label>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={onCreateJob}>
            Criar Vaga
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
