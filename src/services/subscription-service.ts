
import { supabase } from "@/integrations/supabase/client";

export const checkSubscriptionStatus = async (userId: string) => {
  const { data: subscription, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('Error checking subscription:', error);
    throw new Error('Unable to verify subscription status');
  }

  return subscription?.status === 'active';
};

export const createInitialSubscription = async (userId: string) => {
  const { error: subscriptionError } = await supabase
    .from('subscriptions')
    .insert({
      user_id: userId,
      status: 'expired',
      start_date: new Date().toISOString(),
    });

  if (subscriptionError) {
    console.error('Error creating subscription record:', subscriptionError);
    throw subscriptionError;
  }
};
