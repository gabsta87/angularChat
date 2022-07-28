import { Component, OnInit } from '@angular/core';
import { DbaccessService } from 'src/app/shared/service/dbaccess.service';

@Component({
  selector: 'app-pendingrequests',
  templateUrl: './pendingrequests.component.html',
  styleUrls: ['./pendingrequests.component.scss']
})
export class PendingrequestsComponent implements OnInit {

  pendingRequestsList!:any;
  displayList!:any;
  requestsMap = new Map();

  constructor(private readonly _dbLoader: DbaccessService) {
    this.loadData();
  }

  ngOnInit(): void {
  }

  async loadData(){
    this.pendingRequestsList = await this._dbLoader.getPendingRequests();
    Object.entries(this.pendingRequestsList).forEach((element:any) => {
      this.requestsMap.set(element[1].key,Object.entries(element[1]).length-1);
    });
    this.displayList = this.pendingRequestsList;
  }

  filterRequests(event:any){
    this.displayList = this.pendingRequestsList.filter((e:any) => e.key.includes(event.detail.value));
  }
}
