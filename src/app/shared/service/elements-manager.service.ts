import { Injectable } from '@angular/core';
import { firstValueFrom, map } from 'rxjs';
import { AngularfireService } from './angularfire.service';

@Injectable({
  providedIn: 'root'
})
export class ElementsManagerService {

  constructor(private readonly _db: AngularfireService) {}

  async getActivity(activityId:string){
    let temp:any = await firstValueFrom(this._db.getActivity(activityId)).then((e:any)=>console.log("temp : ",e))
  }

  async getUser(userId:string){

  }

  async getEvent(eventId:string){
    console.log("event id : ",eventId);
    let temp = await firstValueFrom(this._db.getActivity(eventId).pipe(map((e:any) => {console.log("e: ",e);return e})));
    console.log("result : ",temp);
  }




}
