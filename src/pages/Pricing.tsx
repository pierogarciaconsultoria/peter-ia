
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { subscriptionPlans } from "@/utils/subscriptionPlans";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useState } from "react";
import { UserSubscription } from "@/types/subscription";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function Pricing() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  
  const handleSubscribe = async (planId: string) => {
    if (!user) {
      navigate("/auth", { state: { from: "/pricing" } });
      return;
    }
    
    setLoading(prev => ({ ...prev, [planId]: true }));
    
    try {
      // Call the Stripe checkout function
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { planId }
      });
      
      if (error) throw error;
      
      // Redirect to Stripe checkout
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Error subscribing to plan:", error);
      toast.error("Failed to process subscription. Please try again.");
    } finally {
      setLoading(prev => ({ ...prev, [planId]: false }));
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <main className="flex-1 p-8 pt-24 md:pt-16 md:pl-64">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold">Pricing Plans</h1>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Choose the perfect plan for your organization's ISO management needs.
              All plans include core ISO 9001 functionality.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {subscriptionPlans.map((plan) => (
              <Card key={plan.id} className={`flex flex-col border ${plan.tier === 'pro' ? 'border-primary shadow-md' : ''}`}>
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="mb-4">
                    <span className="text-3xl font-bold">${plan.price}</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={() => handleSubscribe(plan.id)} 
                    className="w-full" 
                    disabled={loading[plan.id]}
                    variant={plan.tier === 'pro' ? 'default' : 'outline'}
                  >
                    {loading[plan.id] ? "Processing..." : (plan.price === 0 ? "Start Free" : "Subscribe")}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="bg-muted p-6 rounded-lg mt-12">
            <h2 className="text-xl font-semibold mb-4">Enterprise Solutions</h2>
            <p className="text-muted-foreground mb-4">
              Need a custom solution for your organization? We offer tailored enterprise packages
              to meet your specific requirements.
            </p>
            <Button onClick={() => navigate("/contact")} variant="outline">
              Contact Sales
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
