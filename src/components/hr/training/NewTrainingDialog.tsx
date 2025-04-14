import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import { EmployeeSelector } from "../departments/EmployeeSelector";
import { Employee } from "@/services/employee/types";

const formSchema = z.object({
  trainingName: z.string().min(2, {
    message: "Training name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  startDate: z.date(),
  endDate: z.date(),
  location: z.string().optional(),
  trainerType: z.enum(["internal", "external"]),
  internalTrainerEmployeeId: z.string().optional(),
  externalTrainerName: z.string().optional(),
  externalTrainerContact: z.string().optional(),
  trainingCost: z.number().optional(),
  isMandatory: z.boolean().default(false),
  targetAudience: z.string().optional(),
  trainingCategory: z.string().optional(),
  status: z.enum(["planned", "in_progress", "completed", "cancelled"]).default("planned"),
});

interface NewTrainingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  employees: Employee[];
}

export function NewTrainingDialog({ isOpen, onClose, onSubmit, employees }: NewTrainingDialogProps) {
  const [trainerType, setTrainerType] = useState<"internal" | "external">("internal");
  const [trainerEmployeeId, setTrainerEmployeeId] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      trainingName: "",
      description: "",
      startDate: new Date(),
      endDate: new Date(),
      location: "",
      trainerType: "internal",
      internalTrainerEmployeeId: null,
      externalTrainerName: "",
      externalTrainerContact: "",
      trainingCost: 0,
      isMandatory: false,
      targetAudience: "",
      trainingCategory: "",
      status: "planned",
    },
  });

  function handleTrainerTypeChange(value: "internal" | "external") {
    setTrainerType(value);
    form.setValue("trainerType", value);
  }

  function handleTrainerEmployeeChange(employeeId: string) {
    setTrainerEmployeeId(employeeId);
    form.setValue("internalTrainerEmployeeId", employeeId);
  }

  async function onSubmitForm(values: z.infer<typeof formSchema>) {
    onSubmit(values);
    toast({
      title: "Success!",
      description: "Your training has been registered.",
    });
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[825px]">
        <DialogHeader>
          <DialogTitle>New Training</DialogTitle>
          <DialogDescription>
            Create a new training for your company.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitForm)} className="space-y-8">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="trainingName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Training Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Training name" {...field} />
                    </FormControl>
                    <FormDescription>This is the name of the training.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Training description"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Write a brief description of the training.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-3">
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: ptBR })
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          locale={ptBR}
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date()
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>Select the start date for the training.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-3">
                    <FormLabel>End Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: ptBR })
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          locale={ptBR}
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < form.getValues("startDate")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>Select the end date for the training.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Training location" {...field} />
                    </FormControl>
                    <FormDescription>Enter the location where the training will take place.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="trainingCost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Training Cost</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0.00" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                    </FormControl>
                    <FormDescription>Enter the cost of the training.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <Label htmlFor="trainerType">Trainer Type</Label>
              <div className="flex items-center space-x-2 mt-2">
                <SelectItem
                  value="internal"
                  onClick={() => handleTrainerTypeChange("internal")}
                  className={cn(
                    "cursor-pointer px-4 py-2 rounded-md",
                    trainerType === "internal"
                      ? "bg-secondary text-secondary-foreground"
                      : "hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  Internal
                </SelectItem>
                <SelectItem
                  value="external"
                  onClick={() => handleTrainerTypeChange("external")}
                  className={cn(
                    "cursor-pointer px-4 py-2 rounded-md",
                    trainerType === "external"
                      ? "bg-secondary text-secondary-foreground"
                      : "hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  External
                </SelectItem>
              </div>
            </div>
            {trainerType === "internal" ? (
              <FormField
                control={form.control}
                name="internalTrainerEmployeeId"
                render={() => (
                  <FormItem>
                    <FormLabel>Internal Trainer</FormLabel>
                    <FormControl>
                      <EmployeeSelector
                        employeeId={trainerEmployeeId || ""} 
                        setEmployeeId={handleTrainerEmployeeChange}
                        employees={employees}
                        placeholder="Selecione um instrutor interno"
                      />
                    </FormControl>
                    <FormDescription>Select the internal trainer for the training.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="externalTrainerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>External Trainer Name</FormLabel>
                      <FormControl>
                        <Input placeholder="External trainer name" {...field} />
                      </FormControl>
                      <FormDescription>Enter the name of the external trainer.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="externalTrainerContact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>External Trainer Contact</FormLabel>
                      <FormControl>
                        <Input placeholder="External trainer contact" {...field} />
                      </FormControl>
                      <FormDescription>Enter the contact information for the external trainer.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="targetAudience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Audience</FormLabel>
                    <FormControl>
                      <Input placeholder="Target audience" {...field} />
                    </FormControl>
                    <FormDescription>Specify the target audience for the training.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="trainingCategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Training Category</FormLabel>
                    <FormControl>
                      <Input placeholder="Training category" {...field} />
                    </FormControl>
                    <FormDescription>Enter the category for the training.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="isMandatory"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Is Mandatory</FormLabel>
                    <FormDescription>Check if the training is mandatory for all employees.</FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="planned">Planned</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Select the status of the training.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Create</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
