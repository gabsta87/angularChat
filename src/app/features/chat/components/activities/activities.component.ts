import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss']
})
export class ActivitiesComponent implements OnInit {

  @Input() activitiesList!:any;

  constructor() {
    console.log("TODO : load activities list");
  }

  ngOnInit(): void {
  }

}
