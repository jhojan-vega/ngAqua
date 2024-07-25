import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule} from "@angular/common/http";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './component/login/login.component';
import { IndexComponent } from './component/index/index.component';
import { OwnerComponent } from './component/owner/owner.component';
import { PropertyComponent } from './component/property/property.component';
import { LandpageComponent } from './component/landpage/landpage.component';
import { InvoiceComponent } from './component/invoice/invoice.component';
import { PeriodComponent } from './component/period/period.component';
import { PayComponent } from './component/pay/pay.component';
import { NoveltyComponent } from './component/novelty/novelty.component';

import { LoginService } from './services/login.service';
import { UserService } from './services/user.service';

import { ConvertirPipe } from './pipes/convertir.pipes';

import { NgSelectModule } from '@ng-select/ng-select';

//Estas líneas se usan para configurar el idioma de las fechas en español
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es-CO';

registerLocaleData(localeEs, 'es-CO');

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    IndexComponent,
    OwnerComponent,
    PropertyComponent,
    LandpageComponent,
    InvoiceComponent,
    PeriodComponent,
    PayComponent,
    NoveltyComponent,
    ConvertirPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgSelectModule
  ],
  providers: [
    LoginService,
    UserService,
    { provide: LOCALE_ID, useValue: 'es-CO' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
