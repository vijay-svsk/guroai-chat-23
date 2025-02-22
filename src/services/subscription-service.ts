
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

  if (!subscription) {
    return false;
  }

  // Check if subscription has expired (more than 1 month since start_date)
  const endDate = new Date(subscription.end_date);
  const now = new Date();

  return subscription.status === 'active' && now < endDate;
};

export const getDaysRemaining = async (userId: string) => {
  const { data: subscription, error } = await supabase
    .from('subscriptions')
    .select('end_date')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error getting days remaining:', error);
    throw new Error('Unable to get subscription status');
  }

  if (!subscription) {
    return 0;
  }

  const endDate = new Date(subscription.end_date);
  const now = new Date();
  const diffTime = Math.max(0, endDate.getTime() - now.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
};

export const createInitialSubscription = async (userId: string) => {
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 30); // Set end date to 30 days from now

  const { error: subscriptionError } = await supabase
    .from('subscriptions')
    .insert({
      user_id: userId,
      status: 'active',
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
    });

  if (subscriptionError) {
    console.error('Error creating subscription record:', subscriptionError);
    throw subscriptionError;
  }
};

export const updateSubscription = async (userId: string) => {
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 30); // Set end date to 30 days from now

  const { error } = await supabase
    .from('subscriptions')
    .update({
      status: 'active',
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
    })
    .eq('user_id', userId);

  if (error) {
    console.error('Error updating subscription:', error);
    throw error;
  }
};
