import { Component, OnInit, ViewChild } from '@angular/core';
import { Data } from '@angular/router';
import { DashboardServiceService } from 'src/app/dashboard-service.service';
import { ImplementationType, MilestoneStatus, Month, Ownership, ProjectLevel, Region, Year } from 'src/app/Models/Filters';
// import { LivedashboardComponent } from '../livedashboard/livedashboard.component';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CLRCommentdailog } from '../automated-clr/automated-clr.component';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-go-live-report',
  templateUrl: './go-live-report.component.html',
  styleUrls: ['./go-live-report.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class GoLiveReportComponent implements OnInit {
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  constructor(public service : DashboardServiceService,public dialog: MatDialog,) { 
    //set screenWidth on page load
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    window.onresize = () => {
      //set screenWidth on screen size change
      this.screenWidth = window.innerWidth;
      this.screenHeight = window.innerHeight;
    };
  }
  screenWidth : number;
  screenHeight : number;

  GolivedataSource;
  GolivedisplayedColumns : any[] = ['CurrentMonth','NextMonth','NextMonthPlusOne','NextMonthPlusTwo','NextMonthPlusThree'];
  GolivedisplayedCountColumns : any[] = ['CurrentMonthCount','NextMonthCount','NextMonthPlusOneCount','NextMonthPlusTwoCount','NextMonthPlusThreeCount'];
  GolivedisplayedColumnsWithExpand : any[] = ['expand','Client','Country','EltStatus',...this.GolivedisplayedColumns];
  expandedElement: Data | null;
  GoliveinnerdisplayedColumns : any[] = ['expand','Client','Country','EltStatus',...this.GolivedisplayedColumns]; 
  VolumeFooterColumns : any[] = ['CurrentMonth_footer','NextMonth_footer','NextMonthPlusOne_footer','NextMonthPlusTwo_footer','NextMonthPlusThree_footer'];
  TransactionsFooterColumns : any[] = ['CurrentMonthCount_footer','NextMonthCount_footer','NextMonthPlusOneCount_footer','NextMonthPlusTwoCount_footer','NextMonthPlusThreeCount_footer'];
  displayedColumns_footer : any[] = ['ecc_footer',...this.VolumeFooterColumns];
  columnsToDisplay_footer : string[]  = this.displayedColumns_footer.slice();
  columnsToDisplay: string[] = this.GolivedisplayedColumnsWithExpand.slice();
  columnsToDisplay_h: string[] = this.GoliveinnerdisplayedColumns.slice();
  SelectedYears = new FormControl();
  SelectedOwnership : any;SelectedMonths : any = [];
  SelectedRegions : any;SelectedStatus : any;SelectedLevels : any;
  SelectedLeader : any;SelectedMilestonestatus : any;Selectedprojectstatus : any;
  SelectedImplementation : any;

  masterownerShip : boolean;mastermonth : boolean;
  // masterregion : boolean;
  masterstatus : boolean;
  masterlevel : boolean;
  masterMilestonestatus : boolean;masterimplementation : boolean;
  monthList: any = [];
  yearList : Year[];
  yearListSelected : Year[];
  monthListSelected : Month[];
  MonthlyRevenue : Data[];
  MonthlyTotalRevenueData : Data[];
  OwnerShipList : Ownership[];
  OwnerShipListSelected : Ownership[];
  levelList : ProjectLevel[];
  levelListSelected : ProjectLevel[];
  // regionList : Region[];
  // regionListSelected : Region[];
  MilestonestatusList : MilestoneStatus[];
  MilestonestatusListSelected : MilestoneStatus[];
  implementationtypeList: ImplementationType[];
  implementationtypeListSelected : ImplementationType[];
  Apply_disable : boolean;

  matSortActiveColumn : string = "Client";
  LoginUID : string;
  CurrentMonth : string;
  NextMonth : string;
  NextMonthPlusOne : string;
  NextMonthPlusTwo : string;
  NextMonthPlusThree : string;
  CurrentMonthYear : string;
  NextMonthYear : string;
  NextMonthYearPlusOne : string;
  NextMonthYearPlusTwo : string;
  NextMonthYearPlusThree : string;
  isLoggedIn : boolean;
  EltHideColumns : boolean = true;
  ELTHideorUnhide : string = "Un-Hide ELT Columns";
  ShowTransactionsOrVolumeCheck : boolean = true;
  ShowTransactionsOrVolume : string = "Show Transactions";
  ShowTransactionsOrVolumeText : string = "Total Volume By Month :-";
  DisplayFilters : boolean = false;
  ngOnInit(): void {
    if(localStorage.getItem("UID") != null){
      this.DisplayFilters = true;
    }else{
      this.DisplayFilters = false;
    }
    this.Apply_disable = true;
    this.LoginUID = localStorage.getItem("UID");
    if(this.LoginUID == null || this.LoginUID == undefined){
      this.isLoggedIn = true;
    }else{
      this.isLoggedIn = false;
    }
    // this.dashboard.ShowSpinnerHandler(true);
    this.service.ImeetMilestoneFiltersList().subscribe(data =>{
      let todayforMonth = new Date();
      let today_forMonth = new Date();
      let today_forYear = new Date();
      this.CurrentMonth = todayforMonth.toLocaleString('en-us', { month: 'short' });
      todayforMonth.setDate(1);
      this.NextMonth = new Date(todayforMonth.setMonth(todayforMonth.getMonth()+1)).toLocaleString('en-us', { month: 'short' });
      this.NextMonthPlusOne = new Date(todayforMonth.setMonth(todayforMonth.getMonth()+1)).toLocaleString('en-us', { month: 'short' });
      this.NextMonthPlusTwo = new Date(todayforMonth.setMonth(todayforMonth.getMonth()+1)).toLocaleString('en-us', { month: 'short' });
      this.NextMonthPlusThree = new Date(todayforMonth.setMonth(todayforMonth.getMonth()+1)).toLocaleString('en-us', { month: 'short' });
      this.CurrentMonthYear = today_forMonth.toLocaleString('en-us', { month: 'short' }) + " - " + today_forYear.getFullYear();
      today_forMonth.setDate(1)
      today_forYear.setDate(1)
      this.NextMonthYear = new Date(today_forMonth.setMonth(today_forMonth.getMonth()+1)).toLocaleString('en-us', { month: 'short' }) + " - " + new Date(today_forYear.setMonth(today_forYear.getMonth()+1)).getFullYear();
      this.NextMonthYearPlusOne = new Date(today_forMonth.setMonth(today_forMonth.getMonth()+1)).toLocaleString('en-us', { month: 'short' }) + " - " + new Date(today_forYear.setMonth(today_forYear.getMonth()+1)).getFullYear();
      this.NextMonthYearPlusTwo = new Date(today_forMonth.setMonth(today_forMonth.getMonth()+1)).toLocaleString('en-us', { month: 'short' }) + " - " + new Date(today_forYear.setMonth(today_forYear.getMonth()+1)).getFullYear();
      this.NextMonthYearPlusThree = new Date(today_forMonth.setMonth(today_forMonth.getMonth()+1)).toLocaleString('en-us', { month: 'short' }) + " - " + new Date(today_forYear.setMonth(today_forYear.getMonth()+1)).getFullYear();
      this.OwnerShipList = data.OwnerShip;
      this.masterownerShip = true;
      // for (var i = 0; i < this.OwnerShipList.length; i++) {
      //   if(this.OwnerShipList[i].OwnerShip == "JV" || this.OwnerShipList[i].OwnerShip == "WO"){
      //     this.OwnerShipList[i].isSelected = true;
      //   }
      //   else{
      //     this.OwnerShipList[i].isSelected = false;
      //   }
      // }
      this.getSelectedOwnerships();
      // var CurrentMonth = (new Date()).toLocaleString('en-us', { month: 'short' });/* Jun */
      this.matSortActiveColumn = "CurrentMonth";
      // var CurrentMonth = (new Date()).toLocaleString('en-us', { month: 'long' }); /* June */
      // var CurrentMonth = (new Date()).toLocaleString('en-us', { month: 'narrow' }); /* J */
      // let count = 0;
      // for (var i = 0; i < data.Months.length; i++) {
      //   this.monthList.push(data.Months[i].Go_Live_Month);
      //   if(CurrentMonth == "Jan"){
      //     this.mastermonth = true;
      //   }else{
      //     this.mastermonth = false;
      //   }
      //   if(CurrentMonth === data.Months[i].Go_Live_Month){
      //     this.SelectedMonths.push(data.Months[i].Go_Live_Month)
      //     count = 1;
      //   }
      //   if(count == 1 && CurrentMonth != data.Months[i].Go_Live_Month){
      //     this.SelectedMonths.push(data.Months[i].Go_Live_Month)
      //   }
      // }
      // this.GoliveMonthFilter.setValue(this.SelectedMonths)
      this.columnsToDisplay = ['expand','Client','Country','EltStatus',...this.GolivedisplayedColumns];
      this.columnsToDisplay_h = ['expand','Client','Country','EltStatus',...this.GolivedisplayedColumns];
      // this.regionList = data.Region;
      // this.getSelectedRegion();
      
      this.masterRegion = true;
      this.RegionList = [];
      data.Region.forEach(item =>{
        this.RegionList.push(item.Region__Opportunity_);
      })
      this.RegionFilter.setValue(this.RegionList);
      this.getSelectedRegion();
      this.masterlevel = true;
      this.levelList = data.ProjectLevel;
      this.getSelectedLevel();
      this.implementationtypeList = data.ImplementationType;
      this.masterimplementation = false;
      for (var i = 0; i < this.implementationtypeList.length; i++) {
        if(this.implementationtypeList[i].Implementation_Type == "New Business" || this.implementationtypeList[i].Implementation_Type == "Re-Bid With Up-sell" || this.implementationtypeList[i].Implementation_Type == "Up-Sell" || this.implementationtypeList[i].Implementation_Type == "Up-Sell(Add Offices/Countries)"){
          this.implementationtypeList[i].isSelected = true;
        }
        else{
          this.implementationtypeList[i].isSelected = false;
        }
      }
      this.getSelectedType();
      this.MilestonestatusList = data.MilestoneStatus;
      this.masterMilestonestatus = false;
      for (var i = 0; i < this.MilestonestatusList.length; i++) {
        if(this.MilestonestatusList[i].iMeet_Milestone___Project_Status == "A-Active/Date Confirmed" || this.MilestonestatusList[i].iMeet_Milestone___Project_Status == "C-Closed"){
          this.MilestonestatusList[i].isSelected = true;
        }else{
          this.MilestonestatusList[i].isSelected = false;
        }
      }
      this.getSelectedMilestoneStatus();
      // this.dashboard.ShowSpinnerHandler(false);
      this.SetGraph();
    });
  }
  OnClickHideorUnhide(){
    this.EltHideColumns = !this.EltHideColumns;
    if(this.EltHideColumns == true){
      this.columnsToDisplay = ['expand','Client','Country','EltStatus',...this.GolivedisplayedColumns];
      this.columnsToDisplay_h = ['expand','Client','Country','EltStatus',...this.GolivedisplayedColumns];
      this.ELTHideorUnhide = "Un-Hide ELT Comments";
    }else{
      this.columnsToDisplay = ['expand','Client','Country','EltStatus','EltComments',...this.GolivedisplayedColumns];
      this.columnsToDisplay_h = ['expand','Client','Country','EltStatus','EltComments',...this.GolivedisplayedColumns];
      this.ELTHideorUnhide = "Hide ELT Comments";
    }
  }
  OnClickShowTransactionsOrVolume(){
    this.ShowTransactionsOrVolumeCheck = !this.ShowTransactionsOrVolumeCheck;
    if(this.ShowTransactionsOrVolumeCheck == true){
      this.columnsToDisplay = ['expand','Client','Country','EltStatus',...this.GolivedisplayedColumns];
      this.columnsToDisplay_h = ['expand','Client','Country','EltStatus',...this.GolivedisplayedColumns];
      this.columnsToDisplay_footer = ['ecc_footer',...this.VolumeFooterColumns];
      this.ShowTransactionsOrVolume = "Show Transactions";
      this.ShowTransactionsOrVolumeText = "Total Volume By Month :-";
    }else{
      this.columnsToDisplay = ['expand','Client','Country','EltStatus',...this.GolivedisplayedCountColumns];
      this.columnsToDisplay_h = ['expand','Client','Country','EltStatus',...this.GolivedisplayedCountColumns];
      this.columnsToDisplay_footer = ['ecc_footer',...this.TransactionsFooterColumns];
      this.ShowTransactionsOrVolume = "Show Volumes";
      this.ShowTransactionsOrVolumeText = "Total Transactions By Month :-";
    }
  }
  CurrentMonth_Total;NextMonth_Total;NextMonthPlusOne_Total;NextMonthPlusTwo_Total;NextMonthPlusThree_Total;
  CurrentMonthCount_Total;NextMonthCount_Total;NextMonthPlusOneCount_Total;NextMonthPlusTwoCount_Total;NextMonthPlusThreeCount_Total;
  SetGraph(){
    this.service.MarketGoliveReport(this.SelectedRegions,this.SelectedLevels,this.SelectedMilestonestatus,this.SelectedImplementation,this.SelectedOwnership).subscribe(data =>{
      this.CurrentMonth_Total = Math.round(data.Data.map(t => t.CurrentMonth).reduce((acc,value) => acc + value,0)).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.NextMonth_Total = Math.round(data.Data.map(t => t.NextMonth).reduce((acc,value) => acc + value,0)).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.NextMonthPlusOne_Total = Math.round(data.Data.map(t => t.NextMonthPlusOne).reduce((acc,value) => acc + value,0)).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.NextMonthPlusTwo_Total = Math.round(data.Data.map(t => t.NextMonthPlusTwo).reduce((acc,value) => acc + value,0)).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.NextMonthPlusThree_Total = Math.round(data.Data.map(t => t.NextMonthPlusThree).reduce((acc,value) => acc + value,0)).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.CurrentMonthCount_Total = Math.round(data.Data.map(t => t.CurrentMonthCount).reduce((acc,value) => acc + value,0));
      this.NextMonthCount_Total = Math.round(data.Data.map(t => t.NextMonthCount).reduce((acc,value) => acc + value,0));
      this.NextMonthPlusOneCount_Total = Math.round(data.Data.map(t => t.NextMonthPlusOneCount).reduce((acc,value) => acc + value,0));
      this.NextMonthPlusTwoCount_Total = Math.round(data.Data.map(t => t.NextMonthPlusTwoCount).reduce((acc,value) => acc + value,0));
      this.NextMonthPlusThreeCount_Total = Math.round(data.Data.map(t => t.NextMonthPlusThreeCount).reduce((acc,value) => acc + value,0));
      for(let i = 0;i<data.Data.length;i++){
        data.Data[i].CurrentMonth_n = Math.round(data.Data[i].CurrentMonth).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
        data.Data[i].NextMonth_n = Math.round(data.Data[i].NextMonth).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
        data.Data[i].NextMonthPlusOne_n = Math.round(data.Data[i].NextMonthPlusOne).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
        data.Data[i].NextMonthPlusTwo_n = Math.round(data.Data[i].NextMonthPlusTwo).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
        data.Data[i].NextMonthPlusThree_n = Math.round(data.Data[i].NextMonthPlusThree).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
        data.Data[i].CurrentMonthCount_n = data.Data[i].CurrentMonthCount;
        data.Data[i].NextMonthCount_n = data.Data[i].NextMonthCount;
        data.Data[i].NextMonthPlusOneCount_n = data.Data[i].NextMonthPlusOneCount;
        data.Data[i].NextMonthPlusTwoCount_n = data.Data[i].NextMonthPlusTwoCount;
        data.Data[i].NextMonthPlusThreeCount_n = data.Data[i].NextMonthPlusThreeCount;
        data.Data[i].Country = ""+ data.Data[i].CountrywiseSum.length;
        for(let j = 0;j<data.Data[i].CountrywiseSum.length;j++){
          data.Data[i].CountrywiseSum[j].CurrentMonth_n = Math.round(data.Data[i].CountrywiseSum[j].CurrentMonth).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
          data.Data[i].CountrywiseSum[j].NextMonth_n = Math.round(data.Data[i].CountrywiseSum[j].NextMonth).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
          data.Data[i].CountrywiseSum[j].NextMonthPlusOne_n = Math.round(data.Data[i].CountrywiseSum[j].NextMonthPlusOne).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
          data.Data[i].CountrywiseSum[j].NextMonthPlusTwo_n = Math.round(data.Data[i].CountrywiseSum[j].NextMonthPlusTwo).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
          data.Data[i].CountrywiseSum[j].NextMonthPlusThree_n = Math.round(data.Data[i].CountrywiseSum[j].NextMonthPlusThree).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
          data.Data[i].CountrywiseSum[j].CurrentMonthCount_n = data.Data[i].CountrywiseSum[j].CurrentMonthCount;
          data.Data[i].CountrywiseSum[j].NextMonthCount_n = data.Data[i].CountrywiseSum[j].NextMonthCount;
          data.Data[i].CountrywiseSum[j].NextMonthPlusOneCount_n = data.Data[i].CountrywiseSum[j].NextMonthPlusOneCount;
          data.Data[i].CountrywiseSum[j].NextMonthPlusTwoCount_n = data.Data[i].CountrywiseSum[j].NextMonthPlusTwoCount;
          data.Data[i].CountrywiseSum[j].NextMonthPlusThreeCount_n = data.Data[i].CountrywiseSum[j].NextMonthPlusThreeCount
        }
      }
      this.GolivedataSource = new MatTableDataSource(data.Data);
      this.GolivedataSource.sort = this.sort;
      // console.log(this.GolivedataSource)
    })
  }
  
  ResetFilters(){
    this.ngOnInit();
  }
  
  RegionList : any = [];
  RegionFilter = new FormControl();
  masterRegion : boolean;
  onRegionchange(){
    if(this.RegionList.length == this.RegionFilter.value.length){
      this.masterRegion = true;
    }else{
      this.masterRegion = false;
    }
    this.getSelectedRegion();
    this.SetGraph();
  }
  checkUncheckRegion(){
    if(this.masterRegion == true){
      this.RegionFilter.setValue(this.RegionList);
    }else{
      this.RegionFilter.setValue("");
    }
    this.getSelectedRegion();
    this.SetGraph();
  }
  // checkUncheckRegion() {
  //   for (var i = 0; i < this.regionList.length; i++) {
  //     this.regionList[i].isSelected = this.masterregion;
  //   }
  //   this.getSelectedRegion();
  // }
  // regionSelected() {
  //   this.masterregion = this.regionList.every(function(item:any) {
  //       return item.isSelected == true;
  //   })
  //   this.getSelectedRegion();
  // }
  getSelectedRegion(){
    this.SelectedRegions = null;
    for(let i=0;i<this.RegionFilter.value.length;i++){
      if(this.SelectedRegions == null){
        this.SelectedRegions = this.RegionFilter.value[i];
      }else{
        this.SelectedRegions += ","+this.RegionFilter.value[i];
      }
    }
  }
  checkUncheckLevel() {
    for (var i = 0; i < this.levelList.length; i++) {
      this.levelList[i].isSelected = this.masterlevel;
    }
    this.getSelectedLevel();
  }
  levelSelected() {
    this.masterlevel = this.levelList.every(function(item:any) {
        return item.isSelected == true;
    })
    this.getSelectedLevel();
  }
  getSelectedLevel(){
    this.Apply_disable = false;
    this.SelectedLevels = null;
    for(let i=0;i<this.levelList.length;i++){
      if(this.levelList[i].isSelected == true){
        if(this.SelectedLevels == null){
          this.SelectedLevels = this.levelList[i].iMeet_Project_Level;
        }else{
          this.SelectedLevels += ","+this.levelList[i].iMeet_Project_Level;
        }
      }else{
      }
    }
    this.levelListSelected = this.levelList.filter(s => s.isSelected == true);
  }
  checkUncheckMilestoneStatus() {
    for (var i = 0; i < this.MilestonestatusList.length; i++) {
      this.MilestonestatusList[i].isSelected = this.masterMilestonestatus;
    }
    this.getSelectedMilestoneStatus();
  }
  MilestoneStatusSelected() {
    this.masterMilestonestatus = this.MilestonestatusList.every(function(item:any) {
        return item.isSelected == true;
    })
    this.getSelectedMilestoneStatus();
  }
  getSelectedMilestoneStatus(){
    this.Apply_disable = false;
    this.SelectedMilestonestatus = null;
    for(let i=0;i<this.MilestonestatusList.length;i++){
      if(this.MilestonestatusList[i].isSelected == true){
        if(this.SelectedMilestonestatus == null){
          this.SelectedMilestonestatus = this.MilestonestatusList[i].iMeet_Milestone___Project_Status;
        }else{
          this.SelectedMilestonestatus += ","+this.MilestonestatusList[i].iMeet_Milestone___Project_Status;
        }
      }else{
      }
      // this.SelectedMilestonestatus = this.MilestonestatusList.map(x => x.iMeet_Milestone___Project_Status).join(', ');
    }
    this.MilestonestatusListSelected = this.MilestonestatusList.filter(s => s.isSelected == true);
  }
  checkUncheckImplementation() {
    for (var i = 0; i < this.implementationtypeList.length; i++) {
      this.implementationtypeList[i].isSelected = this.masterimplementation;
    }
    this.getSelectedType();
  }
  typeSelected() {
    this.masterimplementation = this.implementationtypeList.every(function(item:any) {
        return item.isSelected == true;
    })
    this.getSelectedType();
  }
  getSelectedType(){
    this.Apply_disable = false;
    this.SelectedImplementation = null;
    for(let i=0;i<this.implementationtypeList.length;i++){
      if(this.implementationtypeList[i].isSelected == true){
        if(this.SelectedImplementation == null){
          this.SelectedImplementation = this.implementationtypeList[i].Implementation_Type;
        }else{
          this.SelectedImplementation += ","+this.implementationtypeList[i].Implementation_Type;
        }
      }else{
      }
    }
    // this.implementationtypeListSelected = this.implementationtypeList.filter(s => s.isSelected == true);
  }
  checkUncheckOwnerShip() {
    for (var i = 0; i < this.OwnerShipList.length; i++) {
      this.OwnerShipList[i].isSelected = this.masterownerShip;
    }
    this.getSelectedOwnerships();
  }
  OwnerShipSelected() {
    this.masterownerShip = this.OwnerShipList.every(function(item:any) {
      return item.isSelected == true;
    })
    this.getSelectedOwnerships();
  }
  getSelectedOwnerships(){
    this.Apply_disable = false;
    this.SelectedOwnership = null;
    for(let i=0;i<this.OwnerShipList.length;i++){
      if(this.OwnerShipList[i].isSelected == true){
        if(this.SelectedOwnership == null){
          this.SelectedOwnership = this.OwnerShipList[i].OwnerShip;
        }else{
          this.SelectedOwnership += ","+this.OwnerShipList[i].OwnerShip;
        }
      }else{
      }
    }
    this.OwnerShipListSelected = this.OwnerShipList.filter(s => s.isSelected == true);
  }
  
  GoliveMonthFilter = new FormControl();
  checkUncheckMonths(){
    if(this.mastermonth == true){
      this.GoliveMonthFilter.setValue(this.monthList);
      this.columnsToDisplay = ['expand','Client','Country','EltStatus','EltComments',...this.GoliveMonthFilter.value];
      this.columnsToDisplay_h = ['expand','Client','Country','EltStatus','EltComments',...this.GoliveMonthFilter.value];
    }else{
      this.GoliveMonthFilter.setValue("");
      this.columnsToDisplay = ['expand','Client','Country','EltStatus','EltComments',];
      this.columnsToDisplay_h = ['expand','Client','Country','EltStatus','EltComments',];
    }
  }
  onmonthchange(){
    if(this.monthList.length == this.GoliveMonthFilter.value.length){
      this.mastermonth = true;
    }else{
      this.mastermonth = false;
    }
    this.columnsToDisplay = ['expand','Client','Country','EltStatus','EltComments',...this.GoliveMonthFilter.value];
    this.columnsToDisplay_h = ['expand','Client','Country','EltStatus','EltComments',...this.GoliveMonthFilter.value];
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
  Dailog_Comment : string;
  Dailog_RevenueID : string;
  Dailog_Client : string;
  ShowComment(Dailog_Client : string,Dailog_RevenueID : string,Dailog_Comment : string){
    this.Dailog_Client = Dailog_Client;
    this.Dailog_RevenueID = Dailog_RevenueID;
    this.Dailog_Comment = Dailog_Comment;
    this.openDialog();
  }
}
