
import React, { useState } from 'react';
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// This is a placeholder component to ensure the page renders without error
export default function Tasks() {
  const [isLoading, setIsLoading] = useState(false);
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className="md:pl-64 p-6 transition-all duration-300 flex-1">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Tarefas</h1>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Gerenciamento de Tarefas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Bem-vindo ao módulo de tarefas. Aqui você poderá gerenciar todas as tarefas do sistema.
              </p>
              
              <div className="mt-4">
                <Button disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Nova Tarefa
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
