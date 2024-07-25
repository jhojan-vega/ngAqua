export interface Invoice{
    'id'?: number,
	'valorfactura'?: number,
	'exedentepago'?: number,
    'idpropietario'?: number,
    'tipo'?: string,
    'numero'?: number,
    'nombres'?: string,
    'apellidos'?: string,
	'direccion'?: string,
    'telefono'?: string,
    'catastral'?: string,
    'estrato'?: string,
    'conceptos': any
}