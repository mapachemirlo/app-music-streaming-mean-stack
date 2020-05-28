// Imports básicos que casi siempre deberá tener un servicio
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';                 //Libreria para mapear objetos, usaremos el metodo 'map'
import { Observable } from 'rxjs/Observable';    // 'Observable' para recojer respuesta cuando se hace petición AJAX al servidor
import { GLOBAL } from './global';
import { Artist } from 'app/models/artist-model';


// +++++++++++++++++++++++++++++++++++++++++++++ SERVICIO DE SUBIDA ++++++++++++++++++++++++++++++++++++++++++++
@Injectable()

export class UploadService{
    public url: string;
                 
    constructor(private _http: Http){           
        this.url = GLOBAL.url;                  
    }

    // +++++++++++++++++++++++++++++++++ PETICIÓN AJAX PARA SUBIR ARCHIVOS CONVENCIONALES ++++++++++++++++++++++++++++++++++++++++++++++
    makeFileRequest(url: string, params: Array<string>, files: Array<File>, token: string, name: string){

        // lanzar el código de la subida
        return new Promise((resolve, reject) => {
            var formData: any = new FormData(); // creando un objeto formData 'simulamos' el comportamiento de un formulario normal
            var xhr = new XMLHttpRequest();   // petición típica AJAX de javascript

            for(var i = 0; i < files.length; i++){   // recorrer los archivos que recibamos por el (files: Array<File>) y añadirlos al formData, luego subirlos (1 o los que querramos)
                //añadimos un elemento al formulario con el name 'image', le pasaremos el archivo que encontremos y su nombre.
                formData.append(name, files[i], files[i].name);
            }

            // comprobar si está lista la petición para realizarse
            xhr.onreadystatechange = () => {
                if(xhr.readyState == 4){
                    if(xhr.status == 200){
                        resolve(JSON.parse(xhr.response)); // parseamos la respuesta que RECIBIMOS al ENVIAR el archivo
                    }else{
                        reject(xhr.response);
                    }

                }
            }

            // lanzamos la petición, pasandole la url por POST y el token
            xhr.open('POST', url, true);
            xhr.setRequestHeader('Authorization', token);
            xhr.send(formData);     // al final le enviamos toda la información acumulada
        });

    }
    
}