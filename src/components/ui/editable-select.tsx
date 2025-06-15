
import React, { useRef, useState } from "react";
import { X, Plus, Check, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Tipo genérico para opções:
export interface EditableOption {
  value: string;
  label: string;
}

interface EditableSelectProps {
  options: EditableOption[];
  value: string;
  onChange: (value: string, options?: EditableOption[]) => void;
  placeholder?: string;
  className?: string;
}

export const EditableSelect: React.FC<EditableSelectProps> = ({
  options: initialOptions,
  value,
  onChange,
  placeholder,
  className,
}) => {
  const [options, setOptions] = useState<EditableOption[]>(initialOptions);
  const [adding, setAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState<string>("");

  // Add new option
  const handleAdd = () => {
    setAdding(true);
    setInputValue("");
  };

  // Save new option
  const handleSave = () => {
    const trimmed = inputValue.trim();
    if (!trimmed || options.some((o) => o.label.toLowerCase() === trimmed.toLowerCase())) {
      setAdding(false);
      setInputValue("");
      return;
    }
    const newOption = { value: trimmed, label: trimmed };
    const updatedOptions = [...options, newOption];
    setOptions(updatedOptions);
    setAdding(false);
    setInputValue("");
    onChange(trimmed, updatedOptions);
  };

  // Start editing existing option
  const handleEdit = (idx: number) => {
    setEditingIndex(idx);
    setInputValue(options[idx].label);
  };

  const handleEditSave = () => {
    if (editingIndex === null) return;
    const trimmed = inputValue.trim();
    if (
      !trimmed ||
      options.some((o, i) => i !== editingIndex && o.label.toLowerCase() === trimmed.toLowerCase())
    ) {
      setEditingIndex(null);
      setInputValue("");
      return;
    }
    const newOptions = options.map((opt, i) =>
      i === editingIndex ? { ...opt, value: trimmed, label: trimmed } : opt
    );
    setOptions(newOptions);
    setEditingIndex(null);
    setInputValue("");
    // Se estava selecionado, atualiza para a nova versão:
    if (value === options[editingIndex].value) {
      onChange(trimmed, newOptions);
    } else {
      onChange(value, newOptions);
    }
  };

  // Remove an option
  const handleDelete = (idx: number) => {
    const newOptions = [...options];
    const removed = newOptions.splice(idx, 1);
    setOptions(newOptions);
    if (value === removed[0].value) {
      onChange("", newOptions);
    } else {
      onChange(value, newOptions);
    }
  };

  // Select option
  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue, options);
  };

  // Enter para salvar
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (adding) handleSave();
      if (editingIndex !== null) handleEditSave();
    } else if (e.key === "Escape") {
      setAdding(false);
      setEditingIndex(null);
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="relative w-full">
        <select
          className={cn(
            "w-full h-10 rounded-md border px-2 py-1 bg-background pr-10 text-sm appearance-none",
            "focus:ring-2 focus:ring-primary focus:outline-none"
          )}
          value={value}
          onChange={(e) => handleSelect(e.target.value)}
        >
          <option value="" disabled>
            {placeholder || "Selecione ou adicione uma categoria"}
          </option>
          {options.map((opt, idx) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="absolute right-1 top-1 h-8 w-8"
          tabIndex={-1}
          onClick={handleAdd}
          title="Adicionar nova categoria"
        >
          <Plus size={18} className="text-primary" />
        </Button>
      </div>

      {/* Inclusão de nova categoria */}
      {adding && (
        <div className="flex mt-2 gap-2 items-center">
          <Input
            autoFocus
            placeholder="Nova categoria"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleInputKeyDown}
            className="flex-1"
          />
          <Button type="button" size="icon" onClick={handleSave} variant="outline" title="Salvar">
            <Check size={18} />
          </Button>
          <Button type="button" size="icon" onClick={() => setAdding(false)} variant="ghost" title="Cancelar">
            <X size={18} />
          </Button>
        </div>
      )}

      {/* Editar/remover opções existentes */}
      <div className="flex flex-wrap gap-1 mt-2">
        {options.map((opt, idx) => (
          <div key={opt.value} className="flex items-center rounded bg-muted px-2 py-0.5 mr-1 mb-1">
            {editingIndex === idx ? (
              <>
                <Input
                  autoFocus
                  size={8}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleInputKeyDown}
                  className="w-28 h-6 rounded mr-2 text-xs"
                />
                <Button type="button" size="icon" variant="outline" className="h-6 w-6 mr-1" onClick={handleEditSave} title="Salvar edição">
                  <Check size={14} />
                </Button>
                <Button type="button" size="icon" variant="ghost" className="h-6 w-6" onClick={() => setEditingIndex(null)} title="Cancelar">
                  <X size={14} />
                </Button>
              </>
            ) : (
              <>
                <span className="text-xs">{opt.label}</span>
                <Button type="button" size="icon" variant="ghost" className="h-6 w-6" onClick={() => handleEdit(idx)} title="Editar">
                  <Pencil size={14} />
                </Button>
                <Button type="button" size="icon" variant="ghost" className="h-6 w-6" onClick={() => handleDelete(idx)} title="Remover">
                  <X size={14} />
                </Button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
