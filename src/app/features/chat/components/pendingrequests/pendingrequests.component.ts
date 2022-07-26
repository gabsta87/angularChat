import { Component, OnInit } from '@angular/core';
import { DbaccessService } from 'src/app/shared/service/dbaccess.service';

@Component({
  selector: 'app-pendingrequests',
  templateUrl: './pendingrequests.component.html',
  styleUrls: ['./pendingrequests.component.scss']
})
export class PendingrequestsComponent implements OnInit {

  pendingRequestsList!:any;

  constructor(private readonly _dbLoader: DbaccessService) {
    this.loadData();
  }

  ngOnInit(): void {
  }

  async loadData(){
    this.pendingRequestsList = await this._dbLoader.getPendingRequests();
    console.log("loaded ",this.pendingRequestsList);
  }


}
