
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface SelectGroupProps {
  id: string;
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  options: Array<{value: string; label: string}>;
  error?: string;
  className?: string;
}

export function SelectGroup({
  id,
  label,
  value,
  onValueChange,
  placeholder,
  options,
  error,
  className
}: SelectGroupProps) {
  return (
    <div className={`grid gap-2 ${className || ''}`}>
      <Label htmlFor={id}>{label}</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger 
          id={id} 
          className={cn(
            "w-full border bg-background h-10 px-3 py-2 text-sm",
            error ? "border-red-500 focus-visible:ring-red-500" : "border-input"
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent 
          position="popper"
          className="w-full min-w-[220px] bg-popover border border-border shadow-lg z-[999]"
          align="start"
          sideOffset={5}
          avoidCollisions={true}
        >
          {options.length === 0 ? (
            <div className="py-3 px-4 text-sm text-muted-foreground text-center">
              Nenhuma opção disponível
            </div>
          ) : (
            options.map(option => (
              <SelectItem 
                key={option.value} 
                value={option.value || `default-value-${option.label.toLowerCase().replace(/\s+/g, '-')}`}
                className="cursor-pointer hover:bg-muted focus:bg-muted"
              >
                {option.label}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
