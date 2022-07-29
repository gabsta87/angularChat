import { AfterViewChecked, AfterViewInit, Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit,AfterViewInit{

  map!: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v11';
  lat = 46.2044;
  lng = 6.1432;

  constructor() { }

  // ngAfterViewChecked(){

  // }

  async ngAfterViewInit(){

    console.log("geo location = ",navigator.geolocation);
    let temp = await navigator.geolocation.getCurrentPosition((e:any)=>console.log(e));
    console.log("temp = ",temp);
    (mapboxgl as any).accessToken = environment.mapbox.accessToken;

    this.tryGeoLoc();

    setTimeout(()=>{
      console.log(mapboxgl);

      this.map = new mapboxgl.Map({
        container: 'map',
        style: this.style,
        zoom: 13,
        center: [this.lng, this.lat]
      });

      // Add map controls
      this.map.addControl(new mapboxgl.NavigationControl());

      this.map.on('click', (event) => {

        // Add red square on click
        const el = document.createElement('div');
        console.log("new div : ",el);

        el.addEventListener("click",this.listener(el,event));

        ( el.style as any)= "background-color:red; height:20px; width:20px;";
        el.className = 'marker';
        new mapboxgl.Marker(el).setLngLat(event.lngLat).addTo(this.map);

        // Add popup on click
        const popup = new mapboxgl.Popup({ offset: [0, -15] })
        .setLngLat(event.lngLat)
        .setHTML(
          `<h3>an event</h3><p>description</p>`
        )
        .addTo(this.map);
      });
    },50);

  }

  listener(elem:HTMLDivElement,event:mapboxgl.MapMouseEvent | mapboxgl.EventData){
    console.log("event raised : ",event," , elem : ",elem);
    
    return undefined as any;
  }

  tryGeoLoc(){
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position: any) => {
        if (position) {
          console.log("Latitude: " + position.coords.latitude +
            "Longitude: " + position.coords.longitude);
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
          console.log(this.lat);
          console.log(this.lat);
        }
      },
        (error: any) => console.log(error));
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  ionViewWillEnter(){
  }

  ngOnInit() {
  }
}
