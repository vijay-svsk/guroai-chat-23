
import { useRef, useEffect } from "react";

export const useChatUI = () => {
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const focusTextarea = () => {
    const textarea = document.querySelector('textarea');
    if (textarea) {
      textarea.focus();
      // Place cursor at the end
      const length = textarea.value.length;
      textarea.setSelectionRange(length, length);
    }
  };

  return {
    chatEndRef,
    scrollToBottom,
    focusTextarea
  };
};
