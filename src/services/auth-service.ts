
import { supabase } from "@/integrations/supabase/client";
import { getDeviceId } from "@/utils/device-utils";

// Create a cleanup function to ensure no chat auth data interferes with main auth
const cleanupChatAuth = () => {
  localStorage.removeItem("guro_chat_auth");
};

export const loginUser = async (email: string, password: string) => {
  // Ensure we're not mixing up auth sessions
  cleanupChatAuth();
  
  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.log("Login error:", error.message);
    throw error;
  }

  console.log("Login successful:", data.user?.id);
  return data;
};

export const signUpUser = async (email: string, password: string) => {
  // Ensure we're not mixing up auth sessions
  cleanupChatAuth();
  
  const { error, data } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.log("Signup error:", error.message);
    throw error;
  }

  if (data.user) {
    // Register the device
    try {
      await supabase
        .from('user_devices')
        .insert({
          user_id: data.user.id,
          device_id: getDeviceId(),
        });
      console.log("Device registered for user:", data.user.id);
    } catch (deviceError) {
      console.error("Failed to register device:", deviceError);
    }
  }

  return data;
};

export const getCurrentUser = async () => {
  const { data } = await supabase.auth.getUser();
  return data.user;
};

export const logoutUser = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.log("Logout error:", error.message);
    throw error;
  }
  return true;
};
