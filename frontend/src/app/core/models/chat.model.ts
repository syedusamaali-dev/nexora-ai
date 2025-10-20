export interface ChatSource {
  documentId: string;
  documentName: string;
  page: number | null;
  chunkIndex?: number;
  score?: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  sources?: ChatSource[];
}

export interface Chat {
  _id: string;
  title: string;
  industry: 'healthcare' | 'finance';
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface ChatListResponse {
  success: boolean;
  data: Chat[];
}

export interface ChatResponse {
  success: boolean;
  data: Chat;
}

export interface SendMessageResponse {
  success: boolean;
  data: {
    answer: string;
    sources: ChatSource[];
    chat: Chat;
  };
}