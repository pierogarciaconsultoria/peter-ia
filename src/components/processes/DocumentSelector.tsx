
import React, { useState, useEffect } from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown, Check, FileText, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

interface Document {
  id: string;
  title: string;
  document_code: string;
  document_type: string;
}

interface DocumentSelectorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function DocumentSelector({ value, onChange, placeholder = "Selecionar documento..." }: DocumentSelectorProps) {
  const [open, setOpen] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchDocuments() {
      setLoading(true);
      try {
        // Para agora, usar documentos mock até a tabela ser criada
        console.log('Document selector - using mock data until database setup');
        const mockDocuments: Document[] = [
          {
            id: '1',
            title: 'Procedimento de Controle de Qualidade',
            document_code: 'PRC-001',
            document_type: 'Procedimento'
          },
          {
            id: '2',
            title: 'Manual de Operações',
            document_code: 'MAN-001',
            document_type: 'Manual'
          }
        ];
        setDocuments(mockDocuments);
      } catch (error) {
        console.error("Error loading documents:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDocuments();
  }, []);

  const selectedDocument = documents.find(doc => doc.title === value);
  
  const handleAddDocument = () => {
    setOpen(false);
    setOpenDialog(false);
    navigate("/documents");
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={loading}
          >
            <div className="flex items-center">
              {loading ? (
                <span className="text-muted-foreground">Carregando documentos...</span>
              ) : selectedDocument ? (
                <span>{selectedDocument.title}</span>
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-[400px] max-h-[400px] overflow-auto">
          <Command>
            <CommandInput placeholder="Buscar documento..." className="h-9" />
            <CommandEmpty>
              <div className="flex flex-col items-center justify-center p-4">
                <p className="text-sm text-center mb-2">Nenhum documento encontrado.</p>
                <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Plus size={16} /> Adicionar novo documento
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Adicionar documento</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                      <p className="text-sm text-muted-foreground">
                        Para cadastrar um novo documento, você será redirecionado para a página de documentos.
                      </p>
                    </div>
                    <div className="flex justify-end">
                      <Button onClick={handleAddDocument}>Ir para Documentos</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CommandEmpty>
            <CommandGroup>
              {documents.map((document) => (
                <CommandItem
                  key={document.id}
                  value={document.title}
                  onSelect={() => {
                    onChange(document.title);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === document.title ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col">
                    <span>{document.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {document.document_code ? `${document.document_code} - ` : ''}
                      {document.document_type}
                    </span>
                  </div>
                </CommandItem>
              ))}
              <CommandItem onSelect={() => setOpenDialog(true)} className="border-t">
                <Plus size={16} className="mr-2" />
                <span>Adicionar novo documento</span>
              </CommandItem>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
}
