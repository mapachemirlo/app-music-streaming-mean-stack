import { Component, OnInit } from '@angular/core';

import { GLOBAL } from '../services/global';
import { UserService } from '../services/user.service';
import { User } from '../models/user-model';


@Component({
    selector: 'user-edit',
    templateUrl: '../views/user-edit.html',
    providers: [UserService]
})

// +++++++++++++++++++++++++++++++++++++++ MI COMPONENTE PARA EDITAR USUARIOS ++++++++++++++++++++++++++++++++++++++++++++++

export class UserEditComponent implements OnInit{
    public title: string;
    public user: User;
    public identity;
    public token;
    public alertMessage;
    public filesToUpload: Array<File>;   
    public url: string;


    constructor(
        private _userService: UserService
    ){
        this.title = 'Actualizar mis datos';

        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();

        this.user = this.identity;
        this.url = GLOBAL.url;
    }
    
    ngOnInit(){
        console.log('user-edit.component.ts cargado!');
    }

    // +++++++++++++++++++++++++++++++++++++++++++++++++++ MÉTODO ACTUALIZAR USUARIO +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    onSubmit(){
        this._userService.updateUser(this.user).subscribe(
            response => {
                if(!response.user){
                    this.alertMessage = 'No se ha actualizado el usuario';
                }else{
                    localStorage.setItem('identity', JSON.stringify(this.user));
                    document.getElementById('identity_name').innerHTML = this.user.name;
                    
                    if(!this.filesToUpload){
                    }else{
                        this.makeFileRequest(this.url + 'upload-image-user/' + this.user._id, [], this.filesToUpload)
                        .then((result: any) => {

                            this.user.image = result.image;  // nos llega un objeto con la imagen nueva del usuario
                            localStorage.setItem('identity', JSON.stringify(this.user));

                            let image_path = this.url + 'get-image-user/' + this.user.image;
                            document.getElementById("image-logged").setAttribute('src', image_path);

                        });
                    }

                    this.alertMessage = 'Los datos se actualizaron correctamente';
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
        
    }

    // +++++++++++++++++++++++++++++++++ MÉTODO PARA LANZAR EN EVENTO CHANGE DEL INPUT (subida imagen) ++++++++++++++++++++++++++++++++++
    fileChangeEvent(fileInput: any){   
        this.filesToUpload = <Array<File>>fileInput.target.files;
        console.log(this.filesToUpload);
    }

    // +++++++++++++++++++++++++++++++++ PETICIÓN AJAX PARA SUBIR ARCHIVOS CONVENCIONALES ++++++++++++++++++++++++++++++++++++++++++++++
    makeFileRequest(url: string, params: Array<string>, files: Array<File>){
        var token = this.token;
        return new Promise((resolve, reject) => {
            var formData: any = new FormData(); 
            var xhr = new XMLHttpRequest();   

            for(var i = 0; i < files.length; i++){   
                formData.append('image', files[i], files[i].name);
            }

            xhr.onreadystatechange = () => {
                if(xhr.readyState == 4){
                    if(xhr.status == 200){
                        resolve(JSON.parse(xhr.response)); 
                    }else{
                        reject(xhr.response);
                    }

                }
            }

            xhr.open('POST', url, true);
            xhr.setRequestHeader('Authorization', token);
            xhr.send(formData);     
        });

    }
}

