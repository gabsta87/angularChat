import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularfireService } from 'src/app/shared/service/angularfire.service';
import { DbaccessService } from 'src/app/shared/service/dbaccess.service';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss']
})
export class ActivitiesComponent{

  activitiesList:any;
  filteredActivitiesList:any;
  searchValue!:string;

  pendingRequestsList!:any;
  filteredPendingRequestsList!:any;
  requestsMap = new Map();
  activitiesFromFirestore:any;

  constructor(
    // private readonly _dataLoader : DbaccessService,
    private readonly _route : Router,
    private readonly _dbAccess : AngularfireService) {
    this.loadData();
  }

  async loadData(){
    // let temp = await this._dataLoader.getActivities();
    // this.activitiesList = Object.keys(temp).map(key => ({id: key, ...temp[key]}));

    // this.pendingRequestsList = await this._dataLoader.getPendingRequests();
    // Object.entries(this.pendingRequestsList).forEach((element:any) => {
    //   this.requestsMap.set(element[1].key,Object.entries(element[1]).length-1);
    // });
    
    // console.log("messages json : ",this.activitiesList);
    
    this.pendingRequestsList = await this._dbAccess.getPendingRequests();
    this.filteredPendingRequestsList = this.pendingRequestsList;

    this.activitiesList = await this._dbAccess.getActivities();
    this.filteredActivitiesList = this.activitiesList;
    console.log("filtered = ",this.filteredActivitiesList);
  }

  navigateToDiscussion(item:{id:string,name:string}){
    this._route.navigate(["discussion"],{queryParams:{discussionId:item.id,discussionName:item.name}})
  }

  filterActivities(event:any){
    let temp = event.detail.value;
    this.filteredActivitiesList = this.activitiesList.filter((e:any)=>e.name.toLowerCase().includes(temp.toLowerCase()));
    this.searchValue = temp;
  }

  filterRequests(event:any){
    this.filteredPendingRequestsList = this.pendingRequestsList.filter((e:any) => e.name.toLowerCase().includes(event.detail.value.toLowerCase()));
  }

  filteredActivitiesListIsEmpty(){
    if(this.filteredActivitiesList === undefined)
      return true;
    return this.filteredActivitiesList.length === 0;
  }

  action(event:any){
    console.log("new value = ",event.detail.checked);
  }

  createActivity(){
    console.log("creating ",this.searchValue);
    this._dbAccess.createActivity(this.searchValue);
    // TODO 
    // this._dbAccess.removePendingRequest(this.searchValue);
    this.searchValue = "";
  }

  pendingRequestsIsEmpty(){
    if(this.filteredPendingRequestsList === undefined)
      return true
    return this.filteredPendingRequestsList.length === 0;
  }
}
