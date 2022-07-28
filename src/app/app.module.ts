import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IonicModule } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { AnonymousComponent } from './features/login/components/anonymous/anonymous.component';
import { GmailComponent } from './features/login/components/gmail/gmail.component';
import { FacebookComponent } from './features/login/components/facebook/facebook.component';

@NgModule({
  declarations: [
    AppComponent,
    AnonymousComponent,
    GmailComponent,
    FacebookComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    IonicModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
