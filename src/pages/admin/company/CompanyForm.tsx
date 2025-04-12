
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { subscriptionPlans } from "@/utils/subscriptionPlans";

interface CompanyFormProps {
  formData: {
    name: string;
    slug: string;
    cnpj: string;
    plan: string;
  };
  onChange: (newFormData: any) => void;
  mode: 'add' | 'edit';
}

export function CompanyForm({ formData, onChange, mode }: CompanyFormProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor={`${mode}-company-name`}>Company Name</Label>
        <Input
          id={`${mode}-company-name`}
          value={formData.name}
          onChange={(e) => onChange({ ...formData, name: e.target.value })}
          placeholder="Enter company name"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor={`${mode}-company-slug`}>Slug (URL identifier)</Label>
        <Input
          id={`${mode}-company-slug`}
          value={formData.slug}
          onChange={(e) => onChange({ ...formData, slug: e.target.value })}
          placeholder="company-slug (or leave empty to auto-generate)"
        />
        {mode === 'add' && (
          <p className="text-xs text-muted-foreground">
            Leave empty to auto-generate from the company name
          </p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor={`${mode}-company-cnpj`}>CNPJ (optional)</Label>
        <Input
          id={`${mode}-company-cnpj`}
          value={formData.cnpj}
          onChange={(e) => onChange({ ...formData, cnpj: e.target.value })}
          placeholder="Enter CNPJ if available"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor={`${mode}-company-plan`}>Subscription Plan</Label>
        <Select
          value={formData.plan}
          onValueChange={(value) => onChange({ ...formData, plan: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select plan" />
          </SelectTrigger>
          <SelectContent>
            {subscriptionPlans.map((plan) => (
              <SelectItem key={plan.id} value={plan.id}>
                {plan.name} (${plan.price}/month)
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
