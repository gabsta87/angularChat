import { Component, OnInit } from '@angular/core';
import { DocumentData } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { isEmpty, Observable } from 'rxjs';
import { AngularfireService } from 'src/app/shared/service/angularfire.service';
import { DbaccessService } from 'src/app/shared/service/dbaccess.service';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss']
})
export class ActivitiesComponent implements OnInit{

  activitiesList:any;
  filteredActivitiesList!:Observable<DocumentData[]>;
  searchValue!:string;

  pendingRequestsList!:any;
  filteredPendingRequestsList!:Observable<DocumentData[]>;
  requestsMap = new Map();
  activitiesFromFirestore:any;

  constructor(
    // private readonly _dataLoader : DbaccessService,
    private readonly _route : Router,
    private readonly _dbAccess : AngularfireService) {
  }

  ngOnInit(): void {
    this.loadData();
  }

  async loadData(){
    this.pendingRequestsList = await this._dbAccess.getPendingRequests();
    this.filteredPendingRequestsList = this.pendingRequestsList;

    this.activitiesList = await this._dbAccess.getActivities();
    this.filteredActivitiesList = this.activitiesList;
    console.log("filtered = ",this.filteredActivitiesList);
  }

  // navigateToDiscussion(item:{id:string,name:string}){
  navigateToDiscussion(item:any){
    console.log("item : ",item);
    
    this._route.navigate(["discussion"],{queryParams:{discussionId:item.id,discussionName:item.name}})
  }

  filterActivities(event:any){
    this.filteredActivitiesList = this.activitiesList.filter((e:any)=>e.name.toLowerCase().includes(this.searchValue.toLowerCase()));
  }

  filterRequests(event:any){
    this.filteredPendingRequestsList = this.pendingRequestsList.filter((e:any) => e.name.toLowerCase().includes(this.searchValue.toLowerCase()));
  }

  filteredActivitiesListIsEmpty(){
    if(this.filteredActivitiesList === undefined)
      return true;
    // return this.filteredActivitiesList.length === 0;
    return this.filteredActivitiesList.pipe(isEmpty());
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
    return this.filteredPendingRequestsList.pipe(isEmpty());
  }
}
