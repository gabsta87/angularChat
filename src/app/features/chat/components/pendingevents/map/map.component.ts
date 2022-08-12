import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import * as mapboxgl from 'mapbox-gl';
import { AngularfireService } from 'src/app/shared/service/angularfire.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit{

  pendingEvents = this._dataAccess.getEvents();

  delay = 400;
  clickDate!:number;
  mapBoxClickDate!:number;

  @ViewChild('map') map!: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v11';
  genevaLocation = {lat:46.2044,lng:6.1432};
  userPosition = {lat:46.2044,lng:6.1432};
  isViewLoaded:boolean = false;

  constructor(
    private readonly _dataAccess: AngularfireService, 
    private readonly _router:Router,
    private alertController: AlertController) { }

  async ngAfterViewInit(){
    this._tryGeoLoc();
    await new Promise ((res)=>{setTimeout(()=> res(true),1000)});
    this.isViewLoaded = true;
    navigator.geolocation.getCurrentPosition((e:any)=>console.log("current location = ",e));
  }

  buttonClicked(event:any){
    this.clickDate = Date.now().valueOf();
  }

  async mapClickRaised($event:any){
    this.mapBoxClickDate = Date.now().valueOf();

    if(this.mapBoxClickDate-this.clickDate > this.delay && this.map){
      const alert = await this.alertController.create({
        header: 'Please enter details',
        buttons: ['Confirm',"Cancel"],
        inputs: [
          {
            type: 'text',
            placeholder: 'Name',
          },
          {
            type: 'date',
            placeholder: 'Event date',
          },
          {
            type: 'text',
            placeholder: 'Enter a description',
          },
        ],
      });
      await alert.present();
      
      console.log("result.inputs = ",alert.inputs);
      console.log("result = ",alert);
      
      console.log("TODO get alert infos");
      this._dataAccess.createEvent("new event","asdlfja","12.12.2024 14:00",$event.lngLat)
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
