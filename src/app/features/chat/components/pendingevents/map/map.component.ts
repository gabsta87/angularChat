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

  ngAfterViewInit(){
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

        const popup = new mapboxgl.Popup({ offset: [0, -15] });
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
        
        new mapboxgl.Marker(el).setLngLat((geom as any).coordinates).addTo(this.map);

      });
    },50);

  }

  ionViewWillEnter(){
  }

  ngOnInit() {
  }
}
