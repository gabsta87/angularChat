import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IonicModule } from '@ionic/angular';
import { MessageslistComponent } from './features/ui/messageslist/messageslist.component';
import { EntryboxComponent } from './features/ui/entrybox/entrybox.component';
import { ChatslistComponent } from './features/ui/chatslist/chatslist.component';
import { EventdetailsComponent } from './features/ui/eventdetails/eventdetails.component';

@NgModule({
  declarations: [
    AppComponent,
    MessageslistComponent,
    EntryboxComponent,
    ChatslistComponent,
    EventdetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    IonicModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
