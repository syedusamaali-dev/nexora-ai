import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../../core/services/chat.service';
import {
  Chat,
  ChatMessage,
  ChatSource
} from '../../../core/models/chat.model';
import { DatePipe , TitleCasePipe ,DecimalPipe } from '@angular/common';
@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule , DatePipe, TitleCasePipe, DecimalPipe],
  templateUrl: './chat.html',
  styleUrl: './chat.scss'
})
export class ChatComponent implements OnInit {
  private readonly chatService = inject(ChatService);

  chats: Chat[] = [];
  activeChat: Chat | null = null;

  selectedIndustry: 'healthcare' | 'finance' = 'healthcare';

  question = '';

  loadingChats = false;
  creatingChat = false;
  sendingMessage = false;

  errorMessage = '';

  ngOnInit(): void {
    this.loadChats();
  }

  loadChats(): void {
    this.loadingChats = true;
    this.errorMessage = '';

    this.chatService
      .getChats(this.selectedIndustry)
      .subscribe({
        next: (response) => {
          this.chats = response.data;

          if (this.chats.length > 0) {
            this.selectChat(this.chats[0]);
          }

          this.loadingChats = false;
        },
        error: (error) => {
          console.error('Failed to load chats:', error);

          this.errorMessage = 'Unable to load conversations.';
          this.loadingChats = false;
        }
      });
  }

  selectChat(chat: Chat): void {
    this.activeChat = chat;
  }

  createChat(): void {
    if (this.creatingChat) {
      return;
    }

    this.creatingChat = true;
    this.errorMessage = '';

    this.chatService
      .createChat(
        this.selectedIndustry,
        'New Conversation'
      )
      .subscribe({
        next: (response) => {
          this.activeChat = response.data;

          this.chats = [
            response.data,
            ...this.chats
          ];

          this.creatingChat = false;
        },
        error: (error) => {
          console.error('Failed to create chat:', error);

          this.errorMessage = 'Unable to create conversation.';
          this.creatingChat = false;
        }
      });
  }

  changeIndustry(): void {
    this.activeChat = null;
    this.loadChats();
  }

  sendMessage(): void {
    const question = this.question.trim();

    if (!question || this.sendingMessage) {
      return;
    }

    if (!this.activeChat) {
      this.createChat();

      return;
    }

    const userMessage: ChatMessage = {
      role: 'user',
      content: question,
      sources: []
    };

    this.activeChat = {
      ...this.activeChat,
      messages: [
        ...this.activeChat.messages,
        userMessage
      ]
    };

    this.question = '';
    this.sendingMessage = true;
    this.errorMessage = '';

    this.chatService
      .sendMessage(
        this.activeChat._id,
        question
      )
      .subscribe({
        next: (response) => {
          this.activeChat = response.data.chat;

          this.chats = this.chats.map(chat =>
            chat._id === this.activeChat?._id
              ? this.activeChat!
              : chat
          );

          this.sendingMessage = false;
        },
        error: (error) => {
          console.error('Failed to send message:', error);

          this.errorMessage =
            error?.error?.message ||
            'Unable to get an AI response.';

          this.sendingMessage = false;
        }
      });
  }

  trackByChatId(
    _index: number,
    chat: Chat
  ): string {
    return chat._id;
  }

  trackByMessage(
    index: number,
    _message: ChatMessage
  ): number {
    return index;
  }

  trackBySource(
    index: number,
    _source: ChatSource
  ): number {
    return index;
  }
  handleEnter(event: Event): void {
  const keyboardEvent = event as KeyboardEvent;

  // Shift + Enter = new line
  if (keyboardEvent.shiftKey) {
    return;
  }

  // Enter = send message
  keyboardEvent.preventDefault();
  this.sendMessage();
}
}