// websocket.service.ts
import {Inject, Injectable, InjectionToken} from '@angular/core';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Subject } from 'rxjs';
import {HOST} from "../host.constant";


@Injectable({ providedIn: 'root' })
export class WebSocketService {
  private stompClient: Client | undefined;
  public updates$ = new Subject<number>();
  private topic = '';


  constructor(@Inject(new InjectionToken<String>('topic')) topic: string) {
    this.initializeConnection();
    this.topic = topic;
  }

  private initializeConnection() {
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS(`${HOST}/ws`),
      reconnectDelay: 5000,
      onConnect: () => this.subscribeToUpdates()
    });

    this.stompClient.activate();
  }

  private subscribeToUpdates() {
    this.stompClient?.subscribe(this.topic, message => {
      const listId = JSON.parse(message.body);
      this.updates$.next(listId);
    });
  }
}
