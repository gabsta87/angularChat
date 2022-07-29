import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';
import { DbaccessService } from 'src/app/shared/service/dbaccess.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit,AfterViewInit{

  delay = 400;
  clickDate!:any;
  releaseDate!:any;
  map!: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v11';
  lat = 46.2044;
  lng = 6.1432;
  events!:any;

  constructor(private readonly _dataLoader: DbaccessService) {
    // this.loadData();
    // console.log("events = ",this.events);
  }

  async loadData(){
    this.events = await this._dataLoader.getEvents();
  }

  // ngAfterViewChecked(){ }

  async ngAfterViewInit(){

    console.log("geo location = ",navigator.geolocation);
    let temp = await navigator.geolocation.getCurrentPosition((e:any)=>console.log(e));
    console.log("temp = ",temp);
    (mapboxgl as any).accessToken = environment.mapbox.accessToken;

    this._tryGeoLoc();

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

      this.map.on("mousedown",event =>{
        this.buttonClicked();

      })

      this.map.on('mouseup', (event) => {
        console.log("mouseup event = ",event);
        this.buttonRelease(event);
      });

      this.map.on("click",(event)=>{
        console.log("click event = ",event);
        console.log("target = ",event.target);

        // // Pourquoi le Popup ne fonctionne-t-il qu'avec l'event click ou mousedown, et non pas mouseup ?
        // const popup = new mapboxgl.Popup({ offset: [0, -15] })
        // .setLngLat(event.lngLat)
        // .setHTML(
        //   `<h3>an event</h3><p>description</p>`
        // )
        // .addTo(this.map);
      })

    },50);
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

      // marker.on("click",(e)=>{
      //   console.log("clicked on marker ",e);
      // })

      // Adding event listener
      el.addEventListener("mouseup",mouseUpEvent=>{this.listener(el,mouseUpEvent,event);});
    }
  }

  listener(elem:HTMLDivElement,
    divMouseUpEvent:mapboxgl.MapMouseEvent | mapboxgl.EventData,
    parentEvent:mapboxgl.MapMouseEvent | mapboxgl.EventData){
    console.log("event raised : ",divMouseUpEvent," , elem : ",elem);
    parentEvent.originalEvent.stopPropagation();

    // Pourquoi le Popup ne fonctionne-t-il qu'avec l'event click ou mousedown, et non pas mouseup ?
    const popup = new mapboxgl.Popup({ offset: [0, -15] })
    .setLngLat(parentEvent.lngLat)
    .setHTML(
      `<h3>an event</h3><p>description</p>`
    )
    .addTo(this.map);
    console.log("popup : ",popup);

    return undefined as any;
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

  ngOnInit() {
  }
}
