import { Component } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AngularfireService } from 'src/app/shared/service/angularfire.service';
import { ElementsManagerService } from 'src/app/shared/service/elements-manager.service';
import { WeatherService } from 'src/app/shared/service/weather.service';

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
  attendants:any[] = [];

  isCreator!:boolean|null;
  isUserSubscribed!:boolean|null;

  weatherResult!:any;
  weatherIconAddress!:string;

  constructor(
    private readonly _route: ActivatedRoute,
    private readonly _dbAccess : AngularfireService,
    private readonly _auth: Auth,
    private readonly _router: Router,
    private readonly _weather: WeatherService,
    private readonly _elemManager: ElementsManagerService
    ){}

  ionViewWillEnter(){
    this.eventId = this._route.snapshot.queryParams["eventId"];
    this.loadData();
  }

  async loadData(){
    this._elemManager.getEvent(this.eventId);
    this.initAttendants();
    this.creatorName = await this._dbAccess.getUser(this.eventContent?.creatorId);
    this.activity = await firstValueFrom(this._dbAccess.getActivity(this.eventContent?.activityId));
    this.isCreator = this._auth.currentUser?.uid === this.eventContent?.creatorId;
    this.isUserSubscribed = this.eventContent.attendantsId?.includes(this._auth.currentUser?.uid);
    this.weatherResult = await this._weather.getWeather(
      this.eventContent.position.latitude,
      this.eventContent.position.longitude,
      this.eventContent.date);
    this.weatherIconAddress =  `http://openweathermap.org/img/wn/${this.weatherResult?.icon}@2x.png`;
  }

  async subscribe(){
    if(this.isUserSubscribed){
      this._dbAccess.addUserToEvent(this.eventId);
    }else{
      this._dbAccess.removeUserFromEvent(this.eventId);
    }
    this.initAttendants();
  }

  async initAttendants(){
    this.attendants = [];
    this.eventContent = await firstValueFrom(this._dbAccess.getEvent(this.eventId));
    this.eventContent.attendantsId?.forEach(async (element:any) => {
      let attendantName = await this._dbAccess.getUser(element);

      if(attendantName){
        if(attendantName['name'] === null)
          attendantName['name'] = "anonymous"
        this.attendants.push(attendantName)
      }
    });
  }

  deletePendingEvent(event:any){
    this._dbAccess.deleteEvent(this.eventId);
    this._router.navigate(["pendingevents"]);
  }

  editPendingEvent(event:any){
    this._router.navigate(["eventedition"],{queryParams:{eventId:this.eventId}});
  }
}
