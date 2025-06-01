
import React from 'react';
import { IntelligentAnalysis } from '@/components/company/IntelligentAnalysis';
import { AuthenticationRequired } from '@/components/auth/AuthenticationRequired';

const IntelligentAnalysisPage = () => {
  return (
    <AuthenticationRequired>
      <div className="min-h-screen bg-background w-full">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Análise Inteligente da Empresa</h1>
            <p className="text-muted-foreground mt-2">
              Descreva sua empresa e receba sugestões personalizadas de planejamento estratégico, ISO 9001 e indicadores de performance.
            </p>
          </div>
          
          <IntelligentAnalysis />
        </div>
      </div>
    </AuthenticationRequired>
  );
};

export default IntelligentAnalysisPage;
