import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Owner } from 'src/app/interfaces/owner.interface';
import { Flag } from 'src/app/interfaces/flag.interface';

@Component({
  selector: 'app-owner',
  templateUrl: './owner.component.html',
  styles: []
})
export class OwnerComponent implements OnInit, AfterViewInit {
  @ViewChild('createModal') createModal: ElementRef;

  public register:any;
  public owner:Owner[] = [];
  public index:number = null;
  public oldOwner:Owner;
  public newOwner:Owner = {id:null, tipoidentificacion: ''}; //Al menos se debe iniciar una propiedad del objeto o iniciarlo vacio
  public flagOwner:Flag = {code: 0, status: null, message: null};
  public flagRegister:Flag = {code: 0, status: null, message: null};
  public showOwner:boolean = false;

  public edit:boolean = false;
  public success:boolean = false;

  constructor(private _user:UserService) { }

  ngOnInit() {
    this.flagOwner.code = 1; //status = load
    this.flagOwner.message = "Cargando datos";
    this._user.readOwner().subscribe(
      response => {
        this.register = response;
        if(this.register.status == "error"){
          this.flagOwner.code = 2; //status = error
          this.flagOwner.message = this.register.msj;
        }else{
          this.flagOwner.code = 0; //status = success
          this.flagOwner.message = this.register.msj;
          this.owner = this.register.data;
          this.showOwner = true;
        }
      },
      error => { 
        this.flagOwner.message = <any>error; 
        if(this.flagOwner.message == null){
          this.flagOwner.message = "Error desconocido";
        }
        this.flagOwner.code = 2; //status = error
      }
    );
  }

  ngAfterViewInit() {
    //Evento que se dispara cuando se cierra el modal
    this.createModal.nativeElement.addEventListener('hidden.bs.modal', () => {
      if(this.edit && !this.success) this.register.data[this.index] = Object.assign({}, this.oldOwner);;
    });
  }

  reset(){
    this.flagRegister.code = 0;
    this.flagRegister.message = '';
    this.newOwner = {
      id: null,
      tipoidentificacion: '',
      numero: null,
      nombres: null,
      apellidos: null,
      telefono: null,
      correo: null
    };
    this.edit = false;
    this.success = false;
  }

  onEdit(editOwner:Owner, index){
    this.index = index;
    //Se asigan el registro a editar a una copia para cargarla si no hay cambios
    //No se asigna con = para que no quede vinculada a cambios posteriores
    this.oldOwner = Object.assign({}, editOwner);
    this.reset();
    this.newOwner = editOwner;
    this.edit = true;
  }

  onSubmit(){
    let word = (this.edit) ? 'E' : 'C';
    //console.log(word);
    this.flagRegister.code = 1; //status = load
    this.flagRegister.message = "Cargando datos";
    this._user.newOwner(this.newOwner, word).subscribe(
      response => {
        this.register = response;
        if(this.register.status == "error"){
          this.flagRegister.code = 2; //status = error
          this.flagRegister.message = this.register.msj;
        }else{
          this.flagRegister.code = 3; //status = info
          this.flagRegister.message = this.register.msj;
          this.success = true;
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
