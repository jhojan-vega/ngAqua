import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class LoginService {
	//public url="http://localhost/aqua/web";	
	public url="https://aqua.bugs.com.co/web";
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

	multiTask(datos): Observable<any>{
		let json = JSON.stringify(datos);
		let params = "json="+json+"&hash="+this.getToken();
		let headers = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'});

		return this._http.post<any>(this.url+"/multiTask", params, {headers: headers});
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