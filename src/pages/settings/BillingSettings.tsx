import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/custom-badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, CheckCircle, AlertTriangle, CreditCard } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { subscriptionPlans } from "@/utils/subscriptionPlans";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

export default function BillingSettings() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [manageBillingLoading, setManageBillingLoading] = useState(false);
  const [subscription, setSubscription] = useState<any>(null);
  const [company, setCompany] = useState<any>(null);
  
  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    
    fetchSubscriptionDetails();
  }, [user, navigate]);
  
  const fetchSubscriptionDetails = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.functions.invoke('check-subscription');
      
      if (error) throw error;
      
      setSubscription(data.subscription);
      setCompany(data.company);
    } catch (error) {
      console.error("Error fetching subscription details:", error);
      toast.error("Failed to load subscription information");
    } finally {
      setLoading(false);
    }
  };
  
  const handleManageBilling = async () => {
    if (!user || !company) return;
    
    try {
      setManageBillingLoading(true);
      
      const { data, error } = await supabase.functions.invoke('create-billing-portal', {
        body: { return_url: window.location.href }
      });
      
      if (error) throw error;
      
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No portal URL returned");
      }
    } catch (error) {
      console.error("Error opening billing portal:", error);
      toast.error("Failed to access billing portal. Please try again.");
    } finally {
      setManageBillingLoading(false);
    }
  };
  
  const handleUpgrade = () => {
    navigate("/pricing");
  };
  
  const getSubscriptionPlanDetails = () => {
    if (!subscription) return null;
    return subscriptionPlans.find(plan => plan.id === subscription.plan);
  };
  
  const planDetails = getSubscriptionPlanDetails();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Billing & Subscription</h1>
      </div>
      
      {loading ? (
        <Card>
          <CardContent className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>
                Your current subscription plan and status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {subscription && planDetails ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold">{planDetails.name} Plan</h3>
                      <p className="text-muted-foreground">{planDetails.description}</p>
                    </div>
                    <Badge variant={subscription.status === 'active' ? 'success' : 'destructive'}>
                      {subscription.status === 'active' ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  
                  <div className="border rounded-lg p-4 bg-muted/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Price</span>
                      <span className="font-medium">${planDetails.price}/month</span>
                    </div>
                    
                    {subscription.current_period_end && (
                      <div className="flex items-center justify-between">
                        <span>Current period ends</span>
                        <span className="font-medium">
                          {new Date(subscription.current_period_end).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    
                    {subscription.cancel_at_period_end && (
                      <div className="flex items-start gap-2 p-2 bg-orange-50 text-orange-700 rounded-md">
                        <AlertTriangle className="h-5 w-5 shrink-0" />
                        <p className="text-sm">
                          Your subscription will be canceled at the end of the current billing period.
                        </p>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <span>User limit</span>
                      <span className="font-medium">
                        {planDetails.userLimit === Infinity ? 'Unlimited' : planDetails.userLimit}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span>Storage</span>
                      <span className="font-medium">
                        {planDetails.storageLimit === Infinity ? 'Unlimited' : `${planDetails.storageLimit}GB`}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Features included:</h4>
                    <ul className="space-y-1">
                      {planDetails.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p>No subscription information available</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
              {subscription?.plan !== 'enterprise' && (
                <Button onClick={handleUpgrade} className="w-full sm:w-auto">
                  Upgrade Plan
                </Button>
              )}
              
              {subscription?.status === 'active' && subscription?.plan !== 'free' && (
                <Button 
                  variant="outline" 
                  onClick={handleManageBilling} 
                  disabled={manageBillingLoading}
                  className="w-full sm:w-auto"
                >
                  {manageBillingLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <CreditCard className="mr-2 h-4 w-4" />
                  Manage Billing
                </Button>
              )}
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>
                View your past invoices and payment history
              </CardDescription>
            </CardHeader>
            <CardContent>
              {subscription?.plan === 'free' ? (
                <p className="text-muted-foreground">
                  You are currently on the Free plan. Upgrade to a paid plan to view billing history.
                </p>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    To view your complete billing history, please access the billing portal.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={handleManageBilling} 
                    disabled={manageBillingLoading}
                    className="mt-4"
                  >
                    {manageBillingLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Access Billing Portal
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          {isAdmin && (
            <Card>
              <CardHeader>
                <CardTitle>Usage Statistics</CardTitle>
                <CardDescription>
                  Monitor your company's resource usage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Users</h3>
                    <div className="bg-muted h-4 rounded-full overflow-hidden">
                      <div 
                        className="bg-primary h-full rounded-full"
                        style={{ 
                          width: `${Math.min(100, (company?.user_count || 0) / (planDetails?.userLimit || 1) * 100)}%` 
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span>{company?.user_count || 0} used</span>
                      <span>{planDetails?.userLimit === Infinity ? 'Unlimited' : planDetails?.userLimit} total</span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Storage</h3>
                    <div className="bg-muted h-4 rounded-full overflow-hidden">
                      <div 
                        className="bg-primary h-full rounded-full"
                        style={{ 
                          width: `${Math.min(100, (company?.storage_used || 0) / (planDetails?.storageLimit || 1) * 100)}%` 
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span>{company?.storage_used || 0}GB used</span>
                      <span>{planDetails?.storageLimit === Infinity ? 'Unlimited' : `${planDetails?.storageLimit}GB`} total</span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium mb-2">Active Modules</h3>
                    <div className="flex flex-wrap gap-2">
                      {company?.active_modules?.map((module: string) => (
                        <Badge key={module} variant="secondary">
                          {module.charAt(0).toUpperCase() + module.slice(1)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
