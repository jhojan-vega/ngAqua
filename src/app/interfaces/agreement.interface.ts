/*--------------------------------------------------------------
 |  1 · Estructura de una cuota individual dentro del plan
 *-------------------------------------------------------------*/
 export interface Fee {
    /** número secuencial: 1, 2, 3 … */
    cuota:       number;
  
    /** fecha de vencimiento */
    anio:        number;   // 4 dígitos
    mes:         number;   // 1 – 12
  
    /** valores monetarios */
    valor:       number;   // importe original de la cuota
    valorpagado: number;   // abonos recibidos (0 al crearla)
  
    /** estado actual */
    estado:      'P' | 'A' | 'V' | 'G' | 'X'; // 'P' = Pendiente, 'A' = Asignada, 'V' = Vencida, 'G' = Pagada, 'X' = Cancelada
  }
  
  /*--------------------------------------------------------------
   | 2 · Resultado completo que genera la función: “plan” de cuotas
   *-------------------------------------------------------------*/
  export interface generatedPlan {
    id?:            number;   // id del acuerdo de pago (0 al crearla)
    factura:        any;   // cuerpo de la factura a la que pertenece (0 al crearla)
    total:          number;   // monto total a refinanciar
    valorpagado:    number;   // total pagado hasta el momento (0 al crearla)
    valorpendiente: number; // total pendiente de pago (total - valorpagado)
    cuotas:         number;   // nº de cuotas solicitadas
    cuotavalor:     number;   // total / cuotas (redondeado)
    estado:         'A' | 'C' | 'X'; // 'A' = Activo, 'C' = Cumplido, 'X' = Cancelado
    fechacreacion:  any; // fecha de creación del acuerdo (0 al crearla)
    
    /** primer periodo en que empezará a cobrarse */
    fechainicio: {
      anio: number;
      mes:  number;
    };
  
    /** arreglo con todas las cuotas (tipo Cuota[]) */
    plan: Fee[];
  }
  