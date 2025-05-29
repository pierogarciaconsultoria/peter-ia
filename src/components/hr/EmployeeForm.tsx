
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { PersonalInfoTab } from "./employee-form/PersonalInfoTab";
import { DocumentsTab } from "./employee-form/DocumentsTab";
import { JobInfoTab } from "./employee-form/JobInfoTab";
import { AdditionalInfoTab } from "./employee-form/AdditionalInfoTab";
import { FamilyInfoTab } from "./employee-form/FamilyInfoTab";
import { EmployeeFormHeader } from "./employee-form/components/EmployeeFormHeader";
import { EmployeeFormActions } from "./employee-form/components/EmployeeFormActions";
import { useEmployeeForm } from "./employee-form/hooks/useEmployeeForm";

interface EmployeeFormProps {
  onCancel: () => void;
}

export function EmployeeForm({ onCancel }: EmployeeFormProps) {
  const {
    formData,
    setFormData,
    documents,
    setDocuments,
    photoPreview,
    setPhotoPreview,
    selectedJobPosition,
    setSelectedJobPosition,
    isSubmitting,
    handleSubmit
  } = useEmployeeForm(onCancel);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="personal" className="w-full">
        <EmployeeFormHeader />
        
        <TabsContent value="personal" className="pt-4">
          <PersonalInfoTab 
            formData={formData} 
            setFormData={setFormData} 
            photoPreview={photoPreview}
            setPhotoPreview={setPhotoPreview}
          />
        </TabsContent>
        
        <TabsContent value="documents" className="pt-4">
          <DocumentsTab 
            formData={formData} 
            setFormData={setFormData}
            documents={documents}
            setDocuments={setDocuments}
          />
        </TabsContent>
        
        <TabsContent value="job" className="pt-4">
          <JobInfoTab 
            formData={formData} 
            setFormData={setFormData}
            selectedJobPosition={selectedJobPosition}
            setSelectedJobPosition={setSelectedJobPosition}
          />
        </TabsContent>
        
        <TabsContent value="additional" className="pt-4">
          <AdditionalInfoTab 
            formData={formData} 
            setFormData={setFormData} 
          />
        </TabsContent>
        
        <TabsContent value="family" className="pt-4">
          <FamilyInfoTab 
            formData={formData} 
            setFormData={setFormData} 
          />
        </TabsContent>
      </Tabs>
      
      <EmployeeFormActions
        onCancel={onCancel}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
