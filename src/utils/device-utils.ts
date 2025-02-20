
import { supabase } from "@/integrations/supabase/client";

export const getDeviceId = () => {
  let deviceId = localStorage.getItem('device_id');
  if (!deviceId) {
    deviceId = crypto.randomUUID();
    localStorage.setItem('device_id', deviceId);
  }
  return deviceId;
};

export const checkDeviceAuthorization = async (userId: string) => {
  const currentDeviceId = getDeviceId();
  
  // Check if this device is already registered
  const { data: existingDevice } = await supabase
    .from('user_devices')
    .select('device_id')
    .eq('user_id', userId)
    .eq('device_id', currentDeviceId)
    .single();

  if (existingDevice) {
    return true;
  }

  // Count existing devices
  const { data: devices } = await supabase
    .from('user_devices')
    .select('device_id')
    .eq('user_id', userId);

  // If user has less than 3 devices, register this one
  if (devices && devices.length < 3) {
    await supabase
      .from('user_devices')
      .insert({
        user_id: userId,
        device_id: currentDeviceId
      });
    return true;
  }

  return false;
};
