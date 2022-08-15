import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
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

  pendingEvents = this._dataAccess.getEvents();
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
    private alertController: AlertController,
    private readonly location: LocationService
    ) { }

  async ngAfterViewInit(){
    // this._tryGeoLoc();
    this.userPosition = await this.location.getCurrentPosition();
    await new Promise ((res)=>{setTimeout(()=> res(true),1000)});
    this.isViewLoaded = true;
    navigator.geolocation.getCurrentPosition((e:any)=>console.log("current location = ",e));
    
    // this.map.addControl(
    //   new mapboxgl.GeolocateControl({
    //   positionOptions: {
    //   enableHighAccuracy: true
    //   },
    //   // When active the map will receive updates to the device's location as it changes.
    //   trackUserLocation: true,
    //   // Draw an arrow next to the location dot to indicate which direction the device is heading.
    //   showUserHeading: true
    //   })
    // );

    // this.map.ce
  }

  buttonClicked(event:any){
    this.clickDate = Date.now().valueOf();
  }

  async mapClickRaised($event:any){
    this.mapBoxClickDate = Date.now().valueOf();

    if(this.mapBoxClickDate-this.clickDate > this.delay && this.map){

      this._router.navigate(["eventedition"],{queryParams:{latitude:$event.lngLat.lat,longitude:$event.lngLat.lng}});

      this.activitiesAvailable = await firstValueFrom(this._dataAccess.getActivities());

      let tempActivities:any[] = [];
      this.activitiesAvailable.forEach((element:any) => {
        tempActivities.push(
          {
            label: element.name,
            type: 'radio',
            value: element.id
          }
        )
      });

      const alertType = await this.alertController.create({
        header: 'Choose the activity type...',
        buttons: [
        {
          text: 'Confirm',
          handler: (eventTypeId) => { //takes the data
            this.activityBeingCreatedId = eventTypeId;
          }
        }],
        inputs: [...tempActivities]
      });

      // await alertType.present()

      const alert = await this.alertController.create({
        header: 'Please enter details',
        buttons: [{
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
            text: 'Confirm',
            handler: (alertData) => { //takes the data
              this.validData(alertData,$event)
            }
        }],
        inputs: [
          {
            name: 'name',
            type: 'text',
            placeholder: 'Name',
          },
          {
            name: 'date',
            type: 'date',
            placeholder: 'Event date',
          },
          {
            name: 'activityId',
            type: 'text',
            placeholder: 'Type of activity',
          },
          {
            name: 'description',
            type: 'text',
            placeholder: 'Enter a description',
          },
        ],
      });

      // alert.onkeydown
      alert.addEventListener("keydown",keyEvent => {
        if(keyEvent.key === "Enter"){
          // TODO Find a way to validate AlertInfo with Enter key
          // console.log(alert);
          // this.validData(alertData,$event);

          // No solution here to access the data being written inside
          // https://forum.ionicframework.com/t/handle-alert-action-when-keyboard-enter-key-is-hit/186794/5
        }
      })
      // await alert.present();
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
