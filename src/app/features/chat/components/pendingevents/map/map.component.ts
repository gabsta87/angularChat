import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit{
  map!: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v11';
  lat = 46.2044;
  lng = 6.1432;
  constructor() { }
  ngOnInit() {
    console.log(mapboxgl);
    // mapboxgl.accessToken("pk.eyJ1IjoiZ2FicmllbG1hcmV0IiwiYSI6ImNsNjNxczR6azBnZ3czY3A0YTZpYXR5Z28ifQ.H_qk45kg2jVa6K0JyEF8XA");
    (mapboxgl as any).accessToken = "pk.eyJ1IjoiZ2FicmllbG1hcmV0IiwiYSI6ImNsNjNxczR6azBnZ3czY3A0YTZpYXR5Z28ifQ.H_qk45kg2jVa6K0JyEF8XA";

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
      const features = this.map.queryRenderedFeatures(event.point, {
        layers: ['streets-v11'] // replace with your layer name
      });
      if (!features.length) {
        return;
      }
      const feature = features[0];
      console.log("event raised");

  /*
    Create a popup, specify its options
    and properties, and add it to the map.
  */
    const popup = new mapboxgl.Popup({ offset: [0, -15] });
    console.log("feature geometry",feature.geometry);
    
    // .setLngLat(feature.geometry.coordinates)
    // .setHTML(
    //   // `<h3>${feature?.properties?[title]}</h3><p>${feature.properties.description}</p>`
    //   "this is a test"
    // )
    // .addTo(this.map);

    });

  }
}
