import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Flag } from 'src/app/interfaces/flag.interface';
import { Novelty } from 'src/app/interfaces/novelty.interface';
import { Period } from 'src/app/interfaces/period.interface';

@Component({
  selector: 'app-novelty',
  templateUrl: './novelty.component.html'
})
export class NoveltyComponent implements OnInit {
  @ViewChild('deleteNovelty') deleteNovelty: ElementRef;

  public register:any;
  public entity:any;
  public concept:any[] = [];
  public property:any[] = [];
  public newNovelty:any = {inmueble: '', concepto: '', valor: null, observacion: '', mes: null, anio: null};
  public lastPeriod:any = {periodo:'', mes: null, anio: null};
  public listNovelty:any[] = [];
  public novelty:Novelty[] = [];
  public oldNovelty:Novelty[] = [];
  public period:Period[] = [];

  public months:string[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  public flagNovelty:Flag = {code: 0, status: null, message: null};
  public flagRegister:Flag = {code: 0, status: null, message: null};
  public showNovelty:boolean = false;

  public loadCreate:boolean = false;
  
  constructor(private _user:UserService) { }

  ngOnInit() {
    this.flagNovelty.code = 1; //status = load
    this.flagNovelty.message = "Cargando datos";
    this._user.readNovelty().subscribe(
      response => {
        this.register = response;
        if(this.register.status == "error"){
          this.flagNovelty.code = 2; //status = error
          this.flagNovelty.message = this.register.msj;
        }else{
          this.flagNovelty.code = 0; //status = success
          this.flagNovelty.message = this.register.msj;
          this.novelty = this.register.data;
          this.oldNovelty = this.novelty;
          this.period = this.register.period;
          this.newNovelty.mes = (this.period[0].mes == 12)? 1 : this.period[0].mes + 1;
          this.newNovelty.anio = (this.period[0].mes == 12)? this.period[0].anio + 1 : this.period[0].anio;
          this.lastPeriod = {
            periodo: this.months[this.newNovelty.mes - 1] + ' ' + this.newNovelty.anio,
            mes: this.newNovelty.mes,
            anio: this.newNovelty.anio
          };
          //console.log(this.novelty[0]);
          this.showNovelty = true;
        }
      },
      error => { 
        this.flagNovelty.message = <any>error; 
        if(this.flagNovelty.message == null){
          this.flagNovelty.message = "Error desconocido";
        }
        this.flagNovelty.code = 2; //status = error
      }
    );
  }

  createNovelty(){
    this.flagRegister.code = 1;
    this.flagRegister.message = 'Cargando Información';
    this._user.loadNovelty().subscribe(
      response => {
        this.entity = response;
        //console.log(this.entity);
        if(this.entity.status == "error"){
          this.flagRegister.code = 2; //status = error
          this.flagRegister.message = this.entity.msj;
        }else{
          this.flagRegister.code = 0; //status = success
          this.flagRegister.message = this.entity.msj;
          this.property = this.entity.data;
          this.concept = this.entity.concept;
          this.loadCreate = true;
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

  addNovelty(){
    const inmueble = this.property.find(objeto => objeto.id === this.newNovelty.inmueble);
    const concepto = this.concept.find(objeto => objeto.id === parseInt(this.newNovelty.concepto));
    const newNovelty = {
      tipo: inmueble.propietario.tipoidentificacion,
      numero: inmueble.propietario.numero,
      nombres: inmueble.propietario.nombres,
      apellidos: inmueble.propietario.apellidos,
      direccion: inmueble.direccion,
      catastral: inmueble.catastral,
      concepto: concepto.descripcion,
      valor: this.newNovelty.valor
    };
    this.listNovelty.push(newNovelty);
  }

  onSubmit(){
    this.flagRegister.code = 1; //status = load
    this.flagRegister.message = "Cargando datos";
    this._user.newNovelty(this.newNovelty).subscribe(
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

  onSelectAll(valor:boolean){
    this.novelty.forEach(item => item.seleccionado = (item.estado === '1') ? false : valor);
  }

  onDelete(){
    const deleteItems = this.novelty.filter(item => item.seleccionado).map(item => item.id);
    if(deleteItems.length > 0){
      this.flagRegister.code = 1; //status = load
      this.flagRegister.message = "Eliminando novedades";
      this._user.deleteNovelty(deleteItems).subscribe(
        response => {
          this.register = response;
          if(this.register.status == "error"){
            this.flagRegister.code = 2; //status = error
            this.flagRegister.message = this.register.msj;
          }else{
            this.flagRegister.code = 3; //status = info
            this.flagRegister.message = this.register.msj;
            this.ngOnInit();
            this.deleteNovelty.nativeElement.checked = false;
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

  onChange(item:any){
    if(item === '0'){
      this.novelty = this.oldNovelty;
    }else{
      this.novelty = this.oldNovelty;
      const [mes, anio] = item.split('|');
      this.novelty = this.novelty.filter(novelties => novelties.mes == mes && novelties.anio == anio);
      console.log(this.oldNovelty);
    }
  }
}
