
import { useLocation } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

interface PlaceholderPageProps {
  title: string;
  icon?: React.ReactNode;
  description?: string;
}

export function PlaceholderPage({ title, icon, description }: PlaceholderPageProps) {
  const location = useLocation();
  const pathName = location.pathname.substring(1); // Remove leading slash
  const pageName = title || pathName.charAt(0).toUpperCase() + pathName.slice(1).replace(/-/g, ' ');
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <main className="flex-1 p-8 pt-24 md:pt-16 md:pl-64">
        <div className="max-w-7xl mx-auto space-y-8">
          <Card className="border-2 border-dashed">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                {icon || <FileText className="mr-2 h-6 w-6 text-primary" />}
                {pageName}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {description || `Esta é a página de ${pageName}. Conteúdo em desenvolvimento.`}
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
