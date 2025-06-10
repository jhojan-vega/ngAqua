import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-auditor',
  templateUrl: './auditor.component.html',
  styles: []
})
export class AuditorComponent implements OnInit {

  constructor(private _loginService:LoginService, private _userService:UserService, private _router:Router) { }
  
  ngOnInit() {
    let id = this._loginService.getIdentity();
    if(id == null){
      this._router.navigate(['/login']);
    }else{
      if(id.eX2R != '859f447e740ca242b669fe8dfa6e3a2343c6884cbed40fe546c72c02b900299c') this.onExit();
      //Cargar datos de la empresa
      this._userService.getData().subscribe(response => {
        localStorage.setItem("params", JSON.stringify(response));
      });
      //Fin
    }

  }

  onExit(){
    localStorage.removeItem("identity");
    localStorage.removeItem("token");
    localStorage.removeItem("params");
    this._router.navigate(['/login']);
  }

}
