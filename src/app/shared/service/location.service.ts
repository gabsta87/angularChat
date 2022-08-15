import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor() { }

  async getCurrentPosition() : Promise<{lat:number,lng:number}>{
    const {coords} = await Geolocation.getCurrentPosition();
    const {latitude = 0, longitude = 0} = coords;
    return {
      lat: latitude,
      lng: longitude
    }
  }
}
