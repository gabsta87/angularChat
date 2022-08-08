import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
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
import { FormsModule } from '@angular/forms';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';
import { environment } from 'src/environments/environment';


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
    FormsModule,
    NgxMapboxGLModule.withConfig({
      accessToken: environment.mapbox.accessToken, // Optional, can also be set per map (accessToken input of mgl-map)
    }),
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
  schemas:[
    NO_ERRORS_SCHEMA,
  ]
  // bootstrap: [],
})
export class ChatModule { }
