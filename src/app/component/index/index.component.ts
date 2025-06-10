import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { UserService } from 'src/app/services/user.service';
import { Flag } from 'src/app/interfaces/flag.interface';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styles: []
})
export class IndexComponent implements OnInit {

  public nombres:string = null;
  public acueducto:string = null;
  public flagPassword:Flag = {code: 0, status: null, message: null};
  public password:string = null;
  public passwordRepeat:string = null;

  constructor(private _loginService:LoginService, private _userService:UserService, private _router:Router) { }

  ngOnInit() {
    let id = this._loginService.getIdentity();
    if(id == null){
      this._router.navigate(['/login']);
    }else{
      if(id.eX2R != '85488a4fafa970e2e51a8d3bb0ecf0a9b00644177a2de8ff66343cd4d5e544df') this.onExit();
      //Cargar datos de la empresa
      this._userService.getData().subscribe(response => {
        localStorage.setItem("params", JSON.stringify(response));
        this.nombres = id.nombres;
        this.acueducto = response.nombre;
      });
      //Fin
    }

  }

  onExit(){
    localStorage.removeItem("identity");
    localStorage.removeItem("token");
    localStorage.removeItem("params");
    this._router.navigate(['/login']);
  }

  passwordsMatch(): boolean {
    return this.password === this.passwordRepeat;
  }

  updatePassword(){
    this.flagPassword.code = 1; //status = load
    this.flagPassword.message = "Cambiando contraseña";
    this._loginService.updatePassword(this.password).subscribe(
      response => {
        if(response.status == "error"){
          this.flagPassword.code = 2; //status = error
          this.flagPassword.message = response.msj;
        }else{
          this.flagPassword.code = 3; //status = info 
          this.flagPassword.message = response.msj;
          //Actualizar el token (response.token) y el identity (response.identity)
          localStorage.setItem("identity", response.identity.content);
          localStorage.setItem("token", response.token);
          //Borrar flagPassword
          setTimeout(() => {
            this.flagPassword.code = 0; //status = success
            this.flagPassword.message = '';
          }, 3000);
        }
      },
      error => { 
        this.flagPassword.message = <any>error; 
        if(this.flagPassword.message == null){
          this.flagPassword.message = "Error desconocido";
        }
        this.flagPassword.code = 2; //status = error
      }
    );
  }

}
