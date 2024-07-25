import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'convertir'
})
export class ConvertirPipe implements PipeTransform {
	transform(value: any, tipo: string): any {
		let dato:string;
		switch (tipo) {
			case "fecha":
				var a = new Date(value * 1000);
				var months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
				var year = a.getFullYear();
				var month = months[a.getMonth()];
				var date = a.getDate();
				//var hour = a.getHours();
				//var min = a.getMinutes();
				//var sec = a.getSeconds();
				var time = date + '/' + month + '/' + year; //+ ' ' + hour + ':' + min + ':' + sec ;
				dato = time;
				break;

			case "mes":
				var months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
				var month = months[value-1];
				dato = month;
				break;
            
            case "novelty":
				switch (value) {
                    case '1':
                        dato = "Aplicada";
                        break;
                
                    case '0':
                        dato = " No Aplicada";
                        break;
                
                    default:
                        dato = "No se reconoce el valor novelty";
                        break;
                }
				break;

			default:
				dato ="No definido el tipo [" + tipo + "]";
				break;
		}
		
		return dato;
	}
}