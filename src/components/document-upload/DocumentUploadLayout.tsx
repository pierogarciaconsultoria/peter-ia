
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

interface DocumentUploadLayoutProps {
  children: React.ReactNode;
}

export const DocumentUploadLayout = ({ children }: DocumentUploadLayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className="md:pl-64 p-6 transition-all duration-300 flex-1">
        <div className="max-w-3xl mx-auto pt-6 pb-12">
          {children}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};
