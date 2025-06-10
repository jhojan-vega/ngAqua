export interface Role {
	id?: number;
	descripcion?: string;
  }
  
  export interface User {
	id?: number;
	tipoIdentificacion?: string;
	numero?: string;
	nombres?: string;
	apellidos?: string;
	telefono?: string;
	correo?: string;
	estado?: string;
	role?: Role;
  }
  