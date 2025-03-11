
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const { email, user_id } = await req.json();

    if (!email && !user_id) {
      throw new Error('Email or user_id is required');
    }

    // Create a subscription record for callback verification
    let userId = user_id;
    
    // If we only have email, check if user exists
    if (!userId && email) {
      // Check if user exists
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .maybeSingle();
      
      if (userError) {
        throw userError;
      }
      
      if (userData) {
        userId = userData.id;
      }
    }
    
    if (userId) {
      // Check if subscription already exists
      const { data: existingSubscription } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
      
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 30); // 30 days subscription
      
      if (existingSubscription) {
        // Update existing subscription
        await supabase
          .from('subscriptions')
          .update({
            status: 'active',
            start_date: startDate.toISOString(),
            end_date: endDate.toISOString(),
          })
          .eq('user_id', userId);
      } else {
        // Create new subscription
        await supabase
          .from('subscriptions')
          .insert({
            user_id: userId,
            status: 'active',
            start_date: startDate.toISOString(),
            end_date: endDate.toISOString(),
          });
      }
    }

    // Generate a redirect URL to Xendit checkout
    // Use the actual Xendit checkout URL
    const xenditCheckoutUrl = 'https://checkout.xendit.co/od/guroai.online';
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        checkoutUrl: xenditCheckoutUrl
      }),
      {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 500,
      },
    )
  }
})
