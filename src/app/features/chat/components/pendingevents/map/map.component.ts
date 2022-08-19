import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as mapboxgl from 'mapbox-gl';
import { firstValueFrom } from 'rxjs';
import { AngularfireService } from 'src/app/shared/service/angularfire.service';
import { LocationService } from 'src/app/shared/service/location.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit{

  // pendingEvents = this._dataAccess.getEvents();
  @Input() pendingEvents:any;

  activitiesAvailable!:any;

  delay = 400;
  clickDate!:number;
  mapBoxClickDate!:number;

  @ViewChild('map') map!: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v11';
  genevaLocation = {lat:46.2044,lng:6.1432};
  userPosition!:{lat:number,lng:number};
  isViewLoaded:boolean = false;
  positionClicked!:any;

  activityBeingCreatedId!:string;

  constructor(
    private readonly _dataAccess: AngularfireService,
    private readonly _router:Router,
    private readonly location: LocationService
    ) { }

  async ngAfterViewInit(){
    // this._tryGeoLoc();
    this.userPosition = await this.location.getCurrentPosition();
    await new Promise ((res)=>{setTimeout(()=> res(true),1000)});
    this.isViewLoaded = true;
    // navigator.geolocation.getCurrentPosition((e:any)=>console.log("current location = ",e));
    
  }

  buttonClicked(event:any){
    this.clickDate = Date.now().valueOf();
  }

  mapCreated($event:any){
    console.log("created map event : ",$event);
    // TODO register map reference
    
  }

  async mapClickRaised($event:any){
    this.mapBoxClickDate = Date.now().valueOf();

    if(this.mapBoxClickDate-this.clickDate > this.delay && this.map){

      this._router.navigate(["eventedition"],{queryParams:{latitude:$event.lngLat.lat,longitude:$event.lngLat.lng}});

      this.activitiesAvailable = await firstValueFrom(this._dataAccess.getActivities());

    }
  }

  validData(alertData:any,event:any){
    let newEvent = {
      name:alertData.name,
      activityId:this.activityBeingCreatedId,
      description:alertData.description,
      date:alertData.date,
      position:{latitude:event.lngLat.lat,longitude:event.lngLat.lng}
    }
    this._dataAccess.createEvent(newEvent);
  }

  // private _tryGeoLoc(){
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition((position: any) => {
  //       if (position) {
  //         console.log("My position : Latitude: " + position.coords.latitude +
  //           "Longitude: " + position.coords.longitude);
  //         this.userPosition.lat = position.coords.latitude;
  //         this.userPosition.lng = position.coords.longitude;
  //       }
  //     },
  //       (error: any) => console.log(error));
  //   } else {
  //     alert("Geolocation is not supported by this browser.");
  //   }
  // }

  // éventuellement pour du hover
  showPopup(event:any){
    console.log("event: ",event);
    new mapboxgl.Popup({ closeOnClick: true })
    .setLngLat([this.userPosition.lng,this.userPosition.lat])
    .setHTML('<h1>You are here!</h1>')
    // .addTo(this.map);
  }

  navigateToEventDetail(param:any){
    this._router.navigate(["event"],{queryParams:{eventId:param}});
  }
}
