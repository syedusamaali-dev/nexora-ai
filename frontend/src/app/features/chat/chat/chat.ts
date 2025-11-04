import {
  ChangeDetectorRef,
  Component,
  OnInit,
  inject
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import {
  DatePipe,
  DecimalPipe,
  TitleCasePipe
} from '@angular/common';

import { ChatService } from '../../../core/services/chat.service';

import {
  Chat,
  ChatMessage,
  ChatSource
} from '../../../core/models/chat.model';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    FormsModule,
    DatePipe,
    TitleCasePipe,
    DecimalPipe
  ],
  templateUrl: './chat.html',
  styleUrl: './chat.scss'
})
export class ChatComponent implements OnInit {

  private readonly chatService = inject(ChatService);
  private readonly cdr = inject(ChangeDetectorRef);

  chats: Chat[] = [];

  activeChat: Chat | null = null;

  selectedIndustry: 'healthcare' | 'finance' = 'healthcare';

  question = '';

  loadingChats = false;
  creatingChat = false;
  sendingMessage = false;

  errorMessage = '';

  // =========================================================
  // INIT
  // =========================================================

  ngOnInit(): void {
    this.loadChats();
  }

  // =========================================================
  // LOAD CHATS
  // =========================================================

  loadChats(): void {

    this.loadingChats = true;
    this.errorMessage = '';

    console.log(
      '🔵 Loading chats for:',
      this.selectedIndustry
    );

    this.chatService
      .getChats(this.selectedIndustry)
      .subscribe({

        next: (response) => {

          console.log(
            '🟢 Chats API response:',
            response
          );

          this.chats = response.data ?? [];

          console.log(
            '🟢 Chats loaded:',
            this.chats
          );

          if (this.chats.length > 0) {

            this.activeChat = this.chats[0];

            console.log(
              '🟢 Active chat:',
              this.activeChat
            );

          } else {

            this.activeChat = null;

            console.log(
              '🟡 No chats found'
            );
          }

          this.loadingChats = false;

          // Force Angular UI refresh
          this.cdr.detectChanges();

          console.log(
            '🟢 loadingChats:',
            this.loadingChats
          );

          console.log(
            '🟢 activeChat:',
            this.activeChat
          );

        },

        error: (error) => {

          console.error(
            '🔴 Failed to load chats:',
            error
          );

          this.errorMessage =
            error?.error?.message ||
            'Unable to load conversations.';

          this.loadingChats = false;

          // Force Angular UI refresh
          this.cdr.detectChanges();

        }

      });
  }

  // =========================================================
  // SELECT CHAT
  // =========================================================

  selectChat(chat: Chat): void {

    console.log(
      '🟣 Selecting chat:',
      chat._id
    );

    this.activeChat = chat;

    this.cdr.detectChanges();
  }

  // =========================================================
  // CREATE CHAT
  // =========================================================

  createChat(): void {

    if (this.creatingChat) {
      return;
    }

    this.creatingChat = true;
    this.errorMessage = '';

    console.log(
      '🔵 Creating new chat:',
      this.selectedIndustry
    );

    this.chatService
      .createChat(
        this.selectedIndustry,
        'New Conversation'
      )
      .subscribe({

        next: (response) => {

          console.log(
            '🟢 Chat created:',
            response
          );

          const newChat = response.data;

          this.activeChat = newChat;

          this.chats = [
            newChat,
            ...this.chats
          ];

          this.creatingChat = false;

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            '🔴 Failed to create chat:',
            error
          );

          this.errorMessage =
            error?.error?.message ||
            'Unable to create conversation.';

          this.creatingChat = false;

          this.cdr.detectChanges();

        }

      });
  }

  // =========================================================
  // CHANGE INDUSTRY
  // =========================================================

  changeIndustry(): void {

    console.log(
      '🟡 Changing industry:',
      this.selectedIndustry
    );

    this.activeChat = null;

    this.loadChats();
  }

  // =========================================================
  // SEND MESSAGE
  // =========================================================

  sendMessage(): void {

    const question = this.question.trim();

    // -----------------------------------------
    // Validation
    // -----------------------------------------

    if (!question) {
      return;
    }

    if (this.sendingMessage) {
      return;
    }

    // -----------------------------------------
    // Make sure chat exists
    // -----------------------------------------

    if (!this.activeChat) {

      console.warn(
        '🟡 No active chat. Creating one...'
      );

      this.createChat();

      return;
    }

    const chatId = this.activeChat._id;

    console.log('================================');
    console.log('🔵 Sending message');
    console.log('Chat ID:', chatId);
    console.log('Question:', question);
    console.log('================================');

    // -----------------------------------------
    // Immediately show user's message
    // -----------------------------------------

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

    // -----------------------------------------
    // Reset input
    // -----------------------------------------

    this.question = '';

    // -----------------------------------------
    // Show AI typing indicator
    // -----------------------------------------

    this.sendingMessage = true;

    this.errorMessage = '';

    this.cdr.detectChanges();

    console.log(
      '🟡 sendingMessage BEFORE API:',
      this.sendingMessage
    );

    // -----------------------------------------
    // Call backend
    // -----------------------------------------

    this.chatService
      .sendMessage(
        chatId,
        question
      )
      .subscribe({

        next: (response) => {

          console.log(
            '🟢 Message API response:',
            response
          );

          // -------------------------------------
          // Validate backend response
          // -------------------------------------

          if (
            !response ||
            !response.success ||
            !response.data
          ) {

            console.error(
              '🔴 Invalid API response:',
              response
            );

            this.errorMessage =
              'The AI response was invalid.';

            this.sendingMessage = false;

            this.cdr.detectChanges();

            return;
          }

          // -------------------------------------
          // Get returned chat
          // -------------------------------------

          const returnedChat =
            response.data.chat;

          console.log(
            '🟢 Returned chat:',
            returnedChat
          );

          console.log(
            '🟢 Returned messages:',
            returnedChat?.messages
          );

          // -------------------------------------
          // Update active chat
          // -------------------------------------

          if (returnedChat) {

            this.activeChat = returnedChat;

            // -----------------------------------
            // Update chat in conversation list
            // -----------------------------------

            this.chats = this.chats.map(chat =>
              chat._id === returnedChat._id
                ? returnedChat
                : chat
            );

          }

          // -------------------------------------
          // STOP LOADING
          // -------------------------------------

          this.sendingMessage = false;

          console.log(
            '🟢 Updated active chat:',
            this.activeChat
          );

          console.log(
            '🟢 Messages:',
            this.activeChat?.messages.length
          );

          console.log(
            '🟢 sendingMessage AFTER API:',
            this.sendingMessage
          );

          // -------------------------------------
          // IMPORTANT
          // Force Angular UI update
          // -------------------------------------

          this.cdr.detectChanges();

          console.log(
            '🟢 UI refresh triggered'
          );

        },

        error: (error) => {

          console.error(
            '🔴 Failed to send message:',
            error
          );

          this.errorMessage =
            error?.error?.message ||
            'Unable to get an AI response.';

          // -------------------------------------
          // STOP LOADING EVEN ON ERROR
          // -------------------------------------

          this.sendingMessage = false;

          this.cdr.detectChanges();

          console.log(
            '🔴 sendingMessage AFTER ERROR:',
            this.sendingMessage
          );

        }

      });
  }

  // =========================================================
  // ENTER KEY
  // =========================================================

  handleEnter(event: Event): void {

    const keyboardEvent =
      event as KeyboardEvent;

    // Shift + Enter
    // Allow newline
    if (keyboardEvent.shiftKey) {
      return;
    }

    // Enter
    // Send message
    keyboardEvent.preventDefault();

    this.sendMessage();
  }

  // =========================================================
  // TRACKING
  // =========================================================

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
}