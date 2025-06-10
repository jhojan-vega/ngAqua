import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/interfaces/user.interface';
import { Flag } from 'src/app/interfaces/flag.interface';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styles: []
})
export class UserComponent implements OnInit, AfterViewInit {
  @ViewChild('createModal') createModal: ElementRef;

  public register: any;
  public user: User[] = [];
  public index: number = null;
  public oldUser: User;
  public newUser: User = { id: null, tipoIdentificacion: '', role: { id: 1 }, estado: '1' };
  public flagUser: Flag = { code: 0, status: null, message: null };
  public flagRegister: Flag = { code: 0, status: null, message: null };
  public showUser: boolean = false;

  public edit: boolean = false;
  public success: boolean = false;

  constructor(private _user: UserService) {}

  ngOnInit() {
    this.flagUser.code = 1;
    this.flagUser.message = "Cargando datos ...";
    this._user.readUser().subscribe(
      response => {
        this.register = response;
        if (this.register.status === "error") {
          this.flagUser.code = 2;
          this.flagUser.message = this.register.msj;
        } else {
          this.flagUser.code = 0;
          this.flagUser.message = this.register.msj;
          this.user = this.register.data;
          this.showUser = true;
        }
      },
      error => {
        this.flagUser.message = <any>error || "Error desconocido";
        this.flagUser.code = 2;
      }
    );
  }

  ngAfterViewInit() {
    this.createModal.nativeElement.addEventListener('hidden.bs.modal', () => {
      if (this.edit && !this.success) {
        this.register.data[this.index] = Object.assign({}, this.oldUser);
      }
    });
  }

  reset() {
    this.flagRegister.code = 0;
    this.flagRegister.message = '';
    this.newUser = {
      id: null,
      tipoIdentificacion: '',
      numero: '',
      nombres: '',
      apellidos: '',
      telefono: '',
      correo: '',
      estado: '1',
      role: { id: 1 }
    };
    this.edit = false;
    this.success = false;
  }

  onEdit(editUser: User, index: number) {
    this.index = index;
    this.oldUser = Object.assign({}, editUser);
    this.reset();
    this.newUser = Object.assign({}, editUser);
    this.edit = true;
  }

  onSubmit() {
    const tarea = this.edit ? 'E' : 'C';
    this.flagRegister.code = 1;
    this.flagRegister.message = "Guardando datos ...";

    this._user.newUser(this.newUser, tarea).subscribe(
      response => {
        this.register = response;
        if (this.register.status === "error") {
          this.flagRegister.code = 2;
          this.flagRegister.message = this.register.msj;
        } else {
          this.flagRegister.code = 3;
          this.flagRegister.message = this.register.msj;
          this.success = true;
          this.ngOnInit();
        }
      },
      error => {
        this.flagRegister.message = <any>error || "Error desconocido";
        this.flagRegister.code = 2;
      }
    );
  }

  onDelete(id:string) {
    let respuesta = confirm('¿Estás seguro que desea borrar este usuario?');
    if(respuesta) {
      if(this.user.length === 1) {
        this.flagUser.code = 3;
        this.flagUser.message = "No se puede eliminar el último usuario";
        //Eliminar el mensaje después de 3 segundos
        setTimeout(() => {
          this.flagUser.code = 0;
          this.flagUser.message = '';
        }, 3000);
        return;
      }
      this.flagUser.code = 1;
      this.flagUser.message = "Eliminando Usuario ...";
      this._user.deleteUser(id).subscribe(
        response => {
          this.register = response;
          if (this.register.status === "error") {
            this.flagUser.code = 2;
            this.flagUser.message = this.register.msj;
          } else {
            this.flagUser.code = 3;
            this.flagUser.message = this.register.msj;
            //Recargar la lista de usuarios del objeto user
            this.user = this.user.filter((user) => user.id !== parseInt(id));
            //Eliminar el mensaje después de 3 segundos
            setTimeout(() => {
              this.flagUser.code = 0;
              this.flagUser.message = '';
            }, 3000);
          }
        },
        error => {
          this.flagUser.message = <any>error || "Error desconocido";
          this.flagUser.code = 2;
        }
      );
    }
  }

  getRoleName(role: any): string {
    if (!role || !role.id) return 'Desconocido';
    switch (role.id) {
      case 1: return 'Administrador';
      case 2: return 'Facturador';
      case 3: return 'Revisor';
      default: return 'Desconocido';
    }
  }
}
