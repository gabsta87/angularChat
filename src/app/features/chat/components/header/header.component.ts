import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() parentPage!:any;
  @Input() title!:any;

  constructor(private readonly _route : Router, private readonly _activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
  }

  navigateBack(){
    this._route.navigate(["activities"]);
  }
}
