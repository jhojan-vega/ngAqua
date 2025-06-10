import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { Flag } from 'src/app/interfaces/flag.interface';
import { Period } from 'src/app/interfaces/period.interface';
import { Invoice } from 'src/app/interfaces/invoice.interface';

import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-period',
  templateUrl: './period.component.html'
})
export class PeriodComponent implements OnInit {

  public register:any;
  public period:Period[] = [];
  public invoice:Invoice[] = [];
  public newPeriod:any = {year: null, month: null};
  
  public flagInvoice:Flag = {code: 0, status: null, message: null};
  public flagBill:Flag = {code: 0, status: null, message: null};
  public showInvoice:boolean = false;

  public parametros:any;
  public pdf:any;

  constructor(private _user:UserService, private _router:Router) { }

  ngOnInit() {
    //Se carga al inicio para que la información este lista
    //Cargar datos de factura impresa
    this.parametros = JSON.parse(localStorage.getItem("params"));
    this.flagInvoice.code = 1; //status = load
    this.flagInvoice.message = "Cargando datos";
    this._user.readPeriod().subscribe(
      response => {
        this.register = response;
        if(this.register.status == "error"){
          this.flagInvoice.code = 2; //status = error
          this.flagInvoice.message = this.register.msj;
        }else{
          this.flagInvoice.code = 0; //status = success
          this.flagInvoice.message = this.register.msj;
          this.period = this.register.data;
          this.period = this.period.map(period => ({
            ...period,
            fechafacturacion: formatDate(new Date(period.fechafacturacion.timestamp * 1000), true),
            fechapago: formatDate(new Date(period.fechapago.timestamp * 1000), true)
          }));
          this.showInvoice = true;
          this.newPeriod.month = (this.period.length == 0) ? 1 : (this.period[0].mes == 12) ? 1 : this.period[0].mes + 1;
          this.newPeriod.year = (this.period.length == 0) ? new Date().getFullYear() : (this.period[0].mes == 12) ? this.period[0].anio + 1 : this.period[0].anio;
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

  onSubmit(){
    this.flagBill.code = 1; //status = load
    this.flagBill.message = "Cargando datos";
    this._user.newPeriod(this.newPeriod).subscribe(
      response => {
        this.register = response;
        if(this.register.status == "error"){
          this.flagBill.code = 2; //status = error
          this.flagBill.message = this.register.msj;
        }else{
          this.flagBill.code = 3; //status = info
          this.flagBill.message = this.register.msj;
          this.ngOnInit();
        }
      },
      error => { 
        this.flagBill.message = <any>error; 
        if(this.flagBill.message == null){
          this.flagBill.message = "Error desconocido";
        }
        this.flagBill.code = 2; //status = error
      }
    );
  }

  onInvoice(){
    //console.log("invoice");
  }

  onView(bill:any){
    this._user.setBill(bill);
    this._router.navigate(['/index/invoice']);
  }

  onDelete(){
    let respuesta = confirm('¿Estás seguro que desea borrar este periodo de facturación?');
    if(respuesta){
      this.flagInvoice.code = 1; //status = load
      this.flagInvoice.message = "Eliminando periodo seleccionado";
      this._user.deletePeriod(this.period[0].id).subscribe(
        response => {
          this.register = response;
          if(this.register.status == "error"){
            this.flagInvoice.code = 2; //status = error
            this.flagInvoice.message = this.register.msj;
          }else{
            this.flagInvoice.code = 3; //status = info
            this.flagInvoice.message = this.register.msj;
            this.ngOnInit();
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

  onPrint(value:any){
    //console.log(value);
    this.flagInvoice.message = "Generando Facturas";
    this.flagInvoice.code = 1;
    this._user.readInvoice(value.id).subscribe(
      response => {
        this.register = response;
        if(this.register.status == "error"){
          this.flagInvoice.code = 2; //status = error
          this.flagInvoice.message = this.register.msj;
        }else{
          this.flagInvoice.code = 3; //status = success
          this.flagInvoice.message = this.register.msj;
          /* Borrar flagInvoice [3 seg] */
          setTimeout(() => {
            this.flagInvoice.code = 0;
            this.flagInvoice.message = '';
          }, 3000);
          /* Fin borrar flagInvoice */
          this.invoice = this.register.data;
          this.invoice = this.invoice.map(invoices => {
            return { ...invoices, conceptos: JSON.parse(invoices.conceptos) };
          });
          this.pdf = pdfMake;
          //this.pdf.createPdf(buildPdf(this.invoice, value)).open();
          this.pdf.createPdf(buildPdf(this.invoice, value, this.parametros)).download(value.periodo + '.pdf');
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

function buildPdf(data:any, period:any, logoParams:any){
  //console.log(period);
  var logo = (logoParams.logo != undefined) ? logoParams.logo : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUAAAAAAABJRU5ErkJggg==";
  var acueducto = (logoParams.acueducto != undefined) ? logoParams.acueducto : "Acueducto";
  var acueductoShort = (logoParams.acueductoShort != undefined) ? logoParams.acueductoShort : logoParams.acueducto;
  var info = (logoParams.info != undefined) ? logoParams.info : "Datos Acueducto";
  var invoice = [];
  var concept = [];
  var datos = data;
  var periodo = period;
  //Se crea la fecha a partir del string 'fechapago', agregando 'T12:00:00' para evitar errores de desfase por zona horaria.
  var fechaPago = new Date(periodo.fechapago + 'T12:00:00').toLocaleDateString('es-co', { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  var indice = 0;
  fechaPago = fechaPago.charAt(0).toUpperCase() + fechaPago.slice(1);
  datos.forEach((item, index) => {
    concept = [];
    var rowConcept:string = '';
    item.conceptos.forEach((element, index) => {
      rowConcept = (!element.abono)?'$ ':'- $ ';
      concept.push([ '', '', {text: element.concepto, style: 'textoConceptos1'}, {text: rowConcept + Math.ceil(element.valor).toLocaleString('de-DE', {minimumFractionDigits: 0}), style: 'textoConceptos2'} ]);
      indice = index + 2;
    });
    
    for (var i = indice; i <= 5; i++) {
      concept.push([ '', '', {text: '', style: 'textoBlanco'}, {text: '', style: 'textoBlanco'} ]);
      
    }
    
    concept.push(
      [ '', '', {text: 'TOTAL', style: 'textoTotal1'}, {text: '$ ' + Math.ceil(item.valorfactura).toLocaleString('de-DE', {minimumFractionDigits: 0}), style: 'textoTotal2'} ]
    );

    invoice.push(
      [
        { 
          columns: [
            { 
              width: '60%',
              table: {
                //margin: [5, 5],
                widths: [45, 45, 155, '*'],
                headerRows: 1,
                body: [
                  [ {text: acueducto + '\n' + info, style: 'cabeceraFactura', colSpan: 4}, '', '', ''],
                  [ {text: 'FACTURA', style: 'cabeceraTabla'}, {text: 'CÓDIGO', style: 'cabeceraTabla'}, {text: 'PROPIETARIO', style: 'cabeceraTabla', colSpan:  2} ,'' ],
                  [ {text: item.id, style: 'textoResaltado', bold: true}, {text: item.idpropietario, style: 'textoTabla'}, {text: item.nombres + ' ' + item.apellidos, style: 'textoTabla', colSpan:  2} ,'' ],
                  [ {text: 'MES FACTURADO', style: 'cabeceraTabla', colSpan: 2}, '', {text: 'DIRECCIÓN', style: 'cabeceraTabla', colSpan:  2} ,'' ],
                  [ {text: periodo.periodo, style: 'textoTabla', colSpan: 2}, '', {text: item.direccion, style: 'textoTabla', colSpan:  2} ,'' ],
                  [ {text: 'ESTRATO', style: 'cabeceraTabla', colSpan: 2}, '', {text: 'FECHA LÍMITE DE PAGO', style: 'cabeceraTabla', colSpan:  2} ,'' ],
                  [ {text: item.estrato, style: 'textoTabla', colSpan: 2}, '', {text: fechaPago, style: 'textoResaltado', colSpan:  2} ,'' ],
                  [ 
                    {
                      image: logo,
                      width: 78, alignment:'center', fillColor:'white', rowSpan: 7, colSpan:2, style: 'logo' }, '', {text: 'DESCRIPCIÓN', style: 'cabeceraTabla'}, {text: 'VALOR', style: 'cabeceraTabla'} ],
                  
                ]
              },
              layout: {
                //defaultBorder: false,
                hLineWidth: function (i, node) {
                  return 0;
                },
                vLineWidth: function (i, node) {
                  return 3;
                },
                hLineColor: function (i, node) {
                  return 'white';
                },
                vLineColor: function (i, node) {
                  return 'white';
                },
                fillColor: function (rowIndex, node, columnIndex) {
                  return (rowIndex % 2 === 0) ? '#aaaaaa' : null;
                }
              }       
            },
            drawLine(1, 232),
            {
              width: '40%',
              table: {
                //margin: [5, 5],
                widths: ['*', '*', '*', '*'],
                headerRows: 1,
                body: [
                  [ {text: acueductoShort + '\n' + info, style: 'cabeceraFactura', colSpan: 4}, '', '', ''],
                  [ {text: 'FACTURA', style: 'cabeceraTabla'}, {text: 'CÓDIGO', style: 'cabeceraTabla'}, {text: 'ESTRATO', style: 'cabeceraTabla', colSpan:  2} ,'' ],
                  [ {text: item.id, style: 'textoResaltado', bold: true}, {text: item.idpropietario, style: 'textoTabla'}, {text: item.estrato, style: 'textoTabla', colSpan:  2} ,'' ],
                  [ {text: 'PROPIETARIO', style: 'cabeceraTabla', colSpan:  4} ,'', '', '' ],
                  [ {text: item.nombres + ' ' + item.apellidos, style: 'textoTabla', colSpan:  4} , '', '', '' ],
                  [ {text: 'DIRECCIÓN', style: 'cabeceraTabla', colSpan:  4} ,'', '', '' ],
                  [ {text: item.direccion, style: 'textoTabla', colSpan:  4} , '', '', '' ],
                  [ {text: 'MES FACTURADO', style: 'cabeceraTabla', colSpan:  4} ,'', '', '' ],
                  [ {text: periodo.periodo, style: 'textoTabla', colSpan:  4} , '', '', '' ],
                  [ {text: 'FECHA LÍMITE DE PAGO', style: 'cabeceraTabla', colSpan:  3} ,'', '', {text: 'TOTAL', style: 'cabeceraTabla'} ],
                  [ {text: fechaPago, style: 'textoResaltado', colSpan:  3} ,'', '', {text: '$ ' + Math.ceil(item.valorfactura).toLocaleString('de-DE', {minimumFractionDigits: 0}), style: 'cabeceraTabla'} ],
                  [ {canvas: [
                    {
                      type: 'rect',
                      x: 0, // Coordenada x del cuadro
                      y: 0, // Coordenada y del cuadro
                      w: 115, // Ancho del cuadro
                      h: 22, // Alto del cuadro
                      r: 4, // Radio de los bordes redondeados
                      lineWidth: 0.5, // Ancho de línea del borde
                      lineColor: '#000000', // Color de línea del borde
                      margin: [0,0]
                    }
                  ], colSpan:  3, alignment: 'center', margin: [0, 1]} ,'', '', {text: 'Saldo', alignment: 'center', color:'#999999', margin: [0,4], fillColor: '#eeeeee'} ],
                  [ {text: 'Para pagos parciales ingrese el valor aquí', style: 'textoValor', colSpan:  4} ,'', '', '' ]
                  
                ]
              },
              layout: {
                //defaultBorder: false,
                hLineWidth: function (i, node) {
                  return 0;
                },
                vLineWidth: function (i, node) {
                  return 3;
                },
                hLineColor: function (i, node) {
                  return 'white';
                },
                vLineColor: function (i, node) {
                  return 'white';
                },
                fillColor: function (rowIndex, node, columnIndex) {
                  return (rowIndex % 2 === 0) ? '#CCCCCC' : null;
                }
              }
            }
          ]
        },
        {text: 'IMPRESO POR: Aqua Versión: 1.0.5 Power by: [ kairos.net ] - 311 356 0590\n', color: '#dddddd', fontSize: 6, alignment: 'right'},
        drawLineH(1,570),
        '\n'
      ]
    );
    /** [ Adicionamos a la tabla de la factura los conceptos de la misma ] **/
    for (let i = 0; i < concept.length; i++) {
      invoice[index][0].columns[0].table.body.push(concept[i]); 
    }
  });

  var docDefinition = {
    pageSize: 'LETTER',
		pageMargins: [ 20, 20, 20, 0 ],
		content: invoice,
    styles: {
			cabeceraFactura: {
				margin: [1, 4],
        fontSize: 11,
				bold: true,
				alignment: 'center',
        fillColor: '#cccccc'
			},
      cuerpoFactura: {
        fontSize: 10,
        alignment: 'center',
        border: '#cccccc'
      },
      cabeceraTabla: {
        fontSize: 9,
        bold: true,
        alignment: 'center'
      },
      textoTabla: {
        fontSize: 10,
        alignment: 'center',
        fillColor: '#dddddd',
        margin: 0
      },
      textoResaltado: {
        fontSize: 10,
        alignment: 'center',
        fillColor: '#cccccc',
        bold: true
      },
      textoConceptos1: {
        fontSize: 9,
        alignment: 'left'
      },
      textoConceptos2: {
        fontSize: 9,
        alignment: 'right'
      },
      textoTotal1: {
        fontSize: 11,
        bold: true,
        fillColor: '#333333',
        color: 'white',
        alignment: 'right'
      },
      textoTotal2: {
        fontSize: 11,
        bold: true,
        fillColor: '#333333',
        color: 'white',
        alignment: 'right'
      },
      textoBlanco: {
        fillColor: 'white',
        margin: 5
      },
      textoValor: {
        margin: [0, 0],
        color: '#333333',
        alignment: 'center',
        fontSize: 9,
        fillColor: '#dddddd'
      },
      logo: {
        fillColor: 'white'
      }
    }
  }
  return docDefinition;
}

/** [ FUNCIONES PARA CREAR LÍNEAS Y CUADROS ] **/
function drawLine(lineWidth: number, lineHeight: number): any {
  return {
    stack: [
      {
        canvas: [
          {
            type: 'line',
            x1: 0,
            y1: 0,
            x2: 0,
            y2: lineHeight,
            lineWidth: lineWidth,
            lineColor: '#999999',
            dash: { length: 2 }
          }
        ]
      }
    ],
    width: lineWidth // Ancho de la línea vertical
  };
}

function drawLineH(lineWidth: number, lineHeight: number): any {
  return {
    stack: [
      {
        canvas: [
          {
            type: 'line',
            x1: 0,
            y1: 0,
            x2: lineHeight,
            y2: 0,
            lineWidth: lineWidth,
            lineColor: '#999999',
            dash: { length: 2 }
          }
        ]
      }
    ],
    width: lineWidth // Ancho de la línea vertical
  };
}

// Función para dibujar un cuadro con bordes redondeados y texto en el centro
function cuadro(width: number, height: number): any {
  return {
    canvas: [
      {
        type: 'rect',
        x: 0, // Coordenada x del cuadro
        y: 0, // Coordenada y del cuadro
        w: width, // Ancho del cuadro
        h: height, // Alto del cuadro
        r: 10, // Radio de los bordes redondeados
        lineWidth: 1, // Ancho de línea del borde
        lineColor: '#000000' // Color de línea del borde
      }
    ]
  };
}

/** [ FIN DE LAS FUNCIONES ] **/

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