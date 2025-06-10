import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { Login } from 'src/app/interfaces/login.interface'
import { Flag } from 'src/app/interfaces/flag.interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  public user:Login = {tipoIdentificacion: 'CC', numero: null, password: null};
  public flagLogin:Flag = {code: 0, status: null, message: null};
  //public flagLogin:any = {code:0, status: 'success', message: 'All ok'}

  public data:any;

  constructor(private _loginService:LoginService, private _router:Router) { }

  ngOnInit() {

    let id = this._loginService.getIdentity();
    if(id === null){
      this._router.navigate(['/login']);
    }else{
		switch (id.eX2R) {
			case '85488a4fafa970e2e51a8d3bb0ecf0a9b00644177a2de8ff66343cd4d5e544df':
				this._router.navigate(['/index']);
				break;
		
			case '644e47c31d3268b44fe99aebe895191f592f0ae1e5d7766c276fc0e6c75c0b67':
				this._router.navigate(['/biller']);
				break;
			
			case '859f447e740ca242b669fe8dfa6e3a2343c6884cbed40fe546c72c02b900299c':
				this._router.navigate(['/auditor']);
				break;
		
			default:
				this._router.navigate(['/login']);
				break;
		}
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
				switch (this.data.user.eX2R) {
					case '85488a4fafa970e2e51a8d3bb0ecf0a9b00644177a2de8ff66343cd4d5e544df':
						this._router.navigate(['/index']);
						break;
				
					case '644e47c31d3268b44fe99aebe895191f592f0ae1e5d7766c276fc0e6c75c0b67':
						this._router.navigate(['/biller']);
						break;
					
					case '859f447e740ca242b669fe8dfa6e3a2343c6884cbed40fe546c72c02b900299c':
						this._router.navigate(['/auditor']);
						break;
				
					default:
						this._router.navigate(['/login']);
						break;
				}
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
