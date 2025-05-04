
import React, { useState } from 'react';
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Task } from "@/types/tasks";
import { useQuery } from '@tanstack/react-query';

// This is a placeholder component that shows a basic tasks page
export default function Tasks() {
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock query that doesn't actually call a backend
  const { data: tasks = [] } = useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: async () => {
      // This is just a placeholder that returns an empty array
      // In a real app, you'd fetch tasks from a backend
      return [];
    }
  });
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className="md:pl-64 p-6 transition-all duration-300 flex-1">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Tarefas</h1>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-yellow-500" />
                  Pendentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">0</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center">
                  <CheckCircle2 className="mr-2 h-5 w-5 text-green-500" />
                  Concluídas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">0</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center">
                  <AlertCircle className="mr-2 h-5 w-5 text-red-500" />
                  Atrasadas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">0</p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Gerenciamento de Tarefas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Bem-vindo ao módulo de tarefas. Aqui você poderá gerenciar todas as tarefas do sistema.
              </p>
              
              <div>
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
