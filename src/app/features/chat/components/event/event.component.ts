import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent {

  @Input() eventId!:number;

  ionViewWillEnter(){
    console.log("TODO : load the event ",this.eventId);
  }

}
