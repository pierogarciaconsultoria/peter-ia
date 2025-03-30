
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { SwotItem } from "@/types/strategic-planning";
import { getSwotItems } from "@/services/strategicPlanningService";
import { SwotItemCard } from "./SwotItemCard";
import { SwotItemForm } from "./SwotItemForm";

export function SwotAnalysis() {
  const [swotItems, setSwotItems] = useState<SwotItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'strengths' | 'weaknesses' | 'opportunities' | 'threats'>('strengths');

  const fetchSwotItems = async () => {
    setLoading(true);
    try {
      const items = await getSwotItems();
      setSwotItems(items);
    } catch (error) {
      console.error("Error fetching SWOT items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSwotItems();
  }, []);

  const handleItemAdded = () => {
    fetchSwotItems();
    setShowForm(false);
  };

  const filteredItems = (category: 'strength' | 'weakness' | 'opportunity' | 'threat') => {
    return swotItems.filter(item => item.category === category);
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold">Análise SWOT</CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-1"
          >
            {showForm ? "Cancelar" : "Adicionar Item"}
            {!showForm && <PlusCircle size={16} className="ml-1" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {showForm && (
          <div className="mb-6">
            <SwotItemForm onItemAdded={handleItemAdded} onCancel={() => setShowForm(false)} />
          </div>
        )}

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="strengths">Forças</TabsTrigger>
            <TabsTrigger value="weaknesses">Fraquezas</TabsTrigger>
            <TabsTrigger value="opportunities">Oportunidades</TabsTrigger>
            <TabsTrigger value="threats">Ameaças</TabsTrigger>
          </TabsList>
          
          <TabsContent value="strengths">
            <div className="grid gap-3 mt-4">
              {loading ? (
                <p className="text-center text-muted-foreground py-8">Carregando...</p>
              ) : filteredItems('strength').length > 0 ? (
                filteredItems('strength').map(item => (
                  <SwotItemCard 
                    key={item.id} 
                    item={item} 
                    onUpdated={fetchSwotItems} 
                    onDeleted={fetchSwotItems}
                  />
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  Nenhuma Força cadastrada. Clique em "Adicionar Item" para começar.
                </p>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="weaknesses">
            <div className="grid gap-3 mt-4">
              {loading ? (
                <p className="text-center text-muted-foreground py-8">Carregando...</p>
              ) : filteredItems('weakness').length > 0 ? (
                filteredItems('weakness').map(item => (
                  <SwotItemCard 
                    key={item.id} 
                    item={item} 
                    onUpdated={fetchSwotItems} 
                    onDeleted={fetchSwotItems}
                  />
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  Nenhuma Fraqueza cadastrada. Clique em "Adicionar Item" para começar.
                </p>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="opportunities">
            <div className="grid gap-3 mt-4">
              {loading ? (
                <p className="text-center text-muted-foreground py-8">Carregando...</p>
              ) : filteredItems('opportunity').length > 0 ? (
                filteredItems('opportunity').map(item => (
                  <SwotItemCard 
                    key={item.id} 
                    item={item} 
                    onUpdated={fetchSwotItems} 
                    onDeleted={fetchSwotItems}
                  />
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  Nenhuma Oportunidade cadastrada. Clique em "Adicionar Item" para começar.
                </p>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="threats">
            <div className="grid gap-3 mt-4">
              {loading ? (
                <p className="text-center text-muted-foreground py-8">Carregando...</p>
              ) : filteredItems('threat').length > 0 ? (
                filteredItems('threat').map(item => (
                  <SwotItemCard 
                    key={item.id} 
                    item={item} 
                    onUpdated={fetchSwotItems} 
                    onDeleted={fetchSwotItems}
                  />
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  Nenhuma Ameaça cadastrada. Clique em "Adicionar Item" para começar.
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
