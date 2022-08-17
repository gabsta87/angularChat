import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  constructor(private readonly _http:HttpClient) {}

  private getURL(lat:number,long:number){
    return `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${environment.openweathermap.apiToken}&units=metric`
  }

  // async getWeather(lat:number,long:number, date?:number){
  async getWeather(lat:number,long:number, date:number){
    const url = this.getURL(lat,long);

    const request = this._http.get(url);
    let response:any = await firstValueFrom(request);

    console.log("response = ",response);
    console.log("response list = ",response.list);
    let index = this.findIndex(response.list,date);

    if(!index)
      return undefined;
    
    response = response.list[index];

    console.log("index found : ",index," , weather : ",response);
    // return response;

    return {
      icon: response.weather[0].icon,
      temp : response.main.temp,
      maxTemp: response.main.temp_max,
      minTemp: response.main.temp_min,
      pressure: response.main.pressure,
      humidity:response.main.humidity
    }
  }

  // findIndex(dataList:{dt:number}[],dateToFind:number):number|undefined{
  //   dateToFind = dateToFind / 1000;
  //   let tempIndex:number|undefined = undefined;
  //   dataList.forEach((e:{dt:number},i) =>{
  //     tempIndex = i
  //     if(dateToFind < e.dt){
  //       return tempIndex
  //     }
  //     // else{
  //     //   return tempIndex;
  //     // }
  //   });
  //   return tempIndex;
  // }

  findIndex(dataList:{dt:number}[],dateToFind:number):number|undefined{
    let tempdate = dateToFind / 1000;
    console.log("required date = ",tempdate);

    let tempIndex:number|undefined = undefined;
    dataList.forEach((e:{dt:number},i) =>{
      // console.log("i : ",i," e : ",e);
      
      if(tempdate >= e.dt){
        tempIndex = i
        
      //   console.log(tempdate," bigger than ", e.dt," by ",tempdate-e.dt," saving ",i);
      // }else{
      //   console.log(tempdate," smaller than ", e.dt," by ",tempdate-e.dt);

      }
      // else{
      //   return tempIndex;
      // }
    });
    return tempIndex;
  }

}
