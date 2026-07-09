import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DashboardServiceService } from 'src/app/dashboard-service.service';
import { LivedashboardComponent } from '../livedashboard/livedashboard.component';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { DatePipe } from '@angular/common';
export interface ParsingData{
  UID : string;
  UserName : string;
  IMPS: boolean;
  CTO: boolean;
  StageGate: boolean;
  LessonsLearnt: boolean;
  AutomatedCLR: boolean;
  MarketReport : boolean;
  MarketCommentsEdit : boolean;
  ELTReport: boolean;
  CLREdits : boolean;
  CycleTime: boolean;
  UserAccessStatus: string;
  AccountStatus: string;
  CapacityTracker: boolean;
  CapacityHierarchy: boolean;
  CapacityHierarchyEdits: boolean;
  ResourceUtilization: boolean;
  NPS : boolean;
  NPSAdmin : boolean;
  NPSClientInfo : boolean;
  NPSEdit : boolean;
  DigitalReport : boolean;
  PerformanceAnalysis : boolean;
  JobType : string;
  SteeringCommittee : boolean;
  SteeringCommitteeEdits : boolean;
  DDOReports : boolean;
  DDOHome : boolean;
  PriorityReport : boolean;
}
@Component({
  selector: 'app-admincontrol',
  templateUrl: './admincontrol.component.html',
  styleUrls: ['./admincontrol.component.css']
})
export class AdmincontrolComponent implements OnInit {
  LoginUID : string;
  dataSource;dataSource_notifications;
  screenWidth : number;
  SemiAnnual;Year;
  screenHeight : number;ShowNotificationsTable:boolean = false;
  //displayedColumns : string[] = ['UID', 'UserName','IMPS','CTO','LessonsLearnt','StageGate','MarketReport','AutomatedCLR','CLREdits','CapacityTracker','ELTReport','CycleTime','C_Hierarchy','UserAccessStatus','ResourceUtilization','Prospect','InsertedOn','UpdatedOn','UpdatedBy'];
  displayedColumns : string[] = ['UID', 'UserName','JobType','AutomatedCLR','CLREdits','MarketReport','MarketCommentsEdit','ELTReport','CycleTime','IMPS','CTO','LessonsLearnt','StageGate','CapacityTracker','ResourceUtilization','C_Hierarchy','C_HierarchyEdits','PerformanceAnalysis','NPS','NPSAdmin','NPSClientInfo','NPSEdit','DigitalReport','SteeringCommittee','SteeringCommitteeEdits','DDO','DDOHome','PriorityReport','UserAccessStatus','AccountStatus','InsertedOn_s','UpdatedOn_s','UpdatedBy','actions'];
  displayedColumns_notifications : string[] = ['UID','Username','ReportName','RequestedOn','TicketStatuts','actions'];
  constructor(public service : DashboardServiceService,public dashboard : LivedashboardComponent,public dialog: MatDialog,public datepipe : DatePipe,) { 
    //set screenWidth on page load
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    window.onresize = () => {
      //set screenWidth on screen size change
      this.screenWidth = window.innerWidth;
      this.screenHeight = window.innerHeight;
    };
  }
  ButtonText;dataSource_CTT;
  displayedColumns_CTT : string[] = ['TargetID','ExistingServiceConfigChange','NewGlobal','NewLocal','NewRegional','Overall','ExistingAddChange','Year','Months','actions'];
  displayedColumns_RU_ON : string[] = ['ReportName','Updated_On','AvailableRows','UploadedRows'];
  dataSource_RU_ON;
  // @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild('UserDetailsSort') UserDetailsSort: MatSort;
  // @ViewChild(MatPaginator) paginator: MatPaginator;
  ngOnInit(): void {
    this.ButtonText = "Save";
    this.GetData();
    this.GetCycleTimeTargets();
  }
  GetData(){
    this.dashboard.ShowSpinnerHandler(true);
    this.LoginUID = localStorage.getItem("UID");
    this.service.UserAccessDetailsForAdmin(this.LoginUID).subscribe(data =>{
      if(data.code == 200){
        for(let i=0;i<data.Data.length;i++){
          if(data.Data[i].IMPS == true){
            data.Data[i].IMPS_icon = "check_circle";
          }else{
            data.Data[i].IMPS_icon ="cancel";
          }
          if(data.Data[i].CTO == true){
            data.Data[i].CTO_icon = "check_circle";
          }else{
            data.Data[i].CTO_icon ="cancel";
          }
          if(data.Data[i].LessonsLearnt == true){
            data.Data[i].LessonsLearnt_icon = "check_circle";
          }else{
            data.Data[i].LessonsLearnt_icon ="cancel";
          }
          if(data.Data[i].StageGate == true){
            data.Data[i].StageGate_icon = "check_circle";
          }else{
            data.Data[i].StageGate_icon ="cancel";
          }
          if(data.Data[i].AutomatedCLR == true){
            data.Data[i].AutomatedCLR_icon = "check_circle";
          }else{
            data.Data[i].AutomatedCLR_icon ="cancel";
          }
          if(data.Data[i].CycleTime == true){
            data.Data[i].CycleTime_icon = "check_circle";
          }else{
            data.Data[i].CycleTime_icon ="cancel";
          }
          if(data.Data[i].CLREdits == true){
            data.Data[i].CLREdits_icon = "check_circle";
          }else{
            data.Data[i].CLREdits_icon ="cancel";
          }
          if(data.Data[i].MarketReport == true){
            data.Data[i].MarketReport_icon = "check_circle";
          }else{
            data.Data[i].MarketReport_icon ="cancel";
          }
          if(data.Data[i].MarketCommentsEdit == true){
            data.Data[i].MarketCommentsEdit_icon = "check_circle";
          }else{
            data.Data[i].MarketCommentsEdit_icon ="cancel";
          }
          if(data.Data[i].ELTReport == true){
            data.Data[i].ELTReport_icon = "check_circle";
          }else{
            data.Data[i].ELTReport_icon ="cancel";
          }
          if(data.Data[i].C_Hierarchy == true){
            data.Data[i].C_Hierarchy_icon = "check_circle";
          }else{
            data.Data[i].C_Hierarchy_icon ="cancel";
          }
          if(data.Data[i].C_HierarchyEdits == true){
            data.Data[i].C_HierarchyEdits_icon = "check_circle";
          }else{
            data.Data[i].C_HierarchyEdits_icon ="cancel";
          }
          if(data.Data[i].CapacityTracker == true){
            data.Data[i].CapacityTracker_icon = "check_circle";
          }else{
            data.Data[i].CapacityTracker_icon ="cancel";
          }
          if(data.Data[i].ResourceUtilization == true){
            data.Data[i].ResourceUtilization_icon = "check_circle";
          }else{
            data.Data[i].ResourceUtilization_icon ="cancel";
          }
          if(data.Data[i].PerformanceAnalysis == true){
            data.Data[i].PerformanceAnalysis_icon = "check_circle";
          }else{
            data.Data[i].PerformanceAnalysis_icon ="cancel";
          }
          if(data.Data[i].NPS == true){
            data.Data[i].NPS_icon = "check_circle";
          }else{
            data.Data[i].NPS_icon ="cancel";
          }
          if(data.Data[i].InsertedOn == null){
            data.Data[i].InsertedOn_s = "---";
          }else{
            data.Data[i].InsertedOn_s = this.datepipe.transform(data.Data[i].InsertedOn, "yyyy-MMM-dd");
          }
          if(data.Data[i].UpdatedOn == null){
            data.Data[i].UpdatedOn_s = "---";
          }else{
            data.Data[i].UpdatedOn_s = this.datepipe.transform(data.Data[i].UpdatedOn, "yyyy-MMM-dd");
          }
          if(data.Data[i].NPSEdit == true){
            data.Data[i].NPSEdit_icon = "check_circle";
          }else{
            data.Data[i].NPSEdit_icon ="cancel";
          }
          if(data.Data[i].NPSAdmin == true){
            data.Data[i].NPSAdmin_icon = "check_circle";
          }else{
            data.Data[i].NPSAdmin_icon ="cancel";
          }
          if(data.Data[i].NPSClientInfo == true){
            data.Data[i].NPSClientInfo_icon = "check_circle";
          }else{
            data.Data[i].NPSClientInfo_icon ="cancel";
          }
          if(data.Data[i].DigitalReport == true){
            data.Data[i].DigitalReport_icon = "check_circle";
          }else{
            data.Data[i].DigitalReport_icon ="cancel";
          }
          if(data.Data[i].SteeringCommittee == true){
            data.Data[i].SteeringCommittee_icon = "check_circle";
          }else{
            data.Data[i].SteeringCommittee_icon ="cancel";
          }
          if(data.Data[i].SteeringCommitteeEdits == true){
            data.Data[i].SteeringCommitteeEdits_icon = "check_circle";
          }else{
            data.Data[i].SteeringCommitteeEdits_icon ="cancel";
          }
          if(data.Data[i].DDO == true){
            data.Data[i].DDO_icon = "check_circle";
          }else{
            data.Data[i].DDO_icon ="cancel";
          }
          if(data.Data[i].DDOHome == true){
            data.Data[i].DDOHome_icon = "check_circle";
          }else{
            data.Data[i].DDOHome_icon ="cancel";
          }
          if(data.Data[i].PriorityReport == true){
            data.Data[i].PriorityReport_icon = "check_circle";
          }else{
            data.Data[i].PriorityReport_icon ="cancel";
          }
        }
        this.dataSource = new MatTableDataSource(data.Data);
        // this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.UserDetailsSort;
        this.FilteredCount = this.dataSource.filteredData.length;
      }else{
        alert("SOmething went wrong please try again later");
      }
      this.dashboard.ShowSpinnerHandler(false);
    })
    this.dashboard.ShowSpinnerHandler(true);
    this.service.RequestAccessNotifications(this.LoginUID).subscribe(data =>{
      if(data.code == 200){
        this.dataSource_notifications = data.Data;
        if(data.Data == null || data.Data.length == 0){
          this.ShowNotificationsTable = false;
        }else{
          this.ShowNotificationsTable = true;
        }
      }else{
        alert("SOmething went wrong please try again later");
      }
      this.dashboard.ShowSpinnerHandler(false);
    })
    
    this.dashboard.ShowSpinnerHandler(true);
    this.service.GetReportsUpdatedON().subscribe(data=>{
      console.log(data);
      if(data.code == 200){
        this.dataSource_RU_ON = new MatTableDataSource(data.ReportsUpdatedON);
      }
      this.dashboard.ShowSpinnerHandler(false);
    })
    // this.dashboard.ShowSpinnerHandler(true);
    // this.service.TargetsCycleTimeData().subscribe(data =>{
    //   // this.TargetID = data.Data[0].TargetID;
    //   // this.NewGlobal = data.Data[0].NewGlobal;
    //   // this.NewRegional = data.Data[0].NewRegional;
    //   // this.NewLocal = data.Data[0].NewLocal;
    //   // this.Overall = data.Data[0].Overall;
    //   // this.ExistingAddChangeOBT = data.Data[0].ExistingAddChange;
    //   // this.ExistingServiceConfigChange = data.Data[0].ExistingServiceConfigChange;
    //   this.dashboard.ShowSpinnerHandler(false);
    // })
  }
  GetCycleTimeTargets(){
    this.dashboard.ShowSpinnerHandler(true);
    this.service.TargetsCycleTimeData().subscribe((data:any)=>{
      console.log(data);
      if(data.code == 200){
        this.dataSource_CTT = new MatTableDataSource(data.Data);
      }
      this.dashboard.ShowSpinnerHandler(false);
    })
  }
  NewGlobal : string = "0";NewRegional : string = "0";NewLocal : string = "0";Overall : string = "0";ExistingAddChange : string = "0";ExistingServiceConfigChange : string = "0";TargetID;
  OnUpdateClick(){
    if(this.ButtonText == "Save"){
      console.log(this.ExistingServiceConfigChange,this.NewGlobal,this.NewRegional,this.NewLocal,this.Overall,this.ExistingAddChange,localStorage.getItem("UID"),this.Year,this.SemiAnnual);
      this.service.TargetCycleTimeInsert(this.ExistingServiceConfigChange,this.NewGlobal,this.NewRegional,this.NewLocal,this.Overall,this.ExistingAddChange,localStorage.getItem("UID"),this.Year,this.SemiAnnual).subscribe(data=>{
        if(data.code == 200){
          alert("Successfully Updated");
          this.GetCycleTimeTargets();
        }else{
          alert("Something went wrong please try again later");
        }
      })
    }else{
      // console.log(this.ExistingServiceConfigChange,this.NewGlobal,this.NewRegional,this.NewLocal,this.Overall,this.ExistingAddChange,localStorage.getItem("UID"),this.Year,this.SemiAnnual);
      this.service.TargetCycleTimeUpdate(this.TargetID,this.ExistingServiceConfigChange,this.NewGlobal,this.NewRegional,this.NewLocal,this.Overall,this.ExistingAddChange,localStorage.getItem("UID"),this.Year,this.SemiAnnual).subscribe(data=>{
        if(data.code == 200){
          alert("Successfully Updated");
          this.GetCycleTimeTargets();
        }else{
          alert("Something went wrong please try again later");
        }
      })
    }
    
  }
  OnClearCTT(){
    this.TargetID = "";
    this.ExistingAddChange = "";
    this.ExistingServiceConfigChange = "";
    this.ButtonText = "Save";
    this.NewGlobal = "";
    this.NewRegional = "";
    this.NewLocal = "";
    this.Overall = "";
  }
  FilteredCount
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.FilteredCount = this.dataSource.filteredData.length;
  }
  RowSelected(j,UID : string,UserName : string,IMPS : boolean,CTO : boolean,LessonsLearnt : boolean,StageGate : boolean,AutomatedCLR : boolean,CLREdits : boolean,MarketReport : boolean,MarketCommentsEdit : boolean,ELTReport : boolean,UserAccessStatus : string,AccountStatus : string,CycleTime : boolean,CapacityTracker :boolean,ResourceUtilization : boolean,C_Hierarchy : boolean,C_HierarchyEdits : boolean,NPS : boolean,NPSEdit : boolean,NPSClientInfo : boolean,NPSAdmin : boolean,DigitalReport : boolean,PerformanceAnalysis : boolean,JobType : string,SteeringCommittee : boolean,SteeringCommitteeEdits : boolean,DDOReports : boolean,DDOHome : boolean,PriorityReport : boolean){
    let p_data : ParsingData = {
      UID : UID,
      UserName : UserName,
      IMPS : IMPS,
      CTO : CTO,
      LessonsLearnt : LessonsLearnt,
      StageGate : StageGate,
      AutomatedCLR : AutomatedCLR,
      MarketReport : MarketReport,
      MarketCommentsEdit : MarketCommentsEdit,
      CLREdits : CLREdits,
      ELTReport : ELTReport,
      UserAccessStatus : UserAccessStatus,
      AccountStatus : AccountStatus,
      CycleTime : CycleTime,
      CapacityTracker : CapacityTracker,
      ResourceUtilization : ResourceUtilization,
      CapacityHierarchy : C_Hierarchy,
      CapacityHierarchyEdits : C_HierarchyEdits,
      NPS : NPS,
      NPSAdmin : NPSAdmin,
      NPSClientInfo : NPSClientInfo,
      NPSEdit : NPSEdit,
      DigitalReport : DigitalReport,
      PerformanceAnalysis : PerformanceAnalysis,
      JobType : JobType,
      SteeringCommittee : SteeringCommittee,
      SteeringCommitteeEdits : SteeringCommitteeEdits,
      DDOHome : DDOHome,
      DDOReports : DDOReports,
      PriorityReport : PriorityReport
    }
    const dialogRef = this.dialog.open(EditUserAccess, {
      // width: '600px',
      data : p_data
    });
    dialogRef.afterClosed().subscribe(result => {
      this.GetData();
    });
  }
  openDialog(UId,Username): void {
    const dialogRef = this.dialog.open(AdminDeleteDialog, {
      data: {
        Name : localStorage.getItem("Username"),
        SelectedUser : Username,
        SelectedUID : UId,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.GetData();
    });
  }
  DeleteUser(SelectedUID : string,Username : string){
    this.openDialog(SelectedUID,Username);
  }
  RowSelected_CTT(TargetID : string,ExistingServiceConfigChange : string,NewGlobal : string,NewRegional : string,NewLocal : string,Overall : string,ExistingAddChange : string,Year : string,Months : string){
    this.TargetID = TargetID;
    this.NewGlobal = NewGlobal;
    this.NewRegional  = NewRegional;
    this.NewLocal = NewLocal;
    this.Overall = Overall;
    this.ExistingServiceConfigChange = ExistingServiceConfigChange;
    this.ExistingAddChange = ExistingAddChange;
    this.Year = Year;
    this.SemiAnnual = Months;
    this.ButtonText = "Update";
  }
  RowSelected_notif(j,UID : string,Username : string,TicketID : number,ReportName : string,TicketStatuts : string){
    var Report_Name;
    if(ReportName == "MarketReport"){
      Report_Name = "Implementation Market Report";
    }else if(ReportName == "IMPS"){
      Report_Name = "Implementation Project Status Report";
    }else if(ReportName == "LL"){
      Report_Name = "Lessons Learnt Report";
    }else if(ReportName == "StageGate"){
      Report_Name = "Stage Gate Report";
    }else if(ReportName == "CTO"){
      Report_Name = "Critical Task Overdue Report";
    }else if(ReportName == "ELTReport"){
      Report_Name = "ELT Report";
    }else if(ReportName == "CycleTime"){
      Report_Name = "Cycle Time Report";
    }else if(ReportName == "AutomatedCLREdits"){
      Report_Name = "Editing Automated CLR";
    }else if(ReportName == "AutomatedCLR"){
      Report_Name = "Automated CLR";
    }else if(ReportName == "MarketCommentEdits"){
      Report_Name = "Editing Implementation Market Comments";
    }else if(ReportName == "CapacityTracker"){
      Report_Name = "Capacity Tracker";
    }else if(ReportName == "ResourceUtilization"){
      Report_Name = "Resource Utilization";
    }else if(ReportName == "CapacityHierarchy"){
      Report_Name = "Capacity Hierarchy";
    }else if(ReportName == "CapacityHierarchyEdits"){
      Report_Name = "Editing Capacity Hierarchy Details";
    }else if(ReportName == "NPS"){
      Report_Name = "NPS";
    }else{
      Report_Name = ReportName
    }
    let p_data : GrantAccessDialogData = {
      UID : UID,
      TicketID : TicketID,
      Username : Username,
      ReportName : ReportName,
      ReportDisplayName : Report_Name,
    }
    const dialogRef = this.dialog.open(GrantAccessDialog, {
      data : p_data
    });
    dialogRef.afterClosed().subscribe(result => {
      this.GetData();
    });
  }
}
@Component({
  selector: 'app-edituseraccess',
  templateUrl: './edituseraccess.component.html',
  styleUrls: ['./edituseraccess.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class EditUserAccess {
  UID: string;
  HeaderText : string;
  CTO : boolean;
  IMPS : boolean;
  LessonsLearnt : boolean;
  StageGate : boolean;
  AutomatedCLR : boolean;
  CLREdits : boolean;
  MarketCommentsEdit : boolean;
  MarketReport : boolean;
  CycleTime : boolean;
  ELTReport : boolean;
  UserAccessStatus : string;
  CapacityTracker: boolean;
  ResourceUtilization: boolean;
  CapacityHierarchy: boolean;
  CapacityHierarchyEdits: boolean;
  NPS : boolean;
  NPSAdmin : boolean;
  NPSClientInfo : boolean;
  NPSEdit : boolean;
  DigitalReport : boolean;
  PerformanceAnalysis : boolean;
  JobType : string;
  AccountStatus : string;
  screenWidth: number;
  screenHeight : number;
  SteeringCommittee : boolean;
  SteeringCommitteeEdits : boolean;
  DDOReports : boolean;
  DDOHome : boolean;
  PriorityReport : boolean;
  constructor(
    public dialogRef: MatDialogRef<EditUserAccess>,
    public service : DashboardServiceService,
    @Inject(MAT_DIALOG_DATA) public data: ParsingData) {
      this.UID = data.UID;
      this.HeaderText = data.UserName;
      this.CTO = data.CTO;
      this.IMPS = data.IMPS;
      this.LessonsLearnt = data.LessonsLearnt;
      this.StageGate = data.StageGate;
      this.AutomatedCLR = data.AutomatedCLR;
      this.CLREdits = data.CLREdits;
      this.MarketCommentsEdit = data.MarketCommentsEdit;
      this.MarketReport = data.MarketReport;
      this.ELTReport = data.ELTReport;
      this.UserAccessStatus = data.UserAccessStatus;
      this.AccountStatus = data.AccountStatus;
      this.CycleTime = data.CycleTime;
      this.NPS = data.NPS;
      this.NPSAdmin = data.NPSAdmin;
      this.NPSClientInfo = data.NPSClientInfo;
      this.NPSEdit = data.NPSEdit;
      this.DigitalReport = data.DigitalReport;
      this.PerformanceAnalysis = data.PerformanceAnalysis;
      this.CapacityTracker = data.CapacityTracker;
      this.ResourceUtilization = data.ResourceUtilization;
      this.CapacityHierarchy = data.CapacityHierarchy;
      this.CapacityHierarchyEdits = data.CapacityHierarchyEdits;
      this.JobType = data.JobType;
      this.SteeringCommittee = data.SteeringCommittee;
      this.SteeringCommitteeEdits = data.SteeringCommitteeEdits;
      this.DDOHome = data.DDOHome;
      this.DDOReports = data.DDOReports;
      this.PriorityReport = data.PriorityReport;
      // set screenWidth on page load
      this.screenWidth = window.innerWidth;
      this.screenHeight = window.innerHeight;
      window.onresize = () => {
        // set screenWidth on screen size change
        this.screenWidth = window.innerWidth;
        this.screenHeight = window.innerHeight;
      };
    }
  ngOnInit() {}
  OnCancelClick(){
    this.dialogRef.close();
  }
  OnSaveClick(){
    if(this.UID == null || this.IMPS == null || this.CTO == null || this.StageGate == null || this.LessonsLearnt == null || this.AutomatedCLR == null || this.CLREdits == null || this.MarketReport == null || this.ELTReport == null || this.UserAccessStatus == null || this.CycleTime == null || this.NPS == null || this.NPSAdmin == null || this.NPSClientInfo == null || this.NPSEdit == null || this.DigitalReport == null || this.PerformanceAnalysis == null || this.JobType == null || this.DDOHome == null || this.DDOReports == null){
      alert("Please fill all fields");
    }else{
      this.service.UpdatingAccessDetails(this.UID,this.IMPS+"",
        this.CTO+"",this.StageGate+"",
        this.LessonsLearnt+"",this.AutomatedCLR+"",
        this.CLREdits+"",this.MarketReport+"",
        this.MarketCommentsEdit+"",this.ELTReport+"",
        this.UserAccessStatus+","+this.AccountStatus+","+this.JobType,
        localStorage.getItem("UID"),this.CycleTime+"",
        this.CapacityTracker+"",this.ResourceUtilization+"",
        this.CapacityHierarchy+"",this.CapacityHierarchyEdits+"",
        this.NPS+"",this.NPSAdmin+"",this.NPSClientInfo+"",
        this.NPSEdit+"",this.SteeringCommittee+"",this.SteeringCommitteeEdits+"",this.DDOReports+"",this.DDOHome+"",this.PriorityReport+"",
        this.DigitalReport+"",this.PerformanceAnalysis+"").subscribe(data =>{
          if(data.code == 200){
            alert("Updated Succesfully");
            this.dialogRef.close();
          }else{
            alert("Something went wrong please try again after sometime");
            this.dialogRef.close();
          }
      })
    }
  }
}
export interface GrantAccessDialogData{
  UID : string,
  TicketID : number,
  Username : string,
  ReportName : string,
  ReportDisplayName : string,
}
@Component({
  selector: 'app-grantaccess',
  templateUrl: './grantaccess.component.html'
  // styleUrls: ['./profiledailog.component.css']
})
export class GrantAccessDialog {
  constructor(
    public service : DashboardServiceService,
    public dialogRef: MatDialogRef<GrantAccessDialog>,
    @Inject(MAT_DIALOG_DATA) public data: GrantAccessDialogData) {
    }
  ngOnInit() {
  }
  onYesClick(){
    this.service.GrantAccess(this.data.UID,this.data.TicketID+"","Approved",this.data.ReportName,localStorage.getItem("UID")).subscribe(data=>{
      if(data.code == 200){
        alert("Access Granted");
        this.dialogRef.close();
      }else{
        alert("Failed to Grant Access,Please try again later");
        this.dialogRef.close();
      }
    })
  }
  onRejectClick(){
    this.service.GrantAccess(this.data.UID,this.data.TicketID+"","Declined",this.data.ReportName,localStorage.getItem("UID")).subscribe(data=>{
      if(data.code == 200){
        alert("Access Declined");
        this.dialogRef.close();
      }else{
        alert("Failed to Reject Access,Please try again later");
        this.dialogRef.close();
      }
    })
  }
  onNoClick(){
    this.dialogRef.close();
  }
}
export interface AdminDeleteDailogData {
  Name : string;
  SelectedUser : string;
  SelectedUID : string;
}
@Component({
  selector: 'app-admindeletedailog',
  templateUrl: './admindeletedailog.component.html'
})
export class AdminDeleteDialog {
  constructor(
    public datepipe : DatePipe,
    public service : DashboardServiceService,
    public dialogRef: MatDialogRef<AdminDeleteDialog>,
    @Inject(MAT_DIALOG_DATA) public data: AdminDeleteDailogData) {
    }
  ngOnInit() {
  }
  onYesClick(){
    this.service.DeleteUser(this.data.SelectedUID,localStorage.getItem("UID")).subscribe(data=>{
      if(data.code == 200){
        alert(data.message);
        this.dialogRef.close();
      }else{
        alert(data.message);
        this.dialogRef.close();
      }
    })
  }
  onNoClick(){
    this.dialogRef.close();
  }
}