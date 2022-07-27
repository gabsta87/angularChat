import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DbaccessService } from 'src/app/shared/service/dbaccess.service';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss']
})
export class ActivitiesComponent implements OnInit {

  @Input() activitiesList:any = [{name:"first activity"},{name:"second"}];

  constructor(private readonly _dataLoader : DbaccessService, private readonly _route : Router) {
    this.loadData();
  }

  ngOnInit(): void {
  }

  async loadData(){
    let temp = await this._dataLoader.getActivities();
    this.activitiesList = Object.keys(temp).map(key => ({id: key, ...temp[key]}));
  }

  navigateToDiscussion(item:{id:string,name:string}){
    this._route.navigate(["discussion"],{queryParams:{discussionId:item.id,discussionName:item.name}})
  }

}
