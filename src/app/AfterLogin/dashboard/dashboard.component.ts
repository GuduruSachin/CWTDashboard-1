import { Component, OnInit, OnDestroy, HostListener, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subject, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ActivatedRoute, Router, NavigationExtras, RouterEvent, NavigationEnd } from '@angular/router';
import { ViewportScroller,Location } from '@angular/common';
import { DashboardServiceService } from 'src/app/dashboard-service.service';
import { CountdownComponent, CountdownConfig, CountdownEvent } from 'ngx-countdown';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{
  showSpinner : boolean = false;
  screenWidth: number;
  screenHeight : number;
  LoggedINID;
  sub : Subscription;
  ReportSelected : string = "CWT Dashboard";
  imageUrl : string = "assets/images/cwt.png";
  Userimage : string = "assets/images/CWTlogo.png";
  public destroyed = new Subject<any>();
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches)
  );
  constructor(public service : DashboardServiceService,viewportScroller: ViewportScroller,private breakpointObserver: BreakpointObserver,private router : Router,private route : ActivatedRoute,public _location : Location) { 
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
        localStorage.setItem("LastLoggedIn",this.date);
      }else{
      }
    })
  }
  ngOnInit() {
    this.service.UserReportAccess(localStorage.getItem("UID")).subscribe(data=>{
      if(data.code == 200){
        this.NpsCount = data.RevenueID;
        if(this.NpsCount > 0){
          this.npshidden = false;
        }else{
          this.npshidden = true;
        }
      }
    })
    // this.startTimer();
    // this.LoggedINID = this.route.snapshot.paramMap.get("UID");
    // alert("");
    // this.sub = this.route.paramMap.subscribe(data =>{
    //   this.LoggedINID = data.get("UID");
    //   alert(this.LoggedINID);
    // })
  }
  date;
  NpsCount : number;npshidden : boolean = true;
  LastUpdatedText : string;
  @ViewChild('countdown', { static: false }) private countdown: CountdownComponent;
  datechecking;
  config: CountdownConfig = { leftTime: 3600, notify: [1] };
  handleEvent(e: CountdownEvent) {
    // this.notify = e.action.toUpperCase();
    if (e.action === 'notify') {
      this.countdown.stop();
      localStorage.clear();
      this.router.navigate(["/Login"]);
    }
  }
  LogOutorStay(){
    this.date = new Date();
    this.datechecking = new Date(localStorage.getItem("LastLoggedIn"));
    this.datechecking.setMinutes(this.datechecking.getMinutes() + 60);
    if(this.date > this.datechecking){
      this.countdown.stop();
      localStorage.clear();
      this.router.navigate(["/Login"]);
      console.log("test")
    }else{
      this.countdown.restart();
      localStorage.setItem("LastLoggedIn",this.date);
      console.log("test")
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
  ShowSpinnerHandler(value){
    this.showSpinner = value;
  }
  HomeClick(){
    this.ReportSelected = "CWT Dashboard";
    if(decodeURI(this._location.path()) == "/Dashboard/HomePage"){
      this.router.navigateByUrl("/refresh",{skipLocationChange : true}).then(() =>{
        this.router.navigate([decodeURI(this._location.path())])
      })
    }else{
      this.router.navigate(['/Dashboard/HomePage']);
    }
  }
  SelectedReport(value : number){
    switch(value){
      case 1 : this.ReportSelected = "Implementation Project Status";
      break;
      case 2 : this.ReportSelected = "Critical Tasks Overdue";
      break;
      case 3 : this.ReportSelected = "Lessons Learnt";
      break;
      case 4 : this.ReportSelected = "Stage Gate Testing";
      break;
      case 5 : this.ReportSelected = "eSOW Report";
      break;
      case 6 : this.ReportSelected = "Automated CLR";
      break;
      case 7 : this.ReportSelected = "Implementation Market Report";
      break;
      case 8 : this.ReportSelected = "Cycle Time";
      break;
      case 9 : this.ReportSelected = "Tracker";
      break;
      case 10 : this.ReportSelected = "Resource Utilization";
      break;
      case 11 : this.ReportSelected = "Capacity Hierarchy";
      break;
      case 12 : this.ReportSelected = "NPS";
      break;
      case 13 : this.ReportSelected = "Project Team";
      break;
      case 14 : this.ReportSelected = "Digital Team";
      break;
      case 18 : this.ReportSelected = "Country Level Report";
      break;
      default : this.ReportSelected = "Home Page";
    }
  }
}