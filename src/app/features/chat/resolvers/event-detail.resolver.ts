import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AngularfireService } from 'src/app/shared/service/angularfire.service';
import { WeatherService } from 'src/app/shared/service/weather.service';

interface EventDetail{
  eventId:string,
  name:string,
  creatorName:string,
  activity:any,
  creatorId:string,
  isCreator:boolean,
  date:string,
  description:string,
  timeStamp:number,
  attendants:any[],
  isUserSubscribed:boolean,
  weatherResult:any,
  weatherIconAddress:string,
}

@Injectable({
  providedIn: 'root'
})
export class EventDetailResolver implements Resolve<EventDetail> {

  constructor(private readonly _auth:Auth, 
    private readonly _dbAccess: AngularfireService,
    private readonly _weather: WeatherService){}

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<EventDetail> {
    let result = {} as EventDetail;
    result.eventId = route.queryParams["eventId"];
    result.attendants = [];

    let eventContent = await firstValueFrom(this._dbAccess.getEvent(result.eventId));

    if(eventContent){
      eventContent['attendantsId']?.forEach(async (element:any) => {
        let attendantName = await this._dbAccess.getUser(element);

        if(attendantName){
          if(attendantName['name'] === null)
            attendantName['name'] = "anonymous"
          result.attendants.push(attendantName)
        }
      });
      let creator = await this._dbAccess.getUser(eventContent['creatorId']);
      if(creator){
        result.creatorName = creator['name'];
        result.isCreator = this._auth.currentUser?.uid === eventContent['creatorId'];
        result.isUserSubscribed = eventContent['attendantsId'].includes(this._auth.currentUser?.uid);
      }
      result.date = eventContent['date'];
      result.name = eventContent['name'];
      result.timeStamp = eventContent['timeStamp'];
      result.description = eventContent['description'];
      result.activity = await firstValueFrom(this._dbAccess.getActivity(eventContent['activityId']));
      result.weatherResult = await this._weather.getWeather(
        eventContent['position'].latitude,
        eventContent['position'].longitude,
        eventContent['date']);
    }
    result.weatherIconAddress =  `http://openweathermap.org/img/wn/${result.weatherResult?.icon}@2x.png`;
    return result;
  }
}
