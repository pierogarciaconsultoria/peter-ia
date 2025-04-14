
import { useState, useEffect } from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { ISODocument } from "@/utils/isoTypes";

interface DocumentSelectorProps {
  documents: ISODocument[];
  selectedDocuments: string[];
  onSelectionChange: (documentId: string, documentTitle: string) => void;
  onRemove: (docId: string) => void;
  isLoading: boolean;
}

export function DocumentSelector({
  documents,
  selectedDocuments,
  onSelectionChange,
  onRemove,
  isLoading,
}: DocumentSelectorProps) {
  // Ensure we're working with arrays even if undefined is passed
  const safeDocuments = Array.isArray(documents) ? documents : [];
  const safeSelectedDocuments = Array.isArray(selectedDocuments) ? selectedDocuments : [];

  const getDocumentTitleById = (id: string) => {
    const document = safeDocuments.find(doc => doc.id === id);
    return document ? document.title : id;
  };

  return (
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
                    {safeDocuments.map((document) => (
                      <CommandItem
                        key={document.id}
                        value={document.id}
                        onSelect={() => onSelectionChange(document.id, document.title)}
                      >
                        <div className="flex items-center">
                          <span>{document.title}</span>
                          <CheckIcon
                            className={cn(
                              "ml-auto h-4 w-4",
                              safeSelectedDocuments.includes(document.id)
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
          {safeSelectedDocuments.map((docId) => (
            <Badge key={docId} variant="secondary" className="flex items-center gap-1 px-3 py-1">
              {getDocumentTitleById(docId)}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => onRemove(docId)}
              />
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
