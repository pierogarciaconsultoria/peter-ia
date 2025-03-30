
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

interface JobApplicationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: () => void;
  jobTitle?: string;
}

export function JobApplicationDialog({ open, onOpenChange, onApply, jobTitle = "Desenvolvedor React Senior" }: JobApplicationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Candidatura - {jobTitle}</DialogTitle>
          <DialogDescription>
            Preencha suas informações para se candidatar à vaga.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right" htmlFor="name">
              Nome
            </Label>
            <Input id="name" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right" htmlFor="email">
              E-mail
            </Label>
            <Input id="email" className="col-span-3" type="email" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right" htmlFor="phone">
              Telefone
            </Label>
            <Input id="phone" className="col-span-3" type="tel" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right" htmlFor="resume">
              Currículo
            </Label>
            <Input id="resume" className="col-span-3" type="file" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right" htmlFor="cover-letter">
              Carta
            </Label>
            <Textarea id="cover-letter" className="col-span-3" placeholder="Por que você é ideal para esta vaga?" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={onApply}>
            Enviar Candidatura
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
