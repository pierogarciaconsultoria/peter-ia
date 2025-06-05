
import { Button } from "@/components/ui/button";
import { ISORequirement } from "@/utils/isoRequirements";
import { Download, FileText, Edit, Save } from "lucide-react";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { getTemplateContentForRequirement } from "@/utils/isoTemplates";

interface DocumentTemplateProps {
  requirement: ISORequirement;
}

export function DocumentTemplate({ requirement }: DocumentTemplateProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [templateContent, setTemplateContent] = useState(getTemplateContentForRequirement(requirement.number));
  const [isSaving, setIsSaving] = useState(false);

  const handleDownloadTemplate = () => {
    console.log(`Downloading template for requirement ${requirement.number}`);
    toast.info(`Template para ${requirement.number} - ${requirement.title} será baixado em breve`);
  };

  const handleSaveTemplate = async () => {
    try {
      setIsSaving(true);
      
      // For now, just simulate saving since database table doesn't exist
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Template salvo com sucesso (funcionalidade será ativada após configuração do banco)');
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error('Erro ao salvar o template');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mt-4">
      <div className="border rounded-lg p-6 bg-white">
        {/* Header with logo and requirement title */}
        <div className="flex items-center justify-between border-b pb-4 mb-4">
          <div>
            <img 
              src="/lovable-uploads/16051b9e-cfae-479a-8e59-7b089b005ce7.png" 
              alt="Piero Garcia Logo" 
              className="h-16 object-contain"
            />
          </div>
          <div className="text-right">
            <h3 className="font-semibold text-lg">{requirement.number}</h3>
            <h2 className="font-bold text-xl">{requirement.title}</h2>
          </div>
        </div>
        
        {/* Template content */}
        <div className="min-h-[400px] border-dashed border p-4 rounded-lg mb-4">
          {isEditing ? (
            <Textarea
              value={templateContent}
              onChange={(e) => setTemplateContent(e.target.value)}
              className="w-full h-[400px] font-mono text-sm"
              placeholder="Edite o conteúdo do template..."
            />
          ) : (
            <>
              <h3 className="font-medium text-lg mb-2">Formulário para {requirement.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Este formulário atende às exigências do requisito {requirement.number} da ISO 9001:2015
              </p>
              
              <div className="space-y-4">
                <div className="border-b pb-2">
                  <p className="text-sm font-medium">Descrição do Propósito:</p>
                  <p className="text-sm text-muted-foreground">{requirement.description}</p>
                </div>
                
                <div className="whitespace-pre-wrap text-sm">
                  {templateContent}
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* Footer with contact information */}
        <div className="border-t pt-4 flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
          <div className="space-y-1 text-center sm:text-left mb-2 sm:mb-0">
            <p>www.pierogarcia.com.br</p>
            <p>contato@pierogarcia.com.br</p>
            <p>@pierogarciaconsultoria</p>
          </div>
          <div className="flex space-x-2">
            {isEditing ? (
              <Button onClick={handleSaveTemplate} disabled={isSaving}>
                <Save size={16} className="mr-2" />
                {isSaving ? 'Salvando...' : 'Salvar Template'}
              </Button>
            ) : (
              <>
                <Button onClick={handleDownloadTemplate} variant="outline">
                  <Download size={16} className="mr-2" />
                  Baixar Template
                </Button>
                <Button onClick={() => setIsEditing(true)}>
                  <Edit size={16} className="mr-2" />
                  Editar Template
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
