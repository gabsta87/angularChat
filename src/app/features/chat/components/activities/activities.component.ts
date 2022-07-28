import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DbaccessService } from 'src/app/shared/service/dbaccess.service';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss']
})
export class ActivitiesComponent implements OnInit {

  activitiesList:any;
  filteredList:any;
  searchValue!:string;

  pendingRequestsList!:any;
  displayList!:any;
  requestsMap = new Map();

  constructor(private readonly _dataLoader : DbaccessService, private readonly _route : Router) {
    this.loadData();
  }

  ngOnInit(): void {
  }

  async loadData(){
    let temp = await this._dataLoader.getActivities();
    this.activitiesList = Object.keys(temp).map(key => ({id: key, ...temp[key]}));
    this.filteredList = this.activitiesList;

    this.pendingRequestsList = await this._dataLoader.getPendingRequests();
    Object.entries(this.pendingRequestsList).forEach((element:any) => {
      this.requestsMap.set(element[1].key,Object.entries(element[1]).length-1);
    });
    this.displayList = this.pendingRequestsList;
  }

  navigateToDiscussion(item:{id:string,name:string}){
    this._route.navigate(["discussion"],{queryParams:{discussionId:item.id,discussionName:item.name}})
  }

  filterActivities(event:any){
    let temp = event.detail.value;
    this.filteredList = this.activitiesList.filter((e:any)=>e.name.toLowerCase().includes(temp.toLowerCase()));
    this.searchValue = temp;
  }

  filterRequests(event:any){
    this.displayList = this.pendingRequestsList.filter((e:any) => e.key.toLowerCase().includes(event.detail.value.toLowerCase()));
  }

  filteredListIsEmpty(){
    if(this.filteredList === undefined)
      return true;
    return this.filteredList.length === 0;
  }
}
