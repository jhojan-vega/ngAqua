import { Component, OnInit } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { Flag } from 'src/app/interfaces/flag.interface';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-dash-board',
  templateUrl: './dash-board.component.html',
  styles: []
})
export class DashBoardComponent implements OnInit {

  public flagDash:Flag = {code: 0, status: null, message: null};
  public showDash:boolean = false;

  single1:any = [];
  single2:any = [];
  multi1:any = [];
  multi2:any = [];

  //Variables Gráfica 1

  view: any[] = [300, 200];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showXAxisLabel = true;
  xAxisLabel = 'Estados';
  showYAxisLabel = true;
  yAxisLabel = 'Inmuebles';

  colorScheme = {
    domain: ['#f4bfbf', '#d7e2ca', '#a1d9d9', '#d9d9a1']
  };

  //Variables Gráfica 2

  view1: any[] = [600, 200];

  // options
  showXAxis1: boolean = true;
  showYAxis1: boolean = true;
  gradient1: boolean = false;
  showLegend1: boolean = true;
  yScaleMax1: number = 1000000;
  showXAxisLabel1: boolean = true;
  xAxisLabel1: string = 'Meses';
  showYAxisLabel1: boolean = true;
  yAxisLabel1: string = 'Pesos';
  legendTitle1: string = 'Etiquetas';

  colorScheme1 = {
    domain: ['#d7e2ca', '#f4bfbf', '#a1d9d9', '#d9d9a1']
  };

  //Variables Gráfica 3

  view2: any[] = [600, 200];

  // options
  showXAxis2: boolean = true;
  showYAxis2: boolean = true;
  gradient2: boolean = false;
  showLegend2: boolean = true;
  yScaleMax2: number = 1000000;
  showXAxisLabel2: boolean = true;
  xAxisLabel2: string = 'Meses';
  showYAxisLabel2: boolean = true;
  yAxisLabel2: string = 'Facturas';
  legendTitle2: string = 'Etiquetas';

  //Variables Gráfica 4

  view4: any[] = [300, 300];

  // options
  gradient4: boolean = false;
  showLegend4: boolean = true;
  showLabels4: boolean = true;
  isDoughnut4: boolean = false;
  legendPosition4: string = 'bown';

  private register:any;

  constructor(private _user:UserService) {
    //Object.assign(this, { single })
  }

  ngOnInit() {
    this.flagDash.code = 1; //status = load
    this.flagDash.message = "Cargando datos";
    this._user.readDash().subscribe(
      response => {
        this.register = response;
        if(this.register.status == "error"){
          this.flagDash.code = 2; //status = error
          this.flagDash.message = this.register.msj;
        }else{
          this.flagDash.code = 0; //status = success
          this.single1 = this.register.single1;
          this.single2 = this.register.single2;
          this.multi1 = this.register.multi1;
          this.multi2 = this.register.multi2;
          this.yScaleMax1 = this.register.yScaleMax1;
          this.yScaleMax2 = this.register.yScaleMax2;
          this.showDash = true;
        }
      },
      error => { 
        this.flagDash.message = <any>error; 
        if(this.flagDash.message == null){
          this.flagDash.message = "Error desconocido";
        }
        this.flagDash.code = 2; //status = error
      }
    );
  }

  onActivate(data): void {
    //console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    //console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  onSelect(event) {
    //console.log(event);
  }

}
