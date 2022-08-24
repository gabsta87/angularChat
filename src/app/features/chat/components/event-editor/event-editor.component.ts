import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom, of } from 'rxjs';
import { AngularfireService } from 'src/app/shared/service/angularfire.service';
import { NgForm } from '@angular/forms';
import { EventDataService } from '../../services/event-data.service';

@Component({
  selector: 'app-event-editor',
  templateUrl: './event-editor.component.html',
  styleUrls: ['./event-editor.component.scss']
})
export class EventEditorComponent{

  parentPage!:string;

  eventData!:any;
  activities!:any;

  eventTitle!:string;
  eventDate!:string;
  // eventDate = "2022-08-25T11:42:00.000Z";
  eventDescription!:string;
  attendants!:any[];
  eventType!:string;
  today!:string;

  ionViewDidLeave(){
    this.initFields();
  }

  async ionViewWillEnter(){
    this.eventData = this._route.snapshot.data['eventData'];
    this.eventDate = "";
    this.activities = await firstValueFrom(this._dbAccess.getActivities());

    if(this.eventData.eventId){
      this.eventTitle = this.eventData.name;
      if(this.eventData.date)
        this.eventDate = new Date(this.eventData.date).toISOString();
      this.eventDescription = this.eventData.description;
      this.eventType = this.eventData.activity.id;
    }

    this.today = new Date(Date.now()).toISOString();
  }

  constructor(
    private readonly _dbAccess: AngularfireService,
    private readonly _router: Router,
    private readonly _route:ActivatedRoute,
    private readonly _dataService:EventDataService
    // @Inject("MyDataService") private readonly myNewDataService: DataAccess
    ){}

  cancelAction(){
    this.initFields();
    this._router.navigate(["pendingevents"]);
  }

  private initFields(){
    this._dataService.clearEventData();
    this.eventTitle = "";
    this.eventDate = "";
    this.eventDescription = "";
    this.eventType = "";
    this.eventData = undefined;
  }

  confirmAction(){
    
    // create event
    let event = {
      name:this.eventTitle,
      activityId:this.eventType,
      description:this.eventDescription,
      date:this.eventDate,
      timeStamp:0,
      position: { latitude:this.eventData.position.latitude, longitude: this.eventData.position.longitude},
    }

    console.log("event : ",event);

    if(!event.date){
      alert("invalid date")
      return;
    }
    event.timeStamp = new Date(event.date).getTime();

    if(this.eventData.eventId){
      console.log("updating event",this.eventData);
      // If the event already exists, we update it
      this._dbAccess.updateEvent(this.eventData.eventId,event);
    }else{
      // console.log("creating event");
      // If the event doesn't exists, we create it
      this._dbAccess.createEvent(event)
    }
    this.initFields();
    this._router.navigate(["pendingevents"]);
  }

  keyboardManagement($event:any){
    console.log("event : ",$event);
    if($event.keyCode === 27){
      console.log("do shit");
    }
  }
}
