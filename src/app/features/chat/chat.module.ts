import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ActivitiesComponent } from './components/activities/activities.component';

@NgModule({
  declarations: [
    ActivitiesComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild([{
      path:'',
      children:[
        {
        path:'activities',
        component:ActivitiesComponent
      },{
        path:'',
        redirectTo:'homepage',
        pathMatch:'full'
      }]
    },])
  ]
})
export class ChatModule { }
