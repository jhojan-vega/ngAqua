import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { User } from 'src/app/interfaces/user.interface'
import { Flag } from 'src/app/interfaces/flag.interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  public user:User = {tipoIdentificacion: 'CC', numero: null, password: null};
  public flagLogin:Flag = {code: 0, status: null, message: null};
  //public flagLogin:any = {code:0, status: 'success', message: 'All ok'}

  public data:any;

  constructor(private _loginService:LoginService, private _router:Router) { }

  ngOnInit() {

    let id = this._loginService.getIdentity();
    if(id != null){
      this._router.navigate(['/index']);
    }
  }

  onSubmit(){
	this.flagLogin.code = 1; //status = load
	this.flagLogin.message = "Comprobando credenciales";
	this._loginService.signUp(this.user).subscribe(
		response => {
			this.data = response;
			if(this.data.status == "error"){
				this.flagLogin.code = 2; //status = error
				this.flagLogin.message = this.data.msj;
			}else{
				this.flagLogin.code = 3; //status = info
				this.flagLogin.message = this.data.msj;
		localStorage.setItem("identity", JSON.stringify(this.data.user));
		localStorage.setItem("token", this.data.hash);
		this._router.navigate(['/index']);
			}
		},
		error => { 
			this.flagLogin.message = <any>error; 
			if(this.flagLogin.message == null){
				this.flagLogin.message = "Error desconocido";
			}
			this.flagLogin.code = 2; //status = error
		}
	);
  }

}
