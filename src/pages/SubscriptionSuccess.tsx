
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { CheckCircle, Loader2 } from "lucide-react";
import { subscriptionPlans } from "@/utils/subscriptionPlans";
import { supabase } from "@/integrations/supabase/client";
import { SubscriptionPlan } from "@/types/subscription";
import { toast } from "sonner";

export default function SubscriptionSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<SubscriptionPlan | null>(null);
  
  const sessionId = searchParams.get('session_id');
  const planId = searchParams.get('plan');
  
  useEffect(() => {
    const getSubscriptionDetails = async () => {
      setLoading(true);
      
      try {
        if (planId === 'free') {
          // Handle free plan
          const freePlan = subscriptionPlans.find(p => p.id === 'free');
          if (freePlan) {
            setPlan(freePlan);
          }
          setLoading(false);
          return;
        }
        
        if (!sessionId) {
          navigate('/pricing');
          return;
        }
        
        // Verify session with Stripe
        const { data, error } = await supabase.functions.invoke('verify-session', {
          body: { session_id: sessionId }
        });
        
        if (error) {
          console.error("Error verifying session:", error);
          toast.error("Failed to verify subscription. Please contact support.");
          navigate('/pricing');
          return;
        }
        
        // Find the plan details
        const subscribedPlan = subscriptionPlans.find(p => p.id === data.plan);
        if (subscribedPlan) {
          setPlan(subscribedPlan);
        }
      } catch (error) {
        console.error("Error processing subscription:", error);
        toast.error("Error processing subscription. Please contact support.");
      } finally {
        setLoading(false);
      }
    };
    
    getSubscriptionDetails();
  }, [sessionId, planId, navigate]);
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <main className="flex-1 p-8 pt-24 md:pt-16 md:pl-64">
        <div className="max-w-xl mx-auto">
          {loading ? (
            <Card className="w-full">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <Loader2 className="h-16 w-16 text-primary animate-spin mb-4" />
                <p className="text-lg">Verifying your subscription...</p>
              </CardContent>
            </Card>
          ) : plan ? (
            <Card className="w-full">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 bg-green-100 p-3 rounded-full">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
                <CardTitle className="text-2xl">Subscription Successful!</CardTitle>
                <CardDescription>
                  Thank you for subscribing to the {plan.name} plan
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="border rounded-lg p-4 bg-muted/30">
                  <h3 className="font-medium mb-2">Plan Details</h3>
                  <p><strong>Plan:</strong> {plan.name}</p>
                  <p><strong>Price:</strong> ${plan.price}/month</p>
                  <p><strong>User Limit:</strong> {plan.userLimit === Infinity ? 'Unlimited' : plan.userLimit}</p>
                  <p><strong>Storage:</strong> {plan.storageLimit === Infinity ? 'Unlimited' : `${plan.storageLimit}GB`}</p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Included Features:</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {plan.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
              
              <CardFooter className="flex flex-col space-y-4">
                <Button onClick={() => navigate("/")} className="w-full">
                  Go to Dashboard
                </Button>
                <Button variant="outline" onClick={() => navigate("/settings/billing")} className="w-full">
                  Manage Subscription
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card className="w-full">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <p className="text-lg text-red-600">Subscription information not found.</p>
                <Button onClick={() => navigate('/pricing')} className="mt-4">
                  Return to Pricing
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
