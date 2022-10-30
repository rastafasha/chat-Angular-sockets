import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {

  texto = '';
  mensajesSubcription: Subscription;
  mensajes: any[] = [];
  elemento: HTMLElement;

  constructor( public chatService: ChatService) { }

  ngOnInit() {
    //scrol automatico
    this.elemento = document.getElementById('chat-Mensajes');

    this.mensajesSubcription = this.chatService.getMessage().subscribe( msg => {

      this.mensajes.push(msg); // recibimos el nuevo mensaje

      setTimeout( () => {
        this.elemento.scrollTop = this.elemento.scrollHeight;
      },50);
    })

  }

  ngOnDestroy(){
    this.mensajesSubcription.unsubscribe();
  }

  enviar(){
    //evitar enviar mensaje vacio
    if(this.texto.trim().length === 0){
      return;
    }

    //enviar mensajes
    //console.log(this.texto);
    this.chatService.sendMessage(this.texto);
    this.texto = '';
  }

}
