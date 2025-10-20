import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from './api.service';
import {
  Chat,
  ChatListResponse,
  ChatResponse,
  SendMessageResponse
} from '../models/chat.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private readonly api = inject(ApiService);

  getChats(industry?: string): Observable<ChatListResponse> {
    const params = industry ? { industry } : undefined;

    return this.api.get<ChatListResponse>(
      '/chats',
      params
    );
  }

  createChat(
    industry: 'healthcare' | 'finance',
    title = 'New Conversation'
  ): Observable<ChatResponse> {
    return this.api.post<ChatResponse>(
      '/chats',
      {
        industry,
        title
      }
    );
  }

  getChat(chatId: string): Observable<ChatResponse> {
    return this.api.get<ChatResponse>(
      `/chats/${chatId}`
    );
  }

  sendMessage(
    chatId: string,
    question: string
  ): Observable<SendMessageResponse> {
    return this.api.post<SendMessageResponse>(
      `/chats/${chatId}/messages`,
      {
        question
      }
    );
  }
}