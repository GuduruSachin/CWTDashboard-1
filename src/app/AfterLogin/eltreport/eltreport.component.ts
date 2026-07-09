import { Component, OnInit, ViewEncapsulation, Inject, ViewChild } from '@angular/core';
import { DashboardServiceService } from '../../dashboard-service.service';
import { EltData, YearMonth, ELTDeltaComments } from '../../Models/EltResponse';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { LivedashboardComponent } from '../livedashboard/livedashboard.component';
import { FormControl } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ExcelSXService } from '../../excelsx.service';
export interface DialogData {
  Dailog_Client : string;
  Dailog_Status : string;
  Dailog_Comment : string;
}
export interface PriorDialogData {
  Year : string;
  Month : string;
  Name : string;
}
@Component({
  selector: 'app-eltreport',
  templateUrl: './eltreport.component.html',
  styleUrls: ['./eltreport.component.css']
  // encapsulation: ViewEncapsulation.Emulated
})
export class ELTReportComponent implements OnInit {
  Dailog_Comment : string;
  Dailog_Status : string;
  Dailog_Client : string;
  Dailog_Year : string;
  Dailog_Month : string;
  displayedColumns_c : string[] = ['Client','APAC','EMEA','LATAM','NORAM','CurrentMonth','PriorMonthElt','Delta','TotalAcountVolume'];//'PreviousYear_s','Status'
  displayedColumns_n : string[] = ['Client','APAC','EMEA','LATAM','NORAM','CurrentMonth','TotalAcountVolume'];//'PreviousYear_s',
  displayedColumns_Ry : string[] = ['Client', 'Month1','Month2','Remaining_Months','Total_Months','TotalAcountVolume'];//'PreviousYear_s',
  dataSource_c;
  dataSource_ce;
  displayedColumns_ce : string[] = ['Client','RevenueVolumeUSD','RevenueID','Country','Region','Comments'];//'Comments'
  dataSource_n;
  dataSource_Ry;
  PreviousYear : string;
  CurrentMonth : string;
  SubTotalAPAC_C : string;
  SubTotalEMEA_C : string;
  SubTotalLatam_C : string;
  SubTotalNoram_C : string;
  SubTotal_C : string;
  SubTotalPriorMonth_C : string;
  SubTotalDelta_c : string;
  SubTotalDelta_Color : string;
  OtherClient_C : string;
  OtherClientsPriorTotal_C : string;
  GrandTotal_C : string;
  GrandTotalPriorValue_C : string;
  PreviousYear_N : string;
  NextMonth_N : string;
  SubTotalAPAC_N : string;
  SubTotalEMEA_N : string;
  SubTotalLatam_N : string;
  SubTotalNoram_N : string;
  SubTotal_N : string;
  OtherClient_N : string;
  GrandTotal_N : string;
  Month1_ry : string;
  Month2_ry : string;
  RemainingMonths_ry : string;
  PreviousYear_ry : string;
  Month1SubTotal_ry : string;
  Month2SubTotal_ry : string;
  RemainingMonthsSubTotal_ry : string;
  Month1OC_ry : string;
  Month2OC_ry : string;
  RemainingOC_ry : string;
  Month1GT_ry : string;
  Month2GT_ry : string;
  RemainingGT_ry : string;
  CurrentMonthData : EltData[];
  NextMonthData : EltData[];
  RemainingMonthsData : EltData[];
  YearMonth_list : ReplaySubject<YearMonth[]> = new ReplaySubject<YearMonth[]>(1);
  YearMonth_data : YearMonth[];
  yearMonths = new FormControl();
  Selectedyearmonth;
  DisableButton : boolean = false;
  
  @ViewChild('CurrentMonthDataSort') CurrentMonthDataSort: MatSort;
  @ViewChild('CurrentMonthImpactedVolumeSort') CurrentMonthImpactedVolumeSort: MatSort;
  @ViewChild('NextMonthDataSort') NextMonthDataSort: MatSort;
  @ViewChild('RestOfTheYearDataSort') RestOfTheYearDataSort: MatSort;
  constructor(private service : DashboardServiceService,public dialog: MatDialog,private dashboard : LivedashboardComponent,private excelxsService : ExcelSXService) { }
  openDialog(): void {
    const dialogRef = this.dialog.open(EltDailog, {
      width: '400px',
      height : '250px',
      data: {Dailog_Comment: this.Dailog_Comment,Dailog_Client : this.Dailog_Client,Dailog_Status : this.Dailog_Status}
    });
    dialogRef.afterClosed().subscribe(result => {
      //this.Comment = result;
    });
  }
  PriorMonthDate;
  openPriorDialog() : void{
    const dialogRef = this.dialog.open(PriorMonthData, {
      // width: '500px',
      width : '90%',
      height : '650px',
      data: {Year: this.Dailog_Year,Month : this.Dailog_Month,Name : localStorage.getItem("Username")}
    });
    dialogRef.afterClosed().subscribe(result => {
      //this.Comment = result;
      this.Selectedyearmonth = "Select Value";
    });
  }
  ShowComment(Dailog_Client : string,Dailog_Status : string,Dailog_Comment : string){
    this.Dailog_Client = Dailog_Client;
    this.Dailog_Status = Dailog_Status;
    this.Dailog_Comment = Dailog_Comment;
    this.openDialog();
  }
  Forecast;Varience;VarienceValue;
  openLink(WorkSpace : string){
    var Hyperlink  : string = "https://cwt.imeetcentral.com/"+WorkSpace.replace(/\s/g, "")+"/";
    window.open(Hyperlink);
  }
  ngOnInit() {
    this.PriorMonthDate = localStorage.getItem("ELTLastUpdatedOn");
    this.Selectedyearmonth = "Select Value";
    this.dashboard.ShowSpinnerHandler(true);
    this.service.CurrentMonthELT().subscribe(data =>{
      this.CurrentMonth = data.ColumnOne;
      this.PreviousYear = data.ColumnYearName;
      this.CurrentMonthData = data.Data;
      this.SubTotalAPAC_C = Math.round(data.Data.map(t => t.APAC).reduce((acc,value) => acc + value,0)).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
      this.SubTotalEMEA_C = Math.round(data.Data.map(t => t.EMEA).reduce((acc,value) => acc + value,0)).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
      this.SubTotalLatam_C = Math.round(data.Data.map(t => t.LATAM).reduce((acc,value) => acc + value,0)).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
      this.SubTotalNoram_C = Math.round(data.Data.map(t => t.NORAM).reduce((acc,value) => acc + value,0)).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
      this.SubTotal_C = Math.round(data.Data.map(t => t.CurrentMonth).reduce((acc,value) => acc + value,0)).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
      this.SubTotalPriorMonth_C = Math.round(data.Data.map(t => t.PriorMonthElt).reduce((acc,value) => acc + value,0)).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
      this.GrandTotal_C = Math.round(data.TotalAmountMonth1).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
      this.GrandTotalPriorValue_C = Math.round(data.TotalAmountPriorMonth1).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
      this.OtherClient_C = Math.round(data.TotalAmountMonth1 - data.Data.map(t => t.CurrentMonth).reduce((acc,value) => acc + value,0)).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
      this.OtherClientsPriorTotal_C = Math.round(data.TotalAmountPriorMonth1 - data.Data.map(t => t.PriorMonthElt).reduce((acc,value) => acc + value,0)).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
      for(let i = 0;i<data.Data.length;i++){
        //CurrentMonth
        if(this.CurrentMonthData[i].CurrentMonth == null){
          this.CurrentMonthData[i].CurrentMonth_s = "$0";
        }else{
          this.CurrentMonthData[i].CurrentMonth_s = Math.round(this.CurrentMonthData[i].CurrentMonth).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
        }
        //Apac Region
        if(this.CurrentMonthData[i].APAC == null){
          this.CurrentMonthData[i].APAC_volume = "$0";
        }else{
          this.CurrentMonthData[i].APAC_volume = Math.round(this.CurrentMonthData[i].APAC).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
        }
        //EMEA Region
        if(this.CurrentMonthData[i].EMEA == null){
          this.CurrentMonthData[i].EMEA_volume = "$0";
        }else{
          this.CurrentMonthData[i].EMEA_volume = Math.round(this.CurrentMonthData[i].EMEA).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
        }
        //Latam Region
        if(this.CurrentMonthData[i].LATAM == null){
          this.CurrentMonthData[i].LATAM_volume = "$0";
        }else{
          this.CurrentMonthData[i].LATAM_volume = Math.round(this.CurrentMonthData[i].LATAM).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
        }
        //Noram Region
        if(this.CurrentMonthData[i].NORAM == null){
          this.CurrentMonthData[i].NORAM_volume = "$0";
        }else{
          this.CurrentMonthData[i].NORAM_volume = Math.round(this.CurrentMonthData[i].NORAM).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
        }
        //PriorMonthELT
        if(this.CurrentMonthData[i].PriorMonthElt.length == 0){
          this.CurrentMonthData[i].PriorMonthElt_s = "$0";
        }else{
          this.CurrentMonthData[i].PriorMonthElt_s = Math.round(this.CurrentMonthData[i].PriorMonthElt).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
        }
        //Previous Year
        // if(this.CurrentMonthData[i].PreviousYear == null){
        //   this.CurrentMonthData[i].PreviousYear_s = "$0";
        // }else{
        //   this.CurrentMonthData[i].PreviousYear_s = Math.round(this.CurrentMonthData[i].PreviousYear).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
        // }
        //Total Account Volume
        if(this.CurrentMonthData[i].TotalAcountVolume == null){
          this.CurrentMonthData[i].TotalAcountVolume_s = "$0";
        }else{
          this.CurrentMonthData[i].TotalAcountVolume_s = Math.round(this.CurrentMonthData[i].TotalAcountVolume ?? 0).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
        }
        //Comments
        // if(this.CurrentMonthData[i].Comments == null || this.CurrentMonthData[i].Comments == ""){
        //   this.CurrentMonthData[i].Comments = this.CurrentMonthData[i].RegionComment + " " + Math.round(this.CurrentMonthData[i].RevenueComment).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
        // }else{
        // }
        // if(this.CurrentMonthData[i].EltStatus.includes("On Track - Green")){
        //   this.CurrentMonthData[i].EltStatusColor = "green";
        // }else if(this.CurrentMonthData[i].EltStatus.includes("Risk - Amber")){
        //   this.CurrentMonthData[i].EltStatusColor = "orange";
        //   //this.NextMonthData[i].TotalAcountVolume_s = this.NextMonthData[i].TotalAcountVolume.toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
        // }else if(this.CurrentMonthData[i].EltStatus.includes("Issue - Red")){
        //   this.CurrentMonthData[i].EltStatusColor = "red";
        // }else if(this.CurrentMonthData[i].EltStatus == null || this.CurrentMonthData[i].EltStatus == "")
        // {
        //   this.CurrentMonthData[i].EltStatus = "On Track - Green";
        //   this.CurrentMonthData[i].EltStatusColor = "green";
        // }
        if(this.CurrentMonthData[i].PriorMonthElt == 0){
          this.CurrentMonthData[i].Delta = this.CurrentMonthData[i].CurrentMonth;
          this.CurrentMonthData[i].Delta_s = Math.round(this.CurrentMonthData[i].CurrentMonth).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
          if(Math.round(this.CurrentMonthData[i].CurrentMonth) == 0){
            this.CurrentMonthData[i].DeltaColor = "white";
          }else{
            this.CurrentMonthData[i].DeltaColor = "green";
          }
        }else{
          this.CurrentMonthData[i].Delta = this.CurrentMonthData[i].CurrentMonth - this.CurrentMonthData[i].PriorMonthElt;
          this.CurrentMonthData[i].Delta_s = Math.round(Math.round(this.CurrentMonthData[i].CurrentMonth)-Math.round(this.CurrentMonthData[i].PriorMonthElt)).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
          if(Math.round(Math.round(this.CurrentMonthData[i].CurrentMonth)-Math.round(this.CurrentMonthData[i].PriorMonthElt)) > 0){
            this.CurrentMonthData[i].DeltaColor = "green";
          }else if(Math.round(Math.round(this.CurrentMonthData[i].CurrentMonth)-Math.round(this.CurrentMonthData[i].PriorMonthElt)) == 0){
            this.CurrentMonthData[i].DeltaColor = "white";
          }else{
            this.CurrentMonthData[i].DeltaColor = "red";
          }
        }
      }
      var total_Delta = this.CurrentMonthData.map(t => t.Delta).reduce((acc,value) => acc + value,0)
      this.SubTotalDelta_c = Math.round(total_Delta).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
      if(total_Delta == 0){
        this.SubTotalDelta_Color = 'white';
      }else if(total_Delta > 0){
        this.SubTotalDelta_Color = 'green';
      }else if(total_Delta < 0){
        this.SubTotalDelta_Color = 'red';
      }
      this.Forecast = Math.round(data.GrandTotal).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
      this.Varience = Math.round(Math.round(data.TotalAmountMonth1)-Math.round(data.GrandTotal)).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
      if((Math.round(data.TotalAmountMonth1)-Math.round(data.GrandTotal)) >=0){
        this.VarienceValue = true;
      }else{
        this.VarienceValue = false;
      }
      for(let i = 0;i<data.ELTDeltaComments.length;i++){
        if(data.ELTDeltaComments[i].RevenueVolumeUSD == null){
          data.ELTDeltaComments[i].RevenueVolumeUSD_s = "$0";
        }else{
          data.ELTDeltaComments[i].RevenueVolumeUSD_s = Math.round(data.ELTDeltaComments[i].RevenueVolumeUSD).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
        }
      }
      //ascending order
      this.CurrentMonthData.sort((a, b) => a.Delta - b.Delta);
      //descending
      // this.CurrentMonthData.sort((a, b) => (a.Delta > b.Delta ? -1 : 1))
      this.dataSource_c = new MatTableDataSource(this.CurrentMonthData);
      this.dataSource_c.sort = this.CurrentMonthDataSort;
      this.dataSource_ce = new MatTableDataSource(data.ELTDeltaComments);
      this.dataSource_ce.sort = this.CurrentMonthImpactedVolumeSort;
      this.dashboard.ShowSpinnerHandler(false);
    });
    this.dashboard.ShowSpinnerHandler(true);
    this.service.NextMonthELT().subscribe(data => {
      this.NextMonth_N = data.ColumnOne;
      this.PreviousYear_N = data.ColumnYearName;
      this.NextMonthData = data.Data;
      this.SubTotalAPAC_N = Math.round(data.Data.map(t => t.APAC).reduce((acc,value) => acc + value,0)).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
      this.SubTotalEMEA_N = Math.round(data.Data.map(t => t.EMEA).reduce((acc,value) => acc + value,0)).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
      this.SubTotalLatam_N = Math.round(data.Data.map(t => t.LATAM).reduce((acc,value) => acc + value,0)).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
      this.SubTotalNoram_N = Math.round(data.Data.map(t => t.NORAM).reduce((acc,value) => acc + value,0)).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
      this.SubTotal_N = Math.round(data.Data.map(t => t.CurrentMonth).reduce((acc,value) => acc + value,0)).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
      // this.GrandTotal_N = Math.round(data.TotalAmountMonth1).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
      // this.OtherClient_N = Math.round(data.TotalAmountMonth1 - data.Data.map(t => t.CurrentMonth).reduce((acc,value) => acc + value,0)).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
      for(let i = 0;i<data.Data.length;i++){
        //CurrentMonth
        if(this.NextMonthData[i].CurrentMonth == null){
          this.NextMonthData[i].CurrentMonth_s = "$0";
        }else{
          this.NextMonthData[i].CurrentMonth_s = Math.round(this.NextMonthData[i].CurrentMonth).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
        }
        //Apac region
        if(this.NextMonthData[i].APAC == null){
          this.NextMonthData[i].APAC_volume = "$0";
        }else{
          this.NextMonthData[i].APAC_volume = Math.round(this.NextMonthData[i].APAC).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
        }
        //Emea region
        if(this.NextMonthData[i].EMEA == null){
          this.NextMonthData[i].EMEA_volume = "$0";
        }else{
          this.NextMonthData[i].EMEA_volume = Math.round(this.NextMonthData[i].EMEA).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
        }
        //Latam region
        if(this.NextMonthData[i].LATAM == null){
          this.NextMonthData[i].LATAM_volume = "$0";
        }else{
          this.NextMonthData[i].LATAM_volume = Math.round(this.NextMonthData[i].LATAM).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
        }
        //Noram region
        if(this.NextMonthData[i].NORAM == null){
          this.NextMonthData[i].NORAM_volume = "$0";
        }else{
          this.NextMonthData[i].NORAM_volume = Math.round(this.NextMonthData[i].NORAM).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
        }
        //PriorMonthELT
        if(this.NextMonthData[i].PriorMonthElt == null){
          this.NextMonthData[i].PriorMonthElt_s = "$0";
        }else{
          this.NextMonthData[i].PriorMonthElt_s = Math.round(this.NextMonthData[i].PriorMonthElt).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
        }
        //Delta
        if(this.NextMonthData[i].Delta == null){
          this.NextMonthData[i].Delta_s = "$0";
        }else{
          this.NextMonthData[i].Delta_s = Math.round(this.NextMonthData[i].Delta).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
        }
        //Previous Year
        if(this.NextMonthData[i].PreviousYear == null){
          this.NextMonthData[i].PreviousYear_s = "$0";
        }else{
          this.NextMonthData[i].PreviousYear_s = Math.round(this.NextMonthData[i].PreviousYear).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
        }
        //Total Account Volume
        if(this.NextMonthData[i].TotalAcountVolume == null){
          this.NextMonthData[i].TotalAcountVolume_s = "$0";
        }else{
          this.NextMonthData[i].TotalAcountVolume_s = Math.round(this.NextMonthData[i].TotalAcountVolume).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
        }
        //Comments
        if(this.NextMonthData[i].Comments == null || this.NextMonthData[i].Comments == ""){
          this.NextMonthData[i].Comments = this.NextMonthData[i].RegionComment + " " + Math.round(this.NextMonthData[i].RevenueComment).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
        }else{
        }
        if(this.NextMonthData[i].EltStatus.includes("On Track - Green")){
          this.NextMonthData[i].EltStatusColor = "green";
        }else if(this.NextMonthData[i].EltStatus.includes("Risk - Amber")){
          this.NextMonthData[i].EltStatusColor = "orange";
          //this.NextMonthData[i].TotalAcountVolume_s = this.NextMonthData[i].TotalAcountVolume.toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
        }else if(this.NextMonthData[i].EltStatus.includes("Issue - Red")){
          this.NextMonthData[i].EltStatusColor = "red";
        }else if(this.NextMonthData[i].EltStatus == null || this.NextMonthData[i].EltStatus == "")
        {
          this.NextMonthData[i].EltStatus = "On Track - Green";
          this.NextMonthData[i].EltStatusColor = "green";
        }
      }
      this.dataSource_n = new MatTableDataSource(this.NextMonthData);
      this.dataSource_n.sort = this.NextMonthDataSort;
      this.dashboard.ShowSpinnerHandler(false);
    })
    this.dashboard.ShowSpinnerHandler(true);
    this.service.RestOfMonthsELT().subscribe(data => {
      this.Month1_ry = data.ColumnOne;
      this.Month2_ry = data.ColumnTwo;
      this.RemainingMonths_ry = data.ColumnThree;
      this.PreviousYear_ry = data.ColumnYearName;
      this.RemainingMonthsData = data.Data;
      this.Month1SubTotal_ry = Math.round(data.Data.map(t => t.Month1).reduce((acc,value) => acc + value,0)).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
      // this.Month1GT_ry = Math.round(data.TotalAmountMonth1).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
      // this.Month1OC_ry = Math.round(data.TotalAmountMonth1 - data.Data.map(t => t.Month1).reduce((acc,value) => acc + value,0)).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
      this.Month2SubTotal_ry = Math.round(data.Data.map(t => t.Month2).reduce((acc,value) => acc + value,0)).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
      // this.Month2GT_ry = Math.round(data.TotalAmountMonth2).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
      // this.Month2OC_ry = Math.round(data.TotalAmountMonth2 - data.Data.map(t => t.Month2).reduce((acc,value) => acc + value,0)).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
      this.RemainingMonthsSubTotal_ry = Math.round(data.Data.map(t => t.Month1_N).reduce((acc,value) => acc + value,0) + data.Data.map(t => t.Month2_N).reduce((acc,value) => acc + value,0) + data.Data.map(t => t.RemainingTBC).reduce((acc,value) => acc + value,0)).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
      // this.RemainingGT_ry = Math.round(data.TotalAmountRemainingMonths).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
      // this.RemainingOC_ry = Math.round(data.TotalAmountRemainingMonths - (data.Data.map(t => t.Month1_N).reduce((acc,value) => acc + value,0) + data.Data.map(t => t.Month2_N).reduce((acc,value) => acc + value,0) + data.Data.map(t => t.RemainingTBC).reduce((acc,value) => acc + value,0))).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
      for(let i = 0;i<data.Data.length;i++){
        //Month1
        if(this.RemainingMonthsData[i].Month1 == null){
          this.RemainingMonthsData[i].Month1_s = "$0";
        }else{
          this.RemainingMonthsData[i].Month1_s = Math.round(this.RemainingMonthsData[i].Month1).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
        }
        //Month2
        if(this.RemainingMonthsData[i].Month2 == null){
          this.RemainingMonthsData[i].Month2_s = "$0";
        }else{
          this.RemainingMonthsData[i].Month2_s = Math.round(this.RemainingMonthsData[i].Month2).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
        }
        //RemainingMonths
        this.RemainingMonthsData[i].Remaining_Months = ((this.RemainingMonthsData[i].Month1_N) ?? 0) + ((this.RemainingMonthsData[i].Month2_N) ?? 0) + ((this.RemainingMonthsData[i].RemainingTBC) ?? 0);
        if(this.RemainingMonthsData[i].Remaining_Months == null){
          this.RemainingMonthsData[i].RemainingMonths = "$0";
        }else{
          this.RemainingMonthsData[i].RemainingMonths = Math.round(this.RemainingMonthsData[i].Remaining_Months).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
        }
        //TotalMonths
        this.RemainingMonthsData[i].Total_Months = ((this.RemainingMonthsData[i].Month1_N) ?? 0) + ((this.RemainingMonthsData[i].Month2_N) ?? 0) + ((this.RemainingMonthsData[i].RemainingTBC) ?? 0) + ((this.RemainingMonthsData[i].Month1) ?? 0) + ((this.RemainingMonthsData[i].Month2) ?? 0);
        if(this.RemainingMonthsData[i].Total_Months == null){
          this.RemainingMonthsData[i].TotalMonths = "$0";
        }else{
          this.RemainingMonthsData[i].TotalMonths = Math.round(this.RemainingMonthsData[i].Total_Months).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
        }
        //Previous Year
        if(this.RemainingMonthsData[i].PreviousYear == null){
          this.RemainingMonthsData[i].PreviousYear_s = "$0";
        }else{
          this.RemainingMonthsData[i].PreviousYear_s = Math.round(this.RemainingMonthsData[i].PreviousYear).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
        }
        //Total Account Volume
        if(this.RemainingMonthsData[i].TotalAcountVolume == null){
          this.RemainingMonthsData[i].TotalAcountVolume_s = "$0";
        }else{
          this.RemainingMonthsData[i].TotalAcountVolume_s = Math.round(this.RemainingMonthsData[i].TotalAcountVolume).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
        }
        //Comments
        if(this.RemainingMonthsData[i].Comments == null || this.RemainingMonthsData[i].Comments == ""){
          this.RemainingMonthsData[i].Comments = this.RemainingMonthsData[i].RegionComment + " " + Math.round(this.RemainingMonthsData[i].RevenueComment).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
        }else{
        }
        //EltStatus Color
        if(this.RemainingMonthsData[i].EltStatus.includes("Risk - Amber")){
          this.RemainingMonthsData[i].EltStatus = "Risk - Amber";
          this.RemainingMonthsData[i].EltStatusColor = "orange";
        }
        if(this.RemainingMonthsData[i].EltStatus.includes("On Track - Green")){
          this.RemainingMonthsData[i].EltStatusColor = "green";
        }else if(this.RemainingMonthsData[i].EltStatus.includes("Risk - Amber")){
          this.RemainingMonthsData[i].EltStatusColor = "orange";
        }else if(this.RemainingMonthsData[i].EltStatus.includes("Issue - Red")){
          this.RemainingMonthsData[i].EltStatusColor = "red";
        }else if(this.RemainingMonthsData[i].EltStatus == null || this.RemainingMonthsData[i].EltStatus == ""){
          this.RemainingMonthsData[i].EltStatus = "On Track - Green";
          this.RemainingMonthsData[i].EltStatusColor = "green";
        }
      }
      this.dataSource_Ry = new MatTableDataSource(this.RemainingMonthsData);
      this.dataSource_Ry.sort = this.RestOfTheYearDataSort;
      this.dashboard.ShowSpinnerHandler(false);
    })
    this.service.PreviousMonthsEltYearMonth().subscribe(data => {
      if(data.code == 200){
        for(let i = 0;i<data.YearMonth.length;i++){
          data.YearMonth[i].YearMonth = data.YearMonth[i].Year + " - "+ data.YearMonth[i].Month;
        }
        this.YearMonth_data = data.YearMonth;
        this.YearMonth_list.next(this.YearMonth_data.slice());
        this.DisableButton = false;
      }else{
        this.DisableButton = true;
      }
    })
    this.SearchValueChanges();
  }
  PreviousMonthsearch = new FormControl();
  protected _onDestroy = new Subject<void>();
  SearchValueChanges(){
    this.PreviousMonthsearch.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.PreviousMonthfilter();
      });
  }
  protected PreviousMonthfilter() {
    if (!this.YearMonth_data) {
      return;
    }
    // get the search keyword
    let search = this.PreviousMonthsearch.value;
    if (!search) {
      this.YearMonth_list.next(this.YearMonth_data.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the manager
    this.YearMonth_list.next(
      this.YearMonth_data.filter(manager => manager.YearMonth.toLowerCase().indexOf(search) > -1)
    );
  }
  onSelectedChange(value : string){
    if(value == "Select Value"){
    }else{
      for(let i = 0;i<this.YearMonth_data.length;i++){
        if(this.YearMonth_data[i].YearMonth == value){
          this.Dailog_Year = this.YearMonth_data[i].Year;
          this.Dailog_Month = this.YearMonth_data[i].Month;
        }
      }
      this.openPriorDialog();
    }
  }
  exportAsXLSXCM(){
    const CustomizedData = this.dataSource_c.data.map(o => {
      return { 
        "Client": o.Client,
        "APAC" : o.APAC ?? 0,
        "EMEA" : o.EMEA ?? 0,
        "LATAM" : o.LATAM ?? 0,
        "NORAM" : o.NORAM ?? 0,
        [this.CurrentMonth] : o.CurrentMonth ?? 0,
        "Volume Reported Prior Month" : o.PriorMonthElt ?? 0,
        "Delta" : o.Delta ?? 0,
        "Total Acount Volume" : o.TotalAcountVolume ?? 0,
      };
    });
    CustomizedData.push({
      "Client": 'Grand Total',
      "APAC" : CustomizedData.reduce((sum, row) => sum + (row.APAC || 0), 0),
      "EMEA" : CustomizedData.reduce((sum, row) => sum + (row.EMEA || 0), 0),
      "LATAM" : CustomizedData.reduce((sum, row) => sum + (row.LATAM || 0), 0),
      "NORAM" : CustomizedData.reduce((sum, row) => sum + (row.NORAM || 0), 0),
      [this.CurrentMonth] : CustomizedData.reduce((sum, row) => sum + (row[this.CurrentMonth] || 0), 0),
      "Volume Reported Prior Month" : CustomizedData.reduce((sum, row) => sum + (row["Volume Reported Prior Month"] || 0), 0),
      "Delta" : CustomizedData.reduce((sum, row) => sum + (row["Delta"] || 0), 0),
      "Total Acount Volume" : '',
    });
    const VarienceData =  this.dataSource_ce.data.map(o => {
      return {
        "Client" : o.Client,
        "Total Revenue Impact" : o.RevenueVolumeUSD,
        "Revenue ID" : o.RevenueID,
        "Country" : o.Country,
        "Region" : o.Region,
        "Comments" : o.Comments,
      }
    })
    let row_index = CustomizedData.length+1;
    this.excelxsService.exportAsExcelFile(
      [
        {
          sheetName: 'CurrentMonthData',
          data: CustomizedData,
          defaultBackgroundColor : 'FF34495E',
          defaultTextColor : 'FFFFFFFF',
          // headerStyles: {
          //   APAC: { textColor: 'FFFFFFFF', bgColor: 'FF4472C4' },
          //   EMEA: { textColor: 'FFFFFFFF', bgColor: 'FF4472C4' },
          // },
          columnFormats: {
            '$#,##0.00;-$#,##0.00;0.00' : ['APAC','EMEA','LATAM','NORAM',this.CurrentMonth,'Volume Reported Prior Month','Delta','Total Acount Volume'] // Negative and Positive Numbers with 2 decimals with Dolor Symbol
          },
          rowStyles: {
            [row_index] : { font: { bold: true, color: { argb: '00000000' } } }, 
          },
          columnStyles: {
            Delta: (value: number) => {
              if (value < 0) {
                return  { 
                          font : { color: { argb: 'FFFFFFFF' } },
                          fill : { type: 'pattern', pattern: 'solid', fgColor: { argb: 'ffff4848' } }
                        };
              }else if(value > 0){
                return  { 
                          font : { color: { argb: 'FFFFFFFF' } },
                          fill : { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF229954' } }
                        };
              }
              return  { 
                        font : { color: { argb: '00000000' } },
                        fill : { type: 'pattern', pattern: 'solid', fgColor: { argb: 'ffeaeded' } }
                      };
            },
            // Name: { font: { bold: true } }, // Static style
          },
        },
        {
          sheetName: 'RevenueImpactClients',
          data: VarienceData,
          defaultBackgroundColor : 'FF34495E',
          defaultTextColor : 'FFFFFFFF',
          columnFormats: {
            '$#,##0.00;-$#,##0.00;0.00' : ['Total Revenue Impact'], // Negative and Positive Numbers with 2 decimals with Dolor Symbol
            '0' : ['Revenue ID']
          },
        },
      ],
      'CurrentMonthElt'
    );
  }
  exportAsXLSXNM(){
    const CustomizedData = this.dataSource_n.data.map(o => {
      return { 
        "Client": o.Client,
        "APAC Volume" : o.APAC ?? 0,
        "EMEA Volume" : o.EMEA ?? 0,
        "LATAM Volume" : o.LATAM ?? 0,
        "NORAM Volume" : o.NORAM ?? 0,
        [this.NextMonth_N] : o.CurrentMonth ?? 0,
        "Account Volume" : o.TotalAcountVolume ?? 0,
        // EltStatus : o.EltStatus,
        // Comments : o.Comments == null || o.Comments == "" ? o.RegionComment+""+Math.round(o.RevenueComment).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3) : o.Comments,
      };
    });
    CustomizedData.push({
      "Client": 'Grand Total',
      "APAC Volume" : CustomizedData.reduce((sum, row) => sum + (row["APAC Volume"] || 0), 0),
      "EMEA Volume" : CustomizedData.reduce((sum, row) => sum + (row["EMEA Volume"] || 0), 0),
      "LATAM Volume" : CustomizedData.reduce((sum, row) => sum + (row["LATAM Volume"] || 0), 0),
      "NORAM Volume" : CustomizedData.reduce((sum, row) => sum + (row["NORAM Volume"] || 0), 0),
      [this.NextMonth_N] : CustomizedData.reduce((sum, row) => sum + (row[this.NextMonth_N] || 0), 0),
      "Account Volume" : '',
    });
    let row_index = CustomizedData.length+1;
    this.excelxsService.exportAsExcelFile(
      [
        {
          sheetName: 'NextMonthData',
          data: CustomizedData,
          defaultBackgroundColor : 'FF34495E',
          defaultTextColor : 'FFFFFFFF',
          // headerStyles: {
          //   APAC: { textColor: 'FFFFFFFF', bgColor: 'FF4472C4' },
          //   EMEA: { textColor: 'FFFFFFFF', bgColor: 'FF4472C4' },
          // },
          columnFormats: {
            '$#,##0.00;-$#,##0.00;0.00' : ['APAC Volume','EMEA Volume','LATAM Volume','NORAM Volume',this.NextMonth_N,'Account Volume'] // Negative and Positive Numbers with 2 decimals with Dolor Symbol
          },
          rowStyles: {
            [row_index] : { font: { bold: true, color: { argb: '00000000' } } }, 
          }
        },
      ],
      'NextMonthElt'
    );
  }
  exportAsXLSXROY(){
    const CustomizedData = this.dataSource_Ry.data.map(o => {
      return { 
        Client: o.Client,
        [this.Month1_ry] : o.Month1 ?? 0,
        [this.Month2_ry] : o.Month2 ?? 0,
        [this.RemainingMonths_ry] : o.Remaining_Months ?? 0,
        "Total (Status:Active/Closed/N-Active)" : o.Total_Months ?? 0,
        // EltStatus : o.EltStatus,
        "Account Volume" : o.TotalAcountVolume ?? 0,
        // Comments : o.Comments == null || o.Comments == "" ? o.RegionComment+""+Math.round(o.RevenueComment).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3) : o.Comments,
      };
    });
    CustomizedData.push({
      "Client": 'Grand Total',
      [this.Month1_ry] : CustomizedData.reduce((sum, row) => sum + (row[this.Month1_ry] || 0), 0),
      [this.Month2_ry] : CustomizedData.reduce((sum, row) => sum + (row[this.Month2_ry] || 0), 0),
      [this.RemainingMonths_ry] : CustomizedData.reduce((sum, row) => sum + (row[this.RemainingMonths_ry] || 0), 0),
      ["Total (Status:Active/Closed/N-Active)"] : '',
      "Account Volume" : '',
    });
    let row_index = CustomizedData.length+1;
    // this.excelService.exportAsExcelFile(CustomizedData, 'RestofYearElt');
    this.excelxsService.exportAsExcelFile(
      [
        {
          sheetName: 'RestOfTheYearData',
          data: CustomizedData,
          defaultBackgroundColor : 'FF34495E',
          defaultTextColor : 'FFFFFFFF',
          // headerStyles: {
          //   APAC: { textColor: 'FFFFFFFF', bgColor: 'FF4472C4' },
          //   EMEA: { textColor: 'FFFFFFFF', bgColor: 'FF4472C4' },
          // },
          columnFormats: {
            '$#,##0.00;-$#,##0.00;0.00' : [this.Month1_ry,this.Month2_ry,this.RemainingMonths_ry,"Total (Status:Active/Closed/N-Active)","Account Volume"] // Negative and Positive Numbers with 2 decimals with Dolor Symbol
          },
          rowStyles: {
            [row_index] : { font: { bold: true, color: { argb: '00000000' } } }, 
          }
        },
      ],
      'RestofTheYearElt'
    );
  }
}
@Component({
  selector: 'app-eltdailog',
  templateUrl: './eltdailog.component.html',
})
export class EltDailog {
  constructor(
    public dialogRef: MatDialogRef<EltDailog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}
  onNoClick(): void {
    this.dialogRef.close();
  }
}
@Component({
  selector: 'app-priormonthdata',
  templateUrl: './priormonthdata.component.html',
  styleUrls: ['./priormonthdata.component.css']
})
export class PriorMonthData {
  constructor(
    public dialogRef: MatDialogRef<PriorMonthData>,
    public service : DashboardServiceService,
    private excelxsService:ExcelSXService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: PriorDialogData) {}
  displayedColumns_c : string[] = ['Client','APAC_volume','EMEA_volume','LATAM_volume','NORAM_volume','CurrentMonth_s','PriorMonthElt_s','Delta_s','TotalAcountVolume_s'];//'PreviousYear_s','Status'
  dataSource_c;
  SelectedYearMonthData: EltData[];
  SelectedMonth;PreviousYear;
  SubTotalAPAC_C;SubTotalEMEA_C;SubTotalLatam_C;SubTotalNoram_C;
  SubTotal_C;GrandTotal_C;OtherClient_C;
  Dailog_Comment : string;
  Dailog_Status : string;
  Dailog_Client : string;
  
  SubTotalPriorMonth_C : string;
  displayedColumns_ce : string[] = ['Client','Revenue','RevenueId','Country','Region','Comment'];//'Comments'
  dataSource_ce;
  SubTotalDelta_c : string;
  SubTotalDelta_Color : string;
  
  @ViewChild('PriorMonthDataSort') PriorMonthDataSort: MatSort;
  @ViewChild('PriorMonthImpactedVolumeSort') PriorMonthImpactedVolumeSort: MatSort;
    ngOnInit(){
      this.service.SelectedPriorMonthYearData(this.data.Year,this.data.Month).subscribe(datas =>{
        this.SelectedMonth = this.data.Month + " " + this.data.Year + " (Status : Active/Closed)";
        // this.PreviousYear = datas.ColumnYearName;
        this.SelectedYearMonthData = datas.Data;
        this.SubTotalAPAC_C = Math.round(datas.Data.map(t => t.APAC).reduce((acc,value) => acc + value,0)).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
        this.SubTotalEMEA_C = Math.round(datas.Data.map(t => t.EMEA).reduce((acc,value) => acc + value,0)).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
        this.SubTotalLatam_C = Math.round(datas.Data.map(t => t.LATAM).reduce((acc,value) => acc + value,0)).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
        this.SubTotalNoram_C = Math.round(datas.Data.map(t => t.NORAM).reduce((acc,value) => acc + value,0)).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
        this.SubTotal_C = Math.round(datas.Data.map(t => t.Total).reduce((acc,value) => acc + value,0)).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
        this.SubTotalPriorMonth_C = Math.round(datas.Data.map(t => t.NBAPriorMonth).reduce((acc,value) => acc + value,0)).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
        // this.GrandTotal_C = Math.round(datas.TotalAmountMonth1).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
        // this.OtherClient_C = Math.round(datas.TotalAmountMonth1 - datas.Data.map(t => t.Total).reduce((acc,value) => acc + value,0)).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
        for(let i = 0;i<datas.Data.length;i++){
          //Delta
          // if(this.SelectedYearMonthData[i].Total == null){
          //   this.SelectedYearMonthData[i].DeltaColor = "white";
          //   this.SelectedYearMonthData[i].Delta_s = "$0";
          // }else{
          //   if(this.SelectedYearMonthData[i].NBAPriorMonth == 0){
          //     this.SelectedYearMonthData[i].DeltaColor = "white";
          //     this.SelectedYearMonthData[i].Delta_s = "$0";
          //   }else{  
          //     this.SelectedYearMonthData[i].Delta_s = Math.round(this.SelectedYearMonthData[i].Total-this.SelectedYearMonthData[i].NBAPriorMonth).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
          //     if((this.SelectedYearMonthData[i].Total-this.SelectedYearMonthData[i].NBAPriorMonth) > 0){
          //       this.SelectedYearMonthData[i].DeltaColor = "green";
          //     }else{
          //       this.SelectedYearMonthData[i].DeltaColor = "red";
          //     }
          //   }
          // }
          if(Math.round(this.SelectedYearMonthData[i].Delta) == 0){
            this.SelectedYearMonthData[i].DeltaColor = "white";
          }else if(Math.round(this.SelectedYearMonthData[i].Delta) > 0){
            this.SelectedYearMonthData[i].DeltaColor = "green";
          }else{
            this.SelectedYearMonthData[i].DeltaColor = "red";
          }
          this.SelectedYearMonthData[i].Delta_s = Math.round(this.SelectedYearMonthData[i].Delta).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
          
          //Current Month
          if(this.SelectedYearMonthData[i].Total == null){
            this.SelectedYearMonthData[i].CurrentMonth_s = "$0";
          }else{
            this.SelectedYearMonthData[i].CurrentMonth_s = Math.round(this.SelectedYearMonthData[i].Total).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
          }
          //Apac Region
          if(this.SelectedYearMonthData[i].APAC == null){
            this.SelectedYearMonthData[i].APAC_volume = "$0";
          }else{
            this.SelectedYearMonthData[i].APAC_volume = Math.round(this.SelectedYearMonthData[i].APAC).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
          }
          //EMEA Region
          if(this.SelectedYearMonthData[i].EMEA == null){
            this.SelectedYearMonthData[i].EMEA_volume = "$0";
          }else{
            this.SelectedYearMonthData[i].EMEA_volume = Math.round(this.SelectedYearMonthData[i].EMEA).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
          }
          //Latam Region
          if(this.SelectedYearMonthData[i].LATAM == null){
            this.SelectedYearMonthData[i].LATAM_volume = "$0";
          }else{
            this.SelectedYearMonthData[i].LATAM_volume = Math.round(this.SelectedYearMonthData[i].LATAM).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
          }
          //Noram Region
          if(this.SelectedYearMonthData[i].NORAM == null){
            this.SelectedYearMonthData[i].NORAM_volume = "$0";
          }else{
            this.SelectedYearMonthData[i].NORAM_volume = Math.round(this.SelectedYearMonthData[i].NORAM).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
          }
          //Prior Month ELT
          if(this.SelectedYearMonthData[i].NBAPriorMonth == null){
            this.SelectedYearMonthData[i].PriorMonthElt_s = "$0";
          }else{
            this.SelectedYearMonthData[i].PriorMonthElt_s = Math.round(this.SelectedYearMonthData[i].NBAPriorMonth).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
          }
          //Previous Year
          // if(this.SelectedYearMonthData[i].PreviousYear == null){
          //   this.SelectedYearMonthData[i].PreviousYear_s = "$0";
          // }else{
          //   this.SelectedYearMonthData[i].PreviousYear_s = Math.round(this.SelectedYearMonthData[i].PreviousYear).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
          // }
          //Total Account Volume
          if(this.SelectedYearMonthData[i].TotalAccountVolume == null){
            this.SelectedYearMonthData[i].TotalAcountVolume_s = "$0";
          }else{
            this.SelectedYearMonthData[i].TotalAcountVolume_s = Math.round(this.SelectedYearMonthData[i].TotalAccountVolume).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
          }
        }
        var total_Delta = this.SelectedYearMonthData.map(t => t.Delta).reduce((acc,value) => acc + value,0)
        this.SubTotalDelta_c = Math.round(total_Delta).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
        if(total_Delta == 0){
          this.SubTotalDelta_Color = 'white';
        }else if(total_Delta > 0){
          this.SubTotalDelta_Color = 'green';
        }else if(total_Delta < 0){
          this.SubTotalDelta_Color = 'red';
        }
        for(let i = 0;i<datas.ELTDeltaComments.length;i++){
          //Current Month
          if(datas.ELTDeltaComments[i].Revenue == null){
            datas.ELTDeltaComments[i].Revenue_s = "$0";
          }else{
            datas.ELTDeltaComments[i].Revenue_s = Math.round(datas.ELTDeltaComments[i].Revenue).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
          }
        }
        this.SelectedYearMonthData.sort((a, b) => a.Delta - b.Delta);
        this.dataSource_c = new MatTableDataSource(this.SelectedYearMonthData);
        this.dataSource_c.sort = this.PriorMonthDataSort;
        this.dataSource_ce = new MatTableDataSource(datas.ELTDeltaComments);
        this.dataSource_ce.sort = this.PriorMonthImpactedVolumeSort;
      });
    }
  ExportData(){
    const CustomizedData = this.dataSource_c.data.map(o => {
      return { 
        "Client": o.Client,
        "APAC" : o.APAC ?? 0,
        "EMEA" : o.EMEA ?? 0,
        "LATAM" : o.LATAM ?? 0,
        "NORAM" : o.NORAM ?? 0,
        [this.SelectedMonth] : o.Total ?? 0,
        "Volume Reported Prior Month" : o.NBAPriorMonth ?? 0,
        "Delta" : o.Delta ?? 0,
        "Total Acount Volume" : o.TotalAccountVolume ?? 0,
      };
    });
    CustomizedData.push({
      "Client": 'Grand Total',
      "APAC" : CustomizedData.reduce((sum, row) => sum + (row.APAC || 0), 0),
      "EMEA" : CustomizedData.reduce((sum, row) => sum + (row.EMEA || 0), 0),
      "LATAM" : CustomizedData.reduce((sum, row) => sum + (row.LATAM || 0), 0),
      "NORAM" : CustomizedData.reduce((sum, row) => sum + (row.NORAM || 0), 0),
      [this.SelectedMonth] : CustomizedData.reduce((sum, row) => sum + (row[this.SelectedMonth] || 0), 0),
      "Volume Reported Prior Month" : CustomizedData.reduce((sum, row) => sum + (row["Volume Reported Prior Month"] || 0), 0),
      "Delta" : CustomizedData.reduce((sum, row) => sum + (row["Delta"] || 0), 0),
      "Total Acount Volume" : '',
    });
    const VarienceData =  this.dataSource_ce.data.map(o => {
      return {
        "Client" : o.Client,
        "Total Revenue Impact" : o.Revenue,
        "Revenue ID" : o.RevenueId,
        "Country" : o.Country,
        "Region" : o.Region,
        "Reason For Impact" : o.Comment,
      }
    })
    let row_index = CustomizedData.length+1;
    this.excelxsService.exportAsExcelFile(
      [
        {
          sheetName: 'SelectedMonthData',
          data: CustomizedData,
          defaultBackgroundColor : 'FF34495E',
          defaultTextColor : 'FFFFFFFF',
          // headerStyles: {
          //   APAC: { textColor: 'FFFFFFFF', bgColor: 'FF4472C4' },
          //   EMEA: { textColor: 'FFFFFFFF', bgColor: 'FF4472C4' },
          // },
          columnFormats: {
            '$#,##0.00;-$#,##0.00;0.00' : ['APAC','EMEA','LATAM','NORAM',this.SelectedMonth,'Volume Reported Prior Month','Delta','Total Acount Volume'] // Negative and Positive Numbers with 2 decimals with Dolor Symbol
          },
          rowStyles: {
            [row_index] : { font: { bold: true, color: { argb: '00000000' } } }, 
          },
          columnStyles: {
            Delta: (value: number) => {
              if (value < 0) {
                return  { 
                          font : { color: { argb: 'FFFFFFFF' } },
                          fill : { type: 'pattern', pattern: 'solid', fgColor: { argb: 'ffff4848' } }
                        };
              }else if(value > 0){
                return  { 
                          font : { color: { argb: 'FFFFFFFF' } },
                          fill : { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF229954' } }
                        };
              }
              return  { 
                        font : { color: { argb: '00000000' } },
                        fill : { type: 'pattern', pattern: 'solid', fgColor: { argb: 'ffeaeded' } }
                      };
            },
            // Name: { font: { bold: true } }, // Static style
          },
        },
        {
          sheetName: 'RevenueImpactClients',
          data: VarienceData,
          defaultBackgroundColor : 'FF34495E',
          defaultTextColor : 'FFFFFFFF',
          columnFormats: {
            '$#,##0.00;-$#,##0.00;0.00' : ['Total Revenue Impact'], // Negative and Positive Numbers with 2 decimals with Dolor Symbol
            '0' : ['Revenue ID']
          },
        },
      ],
      'PreviousMonthElt'
    );
  }
  onNoClick(){
    this.dialogRef.close();
  }
  ShowComment(Dailog_Client : string,Dailog_Status : string,Dailog_Comment : string){
    this.Dailog_Client = Dailog_Client;
    this.Dailog_Status = Dailog_Status;
    this.Dailog_Comment = Dailog_Comment;
    this.openDialog();
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(EltDailog, {
      width: '400px',
      height : '200px',
      data: {Dailog_Comment: this.Dailog_Comment,Dailog_Client : this.Dailog_Client,Dailog_Status : this.Dailog_Status}
    });
    dialogRef.afterClosed().subscribe(result => {
      //this.Comment = result;
    });
  }
}