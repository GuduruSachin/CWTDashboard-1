import { Component, OnInit, ViewChild } from '@angular/core';
import { Data } from '@angular/router';
import { DashboardServiceService } from '../../dashboard-service.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { PriorityData } from '../../Models/Responce';
import { FilterOpportunity_Type, FilterPriority } from '../../Models/Filters';
import { MatTableDataSource } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { LivedashboardComponent } from '../livedashboard/livedashboard.component';
import { CLRCommentdailog } from '../automated-clr/automated-clr.component';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ExcelSXService } from '../../excelsx.service';

@Component({
  selector: 'app-priority-report',
  templateUrl: './priority-report.component.html',
  styleUrls: ['./priority-report.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class PriorityReportComponent implements OnInit {
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  constructor(public service : DashboardServiceService,public dialog: MatDialog,public datepipe : DatePipe,public dashboard : LivedashboardComponent,private excelxsService : ExcelSXService) {
    //set screenWidth on page load
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    window.onresize = () => {
      //set screenWidth on screen size change
      this.screenWidth = window.innerWidth;
      this.screenHeight = window.innerHeight;
    };
  }
  expandedElement: Data | null;
  matSortActiveColumn : string = "Client";
  screenWidth : number;
  screenHeight : number;
  PriorityDataSource;
  Apply_disable : boolean;masterPriority : boolean;masterOpportunity_Type : boolean;
  PriorityList : FilterPriority[];
  PriorityListSelected : FilterPriority[];
  Opportunity_TypeList : FilterOpportunity_Type[];
  Opportunity_TypeListSelected : FilterOpportunity_Type[];

  
  DisplayFilters : boolean = false;
  LoginUID : string;
  columnsToDisplay : any[] = ['expand','Client','Workspace_Title','OppTOtalVolume_c','RevenueVolumeUSD_c','Pipeline_comments','Country','Line_Win_Probability','Sales_Stage_Name','Opportunity_Type','ExpectedDecisionDate_c','Assignment_date_c'];
  columnsToDisplay_h : any[] = ['expand','Client','Workspace_Title','OppTOtalVolume_c','RevenueVolumeUSD_c','Pipeline_comments','Country','Line_Win_Probability','Sales_Stage_Name','Revenue_Opportunity_Type','ExpectedDecisionDate_c','Assignment_date_c'];
  ngOnInit(): void {
    this.LoginUID = localStorage.getItem("UID") ?? "---";
    if(localStorage.getItem("UID") != null){
      this.DisplayFilters = true;
    }else{
      this.DisplayFilters = false;
    }
    this.Apply_disable = true;
    this.service.PriorityReportFiltersList().subscribe(data =>{
      this.PriorityList = data.FilterPriority;
      this.masterPriority = true;
      this.getSelectedPriority();
      this.masterOpportunity_Type = true;
      this.Opportunity_TypeList = data.FilterOpportunity_Type;
      this.getSelectedOpportunity_Type();
      // this.dashboard.ShowSpinnerHandler(false);
      this.SetGraph();
    });
  }
  ResetFilters(){
    this.ngOnInit();
  }
  PriorityData : PriorityData[];
  SetGraph(){
    console.log(this.SelectedPriority,this.SelectedOpportunity_Type);
    if(this.SelectedPriority == null || this.SelectedOpportunity_Type == null){
      if(this.SelectedPriority == null){
        alert("Please Select atleast one value from Priority Filter");
      }
      if(this.SelectedOpportunity_Type == null){
        alert("Please Select atleast one value from Opportunity Type Filter");
      }
    }else{
      this.dashboard.ShowSpinnerHandler(true);
      this.service.GetPriorityData(this.SelectedPriority,this.SelectedOpportunity_Type).subscribe({
        next: (data) => {
          console.log(data.PriorityData)
          this.PriorityData = data.PriorityData;
          for(let i = 0;i<data.PriorityData.length;i++){
            if(this.PriorityData[i].Assignment_date == null){
              this.PriorityData[i].Assignment_date_c = "---";
            }else{
              this.PriorityData[i].Assignment_date_c = this.datepipe.transform(this.PriorityData[i].Assignment_date, "yyyy-MM-dd") ?? "---";
            }
            if(this.PriorityData[i].ExpectedDecisionDate == null){
              this.PriorityData[i].ExpectedDecisionDate_c = "---";
            }else{
              this.PriorityData[i].ExpectedDecisionDate_c = this.datepipe.transform(this.PriorityData[i].ExpectedDecisionDate, "yyyy-MM-dd") ?? "---";
            }
            if(this.PriorityData[i].OppTOtalVolume == null){
              this.PriorityData[i].OppTOtalVolume_c = "$0";
            }else{
              this.PriorityData[i].OppTOtalVolume_c = this.PriorityData[i].OppTOtalVolume.toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3)
            }
            if(this.PriorityData[i].RevenueVolumeUSD == null){
              this.PriorityData[i].RevenueVolumeUSD_c = "$0";
            }else{
              this.PriorityData[i].RevenueVolumeUSD_c = this.PriorityData[i].RevenueVolumeUSD.toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3)
            }
            for(let j = 0;j<data.PriorityData[i].CountryWiseData.length;j++){
              if(this.PriorityData[i].CountryWiseData[j].Assignment_date == null){
                this.PriorityData[i].CountryWiseData[j].Assignment_date_c = "---";
              }else{
                this.PriorityData[i].CountryWiseData[j].Assignment_date_c = this.datepipe.transform(this.PriorityData[i].CountryWiseData[j].Assignment_date, "yyyy-MM-dd") ?? "---";
              }
              if(this.PriorityData[i].CountryWiseData[j].ExpectedDecisionDate == null){
                this.PriorityData[i].CountryWiseData[j].ExpectedDecisionDate_c = "---";
              }else{
                this.PriorityData[i].CountryWiseData[j].ExpectedDecisionDate_c = this.datepipe.transform(this.PriorityData[i].CountryWiseData[j].ExpectedDecisionDate, "yyyy-MM-dd") ?? "---";
              }
              if(this.PriorityData[i].CountryWiseData[j].OppTOtalVolume == null){
                this.PriorityData[i].CountryWiseData[j].OppTOtalVolume_c = "$0";
              }else{
                this.PriorityData[i].CountryWiseData[j].OppTOtalVolume_c = this.PriorityData[i].CountryWiseData[j].OppTOtalVolume.toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3)
              }
              if(this.PriorityData[i].CountryWiseData[j].RevenueVolumeUSD == null){
                this.PriorityData[i].CountryWiseData[j].RevenueVolumeUSD_c = "$0";
              }else{
                this.PriorityData[i].CountryWiseData[j].RevenueVolumeUSD_c = this.PriorityData[i].CountryWiseData[j].RevenueVolumeUSD.toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3)
              }
            }
          }
          this.PriorityDataSource = new MatTableDataSource(data.PriorityData);
          this.PriorityDataSource.sort = this.sort;
          this.dashboard.ShowSpinnerHandler(false);
        },error: (error) => {
          console.log(error)
        }
      })
    }
    
  }
  checkUncheckPriority() {
    for (var i = 0; i < this.PriorityList.length; i++) {
      this.PriorityList[i].isSelected = this.masterPriority;
    }
    this.getSelectedPriority();
  }
  PrioritySelected() {
    this.masterPriority = this.PriorityList.every(function(item:any) {
      return item.isSelected == true;
    })
    this.getSelectedPriority();
  }
  SelectedPriority : any;
  getSelectedPriority(){
    this.Apply_disable = false;
    this.SelectedPriority = null;
    for(let i=0;i<this.PriorityList.length;i++){
      if(this.PriorityList[i].isSelected == true){
        if(this.SelectedPriority == null){
          this.SelectedPriority = this.PriorityList[i].Priority;
        }else{
          this.SelectedPriority += ","+this.PriorityList[i].Priority;
        }
      }else{
      }
    }
    this.PriorityListSelected = this.PriorityList.filter(s => s.isSelected == true);
  }
  checkUncheckOpportunity_Type() {
    for (var i = 0; i < this.Opportunity_TypeList.length; i++) {
      this.Opportunity_TypeList[i].isSelected = this.masterOpportunity_Type;
    }
    this.getSelectedOpportunity_Type();
  }
  Opportunity_TypeSelected() {
    this.masterOpportunity_Type = this.Opportunity_TypeList.every(function(item:any) {
      return item.isSelected == true;
    })
    this.getSelectedOpportunity_Type();
  }
  SelectedOpportunity_Type : any;
  getSelectedOpportunity_Type(){
    this.Apply_disable = false;
    this.SelectedOpportunity_Type = null;
    for(let i=0;i<this.Opportunity_TypeList.length;i++){
      if(this.Opportunity_TypeList[i].isSelected == true){
        if(this.SelectedOpportunity_Type == null){
          this.SelectedOpportunity_Type = this.Opportunity_TypeList[i].Opportunity_Type;
        }else{
          this.SelectedOpportunity_Type += ","+this.Opportunity_TypeList[i].Opportunity_Type;
        }
      }else{
      }
    }
    this.Opportunity_TypeListSelected = this.Opportunity_TypeList.filter(s => s.isSelected == true);
  }
  Dailog_Comment : string;
  Dailog_RevenueID : string;
  Dailog_Client : string;
  ShowComment(Dailog_Client : string,Dailog_RevenueID : string,Dailog_Comment : string){
    this.Dailog_Client = Dailog_Client;
    this.Dailog_RevenueID = Dailog_RevenueID;
    this.Dailog_Comment = Dailog_Comment;
    this.openDialog();
  }
  openDialog(): void {
      const dialogRef = this.dialog.open(CLRCommentdailog, {
        // width: '400px',
        data: {Dailog_Comment: this.Dailog_Comment,Dailog_Client : this.Dailog_Client,Dailog_RevenueID : this.Dailog_RevenueID}
      });
      dialogRef.afterClosed().subscribe(result => {
        //this.Comment = result;
        // this.GetData();
      });
    }
  exportAsXLSX(){
    if(this.SelectedPriority == null || this.SelectedOpportunity_Type == null){
      alert("Please select all filters");
    }else{
      this.dashboard.ShowSpinnerHandler(true);
      for(let i=0;i < this.PriorityData.length;i++){
        if(this.PriorityData[i].Assignment_date == null){
          this.PriorityData[i].Assignment_date = "";
        }else{
          this.PriorityData[i].Assignment_date = this.datepipe.transform(this.PriorityData[i].Assignment_date,"MM-dd-yyyy") ?? "";
        }
        if(this.PriorityData[i].ExpectedDecisionDate == null){
          this.PriorityData[i].ExpectedDecisionDate = "";
        }else{
          this.PriorityData[i].ExpectedDecisionDate = this.datepipe.transform(this.PriorityData[i].ExpectedDecisionDate,"MM-dd-yyyy") ?? "";
        }
      }
      const CustomizedData = this.PriorityData.map(o => {
        return {
          'Client': o.Client,
          'Workspace Title': o.Workspace_Title,
          'Opportunity Total Volume': o.OppTOtalVolume,
          'Revenue Volume USD': o.RevenueVolumeUSD,
          'Pipeline Comments': o.Pipeline_comments,
          'Countries': o.Country,
          'Line Win Probability': o.Line_Win_Probability,
          'Sales Stage Name': o.Sales_Stage_Name,
          'Opportunity Type': o.Opportunity_Type,
          'Expected Decision Date': o.ExpectedDecisionDate,
          'Assignment Date': o.Assignment_date,
        };
      });
      this.excelxsService.exportAsExcelFile(
          [
            {
              sheetName: 'Priority Data',
              data: CustomizedData,
              defaultBackgroundColor : 'FF34495E',
              defaultTextColor : 'FFFFFFFF',
              columnFormats: {
                'dd/MMM/yyyy' : ['Expected Decision Date','Assignment Date'], // Negative and Positive Numbers with 2 decimals with Dolor Symbol
                '0' : ['Countries','Line Win Probability'],
                '$#,##0.00;-$#,##0.00;0.00' : ['Opportunity Total Volume','Revenue Volume USD']
              },
            },
          ],
          'Priority Data'
        );
      this.service.UsersUsageofReports(this.LoginUID,"Priority Report","Export").subscribe(data =>{
      })
      this.dashboard.ShowSpinnerHandler(false);
    }
  }
}
