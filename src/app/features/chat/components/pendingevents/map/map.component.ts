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

    this.tryGeoLoc();

    setTimeout(()=>{
      console.log(mapboxgl);
      (mapboxgl as any).accessToken = environment.mapbox.accessToken;

      this.map = new mapboxgl.Map({
        container: 'map',
        style: this.style,
        zoom: 13,
        center: [this.lng, this.lat]
      });
      // Add map controls
      this.map.addControl(new mapboxgl.NavigationControl());


      this.map.on('click', (event) => {
        // If the user clicked on one of your markers, get its information.
        const features = this.map.queryRenderedFeatures(event.point);

        if (!features.length) {
          return;
        }
        const feature = features[0];
        console.log("event raised",event);

        const popup = new mapboxgl.Popup();
        console.log("feature geometry",feature.geometry);

        // .setLngLat(feature.geometry.coordinates)
        // .setHTML(
        //   // `<h3>${feature?.properties?[title]}</h3><p>${feature.properties.description}</p>`
        //   "this is a test"
        // )
        // .addTo(this.map);

        const el = document.createElement('div');
        el.className = 'marker';
        let geom = feature.geometry;
        console.log("coords : ",(geom as any).coordinates);

        // new mapboxgl.Marker(el).setLngLat((geom as any).coordinates).addTo(this.map);
        new mapboxgl.Marker(el).setLngLat(event.lngLat).addTo(this.map);

      });
    },50);

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
