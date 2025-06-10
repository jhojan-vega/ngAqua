import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgSelectConfig } from '@ng-select/ng-select';
import { UserService } from 'src/app/services/user.service';
import { LoginService } from 'src/app/services/login.service';
import { Property } from 'src/app/interfaces/property.interface';
import { Flag } from 'src/app/interfaces/flag.interface';
import { History } from 'src/app/interfaces/history.interface';

@Component({
  selector: 'app-property',
  templateUrl: './property.component.html',
  styles: []
})
export class PropertyComponent implements OnInit {
  @ViewChild('cardBody') cardBody: ElementRef;

  public register:any;
  public entity:any[] = [];
  public property:Property[] = [];
  public history:History[] = [];
  public index:number = null;
  public oldProperty:Property;
  public owner:any;
  public type:any;
  public newProperty:Property = {id:null, estrato: '', tipo: '', propietario: ''};
  public flagProperty:Flag = {code: 0, status: null, message: null};
  public flagRegister:Flag = {code: 0, status: null, message: null};
  public showProperty:boolean = false;
  public showHistory:boolean = false;
  public loadCreate:boolean = false;
  public edit:boolean = false;
  public active:boolean = false;
  public entidades:any = [
		{
			"entidad":"Propietario", 
			"campos":["id", "tipoidentificacion", "numero", "nombres", "apellidos"],
      "estado":1
		}, 
		{
			"entidad":"Tipo", 
			"campos":["id","descripcion"]
		}
	];

  constructor(private _user:UserService, private _login:LoginService, private config:NgSelectConfig) { 
    this.config.notFoundText = 'Propietario no encontrado';
  }

  ngOnInit() {
    this.flagProperty.code = 1; //status = load
    this.flagProperty.message = "Cargando Datos";
    this._user.readProperty().subscribe(
      response => {
        this.register = response;
        //console.log(this.register);
        if(this.register.status == "error"){
          this.flagProperty.code = 2; //status = error
          this.flagProperty.message = this.register.msj;
        }else{
          this.flagProperty.code = 0; //status = success
          this.flagProperty.message = this.register.msj;
          this.property = this.register.data;
          //Modificamos la fecha con la función map para iterar y ... para propagación
          this.property = this.property.map(properties => {
            return { ...properties, fecharegistro: formatDate(new Date(properties.fecharegistro.timestamp * 1000), true) };
          });
          this.showProperty = true;
        }
      },
      error => { 
        this.flagProperty.message = <any>error; 
        if(this.flagProperty.message == null){
          this.flagProperty.message = "Error desconocido";
        }
        this.flagProperty.code = 2; //status = error
      }
    );
  }

  reset(){
    this.edit = false;
    this.newProperty = {id: null, tipo: '', propietario: '', catastral: null, estrato: '', direccion: null, fecharegistro: null};
    this.flagRegister.code = 1;
    this.flagRegister.message = 'Cargando Información';
    this._login.multiTask(this.entidades).subscribe(
      response => {
        this.entity = response;
        this.entity.forEach(element => {
          if(element.entidad.status == "error"){
            this.flagRegister.code = 2;
            this.flagRegister.message = element.entidad.msj
          }else{
            switch (element.entidad.name) {
              case "Propietario":
                this.owner = element.entidad.data;
                //console.log(this.owner);
                break;

              case "Tipo":
                this.type = element.entidad.data;
                break;
            }
            this.flagRegister.code = 0;
            this.loadCreate = true;
          }
        });
      },
      error => { 
        this.flagRegister.message = <any>error; 
        if(this.flagRegister.message == null){
          this.flagRegister.message = "Error desconocido";
        }
        this.flagRegister.code = 2; //status = error
      }
    );
  }

  onSubmit(){
    let word = (this.edit) ? 'E' : 'C';
    this.flagRegister.code = 1; //status = load
    this.flagRegister.message = "Cargando datos";
    this._user.newProperty(this.newProperty,word).subscribe(
      response => {
        this.register = response;
        if(this.register.status == "error"){
          this.flagRegister.code = 2; //status = error
          this.flagRegister.message = this.register.msj;
        }else{
          this.flagRegister.code = 3; //status = info
          this.flagRegister.message = this.register.msj;
          this.ngOnInit();
        }
      },
      error => { 
        this.flagRegister.message = <any>error; 
        if(this.flagRegister.message == null){
          this.flagRegister.message = "Error desconocido";
        }
        this.flagRegister.code = 2; //status = error
      }
    );
  }
  
  onActive(status:number){
    var action = (status) ? 'ACTIVAR' : 'SUSPENDER';
    var respuesta = confirm('¿Esta seguro que desea ' + action + ' este inmueble?');
    if(respuesta){
      this.flagRegister.code = 1; //status = load
      this.flagRegister.message = "Cargando datos";
      this._user.activeProperty(status, this.newProperty.id).subscribe(
        response => {
          this.register = response;
          if(this.register.status == "error"){
            this.flagRegister.code = 2; //status = error
            this.flagRegister.message = this.register.msj;
          }else{
            this.flagRegister.code = 3; //status = info
            this.flagRegister.message = this.register.msj;
            this.ngOnInit();
          }
        },
        error => { 
          this.flagRegister.message = <any>error; 
          if(this.flagRegister.message == null){
            this.flagRegister.message = "Error desconocido";
          }
          this.flagRegister.code = 2; //status = error
        }
      );
    }
  }

  onEdit(editProperty:any, index:number){
    this.index = index;
    //Se asigan el registro a editar a una copia para cargarla si no hay cambios
    //No se asigna con = para que no quede vinculada a cambios posteriores
    this.oldProperty = Object.assign({}, editProperty);
    this.reset();
    this.newProperty = {
      id:editProperty.id, 
      catastral: editProperty.catastral,
      direccion: editProperty.direccion, 
      fecharegistro: editProperty.fecharegistro,
      estrato: editProperty.estrato, 
      tipo: editProperty.tipo.id, 
      propietario: editProperty.propietario.id
    };
    this.active = (editProperty.estado == 1) ? true : false;
    this.edit = true;
  }

  onView(property:any, index:number){
    this.showHistory = false;
    this.flagRegister.code = 1; //status = load
    this.flagRegister.message = "Cargando datos";
    this._user.readHistory(property.id).subscribe(
      response => {
        this.register = response;
        if(this.register.status == "error"){
          this.flagRegister.code = 2; //status = error
          this.flagRegister.message = this.register.msj;
        }else{
          this.flagRegister.code = 0; 
          this.flagRegister.message = this.register.msj;
          this.history = this.register.data;
          this.history = this.history.map(histories => ({
            ...histories,
            cambios: JSON.parse(histories.cambios),
            fecha: formatDate(new Date(histories.fecha.timestamp * 1000), true)
            }));
          this.showHistory = true;
          //console.log(this.history[0].cambios[1]);
        }
      },
      error => { 
        this.flagRegister.message = <any>error; 
        if(this.flagRegister.message == null){
          this.flagRegister.message = "Error desconocido";
        }
        this.flagRegister.code = 2; //status = error
      }
    );
  }

  getObjectEntries(obj: any, index:number) {
    return (Object.entries(obj)[0][index]);
  }
  

}

function formatDate(date, format) {
  var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;

  return (format) ? [year, month, day].join('-') : [day, month, year].join('/');
}