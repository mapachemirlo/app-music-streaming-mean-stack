// Imports básicos que casi siempre deberá tener un servicio
import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';                 //Libreria para mapear objetos, usaremos el metodo 'map'
import { Observable } from 'rxjs/Observable';    // 'Observable' para recojer respuesta cuando se hace petición AJAX al servidor
import { GLOBAL } from './global';


//decorador --> @ se lo agregamos a la clase Injectable, para permitir la inyeccion de dependencias de ésta clase y pueda ser utilizada en otros componentes o clases
@Injectable()
// +++++++++++++++++++++++++++++++++++++++++++++ SERVICIO DE USUARIO +++++++++++++++++++++++++++++++++++++++++++++++ 
export class UserService{
    public url: string;
    public identity;
    public token;
                           
    constructor(private _http: Http){           // Hay que asignarle un valor a la propiedad url al cargar este servicio y un 
        this.url = GLOBAL.url;                  //atributo privado '_http' de tipo 'Http', para poder utilizar el servicio Http hay que inyectarlo aqui
    }

    // +++++++++++++++++++++++++++++++++++++++++++++  METODO PARA LOGUEARSE  +++++++++++++++++++++++++++++++++++++++++++++++
     // recibe el usuario que vamos a loguear, y otro para obtener el hash pero no va a ser obligatorio, si llegara a existir el "hash" vamos a necesitar
    // que el API rest nos saque el hash y NO el objeto del usuario logueado. Osea, si no lo pasamos el gethash nos va a devolver un objeto en limpio y completo
    // con todos los datos del usuario que se va a loguear o se ha logueado, y se le pasamos el gethash lo mismo, pero nos devuelve el token para poder usarlo.
    signup(user_to_login, gethash = null){
        if(gethash != null){
            user_to_login.gethash = gethash; // Al objeto 'user_to_login' antes de convertirlo a string, le añadimos la propiedad 'gethash' y lo que lleve(true o false)
        }
        
        let json = JSON.stringify(user_to_login);         // Para hacer peticion al servicio Rest, convertimos a string el objeto que vamos a recibir
        let params = json;

        let headers = new Headers({'Content-Type': 'application/json'});  // se puede pasar 'applicat.... ' porque estamos laburando en MEAN (tdo js)

        // acá devuelvo la peticion, LE HAGO LA PETICION AJAX A LA API Y A LA URL QUE TIENE LA API PARA EL LOGUEO y a su ruta 'login', le paso los parámetros
        // que son los datos q vamos a pasarle a esa ruta por post en el body de la request junto con los headers y luego; CAPTURO(mapeo) esa RESPUESTA y
        // (tiene funcion de callback) que recibimos la respuesta y la codificamos en un objeto JSON usable, osea, lo que me va a devolver el servidor lo
        // convierto a un objeto JSON, que lo parseamos para poder utilizarlo dentro del codigo del FRONT.
        return this._http.post(this.url + 'login', params, { headers: headers }).map(res => res.json());

    }

    // ++++++++++++++++++++++++++++++++++++++++++ METODO PARA REGISTRARSE +++++++++++++++++++++++++++++++++++++++++++++++++++
    register(user_to_register){
        let json = JSON.stringify(user_to_register);
        let params = json;

        let headers = new Headers({'Content-Type': 'application/json'});

        return this._http.post(this.url + 'register', params, { headers: headers }).map(res => res.json());
    }

    // +++++++++++++++++++++++++++++++++++++++++ METODO PARA ACTUALIZAR USUARIO +++++++++++++++++++++++++++++++++++++++++++
    updateUser(user_to_update){
        let params = JSON.stringify(user_to_update);
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': this.getToken()  // traemos el token del localStorge,vemos si esta bien logueado el usuario para usarlo en cada peticion
        });

        return this._http.put(this.url + 'update-user/' + user_to_update._id, params, { headers: headers }).map(res => res.json());
    }

    // +++++++++++++++++++++++++   MÉTODOS PAR ACCEDER AL LOCALSTORAGE + CONSEGUIR ELEMENTO DESEAO + DEVOLVERLO PROCESADO  +++++++++++++++++++++++++++++++++
    getIdentity(){
        // conseguir el objeto identity que tenemos guardado en sesion (el usuario logueado)
        let identity = JSON.parse(localStorage.getItem('identity'));

        if (identity != 'undefined') {
            this.identity = identity;
        } else {
            this.identity = null;
        }
        return this.identity;
    };

    getToken(){
        let token = localStorage.getItem('token');

        if (token != 'undefined') {
            this.token = token;
        } else {
            this.token = null;
        }
        return this.token;
    };
}


