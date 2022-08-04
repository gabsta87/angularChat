import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DbaccessService {

  itemsData!:any;
  temp!:any;

  constructor(private readonly _http: HttpClient) { }

  private async getElement(tableName:string,itemIndex:string,count?:number){
    let temp = await this.getElements(tableName,count);

    // if(Array.isArray(temp))
    //   // return temp[parseInt(itemIndex)];
    //   return temp.find(e=>e.key===itemIndex)

    temp = temp.filter(Boolean);
    return temp.find((e:{key:string})=> e.key===itemIndex);
  }

  private async getElements(tableName:string,count?:number){
    await this.loadData();

    let temp:any = [];

    // if(Array.isArray(this.itemsData[tableName])){
    //   return this.itemsData[tableName];
    // }else{

    Object.entries(this.itemsData[tableName]).forEach(
      ([key,value]:[key:string,value:any]) => {
        temp.push({key,...value})
      });

    // console.log("items data : ",temp);
    // }
    return temp;
  }

  getActivity(activityId: string){
    return this.getElement("Activities",activityId);
  }

  getActivities(){
    return this.getElements("Activities");
  }

  getUser(userId:string){
    return this.getElement("Users",userId);
  }

  getUsers(){
    return this.getElements("Users");
  }

  getEvent(index:string){
    return this.getElement("Events",index);
  }

  getEvents(){
    return this.getElements("Events");
  }

  getMessages(discussionId:string,count?:number){
    return this.getElement("Messages",discussionId);
  }

  getPendingRequests(){
    return this.getElements("Requests");
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
