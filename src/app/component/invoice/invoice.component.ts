import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { UserService } from 'src/app/services/user.service';
import { Flag } from 'src/app/interfaces/flag.interface';
import { Invoice } from 'src/app/interfaces/invoice.interface';
import { Period } from 'src/app/interfaces/period.interface';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html'
})
export class InvoiceComponent implements OnInit {

  public register:any;
  public bill:any = {id:null};
  public invoice:Invoice[] = [];
  public period:Period;
  
  public flagInvoice:Flag = {code: 0, status: null, message: null};
  public flagBill:Flag = {code: 0, status: null, message: null};
  public showInvoice:boolean = false;

  constructor(private _user:UserService, private _router:Router) { }

  ngOnInit() {
    this.period = this._user.getBill();
    if(this.period === undefined){
      this._router.navigate(['/index/period']);
    }else{
      this.flagInvoice.code = 1; //status = load
      this.flagInvoice.message = "Cargando datos";
      this._user.readInvoice(this.period.id).subscribe(
        response => {
          this.register = response;
          if(this.register.status == "error"){
            this.flagInvoice.code = 2; //status = error
            this.flagInvoice.message = this.register.msj;
          }else{
            this.flagInvoice.code = 0; //status = success
            this.flagInvoice.message = this.register.msj;
            this.invoice = this.register.data;
            console.log(this.invoice);
            this.invoice = this.invoice.map(invoices => {
              return { ...invoices, conceptos: JSON.parse(invoices.conceptos) };
            });
            this.showInvoice = true;
          }
        },
        error => { 
          this.flagInvoice.message = <any>error; 
          if(this.flagInvoice.message == null){
            this.flagInvoice.message = "Error desconocido";
          }
          this.flagInvoice.code = 2; //status = error
        }
      );
    }
  }

  onInvoice(){
    this._router.navigate(['/index/period']);
  }

  onView(bill){
    this.bill = bill;
    //console.log(this.bill);
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