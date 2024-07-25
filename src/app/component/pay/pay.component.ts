import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Flag } from 'src/app/interfaces/flag.interface';
import { Search } from 'src/app/interfaces/search.interface';

declare var $: any;

@Component({
  selector: 'app-pay',
  templateUrl: './pay.component.html'
})
export class PayComponent implements OnInit {
  @ViewChild('buscar') buscar: ElementRef;
  @ViewChild('valor') valor: ElementRef;
  @HostListener('document:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape' && !this.registerPay) { //Ejecutamos la acción reset al pulsar la tecla ESC
      this.reset();
    }
  }

  public find:any = {value:'', findInvoice: true};
  public pay:any = {value:'', owner: '', address: '', invoice: '', lastInvoice: ''};
  public flagSearch:Flag = {code: 0, status: null, message: null};

  public register:any;
  public search:Search[] = [];

  public showData:boolean = false;
  public registerPay:boolean = false;

  public valorFactura:number = 0;

  constructor(private _user:UserService) { }

  ngOnInit() {
    this.onFocus();
  }

  executePay(){
    this.registerPay = true;
    //this.showData = false;
    this.flagSearch.code = 1;
    this.flagSearch.message = "Registrando el pago";
    this._user.payInvoice(this.pay).subscribe(
      response => {
        this.register = response;
        console.log(response);
        if(this.register.status == "error"){
          this.flagSearch.code = 2; //status = error
          this.flagSearch.message = this.register.msj;
        }else{
          this.flagSearch.code = 3; //status = info
          this.flagSearch.message = this.register.msj;
          setTimeout(() => {
            this.flagSearch.code = 0;
            this.reset();
          }, 4000);
        }
        this.registerPay = false;
      },
      error => { 
        this.flagSearch.message = <any>error; 
        if(this.flagSearch.message == null){
          this.flagSearch.message = "Error desconocido";
        }
        this.flagSearch.code = 2; //status = error
      }
    );

  }

  onPay(){
    //console.log(this.pay.invoice, this.pay.lastInvoice);
    if(this.pay.invoice == this.pay.lastInvoice){
      if(this.pay.value < 0){
        alert('No se puede ingresar valores negativos');
        this.onSelect();
      }else{
        if(this.valorFactura != this.pay.value){
          let respuesta = confirm('¿Estás seguro que deseas ingresar un valor diferente de la factura?');
          if(respuesta){
            this.executePay();
          }
        }else{
          if(this.pay.value == 0){
            alert('Esta factura registra un valor de 0 y no debe ser pagada');
            this.onSelect();
          }else{
            this.executePay();
          }
        }
      }
    }else{
      alert('Propietario: ' + this.pay.owner + '\nSólo se puede registrar el pago de la última factura, es decir la [ Factura No. ' + this.pay.lastInvoice + ' ]\nRegistrar el pago de una factura diferente a la factura No. ' + this.pay.lastInvoice + ' podría generar errores en la facturación\n\nSeleccione está factura y realice el pago');
    }
  }

  onSubmit(){
    this.flagSearch.code = 1; //status = load
    this.flagSearch.message = "Cargando datos";
    this._user.findInvoice(this.find).subscribe(
      response => {
        this.register = response;
        //console.log(this.register.data);
        if(this.register.status == "error"){
          this.flagSearch.code = 2; //status = error
          this.flagSearch.message = this.register.msj;
        }else{
          this.flagSearch.code = 0; //status = success
          this.flagSearch.message = this.register.msj;
          this.search = this.register.data;
          this.pay = { 
            owner: this.search[0].nombres + ' ' + this.search[0].apellidos, 
            address: this.search[0].direccion, 
            value: this.search[0].valorfactura,
            invoice: this.search[0].id,
            lastInvoice: this.search[0].ultimafactura 
          };
          this.valorFactura = this.search[0].valorfactura;
          this.showData = true;
          this.onSelect();
        }
      },
      error => { 
        this.flagSearch.message = <any>error; 
        if(this.flagSearch.message == null){
          this.flagSearch.message = "Error desconocido";
        }
        this.flagSearch.code = 2; //status = error
      }
    );
  }

  onChangeCheck(value){
    this.find.findInvoice = value;
  }

  onChange(value){
    this.pay = { 
      owner: value.nombres + ' ' + value.apellidos, 
      address: value.direccion, 
      value: value.valorfactura,
      invoice: value.id,
      lastInvoice: value.ultimafactura 
    };
    this.valorFactura = this.pay.value;
  }

  reset(){
    this.showData = false;
    this.pay = {};
    this.find = {value:'', findInvoice: this.find.findInvoice};
    this.onFocus();
  }

  onFocus(){
    setTimeout(() => {
      this.buscar.nativeElement.focus();
    }, 0);
  }

  onSelect(){
    setTimeout(() => {
      this.valor.nativeElement.select();
    }, 0);
  }

  onDelete(){
    let respuesta = confirm('¿Estás seguro que desea borrar este pago?');
    if(respuesta){
      this.flagSearch.code = 1; //status = load
      this.flagSearch.message = "Eliminando pago seleccionado";
      this._user.deletePay(this.search[0].id).subscribe(
        response => {
          this.register = response;
          if(this.register.status == "error"){
            this.flagSearch.code = 2; //status = error
            this.flagSearch.message = this.register.msj;
          }else{
            this.flagSearch.code = 3; //status = info
            this.flagSearch.message = this.register.msj;
            setTimeout(() => {
              this.flagSearch.code = 0;
              this.reset();
            }, 4000);
          }
        },
        error => { 
          this.flagSearch.message = <any>error; 
          if(this.flagSearch.message == null){
            this.flagSearch.message = "Error desconocido";
          }
          this.flagSearch.code = 2; //status = error
        }
      );
    }
  }

}
