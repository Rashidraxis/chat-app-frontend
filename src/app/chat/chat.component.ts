import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { ChatService } from './chat.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent implements OnInit, AfterViewChecked {
  messages: any[] = [];
  messageText: string = '';
  username: string = 'User' + Math.floor(Math.random() * 1000); // Temporary username
  typingUser: string | null = null;
  users : string[] = [];

  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.chatService.getHistory().subscribe((history) => {
      this.messages = [...history.reverse()];
      this.scrollToBottom();
    });

    this.chatService.connect(this.username);

    this.chatService.onMessage((msg) => {
      this.messages.push(msg);
      this.scrollToBottom();
    });

    this.chatService.onJoin((data) => {
      this.messages.push({
        system: true,
        text: data.message,
        timestamp: new Date().toISOString(),
      });
      this.scrollToBottom();
    });

    this.chatService.onLeave((data) => {
      this.messages.push({
        system: true,
        text: `${data.id} left the chat`,
        timestamp: new Date().toISOString(),
      });
      this.scrollToBottom();
    });

    this.chatService.onTyping((data) => {
      this.typingUser = data.username;
      setTimeout(() => (this.typingUser = null), 2000);
    });

    this.chatService.onUsers((users) => {
      this.users = users;
    });
  }

  ngAfterViewChecked() {
    // Keep scrolling after Angular updates the view
    this.scrollToBottom();
  }

  sendMessage() {
    if (this.messageText.trim()) {
      this.chatService.sendMessage(this.messageText);
      this.messageText = '';
    }
  }

  onKeyPress() {
    this.chatService.sendTyping();
  }

  private scrollToBottom(): void {
    try {
      this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
    } catch (err) {
      // In case viewChild is not ready yet
    }
  }
}
