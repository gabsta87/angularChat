import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ActivitiesComponent } from './components/activities/activities.component';
import { MainComponent } from './main/main.component';
import { DiscussionComponent } from './components/discussion/discussion.component';
import { PendingrequestsComponent } from './components/pendingrequests/pendingrequests.component';
import { EventComponent } from './components/event/event.component';
import { PendingeventsComponent } from './components/pendingevents/pendingevents.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { MapComponent } from './components/pendingevents/map/map.component';
import { AccountComponent } from './components/account/account.component';

@NgModule({
  declarations: [
    MainComponent,
    ActivitiesComponent,
    DiscussionComponent,
    PendingrequestsComponent,
    EventComponent,
    PendingeventsComponent,
    HeaderComponent,
    FooterComponent,
    MapComponent,
    AccountComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild(
      [{
        path:'',
        component:MainComponent,
        children:[
          {
            path:'activities',
            component:ActivitiesComponent
          },{
            path:'pendingrequests',
            component:PendingrequestsComponent
          },{
            path:'pendingevents',
            component:PendingeventsComponent
          },{
            path:'event',
            component:EventComponent
          },{
            path:'discussion',
            component:DiscussionComponent
          },{
            path:'account',
            component:AccountComponent
          },
        ]
      },]
    ),
  ],
  providers:[
  ],
})
export class ChatModule { }
