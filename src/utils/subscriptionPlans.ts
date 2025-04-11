
import { SubscriptionPlan } from "@/types/subscription";

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: "free",
    name: "Free",
    description: "For small teams just getting started",
    price: 0,
    tier: "free",
    features: [
      "Basic ISO 9001 Requirements",
      "5 users included",
      "500MB storage",
      "Basic support",
    ],
    userLimit: 5,
    storageLimit: 0.5,
    customModules: false,
  },
  {
    id: "basic",
    name: "Basic",
    description: "For growing teams with more advanced needs",
    price: 29,
    tier: "basic",
    features: [
      "All ISO 9001 Requirements",
      "20 users included",
      "5GB storage",
      "Priority email support",
      "Document Management",
      "Process Mapping"
    ],
    userLimit: 20,
    storageLimit: 5,
    customModules: false,
  },
  {
    id: "pro",
    name: "Professional",
    description: "For organizations seeking full compliance",
    price: 99,
    tier: "pro",
    features: [
      "All ISO 9001 Requirements",
      "Unlimited users",
      "50GB storage",
      "Priority email & phone support",
      "Advanced Analytics",
      "Risk Management",
      "Audit Management",
      "Custom Dashboards"
    ],
    userLimit: 100,
    storageLimit: 50,
    customModules: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For large organizations with complex needs",
    price: 299,
    tier: "enterprise",
    features: [
      "All Pro features",
      "Unlimited storage",
      "Unlimited users",
      "Dedicated support",
      "Custom integrations",
      "SLA guarantee",
      "Custom onboarding"
    ],
    userLimit: Infinity,
    storageLimit: Infinity,
    customModules: true,
  }
];

export const getSubscriptionPlan = (id: string): SubscriptionPlan | undefined => {
  return subscriptionPlans.find(plan => plan.id === id);
};
