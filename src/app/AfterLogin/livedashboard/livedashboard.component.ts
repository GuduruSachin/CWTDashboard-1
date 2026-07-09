import { Component, OnInit, OnDestroy,HostListener, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subject, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ActivatedRoute, Router, NavigationExtras, RouterEvent, NavigationEnd } from '@angular/router';
import { ViewportScroller,Location, DatePipe } from '@angular/common';
import { DashboardServiceService } from 'src/app/dashboard-service.service';
import { CountdownConfig, CountdownEvent, CountdownComponent } from 'ngx-countdown';
// import { FormControl } from '@angular/forms';
// import { KB_Data } from 'src/app/Models/SteeringCommitte';
@Component({
  selector: 'app-livedashboard',
  templateUrl: './livedashboard.component.html',
  styleUrls: ['./livedashboard.component.css']
})
export class LivedashboardComponent implements OnInit, OnDestroy {
  showSpinner : boolean = false;
  screenWidth: number;
  screenHeight : number;
  ReportSelected : string = "Home Page";
  imageUrl : string = "assets/images/cwt.png";
  Userimage : string = "assets/images/CWTlogo.png";
  sub : Subscription;
  // Search_Filter = new FormControl();
  LoggedINID;
  public destroyed = new Subject<any>();
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches)
  );
  LoginUID : string;
  LoginUserName ; string;
  LLData : string;
  SGData: string;
  IMPSData: string;
  CTOData: string;
  AutomatedCLR: string;
  ELT: string;
  NPS: string;
  LastUpdatedText : string;
  ShowIMPS : boolean = false;
  ShowSteeringCommittee : boolean = false;
  ShowCTO : boolean = false;
  ShowLL : boolean = false;
  ShowSGT : boolean = false;
  ShowAutomatedCLR : boolean = false;
  ShowMarketReport : boolean = false;
  ShowCycleTime : boolean = false;
  ShowELT : boolean = false;
  ShowTrackerReports : boolean = false;
  ShowCapacityTracker : boolean = false;
  ShowResourceUtilization : boolean = false;
  ShowHierarchy : boolean = false;
  NotificationsCount : number;
  CLREditOption : string;
  hidden : boolean;
  ShowAdminPanel : boolean = false;
  ShowPerformanceAnalysis : boolean = false;
  ShowNPS : boolean = false;
  ShowNpsReports : boolean = false
  ShowNpsAdmin : boolean = false;
  ShowNpsSurvey : boolean = false;
  ShowDigitalReport : boolean = false;
  ShowDDOReports : boolean = false;
  ShowDDOHome : boolean = false;
  ShowPriorityReport : boolean = false;
  constructor(public service : DashboardServiceService,public datepipe : DatePipe,private route : ActivatedRoute,private breakpointObserver: BreakpointObserver,private router : Router,public _location : Location) {
    // set screenWidth on page load
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    window.onresize = () => {
      // set screenWidth on screen size change
      this.screenWidth = window.innerWidth;
      this.screenHeight = window.innerHeight;
    };
    this.router.events
    .pipe(filter((rs): rs is NavigationEnd => rs instanceof NavigationEnd))
    .subscribe(event => {
      if (
        event.id === 1 &&
        event.url === event.urlAfterRedirects 
      ) {
        // localStorage.setItem("LastLoggedIn",this.date);
      }else{
      }
    })
  }
  @ViewChild('countdown', { static: false }) private countdown: CountdownComponent;
  datechecking;
  config: CountdownConfig = { leftTime: 7200, notify: [1] };
  handleEvent(e: CountdownEvent) {
    // this.notify = e.action.toUpperCase();
    if (e.action === 'notify') {
      this.countdown.stop();
      localStorage.clear();
      this.router.navigate(["/Login"]);
    }
  }
  @HostListener('document:mousemove', ['$event']) onMouseMove(event) {
    if(event) {
      this.LogOutorStay();
    }
  }
  @HostListener('document:mouseenter', ['$event'])onMouseEnter(event: any) {     
    if(event) {
      this.LogOutorStay();
    }
  }
  @HostListener('document:click', ['$event'])onClick(event: string) {
    if(event) {
      this.LogOutorStay();
    }
  }
  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    if(event) {
      this.LogOutorStay();
    }
  }
  @HostListener('document:scroll', ['$event']) onScroll(event: Event): void {
    if(event) {
      this.LogOutorStay();
    }
  }
  LogOutorStay(){
    this.date = new Date();
    this.datechecking = new Date(localStorage.getItem("LastLoggedIn"));
    this.datechecking.setMinutes(this.datechecking.getMinutes() + 120);
    if(this.date > this.datechecking){
      this.countdown.stop();
      localStorage.clear();
      this.router.navigate(["/Login"]);
    }else{
      this.countdown.restart();
      localStorage.setItem("LastLoggedIn",this.date);
    }
  }
  date;
  
  ngOnDestroy(){
    this.sub.unsubscribe();
  }
  Logout(){
    this.countdown.stop();
    localStorage.clear();
    this.router.navigate(["Login"]);
  }
  Profile(){
    this.ReportSelected = "Profile";
    this.LastUpdatedText = "";
    this.service.UsersUsageofReports(this.LoginUID,"Profile","PanelClick").subscribe(data =>{
    })
  }
  AdminPanel(){
    this.ReportSelected = "Admin Panel";
    this.LastUpdatedText = "";
    this.service.UsersUsageofReports(this.LoginUID,"AdminPage","PanelClick").subscribe(data =>{
    })
  }
  Stats(){
    this.ReportSelected = "Stats";
    this.LastUpdatedText = "";
  }
  NpsCount : number;npshidden : boolean = true;
  ngOnInit() {
    this.sub = this.route.paramMap.subscribe(data =>{
      this.LoggedINID = data.get("UID");
    })
    this.LoginUID = localStorage.getItem("UID");
    this.LoginUserName = localStorage.getItem("Username");
    this.datechecking = new Date(localStorage.getItem("LastLoggedIn"));
    if(this.LoginUserName == null || this.LoginUserName == "" || this.datechecking == null || this.datechecking == ""){
      localStorage.clear();
      this.router.navigate(["/Login"]);
    }else{
      this.date = new Date();
      this.datechecking.setMinutes(this.datechecking.getMinutes() + 60);
      if(this.date > this.datechecking){
        localStorage.clear();
        this.router.navigate(["/Login"]);
      }else{
        localStorage.setItem("LastLoggedIn",this.date);
        this.showSpinner = true;
        this.service.UserReportAccess(this.LoginUID).subscribe(data=>{
          if(data.code == 200){
            this.showSpinner = false;
            this.hidden = false;
            if(data.Data[0].IMPS == true){
              this.ShowIMPS = true;
            }else{
              this.ShowIMPS = false;
            }
            if(data.Data[0].CTO == true){
              this.ShowCTO = true;
            }else{
              this.ShowCTO = false;
            }
            if(data.Data[0].LessonsLearnt == true){
              this.ShowLL = true;
            }else{
              this.ShowLL = false;
            }
            if(data.Data[0].StageGate == true){
              this.ShowSGT = true;
            }else{
              this.ShowSGT = false;
            }
            if(data.Data[0].AutomatedCLR == true){
              this.ShowAutomatedCLR = true;
            }else{
              this.ShowAutomatedCLR = false;
            }
            if(data.Data[0].MarketReport == true){
              this.ShowMarketReport = true;
            }else{
              this.ShowMarketReport = false;
            }
            if(data.Data[0].ELTReport == true){
              this.ShowELT = true;
            }else{
              this.ShowELT = false;
            }
            if(data.Data[0].CycleTime == true){
              this.ShowCycleTime = true;
            }else{
              this.ShowCycleTime = false;
            }
            if(data.Data[0].CapacityTracker == true){
              this.ShowCapacityTracker = true;
            }else{
              this.ShowCapacityTracker = false;
            }
            if(data.Data[0].ResourceUtilization == true){
              this.ShowResourceUtilization = true;
            }else{
              this.ShowResourceUtilization = false;
            }
            if(data.Data[0].C_Hierarchy == true){
              this.ShowHierarchy = true;
            }else{
              this.ShowHierarchy = false;
            }
            if(data.Data[0].NPS == true){
              this.ShowNPS = true;
            }else{
              this.ShowNPS = false;
            }
            if(data.Data[0].SteeringCommittee == true){
              this.ShowSteeringCommittee = true;
            }else{
              this.ShowSteeringCommittee = false;
            }
            this.NpsCount = data.RevenueID;
            if(this.NpsCount > 0){
              this.npshidden = false;
            }else{
              this.npshidden = true;
            }
            if(data.Data[0].CapacityTracker == true || data.Data[0].ResourceUtilization == true || data.Data[0].C_Hierarchy == true){
              this.ShowTrackerReports = true;
            }else{
              this.ShowTrackerReports = false;
            }
            if(data.Data[0].NPSAdmin == true || data.Data[0].NPSClientInfo == true || data.Data[0].NPS == true){
              this.ShowNpsReports = true;
            }else{
              this.ShowNpsReports = false;
            }
            if(data.Data[0].NPSAdmin == true){
              this.ShowNpsAdmin = true;
            }else{
              this.ShowNpsAdmin = false;
            }
            if(data.Data[0].NPSClientInfo == true){
              this.ShowNpsSurvey = true;
            }else{
              this.ShowNpsSurvey = false;
            }
            if(data.Data[0].PerformanceAnalysis == true){
              this.ShowPerformanceAnalysis = true;
            }else{
              this.ShowPerformanceAnalysis = false;
            }
            if(data.Data[0].DigitalReport == true){
              this.ShowDigitalReport = true;
            }else{
              this.ShowDigitalReport = false;
            }
            this.NotificationsCount = data.Data[0].Notifications;
            if(data.Data[0].AccountStatus == "Admin"){
              this.ShowAdminPanel = true;
            }else{
              this.ShowAdminPanel = false;
            }
            if(this.NotificationsCount == 0){
              if(data.Data[0].AccountStatus == "Admin"){
                this.hidden = true;
              }else{
                this.hidden = false;
              }
            }else{
              this.hidden = false;
            }
            if(data.Data[0].DDO == true){
              this.ShowDDOReports = true;
            }else{
              this.ShowDDOReports = false;
            }
            if(data.Data[0].PriorityReport == true){
              this.ShowPriorityReport = true;
            }else{
              this.ShowPriorityReport = false;
            }
            if(data.Data[0].DDOHome == true){
              this.ShowDDOHome = true;
              this.router.navigate(["/Dashboard/"+localStorage.getItem("UID")+"/DDOHomePage"]);
            }else{
              this.ShowDDOHome = false;
              this.router.navigate(["/Dashboard/"+localStorage.getItem("UID")+"/HomePage"]);
            }
            if(data.Data[0].DDOHome == true){
              this.ShowDDOHome = true;
              this.router.navigate(["/Dashboard/"+localStorage.getItem("UID")+"/DDOHomePage"]);
            }else{
              this.ShowDDOHome = false;
              this.router.navigate(["/Dashboard/"+localStorage.getItem("UID")+"/HomePage"]);
            }
          }
        })
        this.showSpinner = true;
        this.service.LastUpdatedOn().subscribe(data =>{
          if(data.code == 200){
            this.LLData = this.datepipe.transform(data.Data[0].LLData,"MMM-d-y, h:mm a");
            this.SGData = this.datepipe.transform(data.Data[0].SGData,"MMM-d-y, h:mm a");
            this.IMPSData = this.datepipe.transform(data.Data[0].IMPSData,"MMM-d-y, h:mm a");
            this.CTOData = this.datepipe.transform(data.Data[0].CTOData,"MMM-d-y, h:mm a");
            this.AutomatedCLR = this.datepipe.transform(data.Data[0].AutomatedCLR,"MMM-d-y, h:mm a");
            // this.ELT = this.datepipe.transform(data.Data[0].ELT,"MMM-d-y, h:mm a");
            localStorage.setItem("ELTLastUpdatedOn",this.datepipe.transform(data.Data[0].ELT,"dd-MMM-yyyy"));
            this.NPS = this.datepipe.transform(data.Data[0].NPS,"MMM-d-y, h:mm a");
            this.LastUpdatedText = "(Last Updated On : " + this.AutomatedCLR+" IST)";
          }else{
          }
          this.showSpinner = false;
        })
      }
    }
  }
  // Search_resultsData : boolean = false;
  // KnowledgeBaseData : KB_Data[];
  // KB_SearchData : KB_Data[];
  // onFilterValueChange(){
  //   this.Search_Filter.valueChanges.subscribe(value => {
  //     if(this.Search_Filter.value){
  //       this.Search_resultsData = true;
  //     }else{
  //       this.Search_resultsData = false;
  //     }
  //     const result = this.KnowledgeBaseData.filter((obj) => {
  //       return obj.Name.search(this.Search_Filter.value) > -1 ;
  //       // || obj.Comments.search(this.Search_Filter.value) > -1
  //     });
  //     this.KB_SearchData = result;
  //   });
  // }
  // OpenLink(Link : string){
  //   this.Search_Filter.setValue("");
  //   this.Search_resultsData = false;
  //   window.open(Link, "_blank");
  // }
  Archive(){
    window.open('https://cwt.imeetcentral.com/gcsreporting/folder/WzIwLDEzMjk3ODQ4XQ', "_blank");
  }
  Help(){
    window.open('https://cwt.imeetcentral.com/gcsreporting/folder/WzIwLDEzMTk0ODA5XQ', "_blank");
  }
  GloryErrorCorrection(){
    window.open('https://app.powerbi.com/view?r=eyJrIjoiMWY3NDQ5ZmQtZjZjNC00ZWE2LTk5ZWMtYmI2NDMxZDYzOGM1IiwidCI6ImNhZmU0YTY3LTk0NzUtNDc3Ni04OWZkLTRiNDcyODYwMDk2MiIsImMiOjN9', "_blank");
  }
  OpenOnOffBoardingForm(){
    window.open('https://mycwt.sharepoint.com/sites/CI/_layouts/15/listforms.aspx?cid=ZWEyYjc0NmMtMDNhMC00MzlkLWExOGItZmEzNTYzMmYxNGUx&nav=NGJhN2Q5YzAtNjA1NC00NDJjLWE0NzktY2NhOTE3MzY1ZmQw',"_blank");
  }
  ShowSpinnerHandler(value){
    this.showSpinner = value;
  }
  SelectedReport(value : number){
    switch(value){
      case 0 : {
        this.ReportSelected = "Home Page";
        if(this.AutomatedCLR == null || this.AutomatedCLR == ""){
          this.LastUpdatedText = "";
        }else{
          this.LastUpdatedText = "(Last Updated On : " + this.AutomatedCLR+" IST)";
        }
      }
      break;
      case 1 : {
        this.ReportSelected = "Implementation Project Status";
        if(this.IMPSData == null || this.IMPSData == ""){
          this.LastUpdatedText = "";
        }else{
          this.LastUpdatedText = "(Last Updated On : " + this.IMPSData+" IST)";
        }
        this.service.UsersUsageofReports(this.LoginUID,"Implementation Project Status","PanelClick").subscribe(data =>{
        })
      }
      break;
      case 2 : {
        this.ReportSelected = "Critical Tasks Overdue";
        if(this.CTOData == null || this.CTOData == ""){
          this.LastUpdatedText = "";
        }else{
          this.LastUpdatedText = "(Last Updated On : " + this.CTOData+" IST)";
        }
        this.service.UsersUsageofReports(this.LoginUID,"Critical Task Overdue","PanelClick").subscribe(data =>{
        })
      }
      break;
      case 3 : {
        this.ReportSelected = "Lessons Learnt";
        if(this.LLData == null || this.LLData == ""){
          this.LastUpdatedText = "";
        }else{
          this.LastUpdatedText = "(Last Updated On : " + this.LLData+" IST)";
        }
        this.service.UsersUsageofReports(this.LoginUID,"Lessons Learnt","PanelClick").subscribe(data =>{
        })
      }
      break;
      case 4 : {
        this.ReportSelected = "Stage Gate Testing";
        if(this.SGData == null || this.SGData == ""){
          this.LastUpdatedText = "";
        }else{
          this.LastUpdatedText = "(Last Updated On : " + this.SGData+" IST)";
        }
        this.service.UsersUsageofReports(this.LoginUID,"Stage Gate","PanelClick").subscribe(data =>{
        })
      }
      break;
      case 5 : {
        this.ReportSelected = "Country Level Report";
        if(this.AutomatedCLR == null || this.AutomatedCLR == ""){
          this.LastUpdatedText = "";
        }else{
          this.LastUpdatedText = "(Last Updated On : " + this.AutomatedCLR+" IST)";
        }
        this.service.UsersUsageofReports(this.LoginUID,"Automated CLR","PanelClick").subscribe(data =>{
        })
      }
      break;
      case 6 : {
        this.ReportSelected = "Implementation Market Report";
        this.LastUpdatedText = "";
        this.service.UsersUsageofReports(this.LoginUID,"Implementation Market Report","PanelClick").subscribe(data =>{
        })
      }
      break;
      case 7 : {
        this.ReportSelected = "Volume/Traffic Variance Tracker";
        this.LastUpdatedText = "";
        // if(this.ELT == null || this.ELT == ""){
        //   this.LastUpdatedText = "";
        // }else{
        //   this.LastUpdatedText = "(Last Updated On : " + this.ELT+" IST)";
        // }
        this.service.UsersUsageofReports(this.LoginUID,"EltReport","PanelClick").subscribe(data =>{
        })
      }
      break;
      case 8 : {
        this.ReportSelected = "Cycle Time Report";
        this.LastUpdatedText = "";
        this.service.UsersUsageofReports(this.LoginUID,"CycleTime","PanelClick").subscribe(data =>{
        })
      }
      break;
      case 9 : {
        this.ReportSelected = "Capacity Tracker";
        this.LastUpdatedText = "";
        this.service.UsersUsageofReports(this.LoginUID,"CapacityTracker","PanelClick").subscribe(data =>{
        })
      }
      break;
      case 10 : {
        this.ReportSelected = "Resource Utilization";
        this.LastUpdatedText = "";
        this.service.UsersUsageofReports(this.LoginUID,"ResourceUtilization","PanelClick").subscribe(data =>{
        })
      }
      break;
      case 11 : {
        this.ReportSelected = "Tracker Hierarchy";
        this.LastUpdatedText = "";
        this.service.UsersUsageofReports(this.LoginUID,"TrackerHierarchy","PanelClick").subscribe(data =>{
        })
      }
      break;
      case 12 : {
        this.ReportSelected = "NPS Dashboard";
        if(this.NPS == null || this.NPS == ""){
          this.LastUpdatedText = "";
        }else{
          this.LastUpdatedText = "";
        }
        this.service.UsersUsageofReports(this.LoginUID,"NPS","PanelClick").subscribe(data =>{
        })
      }
      break;
      case 13 : {
        this.ReportSelected = "Project Team Analysis";
        if(this.AutomatedCLR == null || this.AutomatedCLR == ""){
          this.LastUpdatedText = "";
        }else{
          this.LastUpdatedText = "(Last Updated On : " + this.AutomatedCLR+" IST)";
        }
        this.service.UsersUsageofReports(this.LoginUID,"ProjectTeamAnalysis","PanelClick").subscribe(data =>{
        })
      }
      break;
      case 14 : {
        // alert("Work in Progress");
        this.ReportSelected = "Digital Team Analysis";
        if(this.AutomatedCLR == null || this.AutomatedCLR == ""){
          this.LastUpdatedText = "";
        }else{
          this.LastUpdatedText = "(Last Updated On : " + this.AutomatedCLR+" IST)";
        }
        this.service.UsersUsageofReports(this.LoginUID,"DigitalTeamAnalysis","PanelClick").subscribe(data =>{
        })
      }
      break;
      case 15 : {
        this.ReportSelected = "Resource Assignment";
        if(this.AutomatedCLR == null || this.AutomatedCLR == ""){
          this.LastUpdatedText = "";
        }else{
          this.LastUpdatedText = "(Last Updated On : " + this.AutomatedCLR+" IST)";
        }
        this.service.UsersUsageofReports(this.LoginUID,"ResourceAssignment","PanelClick").subscribe(data =>{
        })
      }
      break;
      case 16 : {
        this.ReportSelected = "NPS Survey (For PM's)";
        this.LastUpdatedText = "";
      }
      break;
      case 17 : {
        this.ReportSelected = "NPS View (For Admin Only)";
        this.LastUpdatedText = "";
      }
      break;
      case 18 : {
        this.ReportSelected = "Digital Team Dashboard";
        this.LastUpdatedText = "";
      }
      break;
      case 19 : {
        this.ReportSelected = "Rolling NPS";
        this.LastUpdatedText = "";
      }
      break;
      case 20 : {
        this.ReportSelected = "Go Live Report";
        this.LastUpdatedText = "";
        this.service.UsersUsageofReports(this.LoginUID,"GoLiveReport","PanelClick").subscribe(data =>{
        })
      }
      break;
      // case 22 : {
      //   this.ReportSelected = "eSow Report";
      //   this.LastUpdatedText = "";
      //   // this.service.UsersUsageofReports(this.LoginUID,"GoLiveReport","PanelClick").subscribe(data =>{
      //   // })
      // }
      // break;
      case 21 : {
        this.ReportSelected = "Steering Committee Update";
        this.LastUpdatedText = "";
      }
      break;
      // case 22 : {
      //   this.ReportSelected = "Steering Committee View";
      //   this.LastUpdatedText = "";
      // }
      // break;
      case 23 : {
        this.ReportSelected = "Errors Allocated";
        this.LastUpdatedText = "";
      }
      break;
      case 24 : {
        this.ReportSelected = "GPN Contact";
        this.LastUpdatedText = "";
      }
      break;
      case 25 : {
        this.ReportSelected = "DDO Home";
        this.LastUpdatedText = "";
      }
      break;
      case 26 : {
        this.ReportSelected = "Priority";
        this.LastUpdatedText = "";
      }
      break;
      default : {
        this.ReportSelected = "Home Page";
        this.LastUpdatedText = "";
      }
    }
  }
}