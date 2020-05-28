import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { GLOBAL } from './services/global';
import { UserService } from './services/user.service';
import { User } from './models/user-model';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  //styleUrls: ['./app.component.css']   no lo  voy a usar
  providers: [ UserService ]   
})



// COMPONENTE PRINCIPAL Y SUS PROPIEDADES

export class AppComponent implements OnInit{     
  public title = 'MusicM';
  public user: User;
  public user_register: User;
  public identity;   
  public token;
  public errorMessage;
  public alertRegister;
  public url: string;

  constructor(                      
    private _route: ActivatedRoute,
    private _router: Router,     
    private _userService: UserService
  ){
    this.user = new User('', '', '', '', '', 'ROLE_USER', '');  
    this.user_register = new User('', '', '', '', '', 'ROLE_USER', '');
    this.url = GLOBAL.url;
  }

  // +++++++++++++++++++++++++ CARGA LA APLICACIÓN (el componente) ++++++++++++++++++++++++++++++++++++++++++
  ngOnInit(){     
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  // ++++++++++++++++++++++++++++++++++++++++++++ LOGUEO ++++++++++++++++++++++++++++++++++++++++++++++++++

  public onSubmit(){
    this._userService.signup(this.user).subscribe(
      response => {
        let identity = response.user;    
        this.identity = identity;        

        if (!this.identity._id){
          alert("El usuario no está correctamente identificado");
        } else {
          localStorage.setItem('identity', JSON.stringify(identity));

          this._userService.signup(this.user, 'true').subscribe(    
            response => {
              let token = response.token;    
              this.token = token;        
      
              if (this.token.length <= 0){     
                alert("El token no se ha generado correctamente");
              } else {
                localStorage.setItem('token', token);
                console.log("Loguedo, el token es: " + token);
                console.log(identity);
                this.user = new User('', '', '', '', '', 'ROLE_USER', '');  
              }
            },
            error => {
              var errorMessage = <any>error;
              if(errorMessage != null){
                var body = JSON.parse(error._body)  
                this.errorMessage = body.message;
                console.log(error);
              }
            }
          );
      
        }
      },
      error => {
        var errorMessage = <any>error;
        if(errorMessage != null){
          var body = JSON.parse(error._body)  
          this.errorMessage = body.message;
          console.log(error);
        }
      }
    );
  }

  // ++++++++++++++++++++++++++++++++++++++++++ LOGOUT cerrar sesion ++++++++++++++++++++++++++++++++++++++
  logout(){
    localStorage.removeItem('identity');
    localStorage.removeItem('token');
    localStorage.clear();

    this.identity = null;
    this.token = null;

    this._router.navigate(['/']);

    console.log("Saliendo..Identity es: " + this.identity);
    console.log("Saliendo...El token es: " + this.token);
  }

  // ++++++++++++++++++++++++++++++++++++++++++ REGISTER +++++++++++++++++++++++++++++++++++++++++++++++++
  onSubmitRegister(){
    console.log(this.user_register);

    this._userService.register(this.user_register).subscribe(
      response => {
        let user = response.user;
        this.user_register = user;

        if (!user._id) {
          alert('Error al registrarse');
          this.alertRegister = 'Error al registrarse';
        } else {
          this.alertRegister = 'El registro se ha realizado correctamente, ingrese con ' + this.user_register.email;
          this.user_register = new User('', '', '', '', '', 'ROLE_USER', '');
        }
      },
      error => {
        var errorMessage = <any>error;
        if(errorMessage != null){
          var body = JSON.parse(error._body)  
          this.alertRegister = body.message;
          console.log(error);
        }
      }
    );
  } 

}

