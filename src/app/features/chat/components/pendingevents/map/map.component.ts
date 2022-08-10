import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';
import * as mapboxgl from 'mapbox-gl';
import { AngularfireService } from 'src/app/shared/service/angularfire.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit{

  delay = 400;
  clickDate!:any;
  releaseDate!:any;
  map!:any;
  style = 'mapbox://styles/mapbox/streets-v11';
  lat = 46.2044;
  lng = 6.1432;
  events = this._dataAccess.getEvents();
  isViewLoaded:boolean = false;

  constructor(private readonly _dataAccess: AngularfireService, private readonly _router:Router) { }

  async ngAfterViewInit(){
    this._tryGeoLoc();
    await new Promise ((res)=>{setTimeout(()=> res(true),1000)});
    this.isViewLoaded = true;
    navigator.geolocation.getCurrentPosition((e:any)=>console.log("current location = ",e));
    this.map = document.getElementById('map');
  }

  buttonClicked(event:any){
    this.clickDate = Date.now().valueOf();
  }

  buttonRelease(event:any){
    this.releaseDate = Date.now().valueOf();
    if(this.releaseDate-this.clickDate > this.delay){
      console.log("map = ",this.map);
      
      console.log("long press triggered : ",event);
      let eventData = new mapboxgl.Popup({ closeOnClick: true })
      .setHTML('<h1>Hello World!</h1>')
      // .addTo(this.map);
      // eventData.setLngLat(event);
      console.log(eventData);
      
      // this._dataAccess.createEvent(eventData)
    }
  }

  private _tryGeoLoc(){
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position: any) => {
        if (position) {
          console.log("My position : Latitude: " + position.coords.latitude +
            "Longitude: " + position.coords.longitude);
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
          console.log(this.lat);
          console.log(this.lng);
        }
      },
        (error: any) => console.log(error));
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  alert(event:any){
    console.log("event: ",event);
    new mapboxgl.Popup({ closeOnClick: true })
    .setLngLat([6.1432,46.2044])
    .setHTML('<h1>Hello World!</h1>')
    // .addTo(this.map);
  }

  navigateToEventDetail(param:any){
    this._router.navigate(["event"],{queryParams:{eventId:param}});
  }
}
