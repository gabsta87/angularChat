import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as mapboxgl from 'mapbox-gl';
import { AngularfireService } from 'src/app/shared/service/angularfire.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  // template: `
  // <mgl-map
  //   [style]="'mapbox://styles/mapbox/streets-v11'"
  //   [zoom]="[12]"
  //   [container]="mapcontainer"
  //   [center]="[6.1432, 46.2044]"
  //   (mapCreate)="map = $event"
  // ></mgl-map>`,
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit, OnInit{

  pendingEvents = this._dataAccess.getEvents();

  delay = 400;
  clickDate!:number;
  releaseDate!:number;

  // @ViewChild('map') map: MapComponent|undefined;
  @ViewChild('map') map!: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v11';
  genevaLocation = {lat:46.2044,lng:6.1432};
  userPosition = {lat:46.2044,lng:6.1432};
  isViewLoaded:boolean = false;

  constructor(private readonly _dataAccess: AngularfireService, private readonly _router:Router) { }

  ngOnInit(): void {
    // this.map = new mapboxgl.Map({
    //   container: 'mapcontainer',
    //   style: 'mapbox://styles/mapbox/streets-v11',
    //   center: [this.lng, this.lat],
    //   zoom: 12,
    // });
  }

  async ngAfterViewInit(){
    this._tryGeoLoc();
    await new Promise ((res)=>{setTimeout(()=> res(true),1000)});
    this.isViewLoaded = true;
    navigator.geolocation.getCurrentPosition((e:any)=>console.log("current location = ",e));

    console.log("after view init map = ",this.map);
  }

  defineListeners($event:any){
    console.log("trying to define listeners ",$event);

    if(this.map){
      console.log("define listeners on map = ",this.map);
      this.map.addControl(new mapboxgl.FullscreenControl());
      
      this.map.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true
          },
          trackUserLocation: true
        })
      );
      // this.map.mapInstance
      this.map.on("mousedown", (e:mapboxgl.MapMouseEvent) => this.buttonClicked(e));
      this.map.on("mouseup", (e:mapboxgl.MapMouseEvent) => this.buttonRelease(e));
    }
  }

  buttonClicked(event:any){
    console.log("click event : ",event);
    
    this.clickDate = Date.now().valueOf();
    console.log("click map = ",this.map);
    this.defineListeners(event);
  }

  buttonRelease(event:any){
    this.releaseDate = Date.now().valueOf();

    console.log("event : ",event);
    console.log("lngLat : ",event.lngLat);
    console.log("point : ",event.point);

    if(this.releaseDate-this.clickDate > this.delay && this.map){
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
          this.userPosition.lat = position.coords.latitude;
          this.userPosition.lng = position.coords.longitude;
        }
      },
        (error: any) => console.log(error));
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

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
