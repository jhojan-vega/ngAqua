import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export class ReportService {
    //public url="https://aqua.logoscreative.com.co/web/report";
	public url=environment.URL_API + "/report";
    public identity;
    public token;

    constructor(private _http:HttpClient) {
        console.log("Servicio API Rest (report) Aqua Funcionando !!!");
    }
    
    /** [Listar usuarios con cartera pendiente en un periodo] **/
	readReceivable(periodoId: number): Observable<any> {
		let params = "periodo_id=" + periodoId + "&hash=" + this.getToken();
		let headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });

		return this._http.post<any>(this.url + "/receivable", params, { headers: headers });
	}

	/** [Listar usuarios con recaudo] **/
	readCollection(periodoId: number): Observable<any> {
		let params = "periodo_id=" + periodoId + "&hash=" + this.getToken();
		let headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });	

		return this._http.post<any>(this.url + "/collection", params, { headers: headers });
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