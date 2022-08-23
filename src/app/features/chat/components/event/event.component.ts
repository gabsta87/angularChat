import { Component } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularfireService } from 'src/app/shared/service/angularfire.service';

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

  constructor(
    private readonly _route: ActivatedRoute,
    private readonly _dbAccess : AngularfireService,
    readonly _auth: Auth,
    private readonly _router: Router,
    ){}

  ionViewWillEnter(){
    this.eventData = this._route.snapshot.data['eventData'];
    console.log("event data : ",this.eventData);

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
    // activity: {name: 'Volley', id: 'LA0mTp2rJkANPU7dMP9V'}
    // attendants: [{…}]
    // creatorName: "Gabriel Maret"
    // date: "2022-08-25T13:44:00+02:00"
    // description: "asdf"
    // eventId: "26DGai9iA3Q8DfpDBs2i"
    // isCreator: true
    // isUserSubscribed: false
    // name: "Nouvelle génération 2"
    // timeStamp: 1661427840000
    // weatherIconAddress: "http://openweathermap.org/img/wn/undefined@2x.png"
    // weatherResult: undefined
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
    this._dbAccess.deleteEvent(this.eventContent.eventId);
    this._router.navigate(["pendingevents"]);
  }

  editPendingEvent(event:any){
    this._router.navigate(["eventedition"],{queryParams:{eventId:this.eventContent.eventId}});
  }
}
