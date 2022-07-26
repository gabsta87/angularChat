import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ActivitiesComponent } from './components/activities/activities.component';
import { MainComponent } from './main/main.component';
import { DiscussionComponent } from './components/discussion/discussion.component';
import { EventComponent } from './components/event/event.component';
import { PendingeventsComponent } from './components/pendingevents/pendingevents.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { MapComponent } from './components/pendingevents/map/map.component';
import { AccountComponent } from './components/account/account.component';
import { FormsModule } from '@angular/forms';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';
import { environment } from 'src/environments/environment';
import { EventEditorComponent } from './components/event-editor/event-editor.component';
import { EventCreateGuard } from './guards/event-create.guard';
import { EventEditionResolver } from './resolvers/event-edition.resolver';
import { AngularfireService } from 'src/app/shared/service/angularfire.service';
import { AccountResolver } from './resolvers/account.resolver';
import { EventDetailResolver } from './resolvers/event-detail.resolver';
import { EventEditionGuard } from './guards/event-edition.guard';
import { IsAttendingPipe } from './pipes/is-attending.pipe';
import { IsCreatorPipe } from './pipes/is-creator.pipe';


@NgModule({
  declarations: [
    MainComponent,
    ActivitiesComponent,
    DiscussionComponent,
    EventComponent,
    PendingeventsComponent,
    HeaderComponent,
    FooterComponent,
    MapComponent,
    AccountComponent,
    EventEditorComponent,
    IsAttendingPipe,
    IsCreatorPipe,
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
            component:EventComponent,
            resolve:{
              eventData:EventDetailResolver
            }
          },{
            path:'discussion',
            component:DiscussionComponent
          },{
            path:'account',
            component:AccountComponent,
            resolve:{
              accountData:AccountResolver
            }
          },{
            path:'eventedition',
            component:EventEditorComponent,
            canActivate:[EventCreateGuard],
            // canActivate:[EventCreateGuard,EventEditionGuard],
            resolve:{
              eventData:EventEditionResolver
            }
          },{
            redirectTo:"/activities",
            path:"",
            pathMatch:"full",
          }
        ]
      }
    ]),
  ],
  providers:[
    {
      provide:"MyDatabaseService",
      useClass:AngularfireService
    }
  ],
  schemas:[
    // NO_ERRORS_SCHEMA,
  ]
  // bootstrap: [],
})
export class ChatModule { }
