
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CompanyForm } from "./CompanyForm";

interface CompanyDialogProps {
  mode: 'add' | 'edit';
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: {
    name: string;
    slug: string;
    cnpj: string;
    plan: string;
  };
  onChange: (formData: any) => void;
  onSubmit: () => void;
}

export function CompanyDialog({ 
  mode, 
  open, 
  onOpenChange, 
  formData, 
  onChange, 
  onSubmit 
}: CompanyDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === 'add' ? 'Add New Company' : 'Edit Company'}</DialogTitle>
          <DialogDescription>
            {mode === 'add' 
              ? 'Create a new company in the system. All fields are required.' 
              : 'Update company information'}
          </DialogDescription>
        </DialogHeader>
        
        <CompanyForm 
          formData={formData} 
          onChange={onChange} 
          mode={mode} 
        />
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={onSubmit} 
            disabled={mode === 'add' && !formData.name}
          >
            {mode === 'add' ? 'Add Company' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
