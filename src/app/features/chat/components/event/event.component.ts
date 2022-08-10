import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AngularfireService } from 'src/app/shared/service/angularfire.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent {

  eventId!:string;
  eventContent!:any;
  creatorName!:any;
  activity!:any;

  constructor(
    private readonly _route: ActivatedRoute,
    private readonly _dbAccess : AngularfireService
  ){}

  ionViewWillEnter(){
    this.eventId = this._route.snapshot.queryParams["eventId"];
    console.log("event id : ",this.eventId);
    this.loadData();
  }

  async loadData(){
    this.eventContent = await firstValueFrom(this._dbAccess.getEvent(this.eventId));
    console.log("event content : ",this.eventContent);
    this.creatorName = await this._dbAccess.getUser(this.eventContent?.creatorId);
    this.activity = await firstValueFrom(this._dbAccess.getActivity(this.eventContent?.activityId));
  }

  subscribe(event:any){
    console.log(event.target.value);
    this._dbAccess.addUserToEvent(this.eventId);
  }

}
