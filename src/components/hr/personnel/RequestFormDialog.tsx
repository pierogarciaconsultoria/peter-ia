
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle 
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarDays, CreditCard } from "lucide-react";
import { useForm } from "react-hook-form";
import { JobPosition } from "../types";
import { RequestFormValues } from "./types";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface RequestFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: RequestFormValues) => void;
  jobPositions: JobPosition[];
}

export function RequestFormDialog({ isOpen, onOpenChange, onSubmit, jobPositions }: RequestFormDialogProps) {
  const form = useForm<RequestFormValues>({
    defaultValues: {
      type: "",
      department: "",
      position: "",
      justification: "",
      targetDate: "",
      employeeName: "",
      hireDate: "",
      currentPosition: "",
      proposedPosition: "",
      currentSchedule: {
        start1: "",
        end1: "",
        start2: "",
        end2: ""
      },
      proposedSchedule: {
        start1: "",
        end1: "",
        start2: "",
        end2: ""
      },
      currentSalary: "",
      proposedSalary: "",
      days: "",
      gender: undefined,
      admissionType: "",
      terminationType: "",
      justCause: false,
      noticePeriod: false
    }
  });
  
  // Get unique departments from job positions
  const departments = Array.from(new Set(jobPositions.map(job => job.department)));
  
  // Filter job positions by selected department
  const filteredPositions = jobPositions.filter(
    job => !form.watch("department") || job.department === form.watch("department")
  );
  
  // Handle department selection to filter job positions
  const handleDepartmentChange = (value: string) => {
    form.setValue("department", value);
    form.setValue("position", ""); // Reset position when department changes
  };

  // Form movement types
  const movementTypes = [
    { id: "hiring", label: "Admissão" },
    { id: "termination", label: "Demissão" },
    { id: "salaryChange", label: "Aumento salarial" },
    { id: "positionChange", label: "Mudança de cargo" },
    { id: "vacation", label: "Férias" },
    { id: "scheduleChange", label: "Mudança de horário" },
    { id: "absence", label: "Falta ao trabalho" },
    { id: "late", label: "Chegou atrasado" },
    { id: "medicalCertificate", label: "Atestado" },
    { id: "cardPunchForgot", label: "Esqueceu de bater cartão" },
    { id: "departmentChange", label: "Mudança de setor" },
    { id: "shiftChange", label: "Troca de turno" },
    { id: "factoryLeave", label: "Autorização saída da fábrica" },
    { id: "writtenWarning", label: "Advertência por escrito" },
    { id: "verbalWarning", label: "Advertência verbal" },
    { id: "overtimeAuth", label: "Autorizado a fazer hora extra" },
    { id: "dayExchange", label: "Troca de dia" },
    { id: "hourCredit", label: "Abono de hora" }
  ];
  
  const admissionTypes = [
    { id: "increase", label: "Aumento de quadro" },
    { id: "replacement", label: "Substituição" },
    { id: "reposition", label: "Reposição" }
  ];
  
  const terminationTypes = [
    { id: "employeeInitiative", label: "Iniciativa do colaborador" },
    { id: "companyInitiative", label: "Iniciativa da empresa" }
  ];

  // Selected type category
  const selectedType = movementTypes.find(type => type.id === form.watch("type"))?.label || "";
  const isAdmission = selectedType === "Admissão";
  const isTermination = selectedType === "Demissão";
  const isSalaryChange = selectedType === "Aumento salarial";
  const isPositionChange = selectedType === "Mudança de cargo";
  const isScheduleChange = selectedType === "Mudança de horário";

  const showEmployeeSection = true;
  const showPositionSection = isAdmission || isPositionChange || isSalaryChange;
  const showScheduleSection = isAdmission || isScheduleChange;
  const showSalarySection = isAdmission || isSalaryChange;
  const showAdmissionSection = isAdmission;
  const showTerminationSection = isTermination;
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Movimentação de Pessoal</DialogTitle>
          <DialogDescription>
            Formulário para solicitação de movimentação de pessoal
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Movement Type Selection */}
            <div className="grid grid-cols-3 gap-2">
              {movementTypes.map((type) => (
                <div key={type.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={type.id}
                    checked={form.watch("type") === type.id}
                    onCheckedChange={() => form.setValue("type", type.id)}
                  />
                  <label 
                    htmlFor={type.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {type.label}
                  </label>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Department */}
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Setor</FormLabel>
                    <Select 
                      onValueChange={(value) => handleDepartmentChange(value)} 
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um setor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Employee Name */}
              <FormField
                control={form.control}
                name="employeeName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Colaborador</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do colaborador" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Start Date & Days */}
              <FormField
                control={form.control}
                name="targetDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>A partir de</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <CalendarDays className="h-4 w-4 mr-2 text-gray-400" />
                        <Input type="date" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="days"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dias</FormLabel>
                    <FormControl>
                      <Input placeholder="Número de dias" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Hiring Date */}
              <FormField
                control={form.control}
                name="hireDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data da Admissão</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <CalendarDays className="h-4 w-4 mr-2 text-gray-400" />
                        <Input type="date" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Position Section */}
            {showPositionSection && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Current Position */}
                <FormField
                  control={form.control}
                  name="currentPosition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cargo atual</FormLabel>
                      <FormControl>
                        <Input placeholder="Cargo atual" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Proposed Position */}
                <FormField
                  control={form.control}
                  name="proposedPosition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cargo proposto</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um cargo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {filteredPositions.map((position) => (
                            <SelectItem key={position.id} value={position.title}>
                              {position.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Schedule Section */}
            {showScheduleSection && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <FormLabel>Horário atual</FormLabel>
                    <div className="grid grid-cols-2 gap-2">
                      <FormField
                        control={form.control}
                        name="currentSchedule.start1"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="currentSchedule.end1"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="currentSchedule.start2"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="currentSchedule.end2"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <FormLabel>Horário proposto</FormLabel>
                    <div className="grid grid-cols-2 gap-2">
                      <FormField
                        control={form.control}
                        name="proposedSchedule.start1"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="proposedSchedule.end1"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="proposedSchedule.start2"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="proposedSchedule.end2"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Admission Type Section */}
            {showAdmissionSection && (
              <div className="border p-4 rounded-md">
                <h3 className="text-lg font-semibold mb-2">ADMISSÃO</h3>
                <div className="grid grid-cols-1 gap-2">
                  {admissionTypes.map((type) => (
                    <div key={type.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`admission-${type.id}`}
                        checked={form.watch("admissionType") === type.id}
                        onCheckedChange={() => form.setValue("admissionType", type.id)}
                      />
                      <label 
                        htmlFor={`admission-${type.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {type.label}
                      </label>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4">
                  <FormLabel>Gênero</FormLabel>
                  <RadioGroup
                    value={form.watch("gender")}
                    onValueChange={(value) => form.setValue("gender", value as "male" | "female")}
                    className="flex items-center space-x-4 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <label htmlFor="male">Masculino</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <label htmlFor="female">Feminino</label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            )}

            {/* Termination Section */}
            {showTerminationSection && (
              <div className="border p-4 rounded-md">
                <h3 className="text-lg font-semibold mb-2">DESLIGAMENTO</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    {terminationTypes.map((type) => (
                      <div key={type.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`termination-${type.id}`}
                          checked={form.watch("terminationType") === type.id}
                          onCheckedChange={() => form.setValue("terminationType", type.id)}
                        />
                        <label 
                          htmlFor={`termination-${type.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {type.label}
                        </label>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="just-cause-no"
                        checked={form.watch("justCause") === false}
                        onCheckedChange={() => form.setValue("justCause", false)}
                      />
                      <label 
                        htmlFor="just-cause-no"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Sem justa causa
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="just-cause-yes"
                        checked={form.watch("justCause") === true}
                        onCheckedChange={() => form.setValue("justCause", true)}
                      />
                      <label 
                        htmlFor="just-cause-yes"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Com justa causa
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <FormLabel>Cumpre o aviso prévio:</FormLabel>
                  <RadioGroup
                    value={form.watch("noticePeriod") ? "yes" : "no"}
                    onValueChange={(value) => form.setValue("noticePeriod", value === "yes")}
                    className="flex items-center space-x-4 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="notice-yes" />
                      <label htmlFor="notice-yes">Sim</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="notice-no" />
                      <label htmlFor="notice-no">Não</label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            )}

            {/* Salary Section */}
            {showSalarySection && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="currentSalary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Salário atual</FormLabel>
                      <FormControl>
                        <div className="flex items-center">
                          <CreditCard className="h-4 w-4 mr-2 text-gray-400" />
                          <Input placeholder="R$" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="proposedSalary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Salário proposto</FormLabel>
                      <FormControl>
                        <div className="flex items-center">
                          <CreditCard className="h-4 w-4 mr-2 text-gray-400" />
                          <Input placeholder="R$" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            
            <FormField
              control={form.control}
              name="justification"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Justificativas</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descreva a justificativa para esta solicitação" 
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="pt-2 border-t mt-4">
              <FormLabel>Parecer do Recursos Humanos</FormLabel>
              <div className="p-3 border rounded-md bg-gray-50 text-gray-500">
                Este campo será preenchido pelo RH após análise da solicitação
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4 mt-4">
              <div>
                <FormLabel>Requisitante</FormLabel>
                <div className="text-sm text-gray-500 mt-2">
                  Data: ___/___/_____
                </div>
                <div className="border-t border-gray-300 mt-6 pt-2 text-center text-sm text-gray-500">
                  Assinatura
                </div>
              </div>
              <div>
                <FormLabel>Gerência / Direção</FormLabel>
                <div className="text-sm text-gray-500 mt-2">
                  Data: ___/___/_____
                </div>
                <div className="border-t border-gray-300 mt-6 pt-2 text-center text-sm text-gray-500">
                  Assinatura
                </div>
              </div>
            </div>
            
            <div className="bg-gray-100 p-4 rounded-md text-center">
              <h3 className="font-semibold">ENCERRAMENTO</h3>
              <div className="text-sm text-gray-500 mt-2">
                Data: ___/___/_____
              </div>
              <div className="border-t border-gray-300 mt-6 pt-2 text-center text-sm text-gray-500">
                RH
              </div>
            </div>
            
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">Enviar Solicitação</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
