
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatSession {
  id: string;
  message: string;
  date: string;
}

export interface ApiKeyStorage {
  key: string;
  expiresAt: number;
}
