import { AfterViewInit, Component } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { DbaccessService } from 'src/app/shared/service/dbaccess.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit{

  delay = 400;
  clickDate!:any;
  releaseDate!:any;
  map!: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v11';
  lat = 46.2044;
  lng = 6.1432;
  events = this._dataLoader.getEvents();
  isViewLoaded:boolean = false;

  constructor(private readonly _dataLoader: DbaccessService) { }

  async ngAfterViewInit(){
    navigator.geolocation.getCurrentPosition((e:any)=>console.log("current location = ",e));

    this._tryGeoLoc();

    await new Promise ((res)=>{setTimeout(()=> res(true),500)});
    this.isViewLoaded = true;
  }

  buttonClicked(){
    this.clickDate = Date.now().valueOf();
  }

  buttonRelease(event:mapboxgl.MapMouseEvent | mapboxgl.EventData){
    this.releaseDate = Date.now().valueOf();

    if(this.releaseDate-this.clickDate > this.delay){
      // Add red square on click
      const el = document.createElement('div');
      el.style.backgroundColor = "red";
      // el.style.backgroundImage = `url(https://placekitten.com/g/20/20/)`;
      // el.style.backgroundImage = `./src/assets/icons/red_marker.png`;
      el.style.opacity="0.5";
      el.style.borderRadius="10px";
      el.style.height = "20px";
      el.style.width = "20px";

      el.className = 'marker';
      let marker = new mapboxgl.Marker(el);

      marker.setLngLat(event.lngLat).addTo(this.map);

    }
  }

  private _tryGeoLoc(){
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position: any) => {
        if (position) {
          console.log("Latitude: " + position.coords.latitude +
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

}
