import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export class LoginService {
	//public url="https://aqua.logoscreative.com.co/web";
	public url=environment.URL_API;
	public identity;
	public token;

	constructor(private _http:HttpClient) {
		console.log("Servicio API Rest (service) Aqua Funcionando !!!");
	}

	signUp(userLogin): Observable<any>{
		let json = JSON.stringify(userLogin);
		let params = "json="+json;		
		//console.log(params);
		let headers = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'});

		return this._http.post<any>(this.url+"/login", params, {headers: headers});
	}

	/** [Traer datos de cualquier entidad] **/
	multiTask(datos): Observable<any>{
		let json = JSON.stringify(datos);
		let params = "json="+json+"&hash="+this.getToken();
		let headers = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'});

		return this._http.post<any>(this.url+"/multiTask", params, {headers: headers});
	}
	//** [Actualizar Contraseña] **/
	updatePassword(password:string): Observable<any>{
		let params = "pwd="+password+"&hash="+this.getToken();
		let headers = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'});

		return this._http.post<any>(this.url+"/updatePassword", params, {headers: headers});
	}

	getIdentity(){
		let identity = JSON.parse(localStorage.getItem("identity"));
		if(identity != "undefined"){
			this.identity = identity;
			let now = Math.round(Date.now() / 1000);
			//console.log(this.identity);
			if(this.identity != null)
				if(now > this.identity.exp) this.identity = null;
		}else{
			this.identity = null;
		}
		return this.identity;
	}

	getToken(){
		let token = localStorage.getItem("token");
		if(token != "undefined"){
			this.token = token;
		}else{
			this.token = null;
		}
		return this.token;
	}

}