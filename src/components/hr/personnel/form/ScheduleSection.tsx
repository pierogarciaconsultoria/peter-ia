
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormSectionProps } from "./types";

export function ScheduleSection({ form }: FormSectionProps) {
  return (
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
  );
}
