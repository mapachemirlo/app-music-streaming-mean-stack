// Imports básicos que casi siempre deberá tener un servicio
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';                 //Libreria para mapear objetos, usaremos el metodo 'map'
import { Observable } from 'rxjs/Observable';    // 'Observable' para recojer respuesta cuando se hace petición AJAX al servidor
import { GLOBAL } from './global';
import { Album } from '../models/album-model';
import { Song } from '../models/song-model';


// +++++++++++++++++++++++++++++++++++++++++++++ SERVICIO DE CANCIÓN ++++++++++++++++++++++++++++++++++++++++++++
@Injectable()

export class SongService{
    public url: string;
                 
    constructor(private _http: Http){           
        this.url = GLOBAL.url;                  
    }

    // +++++++++++++++++++++++++++++++++++++ OBTENER CANCIÓN ++++++++++++++++++++++++++++++++++++++++++++++++
    getSong(token, id: string){
        let headers = new Headers({         
            'Content-Type':'application/json',
            'Authorization': token
        });

        let options = new RequestOptions({headers: headers});

        return this._http.get(this.url + 'song/' + id, options).map(res => res.json());
    }

    // +++++++++++++++++++++++++++++++++++++ OBTENER TODAS LAS CANCIONES ++++++++++++++++++++++++++++++++++++++++++++++++
    getSongs(token, albumId = null){
        let headers = new Headers({         
            'Content-Type':'application/json',
            'Authorization': token
        });

        let options = new RequestOptions({headers: headers});

        if (albumId == null) {
            return this._http.get(this.url + 'get-songs/', options).map(res => res.json());
        } else {
            return this._http.get(this.url + 'get-songs/' + albumId, options).map(res => res.json());
        }  
    }

    // ++++++++++++++++++++++++++++++++++++++ AÑADIR CANCIÓN +++++++++++++++++++++++++++++++++++++++++++++++++
    addSong(token, song: Song){       
        let params = JSON.stringify(song);
        let headers = new Headers({         
            'Content-Type':'application/json',
            'Authorization': token
        });
                                                                        
        return this._http.post(this.url + 'register-song', params, {headers: headers}).map(res => res.json());
    }

    // ++++++++++++++++++++++++++++++++++++++ EDITAR CANCIÓN +++++++++++++++++++++++++++++++++++++++++++++++++
    editSong(token, id: string, song: Song){       
        let params = JSON.stringify(song);
        let headers = new Headers({         
            'Content-Type':'application/json',
            'Authorization': token
        });
                                                                        
        return this._http.put(this.url + 'update-songs/' + id, params, {headers: headers}).map(res => res.json());
    }

    // +++++++++++++++++++++++++++++++++++++ BORRAR CANCIÓN ++++++++++++++++++++++++++++++++++++++++++++++++
    deleteSong(token, id: string){
        let headers = new Headers({         
            'Content-Type':'application/json',
            'Authorization': token
        });

        let options = new RequestOptions({headers: headers});

        return this._http.delete(this.url + 'delete-song/' + id, options).map(res => res.json());
    }


   

}