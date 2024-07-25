import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Period } from '../interfaces/period.interface';

@Injectable()
export class UserService {
	//public url="http://localhost/aqua/web/user";	
	public url="https://www.unicatolicadelsur.edu.co/aqua/web/user";	
	public identity;
	public token;
	
	private bill:Period;

	constructor(private _http:HttpClient) {
		console.log("Servicio API Rest (user) Aqua Funcionando !!!");
	}
	//** [Manejo de la variable bill] **/
	setBill(value:Period){
		this.bill = value;
	}
	getBill(){
		return this.bill;
	}
	/** [Listar Historial de Cambios] **/
	readHistory(id:number): Observable<any>{
		let params = "id="+id+"&hash="+this.getToken();
		let headers = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'});

		return this._http.post<any>(this.url+"/readHistory", params, {headers: headers});
	}
	//** [Cargar Novedades] **/
	loadNovelty(): Observable<any>{
		let params = "hash="+this.getToken();
		let headers = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'});

		return this._http.post<any>(this.url+"/loadNovelty", params, {headers: headers});
	}
	//** [Listar Novedades] **/
	readNovelty(): Observable<any>{
		let params = "hash="+this.getToken();
		let headers = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'});

		return this._http.post<any>(this.url+"/readNovelty", params, {headers: headers});
	}
	//** [Crear Novedades] **/
	newNovelty(datos:any): Observable<any>{
		let json = JSON.stringify(datos);
		let params = "json="+json+"&hash="+this.getToken();
		let headers = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'});

		return this._http.post<any>(this.url+"/newNovelty", params, {headers: headers});
	}
	//** [Borrar Novedades] **/
	deleteNovelty(datos:any): Observable<any>{
		let json = JSON.stringify(datos);
		let params = "json="+json+"&hash="+this.getToken();
		let headers = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'});

		return this._http.post<any>(this.url+"/deleteNovelty", params, {headers: headers});
	}
	//** [Buscar Facturas] **/
	findInvoice(datos): Observable<any>{
		let json = JSON.stringify(datos);
		let params = "json="+json+"&hash="+this.getToken();
		let headers = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'});

		return this._http.post<any>(this.url+"/findInvoice", params, {headers: headers});
	}
	//** [Pagar Facturas] **/
	payInvoice(datos): Observable<any>{
		let json = JSON.stringify(datos);
		let params = "json="+json+"&hash="+this.getToken();
		let headers = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'});

		return this._http.post<any>(this.url+"/payInvoice", params, {headers: headers});
	}
	/** [Borrar Pagos] **/
	deletePay(id:number): Observable<any>{
		let params = "id="+id+"&hash="+this.getToken();
		let headers = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'});

		return this._http.post<any>(this.url+"/deletePay", params, {headers: headers});
	}
	//** [Listar Facturas] **/
	readInvoice(periodo): Observable<any>{
		let params = "periodo="+periodo+"&hash="+this.getToken();
		let headers = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'});

		return this._http.post<any>(this.url+"/readInvoice", params, {headers: headers});
	}
  	//** [Listar Inmuebles] **/
	readProperty(): Observable<any>{
		let params = "hash="+this.getToken();
		let headers = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'});

		return this._http.post<any>(this.url+"/readProperty", params, {headers: headers});
	}
	//** [Crear Inmuebles] **/
	newProperty(datos, tarea): Observable<any>{
		let json = JSON.stringify(datos);
		let params = "tarea="+tarea+"&json="+json+"&hash="+this.getToken();
		let headers = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'});

		return this._http.post<any>(this.url+"/newProperty", params, {headers: headers});
	}
	//** [Activar|Desactivar Inmueble] **/
	activeProperty(status:number, id:number): Observable<any>{
		let params = "status="+status+"&id="+id+"&hash="+this.getToken();
		let headers = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'});

		return this._http.post<any>(this.url+"/activeProperty", params, {headers: headers});
	}
  	//** [Listar Propietarios] **/
	readOwner(): Observable<any>{
		let params = "hash="+this.getToken();
		let headers = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'});

		return this._http.post<any>(this.url+"/readOwner", params, {headers: headers});
	}
  	//** [Crear Propietarios 'C' / Editar Propietarios 'E'] **/
	newOwner(datos, tarea): Observable<any>{
		let json = JSON.stringify(datos);
		let params = "tarea="+tarea+"&json="+json+"&hash="+this.getToken();
		let headers = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'});

		return this._http.post<any>(this.url+"/newOwner", params, {headers: headers});
	}
	//** [Listar Periodos] **/
	readPeriod(): Observable<any>{
		let params = "hash="+this.getToken();
		let headers = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'});

		return this._http.post<any>(this.url+"/readPeriod", params, {headers: headers});
	}
  	//** [Crear Periodos] **/
	newPeriod(datos): Observable<any>{
		let json = JSON.stringify(datos);
		let params = "json="+json+"&hash="+this.getToken();
		let headers = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'});

		return this._http.post<any>(this.url+"/newPeriod", params, {headers: headers});
	}
	//** [Borrar Periodos] **/
	deletePeriod(id:number): Observable<any>{
		let params = "id="+id+"&hash="+this.getToken();
		let headers = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'});

		return this._http.post<any>(this.url+"/deletePeriod", params, {headers: headers});
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