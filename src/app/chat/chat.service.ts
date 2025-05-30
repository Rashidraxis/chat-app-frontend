// src/app/chat/chat.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { io, Socket } from 'socket.io-client';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private socket!: Socket;
  private base = 'http://localhost:3000'; // NestJS backend

  constructor(private http: HttpClient) {}

  connect(username: string) {
    this.socket = io(this.base);
    this.socket.emit('join', { username });
  }

  sendMessage(text: string) {
    this.socket.emit('message', { text });
  }

  onMessage(callback: (msg: any) => void) {
    this.socket.on('message', callback);
  }

  onJoin(callback: (msg: any) => void) {
    this.socket.on('join', callback);
  }

  onLeave(callback: (msg: any) => void) {
    this.socket.on('leave', callback);
  }

  getHistory() {
    return this.http.get<any[]>(`${this.base}/chat/history`);
  }

  sendTyping() {
    this.socket.emit('typing');
  }

  onTyping(callback: (data: any) => void) {
    this.socket.on('typing', callback);
  }

  onUsers(callback: (users: string[]) => void) {
    this.socket.on('users', callback);
  }
}
