import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styles: []
})
export class IndexComponent implements OnInit {

  constructor(private _loginService:LoginService, private _router:Router) { }

  ngOnInit() {
    let id = this._loginService.getIdentity();
    if(id == null){
      this._router.navigate(['/login']);
    }
  }

  onExit(){
    localStorage.removeItem("identity");
    localStorage.removeItem("token");
    localStorage.removeItem("student");
    this._router.navigate(['/login']);
  }

}
