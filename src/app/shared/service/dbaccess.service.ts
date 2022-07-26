import { HttpClient } from '@angular/common/http';
import { Injectable, KeyValueDiffers } from '@angular/core';
import { firstValueFrom } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DbaccessService {

  itemsData!:any;
  temp!:any;

  constructor(private readonly _http: HttpClient) { }

  async getMessages(discussionId:string,count?:number){
    await this.loadData();
    let result = 0;

    result = Object.entries(this.itemsData.Activities).findIndex(obj =>{
      return obj[0] === discussionId;
    });

    if(!this.itemsData.Messages[result])
      return [];

    return Object.entries(this.itemsData.Messages[result]).slice(0,count);
  }

  private async getElement(tableName:string,itemIndex:string,count?:number){
    await this.loadData();

    if(!this.itemsData[tableName][itemIndex])
      return [];

    return this.itemsData[tableName][itemIndex];
  }

  async getActivities(){
    await this.loadData();
    return this.itemsData.Activities;
  }

  async getUsers(discussionId:string){
    // TODO load only discussion users
    await this.loadData();
    return this.itemsData.Users;
  }

  async getEvents(){
    await this.loadData();
    return this.itemsData.Events;
  }

  async getEvent(index:string){
    let result = await this.getElement("Events",index,100);
    return result;
  }

  async getPendingRequests(){
    await this.loadData();
    return this.itemsData.Requests;
  }

  async loadData(){
    if(!this.itemsData){
      const url = './assets/data/db.json';
      const request = this._http.get(url);
      this.temp = await firstValueFrom(request);
      this.itemsData = this.temp;
      console.log("data loaded : ",this.itemsData);
    }
  }
}
