import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  constructor(private readonly _http:HttpClient) {}

  private getURL(lat:number,long:number){
    // return `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${environment.openweathermap.apiToken}`
    return `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${environment.openweathermap.apiToken}&units=metric`
  }

  async getWeather(lat:number,long:number){
    const url = this.getURL(lat,long);
    console.log("url = ",url);

    const request = this._http.get(url);
    let response:any = await firstValueFrom(request);

    // const response = await fetch(url, {
    //   method: 'GET',
    // }).then(r => r.json());

    console.log("response = ",response);
    response = response.list[0];
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

}
