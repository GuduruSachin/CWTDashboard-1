import { Component, Inject, OnInit, Optional, ViewChild, ViewEncapsulation } from '@angular/core';
import { DashboardServiceService } from 'src/app/dashboard-service.service';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { Data } from 'src/app/Models/Responce';
import { DatePipe } from '@angular/common';
import { ExcelService } from 'src/app/excel.service';
import { FormControl } from '@angular/forms';
import { Level, WorkingDay, WorkShedule, Leader, Region, CHFilter } from 'src/app/Models/CHFilter';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TrackerCommentdailog } from '../tracker/tracker.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LivedashboardComponent } from '../livedashboard/livedashboard.component';
export class MyFilter {
  Region : string;
  Level : string;
  ProjectLevel : string;
  Leader : string;
  Manager : string;
  WorkShedule : string;
  WorkingDays : string;
  Comments : string;
}
export interface ResourceDialogData {
  Dailog_ID? : number;
  Dailog_Comment? : string;
  Data? : Data[];
  Role? : String;
  SelectedWeek? : string;
}
@Component({
  selector: 'app-resource-utilization',
  templateUrl: './resource-utilization.component.html',
  styleUrls: ['./resource-utilization.component.css']
})
export class ResourceUtilizationComponent implements OnInit {
  isLoading = true;
  imageUrl : string = "assets/images/cwt.png";
  dataSource;PdataSource;
  ResUtilData : Data[];
  ProspectData : Data[];
  date = new Date();
  Levels = new FormControl();
  Regions = new FormControl();
  Leaders = new FormControl();
  Workshedules = new FormControl();
  WorkingDays = new FormControl();
  ProjectStatusFilter = new FormControl();
  LevelList : Level[];
  RegionList : Region[];
  LeaderList : Leader[];
  WorkSheduleList : WorkShedule[];
  WorkingDaysList : WorkingDay[];
  masterProjectStatus : boolean;
  ProjectStatusList : any = [];
  // masterregion : boolean;masterlevel : boolean;masterleader : boolean;mastershedule : boolean;masterdays : boolean;
  // SelectedLevel;SelectedRegion;SelectedLeader;SelectedShedule;Selecteddays;
  filterData : CHFilter[];
  GLOBAL_Rc;LOCAL_RC;APACR_RC;NORAMR_RC;LATAMR_RC;EMEAR_RC;
  GLOBAL_Rc_D;LOCAL_RC_D;APACR_RC_D;NORAMR_RC_D;LATAMR_RC_D;EMEAR_RC_D;
  Global_Count;Local_Count;APACR_Count;NORAMR_Count;LATAMR_Count;EMEAR_Count;
  Global_Count_D;Local_Count_D;APACR_Count_D;NORAMR_Count_D;LATAMR_Count_D;EMEAR_Count_D;
  C1stweek;C2ndweek;C3rdweek;C4thweek;C5thweek;C6thweek;C7thweek;C8thweek;C9thweek;C10thweek;C11thweek;C12thweek;
  c13thweek;c14thweek;c15thweek;c16thweek;c17thweek;c18thweek;c19thweek;c20thweek;c21thweek;c22thweek;c23thweek;c24thweek;
  displayedColumns: string[] = ['Region','ProjectLevel','Level','Leader','Manager','WorkingDays','Comments','RelativeCapacity','TargetedUtilization','CapacityAvailable','TUWorkingDays','CapacityAvailableTUWorkingDays','AvgUtil','C1stweek','C2ndweek','C3rdweek','C4thweek','C5thweek','C6thweek','C7thweek','C8thweek','C9thweek','C10thweek','C11thweek','C12thweek','c13thweek','c14thweek','c15thweek','c16thweek','c17thweek','c18thweek','c19thweek','c20thweek','c21thweek','c22thweek','c23thweek','c24thweek'];
  displayedColumns_h : string[] = ['Region_h','ProjectLevel_h','Level_h','Leader_h','Manager_h','WorkingDays_h','Comments_h','RelativeCapacity_h','TargetedUtilization_h','CapacityAvailable_h','TUWorkingDays_h','CapacityAvailableTUWorkingDays_h','AvgUtil_h','C1stweek_h'];
  //PdisplayedColumns: string[] = ['Region','Leader','Manager','Client_Name','PAvgUtil','C1stweek','C2ndweek','C3rdweek','C4thweek','C5thweek','C6thweek','C7thweek','C8thweek','C9thweek','C10thweek','C11thweek','C12thweek'];
  constructor(public service : DashboardServiceService,public dialog: MatDialog,public dashboard : LivedashboardComponent,public datepipe : DatePipe,public excelservice : ExcelService) {
    // set screenWidth on page load
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    window.onresize = () => {
      // set screenWidth on screen size change
      this.screenWidth = window.innerWidth;
      this.screenHeight = window.innerHeight;
    };
  }
  filteredValues : MyFilter = {
    Region : '',
    Level : '',
    ProjectLevel : '',
    Leader : '',
    Manager : '',
    WorkShedule : '',
    WorkingDays : '',Comments : ''};
  RegionFilter = new FormControl();
  LevelFilter = new FormControl();
  ProjectLevelFilter = new FormControl();
  LeaderFilter = new FormControl();
  ManagerFilter = new FormControl();
  WorkSheduleFilter = new FormControl();
  WorkingDaysFilter = new FormControl();
  CommentsFilter = new FormControl();

  @ViewChild(MatSort) sort: MatSort;
  // @ViewChild(MatPaginator) paginator: MatPaginator;
  ngAfterViewInit() {
  }
  screenWidth : number;
  screenHeight  : number;
  customFilterPredicate() {
    return (data: Data, filter: string): boolean => {
      let searchString = JSON.parse(filter) as MyFilter;
      return (
        data.Region.toString().trim().toLowerCase().indexOf(searchString.Region.toLowerCase()) !== -1 &&
        data.Level.toString().trim().toLowerCase().indexOf(searchString.Level.toLowerCase()) !== -1 &&
        data.ProjectLevel.toString().trim().toLowerCase().indexOf(searchString.ProjectLevel.toLowerCase())!== -1 &&
        data.Leader.toString().trim().toLowerCase().indexOf(searchString.Leader.toLowerCase()) !== -1 &&
        data.Manager.toString().trim().toLowerCase().indexOf(searchString.Manager.toLowerCase()) !== -1 &&
        data.WorkShedule.toString().trim().toLowerCase().indexOf(searchString.WorkShedule.toLowerCase()) !== -1 &&
        data.WorkingDays.toString().trim().toLowerCase().indexOf(searchString.WorkingDays.toLowerCase()) !== -1 &&
        data.Comments.toString().trim().toLowerCase().indexOf(searchString.Comments.toLowerCase()) !== -1
      )
    }
  }
  FilteredVolume;FilteredCount;
  onFilterValueChange(){
    this.RegionFilter.valueChanges.subscribe(value => {
      this.filteredValues["Region"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      // this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolume).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.LevelFilter.valueChanges.subscribe(value => {
      this.filteredValues["Level"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      // this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolume).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.ProjectLevelFilter.valueChanges.subscribe(value => {
      this.filteredValues["ProjectLevel"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      // this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolume).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.LeaderFilter.valueChanges.subscribe(value => {
      this.filteredValues["Leader"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      // this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolume).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.ManagerFilter.valueChanges.subscribe(value => {
      this.filteredValues["Manager"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      // this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolume).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.WorkSheduleFilter.valueChanges.subscribe(value => {
      this.filteredValues["WorkShedule"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      // this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolume).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.WorkingDaysFilter.valueChanges.subscribe(value => {
      this.filteredValues["WorkingDays"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      // this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolume).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.CommentsFilter.valueChanges.subscribe(value => {
      this.filteredValues["Comments"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      // this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolume).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.dataSource.filterPredicate = this.customFilterPredicate();
    // this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  ngOnInit(): void {
    this.isLoading = true;
    var day = this.date.getDay();
    var diff = this.date.getDate() - day + (day == 0 ? -6:1);
    this.C1stweek = this.datepipe.transform(this.date.setDate(diff), "dd-MMM-yyyy");
    this.C2ndweek = this.datepipe.transform(this.date.setDate(this.date.getDate()+7), "dd-MMM-yyyy");
    this.C3rdweek = this.datepipe.transform(this.date.setDate(this.date.getDate()+7), "dd-MMM-yyyy");
    this.C4thweek = this.datepipe.transform(this.date.setDate(this.date.getDate()+7), "dd-MMM-yyyy");
    this.C5thweek = this.datepipe.transform(this.date.setDate(this.date.getDate()+7), "dd-MMM-yyyy");
    this.C6thweek = this.datepipe.transform(this.date.setDate(this.date.getDate()+7), "dd-MMM-yyyy");
    this.C7thweek = this.datepipe.transform(this.date.setDate(this.date.getDate()+7), "dd-MMM-yyyy");
    this.C8thweek = this.datepipe.transform(this.date.setDate(this.date.getDate()+7), "dd-MMM-yyyy");
    this.C9thweek = this.datepipe.transform(this.date.setDate(this.date.getDate()+7), "dd-MMM-yyyy");
    this.C10thweek = this.datepipe.transform(this.date.setDate(this.date.getDate()+7), "dd-MMM-yyyy");
    this.C11thweek = this.datepipe.transform(this.date.setDate(this.date.getDate()+7), "dd-MMM-yyyy");
    this.C12thweek = this.datepipe.transform(this.date.setDate(this.date.getDate()+7), "dd-MMM-yyyy");
    this.c13thweek = this.datepipe.transform(this.date.setDate(this.date.getDate()+7), "dd-MMM-yyyy");
    this.c14thweek = this.datepipe.transform(this.date.setDate(this.date.getDate()+7), "dd-MMM-yyyy");
    this.c15thweek = this.datepipe.transform(this.date.setDate(this.date.getDate()+7), "dd-MMM-yyyy");
    this.c16thweek = this.datepipe.transform(this.date.setDate(this.date.getDate()+7), "dd-MMM-yyyy");
    this.c17thweek = this.datepipe.transform(this.date.setDate(this.date.getDate()+7), "dd-MMM-yyyy");
    this.c18thweek = this.datepipe.transform(this.date.setDate(this.date.getDate()+7), "dd-MMM-yyyy");
    this.c19thweek = this.datepipe.transform(this.date.setDate(this.date.getDate()+7), "dd-MMM-yyyy");
    this.c20thweek = this.datepipe.transform(this.date.setDate(this.date.getDate()+7), "dd-MMM-yyyy");
    this.c21thweek = this.datepipe.transform(this.date.setDate(this.date.getDate()+7), "dd-MMM-yyyy");
    this.c22thweek = this.datepipe.transform(this.date.setDate(this.date.getDate()+7), "dd-MMM-yyyy");
    this.c23thweek = this.datepipe.transform(this.date.setDate(this.date.getDate()+7), "dd-MMM-yyyy");
    this.c24thweek = this.datepipe.transform(this.date.setDate(this.date.getDate()+7), "dd-MMM-yyyy");
    
    // this.service.CapacityHierarchyFilters().subscribe(data =>{
    //   this.LevelList = data.Level;
    //   this.SelectedLevel = this.LevelList.map(
    //     data => data.Level
    //   );
    //   this.masterlevel = true;
    //   this.RegionList = data.Region;
    //   this.SelectedRegion = this.RegionList.map(
    //     data => data.Region
    //   );
    //   this.masterregion = true;
    //   this.LeaderList = data.Leader;
    //   this.SelectedLeader = this.LeaderList.map(
    //     data => data.Leader
    //   );
    //   this.masterleader = true;
    //   this.WorkingDaysList = data.WorkingDays;
    //   this.Selecteddays = this.WorkingDaysList.map(
    //     data => data.WorkingDays
    //   );
    //   this.masterdays = true;
    //   this.GetResUtil();
    //   //this.WorkSheduleList = data.WorkShedule;
    // })
    this.ProjectStatusList = ["A-Active/Date Confirmed","HP-High Potential","N-Active/No Date Confirmed","P-Pipeline"];
    this.ProjectStatusFilter.setValue(["A-Active/Date Confirmed","HP-High Potential","N-Active/No Date Confirmed","P-Pipeline"]);
    this.masterProjectStatus = true;
    this.P_statuslists = this.ProjectStatusList;
    this.DisableButton = true;
    this.getSelectedProjectStatus();
    // data.FilterProjectStatus.forEach(item =>{
    //   this.ProjectStatusList.push(item.ProjectStatus);
    // })
    this.GetResUtil();
  }
  TrackerData : Data[];
  GetTracker(){
    this.isLoading = true;
    // this.dashboard.ShowSpinnerHandler(true);
    this.service.Tracker().subscribe(data =>{
      if(data.code == 200){
        this.TrackerData = data.Data;
        for(let i = 0;i<data.Data.length;i++){
          if(this.TrackerData[i].Proposed_End_Date__Formula_ == null){
            this.TrackerData[i].Proposed_End_Date__Formula_ = null;
          }else{
            this.TrackerData[i].Proposed_End_Date__Formula_ = new Date(this.TrackerData[i].Proposed_End_Date__Formula_);
          }
          if(this.TrackerData[i].Proposed_Start_Date__iMeet_ == null){
            this.TrackerData[i].Proposed_Start_Date__iMeet_ = null;
          }else{
            this.TrackerData[i].Proposed_Start_Date__iMeet_ = new Date(this.TrackerData[i].Proposed_Start_Date__iMeet_);
          }
          if(this.TrackerData[i].Go_Live_Date__iMeet_ == null){
            this.TrackerData[i].Go_Live_Date__iMeet_ = null;
          }else{
            this.TrackerData[i].Go_Live_Date__iMeet_ = new Date(this.TrackerData[i].Go_Live_Date__iMeet_);
          }
          if(this.TrackerData[i].ProjectDelay == null){
            this.TrackerData[i].CompleteDuration = "0 Weeks";
          }else{
            this.TrackerData[i].CompleteDuration = Math.round(this.TrackerData[i].ProjectDelay)+' Weeks';
          }
          if(this.TrackerData[i].ProjectStartDate == null){
            this.TrackerData[i].ProjectStartDate = null;
          }else{
            this.TrackerData[i].ProjectStartDate = new Date(this.TrackerData[i].ProjectStartDate);
          }
          if(this.TrackerData[i].MilestoneDueDate == null){
            this.TrackerData[i].MilestoneDueDate = null;
          }else{
            this.TrackerData[i].MilestoneDueDate = new Date(this.TrackerData[i].MilestoneDueDate);
          }
          if(this.TrackerData[i].MilestoneDueDateByLevel == null){
            this.TrackerData[i].MilestoneDueDateByLevel = null;
          }else{
            this.TrackerData[i].MilestoneDueDateByLevel = new Date(this.TrackerData[i].MilestoneDueDateByLevel);
          }
          if(this.TrackerData[i].Country == null){
            this.TrackerData[i].Country = "";
          }else{
          }
        }
        this.isLoading = false;
      }else{
        this.isLoading = false;
      }
    });
  }
  currentweekdate = new Date;
  DisplayClients(Role : string,Manager : string,Effort : number,SelectedColumn : string){
    console.log(SelectedColumn,Manager)
    var FilteredData = [];
    FilteredData = this.TrackerData;
    if(Role == "Digital"){
      FilteredData = FilteredData.filter(data => (data.GlobalDigitalOBTLead == Manager || data.RegionalDigitalOBTLead == Manager || data.LocalDigitalOBTLead == Manager || data.GlobalDigitalPortraitLead == Manager || data.RegionalDigitalPortraitLead == Manager || data.GlobalDigitalHRFeedSpeciallist == Manager))
    }else if(Role == "Digital & PM"){
      FilteredData = FilteredData.filter(data => (data.GManager == Manager || data.RManager == Manager || data.LManager == Manager || data.GlobalDigitalOBTLead == Manager || data.RegionalDigitalOBTLead == Manager || data.LocalDigitalOBTLead == Manager || data.GlobalDigitalPortraitLead == Manager || data.RegionalDigitalPortraitLead == Manager || data.GlobalDigitalHRFeedSpeciallist == Manager))
    }else {
      FilteredData = FilteredData.filter(data => (data.GManager == Manager || data.RManager == Manager || data.LManager == Manager))
    }
    var day = this.currentweekdate.getDay();
    var diff = this.currentweekdate.getDate() - day + (day == 0 ? -6:1);
    var FirstWeek = new Date(this.currentweekdate.setDate(diff));
    var SecondWeek = new Date(this.currentweekdate.setDate(this.currentweekdate.getDate()+7));
    var ThirdWeek = new Date(this.currentweekdate.setDate(this.currentweekdate.getDate()+7));
    var FourthWeek = new Date(this.currentweekdate.setDate(this.currentweekdate.getDate()+7));
    var FivthWeek = new Date(this.currentweekdate.setDate(this.currentweekdate.getDate()+7));
    var SixthWeek = new Date(this.currentweekdate.setDate(this.currentweekdate.getDate()+7));
    var SeventhWeek = new Date(this.currentweekdate.setDate(this.currentweekdate.getDate()+7));
    var EighthWeek = new Date(this.currentweekdate.setDate(this.currentweekdate.getDate()+7));
    var NinthWeek = new Date(this.currentweekdate.setDate(this.currentweekdate.getDate()+7));
    var TenthWeek = new Date(this.currentweekdate.setDate(this.currentweekdate.getDate()+7));
    var EleventhWeek = new Date(this.currentweekdate.setDate(this.currentweekdate.getDate()+7));
    var twelvethWeek = new Date(this.currentweekdate.setDate(this.currentweekdate.getDate()+7));
    var C13thweek = new Date(this.currentweekdate.setDate(this.currentweekdate.getDate()+7));
    var C14thWeek = new Date(this.currentweekdate.setDate(this.currentweekdate.getDate()+7));
    var C15thWeek = new Date(this.currentweekdate.setDate(this.currentweekdate.getDate()+7));
    var C16thWeek = new Date(this.currentweekdate.setDate(this.currentweekdate.getDate()+7));
    var C17thWeek = new Date(this.currentweekdate.setDate(this.currentweekdate.getDate()+7));
    var C18thWeek = new Date(this.currentweekdate.setDate(this.currentweekdate.getDate()+7));
    var C19thWeek = new Date(this.currentweekdate.setDate(this.currentweekdate.getDate()+7));
    var C20thWeek = new Date(this.currentweekdate.setDate(this.currentweekdate.getDate()+7));
    var C21stWeek = new Date(this.currentweekdate.setDate(this.currentweekdate.getDate()+7));
    var C22ndWeek = new Date(this.currentweekdate.setDate(this.currentweekdate.getDate()+7));
    var C23rdWeek = new Date(this.currentweekdate.setDate(this.currentweekdate.getDate()+7));
    var C24thWeek = new Date(this.currentweekdate.setDate(this.currentweekdate.getDate()+7));
    // console.log(FirstWeek)
    var selectedWeek = '';
    switch(SelectedColumn){
      case "C1stweek" : {
        selectedWeek = this.C1stweek;
        FilteredData = FilteredData.filter(data => data.FirstWeek == 1 && this.ProjectStatusFilter.value.indexOf(data.ProjectStatus) > -1).concat(FilteredData.filter(data => data.FirstWeek == 0 && this.ProjectStatusFilter.value.indexOf(data.ProjectStatus) > -1 && FirstWeek >= data.MilestoneDueDateByLevel && FirstWeek <= data.Proposed_End_Date__Formula_ && data.Project_Level == "Global" && data.GManager == Manager)).concat(FilteredData.filter(data => data.FirstWeek == 0 && this.ProjectStatusFilter.value.indexOf(data.ProjectStatus) > -1 && FirstWeek >= data.MilestoneDueDateByLevel && FirstWeek <= data.Proposed_End_Date__Formula_ && data.Project_Level == "Regional" && data.RManager == Manager))
      }
      break;
      case "C2ndweek" : {
        selectedWeek = this.C2ndweek;
        FilteredData = FilteredData.filter(data => data.SecondWeek == 1 && this.ProjectStatusFilter.value.indexOf(data.ProjectStatus) > -1).concat(FilteredData.filter(data => data.SecondWeek == 0 && this.ProjectStatusFilter.value.indexOf(data.ProjectStatus) > -1 && SecondWeek >= data.MilestoneDueDateByLevel && SecondWeek <= data.Proposed_End_Date__Formula_ && data.Project_Level == "Global" && data.GManager == Manager)).concat(FilteredData.filter(data => data.SecondWeek == 0 && this.ProjectStatusFilter.value.indexOf(data.ProjectStatus) > -1 && SecondWeek >= data.MilestoneDueDateByLevel && SecondWeek <= data.Proposed_End_Date__Formula_ && data.Project_Level == "Regional" && data.RManager == Manager))
      }
      break;
      case "C3rdweek" : {
        selectedWeek = this.C3rdweek;
        FilteredData = FilteredData.filter(data => data.ThirdWeek == 1 && this.ProjectStatusFilter.value.indexOf(data.ProjectStatus) > -1).concat(FilteredData.filter(data => data.ThirdWeek == 0 && this.ProjectStatusFilter.value.indexOf(data.ProjectStatus) > -1 && ThirdWeek >= data.MilestoneDueDateByLevel && ThirdWeek <= data.Proposed_End_Date__Formula_ && data.Project_Level == "Global" && data.GManager == Manager)).concat(FilteredData.filter(data => data.ThirdWeek == 0 && this.ProjectStatusFilter.value.indexOf(data.ProjectStatus) > -1 && ThirdWeek >= data.MilestoneDueDateByLevel && ThirdWeek <= data.Proposed_End_Date__Formula_ && data.Project_Level == "Regional" && data.RManager == Manager))
      }
      break;
      case "C4thweek" : {
        selectedWeek = this.C4thweek;
        FilteredData = FilteredData.filter(data => data.FourthWeek == 1 && this.ProjectStatusFilter.value.indexOf(data.ProjectStatus) > -1).concat(FilteredData.filter(data => data.FourthWeek == 0 && this.ProjectStatusFilter.value.indexOf(data.ProjectStatus) > -1 && FourthWeek >= data.MilestoneDueDateByLevel && FourthWeek <= data.Proposed_End_Date__Formula_ && data.Project_Level == "Global" && data.GManager == Manager)).concat(FilteredData.filter(data => data.FourthWeek == 0 && this.ProjectStatusFilter.value.indexOf(data.ProjectStatus) > -1 && FourthWeek >= data.MilestoneDueDateByLevel && FourthWeek <= data.Proposed_End_Date__Formula_ && data.Project_Level == "Regional" && data.RManager == Manager))
      }
      break;
      case "C5thweek" : {
        selectedWeek = this.C5thweek;
        FilteredData = FilteredData.filter(data => data.FivthWeek == 1 && this.ProjectStatusFilter.value.indexOf(data.ProjectStatus) > -1).concat(FilteredData.filter(data => data.FivthWeek == 0 && this.ProjectStatusFilter.value.indexOf(data.ProjectStatus) > -1 && FivthWeek >= data.MilestoneDueDateByLevel && FivthWeek <= data.Proposed_End_Date__Formula_ && data.Project_Level == "Global" && data.GManager == Manager)).concat(FilteredData.filter(data => data.FivthWeek == 0 && this.ProjectStatusFilter.value.indexOf(data.ProjectStatus) > -1 && FivthWeek >= data.MilestoneDueDateByLevel && FivthWeek <= data.Proposed_End_Date__Formula_ && data.Project_Level == "Regional" && data.RManager == Manager))
      }
      break;
      case "C6thweek" : {
        selectedWeek = this.C6thweek;
        FilteredData = FilteredData.filter(data => data.SixthWeek == 1 && this.ProjectStatusFilter.value.indexOf(data.ProjectStatus) > -1).concat(FilteredData.filter(data => data.SixthWeek == 0 && this.ProjectStatusFilter.value.indexOf(data.ProjectStatus) > -1 && SixthWeek >= data.MilestoneDueDateByLevel && SixthWeek <= data.Proposed_End_Date__Formula_ && data.Project_Level == "Global" && data.GManager == Manager)).concat(FilteredData.filter(data => data.SixthWeek == 0 && this.ProjectStatusFilter.value.indexOf(data.ProjectStatus) > -1 && SixthWeek >= data.MilestoneDueDateByLevel && SixthWeek <= data.Proposed_End_Date__Formula_ && data.Project_Level == "Regional" && data.RManager == Manager))
      }
      break;
      case "C7thweek" : {
        selectedWeek = this.C7thweek;
        FilteredData = FilteredData.filter(data => data.SeventhWeek == 1 && this.ProjectStatusFilter.value.indexOf(data.ProjectStatus) > -1).concat(FilteredData.filter(data => data.SeventhWeek == 0 && this.ProjectStatusFilter.value.indexOf(data.ProjectStatus) > -1 && SeventhWeek >= data.MilestoneDueDateByLevel && SeventhWeek <= data.Proposed_End_Date__Formula_ && data.Project_Level == "Global" && data.GManager == Manager)).concat(FilteredData.filter(data => data.SeventhWeek == 0 && this.ProjectStatusFilter.value.indexOf(data.ProjectStatus) > -1 && SeventhWeek >= data.MilestoneDueDateByLevel && SeventhWeek <= data.Proposed_End_Date__Formula_ && data.Project_Level == "Regional" && data.RManager == Manager))
      }
      break;
      case "C8thweek" : {
        selectedWeek = this.C8thweek;
        FilteredData = FilteredData.filter(data => data.EighthWeek == 1 && this.ProjectStatusFilter.value.indexOf(data.ProjectStatus) > -1).concat(FilteredData.filter(data => data.EighthWeek == 0 && this.ProjectStatusFilter.value.indexOf(data.ProjectStatus) > -1 && EighthWeek >= data.MilestoneDueDateByLevel && EighthWeek <= data.Proposed_End_Date__Formula_ && data.Project_Level == "Global" && data.GManager == Manager)).concat(FilteredData.filter(data => data.EighthWeek == 0 && this.ProjectStatusFilter.value.indexOf(data.ProjectStatus) > -1 && EighthWeek >= data.MilestoneDueDateByLevel && EighthWeek <= data.Proposed_End_Date__Formula_ && data.Project_Level == "Regional" && data.RManager == Manager))
      }
      break;
      case "C9thweek" : {
        selectedWeek = this.C9thweek;
        FilteredData = FilteredData.filter(data => data.NinthWeek == 1 && this.ProjectStatusFilter.value.indexOf(data.ProjectStatus) > -1).concat(FilteredData.filter(data => data.NinthWeek == 0 && this.ProjectStatusFilter.value.indexOf(data.ProjectStatus) > -1 && NinthWeek >= data.MilestoneDueDateByLevel && NinthWeek <= data.Proposed_End_Date__Formula_ && data.Project_Level == "Global" && data.GManager == Manager)).concat(FilteredData.filter(data => data.NinthWeek == 0 && this.ProjectStatusFilter.value.indexOf(data.ProjectStatus) > -1 && NinthWeek >= data.MilestoneDueDateByLevel && NinthWeek <= data.Proposed_End_Date__Formula_ && data.Project_Level == "Regional" && data.RManager == Manager))
      }
      break;
      case "C10thweek" : {
        selectedWeek = this.C10thweek;
        FilteredData = FilteredData.filter(data => data.TenthWeek == 1 && this.ProjectStatusFilter.value.indexOf(data.ProjectStatus) > -1).concat(FilteredData.filter(data => data.TenthWeek == 0 && this.ProjectStatusFilter.value.indexOf(data.ProjectStatus) > -1 && TenthWeek >= data.MilestoneDueDateByLevel && TenthWeek <= data.Proposed_End_Date__Formula_ && data.Project_Level == "Global" && data.GManager == Manager)).concat(FilteredData.filter(data => data.TenthWeek == 0 && this.ProjectStatusFilter.value.indexOf(data.ProjectStatus) > -1 && TenthWeek >= data.MilestoneDueDateByLevel && TenthWeek <= data.Proposed_End_Date__Formula_ && data.Project_Level == "Regional" && data.RManager == Manager))
      }
      break;
      case "C11thweek" : {
        selectedWeek = this.C11thweek;
        FilteredData = FilteredData.filter(data => data.EleventhWeek == 1 && this.ProjectStatusFilter.value.indexOf(data.ProjectStatus) > -1).concat(FilteredData.filter(data => data.EleventhWeek == 0 && this.ProjectStatusFilter.value.indexOf(data.ProjectStatus) > -1 && EleventhWeek >= data.MilestoneDueDateByLevel && EleventhWeek <= data.Proposed_End_Date__Formula_ && data.Project_Level == "Global" && data.GManager == Manager)).concat(FilteredData.filter(data => data.EleventhWeek == 0 && this.ProjectStatusFilter.value.indexOf(data.ProjectStatus) > -1 && EleventhWeek >= data.MilestoneDueDateByLevel && EleventhWeek <= data.Proposed_End_Date__Formula_ && data.Project_Level == "Regional" && data.RManager == Manager))
      }
      break;
      case "C12thweek" : {
        selectedWeek = this.C12thweek;
        FilteredData = FilteredData.filter(data => data.twelvethWeek == 1 && this.ProjectStatusFilter.value.indexOf(data.ProjectStatus) > -1).concat(FilteredData.filter(data => data.twelvethWeek == 0 && this.ProjectStatusFilter.value.indexOf(data.ProjectStatus) > -1 && twelvethWeek >= data.MilestoneDueDateByLevel && twelvethWeek <= data.Proposed_End_Date__Formula_ && data.Project_Level == "Global" && data.GManager == Manager)).concat(FilteredData.filter(data => data.twelvethWeek == 0 && this.ProjectStatusFilter.value.indexOf(data.ProjectStatus) > -1 && twelvethWeek >= data.MilestoneDueDateByLevel && twelvethWeek <= data.Proposed_End_Date__Formula_ && data.Project_Level == "Regional" && data.RManager == Manager))
      }
      break;
      case "c13thweek" : {
        selectedWeek = this.c13thweek;
        FilteredData = FilteredData.filter(data => data.C13thweek == 1 && this.ProjectStatusFilter.value.indexOf(data.ProjectStatus) > -1).concat(FilteredData.filter(data => data.C13thweek == 0 && this.ProjectStatusFilter.value.indexOf(data.ProjectStatus) > -1 && C13thweek >= data.MilestoneDueDateByLevel && C13thweek <= data.Proposed_End_Date__Formula_ && data.Project_Level == "Global" && data.GManager == Manager)).concat(FilteredData.filter(data => data.C13thweek == 0 && this.ProjectStatusFilter.value.indexOf(data.ProjectStatus) > -1 && C13thweek >= data.MilestoneDueDateByLevel && C13thweek <= data.Proposed_End_Date__Formula_ && data.Project_Level == "Regional" && data.RManager == Manager))
      }
      break;
      case "c14thweek" : {
        selectedWeek = this.c14thweek;
        FilteredData = FilteredData.filter(data => data.C14thWeek == 1 && this.ProjectStatusFilter.value.indexOf(data.ProjectStatus) > -1).concat(FilteredData.filter(data => data.C14thWeek == 0 && this.ProjectStatusFilter.value.indexOf(data.ProjectStatus) > -1 && C14thWeek >= data.MilestoneDueDateByLevel && C14thWeek <= data.Proposed_End_Date__Formula_ && data.Project_Level == "Global" && data.GManager == Manager)).concat(FilteredData.filter(data => data.C14thWeek == 0 && this.ProjectStatusFilter.value.indexOf(data.ProjectStatus) > -1 && C14thWeek >= data.MilestoneDueDateByLevel && C14thWeek <= data.Proposed_End_Date__Formula_ && data.Project_Level == "Regional" && data.RManager == Manager))
      }
      break;
      case "c15thweek" : {
        selectedWeek = this.c15thweek;
        FilteredData = FilteredData.filter(data => data.C15thWeek == 1 && this.ProjectStatusFilter.value.indexOf(data.ProjectStatus) > -1).concat(FilteredData.filter(data => data.C15thWeek == 0 && this.ProjectStatusFilter.value.indexOf(data.ProjectStatus) > -1 && C15thWeek >= data.MilestoneDueDateByLevel && C15thWeek <= data.Proposed_End_Date__Formula_ && data.Project_Level == "Global" && data.GManager == Manager)).concat(FilteredData.filter(data => data.C15thWeek == 0 && this.ProjectStatusFilter.value.indexOf(data.ProjectStatus) > -1 && C15thWeek >= data.MilestoneDueDateByLevel && C15thWeek <= data.Proposed_End_Date__Formula_ && data.Project_Level == "Regional" && data.RManager == Manager))
      }
      break;
      case "c16thweek" : {
        selectedWeek = this.c16thweek;
        FilteredData = FilteredData.filter(data => data.C16thWeek == 1 && this.ProjectStatusFilter.value.indexOf(data.ProjectStatus) > -1).concat(FilteredData.filter(data => data.C16thWeek == 0 && this.ProjectStatusFilter.value.indexOf(data.ProjectStatus) > -1 && C16thWeek >= data.MilestoneDueDateByLevel && C16thWeek <= data.Proposed_End_Date__Formula_ && data.Project_Level == "Global" && data.GManager == Manager)).concat(FilteredData.filter(data => data.C16thWeek == 0 && this.ProjectStatusFilter.value.indexOf(data.ProjectStatus) > -1 && C16thWeek >= data.MilestoneDueDateByLevel && C16thWeek <= data.Proposed_End_Date__Formula_ && data.Project_Level == "Regional" && data.RManager == Manager))
      }
      break;
      case "c17thweek" : {
        selectedWeek = this.c17thweek;
        FilteredData = FilteredData.filter(data => data.C17thWeek == 1 && this.ProjectStatusFilter.value.indexOf(data.ProjectStatus) > -1).concat(FilteredData.filter(data => data.C17thWeek == 0 && this.ProjectStatusFilter.value.indexOf(data.ProjectStatus) > -1 && C17thWeek >= data.MilestoneDueDateByLevel && C17thWeek <= data.Proposed_End_Date__Formula_ && data.Project_Level == "Global" && data.GManager == Manager)).concat(FilteredData.filter(data => data.C17thWeek == 0 && this.ProjectStatusFilter.value.indexOf(data.ProjectStatus) > -1 && C17thWeek >= data.MilestoneDueDateByLevel && C17thWeek <= data.Proposed_End_Date__Formula_ && data.Project_Level == "Regional" && data.RManager == Manager))
      }
      break;
      case "c18thweek" : {
        selectedWeek = this.c18thweek;
        FilteredData = FilteredData.filter(data => data.C18thWeek == 1 && this.ProjectStatusFilter.value.indexOf(data.ProjectStatus) > -1).concat(FilteredData.filter(data => data.C18thWeek == 0 && this.ProjectStatusFilter.value.indexOf(data.ProjectStatus) > -1 && C18thWeek >= data.MilestoneDueDateByLevel && C18thWeek <= data.Proposed_End_Date__Formula_ && data.Project_Level == "Global" && data.GManager == Manager)).concat(FilteredData.filter(data => data.C18thWeek == 0 && this.ProjectStatusFilter.value.indexOf(data.ProjectStatus) > -1 && C18thWeek >= data.MilestoneDueDateByLevel && C18thWeek <= data.Proposed_End_Date__Formula_ && data.Project_Level == "Regional" && data.RManager == Manager))
      }
      break;
      case "c19thweek" : {
        selectedWeek = this.c19thweek;
        FilteredData = FilteredData.filter(data => data.C19thWeek == 1 && this.ProjectStatusFilter.value.indexOf(data.ProjectStatus) > -1).concat(FilteredData.filter(data => data.C19thWeek == 0 && this.ProjectStatusFilter.value.indexOf(data.ProjectStatus) > -1 && C19thWeek >= data.MilestoneDueDateByLevel && C19thWeek <= data.Proposed_End_Date__Formula_ && data.Project_Level == "Global" && data.GManager == Manager)).concat(FilteredData.filter(data => data.C19thWeek == 0 && this.ProjectStatusFilter.value.indexOf(data.ProjectStatus) > -1 && C19thWeek >= data.MilestoneDueDateByLevel && C19thWeek <= data.Proposed_End_Date__Formula_ && data.Project_Level == "Regional" && data.RManager == Manager))
      }
      break;
      case "c20thweek" : {
        selectedWeek = this.c20thweek;
        FilteredData = FilteredData.filter(data => data.C20thWeek == 1 && this.ProjectStatusFilter.value.indexOf(data.ProjectStatus) > -1).concat(FilteredData.filter(data => data.C20thWeek == 0 && this.ProjectStatusFilter.value.indexOf(data.ProjectStatus) > -1 && C20thWeek >= data.MilestoneDueDateByLevel && C20thWeek <= data.Proposed_End_Date__Formula_ && data.Project_Level == "Global" && data.GManager == Manager)).concat(FilteredData.filter(data => data.C20thWeek == 0 && this.ProjectStatusFilter.value.indexOf(data.ProjectStatus) > -1 && C20thWeek >= data.MilestoneDueDateByLevel && C20thWeek <= data.Proposed_End_Date__Formula_ && data.Project_Level == "Regional" && data.RManager == Manager))
      }
      break;
      case "c21thweek" : {
        selectedWeek = this.c21thweek;
        FilteredData = FilteredData.filter(data => data.C21stWeek == 1 && this.ProjectStatusFilter.value.indexOf(data.ProjectStatus) > -1).concat(FilteredData.filter(data => data.C21stWeek == 0 && this.ProjectStatusFilter.value.indexOf(data.ProjectStatus) > -1 && C21stWeek >= data.MilestoneDueDateByLevel && C21stWeek <= data.Proposed_End_Date__Formula_ && data.Project_Level == "Global" && data.GManager == Manager)).concat(FilteredData.filter(data => data.C21stWeek == 0 && this.ProjectStatusFilter.value.indexOf(data.ProjectStatus) > -1 && C21stWeek >= data.MilestoneDueDateByLevel && C21stWeek <= data.Proposed_End_Date__Formula_ && data.Project_Level == "Regional" && data.RManager == Manager))
      }
      break;
      case "c22thweek" : {
        selectedWeek = this.c22thweek;
        FilteredData = FilteredData.filter(data => data.C22ndWeek == 1 && this.ProjectStatusFilter.value.indexOf(data.ProjectStatus) > -1).concat(FilteredData.filter(data => data.C22ndWeek == 0 && this.ProjectStatusFilter.value.indexOf(data.ProjectStatus) > -1 && C22ndWeek >= data.MilestoneDueDateByLevel && C22ndWeek <= data.Proposed_End_Date__Formula_ && data.Project_Level == "Global" && data.GManager == Manager)).concat(FilteredData.filter(data => data.C22ndWeek == 0 && this.ProjectStatusFilter.value.indexOf(data.ProjectStatus) > -1 && C22ndWeek >= data.MilestoneDueDateByLevel && C22ndWeek <= data.Proposed_End_Date__Formula_ && data.Project_Level == "Regional" && data.RManager == Manager))
      }
      break;
      case "c23thweek" : {
        selectedWeek = this.c23thweek;
        FilteredData = FilteredData.filter(data => data.C23rdWeek == 1 && this.ProjectStatusFilter.value.indexOf(data.ProjectStatus) > -1).concat(FilteredData.filter(data => data.C23rdWeek == 0 && this.ProjectStatusFilter.value.indexOf(data.ProjectStatus) > -1 && C23rdWeek >= data.MilestoneDueDateByLevel && C23rdWeek <= data.Proposed_End_Date__Formula_ && data.Project_Level == "Global" && data.GManager == Manager)).concat(FilteredData.filter(data => data.C23rdWeek == 0 && this.ProjectStatusFilter.value.indexOf(data.ProjectStatus) > -1 && C23rdWeek >= data.MilestoneDueDateByLevel && C23rdWeek <= data.Proposed_End_Date__Formula_ && data.Project_Level == "Regional" && data.RManager == Manager))
      }
      break;
      case "c24thweek" : {
        selectedWeek = this.c24thweek;
        FilteredData = FilteredData.filter(data => data.C24thWeek == 1 && this.ProjectStatusFilter.value.indexOf(data.ProjectStatus) > -1).concat(FilteredData.filter(data => data.C24thWeek == 0 && this.ProjectStatusFilter.value.indexOf(data.ProjectStatus) > -1 && C24thWeek >= data.MilestoneDueDateByLevel && C24thWeek <= data.Proposed_End_Date__Formula_ && data.Project_Level == "Global" && data.GManager == Manager)).concat(FilteredData.filter(data => data.C24thWeek == 0 && this.ProjectStatusFilter.value.indexOf(data.ProjectStatus) > -1 && C24thWeek >= data.MilestoneDueDateByLevel && C24thWeek <= data.Proposed_End_Date__Formula_ && data.Project_Level == "Regional" && data.RManager == Manager))
      }
      break;
    }
    if(FilteredData.length > 0){
      let data: ResourceDialogData ={
        Dailog_ID : Effort,
        Dailog_Comment : Manager,
        Data : FilteredData,
        Role : Role,
        SelectedWeek : selectedWeek
      }
      const dialogRef = this.dialog.open(ResourceClientDetails, {
        // width: '400px',
        data : data
      });
      dialogRef.afterClosed().subscribe(result => {
      });
    }
  }
  P_statuslists : any;
  DisableButton : boolean = true;
  applyFilter(){
    this.GetResUtil();
    this.P_statuslists = this.ProjectStatusFilter.value;
    this.DisableButton = true;
  }
  GetResUtil(){
    this.isLoading = true;
    this.service.ResourceUtilizationNew(this.SelectedStatus).subscribe(data =>{
      if(data.code == 200){
        this.ResUtilData = data.Data;
        this.Global_Count = this.ResUtilData.filter(item => item.ProjectLevel === 'Global' && item.Level != 'Digital' && item.Level != 'Digital & PM').length;
        this.Global_Count_D = this.ResUtilData.filter(item => item.ProjectLevel === 'Global' && item.Level === 'Digital').length;
        this.GLOBAL_Rc = this.ResUtilData.filter(item => item.ProjectLevel === 'Global' && item.Level != 'Digital' && item.Level != 'Digital & PM').reduce((sum,current) => sum + current.AvgUtil, 0);
        this.GLOBAL_Rc_D = this.ResUtilData.filter(item => item.ProjectLevel === 'Global' && item.Level === 'Digital').reduce((sum,current) => sum + current.AvgUtil, 0);
        this.Local_Count = this.ResUtilData.filter(item => item.ProjectLevel != 'Global' && item.ProjectLevel != "Regional" && item.Level != 'Digital' && item.Level != 'Digital & PM').length;
        this.Local_Count_D = this.ResUtilData.filter(item => item.ProjectLevel != 'Global' && item.ProjectLevel != "Regional" && item.Level === 'Digital').length;
        this.LOCAL_RC = this.ResUtilData.filter(item => item.ProjectLevel != 'Global' && item.ProjectLevel != "Regional" && item.Level != 'Digital' && item.Level != 'Digital & PM').reduce((sum,current) => sum + current.AvgUtil, 0);
        this.LOCAL_RC_D = this.ResUtilData.filter(item => item.ProjectLevel != 'Global' && item.ProjectLevel != "Regional" && item.Level === 'Digital').reduce((sum,current) => sum + current.AvgUtil, 0);
        this.APACR_Count = this.ResUtilData.filter(item => item.ProjectLevel === 'Regional' && item.Region === 'APAC' && item.Level != 'Digital' && item.Level != 'Digital & PM').length;
        this.APACR_Count_D = this.ResUtilData.filter(item => item.ProjectLevel === 'Regional' && item.Region === 'APAC' && item.Level === 'Digital').length;
        this.APACR_RC = this.ResUtilData.filter(item => item.ProjectLevel === 'Regional' && item.Region === 'APAC' && item.Level != 'Digital' && item.Level != 'Digital & PM').reduce((sum,current) => sum + current.AvgUtil, 0);
        this.APACR_RC_D = this.ResUtilData.filter(item => item.ProjectLevel === 'Regional' && item.Region === 'APAC' && item.Level === 'Digital').reduce((sum,current) => sum + current.AvgUtil, 0);
        this.EMEAR_Count = this.ResUtilData.filter(item => item.ProjectLevel === 'Regional' && item.Region === 'EMEA' && item.Level != 'Digital' && item.Level != 'Digital & PM').length;
        this.EMEAR_Count_D = this.ResUtilData.filter(item => item.ProjectLevel === 'Regional' && item.Region === 'EMEA' && item.Level === 'Digital').length;
        this.EMEAR_RC = this.ResUtilData.filter(item => item.ProjectLevel === 'Regional' && item.Region === 'EMEA' && item.Level != 'Digital' && item.Level != 'Digital & PM').reduce((sum,current) => sum + current.AvgUtil, 0);
        this.EMEAR_RC_D = this.ResUtilData.filter(item => item.ProjectLevel === 'Regional' && item.Region === 'EMEA' && item.Level === 'Digital').reduce((sum,current) => sum + current.AvgUtil, 0);
        this.LATAMR_Count = this.ResUtilData.filter(item => item.ProjectLevel === 'Regional' && item.Region === 'LATAM' && item.Level != 'Digital' && item.Level != 'Digital & PM').length;
        this.LATAMR_Count_D = this.ResUtilData.filter(item => item.ProjectLevel === 'Regional' && item.Region === 'LATAM' && item.Level === 'Digital').length;
        this.LATAMR_RC = this.ResUtilData.filter(item => item.ProjectLevel === 'Regional' && item.Region === 'LATAM' && item.Level != 'Digital' && item.Level != 'Digital & PM').reduce((sum,current) => sum + current.AvgUtil, 0);
        this.LATAMR_RC_D = this.ResUtilData.filter(item => item.ProjectLevel === 'Regional' && item.Region === 'LATAM' && item.Level === 'Digital').reduce((sum,current) => sum + current.AvgUtil, 0);
        this.NORAMR_Count = this.ResUtilData.filter(item => item.ProjectLevel === 'Regional' && item.Region === 'NORAM' && item.Level != 'Digital' && item.Level != 'Digital & PM').length;
        this.NORAMR_Count_D = this.ResUtilData.filter(item => item.ProjectLevel === 'Regional' && item.Region === 'NORAM' && item.Level === 'Digital').length;
        this.NORAMR_RC = this.ResUtilData.filter(item => item.ProjectLevel === 'Regional' && item.Region === 'NORAM' && item.Level != 'Digital' && item.Level != 'Digital & PM').reduce((sum,current) => sum + current.AvgUtil, 0);
        this.NORAMR_RC_D = this.ResUtilData.filter(item => item.ProjectLevel === 'Regional' && item.Region === 'NORAM' && item.Level === 'Digital').reduce((sum,current) => sum + current.AvgUtil, 0);
        
        for(let i = 0;i<data.Data.length;i++){
          this.ResUtilData[i].C1stweek = Math.round(this.ResUtilData[i].C1stweek);
          this.ResUtilData[i].C2ndweek = Math.round(this.ResUtilData[i].C2ndweek);
          this.ResUtilData[i].C3rdweek = Math.round(this.ResUtilData[i].C3rdweek);
          this.ResUtilData[i].C4thweek = Math.round(this.ResUtilData[i].C4thweek);
          this.ResUtilData[i].C5thweek = Math.round(this.ResUtilData[i].C5thweek);
          this.ResUtilData[i].C6thweek = Math.round(this.ResUtilData[i].C6thweek);
          this.ResUtilData[i].C7thweek = Math.round(this.ResUtilData[i].C7thweek);
          this.ResUtilData[i].C8thweek = Math.round(this.ResUtilData[i].C8thweek);
          this.ResUtilData[i].C9thweek = Math.round(this.ResUtilData[i].C9thweek);
          this.ResUtilData[i].C10thweek = Math.round(this.ResUtilData[i].C10thweek);
          this.ResUtilData[i].C11thweek = Math.round(this.ResUtilData[i].C11thweek);
          this.ResUtilData[i].C12thweek = Math.round(this.ResUtilData[i].C12thweek);
          this.ResUtilData[i].c13thweek = Math.round(this.ResUtilData[i].c13thweek);
          this.ResUtilData[i].c14thweek = Math.round(this.ResUtilData[i].c14thweek);
          this.ResUtilData[i].c15thweek = Math.round(this.ResUtilData[i].c15thweek);
          this.ResUtilData[i].c16thweek = Math.round(this.ResUtilData[i].c16thweek);
          this.ResUtilData[i].c17thweek = Math.round(this.ResUtilData[i].c17thweek);
          this.ResUtilData[i].c18thweek = Math.round(this.ResUtilData[i].c18thweek);
          this.ResUtilData[i].c19thweek = Math.round(this.ResUtilData[i].c19thweek);
          this.ResUtilData[i].c20thweek = Math.round(this.ResUtilData[i].c20thweek);
          this.ResUtilData[i].c21thweek = Math.round(this.ResUtilData[i].c21thweek);
          this.ResUtilData[i].c22thweek = Math.round(this.ResUtilData[i].c22thweek);
          this.ResUtilData[i].c23thweek = Math.round(this.ResUtilData[i].c23thweek);
          this.ResUtilData[i].c24thweek = Math.round(this.ResUtilData[i].c24thweek);
          this.ResUtilData[i].AvgUtil = parseFloat(this.ResUtilData[i].AvgUtil.toFixed(2));
          this.ResUtilData[i].TargetedUtilization = this.ResUtilData[i].TargetedUtilization ?? 0;
          this.ResUtilData[i].TUWorkingDays = parseFloat(this.ResUtilData[i].TUWorkingDays.toFixed(2));
          this.ResUtilData[i].CapacityAvailable = parseFloat((this.ResUtilData[i].CapacityAvailable).toFixed(2));
          this.ResUtilData[i].CapacityAvailableTUWorkingDays = parseFloat((this.ResUtilData[i].CapacityAvailableTUWorkingDays).toFixed(2));
          if(this.ResUtilData[i].CapacityAvailable >= 0){
            this.ResUtilData[i].CATUColor = "Green";
          }else{
            this.ResUtilData[i].CATUColor = "Red";
          }
          if(this.ResUtilData[i].CapacityAvailableTUWorkingDays >= 0){
            this.ResUtilData[i].CATUWDColor = "Green";
          }else{
            this.ResUtilData[i].CATUWDColor = "Red";
          }
          if(this.ResUtilData[i].Level == "Digital & PM"){
            this.ResUtilData[i].RelativeCapacity = 0;
          }else if(this.ResUtilData[i].ProjectLevel == "Global" && this.ResUtilData[i].Level != "Digital"){
            this.ResUtilData[i].RelativeCapacity = (this.ResUtilData[i].AvgUtil/(this.GLOBAL_Rc/this.Global_Count)).toFixed(2);
          }else if(this.ResUtilData[i].ProjectLevel == "Global" && this.ResUtilData[i].Level == "Digital"){
            this.ResUtilData[i].RelativeCapacity = (this.ResUtilData[i].AvgUtil/(this.GLOBAL_Rc_D/this.Global_Count_D)).toFixed(2);
          }else if(this.ResUtilData[i].ProjectLevel == "Regional" && this.ResUtilData[i].Region == "APAC" && this.ResUtilData[i].Level != "Digital"){
            this.ResUtilData[i].RelativeCapacity = (this.ResUtilData[i].AvgUtil/(this.APACR_RC/this.APACR_Count)).toFixed(2);
          }else if(this.ResUtilData[i].ProjectLevel == "Regional" && this.ResUtilData[i].Region == "APAC" && this.ResUtilData[i].Level == "Digital"){
            this.ResUtilData[i].RelativeCapacity = (this.ResUtilData[i].AvgUtil/(this.APACR_RC_D/this.APACR_Count_D)).toFixed(2);
          }else if(this.ResUtilData[i].ProjectLevel == "Regional" && this.ResUtilData[i].Region == "LATAM" && this.ResUtilData[i].Level != "Digital"){
            this.ResUtilData[i].RelativeCapacity = (this.ResUtilData[i].AvgUtil/(this.LATAMR_RC/this.LATAMR_Count)).toFixed(2);
          }else if(this.ResUtilData[i].ProjectLevel == "Regional" && this.ResUtilData[i].Region == "LATAM" && this.ResUtilData[i].Level == "Digital"){
            this.ResUtilData[i].RelativeCapacity = (this.ResUtilData[i].AvgUtil/(this.LATAMR_RC_D/this.LATAMR_Count_D)).toFixed(2);
          }else if(this.ResUtilData[i].ProjectLevel == "Regional" && this.ResUtilData[i].Region == "NORAM" && this.ResUtilData[i].Level != "Digital"){
            this.ResUtilData[i].RelativeCapacity = (this.ResUtilData[i].AvgUtil/(this.NORAMR_RC/this.NORAMR_Count)).toFixed(2);
          }else if(this.ResUtilData[i].ProjectLevel == "Regional" && this.ResUtilData[i].Region == "NORAM" && this.ResUtilData[i].Level == "Digital"){
            this.ResUtilData[i].RelativeCapacity = (this.ResUtilData[i].AvgUtil/(this.NORAMR_RC_D/this.NORAMR_Count_D)).toFixed(2);
          }else if(this.ResUtilData[i].ProjectLevel == "Regional" && this.ResUtilData[i].Region == "EMEA" && this.ResUtilData[i].Level != "Digital"){
            this.ResUtilData[i].RelativeCapacity = (this.ResUtilData[i].AvgUtil/(this.EMEAR_RC/this.EMEAR_Count)).toFixed(2);
          }else if(this.ResUtilData[i].ProjectLevel == "Regional" && this.ResUtilData[i].Region == "EMEA" && this.ResUtilData[i].Level == "Digital"){
            this.ResUtilData[i].RelativeCapacity = (this.ResUtilData[i].AvgUtil/(this.EMEAR_RC_D/this.EMEAR_Count_D)).toFixed(2);
          }else if(this.ResUtilData[i].ProjectLevel != "Global" && this.ResUtilData[i].ProjectLevel != "Regional" && this.ResUtilData[i].Level != "Digital"){
            this.ResUtilData[i].RelativeCapacity = (this.ResUtilData[i].AvgUtil/(this.LOCAL_RC/this.Local_Count)).toFixed(2);
          }else if(this.ResUtilData[i].ProjectLevel != "Global" && this.ResUtilData[i].ProjectLevel != "Regional" && this.ResUtilData[i].Level == "Digital"){
            this.ResUtilData[i].RelativeCapacity = (this.ResUtilData[i].AvgUtil/(this.LOCAL_RC_D/this.Local_Count_D)).toFixed(2);
          }else{
            this.ResUtilData[i].RelativeCapacity = 0;
          }
          if(this.ResUtilData[i].RelativeCapacity == 0){
            this.ResUtilData[i].RCColor = "white";
          }else if(this.ResUtilData[i].RelativeCapacity > 1.2){
            this.ResUtilData[i].RCColor = "Red";
          }else if(this.ResUtilData[i].RelativeCapacity > 0 && this.ResUtilData[i].RelativeCapacity <0.8){
            this.ResUtilData[i].RCColor = "Yellow";
          }else if(this.ResUtilData[i].RelativeCapacity >= 0.8 && this.ResUtilData[i].RelativeCapacity <=1.2){
            this.ResUtilData[i].RCColor = "Green";
          }
        }
        this.dataSource = null;
        this.dataSource = new MatTableDataSource(this.ResUtilData);
        this.onFilterValueChange();
        this.FilteredCount = this.dataSource.filteredData.length;
        this.GetTracker();
      }else{
        this.dataSource = null;
        this.isLoading = false;
      }
    });
  }
  checkUncheckProjectStatus(){
    if(this.masterProjectStatus == true){
      this.ProjectStatusFilter.setValue(this.ProjectStatusList);
    }else{
      this.ProjectStatusFilter.setValue("");
    }
    this.getSelectedProjectStatus();
  }
  onProjectStatuschange(){
    if(this.ProjectStatusList.length == this.ProjectStatusFilter.value.length){
      this.masterProjectStatus = true;
    }else{
      this.masterProjectStatus = false;
    }
    
    this.getSelectedProjectStatus();
  }
  SelectedStatus : string = "";
  getSelectedProjectStatus(){
    var count = 0;
    if(this.P_statuslists.length == this.ProjectStatusFilter.value.length){
      for(let i = 0;i< this.P_statuslists.length;i++){
        if(this.ProjectStatusFilter.value.includes(this.P_statuslists[i])){
          count++;
        }
      }
      if(this.P_statuslists.length == count){
        this.DisableButton = true;
      }else{
        this.DisableButton = false;
      }
    }else{
      this.DisableButton = false;
    }
    this.SelectedStatus = null;
    for(let i=0;i<this.ProjectStatusFilter.value.length;i++){
      if(this.SelectedStatus == null){
        if(this.ProjectStatusFilter.value[i] == null || this.ProjectStatusFilter.value[i] == ""){
          this.SelectedStatus = "";
        }else{
          this.SelectedStatus = this.ProjectStatusFilter.value[i];
        }
      }else{
        this.SelectedStatus += ","+this.ProjectStatusFilter.value[i];
      }
    }
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(TrackerCommentdailog, {
      // width: '400px',
      data: {
        Dailog_Comment: this.Dailog_Comment,
        Dailog_Client : this.Dailog_Client,
        Dailog_RevenueID : this.Dailog_RevenueID
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      //this.Comment = result;
      // this.GetData();
    });
  }
  Dailog_Comment : string;
  Dailog_RevenueID : string;
  Dailog_Client : string;
  OpenComment(HierarchyID : number,comment : string){
    let data: ResourceDialogData = {
      Dailog_ID: HierarchyID,
      Dailog_Comment : comment
    }
    const dialogRef = this.dialog.open(ResourceComment, {
      // width: '400px',
      data : data
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result.SelectionType == "Update"){
        for(let i = 0;i<this.dataSource.data.length;i++){
          if(this.dataSource.data[i].HierarchyID == result.HierarchyID){
            if(result.Comments == null || result.Comments == undefined){
            }else{
              this.dataSource.data[i].Comments = result.Comments;
            }
            break;
          }
        }
      }
    });
  }
  ShowComment(Dailog_Client : string,Dailog_RevenueID : string,Dailog_Comment : string){
    this.Dailog_Client = Dailog_Client;
    this.Dailog_RevenueID = Dailog_RevenueID;
    if(this.Dailog_Client == "Relative Capacity"){
      this.Dailog_Comment = "Relative Capacity is the Average Utilization of the resource for next four weeks divided by Average utilization of all resources available in that pool."+'\n';
      this.Dailog_Comment += "(For Eg: Lets say 'John Doe' has a Avg. Utilization of 15 and is part of the 'Global' Pool consisting of 5 resources where other four Global Manager have Avg. Utilization of 6, 11, 14, 7. So Relative Capacity of 'John Doe would be 15 divided by 9.5 (average of 6, 11, 14, 7) = 1.57. What this tells us is that 'John Doe' has more projects than her capacity and leades needs to route her work to other available resoures)." + '\n' + '\n';
      this.Dailog_Comment += "Legend :" + '\n';
      this.Dailog_Comment += "========" + '\n';
      this.Dailog_Comment += "0.1 to 0.8 - Under utilized and can manage more projects" + '\n';
      this.Dailog_Comment += "0.8 to 1.2 - Optimally utilized" + '\n';
      this.Dailog_Comment += "1.2 and above - Over utilized and needs to direct projects to other resources";
    }else if(this.Dailog_Client == "Targeted Utilization"){
      this.Dailog_Comment = "Targeted Utilization is the minimum number of projects that a resource can handle in a month."+'\n'+'\n';
      this.Dailog_Comment += "Global PM's - 30" + '\n';
      this.Dailog_Comment += "Regional PM's - 20" + '\n';
      this.Dailog_Comment += "LATAM Regional PM's - 10" + '\n';
      this.Dailog_Comment += "Local PM's - 5" + '\n';
      this.Dailog_Comment += "EMEA - India Local PM's - 15" + '\n';
      this.Dailog_Comment += "NORAM - Local PM's - 10" + '\n' + '\n';
      this.Dailog_Comment += "Global Digital - 50" + '\n';
      this.Dailog_Comment += "Regional Digital - 35" + '\n';
      this.Dailog_Comment += "Local Digital - 25";
    }else if(this.Dailog_Client == "Capacity Available"){
      this.Dailog_Comment = "Capacity Available is Target Utilization minus Average Utilization of the resource for next four weeks."+'\n';
      this.Dailog_Comment += "(For Eg: 'Jane Doe' has Target Utilization of 30 as she is part of Global Project Manager pool and her Avg. Utilization is 20. S0 30-20 would be 10. What this tells us is that 'Jane Doe' has a capacity of taking additional 10 projects to meet her threshold of 30).";
    }else if(this.Dailog_Client == "Targeted Utilization (Considering Working Days of Resource)"){
      this.Dailog_Comment = "Its same as Targeted Utilization but taking into consideration - the working days of the resource"+'\n';
    }else if(this.Dailog_Client == "Capacity Available (Considering Working Days of Resource)"){
      this.Dailog_Comment = "Its same as Capacity Available but taking into consideration - the working days of the resource"+'\n';
    }else if(this.Dailog_Client == "Average Utilization for Next 4 Weeks"){
      this.Dailog_Comment = "This is the average capacity of how many projects a resource is handing for upcoming 4 weeks."+'\n'+'\n';
      this.Dailog_Comment += "For Eg :"+'\n';
      this.Dailog_Comment += "========"+'\n';
      this.Dailog_Comment += "'John Doe' is handling 24, 16, 20, 24 projects for each upcoming week. The average project at a time for next month would be 24+16+20+24 divided by 4 which equals to 21.";
    }else{
      this.Dailog_Comment = Dailog_Comment;
    }
    this.openDialog();
  }
  exportResUtil(){
    const CustomizedData = this.dataSource.filteredData.map(o => {
      return {
        'Region' : o.Region,
        'Project Level' : o.ProjectLevel,
        'Leader' : o.Leader,
        'Manager' : o.Manager,
        'Manager Level' : o.Level,
        'Working Days' : o.WorkingDays,
        'Comments' : o.Comments,
        'Relative Capacity' : o.RelativeCapacity,
        'Targeted Utilization' : o.TargetedUtilization,
        'Capacity Available' : o.CapacityAvailable,
        'Targeted Utilization Working Days' : o.TUWorkingDays,
        'Capacity Available Targeted Utilization for Working Days' : o.CapacityAvailableTUWorkingDays,
        'Average of First 4 Weeks' : o.AvgUtil,
        [this.C1stweek] : o.C1stweek,
        [this.C2ndweek] : o.C2ndweek,
        [this.C3rdweek] : o.C3rdweek,
        [this.C4thweek] : o.C4thweek,
        [this.C5thweek] : o.C5thweek,
        [this.C6thweek] : o.C6thweek,
        [this.C7thweek] : o.C7thweek,
        [this.C8thweek] : o.C8thweek,
        [this.C9thweek] : o.C9thweek,
        [this.C10thweek] : o.C10thweek,
        [this.C11thweek] : o.C11thweek,
        [this.C12thweek] : o.C12thweek,
        [this.c13thweek] : o.c13thweek,
        [this.c14thweek] : o.c14thweek,
        [this.c15thweek] : o.c15thweek,
        [this.c16thweek] : o.c16thweek,
        [this.c17thweek] : o.c17thweek,
        [this.c18thweek] : o.c18thweek,
        [this.c19thweek] : o.c19thweek,
        [this.c20thweek] : o.c20thweek,
        [this.c21thweek] : o.c21thweek,
        [this.c22thweek] : o.c22thweek,
        [this.c23thweek] : o.c23thweek,
        [this.c24thweek] : o.c24thweek,
      };
    });
    this.excelservice.exportAsExcelFile(CustomizedData, 'ResourceUtilization');
  }
  // checkUncheckLevel(){
  //   if(this.masterlevel == true){
  //     this.SelectedLevel = null;
  //     this.SelectedLevel = this.LevelList.map(
  //       data => data.Level
  //     );
  //   }else{
  //     this.SelectedLevel = null;
  //   }
  // }
  // checkUncheckRegion(){
  //   if(this.masterregion == true){
  //     this.SelectedRegion = null;
  //     this.SelectedRegion = this.RegionList.map(
  //       data => data.Region
  //     );
  //   }else{
  //     this.SelectedRegion = null;
  //   }
  // }
  // checkUncheckLeader(){
  //   if(this.masterleader == true){
  //     this.SelectedLeader = null;
  //     this.SelectedLeader = this.LeaderList.map(
  //       data => data.Leader
  //     );
  //   }else{
  //     this.SelectedLeader = null;
  //   }
  // }
  // checkUncheckshedule(){
  //   if(this.mastershedule == true){
  //     this.SelectedShedule = null;
  //     this.SelectedShedule = this.WorkSheduleList.map(
  //       data => data.WorkShedule
  //     );
  //   }else{
  //     this.SelectedShedule = null;
  //   }
  // }
  // checkUncheckworkdays(){
  //   if(this.masterdays == true){
  //     this.Selecteddays = null;
  //     this.Selecteddays = this.WorkingDaysList.map(
  //       data => data.WorkingDays
  //     );
  //   }else{
  //     this.Selecteddays = null;
  //   }
  // }
}

@Component({
  selector: 'app-resource-comment',
  templateUrl: './resource-comment.component.html',
  styleUrls: ['./resource-comment.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ResourceComment {
  constructor(
    public datepipe : DatePipe,
    public service : DashboardServiceService,
    public dialogRef: MatDialogRef<ResourceComment>,
    @Inject(MAT_DIALOG_DATA) public data: ResourceDialogData) {
      this.screenWidth = window.innerWidth;
      this.screenHeight = window.innerHeight;
      window.onresize = () => {
        // set screenWidth on screen size change
        this.screenWidth = window.innerWidth;
        this.screenHeight = window.innerHeight;
      };
      this.HierarchyID = data.Dailog_ID;
      this.Comments = data.Dailog_Comment;
    }
    screenWidth
    screenHeight
    HierarchyID;
    Comments;
    Comment;
    DisableButton : boolean = true;
  @ViewChild(MatSort) sort: MatSort;
  OnCloseClick(): void {
    this.dialogRef.close({SelectionType : 'Cancel'});
  }
  ngOnInit(){
    this.Comment = this.Comments;
  }
  onCommentChanged(){
    if(this.Comments == this.Comment){
      this.DisableButton = true;
    }else{
      this.DisableButton = false;
    }
  }
  UpdateComment(){
    if(this.DisableButton == false){
      this.service.UpdateHierarchyComment(this.HierarchyID,this.Comments).subscribe(data =>{
        if(data.code == 200){
          this.dialogRef.close({SelectionType : 'Update',HierarchyID : this.HierarchyID,Comments : this.Comments});
        }else{
          alert(data.message)
        }
      })
    }
  }
}
@Component({
  selector: 'app-resource-client-details',
  templateUrl: './resource-client-details.component.html',
  styleUrls: ['./resource-client-details.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ResourceClientDetails {
  constructor(
    public dialogRef: MatDialogRef<ResourceClientDetails>,
    @Inject(MAT_DIALOG_DATA) public data: ResourceDialogData) {
      this.screenWidth = window.innerWidth;
      this.screenHeight = window.innerHeight;
      window.onresize = () => {
        // set screenWidth on screen size change
        this.screenWidth = window.innerWidth;
        this.screenHeight = window.innerHeight;
      };
      this.SelectedWeek = data.SelectedWeek;
      console.log(data.Data)
      this.Tracker_Data = data.Data;
      console.log(this.Tracker_Data)
      this.Manager = data.Dailog_Comment;
      this.TotalEffort = data.Dailog_ID;
      if(data.Role == "Digital"){
        this.Digital = true;
        this.PM = false;
      }else if(data.Role == "Digital & PM"){
        this.Digital = true;
        this.PM = true;
      }else{
        this.Digital = false;
        this.PM = true;
      }
    }
    screenWidth
    screenHeight;
    SelectedWeek;
    Tracker_Data : Data[];
  TotalEffort : number;
  Manager : string;
  Digital : Boolean = false;
  PM : Boolean = false;
  // OnCloseClick(): void {
  //   this.dialogRef.close({SelectionType : 'Cancel'});
  // }
  tooltipOptions = {
    placement: 'bottom',
    'show-delay': 300,
    // width: 1000,
    width : 400,
    maxwidth: 400,
    theme: 'light',
  };
  ngOnInit(){
    for(let i = 0;i < this.Tracker_Data.length;i++){
      var count;
      var Digital_count;
      var isDigital;
      var PM_count;
      if(this.Digital == true){
        if(this.Tracker_Data[i].GlobalDigitalOBTLead != this.Manager && this.Tracker_Data[i].RegionalDigitalOBTLead != this.Manager && this.Tracker_Data[i].LocalDigitalOBTLead != this.Manager && this.Tracker_Data[i].GlobalDigitalPortraitLead != this.Manager && this.Tracker_Data[i].RegionalDigitalPortraitLead != this.Manager && this.Tracker_Data[i].GlobalDigitalHRFeedSpeciallist != this.Manager){
          this.Tracker_Data[i].Complexity_Score = this.Tracker_Data[i].ComplexityScore;
        }else{
          if(this.Tracker_Data[i].GlobalDigitalHRFeedSpeciallist == this.Manager){
            this.Tracker_Data[i].Complexity_Score = this.Tracker_Data[i].ComplexityScore;
          }else{
            if(this.Tracker_Data[i].GlobalDigitalOBTLead == this.Manager || this.Tracker_Data[i].GlobalDigitalPortraitLead == this.Manager){
              this.Tracker_Data[i].Complexity_Score = this.Tracker_Data[i].ComplexityScore;
            }else if(this.Tracker_Data[i].GlobalDigitalOBTLead == "---" && this.Tracker_Data[i].GlobalDigitalPortraitLead == "---"){
              this.Tracker_Data[i].Complexity_Score = this.Tracker_Data[i].ComplexityScore;
            }else{
              console.log(this.Tracker_Data[i].GlobalDigitalOBTLead,this.Tracker_Data[i].GlobalDigitalPortraitLead)
              if(this.Tracker_Data[i].ComplexityScore > 1){
                this.Tracker_Data[i].Complexity_Score = this.Tracker_Data[i].ComplexityScore - 1;
              }else{
                this.Tracker_Data[i].Complexity_Score = this.Tracker_Data[i].ComplexityScore;
              }
            }
          }
        }
      }
      if(this.Digital == true && this.PM == true){
        if(this.Tracker_Data[i].GlobalDigitalOBTLead == this.Manager || this.Tracker_Data[i].RegionalDigitalOBTLead == this.Manager || this.Tracker_Data[i].LocalDigitalOBTLead == this.Manager || this.Tracker_Data[i].GlobalDigitalPortraitLead == this.Manager || this.Tracker_Data[i].RegionalDigitalPortraitLead == this.Manager || this.Tracker_Data[i].GlobalDigitalHRFeedSpeciallist == this.Manager){
          isDigital = true;
        }else{
          isDigital = false;
        }
        if(this.Tracker_Data[i].GManager == this.Manager || this.Tracker_Data[i].RManager == this.Manager || this.Tracker_Data[i].LManager == this.Manager){
          PM_count = 1;
        }else{
          PM_count = 0;
        }
        count = PM_count == 1 ? (this.Tracker_Data[i].GManager == this.Manager ? 1 : 0) + (this.Tracker_Data[i].RManager == this.Manager ? 1 : 0) + (this.Tracker_Data[i].LManager == this.Manager ? 1 : 0) : 0
        Digital_count = isDigital == true ? this.Tracker_Data[i].Complexity_Score : 0;
        this.Tracker_Data[i].CalculatedEffort = "("+this.Tracker_Data[i].ProjectEffort +" * "+count+") + " + Digital_count+ " = "+((this.Tracker_Data[i].ProjectEffort * count)+Digital_count);
      }else if(this.Digital == true && this.PM == false){
        count = 0;
      }else{
        count = (this.Tracker_Data[i].GManager == this.Manager ? 1 : 0) + (this.Tracker_Data[i].RManager == this.Manager ? 1 : 0) + (this.Tracker_Data[i].LManager == this.Manager ? 1 : 0)
        this.Tracker_Data[i].CalculatedEffort = this.Tracker_Data[i].ProjectEffort +" * "+count+" = "+(this.Tracker_Data[i].ProjectEffort * count);
      }
    }
  }
}