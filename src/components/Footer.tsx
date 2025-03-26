
import { ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="app-footer">
      <div className="md:pl-64 max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <span>© {new Date().getFullYear()} Gestão</span>
        </div>
        <div className="flex items-center gap-4">
          <a 
            href="https://www.pierogarcia.com.br" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-primary transition-colors"
          >
            www.pierogarcia.com.br
            <ExternalLink size={14} />
          </a>
          <a 
            href="https://www.instagram.com/pierogarciaconsultoria" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-primary transition-colors"
          >
            @pierogarciaconsultoria
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </footer>
  );
}
