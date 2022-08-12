import { Component } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AngularfireService } from 'src/app/shared/service/angularfire.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent{

  eventId!:string;
  eventContent!:any;
  creatorName!:any;
  activity!:any;

  isAttending!:boolean;
  isCreator!:boolean|null;
  isUserSubscribed!:boolean|null;

  constructor(
    private readonly _route: ActivatedRoute,
    private readonly _dbAccess : AngularfireService,
    private readonly _auth: Auth,
    private readonly _router: Router
  ){}

  ionViewWillEnter(){
    this.eventId = this._route.snapshot.queryParams["eventId"];
    this.loadData();
  }

  async loadData(){
    this.eventContent = await firstValueFrom(this._dbAccess.getEvent(this.eventId));
    this.creatorName = await this._dbAccess.getUser(this.eventContent?.creatorId);
    this.activity = await firstValueFrom(this._dbAccess.getActivity(this.eventContent?.activityId));
    console.log("creator ? ",this.isCreator,", current uid : ",this._auth.currentUser?.uid," event creator id : ",this.eventContent.creatorId);
    this.isCreator = this._auth.currentUser?.uid === this.eventContent?.creatorId;
    this.isUserSubscribed = this.eventContent.attendantsId?.includes(this._auth.currentUser?.uid);
  }

  subscribe(){
    if(this.isAttending){
      this._dbAccess.addUserToEvent(this.eventId);
    }else{
      this._dbAccess.removeUserFromEvent(this.eventId);
    }
  }

  deletePendingEvent(event:any){
    this._dbAccess.deleteEvent(this.eventId);
    this._router.navigate(["pendingevents"]);
  }
}
