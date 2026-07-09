import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ReplaySubject, Subject } from 'rxjs';
import { max, takeUntil } from 'rxjs/operators';
import { DashboardServiceService } from 'src/app/dashboard-service.service';
import { ExcelService } from 'src/app/excel.service';
import { FilterAccountName, FilterCountry, FilterGlobalProjectManager, FilterReasonTypeList, NPSComment } from 'src/app/Models/AutomatedCLRFilters';
import { NPSViewData } from 'src/app/Models/NPSData';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { LivedashboardComponent } from '../livedashboard/livedashboard.component';
import { DeleteNPSClient } from '../npsclient-entries/npsclient-entries.component';

@Component({
  selector: 'app-npsview',
  templateUrl: './npsview.component.html',
  styleUrls: ['./npsview.component.css']
})
export class NPSViewComponent implements OnInit {
  constructor(
    public service : DashboardServiceService,public dashboard : LivedashboardComponent,public dialog: MatDialog,public datepipe : DatePipe,public excelservice : ExcelService) { 
      //set screenWidth on page load
      this.screenWidth = window.innerWidth;
      this.screenHeight = window.innerHeight;
      window.onresize = () => {
        //set screenWidth on screen size change
        this.screenWidth = window.innerWidth;
        this.screenHeight = window.innerHeight;
      };
  }
  screenHeight;screenWidth;
  HeadingName;NPSID;
  ClientName;SurveySent;Email;Region;
  LManager = new FormControl();
  RManager = new FormControl();
  GManager = new FormControl();
  GDManager = new FormControl();
  RDManager = new FormControl();
  LDManager = new FormControl();
  Country = new FormControl();
  Language = new FormControl();
  CompanyName;
  // CompanyName = new FormControl();
  ClientType;ClientContactNumber;
  OpportunityId;
  ClientScope: string = "";DSD;DQS;OnlineTeam;
  SurveyReceived;Nps_comments_positive;Nps_comments_improve;Nps_comments_happier;Status;
  NpsCommentOne = new FormControl();NpsCommentwo = new FormControl();NpsCommentthree = new FormControl();
  AssignLeader_data;NPSScore_data;NPSIndicator_data;Client_Feedback;action;
  ReasonType;
  ResonTypeList : FilterReasonTypeList[];
  AssignLeader = new FormControl();
  NPSScore = new FormControl();
  NPSIndicator = new FormControl();
  displayedColumns : string[] = ['Company','ClientName','Inserted_On','AssignLeaderForClosedLoop','ClientType','DateServey_Sent','Language','RecipientId','NPSScore','NPSIndicator','DateSurvey_Received','Country','Region','RecordStatus','actions'];
  dataSource;
  NPSViewData : NPSViewData[];
  GManagerList : FilterGlobalProjectManager[];
  RManagerList : FilterGlobalProjectManager[];
  LManagerList : FilterGlobalProjectManager[];
  GDManagerList : FilterGlobalProjectManager[];
  RDManagerList : FilterGlobalProjectManager[];
  LDManagerList : FilterGlobalProjectManager[];
  Nps_Comment_One : NPSComment[];
  Nps_COmment_Two : NPSComment[];
  Nps_Comment_Three : NPSComment[];
  CountryList : FilterCountry[];
  CompanyNameList : FilterAccountName[];
  public GPMData: ReplaySubject<FilterGlobalProjectManager[]> = new ReplaySubject<FilterGlobalProjectManager[]>(1);
  public RPMData: ReplaySubject<FilterGlobalProjectManager[]> = new ReplaySubject<FilterGlobalProjectManager[]>(1);
  public AFNData: ReplaySubject<FilterGlobalProjectManager[]> = new ReplaySubject<FilterGlobalProjectManager[]>(1);
  public GDPMData: ReplaySubject<FilterGlobalProjectManager[]> = new ReplaySubject<FilterGlobalProjectManager[]>(1);
  public RDPMData: ReplaySubject<FilterGlobalProjectManager[]> = new ReplaySubject<FilterGlobalProjectManager[]>(1);
  public LDPMData: ReplaySubject<FilterGlobalProjectManager[]> = new ReplaySubject<FilterGlobalProjectManager[]>(1);
  public CountryData: ReplaySubject<FilterCountry[]> = new ReplaySubject<FilterCountry[]>(1);
  public CommentOneNPS: ReplaySubject<NPSComment[]> = new ReplaySubject<NPSComment[]>(1);
  public CommentTwoNPS: ReplaySubject<NPSComment[]> = new ReplaySubject<NPSComment[]>(1);
  public CommentThreeNPS: ReplaySubject<NPSComment[]> = new ReplaySubject<NPSComment[]>(1);
  public CompanyNameData : ReplaySubject<FilterAccountName[]> = new ReplaySubject<FilterAccountName[]>(1);
  Commentoneother;Commenttwoother;Commentthreeother;searchbar;
  ngOnInit(): void {
    this.AssignLeader_data = ["Anette Brydensholt","Anurag Chopra","Cenise Roland","Dalles Weldon","Heber Calcic","Izabela Hiller","Joanna Clare","Niti Morrison","Sandeep Mehlawat","Simon Owen","Tenille Lockyer","Vincent vanReenen"];
    this.NPSScore_data = [0,1,2,3,4,5,6,7,8,9,10];
    this.NPSIndicator_data = ["Promoter","Passive","Detractor"];
    // this.Nps_Comment_One = ["Quick responses/Co-ordination","Good Project Management","Great Ownership/Very Helpful","Good Service / Support/Organized","Great Team/Focused","Reactive CWT team","Short weekly meetings","Imps was quick/Very Approachable","Very Helpful / Clear explanation","Good Service / Good Performance","Professional Team / Approach","Smooth Transition / Organised","Professionalism","Excellent Communication","Efficiency/Responses","Great Project Team/Team work","Very experienced CWT Imps team","Excellent Stakeholder","Dedicated","Client Management Capability","Knowledgeable","Excellent Project Management","Flexible Team","Others"];
    // this.Nps_COmment_Two = ["Part time resource","lacked local briefing","Unclear welcome letter","Less weekly meetings","Post Implementation Issues","Co-ordination with local teams","Detailed Project Plan","Good Feedback management","Miscommunication","Training was confusing","Improve connection and audio","Better Planning","Others"];
    // this.Nps_Comment_Three = ["Must have a full time resource","Better communcation from Sales","Implementation Speed","Change the welcome letter","Online portal or dashboard","Training course needs improvement","Clear understanding within the team","Improve the training method","Connection problems and audio issues","More proactive","Quicker Responses","Others"];
    this.ResonTypeList = [{ReasonType :'Sales Expectations',isSelected : false},{ReasonType :'Project Manager Resource',isSelected : false},{ReasonType :'Online Resource',isSelected : false},{ReasonType :'Online Booking Tool',isSelected : false},{ReasonType :'CWT internal Products (SSO HR Feed Analytics myCWT iMeet etc.)',isSelected : false},{ReasonType :'Project Management process',isSelected : false},{ReasonType :'Non-Implementation CWT Resources',isSelected : false},{ReasonType :'GPN/JV',isSelected : false},{ReasonType :'Testing',isSelected : false}];
    this.ShowForm = false;
    this.dashboard.ShowSpinnerHandler(true);
    this.service.ListofLeadersManagers().subscribe(data =>{
      if(data.code == 200){
        var datas = {GlobalProjectManager : "---",isSelected : true};
        var datas1 = {GlobalProjectManager : "Not Required",isSelected : true};
        var datas2 = {GlobalProjectManager : "To Be Assigned",isSelected : true};
        var datas4 = {Country : "Global",isSelected : true};
        var datas5 = {Country : "Regional",isSelected : true};
        var datas6 = {Account_Name : "---",isSelected : true};
        data.FilterGlobalProjectManager.push(datas);
        data.FilterGlobalProjectManager.push(datas1);
        data.FilterGlobalProjectManager.push(datas2);
        data.FilterGlobalDigitalData.push(datas);
        data.FilterGlobalDigitalData.push(datas1);
        data.FilterGlobalDigitalData.push(datas2);
        data.FilterRegionalDigitalData.push(datas);
        data.FilterRegionalDigitalData.push(datas1);
        data.FilterRegionalDigitalData.push(datas2);
        data.FilterLocalDigitalData.push(datas);
        data.FilterLocalDigitalData.push(datas1);
        data.FilterLocalDigitalData.push(datas2);
        data.FilterCountry.push(datas4);
        data.FilterCountry.push(datas5);
        data.FilterAccountName.push(datas6);
        this.GManagerList = data.FilterGlobalProjectManager;
        this.GPMData.next(this.GManagerList.slice());
        this.RManagerList = data.FilterGlobalProjectManager;
        this.RPMData.next(this.RManagerList.slice());
        this.LManagerList = data.FilterGlobalProjectManager;
        this.AFNData.next(this.LManagerList.slice());
        this.GDManagerList = data.FilterGlobalDigitalData;
        this.GDPMData.next(this.GDManagerList.slice());
        this.RDManagerList = data.FilterRegionalDigitalData;
        this.RDPMData.next(this.RDManagerList.slice());
        this.LDManagerList = data.FilterLocalDigitalData;
        this.LDPMData.next(this.LDManagerList.slice());
        this.Nps_Comment_One = data.NPSCommentOne;
        this.CommentOneNPS.next(this.Nps_Comment_One.slice());
        this.Nps_COmment_Two = data.NPSCommentTwo;
        this.CommentTwoNPS.next(this.Nps_COmment_Two.slice());
        this.Nps_Comment_Three = data.NPSCommentThree;
        this.CommentThreeNPS.next(this.Nps_Comment_Three.slice());
        this.CountryList = data.FilterCountry;
        this.CountryData.next(this.CountryList.slice());
        this.CompanyNameList = data.FilterAccountName;
        this.CompanyNameData.next(this.CompanyNameList.slice());
      }
      this.dashboard.ShowSpinnerHandler(false);
    })
    this.GetNPSData();
    this.SearchValueChanges();
    var NpsCount;
    this.service.UserReportAccess(localStorage.getItem("UID")).subscribe(data=>{
      if(data.code == 200){
        NpsCount = data.RevenueID;
        if(NpsCount > 0){
          this.searchbar = "Action Required";
          this.dataSource.filter = this.searchbar.trim().toLowerCase();
          this.FilteredCount = this.dataSource.filteredData.length;
        }else{
        }
      }
    })
  }
  protected _onDestroy = new Subject<void>();
  SearchValueChanges(){
    this.GPMsearch.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.GPMfilter();
      });
    this.RPMsearch.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.RPMfilter();
      });
    this.AFNsearch.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.AFNfilter();
      });
    this.GDPMsearch.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.GDPMfilter();
      });
    this.RDPMsearch.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.RDPMfilter();
      });
    this.LDPMsearch.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.LDPMfilter();
      });
    this.CountrySearch.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.Countryfilter();
      });
    this.CompanyNameSearch.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.CompanyNamefilter();
      });
    this.commentonesearch.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.CommentOnefilter();
      });
    this.commenttwosearch.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.CommentTwofilter();
      });
    this.commentthreesearch.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.CommentThreefilter();
      });
  }
  ShowCommentOne : boolean = false;
  ShowCommentTwo : boolean = false;
  ShowCommentThree : boolean = false;
  oncommentonechange(){
    if(this.NpsCommentOne.value == "Others"){
      this.ShowCommentOne = true;
      this.Commentoneother = "";
    }else{
      this.ShowCommentOne = false;
      this.Commentoneother = "";
    }
  }
  oncommenttwochange(){
    if(this.NpsCommentwo.value == "Others"){
      this.ShowCommentTwo = true;
      this.Commenttwoother = "";
    }else{
      this.ShowCommentTwo = false;
      this.Commenttwoother = "";
    }
  }
  oncommentthreechange(){
    if(this.NpsCommentthree.value == "Others"){
      this.ShowCommentThree = true;
      this.Commentthreeother = "";
    }else{
      this.ShowCommentTwo = false;
      this.Commentthreeother = "";
    }
  }
  GPMsearch = new FormControl();
  RPMsearch = new FormControl();
  AFNsearch = new FormControl();
  GDPMsearch = new FormControl();
  RDPMsearch = new FormControl();
  LDPMsearch = new FormControl();
  commentonesearch = new FormControl();
  commenttwosearch = new FormControl();
  commentthreesearch = new FormControl();
  CountrySearch = new FormControl();
  CompanyNameSearch = new FormControl();
  protected AFNfilter() {
    if (!this.LManagerList) {
      return;
    }
    // get the search keyword
    let search = this.AFNsearch.value;
    if (!search) {
      this.AFNData.next(this.LManagerList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the manager
    this.AFNData.next(
      this.LManagerList.filter(manager => manager.GlobalProjectManager.toLowerCase().indexOf(search) > -1)
    );
  }
  protected GPMfilter() {
    if (!this.GManagerList) {
      return;
    }
    // get the search keyword
    let search = this.GPMsearch.value;
    if (!search) {
      this.GPMData.next(this.GManagerList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the manager
    this.GPMData.next(
      this.GManagerList.filter(manager => manager.GlobalProjectManager.toLowerCase().indexOf(search) > -1)
    );
  }
  protected RPMfilter() {
    if (!this.RManagerList) {
      return;
    }
    // get the search keyword
    let search = this.RPMsearch.value;
    if (!search) {
      this.RPMData.next(this.RManagerList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the manager
    this.RPMData.next(
      this.RManagerList.filter(manager => manager.GlobalProjectManager.toLowerCase().indexOf(search) > -1)
    );
  }
  
  protected GDPMfilter() {
    if (!this.GDManagerList) {
      return;
    }
    // get the search keyword
    let search = this.GDPMsearch.value;
    if (!search) {
      this.GDPMData.next(this.GDManagerList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the manager
    this.GDPMData.next(
      this.GDManagerList.filter(manager => manager.GlobalProjectManager.toLowerCase().indexOf(search) > -1)
    );
  }
  protected RDPMfilter() {
    if (!this.RDManagerList) {
      return;
    }
    // get the search keyword
    let search = this.RDPMsearch.value;
    if (!search) {
      this.RDPMData.next(this.RDManagerList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the manager
    this.RDPMData.next(
      this.RDManagerList.filter(manager => manager.GlobalProjectManager.toLowerCase().indexOf(search) > -1)
    );
  }
  protected LDPMfilter() {
    if (!this.LDManagerList) {
      return;
    }
    // get the search keyword
    let search = this.LDPMsearch.value;
    if (!search) {
      this.LDPMData.next(this.LDManagerList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the manager
    this.LDPMData.next(
      this.LDManagerList.filter(manager => manager.GlobalProjectManager.toLowerCase().indexOf(search) > -1)
    );
  }
  protected Countryfilter() {
    if (!this.CountryList) {
      return;
    }
    // get the search keyword
    let search = this.CountrySearch.value;
    if (!search) {
      this.CountryData.next(this.CountryList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the manager
    this.CountryData.next(
      this.CountryList.filter(Country => Country.Country.toLowerCase().indexOf(search) > -1)
    );
  }
  protected CompanyNamefilter() {
    if (!this.CompanyNameList) {
      return;
    }
    // get the search keyword
    let search = this.CompanyNameSearch.value;
    if (!search) {
      this.CompanyNameData.next(this.CompanyNameList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the manager
    this.CompanyNameData.next(
      this.CompanyNameList.filter(Account_Name => Account_Name.Account_Name.toLowerCase().indexOf(search) > -1)
    );
  }
  protected CommentOnefilter() {
    if (!this.Nps_Comment_One) {
      return;
    }
    // get the search keyword
    let search = this.commentonesearch.value;
    if (!search) {
      this.CommentOneNPS.next(this.Nps_Comment_One.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the manager
    this.CommentOneNPS.next(
      this.Nps_Comment_One.filter(comment => comment.NPSComment.toLowerCase().indexOf(search) > -1)
    );
  }
  protected CommentTwofilter() {
    if (!this.Nps_COmment_Two) {
      return;
    }
    // get the search keyword
    let search = this.commenttwosearch.value;
    if (!search) {
      this.CommentTwoNPS.next(this.Nps_COmment_Two.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the manager
    this.CommentTwoNPS.next(
      this.Nps_COmment_Two.filter(comment => comment.NPSComment.toLowerCase().indexOf(search) > -1)
    );
  }
  protected CommentThreefilter() {
    if (!this.Nps_Comment_Three) {
      return;
    }
    // get the search keyword
    let search = this.commentthreesearch.value;
    if (!search) {
      this.CommentThreeNPS.next(this.Nps_Comment_Three.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the manager
    this.CommentThreeNPS.next(
      this.Nps_Comment_Three.filter(comment => comment.NPSComment.toLowerCase().indexOf(search) > -1)
    );
  }
  FilteredCount;
  @ViewChild(MatSort) sort: MatSort;
  GetNPSData(){
    this.dashboard.ShowSpinnerHandler(true);
    this.service.NpsViewData().subscribe(data=>{
      if(data.code == 200){
        for(let i = 0;i<data.NPSViewData.length;i++){
          if(data.NPSViewData[i].InsertedOn == null){
            data.NPSViewData[i].Inserted_On = "---";
          }else{
            data.NPSViewData[i].Inserted_On = this.datepipe.transform(data.NPSViewData[i].InsertedOn, "yyyy-MM-dd");
          }
          if(data.NPSViewData[i].DateSurveyReceived == null){
            data.NPSViewData[i].DateSurvey_Received = "---";
          }else{
            data.NPSViewData[i].DateSurvey_Received = this.datepipe.transform(data.NPSViewData[i].DateSurveyReceived, "yyyy-MM-dd");
          }
          if(data.NPSViewData[i].DateServeySent == null){
            data.NPSViewData[i].DateServey_Sent = "---";
          }else{
            data.NPSViewData[i].DateServey_Sent = this.datepipe.transform(data.NPSViewData[i].DateServeySent, "yyyy-MM-dd");
          }
        }
        this.NPSViewData = data.NPSViewData;
        this.dataSource = new MatTableDataSource(data.NPSViewData);
        this.dataSource.sort = this.sort;
        this.FilteredCount = this.dataSource.filteredData.length;
      }
      this.dashboard.ShowSpinnerHandler(false);
    })
  }
  actiondisable : boolean = false;
  onScorechange(){
    if(this.NPSScore.value > 8){
      this.NPSIndicator.setValue("Promoter");
    }else if(this.NPSScore.value < 9 && this.NPSScore.value > 6 ){
      this.NPSIndicator.setValue("Passive");
    }else if(this.NPSScore.value < 7){
      this.NPSIndicator.setValue("Detractor");
    }else{
      this.NPSIndicator.setValue("");
    }
    if(this.NPSScore.value > 6){
      this.actiondisable = false;
    }else{
      this.actiondisable = true;
    }
  }
  ShowForm : boolean = false;
  OnSaveClick(){
    var Errors = 0;
    var ErrorMessage = "";
    if(this.SurveySent == null)
    var Survey_Sent
    if(this.SurveySent == null){
      Errors = Errors+1;
      ErrorMessage += "Survey Sent Should not be blank"+ '\n';
      Survey_Sent = null;
    }else{
      Survey_Sent = this.datepipe.transform(this.SurveySent, "MM-dd-yyyy")+"";
    }
    var Survey_Received
    if(this.SurveyReceived == null){
      Survey_Received = null;
    }else{
      Survey_Received = this.datepipe.transform(this.SurveyReceived, "MM-dd-yyyy")+"";
    }
    if(this.Nps_comments_positive == "null" || this.Nps_comments_positive == null){
      this.Nps_comments_positive = ""
    }
    if(this.Nps_comments_improve == "null" || this.Nps_comments_improve == null){
      this.Nps_comments_improve = ""
    }
    if(this.Nps_comments_happier == "null" || this.Nps_comments_happier == null){
      this.Nps_comments_happier = ""
    }
    if(this.SelectedReasonType == "null" || this.SelectedReasonType == null){
      this.SelectedReasonType = ""
    }
    if(this.Client_Feedback == "null" || this.Client_Feedback == null){
      this.Client_Feedback = ""
    }
    if(this.action == "null" || this.action == null){
      this.action = ""
    }
    if(this.Status == "null" || this.Status == null){
      this.Status = ""
    }
    if(this.Language.value == "null" || this.Language.value == null){
      this.Language.setValue("");
    }
    if(this.AssignLeader.value == "null" || this.AssignLeader.value == null){
      this.AssignLeader.setValue("N/A");
    }
    if(this.NPSIndicator.value == "null" || this.NPSIndicator.value == null){
      this.NPSIndicator.setValue("");
    }
    var nps_commentone = "";
    if(this.NpsCommentOne.value == "Others"){
      nps_commentone = this.Commentoneother;
    }else{
      if(this.NpsCommentOne.value == null || this.NpsCommentOne.value == "null"){
        nps_commentone = "";
      }else{
        nps_commentone = this.NpsCommentOne.value;
      }
    }
    var nps_commenttwo = "";
    if(this.NpsCommentwo.value == "Others"){
      nps_commenttwo = this.Commenttwoother;
    }else{
      if(this.NpsCommentwo.value == null || this.NpsCommentwo.value == "null"){
        nps_commenttwo = "";
      }else{
        nps_commenttwo = this.NpsCommentwo.value;
      }
    }
    var nps_commentthree = "";
    if(this.NpsCommentthree.value == "Others"){
      nps_commentthree = this.Commentthreeother;
    }else{
      if(this.NpsCommentthree.value == null || this.NpsCommentthree.value == "null"){
        nps_commentthree = "";

      }else{
        nps_commentthree = this.NpsCommentthree.value;
      }
    }
    var RecordStatus;
    if(this.SurveySent != null && this.SurveyReceived == null){
      RecordStatus = "Survey Sent";
    }else if(this.SurveySent != null && this.SurveyReceived != null && this.NPSScore.value > 6){
      RecordStatus = "Closed";
    }else if(this.NPSScore.value < 7 && (this.action == null|| this.action == "" || this.action == "null")){
      RecordStatus = "Action Required";
    }else if(this.NPSScore.value < 7 && (this.action != null || this.action != "" || this.action != "null")){
      RecordStatus = "Closed";
    }else if(this.NPSScore.value > 6 && this.SurveySent != null && this.SurveyReceived != null){
      RecordStatus = "Closed";
    }
    if(this.SurveyReceived != null && this.NPSScore.value == null)
    {
      Errors = Errors+1;
      ErrorMessage += "NPS Score should not be empty";
    }
    if(this.OpportunityId != null && (this.OpportunityId < 100000000000000 || this.OpportunityId > 999999999999999) )
    {
      Errors = Errors+1;
      ErrorMessage += "Opportunity Id should be 15 digits";
    }
    if(this.SurveyReceived != null && this.NPSScore.value < 7 && (this.AssignLeader.value == null || this.AssignLeader.value == "" || this.AssignLeader.value == "N/A")){
      Errors = Errors+1;
      ErrorMessage += "Assign Leader should not be empty";
    }
    if(this.ClientName == null || this.ClientName == "")
    {
      Errors = Errors+1;
      ErrorMessage += "Client Name Should Not be empty";
    }
    if(this.Country.value == null || this.Country.value == "")
    {
      Errors = Errors+1;
      ErrorMessage += "Country Should Not be empty";
    }
    if(this.NPSScore.value != null)
    {
      console.log("checked");
      if(Survey_Received == null)
      {
        Errors = Errors+1;
        ErrorMessage += "Please Enter the Survey Received Date";
        console.log("checked2");
      }
    }
    if(Errors == 0){
      this.service.NPSViewUpdate(this.NPSID,this.ClientName,this.CompanyName,this.Email,this.Country.value,this.Region,this.Language.value,this.RManager.value,this.GManager.value,
        this.LManager.value,this.ClientType,this.ClientContactNumber,Survey_Sent,this.ClientScope,Survey_Received,this.Status,this.AssignLeader.value,this.OpportunityId,this.NPSScore.value,this.NPSIndicator.value,this.Nps_comments_positive,this.Nps_comments_improve,this.Nps_comments_happier,
        this.Client_Feedback,this.action,this.SelectedReasonType,localStorage.getItem("UID"),nps_commentone,nps_commenttwo,nps_commentthree,RecordStatus,this.GDManager.value,this.RDManager.value,this.LDManager.value).subscribe(data=>{
          if(data.code == 200){
            alert(data.message);
            this.GetNPSData();
            this.OnCancelClick();
          }else{
            alert("Something Went Wrong Please Try Again later");
          }
      })
    }else{
      alert(ErrorMessage);
    }
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.FilteredCount = this.dataSource.filteredData.length;
  }
  Export(){
    const CustomizedData = this.NPSViewData.map(o => {
      return {
        "Client First and Last Name" : o.ClientName,
        "Company Name" : o.Company,
        "Date Survey Sent" : o.DateServeySent,
        "Email" : o.Email,
        "NPS Indicator" : o.NPSIndicator,
        "NPS Score" : o.NPSScore,
        "Date Survey Received" : o.DateSurveyReceived,
        "Local Project Manager" : o.LocalProjectManager,
        "Status" : o.Status,
        "AssignLeaderForClosedLoop" : o.AssignLeaderForClosedLoop,
        "ReasonType" : o.ReasonType,
        "ClientFeedback" : o.ClientFeedback,
        "Action" : o.Action,
        "Global Project Manager" : o.GlobalProjectManager,
        "Regional Project Manager" : o.RegionalProjectManager,
        "Country" : o.Country,
        "Region" : o.Region,
        "Client Scope" : o.ClientScope,
        "Customer Contact Number" : o.CustomerContactNumber,
        "Client Type" : o.ClientType,
        // "Single Resource" : o.SingleResource,
        "Language" : o.Language,
        "RecipientId" : o.RecipientId,
        "NPS Comments What was Positive" : o.NPSCommentsWhatwasPositive,
        "What had a Positive Experience during your Implementation" : o.NPSCommentsOne,
        "NPS Comments-How could we have improved" : o.NPSComments_Howcouldwehaveimproved,
        "What can we improve to make your experience better" : o.NPSCommentsTwo,
        "NPS Comments What is the one thing we can do to make you happier" : o.NPSComments_Whatistheonethingwecandotomakeyouhappier,
        "What can we do to go above expectations" : o.NPSCommentsThree,
        "Record Status" : o.RecordStatus,
        "Global Digital OBT Lead" : o.GlobalDigitalPM,
        "Regional Digital OBT Lead" : o.RegionalDigitalPM,
        "Local Digital OBT Lead" : o.LocalDigitalPM,
        "Opportunity Id" : o.OpprtunityId,
        "Created On" : o.InsertedOn,
        "Updated On" : o.Updated_On
      };
    });
    this.excelservice.exportAsExcelFile(CustomizedData, 'NPS View');
  }
  ExportData(){
    this.dashboard.ShowSpinnerHandler(true);
    this.service.ConradData().subscribe(data=>{
      if(data.code == 200){
        const CustomizedData = data.Data.map(o => {
          return {
            "ID" : o.ID,
            "Candidate Name" : o.Candidate_Name,
            "Comments" : o.Comments[0],
          };
        });
        this.excelservice.exportAsExcelFile(CustomizedData, 'Candidate Leads 1');
      }
      this.dashboard.ShowSpinnerHandler(false);
    })
  }
  RecordNO;
  ReasonTypeSelected(){
    this.ResonTypeList.every(function(item:any) {
      return item.isSelected == true;
    })
    this.getReasonTypeSelected();
  }
  SelectedReasonType : string = "";
  getReasonTypeSelected(){
    this.SelectedReasonType = null;
    for(let i=0;i<this.ResonTypeList.length;i++){
      if(this.ResonTypeList[i].isSelected == true){
        if(this.SelectedReasonType == null){
          if(this.ResonTypeList[i].ReasonType == null || this.ResonTypeList[i].ReasonType == ""){
            this.SelectedReasonType = ", ";
          }else{
            this.SelectedReasonType = this.ResonTypeList[i].ReasonType;
          }
        }else{
          this.SelectedReasonType += ", "+this.ResonTypeList[i].ReasonType;
        }
      }else{
      }
    }
  }
  RowSelected(npsId : number){
    for(let i= 0;i<this.NPSViewData.length;i++){
      if(npsId == this.NPSViewData[i].NpsId){
        this.RecordNO = i;
      }else{}
    }
    this.HeadingName = "Edit Record - "+this.NPSViewData[this.RecordNO].ClientName;
    this.ShowForm = true;
    this.NPSID = this.NPSViewData[this.RecordNO].NpsId;
    this.ClientName = this.NPSViewData[this.RecordNO].ClientName;
    this.ClientType = this.NPSViewData[this.RecordNO].ClientType;
    this.OpportunityId = this.NPSViewData[this.RecordNO].OpprtunityId;
    // this.SingleResource = this.NPSViewData[this.RecordNO].SingleResource;
    if(this.NPSViewData[this.RecordNO].LocalProjectManager == null || this.NPSViewData[this.RecordNO].LocalProjectManager == "null"){
      this.LManager.setValue("---");
    }else{
      this.LManager.setValue(this.NPSViewData[this.RecordNO].LocalProjectManager);
    }
    if(this.NPSViewData[this.RecordNO].RegionalProjectManager == null || this.NPSViewData[this.RecordNO].RegionalProjectManager == "null"){
      this.RManager.setValue("---");
    }else{
      this.RManager.setValue(this.NPSViewData[this.RecordNO].RegionalProjectManager);
    }
    if(this.NPSViewData[this.RecordNO].GlobalProjectManager == null || this.NPSViewData[this.RecordNO].GlobalProjectManager == "null"){
      this.GManager.setValue("---");
    }else{
      this.GManager.setValue(this.NPSViewData[this.RecordNO].GlobalProjectManager);
    }
    if(this.NPSViewData[this.RecordNO].LocalDigitalPM == null || this.NPSViewData[this.RecordNO].LocalDigitalPM == "null"){
      this.LDManager.setValue("---");
    }else{
      this.LDManager.setValue(this.NPSViewData[this.RecordNO].LocalDigitalPM);
    }
    if(this.NPSViewData[this.RecordNO].RegionalDigitalPM == null || this.NPSViewData[this.RecordNO].RegionalDigitalPM == "null"){
      this.RDManager.setValue("---");
    }else{
      this.RDManager.setValue(this.NPSViewData[this.RecordNO].RegionalDigitalPM);
    }
    if(this.NPSViewData[this.RecordNO].GlobalDigitalPM == null || this.NPSViewData[this.RecordNO].GlobalDigitalPM == "null"){
      this.GDManager.setValue("---");
    }else{
      this.GDManager.setValue(this.NPSViewData[this.RecordNO].GlobalDigitalPM);
    }
    this.Country.setValue(this.NPSViewData[this.RecordNO].Country);
    this.Region = this.NPSViewData[this.RecordNO].Region;
    this.Language.setValue(this.NPSViewData[this.RecordNO].Language);
    this.Email = this.NPSViewData[this.RecordNO].Email;
    this.ClientContactNumber = this.NPSViewData[this.RecordNO].CustomerContactNumber;
    this.CompanyName = this.NPSViewData[this.RecordNO].Company;
    this.SurveySent = this.NPSViewData[this.RecordNO].DateServeySent;
    this.SurveyReceived = this.NPSViewData[this.RecordNO].DateSurveyReceived;
    this.ClientScope = this.NPSViewData[this.RecordNO].ClientScope;
    this.DQS = this.NPSViewData[this.RecordNO].DQS;
    this.DSD = this.NPSViewData[this.RecordNO].DSD;
    this.OnlineTeam = this.NPSViewData[this.RecordNO].OnlineTeam;
    this.Status = this.NPSViewData[this.RecordNO].Status;
    this.AssignLeader.setValue(this.NPSViewData[this.RecordNO].AssignLeaderForClosedLoop);
    this.NPSScore.setValue(this.NPSViewData[this.RecordNO].NPSScore);
    this.NPSIndicator.setValue(this.NPSViewData[this.RecordNO].NPSIndicator);
    if(this.NPSViewData[this.RecordNO].NPSCommentsWhatwasPositive == null || this.NPSViewData[this.RecordNO].NPSCommentsWhatwasPositive == "null"){
      this.Nps_comments_positive = "";
    }else{
      this.Nps_comments_positive = this.NPSViewData[this.RecordNO].NPSCommentsWhatwasPositive;
    }
    if(this.NPSViewData[this.RecordNO].NPSComments_Howcouldwehaveimproved == null || this.NPSViewData[this.RecordNO].NPSComments_Howcouldwehaveimproved == "null"){
      this.Nps_comments_improve = "";
    }else{
      this.Nps_comments_improve = this.NPSViewData[this.RecordNO].NPSComments_Howcouldwehaveimproved;
    }
    if(this.NPSViewData[this.RecordNO].NPSComments_Whatistheonethingwecandotomakeyouhappier == null || this.NPSViewData[this.RecordNO].NPSComments_Whatistheonethingwecandotomakeyouhappier == "null"){
      this.Nps_comments_happier = "";
    }else{
      this.Nps_comments_happier = this.NPSViewData[this.RecordNO].NPSComments_Whatistheonethingwecandotomakeyouhappier;
    }
    if(this.Client_Feedback == null || this.Client_Feedback == "null"){
      this.Client_Feedback = "";
    }else{
      this.Client_Feedback = this.NPSViewData[this.RecordNO].ClientFeedback;
    }
    if(this.action == null || this.action == "null"){
      this.action = "";
    }else{
      this.action = this.NPSViewData[this.RecordNO].Action;
    }
    this.NpsCommentOne.setValue(this.NPSViewData[this.RecordNO].NPSCommentsOne);
    this.NpsCommentwo.setValue(this.NPSViewData[this.RecordNO].NPSCommentsTwo);
    this.NpsCommentthree.setValue(this.NPSViewData[this.RecordNO].NPSCommentsThree);
    var reasontypes = [];
    if(this.NPSViewData[this.RecordNO].ReasonType == "" || this.NPSViewData[this.RecordNO].ReasonType == null || this.NPSViewData[this.RecordNO].ReasonType == "null"){
    }else{
      reasontypes = this.NPSViewData[this.RecordNO].ReasonType.split(', ');
    }
    if(reasontypes.length >0){
      for(let i=0;i<this.ResonTypeList.length;i++){
        for(let j=0;j<reasontypes.length;j++){
          if(reasontypes[j] == this.ResonTypeList[i].ReasonType){
            this.ResonTypeList[i].isSelected = true;
          }else{
          }
        }
      }
    }
    this.getReasonTypeSelected();
    if(this.NPSScore.value > 6){
      this.actiondisable = false;
    }else{
      if(this.NPSViewData[this.RecordNO].AssignLeaderForClosedLoop == localStorage.getItem("Username")){
        this.actiondisable = false;
      }else{
        this.actiondisable = true;
      }
    }
    if(this.NPSScore.value == null){
      this.actiondisable = false;
    }
    // reasontypes = this.NPSViewData[this.RecordNO].ReasonType.split(',');
  }
  openDeleteDialog(HId,Username): void {
    const dialogRef = this.dialog.open(DeleteNPSClient, {
      data: {
        Name : localStorage.getItem("Username"),
        SelectedClient : Username,
        SelectedNPSID : HId,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.GetNPSData();
    });
  }
  Deleterow(NPSID : string,client : string){
    this.openDeleteDialog(NPSID,client);
  }
  SendMail(NPSID : string,ClientName : string,Company : string,Email : string,Language : string,RecipientId : string){
    var maxRecipientIdid;
    if(RecipientId == "---"){
      this.service.NpsMaxRecipientId().subscribe(data => {
        maxRecipientIdid = data.code + 1;
        if(ClientName == null || ClientName == "" || ClientName == "---"){
          alert("Client name should not be empty");
        }else {
          if(Company == null || Company == "" || Company == "---") {
            alert("Company name should not be empty");
          }else {
            if(Email == null || Email == "" || Email == "---"){
              alert("Email should not be empty");
            }else{
              const dialogRef = this.dialog.open(ConfirmationDailog, {
                data: {
                  NPSID : NPSID,
                  ClientName : ClientName,
                  Company : Company,
                  Email : Email,
                  Language : Language,
                  RecipientId : maxRecipientIdid
                }
              });
              dialogRef.afterClosed().subscribe(result => {
                var SelectionType = result.SelectionType;
                var Message = result.Message;
                if(SelectionType == "No"){
                }else if(SelectionType == "Yes" && Message == "Success"){
                  this.GetNPSData();
                }else{
                }
              });
            }
          }
        }
      })
    }else{
      maxRecipientIdid = RecipientId;
      if(ClientName == null || ClientName == "" || ClientName == "---"){
        alert("Client name should not be empty");
      }else {
        if(Company == null || Company == "" || Company == "---") {
          alert("Company name should not be empty");
        }else {
          if(Email == null || Email == "" || Email == "---"){
            alert("Email should not be empty");
          }else{
            const dialogRef = this.dialog.open(ConfirmationDailog, {
              data: {
                NPSID : NPSID,
                ClientName : ClientName,
                Company : Company,
                Email : Email,
                Language : Language,
                RecipientId : maxRecipientIdid
              }
            });
            dialogRef.afterClosed().subscribe(result => {
              var SelectionType = result.SelectionType;
              var Message = result.Message;
              if(SelectionType == "No"){
              }else if(SelectionType == "Yes" && Message == "Success"){
                this.GetNPSData();
              }else{
              }
            });
          }
        }
      }
    }
    
  }
  OnCancelClick(){
    this.ShowForm = false;
    this.ClientName = "";
    this.CompanyName = "---";
    this.SurveySent = null;
    this.Email = "";
    this.Country.setValue("---");
    this.Region = "";
    this.Language.setValue("---");
    this.LManager.setValue("---");
    this.RManager.setValue("---");
    this.GManager.setValue("---");
    this.ClientScope = "";
    this.ClientType = "";
    this.ClientContactNumber = "";
    // this.SingleResource = "";
    this.DQS = "";
    this.DSD = "";
    this.OnlineTeam = "";
    this.SurveyReceived = null;
    this.Status = "";
    this.AssignLeader.setValue("");
    this.NPSScore.setValue("");
    this.NPSIndicator.setValue("");
    this.Nps_comments_positive = "";
    this.Nps_comments_improve = "";
    this.Nps_comments_happier = "";
    this.NpsCommentOne.setValue("");
    this.NpsCommentwo.setValue("");
    this.NpsCommentthree.setValue("");
    this.NPSID = "";
  }
}
export interface NPSMailSendingData {
  NPSID : string;
  ClientName : string;
  Company : string;
  Email : string;
  Language : string;
  RecipientId : string;
}
@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  encapsulation: ViewEncapsulation.None
})
export class ConfirmationDailog {
  constructor(
    public datepipe : DatePipe,
    public service : DashboardServiceService,
    @Inject(MAT_DIALOG_DATA) public data: NPSMailSendingData,
    public dialogRef: MatDialogRef<ConfirmationDailog>) {
      this.screenWidth = window.innerWidth;
      this.screenHeight = window.innerHeight;
      window.onresize = () => {
        // set screenWidth on screen size change
        this.screenWidth = window.innerWidth;
        this.screenHeight = window.innerHeight;
      };
    }
    screenWidth
    screenHeight
    SelectedLanguage = new FormControl();
    ClientName;
    Company;
  onYesClick(): void {
    // console.log(this.data.NPSID,this.ClientName,this.Company,this.data.Email,this.SelectedLanguage.value,localStorage.getItem("UID"));
    this.service.NPSSendMail(this.data.NPSID,this.ClientName,this.Company,this.data.Email,this.SelectedLanguage.value,localStorage.getItem("UID")).subscribe(data => {
      if(data.code == 200){
        alert("Mail Sent Succesfully");
        this.dialogRef.close({SelectionType : 'Yes',Message : "Success"});
      }else{
        alert(data.message);
        this.dialogRef.close({SelectionType : 'Yes',Message : data.message});
      }
    })
  }
  onNoClick(){
    this.dialogRef.close({SelectionType : 'No',Message : ""});
  }
  ngOnInit(){
    this.SelectedLanguage.setValue(this.data.Language);
    this.ClientName = this.data.ClientName;
    this.Company = this.data.Company;
  }
}