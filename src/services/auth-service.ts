
import { supabase } from "@/integrations/supabase/client";
import { getDeviceId } from "@/utils/device-utils";

export const loginUser = async (email: string, password: string) => {
  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data;
};

export const signUpUser = async (email: string, password: string) => {
  const { error, data } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  if (data.user) {
    // Register the device
    await supabase
      .from('user_devices')
      .insert({
        user_id: data.user.id,
        device_id: getDeviceId(),
      });
  }

  return data;
};
