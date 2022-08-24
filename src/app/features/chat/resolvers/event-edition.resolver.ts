import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { EventDataService } from '../services/event-data.service';

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

  constructor(private readonly _dataService:EventDataService){}

  async resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    ): Promise<Event> {
      let result = this._dataService.getEventData();

      let newPosition = {latitude:route.queryParams["latitude"],longitude:route.queryParams["longitude"]}

      if(result === undefined)
        result = {} as Event;
      if(newPosition.latitude && newPosition.longitude)
        result.position = newPosition;
    return result;
  }
}
