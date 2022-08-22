import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IonicModule } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { AnonymousComponent } from './features/login/components/anonymous/anonymous.component';
import { GmailComponent } from './features/login/components/gmail/gmail.component';
import { FacebookComponent } from './features/login/components/facebook/facebook.component';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { provideStorage,getStorage } from '@angular/fire/storage';
import { ServiceWorkerModule } from '@angular/service-worker';
import localeCh from '@angular/common/locales/fr-CH';
import { registerLocaleData } from '@angular/common';
registerLocaleData(localeCh);

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
    IonicModule.forRoot(),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [{provide:LOCALE_ID,useValue:"fr-CH"}],
  bootstrap: [AppComponent]
})
export class AppModule { }
