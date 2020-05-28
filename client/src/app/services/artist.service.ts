// Imports básicos que casi siempre deberá tener un servicio
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';                 //Libreria para mapear objetos, usaremos el metodo 'map'
import { Observable } from 'rxjs/Observable';    // 'Observable' para recojer respuesta cuando se hace petición AJAX al servidor
import { GLOBAL } from './global';
import { Artist } from 'app/models/artist-model';


// +++++++++++++++++++++++++++++++++++++++++++++ SERVICIO DE ARTISTA ++++++++++++++++++++++++++++++++++++++++++++
@Injectable()

export class ArtistService{
    public url: string;
                 
    constructor(private _http: Http){           
        this.url = GLOBAL.url;                  
    }

    // +++++++++++++++++++++++++++++++++++++++ OBTENER TODOS LOS ARTISTAS ++++++++++++++++++++++++++++++++++++++++
    getArtists(token, page){
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization': token
        });
        // para pasar las cabeceras por GET le vamos a poner unas opciones
        let options = new RequestOptions({headers: headers});

        return this._http.get(this.url + 'artists/' + page,  options).map(res => res.json());
    }

    // ++++++++++++++++++++++++++++++++++++++ OBTENER UN ARTISTA +++++++++++++++++++++++++++++++++++++++++++++++++
    getArtist(token, id: string){
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization': token
        });
        // para pasar las cabeceras por GET le vamos a poner unas opciones
        let options = new RequestOptions({headers: headers});

        return this._http.get(this.url + 'artist/' + id,  options).map(res => res.json());
    }

    // ++++++++++++++++++++++++++++++++++++++ REGISTRAR UN ARTISTA +++++++++++++++++++++++++++++++++++++++++++++++++
    addArtist(token, artist: Artist){       //le pasamos un token y un objeto de tipo Artist, que será el que enviará a la API para que lo guarde
        let params = JSON.stringify(artist);
        let headers = new Headers({         // le enviamos al backend los headers y el token que tiene que comprobar y verificar 
            'Content-Type':'application/json',
            'Authorization': token
        });
        //llamada HTTP                                                                  //mapeamos la respuesta de la API y la convertimos a un JSON
        return this._http.post(this.url + 'register-artist', params, {headers: headers}).map(res => res.json());
    }

    // +++++++++++++++++++++++++++++++++++++++ ACTUALIZAR UN ARTISTA ++++++++++++++++++++++++++++++++++++++++++++++
    editArtist(token, id: string, artist: Artist){       
        let params = JSON.stringify(artist);
        let headers = new Headers({         
            'Content-Type':'application/json',
            'Authorization': token
        });
                                                                      
        return this._http.put(this.url + 'update-artist/' + id, params, {headers: headers}).map(res => res.json());
    }

    // +++++++++++++++++++++++++++++++++++++++ ELIMINAR UN ARTISTA +++++++++++++++++++++++++++++++++++++++++++++++
    deleteArtist(token, id: string){
        let headers = new Headers({
            'Content-Type':'application/json',
            'Authorization': token
        });
        // para pasar las cabeceras por GET le vamos a poner unas opciones
        let options = new RequestOptions({headers: headers});

        return this._http.delete(this.url + 'delete-artist/' + id,  options).map(res => res.json());
    }

}