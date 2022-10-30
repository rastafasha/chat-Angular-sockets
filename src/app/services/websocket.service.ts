import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  public socketStatus = false;
  public usuario: Usuario =  null;

  constructor(
    private socket: Socket,
    private router: Router
  ) {
    this.cargarStorage();
    this.checkStatus();
  }

  checkStatus(){
    this.socket.on('connect', () => {
      console.log('Conectado al servidor');
      this.socketStatus = true;
      this.cargarStorage();
    });

    this.socket.on('disconnect', () => {
      console.log('Desconectado del servidor');
      this.socketStatus = false;
    });

  }

  //emite cualquier evento
  emit(evento: string, payload?: any, callback?: Function){

    console.log('Emitiendo', evento);
    //emit('EVENTO', payload, callback);
    this.socket.emit(evento, payload, callback);//dispara evento hacia el servidor

  }

  //escuchar cualquier evento
  listen(evento:string){
    return this.socket.fromEvent(evento);
  }

  loginWS(nombre: string){
    console.log('Configurando', nombre);

    return new Promise<void>( (resolve, reject) => {

      this.emit('configurar-usuario', {nombre}, resp => {
        //console.log(resp);

        //mantener el usuario asi actualice el navegador
        this.usuario = new Usuario(nombre);
        this.guardarStorage();

        resolve();
      });

    });

  }

  logoutWs(){
    this.usuario = null;
    localStorage.removeItem('usuario');
    const payload = {
      nombre: 'sin-nombre'
    }
    this.emit('configurar-usuario', payload, () => {});
    this.router.navigateByUrl('');
  }

  getUsuario(){
    return this.usuario;
  }

  guardarStorage(){
    localStorage.setItem('usuario', JSON.stringify(this.usuario));
  }

  cargarStorage(){
    if(localStorage.getItem('usuario')){
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
      this.loginWS(this.usuario.nombre);
    }
  }

}
