import { Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(
    public wsService: WebsocketService,
  ) { }

  sendMessage(mensaje: string){
    const payload = {
      de: this.wsService.usuario.nombre,
      cuerpo: mensaje
    }
    this.wsService.emit('mensaje', payload);
  }

  getMessage(){
    return this.wsService.listen('mensaje-nuevo');
  }

  getMessagePrivate(){
    return this.wsService.listen('mensaje-privado');
  }
  getUsuariosActivos(){
    return this.wsService.listen('usuarios-activos');
  }

  emitirUsuariosActivos(){
    this.wsService.emit('obtener-usuarios');
  }
}
