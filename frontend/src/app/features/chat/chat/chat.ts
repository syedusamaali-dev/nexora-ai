import {
  Component,
  inject,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import {
  DatePipe,
  TitleCasePipe,
  DecimalPipe
} from '@angular/common';
import { finalize } from 'rxjs';
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
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly chatService = inject(ChatService);


  // =========================================================
  // CHAT STATE
  // =========================================================

  chats: Chat[] = [];

  activeChat: Chat | null = null;

  selectedIndustry:
    'healthcare' | 'finance' = 'healthcare';

  question = '';


  // =========================================================
  // LOADING STATE
  // =========================================================

  loadingChats = false;

  creatingChat = false;

  sendingMessage = false;

  deletingChatId: string | null = null;


  // =========================================================
  // ATTACHMENT STATE
  // =========================================================

  selectedFile: File | null = null;

  uploadingFile = false;

  uploadSuccessMessage = '';

  uploadErrorMessage = '';


  // =========================================================
  // GENERAL ERROR
  // =========================================================

  errorMessage = '';


  // =========================================================
  // LIFECYCLE
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

  console.log('🔵 Loading chats for:', this.selectedIndustry);
  console.log('🔵 loadingChats BEFORE request:', this.loadingChats);

  this.chatService
    .getChats(this.selectedIndustry)
    .pipe(
      finalize(() => {
        this.loadingChats = false;

        console.log(
          '🟣 FINALIZE → loadingChats:',
          this.loadingChats
        );

        this.cdr.detectChanges();
      })
    )
    .subscribe({
      next: (response) => {
        console.log('🟢 Chats API response:', response);

        this.chats = response.data ?? [];

        console.log(
          '🟢 Chats loaded:',
          this.chats.length,
          this.chats
        );

        if (this.chats.length > 0) {
          this.activeChat = this.chats[0];

          console.log(
            '🟢 Active chat:',
            this.activeChat
          );

          console.log(
            '🟢 Messages:',
            this.activeChat.messages?.length ?? 0
          );
        } else {
          this.activeChat = null;
        }

        // Force Angular to update the UI
        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error(
          '🔴 Failed to load chats:',
          error
        );

        this.chats = [];
        this.activeChat = null;

        this.errorMessage =
          error?.error?.message ||
          'Unable to load conversations.';

        this.loadingChats = false;

        this.cdr.detectChanges();
      }
    });
}


  // =========================================================
  // SELECT CHAT
  // =========================================================

  selectChat(chat: Chat): void {

    this.activeChat = chat;

    this.errorMessage = '';

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

    this.chatService
      .createChat(
        this.selectedIndustry,
        'New Conversation'
      )
      .subscribe({

        next: (response) => {

          this.activeChat =
            response.data;

          this.chats = [
            response.data,
            ...this.chats
          ];

          this.creatingChat = false;

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

        }

      });
  }


  // =========================================================
  // CHANGE INDUSTRY
  // =========================================================

  changeIndustry(): void {

    this.activeChat = null;

    this.clearAttachment();

    this.loadChats();

  }


  // =========================================================
  // FILE INPUT
  // =========================================================

  openFilePicker(
    fileInput: HTMLInputElement
  ): void {

    if (
      this.uploadingFile ||
      this.sendingMessage
    ) {
      return;
    }

    fileInput.click();

  }


  // =========================================================
  // FILE SELECTED
  // =========================================================

  onFileSelected(
    event: Event
  ): void {

    const input =
      event.target as HTMLInputElement;

    const file =
      input.files?.[0];

    if (!file) {
      return;
    }


    this.uploadErrorMessage =
      '';

    this.uploadSuccessMessage =
      '';


    // Only PDF is currently accepted
    if (
      file.type !== 'application/pdf'
    ) {

      this.uploadErrorMessage =
        'Only PDF files can be attached.';

      input.value = '';

      return;
    }


    // 10 MB frontend safety limit
    const maxSize =
      10 * 1024 * 1024;

    if (file.size > maxSize) {

      this.uploadErrorMessage =
        'PDF must be smaller than 10 MB.';

      input.value = '';

      return;
    }


    this.selectedFile = file;


    console.log(
      '📎 File selected:',
      file.name
    );


    // Automatically upload
    this.uploadSelectedFile(input);

  }


  // =========================================================
  // UPLOAD FILE
  // =========================================================

uploadSelectedFile(
  input?: HTMLInputElement
): void {

  if (
    !this.selectedFile ||
    this.uploadingFile
  ) {
    return;
  }

  const file = this.selectedFile;

  this.uploadingFile = true;
  this.uploadErrorMessage = '';
  this.uploadSuccessMessage = '';

  console.log('🔵 Uploading document:', file.name);

  this.chatService
    .uploadDocument(
      file,
      this.selectedIndustry,
      'chat-attachment'
    )
    .pipe(
      finalize(() => {
        this.uploadingFile = false;

        console.log(
          '🟣 UPLOAD FINALIZE → uploadingFile:',
          this.uploadingFile
        );

        this.cdr.detectChanges();
      })
    )
    .subscribe({

      next: (response) => {

        console.log(
          '🟢 Document upload response:',
          response
        );

        if (
          response.success &&
          response.data
        ) {

          console.log(
            '🟢 Document processing completed:',
            response.data
          );

          this.uploadSuccessMessage =
            `${file.name} uploaded and processed successfully.`;

          /*
           * Backend returned 201 + success:true.
           * Therefore the upload and PDF processing
           * are completely finished.
           */

          this.uploadingFile = false;

          this.cdr.detectChanges();

          /*
           * Remove attachment preview after
           * showing successful upload.
           */
          setTimeout(() => {

            this.clearAttachment(input);

            this.cdr.detectChanges();

          }, 1500);

        } else {

          this.uploadErrorMessage =
            'Document upload was not completed.';

          this.uploadingFile = false;

          this.cdr.detectChanges();
        }
      },

      error: (error) => {

        console.error(
          '🔴 Document upload failed:',
          error
        );

        this.uploadErrorMessage =
          error?.error?.message ||
          'Unable to upload document.';

        this.uploadingFile = false;

        this.cdr.detectChanges();
      }

    });
}


  // =========================================================
  // REMOVE ATTACHMENT
  // =========================================================

  clearAttachment(
    input?: HTMLInputElement
  ): void {

    this.selectedFile = null;

    this.uploadingFile = false;

    this.uploadSuccessMessage = '';

    this.uploadErrorMessage = '';


    if (input) {
      input.value = '';
    }

  }


  // =========================================================
  // SEND MESSAGE
  // =========================================================

  sendMessage(): void {

  const question = this.question.trim();

  if (
    !question ||
    this.sendingMessage
  ) {
    return;
  }

  if (!this.activeChat) {

    console.warn(
      'No active chat. Creating one...'
    );

    this.createChat();

    return;
  }

  const chatId = this.activeChat._id;

  console.log('🔵 Sending message');
  console.log('🔵 Chat ID:', chatId);
  console.log('🔵 Question:', question);

  // ---------------------------------------------------------
  // Optimistically add user message
  // ---------------------------------------------------------

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

  // ---------------------------------------------------------
  // Set loading state
  // ---------------------------------------------------------

  this.question = '';

  this.sendingMessage = true;

  this.errorMessage = '';

  this.cdr.detectChanges();

  console.log(
    '🟡 sendingMessage BEFORE API:',
    this.sendingMessage
  );

  // ---------------------------------------------------------
  // Send API request
  // ---------------------------------------------------------

  this.chatService
    .sendMessage(
      chatId,
      question
    )
    .pipe(
      finalize(() => {

        this.sendingMessage = false;

        console.log(
          '🟣 FINALIZE → sendingMessage:',
          this.sendingMessage
        );

        // VERY IMPORTANT
        this.cdr.detectChanges();

      })
    )
    .subscribe({

      next: (response) => {

        console.log(
          '🟢 Message API response:',
          response
        );

        // ---------------------------------------------------
        // Validate response
        // ---------------------------------------------------

        if (
          !response ||
          !response.success
        ) {

          console.warn(
            '🟠 API response was not successful:',
            response
          );

          this.errorMessage =
            'The AI response could not be loaded.';

          this.cdr.detectChanges();

          return;
        }

        // ---------------------------------------------------
        // Backend returned updated chat
        // ---------------------------------------------------

        if (
          response.data &&
          response.data.chat
        ) {

          const updatedChat =
            response.data.chat;

          console.log(
            '🟢 Updated chat received:',
            updatedChat
          );

          console.log(
            '🟢 Updated messages:',
            updatedChat.messages
          );

          console.log(
            '🟢 Message count:',
            updatedChat.messages?.length
          );

          // -------------------------------------------------
          // Replace active chat
          // -------------------------------------------------

          this.activeChat = {
            ...updatedChat,
            messages: [
              ...(updatedChat.messages ?? [])
            ]
          };

          // -------------------------------------------------
          // Update chat list
          // -------------------------------------------------

          this.chats =
            this.chats.map(chat => {

              if (
                chat._id === updatedChat._id
              ) {

                return this.activeChat!;

              }

              return chat;

            });

          console.log(
            '🟢 FINAL activeChat:',
            this.activeChat
          );

        } else {

          // -------------------------------------------------
          // Safety fallback
          //
          // If backend gives answer/sources but doesn't
          // return chat, manually add the AI message.
          // -------------------------------------------------

          console.log(
            '🟡 No chat object returned. Using answer fallback.'
          );

          const assistantMessage: ChatMessage = {

            role: 'assistant',

            content:
              response.data?.answer || '',

            sources:
              response.data?.sources || []

          };

          if (this.activeChat) {

            this.activeChat = {

              ...this.activeChat,

              messages: [

                ...this.activeChat.messages,

                assistantMessage

              ]

            };

          }

        }

        // ---------------------------------------------------
        // FORCE UI UPDATE
        // ---------------------------------------------------

        this.sendingMessage = false;

        this.cdr.detectChanges();

        console.log(
          '🟢 UI updated after AI response'
        );

        console.log(
          '🟢 sendingMessage:',
          this.sendingMessage
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

        this.sendingMessage = false;

        // VERY IMPORTANT
        this.cdr.detectChanges();

        console.log(
          '🔴 UI updated after API error'
        );

      }

    });

}


  // =========================================================
  // DELETE CHAT
  // =========================================================

  deleteChat(
    chat: Chat,
    event: Event
  ): void {

    event.stopPropagation();


    if (
      this.deletingChatId
    ) {
      return;
    }


    const confirmed =
      window.confirm(
        `Delete "${chat.title}"?\n\nThis cannot be undone.`
      );


    if (!confirmed) {
      return;
    }


    this.deletingChatId =
      chat._id;


    this.errorMessage = '';


    this.chatService
      .deleteChat(chat._id)
      .subscribe({

        next: () => {

          this.chats =
            this.chats.filter(
              item =>
                item._id !== chat._id
            );


          if (
            this.activeChat?._id ===
            chat._id
          ) {

            this.activeChat =
              this.chats.length > 0
                ? this.chats[0]
                : null;

          }


          this.deletingChatId =
            null;

        },


        error: (error) => {

          console.error(
            '🔴 Failed to delete chat:',
            error
          );


          this.errorMessage =
            error?.error?.message ||
            'Unable to delete conversation.';


          this.deletingChatId =
            null;

        }

      });

  }


  // =========================================================
  // ENTER KEY
  // =========================================================

  handleEnter(
    event: Event
  ): void {

    const keyboardEvent =
      event as KeyboardEvent;


    // Shift + Enter = newline

    if (
      keyboardEvent.shiftKey
    ) {

      return;

    }


    // Enter = send

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