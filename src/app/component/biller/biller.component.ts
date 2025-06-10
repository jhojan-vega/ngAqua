import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-biller',
  templateUrl: './biller.component.html'
})
export class BillerComponent implements OnInit {

  constructor(private _loginService:LoginService, private _userService:UserService, private _router:Router) { }

  ngOnInit() {
    let id = this._loginService.getIdentity();
    if(id == null){
      this._router.navigate(['/login']);
    }else{
      if(id.eX2R != '644e47c31d3268b44fe99aebe895191f592f0ae1e5d7766c276fc0e6c75c0b67') this.onExit();
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
