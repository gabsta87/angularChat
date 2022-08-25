import { Component } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularfireService } from 'src/app/shared/service/angularfire.service';
import { EventDataService } from '../../services/event-data.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent{
  eventData:any;

  eventContent = {} as any;
  creatorName!:string;
  activity!:any;
  attendants:any[] = [];

  isCreator!:boolean;
  isUserSubscribed!:boolean;

  weatherResult!:any;
  weatherIconAddress!:string;

  isLoggedConst!:any;

  editing = false;

  constructor(
    private readonly _route: ActivatedRoute,
    private readonly _dbAccess : AngularfireService,
    readonly _auth: Auth,
    private readonly _router: Router,
    private readonly _dataService:EventDataService
    ){}

  ionViewWillEnter(){
    this.eventData = this._route.snapshot.data['eventData'];
    this._dataService.setEventData(this.eventData);

    this.isLoggedConst = this._auth.currentUser;
    this.creatorName = this.eventData.creatorName;
    this.activity = this.eventData.activity;
    this.isCreator = this.eventData.isCreator;
    this.isUserSubscribed = this.eventData.isUserSubscribed;
    this.weatherResult = this.eventData.weatherResult;
    this.weatherIconAddress =  this.eventData.weatherIconAddress;

    this.eventContent.id = this.eventData.eventId;
    this.eventContent.date =  this.eventData.date;
    this.eventContent.description =  this.eventData.description;
    this.eventContent.name =  this.eventData.name;
    this.eventContent.timeStamp =  this.eventData.timeStamp;
    this.eventContent.attendants =  this.eventData.attendants;
    this.editing = false;
  }

  async subscribe(){
    if(!this.isUserSubscribed){
      this._dbAccess.addUserToEvent(this.eventContent.id);
    }else{
      this._dbAccess.removeUserFromEvent(this.eventContent.id);
    }
  }

  isLogged(){
    return this._auth.currentUser?.uid;
  }

  deletePendingEvent(event:any){
    this._dbAccess.deleteEvent(this.eventContent.id);
    this._router.navigate(["pendingevents"]);
  }

  editPendingEvent(event:any){
    this.editing = true;
    this._router.navigate(["eventedition"],{queryParams:{eventId:this.eventContent.id}});
  }

  ionViewDidLeave(){
    if(!this.editing)
      this.clearFields();
  }

  clearFields(){
    this.eventData = undefined;

    this._dataService.clearEventData();

    this.creatorName = "";
    this.activity = "";
    this.isCreator = true;
    this.isUserSubscribed = false;
    this.weatherResult = "";
    this.weatherIconAddress = "";

    this.eventContent.id = "";
    this.eventContent.date = "";
    this.eventContent.description = "";
    this.eventContent.name = "";
    this.eventContent.timeStamp = "";
    this.eventContent.attendants = "";
    this.editing = false;
  }
}
