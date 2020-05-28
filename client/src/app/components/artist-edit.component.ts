import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router'; 

import { UserService } from '../services/user.service';
import { ArtistService } from '../services/artist.service';
import { UploadService } from '../services/upload.service';
import { GLOBAL }  from '../services/global';
import { Artist }  from '../models/artist-model';

@Component({
    selector: 'artist-edit',
    templateUrl: '../views/artist-add.html',
    providers: [UserService, ArtistService, UploadService]
})

export class ArtistEditComponent implements OnInit{
    public title: string;
    public artist: Artist;
    public identity;
    public token;
    public url: string;
    public alertMessage;
    public is_edit;
    public filesToUpload: Array<File>;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _uploadService: UploadService,
        private _artistService: ArtistService
    ){
        this.title = 'Editar artista';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.artist = new Artist('', '', '');
        this.is_edit = true;
    }

    ngOnInit(){
        console.log('artist-edit.component.ts cargado correctamente');
        this.getArtist(); 
    }
    
    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++ TRAERME UN ARTISTA +++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    getArtist(){
        this._route.params.forEach((params: Params) => {               
            let id = params['id'];                                    
            this._artistService.getArtist(this.token, id).subscribe(
                response => {
                    if (!response.artist) {
                        this._router.navigate(['/']);
                    } else {
                        this.artist = response.artist;                    
                        console.log(this.artist);
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

    // ++++++++++++++++++++++++++++++++++++++++++++++++++ ENVÍO DEL FORMULARIO +++++++++++++++++++++++++++++++++++++++++++++++++++
    onSubmit(){
        console.log(this.artist);
        this._route.params.forEach((params: Params) => {              
            let id = params['id'];

            this._artistService.editArtist(this.token, id, this.artist).subscribe(
                response => {

                    if (!response.artist) {
                        this.alertMessage = 'Error en el servidor';
                    } else {
                        this.alertMessage = 'El artista se ha actualizado correctamente!';
                        if (!this.filesToUpload) {
                            this._router.navigate(['/artista', response.artist._id]);
                        } else {
                            this._uploadService.makeFileRequest(this.url + 'upload-image-artist/' + id, [], this.filesToUpload, this.token, 'image')
                            .then(
                                (result) => {
                                    this._router.navigate(['/artista', response.artist._id]);
                                },
                                (error) => {
                                    console.log(error);
                                }
                            );
                        }

                    }
                },
                error => {
                    var errorMessage = <any>error;
                    if(errorMessage != null){
                    var body = JSON.parse(error._body)  
                    this.alertMessage = body.message;
                    console.log(error);
                    }
                }
            );
        });
    }

    // +++++++++++++++++++++++++++++++++++++++++++ METODO A LLAMAR CUANDO SE EJECUTE EL BOTON DE SUBIR IMAGEN ++++++++++++++++++++++++++++++++++++++
    fileChangeEvent(fileInput: any){
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }
}