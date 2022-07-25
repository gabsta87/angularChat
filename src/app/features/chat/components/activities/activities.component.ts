import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss']
})
export class ActivitiesComponent implements OnInit {

  @Input() activitiesList:{name:string}[] = [{name:"first activity"},{name:"second"}];

  constructor() {
    console.log("TODO : load activities list");
  }

  ngOnInit(): void {
  }

}
