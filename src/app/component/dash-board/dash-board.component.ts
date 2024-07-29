import { Component, OnInit } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-dash-board',
  templateUrl: './dash-board.component.html',
  styles: []
})
export class DashBoardComponent implements OnInit {

  single = [
    {
      "name": "Activos",
      "value": 120
    },
    {
      "name": "Inactivos",
      "value": 3
    }
  ];
  
  ngOnInit() {
  }

  multi = [
    {
      "name": "Julio",
      "series": [
        {
          "name": "Recaudo",
          "value": 730000
        },
        {
          "name": "Cartera",
          "value": 894000
        }
      ]
    },
  
    {
      "name": "Junio",
      "series": [
        {
          "name": "Recaudo",
          "value": 787000
        },
        {
          "name": "Cartera",
          "value": 827000
        }
      ]
    },
  
    {
      "name": "Mayo",
      "series": [
        {
          "name": "Recaudo",
          "value": 500002
        },
        {
          "name": "Cartera",
          "value": 580000
        }
      ]
    }
  ];

  view: any[] = [300, 200];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showXAxisLabel = true;
  xAxisLabel = 'Estados';
  showYAxisLabel = true;
  yAxisLabel = 'Usuarios';

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };


  //Variables Gráfica 2

  view1: any[] = [600, 200];

  // options
  showXAxis1: boolean = true;
  showYAxis1: boolean = true;
  gradient1: boolean = false;
  showLegend1: boolean = true;
  yScaleMax: number = 1000000;
  showXAxisLabel1: boolean = true;
  xAxisLabel1: string = 'Meses';
  showYAxisLabel1: boolean = true;
  yAxisLabel1: string = 'Pesos';
  legendTitle1: string = 'Etiquetas';

  colorScheme1 = {
    domain: ['#3a7ee7', '#f9bf3b', '#f9bf3b']
  };

  
  onActivate(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  constructor() {
    //Object.assign(this, { single })
  }

  onSelect(event) {
    console.log(event);
  }

}
