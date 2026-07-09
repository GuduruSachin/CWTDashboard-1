import { DatePipe } from '@angular/common';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DashboardServiceService } from 'src/app/dashboard-service.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { SC_Region } from 'src/app/Models/SteeringCommitte';
import { SC_ClientName, SC_Data } from 'src/app/Models/SteeringCommittee';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { ReplaySubject, Subject } from 'rxjs';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-steering-committee-record-view',
  templateUrl: './steering-committee-record-view.component.html',
  styleUrls: ['./steering-committee-record-view.component.css']
})
export class SteeringCommitteeRecordViewComponent implements OnInit {

  constructor(public service : DashboardServiceService,public datepipe : DatePipe) { }
  // @Input() SteeringCommitteeRecordView : any;
  // @Output() SendOutput = new EventEmitter<any>();
  SC_Data : SC_Data[];
  SelectedSCData : SC_Data[];
  ClientNameSettings: IDropdownSettings;
  ClientNameList : SC_ClientName[];
  public SC_ClientName: ReplaySubject<SC_ClientName[]> = new ReplaySubject<SC_ClientName[]>(1);
  ClientName_Search = new FormControl();
  protected _onDestroy = new Subject<void>();
  ngOnInit(): void {
    this.ClientNameList = [];
    this.service.SteeringCommitteeData().subscribe(data => {
      data.Data.forEach(item =>{
        if (this.ClientNameList.find((x) => x.ClientName === item.ClientName) === undefined) {
          this.ClientNameList.push({ClientName : item.ClientName,isSelected : true});
        }
      })
      this.SC_ClientName.next(this.ClientNameList.slice());
      for(let i = 0;i<data.Data.length;i++){
        if(data.Data[i].TotalBusineesVolume == null){
          data.Data[i].TotalBusineesVolume_text = "$0";
        }else{
          data.Data[i].TotalBusineesVolume_text = Math.round(data.Data[i].TotalBusineesVolume).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
        }
        if(data.Data[i].NewBusinessVolume == null){
          data.Data[i].NewBusinessVolume_text = "$0";
        }else{
          data.Data[i].NewBusinessVolume_text = Math.round(data.Data[i].NewBusinessVolume).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
        }
        if(data.Data[i].InsertedDate == null){
          data.Data[i].InsertedDate_text = "---";
        }else{
          data.Data[i].InsertedDate_text = this.datepipe.transform(data.Data[i].InsertedDate, "yyyy-MM-dd");
        }
        if(data.Data[i].LastUpdatedDate == null){
          data.Data[i].LastUpdatedDate_text = "---";
        }else{
          data.Data[i].LastUpdatedDate_text = this.datepipe.transform(data.Data[i].LastUpdatedDate, "yyyy-MM-dd");
        }
      }
      this.SC_Data = data.Data;
      this.SearchValueChanges();
    })
  }

  onClientNameChange(){
    console.log(this.Client_Name.value)
    const result = this.SC_Data.filter((obj) => {
      return obj.ClientName.toLowerCase().search(this.Client_Name.value.toLowerCase()) > -1
    });
    this.SelectedSCData = result;
    console.log(this.SelectedSCData);
  }

  protected SC_filter() {
    if (!this.ClientNameList) {
      return;
    }
    // get the search keyword
    let search = this.ClientName_Search.value;
    if (!search) {
      this.SC_ClientName.next(this.ClientNameList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the manager
    this.SC_ClientName.next(
      this.ClientNameList.filter(manager => manager.ClientName.toLowerCase().indexOf(search) > -1)
    );
  }
  SearchValueChanges(){
    this.ClientName_Search.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.SC_filter();
      });
  }
  Client_Name = new FormControl();
}
