import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AngularfireService } from 'src/app/shared/service/angularfire.service';

export interface Event{
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
  attendants:{id:string,name:string}[];
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

    let eventId = route.queryParams["eventId"];

    let result:Event = {} as Event;
    let attendantsIds!:string[];

    if(eventId){
      let temp:any = await firstValueFrom(this._dbAccess.getEvent(eventId));

      if(temp){
        result.id = temp['id'];
        result.description = temp['description'];
        result.date = new Date(temp['date']).toISOString();
        result.name = temp['name'];
        result.activityId = temp['activityId'];
        result.creatorId = temp['creatorId'];
        result.position = {latitude:temp['position'].latitude,longitude:temp['position'].longitude}
        attendantsIds = temp['attendantsId'];
      }
      // let activities:{id:string,name:string}[] = firstValueFrom(await this._dbAccess.getActivities());
      let activity:any = await firstValueFrom(this._dbAccess.getActivity(result.activityId));
      result.activityName = activity.name;

      let creator:any =await this._dbAccess.getUser(result.creatorId);
      result.creatorName = creator.name;

      let attendants:any = await this._dbAccess.getUsers();

      // result.attendants = new Map();
      // attendantsIds.forEach((id:string) => result.attendants.set(id,attendants.find((attend:any) => attend.id === id)))

      result.attendants = [];
      attendantsIds.forEach((id:string) => result.attendants.push({id:id,name:attendants.find((attend:any) => attend.id === id)}))
    }else{
      result.position = {latitude:route.queryParams["latitude"],longitude:route.queryParams["longitude"]}
    }
    console.log("result = ",result);

    return result;
  }
}
