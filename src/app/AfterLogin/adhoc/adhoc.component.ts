import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DashboardServiceService } from 'src/app/dashboard-service.service';
import { FilterDigitalTeam, FilterRegionWiseCountry, RegionCountry } from 'src/app/Models/AutomatedCLRFilters';
export class AdhocData {
  Action : string;
  AHID : string;
  RevenueID : string;
  Client : string;
  StartDate : Date;
  GoLiveDate : Date;
  Country : string;
  Region : string;
  Comments : string;
  GlobalDQSLead : string;
  GlobalCISOBTLead : string;
  RegionalCISOBTLead : string;
  LocalDigitalOBTLead : string;
  GlobalCISPortraitLead : string;
  RegionalCISPortraitLead : string;
  GlobalCISHRFeedSpecialist : string;
  GDS : string;
  ComplexityScore : number;
  ActivityType : string;
  Status : string;
}
@Component({
  selector: 'app-adhoc',
  templateUrl: './adhoc.component.html',
  styleUrls: ['./adhoc.component.css']
})

export class AdhocComponent implements OnChanges, OnInit {
  @Input() AdhocData : any;
  @Output() SendOutput = new EventEmitter<any>();
  constructor(private service : DashboardServiceService,public datepipe : DatePipe) { }
  // ButtonName : string = "Save";
  RevenueID : number;
  Client : string;
  DateStart : Date;
  todayDate : Date = new Date();
  DateGolive : Date;
  Country = new FormControl();
  CountrySearch = new FormControl();
  Region = new FormControl();
  ProjectStatus = new FormControl();
  GlobalDQSLead = new FormControl();
  Comments : string;
  PipelineComments : string;
  GlobalCISOBTLead = new FormControl();
  GlobalCISOBTLeadsearch = new FormControl();
  RegionalCISOBTLead = new FormControl();
  RegionalCISOBTLeadsearch = new FormControl();
  LocalDigitalOBTLead = new FormControl();
  LocalDigitalOBTLeadsearch = new FormControl();
  GlobalCISPortraitLead = new FormControl();
  GlobalCISPortraitLeadsearch = new FormControl();
  RegionalCISPortraitLead = new FormControl();
  RegionalCISPortraitLeadsearch = new FormControl();
  GlobalCISHRFeedSpecialist = new FormControl();
  GlobalCISHRFeedSpecialistsearch = new FormControl();
  GDS = new FormControl();
  ActivityType : string = "Ad-hoc";
  ComplexityScore : number;
  Record_Status : string = "Active";
  Priority : string = "---";
  LoginUID : string;
  NgIfStatus : Boolean = true;
  HeaderText : string = "Add new Ad-hoc Project for Digital Team";
  RegionList : any = [];
  CountryList : RegionCountry[];
  DisableCountry : boolean = true;
  ProjectStatusList;
  GLobalDQSLeadList;
  DigitalTeamList: any = [];
  GlobalDigitalOBTLeadList : FilterDigitalTeam[];RegionalDigitalOBTLeadList : FilterDigitalTeam[];LocalDigitalOBTLeadList : FilterDigitalTeam[];GDSList;
  GlobalDigitalPortraitLeadList : FilterDigitalTeam[];RegionalDigitalPortraitLeadList : FilterDigitalTeam[];GlobalDigitalHRFeedSpeciaListData : FilterDigitalTeam[];
  ButtonName : string = "Save";
  RegionWiseCountries : FilterRegionWiseCountry[];
  protected _onDestroy = new Subject<void>();
  
  public CountryData: ReplaySubject<RegionCountry[]> = new ReplaySubject<RegionCountry[]>(1);
  public GlobalOBTDigitalTeamData: ReplaySubject<FilterDigitalTeam[]> = new ReplaySubject<FilterDigitalTeam[]>(1);
  public RegionalOBTDigitalTeamData: ReplaySubject<FilterDigitalTeam[]> = new ReplaySubject<FilterDigitalTeam[]>(1);
  public LocalOBTDigitalTeamData: ReplaySubject<FilterDigitalTeam[]> = new ReplaySubject<FilterDigitalTeam[]>(1);
  public GlobalPortraitDigitalTeamData: ReplaySubject<FilterDigitalTeam[]> = new ReplaySubject<FilterDigitalTeam[]>(1);
  public RegionalPortraitDigitalTeamData: ReplaySubject<FilterDigitalTeam[]> = new ReplaySubject<FilterDigitalTeam[]>(1);
  public GlobalHRFeedDigitalTeamData: ReplaySubject<FilterDigitalTeam[]> = new ReplaySubject<FilterDigitalTeam[]>(1);
  SearchValueChanges(){
    this.GlobalCISOBTLeadsearch.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.GlobalOBTfilter();
      });
    this.RegionalCISOBTLeadsearch.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.RegionalOBTfilter();
      });
    this.LocalDigitalOBTLeadsearch.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.LocalOBTfilter();
      });
    this.GlobalCISPortraitLeadsearch.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.GlobalPortraitfilter();
      });
    this.RegionalCISPortraitLeadsearch.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.RegionalPortraitfilter();
      });
    this.GlobalCISHRFeedSpecialistsearch.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.GlobalHRFeedfilter();
      });
    this.CountrySearch.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.Countryfilter();
      });
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
  protected GlobalOBTfilter() {
    if (!this.GlobalDigitalOBTLeadList) {
      return;
    }
    // get the search keyword
    let search = this.GlobalCISOBTLeadsearch.value;
    if (!search) {
      this.GlobalOBTDigitalTeamData.next(this.GlobalDigitalOBTLeadList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the manager
    this.GlobalOBTDigitalTeamData.next(
      this.GlobalDigitalOBTLeadList.filter(manager => manager.Manager.toLowerCase().indexOf(search) > -1)
    );
  }
  protected RegionalOBTfilter() {
    if (!this.RegionalDigitalOBTLeadList) {
      return;
    }
    // get the search keyword
    let search = this.RegionalCISOBTLeadsearch.value;
    if (!search) {
      this.RegionalOBTDigitalTeamData.next(this.RegionalDigitalOBTLeadList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the manager
    this.RegionalOBTDigitalTeamData.next(
      this.RegionalDigitalOBTLeadList.filter(manager => manager.Manager.toLowerCase().indexOf(search) > -1)
    );
  }
  protected LocalOBTfilter() {
    if (!this.LocalDigitalOBTLeadList) {
      return;
    }
    // get the search keyword
    let search = this.LocalDigitalOBTLeadsearch.value;
    if (!search) {
      this.LocalOBTDigitalTeamData.next(this.LocalDigitalOBTLeadList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the manager
    this.LocalOBTDigitalTeamData.next(
      this.LocalDigitalOBTLeadList.filter(manager => manager.Manager.toLowerCase().indexOf(search) > -1)
    );
  }
  protected GlobalPortraitfilter() {
    if (!this.GlobalDigitalPortraitLeadList) {
      return;
    }
    // get the search keyword
    let search = this.GlobalCISPortraitLeadsearch.value;
    if (!search) {
      this.GlobalPortraitDigitalTeamData.next(this.GlobalDigitalPortraitLeadList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the manager
    this.GlobalPortraitDigitalTeamData.next(
      this.GlobalDigitalPortraitLeadList.filter(manager => manager.Manager.toLowerCase().indexOf(search) > -1)
    );
  }
  protected RegionalPortraitfilter() {
    if (!this.RegionalDigitalPortraitLeadList) {
      return;
    }
    // get the search keyword
    let search = this.RegionalCISPortraitLeadsearch.value;
    if (!search) {
      this.RegionalPortraitDigitalTeamData.next(this.RegionalDigitalPortraitLeadList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the manager
    this.RegionalPortraitDigitalTeamData.next(
      this.RegionalDigitalPortraitLeadList.filter(manager => manager.Manager.toLowerCase().indexOf(search) > -1)
    );
  }
  protected GlobalHRFeedfilter() {
    if (!this.GlobalDigitalHRFeedSpeciaListData) {
      return;
    }
    // get the search keyword
    let search = this.GlobalCISHRFeedSpecialistsearch.value;
    if (!search) {
      this.GlobalHRFeedDigitalTeamData.next(this.GlobalDigitalHRFeedSpeciaListData.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the manager
    this.GlobalHRFeedDigitalTeamData.next(
      this.GlobalDigitalHRFeedSpeciaListData.filter(manager => manager.Manager.toLowerCase().indexOf(search) > -1)
    );
  }
  ngOnInit() {

  }
  ngOnChanges(changes : SimpleChanges) {
    this.LoginUID = localStorage.getItem("UID");
    this.ProjectStatusList = ["N-Active/No Date Confirmed","C-Closed","A-Active/Date Confirmed","P-Pipeline","X-Cancelled","H-Hold"];
    this.GLobalDQSLeadList = ["---","Dhimant Dave","Mandy Brouwer-Dekker","Sandra Ladd","SHANNON CARPENTER","ANGIE SANCHEZ","Angela Hernandez","Eileen O'Gorman","Melissa Norris","Tomasz Karolak","Alberto Castro"];
    this.GDSList = ["---","Amadeus","Sabre","TravelPort","Not Applicable"];
    const ParsedAdhocData = changes['AdhocData'].currentValue;
    this.ButtonName = ParsedAdhocData.Action;
    
    this.service.AutomatedCLRFilters().subscribe(data =>{
      if(data.code == 200){
        var datas = { Manager : "---",isSelected : true};
        data.FilterDigitalTeam.push(datas);
        this.GlobalDigitalOBTLeadList = data.FilterDigitalTeam;
        this.GlobalOBTDigitalTeamData.next(this.GlobalDigitalOBTLeadList.slice());
        this.RegionalDigitalOBTLeadList = data.FilterDigitalTeam;
        this.RegionalOBTDigitalTeamData.next(this.RegionalDigitalOBTLeadList.slice());
        this.LocalDigitalOBTLeadList = data.FilterDigitalTeam;
        this.LocalOBTDigitalTeamData.next(this.LocalDigitalOBTLeadList.slice());
        this.GlobalDigitalPortraitLeadList = data.FilterDigitalTeam;
        this.GlobalPortraitDigitalTeamData.next(this.GlobalDigitalPortraitLeadList.slice());
        this.RegionalDigitalPortraitLeadList = data.FilterDigitalTeam;
        this.RegionalPortraitDigitalTeamData.next(this.RegionalDigitalPortraitLeadList.slice());
        this.GlobalDigitalHRFeedSpeciaListData = data.FilterDigitalTeam;
        this.GlobalHRFeedDigitalTeamData.next(this.GlobalDigitalHRFeedSpeciaListData.slice());
        this.RegionWiseCountries = data.FilterRegionWiseCountries;
        this.RegionWiseCountries.forEach(item => {
          this.RegionList.push(item.Region);
        })
        if(this.ButtonName != "Save"){
          this.Region.setValue(ParsedAdhocData.Region);
          this.onRegionchange();
          this.Country.setValue(ParsedAdhocData.Country);
        }else{
          this.Region.setValue("");
          this.Country.setValue("");
          this.DisableCountry = true;
        }
        this.SearchValueChanges();
      }
    });
    if(this.ButtonName == "Save"){
      this.HeaderText = "Add new Ad-hoc Project for Digital Team";
      this.NgIfStatus = false;
      this.service.AdhocMaxRevenueID().subscribe(data =>{
        this.RevenueID = data.RevenueID+1;
      });
      this.Client = "";
      this.DateStart = null;
      this.DateGolive = null;
      this.Comments = "";
      this.ProjectStatus.setValue("");
      this.GlobalDQSLead.setValue("");
      this.GlobalCISOBTLead.setValue("");
      this.RegionalCISOBTLead.setValue("");
      this.LocalDigitalOBTLead.setValue("");
      this.GlobalCISPortraitLead.setValue("");
      this.RegionalCISPortraitLead.setValue("");
      this.GlobalCISHRFeedSpecialist.setValue("");
      this.GDS.setValue("");
      this.ActivityType = "Ad-hoc";
      this.Priority = "---";
      this.PipelineComments = "---";
      this.ComplexityScore = null;
      this.Record_Status = "Active";
    }else{
      this.RevenueID = ParsedAdhocData.RevenueID;
      this.Client = ParsedAdhocData.Client;
      this.DateStart = ParsedAdhocData.StartDate;
      this.DateGolive = ParsedAdhocData.GoLiveDate;
      this.Comments = ParsedAdhocData.Comments;
      this.ProjectStatus.setValue(ParsedAdhocData.ProjectStatus);
      this.GlobalDQSLead.setValue(ParsedAdhocData.GlobalDQSLead);
      this.GlobalCISOBTLead.setValue(ParsedAdhocData.GlobalCISOBTLead);
      this.RegionalCISOBTLead.setValue(ParsedAdhocData.RegionalCISOBTLead);
      this.LocalDigitalOBTLead.setValue(ParsedAdhocData.LocalDigitalOBTLead);
      this.GlobalCISPortraitLead.setValue(ParsedAdhocData.GlobalCISPortraitLead);
      this.RegionalCISPortraitLead.setValue(ParsedAdhocData.RegionalCISPortraitLead);
      this.GlobalCISHRFeedSpecialist.setValue(ParsedAdhocData.GlobalCISHRFeedSpecialist);
      this.GDS.setValue(ParsedAdhocData.GDS);
      this.ActivityType = ParsedAdhocData.ActivityType;
      this.ComplexityScore = ParsedAdhocData.ComplexityScore;
      this.Record_Status = ParsedAdhocData.Status;
      this.Priority = ParsedAdhocData.Priority;
      this.PipelineComments = ParsedAdhocData.Pipeline_comments;
      this.HeaderText = "Update Ad-hoc Project";
      this.NgIfStatus = true;
    }
  }
  Errors : number = 0;
  ErrorMessage : string;
  OnCancelClick(){
    this.SendOutput.emit([{SelectionType : "Cancel"}]);
  }
  RegionIndex;
  onRegionchange(){
    if(this.Region.value == null || this.Region.value == ""){
      this.Country.setValue("");
      this.DisableCountry = true;
    }else{
      for(let i = 0;i<this.RegionWiseCountries.length;i++){
        if(this.Region.value == this.RegionWiseCountries[i].Region){
          this.CountryList = this.RegionWiseCountries[i].Countries;
          this.CountryData.next(this.CountryList.slice());
        }else{
        }
      }
      this.DisableCountry = false;
    }
  }
  ErrorChecks(){
    this.Errors = 0;
    this.ErrorMessage = "";
    if(this.GDS.value == "" || this.GDS.value == null){
      this.ErrorMessage += "GDS should not be empty" + '\n';
      this.Errors = this.Errors+1;
    }
    if(this.ComplexityScore == null){
      this.ErrorMessage += "Complexity score should not be empty" + '\n';
      this.Errors = this.Errors+1;
    }else if(this.ComplexityScore < 0 || this.ComplexityScore > 200){
      this.ErrorMessage += "Complexity score should be in between 0 - 200" + '\n';
      this.Errors = this.Errors+1;
    }
    if(this.Client == "" || this.Client == null){
      this.ErrorMessage += "Client should not be empty" + '\n';
      this.Errors = this.Errors+1;
    }
    if(this.DateGolive == null){
      this.ErrorMessage += "Go Live Date should not be empty" + '\n';
      this.Errors = this.Errors+1;
    }
    if(this.DateStart == null){
      this.ErrorMessage += "Start Date should not be empty" + '\n';
      this.Errors = this.Errors+1;
    }
    if(this.Region.value == "" || this.Region.value == null){
      this.ErrorMessage += "Region should not be empty" + '\n';
      this.Errors = this.Errors+1;
    }
    if(this.Country.value == "" || this.Country.value == null){
      this.ErrorMessage += "Country should not be empty" + '\n';
      this.Errors = this.Errors+1;
    }
    if(this.ProjectStatus.value == "" || this.ProjectStatus.value == null){
      this.ErrorMessage += "Project Status should not be empty" + '\n';
      this.Errors = this.Errors+1;
    }
    if(this.GlobalDQSLead.value == "" || this.GlobalDQSLead.value == null){
      this.ErrorMessage += "DQS Lead should not be empty" + '\n';
      this.Errors = this.Errors+1;
    }
    if(this.DateGolive < this.DateStart){
      this.ErrorMessage += "Go live Date Should not be Greater than Start Date";
      this.Errors = this.Errors+1;
    }
  }
  OnSaveClick(){
    this.ErrorChecks();
    var todaydate = new Date();
    var date = this.datepipe.transform(todaydate, "MM-dd-yyyy");
    if(this.Errors == 0){
      var GoLiveDate,StartDate;
      if(this.DateGolive == null){
        GoLiveDate = null;
      }else{
        GoLiveDate = this.datepipe.transform(this.DateGolive, "MM-dd-yyyy")+"";
      }
      if(this.DateStart == null){
        StartDate = null;
      }else{
        StartDate = this.datepipe.transform(this.DateStart, "MM-dd-yyyy")+"";
      }
      if(this.GlobalCISOBTLead.value == null){
        this.GlobalCISOBTLead.setValue("");
      }
      if(this.RegionalCISOBTLead.value == null){
        this.RegionalCISOBTLead.setValue("");
      }
      if(this.LocalDigitalOBTLead.value == null){
        this.LocalDigitalOBTLead.setValue("");
      }
      if(this.GlobalCISPortraitLead.value == null){
        this.GlobalCISPortraitLead.setValue("");
      }
      if(this.RegionalCISPortraitLead.value == null){
        this.RegionalCISPortraitLead.setValue("");
      }
      if(this.GlobalCISHRFeedSpecialist.value == null){
        this.GlobalCISHRFeedSpecialist.setValue("");
      }
        if(this.ButtonName == "Save"){
          this.service.AdhocInsert(this.RevenueID+"",this.Client,StartDate,GoLiveDate,this.Country.value,this.Region.value,this.Comments,this.ProjectStatus.value,this.GlobalDQSLead.value,this.GlobalCISOBTLead.value,this.RegionalCISOBTLead.value,this.LocalDigitalOBTLead.value,this.GlobalCISPortraitLead.value,this.RegionalCISPortraitLead.value,this.GlobalCISHRFeedSpecialist.value,this.GDS.value,this.ComplexityScore+"",this.ActivityType,"Active",this.Priority,this.PipelineComments,this.LoginUID).subscribe(data =>{
            if(data.code == 200){
              alert(data.message);
              this.SendOutput.emit([{SelectionType : "Inserted"}]);
            }else{
              alert(data.message);
            }
          })
          this.service.UsersUsageofReports(localStorage.getItem("UID"),"Adhoc","Insert").subscribe(data =>{
          })
        }else if(this.ButtonName == "Update"){
          this.service.AdhocUpdate(this.RevenueID+"",this.Client,StartDate,GoLiveDate,this.Country.value,this.Region.value,this.Comments,this.ProjectStatus.value,this.GlobalDQSLead.value,this.GlobalCISOBTLead.value,this.RegionalCISOBTLead.value,this.LocalDigitalOBTLead.value,this.GlobalCISPortraitLead.value,this.RegionalCISPortraitLead.value,this.GlobalCISHRFeedSpecialist.value,this.GDS.value,this.ComplexityScore+"",this.ActivityType,this.Record_Status,this.Priority,this.PipelineComments,this.LoginUID).subscribe(data =>{
            if(data.code == 200){
              this.SendOutput.emit([{SelectionType : 'Updated',RevenueID : this.RevenueID,GlobalCISOBTLead : this.GlobalCISOBTLead.value,
              RegionalCISOBTLead : this.RegionalCISOBTLead.value,LocalDigitalOBTLead : this.LocalDigitalOBTLead.value,GlobalCISPortraitLead : this.GlobalCISPortraitLead.value,
              RegionalCISPortraitLead : this.RegionalCISPortraitLead.value,GlobalCISHRFeedSpecialist : this.GlobalCISHRFeedSpecialist.value, GlobalDQSLead : this.GlobalDQSLead.value,ActivityType : this.ActivityType,
              GDS : this.GDS.value,ComplexityScore : this.ComplexityScore,Client : this.Client,StartDate : StartDate,GoLiveDate : GoLiveDate,Country : this.Country.value,
              Region : this.Region.value,Comments : this.Comments,ProjectStatus : this.ProjectStatus.value,Record_Status : this.Record_Status,Priority : this.Priority,Pipeline_comments : this.PipelineComments}]);
            }else{
              alert(data.message);
            }
          })
          this.service.UsersUsageofReports(localStorage.getItem("UID"),"Adhoc","Update").subscribe(data =>{
          })
        }
    }else{
      alert(this.ErrorMessage);
    }
  }
}