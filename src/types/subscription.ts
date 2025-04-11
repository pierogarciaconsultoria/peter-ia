
export type SubscriptionTier = 'free' | 'basic' | 'pro' | 'enterprise';

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  tier: SubscriptionTier;
  userLimit: number;
  storageLimit: number; // in GB
  customModules: boolean;
}

export interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}
