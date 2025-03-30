
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { JobPosition } from "../types";
import { useToast } from "@/hooks/use-toast";
import { fetchDocumentsForSelection } from "@/services/jobPositionService";
import { ISODocument } from "@/utils/isoTypes";

interface JobPositionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (jobPosition: JobPosition) => void;
  jobPosition?: JobPosition;
}

export function JobPositionDialog({
  isOpen,
  onClose,
  onSave,
  jobPosition,
}: JobPositionDialogProps) {
  const { toast } = useToast();
  const isEditing = !!jobPosition;
  const [documents, setDocuments] = useState<ISODocument[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState<JobPosition>(
    jobPosition || {
      id: crypto.randomUUID(),
      code: "",
      title: "",
      description: "",
      department: "",
      revision: "1.0",
      is_supervisor: false,
      status: "draft",
    }
  );

  // Fetch documents from the database
  useEffect(() => {
    const loadDocuments = async () => {
      if (isOpen) {
        setIsLoading(true);
        try {
          const docsData = await fetchDocumentsForSelection();
          setDocuments(docsData);
        } catch (error) {
          console.error("Error loading documents:", error);
          toast({
            title: "Erro ao carregar documentos",
            description: "Não foi possível carregar a lista de documentos para seleção.",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadDocuments();
  }, [isOpen, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, is_supervisor: checked }));
  };

  const handleDocumentSelection = (documentId: string, documentTitle: string) => {
    setFormData((prev) => {
      const currentProcedures = prev.required_procedures || [];
      
      // Check if document is already selected
      if (currentProcedures.includes(documentId)) {
        // Remove document from selection
        return {
          ...prev,
          required_procedures: currentProcedures.filter(id => id !== documentId)
        };
      } else {
        // Add document to selection
        return {
          ...prev,
          required_procedures: [...currentProcedures, documentId]
        };
      }
    });
  };

  const getDocumentTitleById = (id: string) => {
    const document = documents.find(doc => doc.id === id);
    return document ? document.title : id;
  };

  const removeSelectedDocument = (docId: string) => {
    setFormData(prev => ({
      ...prev,
      required_procedures: (prev.required_procedures || []).filter(id => id !== docId)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.code || !formData.title) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Descrição de Cargo" : "Nova Descrição de Cargo"}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Código da DC *</Label>
              <Input 
                id="code" 
                name="code" 
                value={formData.code} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="title">Descrição *</Label>
              <Input 
                id="title" 
                name="title" 
                value={formData.title} 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="revision">Revisão do documento</Label>
              <Input 
                id="revision" 
                name="revision" 
                value={formData.revision} 
                onChange={handleChange} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="approval_date">Data de Aprovação</Label>
              <Input 
                id="approval_date" 
                name="approval_date" 
                type="date" 
                value={formData.approval_date} 
                onChange={handleChange} 
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="approver">Responsável pela aprovação</Label>
              <Input 
                id="approver" 
                name="approver" 
                value={formData.approver} 
                onChange={handleChange} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="department">Departamento</Label>
              <Input 
                id="department" 
                name="department" 
                value={formData.department} 
                onChange={handleChange} 
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="immediate_supervisor_position">Cargo do superior imediato</Label>
              <Input 
                id="immediate_supervisor_position" 
                name="immediate_supervisor_position" 
                value={formData.immediate_supervisor_position} 
                onChange={handleChange} 
              />
            </div>
            
            <div className="space-y-2 flex items-center pt-6">
              <Checkbox 
                id="is_supervisor" 
                checked={formData.is_supervisor} 
                onCheckedChange={handleCheckboxChange}
              />
              <Label htmlFor="is_supervisor" className="ml-2">É superior imediato</Label>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cbo_code">Código da CBO</Label>
              <Input 
                id="cbo_code" 
                name="cbo_code" 
                value={formData.cbo_code} 
                onChange={handleChange} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="norm">Norma</Label>
              <Input 
                id="norm" 
                name="norm" 
                value={formData.norm} 
                onChange={handleChange} 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="main_responsibilities">Principais responsabilidades</Label>
            <Textarea 
              id="main_responsibilities" 
              name="main_responsibilities" 
              rows={4}
              value={formData.main_responsibilities} 
              onChange={handleChange} 
            />
          </div>
          
          <div className="space-y-2">
            <Label>Competência</Label>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="education_requirements">Educação</Label>
                <Input 
                  id="education_requirements" 
                  name="education_requirements" 
                  value={formData.education_requirements} 
                  onChange={handleChange} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="skill_requirements">Habilidades</Label>
                <Input 
                  id="skill_requirements" 
                  name="skill_requirements" 
                  value={formData.skill_requirements} 
                  onChange={handleChange} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="training_requirements">Treinamento</Label>
                <Input 
                  id="training_requirements" 
                  name="training_requirements" 
                  value={formData.training_requirements} 
                  onChange={handleChange} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="experience_requirements">Experiência</Label>
                <Input 
                  id="experience_requirements" 
                  name="experience_requirements" 
                  value={formData.experience_requirements} 
                  onChange={handleChange} 
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="required_procedures">Treinamentos necessários (procedimentos)</Label>
            
            <div className="space-y-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                    disabled={isLoading}
                  >
                    {isLoading ? "Carregando documentos..." : "Selecionar documentos"}
                    <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Buscar documento..." />
                    <CommandEmpty>Nenhum documento encontrado.</CommandEmpty>
                    <CommandList>
                      <CommandGroup>
                        <ScrollArea className="h-72">
                          {documents.map((document) => (
                            <CommandItem
                              key={document.id}
                              value={document.id}
                              onSelect={() => handleDocumentSelection(document.id, document.title)}
                            >
                              <div className="flex items-center">
                                <span>{document.title}</span>
                                <CheckIcon
                                  className={cn(
                                    "ml-auto h-4 w-4",
                                    (formData.required_procedures || []).includes(document.id)
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </div>
                            </CommandItem>
                          ))}
                        </ScrollArea>
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {/* Display selected documents as badges */}
              <div className="flex flex-wrap gap-2 mt-2">
                {(formData.required_procedures || []).map((docId) => (
                  <Badge key={docId} variant="secondary" className="flex items-center gap-1 px-3 py-1">
                    {getDocumentTitleById(docId)}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeSelectedDocument(docId)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="required_resources">Recursos necessários</Label>
            <Textarea 
              id="required_resources" 
              name="required_resources" 
              value={formData.required_resources?.join('\n')} 
              onChange={(e) => setFormData(prev => ({
                ...prev, 
                required_resources: e.target.value.split('\n').filter(item => item.trim() !== '')
              }))} 
              placeholder="Digite um recurso por linha"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="required_ppe">EPI (Equipamentos de Proteção Individual)</Label>
            <Textarea 
              id="required_ppe" 
              name="required_ppe" 
              value={formData.required_ppe?.join('\n')} 
              onChange={(e) => setFormData(prev => ({
                ...prev, 
                required_ppe: e.target.value.split('\n').filter(item => item.trim() !== '')
              }))} 
              placeholder="Digite um EPI por linha"
              rows={3}
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit">Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
