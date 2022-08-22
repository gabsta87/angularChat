import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AngularfireService } from 'src/app/shared/service/angularfire.service';

interface Event{
  name:string;
  id:string;
  activityId:string;
  activityName:string;
  creatorId:string;
  creatorName:string;
  date:string;
  description:string;
  timeStamp:number;
  position:{latitude:number,longitude:number};
  attendants:Map<string,string>;
}

@Injectable({
  providedIn: 'root'
})
export class EventEditionResolver implements Resolve<Event> {

  constructor(private readonly _dbAccess:AngularfireService){}

  async resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    ): Promise<Event> {

    // let eventId = route.paramMap.get("eventId");
    let eventId = route.queryParams["eventId"];

    console.log("event id : ",eventId);

    let result:Event = {} as Event;
    let attendantsIds!:string[];

    if(eventId){
      let temp:any = await firstValueFrom(this._dbAccess.getEvent(eventId));
      console.log("temp : ",temp);

      if(temp){
        result.description = temp['description'];
        result.date = new Date(temp['date']).toISOString();
        result.name = temp['name'];
        result.activityId = temp['activityId'];
        result.creatorId = temp['creatorId']
        result.position = {latitude:temp['position'].latitude,longitude:temp['position'].longitude}
        attendantsIds = temp['attendantsID'];
      }
      // let activities:{id:string,name:string}[] = firstValueFrom(await this._dbAccess.getActivities());
      let activity:any = await firstValueFrom(this._dbAccess.getActivity(result.activityId));
      result.activityName = activity.name;

      let creator:any =await this._dbAccess.getUser(result.creatorId);
      result.creatorName = creator.name;

      let attendants:any = await this._dbAccess.getUsers();
      console.log("attendants IDs : ",attendantsIds);
      console.log("attendants : ",attendants);
      console.log("temp : ",temp);
      
      attendantsIds.forEach((id:string,index) => result.attendants.set(id,attendants.find((attend:any) => attend.id === id)))
    }else{
      let tempLat = route.paramMap.get("latitude");
      if(tempLat)
        result.position.latitude = parseFloat(tempLat)

      let tempLong = route.paramMap.get("longitude");
      if(tempLong)
        result.position.longitude = parseFloat(tempLong)
    }
    console.log("result = ",result);

    return result;
  }
}
