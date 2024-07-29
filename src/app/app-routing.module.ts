import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './component/login/login.component';
import { IndexComponent } from './component/index/index.component';
import { OwnerComponent } from './component/owner/owner.component';
import { PropertyComponent } from './component/property/property.component';
import { LandpageComponent } from './component/landpage/landpage.component';
import { InvoiceComponent } from './component/invoice/invoice.component';
import { PeriodComponent } from './component/period/period.component';
import { PayComponent } from './component/pay/pay.component';
import { NoveltyComponent } from './component/novelty/novelty.component';
import { DashBoardComponent } from './component/dash-board/dash-board.component';

const routes: Routes = [
  {path:'login', component: LoginComponent},
  {path:'index', component: IndexComponent, children: [
    {path: '', redirectTo: 'landpage', pathMatch: 'full'}, 
    {path:'owner', component: OwnerComponent},
    {path:'landpage', component: LandpageComponent},
    {path:'invoice', component: InvoiceComponent},
    {path:'period', component: PeriodComponent},
    {path:'pay', component: PayComponent},
    {path:'novelty', component: NoveltyComponent},
    {path:'property', component: PropertyComponent},
    {path:'dashBoard', component: DashBoardComponent}
  ]},
  {path:'', redirectTo: '/login', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
