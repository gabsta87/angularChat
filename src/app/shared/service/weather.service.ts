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
    let firstResult:any = await firstValueFrom(request);

    let index = this.findIndex(firstResult.list,date);

    if(index===undefined)
      return undefined;

    let response = firstResult.list[index];

    return {
      icon: response.weather[0].icon,
      temp : response.main.temp,
      maxTemp: response.main.temp_max,
      minTemp: response.main.temp_min,
      pressure: response.main.pressure,
      humidity:response.main.humidity
    }
  }

  findIndex(dataList:{dt_txt:string}[],dateToFind:number):number|undefined{
    let tempIndex:number|undefined = undefined;

    dataList.forEach((e,i) =>{
      if(dateToFind >= new Date(e.dt_txt).getTime())
        tempIndex = i
    });
    return tempIndex;
  }

}
