import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from './api.service';

import {
  Chat,
  ChatListResponse,
  ChatResponse,
  SendMessageResponse,
  DocumentUploadResponse
} from '../models/chat.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private readonly api = inject(ApiService);

  getChats(
    industry?: string
  ): Observable<ChatListResponse> {

    const params = industry
      ? { industry }
      : undefined;

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

  getChat(
    chatId: string
  ): Observable<ChatResponse> {

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

  uploadDocument(
    file: File,
    industry: 'healthcare' | 'finance',
    category: string
  ): Observable<DocumentUploadResponse> {

    const formData = new FormData();

    formData.append('file', file);
    formData.append('industry', industry);
    formData.append('category', category);

    return this.api.upload<DocumentUploadResponse>(
      '/documents',
      formData
    );
  }

  deleteChat(
    chatId: string
  ): Observable<{ success: boolean; message?: string }> {

    return this.api.delete<{
      success: boolean;
      message?: string;
    }>(
      `/chats/${chatId}`
    );
  }
}