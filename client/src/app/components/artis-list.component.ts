import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router'; 

import { GLOBAL }  from '../services/global';
import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service';
import { Artist }  from '../models/artist-model';

@Component({
    selector: 'artist-list',
    templateUrl: '../views/artist-list.html',
    providers: [UserService, ArtistService]
})

export class ArtistListComponent implements OnInit{
    public title: string;
    public artists: Artist[];
    public identity;
    public token;
    public url: string;
    public next_page;
    public prev_page;
    public confirmado;
    
    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _artistService: ArtistService
    ){
        this.title = 'Artistas';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.next_page = 1;
        this.prev_page = 1;
    }

    ngOnInit(){
        console.log('artist-list.component.ts cargado correctamente');
        this.getArtists();
    }
    
    // +++++++++++++++++++++++++++++++++++++++ MOSTRAR ARRAY DE ARTISTAS +++++++++++++++++++++++++++++++++++++++++
    getArtists(){
        this._route.params.forEach((params: Params) => {
            let page = +params['page'];     
            if (!page) {
                page = 1;
            } else {
                this.next_page = page + 1;
                this.prev_page = page -1;

                if (this.prev_page == 0) {    
                    this.prev_page = 1;
                }
            }

            this._artistService.getArtists(this.token, page).subscribe(
                response => {
                    if (!response.artists) {
                        this._router.navigate(['/']);
                    } else {
                        this.artists = response.artists;        
                        console.log(this.artists);
                    }
                },
                error => {
                    var errorMessage = <any>error;
                    if(errorMessage != null){
                      var body = JSON.parse(error._body)  
                      console.log(error);
                    }
                }
            );
        });
    }

    onDeleteConfirm(id){
        this.confirmado = id;
    }

    onCancelArtist(){
        this.confirmado = null;
    }

    onDeleteArtist(id){
        this._artistService.deleteArtist(this.token, id).subscribe(
            response => {
                console.log(response.artist);
                if (!response.artist) {
                    alert('Error en el servidor');
                }
                this.getArtists(); 
            },
            error => {
                var errorMessage = <any>error;
                if(errorMessage != null){
                  var body = JSON.parse(error._body)  
                  console.log(error);
                }
            }
        );
    }


}