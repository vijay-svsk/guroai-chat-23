
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

export const useChatAuth = () => {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Instead of checking for authentication, assign a temporary anonymous ID
    // either from localStorage or create a new one
    const storedId = localStorage.getItem("anonymous_chat_id");
    if (storedId) {
      setUserId(storedId);
    } else {
      const newId = uuidv4();
      localStorage.setItem("anonymous_chat_id", newId);
      setUserId(newId);
    }
  }, []);

  return { userId };
};
