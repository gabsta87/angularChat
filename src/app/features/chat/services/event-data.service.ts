import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EventDataService {

  eventData:any;

  constructor() { }

  setEventData(data:any){
    this.eventData = data;
  }

  getEventData(){
    return this.eventData;
  }
}
