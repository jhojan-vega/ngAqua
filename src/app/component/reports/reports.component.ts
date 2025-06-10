import { Component, OnInit } from '@angular/core';
import { Flag } from 'src/app/interfaces/flag.interface';
import { Period } from 'src/app/interfaces/period.interface';
import { Receivable } from 'src/app/interfaces/receivable.interface';
import { LoginService } from 'src/app/services/login.service';
import { ReportService } from 'src/app/services/report.service';

import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html'
})
export class ReportsComponent implements OnInit {
  public periods:Period[] = [];
  public selectedPeriodId:number = 0;
  public flagPeriod:Flag = { code: 0, message: '' };
  public flagReport:Flag = { code: 0, message: '' };
  public data:any;

  public showData:boolean = false;
  public showCollection:boolean = false;

  public report:number = 0;
  public receivable:Receivable[] = [];
  public totalReceivable:number = 0;
  public percentage:number = 0;
  public collection:number = 0;

  public collectionData: any[] = [];
  public collectionPercentage = 0;
  public collectionFacturado = 0;
  public collectionPorcentajeConsumo = 0;
  public collectionPorcentajeCartera = 0;
  public collectionPorcentajeNovedades = 0;

  public totalConsumed = 0;
  public totalReceible = 0;
  public totalUpdates = 0;
  public collectionConsumed = 0;
  public collectionReceible = 0;
  public collectionUpdates = 0;

  public sortColumn: string = '';
  public sortDirection: 'asc' | 'desc' = 'desc';

  public pdf:any;
  public parametros:any;

  constructor(private _loginService: LoginService, private _reportService: ReportService) {}

  ngOnInit(): void {
    //Cargar datos de factura impresa
    this.parametros = JSON.parse(localStorage.getItem("params"));
    //Fin
  }

  onChangeReport(report:string) {
    this.showData = false;
    this.showCollection = false;
    this.selectedPeriodId = 0;
    this.report = parseInt(report);
    switch (this.report) {
      case 1: 
      case 2:
        this.flagPeriod.code = 1;
        this.flagPeriod.message = "Cargando periodos...";
        const params = [
          {
            entidad: "Periodo",
            campos: ["id", "periodo", "mes", "anio"],
            orden: false
          }
        ];

        this._loginService.multiTask(params).subscribe(
          response => {
            this.data = response[0].entidad;
            if (this.data.status === "error") {
              this.flagPeriod.code = 2;
              this.flagPeriod.message = this.data.msj;
            } else {
              this.periods = this.data.data;
              this.flagPeriod.code = 0;
            }
          },
          error => { 
            this.flagPeriod.message = <any>error; 
            if(this.flagPeriod.message == null){
              this.flagPeriod.message = "Error desconocido";
            }
            this.flagPeriod.code = 2; //status = error
          }
        );
        break;
      
      case 3:
        // Implement other report logic here
        break; 
    
      default:
        break;
    }
    
  }

  onChangePeriod(id: number, panel: number) {
    this.showData = false;
    this.showCollection = false;
    this.selectedPeriodId = id;
    switch(panel){
      case 1:
        this.getReceivable();
        break;
      
      case 2:
        this.getCollection();
        break;

    }
  }

  getReceivable(): void {
    this.flagReport.code = 1;
    this.flagReport.message = "Cargando Datos ...";

    this._reportService.readReceivable(this.selectedPeriodId).subscribe(
      response => {
        if(response.status === "error") {
          this.flagReport.code = 2;
          this.flagReport.message = response.msj;
          this.receivable = [];
          this.totalReceivable = 0;
        }else{
          this.receivable = response.data;
          this.totalReceivable = response.receivable;
          this.percentage = response.percentage;
          this.collection = response.collection;
          this.flagReport.code = 0;
          this.showData = true;
        }
      },
      error => {
        this.flagReport.code = 2;
        this.flagReport.message = "Server error";
        this.receivable = [];
        this.totalReceivable = 0;
      }
    );
  }

  getCollection(): void {
    this.flagReport.code = 1;
    this.flagReport.message = "Cargando Datos ...";
  
    this._reportService.readCollection(this.selectedPeriodId).subscribe(
      response => {
        if(response.status === "error") {
          this.flagReport.code = 2;
          this.flagReport.message = response.msj;
          this.collectionData = [];
          this.showCollection = false;
        } else {
          this.collectionData = response.data;
          this.collection = response.collection;
          this.collectionFacturado = response.facturado;
          this.collectionPercentage = response.percentage;
          this.collectionPorcentajeConsumo = response.porcentaje_consumo;
          this.collectionPorcentajeCartera = response.porcentaje_cartera;
          this.collectionPorcentajeNovedades = response.porcentaje_novedades;
          this.totalConsumed = response.total_consumo;
          this.totalReceible = response.total_cartera;
          this.totalUpdates = response.total_novedades;
          this.collectionConsumed = response.recaudo_consumo;
          this.collectionReceible = response.recaudo_cartera;
          this.collectionUpdates = response.recaudo_novedades;
  
          this.flagReport.code = 0;
          this.showCollection = true;
        }
      },
      error => {
        this.flagReport.code = 2;
        this.flagReport.message = "Error en el servidor.";
        this.collectionData = [];
      }
    );
  }
  
  onSortCollection(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
  
    this.collectionData.sort((a, b) => {
      let valA = a[column];
      let valB = b[column];
  
      // Aseguramos que si son strings numéricos, se conviertan
      valA = isNaN(valA) ? valA : +valA;
      valB = isNaN(valB) ? valB : +valB;
  
      if (typeof valA === 'string' && typeof valB === 'string') {
        return this.sortDirection === 'asc'
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      } else {
        return this.sortDirection === 'asc'
          ? valA - valB
          : valB - valA;
      }
    });
  }  
  
  onPrintReport() {
    const periodoSeleccionado = this.periods.find(p => p.id == this.selectedPeriodId);
    if (!periodoSeleccionado) {
      this.flagReport.code = 2;
      this.flagReport.message = "No se ha seleccionado un periodo válido o no se cargó correctamente la lista de periodos.";
      return;
    }

    this.flagReport.code = 1;
    this.flagReport.message = "Descargando reporte en formato PDF.";
    this.pdf = pdfMake;
    const periodo = periodoSeleccionado.periodo;
    this.pdf.createPdf(buildPdf(this.parametros, periodo, this.receivable, this.totalReceivable, this.percentage, this.collection)).download(periodo + '.pdf');
    //this.pdf.createPdf(buildPdf(this.parametros, periodo, this.receivable, this.totalReceivable, this.percentage, this.collection)).open();
    setTimeout(() => {
      this.flagReport.code = 3;
      this.flagReport.message = "Reporte descargado correctamente.";
    }, 1000);
    // borrar flagReport
    setTimeout(() => {
      this.flagReport.code = 0;
      this.flagReport.message = '';
    }
    , 3000);
  }

  onPrintCollectionReport() {
    const periodoSeleccionado = this.periods.find(p => p.id == this.selectedPeriodId);
    if (!periodoSeleccionado) {
      this.flagReport.code = 2;
      this.flagReport.message = "No se ha seleccionado un periodo válido.";
      return;
    }
  
    this.flagReport.code = 1;
    this.flagReport.message = "Generando PDF...";
  
    const periodo = periodoSeleccionado.periodo;
    this.pdf = pdfMake;
    this.pdf.createPdf(buildCollectionPdf(
      this.parametros,
      periodo,
      this.collectionData,
      this.collection,
      this.collectionFacturado,
      this.collectionPercentage,
      this.totalConsumed,
      this.collectionConsumed,
      this.totalReceible,
      this.collectionReceible,
      this.totalUpdates,
      this.collectionUpdates
    )).open(); //download('Recaudo_' + periodo + '.pdf');
    setTimeout(() => {
      this.flagReport.code = 3;
      this.flagReport.message = "Reporte descargado correctamente.";
    }, 1000);
    // borrar flagReport
    setTimeout(() => {
      this.flagReport.code = 0;
      this.flagReport.message = '';
    }
    , 3000);
  }
}

function buildPdf(parametros:any, periodo:string, receivable:Receivable[], totalReceivable:number, percentage:number, collection:number) {
  
  let tableBody = [];
  
  tableBody.push([
    { text: 'N°', style: 'cabeceraCentrado' }, 
    { text: 'Nombre', style: 'cabeceraTabla' },
    { text: 'Código', style: 'cabeceraCentrado' },
    { text: 'Dirección', style: 'cabeceraTabla' },
    { text: 'Cartera', style: 'cabeceraTabla' }
  ]);

  receivable.forEach(function(item, index) {
    tableBody.push([
      { text: index + 1, alignment: 'center' }, 
      { text: item['nombres'].toString(), alignment: 'left' },
      { text: item['codigo'].toString(), alignment: 'center' },
      { text: item['direccion'].toString(), alignment: 'left' },
      { text: "$ " + Math.ceil(Number(item['cartera'])).toLocaleString('de-DE'), alignment: 'right' }
    ]);
  });
  
  let datos = {
    style: 'tableExample',
    table: {
      widths: [ 'auto', '*', 'auto', '*', 'auto' ], 
      headerRows: 1,
      body: tableBody
    }
  };

  var docDefinition = {
		header: {
			margin: 30,
			columns: [
				{
					width: 40,
					text: ' '
				},
				{
					width: 30,
					alignment: 'center',
					image: parametros.logo
				},
				{
					width: '*',
					text: [ 
						{ text: parametros.reporte + '\n' + parametros.info + '\n', style: 'cabecera'},
						{ text: '[ Reporte de cartera ] - ' + periodo + '\n',	style: 'subtitulo' }
					]
				},
				{
					width: 40,
					text: ' '
				}
			]
		},

		footer: {
			margin: 0,
			text: [
				{ text: 'Corregimiento de Villamoreno - Municipio de Buesaco\n', style: 'textoPie'},
				{ text: 'acueductovillamoreno2024@gmail.com\n', style: 'textoPie'},
				{ text: 'www.logoscreative.com.co', style: 'textoNegrita' }
			]
		},
		pageSize: 'LETTER',
		pageMargins: [ 60, 90, 60, 55 ],
		content: [
      {
        style: 'tableExample',
        table: {
          widths: [ '*', '*', '*', '*' ], 
          headerRows: 1,
          body: [
            [
              { text: 'Usuarios', style: 'cabeceraCentrado' },
              { text: 'Total Cartera', style: 'cabeceraCentrado' },
              { text: '% Recaudo', style: 'cabeceraCentrado' },
              { text: 'Total Recaudo', style: 'cabeceraCentrado' }
            ],
            [
              { text: receivable.length, style: 'textoPie' },
              { text: '$ ' + Math.ceil(Number(totalReceivable)).toLocaleString('de-DE'), style: 'textoPie' },
              { text: (Number(percentage || 0).toFixed(2) + '%'), style: 'textoPie' },
              { text: '$ ' + Math.ceil(Number(collection)).toLocaleString('de-DE'), style: 'textoPie' }
            ]
          ]
        }
      },
      { text: '\n' },
      // Tabla de datos
			datos
		],
		styles: {
			cabecera: {
				fontSize: 15,
				bold: true,
				alignment: 'center'
			},
			subtitulo: {
				fontSize: 8,
				alignment: 'center'
			},
			texto: {
				fontSize: 9
			},
			textoPie: {
				fontSize: 11,
				alignment: 'center'
			},
			textoNegrita: {
				fontSize: 12,
				bold: true,
				alignment: 'center'
			},
			tabla: {
				margin: [1, 5, 1, 15]
			},
			cabeceraTabla: {
				bold: true,
				fontSize: 9,
				color: 'black'
			},
			cabeceraCentrado: {
				bold: true,
				fontSize: 9,
				color: 'black',
				alignment: 'center'
			},
			tableExample: {
				fontSize: 8
			}
		}
	}
	return docDefinition;
}

function buildCollectionPdf(parametros: any, periodo: string, data: any[], totalRecaudo: number, totalFacturado: number, porcentajeTotal: number,
  totalConsumo: number, recaudadoConsumo: number,
  totalCartera: number, recaudadoCartera: number,
  totalNovedades: number, recaudadoNovedades: number) {

  const resumen = [
    [{ text: 'Facturado', style: 'cabeceraCentrado' },
     { text: 'Recaudo', style: 'cabeceraCentrado' },
     { text: '% Recaudo', style: 'cabeceraCentrado' }],
    [
      { text: '$ ' + Math.ceil(totalFacturado).toLocaleString('de-DE'), style: 'textoPie' },
      { text: '$ ' + Math.ceil(totalRecaudo).toLocaleString('de-DE'), style: 'textoPie' },
      { text: porcentajeTotal.toFixed(2) + '%', style: 'textoPie' }
    ]
  ];

  const consumoPorcentaje = (recaudadoConsumo / totalConsumo * 100) || 0;
  const carteraPorcentaje = (recaudadoCartera / totalCartera * 100) || 0;
  const novedadesPorcentaje = (recaudadoNovedades / totalNovedades * 100) || 0;
  const superavit = totalRecaudo - (recaudadoConsumo + recaudadoCartera + recaudadoNovedades);

  const porcentajeSobreTotalFact = (v: number) => ((v / totalFacturado) * 100).toFixed(2);

  const detallePorcentajes = [
    [
      { text: 'CONSUMO (' + porcentajeSobreTotalFact(totalConsumo) + ' %)', style: 'cabeceraCentrado' },
      { text: 'Facturado: $ ' + Math.ceil(totalConsumo).toLocaleString('de-DE'), style: 'texto' },
      { text: 'Recaudado: $ ' + Math.ceil(recaudadoConsumo).toLocaleString('de-DE'), style: 'texto' },
      { text: '% Recaudo: ' + consumoPorcentaje.toFixed(2) + '%', style: 'texto' }
    ],
    [
      { text: 'CARTERA (' + porcentajeSobreTotalFact(totalCartera) + ' %)', style: 'cabeceraCentrado' },
      { text: 'Facturado: $ ' + Math.ceil(totalCartera).toLocaleString('de-DE'), style: 'texto' },
      { text: 'Recaudado: $ ' + Math.ceil(recaudadoCartera).toLocaleString('de-DE'), style: 'texto' },
      { text: '% Recaudo: ' + carteraPorcentaje.toFixed(2) + '%', style: 'texto' }
    ],
    [
      { text: 'NOVEDADES (' + porcentajeSobreTotalFact(totalNovedades) + ' %)', style: 'cabeceraCentrado' },
      { text: 'Facturado: $ ' + Math.ceil(totalNovedades).toLocaleString('de-DE'), style: 'texto' },
      { text: 'Recaudado: $ ' + Math.ceil(recaudadoNovedades).toLocaleString('de-DE'), style: 'texto' },
      { text: '% Recaudo: ' + novedadesPorcentaje.toFixed(2) + '%', style: 'texto' }
    ],
    [
      { text: 'SUPERÁVIT', style: 'cabeceraCentrado', colSpan: 4, alignment: 'center' }, {}, {}, {}
    ],
    [
      { text: '$ ' + Math.ceil(superavit).toLocaleString('de-DE'), colSpan: 4, style: 'textoPie', alignment: 'center' }, {}, {}, {}
    ]
  ];

  let tableBody = [];
  tableBody.push([
    { text: 'N°', style: 'cabeceraCentrado' },
    { text: 'Propietario', style: 'cabeceraTabla' },
    { text: 'Consumo', style: 'cabeceraTabla', alignment: 'center' },
    { text: 'Cartera', style: 'cabeceraTabla', alignment: 'center' },
    { text: 'Novedades', style: 'cabeceraTabla', alignment: 'center' },
    { text: 'Facturado', style: 'cabeceraTabla', alignment: 'center' },
    { text: 'Pagado', style: 'cabeceraTabla', alignment: 'center' }
  ]);

  data.forEach(function(item, index) {
    // const estado = item.total_pagado === 0 ? '->'
    //   : item.total_pagado > item.total_facturado ? '<-'
    //   : item.total_pagado === item.total_facturado ? '=#=>'
    //   : '<=#=';

    tableBody.push([
      { text: index + 1, alignment: 'center' },
      { text: `[${item.inmueble_id}] ${item.propietario}`, alignment: 'left' },
      { text: `$ ${Math.ceil(item.consumo).toLocaleString('de-DE')}`, alignment: 'right' },
      { text: `$ ${Math.ceil(item.cartera).toLocaleString('de-DE')}`, alignment: 'right' },
      { text: `$ ${Math.ceil(item.novedades).toLocaleString('de-DE')}`, alignment: 'right' },
      { text: `$ ${Math.ceil(item.facturado).toLocaleString('de-DE')}`, alignment: 'right' },
      { text: `$ ${Math.ceil(item.total_pagado).toLocaleString('de-DE')}`, alignment: 'right' }
    ]);
  });

  return {
    header: {
      margin: 30,
      columns: [
        { width: 40, text: ' ' },
        { width: 30, alignment: 'center', image: parametros.logo },
        {
          width: '*',
          text: [
            { text: parametros.reporte + '\n' + parametros.info + '\n', style: 'cabecera' },
            { text: '[ Reporte de recaudo ] - ' + periodo + '\n', style: 'subtitulo' }
          ]
        },
        { width: 40, text: ' ' }
      ]
    },
    footer: {
      margin: 0,
      text: [
        { text: 'Corregimiento de Villamoreno - Municipio de Buesaco\n', style: 'textoPie' },
        { text: 'acueductovillamoreno2024@gmail.com\n', style: 'textoPie' },
        { text: 'www.logoscreative.com.co', style: 'textoNegrita' }
      ]
    },
    pageSize: 'LETTER',
    pageMargins: [60, 90, 60, 55],
    content: [
      { text: 'Resumen general', style: 'cabeceraTabla', margin: [0, 0, 0, 5] },
      { style: 'tableExample', table: { headerRows: 1, widths: ['*', '*', '*'], body: resumen } },
      { text: '\n' },
      { text: 'Porcentajes Detallados', style: 'cabeceraTabla', margin: [0, 10, 0, 5] },
      { style: 'tableExample', table: { headerRows: 1, widths: ['*', '*', '*', '*'], body: detallePorcentajes } },
      { text: '\n' },
      { text: 'Detalle por inmueble', style: 'cabeceraTabla', margin: [0, 10, 0, 5] },
      { style: 'tableExample', table: { headerRows: 1, widths: ['auto', '*', 50, 50, 50, 50, 50], body: tableBody } }
    ],
    styles: {
      cabecera: { fontSize: 15, bold: true, alignment: 'center' },
      subtitulo: { fontSize: 8, alignment: 'center' },
      texto: { fontSize: 9 },
      textoPie: { fontSize: 11, alignment: 'center' },
      textoNegrita: { fontSize: 12, bold: true, alignment: 'center' },
      tabla: { margin: [1, 5, 1, 15] },
      cabeceraTabla: { bold: true, fontSize: 9, color: 'black' },
      cabeceraCentrado: { bold: true, fontSize: 9, color: 'black', alignment: 'center' },
      tableExample: { fontSize: 8 }
    }
  };
}