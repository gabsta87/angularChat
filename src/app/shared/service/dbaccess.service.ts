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

  private async getElement(tableName:string,itemIndex:string,count?:number){
    let temp = await this.getElements(tableName,count);

    if(!temp){
      return undefined;
    }

    // if(Array.isArray(temp))
    //   // return temp[parseInt(itemIndex)];
    //   return temp.find(e=>e.key===itemIndex)

    temp = temp.filter(Boolean);
    return temp.find((e:{key:string})=> e.key===itemIndex);
  }

  private async getElements(tableName:string,count?:number){
    await this.loadData();

    // if(Array.isArray(this.itemsData[tableName]))
    //   return this.itemsData[tableName];

    let temp:any = [];

    Object.entries(this.itemsData[tableName]).forEach(
      ([key,value]:[key:string,value:any]) => {
        temp.push({key,...value})
      });

    return temp;
  }

  getActivities(){
    return this.getElements("Activities");
  }

  getMessages(discussionId:string,count?:number){
    return this.getElement("Messages",discussionId);
  }

  getUsers(){
    return this.getElements("Users");
  }

  getUser(userId:string){
    return this.getElement("Users",userId);
  }

  getEvent(index:string){
    return this.getElement("Events",index);
  }

  getEvents(){
    return this.getElements("Events");
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
