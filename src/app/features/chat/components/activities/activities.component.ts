import { Component, OnInit } from '@angular/core';
import { DocumentData } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { isEmpty, map, Observable, tap } from 'rxjs';
import { AngularfireService } from 'src/app/shared/service/angularfire.service';

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
  activitiesFromFirestore:any;
  isAEmpty!:Observable<Boolean>|true;
  isPREmpty!:Observable<Boolean>|true;
  
  ionAfterViewInit(){
    this.isAEmpty = this.filteredActivitiesListIsEmpty();
    this.isPREmpty = this.pendingRequestsIsEmpty();
  }

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
  }

  // navigateToDiscussion(item:{id:string,name:string}){
  navigateToDiscussion(item:any){
    this._route.navigate(["discussion"],{queryParams:{discussionId:item.id,discussionName:item.name}})
  }

  filterActivities(){
    // this.filteredActivitiesList = this.activitiesList.filter((e:any)=>e.name.toLowerCase().includes(this.searchValue.toLowerCase()));
    // TODO dois-je plutôt faire une requête filtrée ?
    this.filteredActivitiesList = this.activitiesList.pipe(
      map((e:any) => e.filter((elem:any) => elem['name'].toLowerCase().includes(this.searchValue.toLowerCase()))));
    // filter((e:any)=>e.name.toLowerCase().includes(this.searchValue.toLowerCase()));
  }

  filterRequests(){
    // this.filteredPendingRequestsList = this.pendingRequestsList.filter((e:any) => e.name.toLowerCase().includes(this.searchValue.toLowerCase()));
    // TODO dois-je plutôt faire une requête filtrée ?
    this.filteredPendingRequestsList = this.pendingRequestsList.pipe(
      map((e:any) => e.filter((elem:any) => elem['name'].toLowerCase().includes(this.searchValue.toLowerCase()))));
    // filter((e:any) => e.name.toLowerCase().includes(this.searchValue.toLowerCase()));
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
    // TODO corriger ce bug : si la valeur est vraie, elle sera ensuite toujours vraie
    if(this.filteredPendingRequestsList === undefined)
      return true
    return this.filteredPendingRequestsList.pipe(isEmpty());
  }

  filteredActivitiesListIsEmpty(){
    // TODO corriger ce bug : si la valeur est vraie, elle sera ensuite toujours vraie
    if(this.filteredActivitiesList === undefined)
      return true;
    return this.filteredActivitiesList.pipe(isEmpty());
  }
}
