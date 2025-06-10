import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Flag } from 'src/app/interfaces/flag.interface';
import { Search } from 'src/app/interfaces/search.interface';
import { generatedPlan, Fee } from 'src/app/interfaces/agreement.interface';

@Component({
  selector: 'app-agreement',
  templateUrl: './agreement.component.html'
})
export class AgreementComponent implements OnInit {
  @ViewChild('buscar') buscar: ElementRef;
  @HostListener('document:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') { //Ejecutamos la acción reset al pulsar la tecla ESC
      this.reset();
    }
  }

  public find:any = {value:'', findInvoice: false, type: 'agreement'};
  public agreement:any = {id: '', value:'', owner: '', address: '', invoice: '', lastInvoice: '', pay: 0, agreement: '', year: 0, month: 0};
  
  public flagSearch:Flag = {code: 0, status: null, message: null};
  public flagAgreement:Flag = {code: 0, status: null, message: null};
  public flagNewAgreement:Flag = {code: 0, status: null, message: null};

  public register:any;
  public listAgreement:any;
  public search:Search[] = [];

  public showData:boolean = false;
  public showList:boolean = false;
  public showAgreement:boolean = false;
  public viewAgreement:boolean = false;

  public sortColumn: string = '';
  public sortDirection: 'asc' | 'desc' = 'asc';

  // Variables para el acuerdo generado
  public typeButton: number = 0; // 0 = Guardar, 1 = Eliminar, 2 = Cancelar
  public numCuotas = 4;
  public cuotas: Fee[] = [];
  public acuerdoPago: generatedPlan = {
    id: 0,
    total: 0,
    cuotas: 0,
    cuotavalor: 0,
    valorpagado: 0,
    valorpendiente: 0,
    estado: 'A',
    fechacreacion: null,
    fechainicio: { anio: 0, mes: 0 },
    plan: this.cuotas,
    factura: 0
  };
  public valorPago: number = 0;

  constructor(private _user:UserService) { }

  ngOnInit() {
    // Inicializamos los shows
    this.showData = false;
    this.showAgreement = false;
    this.showList = false;

    this.flagSearch.code = 1; //status = load
    this.flagSearch.message = "Cargando datos";
    this._user.readAgreement().subscribe(
      response => {
        this.register = response;
        //console.log(this.register.data);
        if(this.register.status == "error"){
          this.flagSearch.code = 2; //status = error
          this.flagSearch.message = this.register.msj;
        }else{
          this.flagSearch.code = 0; //status = success
          this.flagSearch.message = this.register.msj;
          this.listAgreement = this.register.data;
          //console.log(this.listAgreement);
          this.showList = true;
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
    // Foco en el input de búsqueda
    this.onFocus();
  }

  onSubmit(){
    //Ponemos la lista de acuerdos en false
    this.showList = false;
    this.showAgreement = false;
    //Borramos todos los mensajes de las flags
    this.flagSearch.message = '';
    this.flagAgreement.message = '';
    this.flagNewAgreement.message = '';
    //Fin del borrado de mensajes
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
          //console.log(this.search);
          this.agreement = { 
            id: this.search[0].tipoidentificacion + this.search[0].numero,
            owner: this.search[0].nombres + ' ' + this.search[0].apellidos, 
            address: this.search[0].direccion, 
            value: this.search[0].valorfactura,
            invoice: this.search[0].id,
            lastInvoice: this.search[0].ultimafactura,
            pay: this.search[0].valorpagado,
            agreement: this.search[0].estado,
            year: this.search[0].anio,
            month: this.search[0].mes
          };
          this.valorPago = this.search[0].valor;
          this.showData = true;
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

  reset(){
    this.showData = false;
    this.showAgreement = false;
    this.showList = false;
    this.agreement = {};
    this.find = {value:'', findInvoice: this.find.findInvoice, type: this.find.type};
    this.numCuotas = 4;
    this.acuerdoPago = {
      id: 0,
      total: 0,
      cuotas: 0,
      cuotavalor: 0,
      valorpagado: 0,
      valorpendiente: 0,
      estado: 'A',
      fechacreacion: null,
      fechainicio: { anio: 0, mes: 0 },
      plan: [],
      factura: 0
    };
    this.valorPago = 0;
    this.flagSearch = { code: 0, status: null, message: null };
    this.flagAgreement = { code: 0, status: null, message: null };
    this.flagNewAgreement = { code: 0, status: null, message: null };
    this.viewAgreement = false;
    this.typeButton = 0; // 0 = Guardar
    this.onFocus();
  }

  onFocus(){
    setTimeout(() => {
      this.buscar.nativeElement.focus();
    }, 100);
  }

  onScroll(){
    setTimeout(() => {
      const panel = document.getElementById('panelAgreement');
      if (panel) {
        panel.scrollIntoView({ behavior: 'smooth' });
      } else {
        console.warn('PanelAgreement no encontrado en el DOM');
      }
    }, 0);
  }

  onAgreement(value, panelAgreement:string){
    this.numCuotas = 4;
    this.showAgreement = false;
    this.agreement = { 
      id: value.tipoidentificacion + value.numero,
      owner: value.nombres + ' ' + value.apellidos, 
      address: value.direccion, 
      value: value.valorfactura,
      invoice: value.id,
      lastInvoice: value.ultimafactura,
      pay: value.valorpagado,
      agreement: value.estado,
      year: value.anio,
      month: value.mes
    };
    this.valorPago = value.valor;

    this.flagAgreement.code = 1; //status = load
    this.flagAgreement.message = "Cargando acuerdo";

    switch (panelAgreement) {
      case 'agreement':
        this.viewAgreement = false;
        // Desplazarme hasta la etiqueta panelAgreement
        this.onScroll();
        this.flagAgreement.code = 0; //status = success
        this.showAgreement = true;
        this.typeButton = 0; // 0 = Guardar
        this.generatePlan();
        break;
        
      case 'view':
        this.viewAgreement = true;
        this._user.findAgreement(this.agreement.invoice).subscribe(
          response => {
            if(response.status == "error"){
              this.flagAgreement.code = 2; //status = error
              this.flagAgreement.message = response.msj;
            }else{
              this.flagAgreement.code = 0; //status = success
              this.flagAgreement.message = response.msj;
              this.acuerdoPago = response.data;
              this.acuerdoPago.plan = response.fee;
              this.typeButton = response.typeButton; // 0 = Guardar, 1 = Eliminar, 2 = Cancelar
              this.numCuotas = this.acuerdoPago.cuotas;
              this.showAgreement = true;
              // Desplazarme hasta la etiqueta panelAgreement
              this.onScroll();
            }
          },
          error => { 
            this.flagAgreement.message = <any>error; 
            if(this.flagAgreement.message == null){
              this.flagAgreement.message = "Error desconocido";
            }
            this.flagAgreement.code = 2; //status = error
          }
        );
        break;
    
      default:
        break;
    }
  }

  generatePlan() {

    /* 1. Validación del número de cuotas */
    if (this.numCuotas < 1 || this.numCuotas > 12) {
      this.flagAgreement = { code: 2, message: 'El número de cuotas debe estar entre 1 y 12.' };
      setTimeout(() => {
        this.flagAgreement = { code: 0, message: '' }; // Resetear el mensaje después de 3 segundos
      }, 3000);
      return;
    }
  
    /* 2. Datos base (convertidos a número) */
    const total        = Number(this.agreement.value) - Number(this.agreement.pay); // total a refinanciar (valor factura - valor pagado)
    const startYear    = Number(this.agreement.year);   // 2025
    const startMonth   = Number(this.agreement.month);  // 3  (marzo  = 3)
  
    this.acuerdoPago = {
      id: 0, // id del acuerdo de pago (0 al crearla)
      estado: 'A', // 'A' = Activo
      fechacreacion: null, // fecha de creación del acuerdo (0 al crearla)
      valorpagado: 0, // total pagado hasta el momento (0 al crearla)
      valorpendiente: total, // total pendiente de pago (total - valorpagado)
      factura: this.agreement.invoice,
      total, // monto total a refinanciar
      cuotas: this.numCuotas,
      cuotavalor: Math.ceil((total / this.numCuotas) / 50) * 50, // redondeo al múltiplo de 50 más cercano
      fechainicio: { anio: startYear, mes: startMonth },
      plan: []
    };
  
    /* 3. Generar cuotas corrigiendo mes > 12 */
    for (let i = 0; i < this.numCuotas; i++) {
  
      const offset     = startMonth + i;            // 0-based
      const anioCuota  = startYear  + Math.floor(offset / 12);
      const mesCuota   = (offset % 12) + 1;             // 1-12
  
      const cuota: Fee = {
        cuota:        i + 1,
        anio:         anioCuota,
        mes:          mesCuota,
        valor:        this.acuerdoPago.cuotavalor,
        valorpagado:  0,
        estado:       'P'
      };
  
      this.acuerdoPago.plan.push(cuota);
    }
  
  }

  onNewAgreement() {
    this.flagNewAgreement.code = 1; //status = load
    this.flagNewAgreement.message = "Registrando acuerdo";
    this._user.newAgreement(this.acuerdoPago).subscribe(
      response => {
        if(response.status == "error"){
          this.flagNewAgreement.code = 2; //status = error
          this.flagNewAgreement.message = response.msj;
        }else{
          this.flagNewAgreement.code = 3; //status = info
          this.flagNewAgreement.message = response.msj;
          this.viewAgreement = true;
          // Buscar en el objeto Search el resgistro que coincida con el id del acuerdo y cambiar el estado a 'A' (Activo)
          const index = this.search.findIndex(item => item.id === this.acuerdoPago.factura);
          this.acuerdoPago.id = response.id; // Asignar el id del acuerdo generado
          if (index !== -1) {
            this.search[index].estado = 'A'; // Cambiar el estado a Activo}
            this.agreement.agreement = 'A'; // Cambiar el estado del acuerdo a Activo
          }
          this.typeButton = 1; // 1 = Eliminar
          setTimeout(() => {
            this.flagNewAgreement.code = 0; //status = success
            this.flagNewAgreement.message = '';
            //this.reset();
          }, 3000);
        }
      },
      error => { 
        this.flagNewAgreement.message = <any>error; 
        if(this.flagNewAgreement.message == null){
          this.flagNewAgreement.message = "Error desconocido";
        }
        this.flagNewAgreement.code = 2; //status = error
      }
    );
  }
  
  onDeleteAgreement() {
    // Preguntar si está seguro de eliminar el acuerdo
    if (!confirm('¿Estás seguro de eliminar el acuerdo?')) {
      return; // Si el usuario cancela, no hacer nada
    }
    // Eliminar el acuerdo
    this.flagNewAgreement.code = 1; //status = load
    this.flagNewAgreement.message = "Eliminando acuerdo";
    this._user.deleteAgreement(this.acuerdoPago.id).subscribe(
      response => {
        if(response.status == "error"){
          this.flagNewAgreement.code = 2; //status = error
          this.flagNewAgreement.message = response.msj;
        }else{
          this.flagNewAgreement.code = 3; //status = info
          this.flagNewAgreement.message = response.msj;
          // Buscar en el objeto Search el resgistro que coincida con el id del acuerdo y cambiar el estado a 'X' (Cancelado)
          const index = this.search.findIndex(item => item.id === this.agreement.invoice);
          if (index !== -1) {
            this.search[index].estado = null; // Cambiar el estado a null
            this.agreement.agreement = null; // Cambiar el estado del acuerdo a null
          }
          setTimeout(() => {
            this.flagNewAgreement.code = 0; //status = success
            this.flagNewAgreement.message = '';
            this.reset();
          }, 3000);
        }
      },
      error => { 
        this.flagNewAgreement.message = <any>error; 
        if(this.flagNewAgreement.message == null){
          this.flagNewAgreement.message = "Error desconocido";
        }
        this.flagNewAgreement.code = 2; //status = error
      }
    );
  }

  onCancelAgreement() {
    // Preguntar si está seguro de cancelar el acuerdo
    if (!confirm('¿Estás seguro de cancelar el acuerdo?')) {
      return; // Si el usuario cancela, no hacer nada
    }
    // Cancelar el acuerdo
    this.flagNewAgreement.code = 1; //status = load
    this.flagNewAgreement.message = "Cancelando acuerdo";
    this._user.cancelAgreement(this.acuerdoPago.id).subscribe(
      response => {
        if(response.status == "error"){
          this.flagNewAgreement.code = 2; //status = error
          this.flagNewAgreement.message = response.msj;
        }else{
          this.flagNewAgreement.code = 3; //status = info
          this.flagNewAgreement.message = response.msj;
          // Buscar en el objeto Search el resgistro que coincida con el id del acuerdo y cambiar el estado a 'X' (Cancelado)
          const index = this.search.findIndex(item => item.id === this.agreement.invoice);
          if (index !== -1) {
            this.search[index].estado = 'X'; // Cambiar el estado a Cancelado
            this.agreement.agreement = 'X'; // Cambiar el estado del acuerdo a Cancelado
          }
          setTimeout(() => {
            this.flagNewAgreement.code = 0; //status = success
            this.flagNewAgreement.message = '';
            this.reset();
          }, 3000);
        }
      },
      error => { 
        this.flagNewAgreement.message = <any>error; 
        if(this.flagNewAgreement.message == null){
          this.flagNewAgreement.message = "Error desconocido";
        }
        this.flagNewAgreement.code = 2; //status = error
      }
    );
  }

  onSortCollection(field: string): void {
    if (this.sortColumn === field) {
      // alterna asc / desc
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn    = field;
      this.sortDirection = 'asc';
    }
  
    const dir = this.sortDirection === 'asc' ? 1 : -1;
  
    this.listAgreement.sort((a, b) => {
      const vA = this.pick(a, field);
      const vB = this.pick(b, field);
  
      if (vA == null && vB == null) return 0;
      if (vA == null) return  1 * dir;
      if (vB == null) return -1 * dir;
  
      const numA = +vA, numB = +vB;
      const isNum = !isNaN(numA) && !isNaN(numB);
  
      return isNum
        ? (numA - numB) * dir
        : vA.toString().localeCompare(vB.toString()) * dir;
    });
  }

  /**  icono caret ↑ / ↓  */
  iconFor(field: string): string {
    if (field !== this.sortColumn) { return 'bi'; }
    return this.sortDirection === 'asc' ? 'bi bi-caret-up-fill'
                                        : 'bi bi-caret-down-fill';
  }

  /**  extrae el valor comparable según la columna  */
private pick(row: any, field: string): any {
  switch (field) {
    case 'numero':       return row.numero;
    case 'propietario':  return `${row.nombres} ${row.apellidos}`;
    case 'direccion':    return row.direccion;
    case 'id':           return row.id;
    case 'cuotas':       return row.cuotas;
    case 'total':        return row.total;
    case 'valorpendiente': return row.valorpendiente;
    case 'estado':       return row.estado;
    default:             return null;
  }
}

}
