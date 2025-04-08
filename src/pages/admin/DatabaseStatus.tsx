
import { useState } from "react";
import { DatabaseConnectionStatus } from "@/components/admin/DatabaseConnectionStatus";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { setupDatabaseHelpers } from "@/utils/databaseHelpers";

export default function DatabaseStatusPage() {
  const [setupStatus, setSetupStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  
  const initializeHelpers = async () => {
    setSetupStatus('loading');
    try {
      const result = await setupDatabaseHelpers();
      setSetupStatus(result ? 'success' : 'error');
    } catch (error) {
      console.error("Error initializing helpers:", error);
      setSetupStatus('error');
    }
  };
  
  return (
    <div className="container mx-auto p-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Database Management</h1>
      
      <Tabs defaultValue="status" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="status">Connection Status</TabsTrigger>
          <TabsTrigger value="tools">Database Tools</TabsTrigger>
        </TabsList>
        
        <TabsContent value="status" className="space-y-4">
          <DatabaseConnectionStatus />
        </TabsContent>
        
        <TabsContent value="tools" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Database Helper Functions</CardTitle>
              <CardDescription>
                Set up helper functions to diagnose database issues
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={initializeHelpers}
                disabled={setupStatus === 'loading'}
              >
                {setupStatus === 'loading' ? 'Setting up...' : 'Initialize Helpers'}
              </Button>
              
              {setupStatus === 'success' && (
                <p className="text-green-600 mt-2">
                  Helper functions initialized successfully!
                </p>
              )}
              
              {setupStatus === 'error' && (
                <p className="text-red-600 mt-2">
                  Failed to initialize helper functions. Check console for details.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
