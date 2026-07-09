import { DatePipe } from '@angular/common';
import { Component, Input, EventEmitter, OnInit, Output, SimpleChanges, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { IDropdownSettings, MultiSelectComponent } from 'ng-multiselect-dropdown';
import { DashboardServiceService } from 'src/app/dashboard-service.service';
import { RegionCountry, SC_Country, SC_Region, SC_StandardKeyDeliverables } from 'src/app/Models/SteeringCommitte';
import { SC_Data } from 'src/app/Models/SteeringCommittee';
import { DeleteWaveOrRiskGapDailog, WRDeleteData } from '../steering-committee/steering-committee.component';
export interface RisksGap{
  SCID : number;
  RGID? : number;
  RisksGaps : string;
  arr_Region? : any[];
  arr_Country? : any[];
  Impact : string;
  Likelihood : string;
  MitigationPlan : string;
  SteeringCommitteeSupportNeed : string;
  SupportNeededDetails : string;
  RiskCategory : string;
  Region? : string;
  Country? : string;
  SC_Country? : any[];
  Due_Date? : any;
  DueDate? : any;
  isDueDateDelayed? : boolean;
  Owner? : string;
  // Owners? : any[];
  Owners? : string;
  Status : string;
  InsertedBy? : string;
}
export interface Waves{
  SCID : number;
  WaveID? : number;
  arr_Region? : any[];
  arr_Country? : any[];
  Region? : string;
  SC_Country? : any[];
  Country? : string;
  Scope : string;
  GoLive? : any;
  GoLiveDate? : any;
  Status : string;
  InsertedBy? : string;
}

@Component({
  selector: 'app-add-update-steering-committee',
  templateUrl: './add-update-steering-committee.component.html',
  styleUrls: ['./add-update-steering-committee.component.css']
})
export class AddUpdateSteeringCommitteeComponent implements OnInit {

  @Input() SteeringCommitteeSelectedData : SC_Data[];
  @Output() SendOutput = new EventEmitter<any>();
  constructor(public service : DashboardServiceService,public datepipe : DatePipe,public dialog: MatDialog,) { }
  
  Record_Status : string;
  ClientName : string;
  Client_Type : string;
  Project_Lead : string;
  Project_Status : string;
  // Project_Trend : string;
  PreviousStatus : string;
  isNewRecord : boolean = false;
  Region : any[] = [];
  SelectedRegions : string;
  Country : any[] = [];
  SelectedCountries : string;
  KeyAccomplishmentsSinceLastUpdateKeyDeliverables : any[] = [];
  KeyUpcomingActivitiesKeyDeliverables : any[] = [];
  SelectedKeyAccomplishmentsSinceLastUpdateKeyDeliverables : string;
  SelectedKeyUpcomingActivitiesKeyDeliverables : string;
  TotalBusinessVolume : Number;
  NewBusinessVolume : Number;
  CurrentState : string = "";
  CompletedKeyDeliverables : string = "";
  ScheduledKeyDeliverables : string = "";
  AdditionalNotes : string = "";
  RisksGap : RisksGap[] = [];
  waves : Waves[] = [];
  DisableAddNewRiskButton : boolean = false;
  DisableAddNewWaveButton : boolean = false;
  OwnersList = [];
  dropdownSettings: IDropdownSettings;
  RegionSettings: IDropdownSettings;
  CountrySettings: IDropdownSettings;
  StandardKeyDeliverableSettings: IDropdownSettings;
  KUAStandardKeyDeliverableSettings: IDropdownSettings;
  RegionCountry : RegionCountry[];
  SC_Region : SC_Region[];
  SC_Country : SC_Country[];
  SC_StandardKeyDeliverables : SC_StandardKeyDeliverables[];
  KUASC_StandardKeyDeliverables : SC_StandardKeyDeliverables[];
  tooltipOptions = {
    'placement': 'bottom',
    'show-delay': 300,
    // width: 1000,
    // width : 600,
    'width' : 400,
    'maxwidth': 400,
    'theme': 'light',
  };
  tooltipOptions2 = {
    placement: 'bottom',
    'show-delay': 300,
    // width: 1000,
    // width : 600,
    width : 400,
    maxwidth: 400,
    theme: 'light',
  };
  tooltipOptions3 = {
    placement: 'bottom',
    'show-delay': 300,
    // width: 1000,
    // width : 600,
    width : 400,
    maxwidth: 400,
    theme: 'light',
  };
  tooltipOptions4 = {
    placement: 'bottom',
    'show-delay': 300,
    // width: 1000,
    // width : 600,
    width : 400,
    maxwidth: 400,
    theme: 'light',
  };
  ngOnInit(): void {
    this.getFilters();
    // if(this.SCID > 0){
    // }else{
    //   this.SCID = 1;
    // }
    // if(this.RisksGap.length > 0){
    // }else{
    //   this.addnewriskgap();
    // }
    // if(this.waves.length > 0){
    // }else{
    //   this.addnewWave();
    // }
    this.RegionSettings = {
      singleSelection: false,
      idField: 'Region',
      textField: 'Region',
      enableCheckAll: true,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: true,
      // enableCheckAll: false,
      limitSelection: -1,
      clearSearchFilter: true,
      maxHeight: 200,
      itemsShowLimit: 2,
      searchPlaceholderText: 'Search Here',
      noDataAvailablePlaceholderText: 'No Regions Found',
      closeDropDownOnSelection: false,
      showSelectedItemsAtTop: false,
      defaultOpen: true,
    }
    this.StandardKeyDeliverableSettings = {
      singleSelection: false,
      idField: 'KeyDeliverable',
      textField: 'KeyDeliverable',
      enableCheckAll: true,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: true,
      // enableCheckAll: false,
      limitSelection: -1,
      clearSearchFilter: true,
      maxHeight: 200,
      itemsShowLimit: 1,
      searchPlaceholderText: 'Search Here',
      noDataAvailablePlaceholderText: 'No Key Deliverables Found',
      closeDropDownOnSelection: false,
      showSelectedItemsAtTop: false,
      defaultOpen: true,
    }
    this.KUAStandardKeyDeliverableSettings = {
      singleSelection: false,
      idField: 'KeyDeliverable',
      textField: 'KeyDeliverable',
      enableCheckAll: true,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: true,
      // enableCheckAll: false,
      limitSelection: -1,
      clearSearchFilter: true,
      maxHeight: 200,
      itemsShowLimit: 1,
      searchPlaceholderText: 'Search Here',
      noDataAvailablePlaceholderText: 'No Key Deliverables Found',
      closeDropDownOnSelection: false,
      showSelectedItemsAtTop: false,
      defaultOpen: true,
    }
    this.CountrySettings = {
      singleSelection: false,
      idField: 'Country',
      textField: 'Country',
      enableCheckAll: true,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: true,
      limitSelection: -1,
      clearSearchFilter: true,
      maxHeight: 200,
      itemsShowLimit: 2,
      searchPlaceholderText: 'Search Here',
      noDataAvailablePlaceholderText: 'No Countries Found',
      closeDropDownOnSelection: false,
      showSelectedItemsAtTop: false,
      defaultOpen: true,
    }
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'Owner',
      textField: 'Owner',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: true,
      // enableCheckAll: false,
      limitSelection: -1,
      clearSearchFilter: true,
      maxHeight: 200,
      itemsShowLimit: 1,
      searchPlaceholderText: 'Search Here',
      noDataAvailablePlaceholderText: 'No Owners Found',
      closeDropDownOnSelection: false,
      showSelectedItemsAtTop: false,
      defaultOpen: false,
    }
  }
  deleteriskgap(index) {
    if(this.RisksGap[index].RGID > 0 && this.RisksGap[index].RGID != null){
      let d_data : WRDeleteData = {
        Type : "RiskGap",
        ID : this.RisksGap[index].RGID+""
      }
      const dialogRef = this.dialog.open(DeleteWaveOrRiskGapDailog, {
        // width: '1000px',
        data : d_data
      });
      dialogRef.afterClosed().subscribe(result => {
        var selectionType = result.SelectionType;
        if(selectionType == "Delete"){
          this.RisksGap.splice(index, 1)
        }else{
        }
      });
    }else{
      this.RisksGap.splice(index, 1)
    }
  }
  deleteWave(index){
    if(this.waves[index].WaveID > 0 && this.waves[index].WaveID != null){
      let d_data : WRDeleteData = {
        Type : "Wave",
        ID : this.waves[index].WaveID+""
      }
      const dialogRef = this.dialog.open(DeleteWaveOrRiskGapDailog, {
        data : d_data
      });
      dialogRef.afterClosed().subscribe(result => {
        var selectionType = result.SelectionType;
        if(selectionType == "Delete"){
          this.waves.splice(index, 1);
        }else{
        }
      });
    }else{
      this.waves.splice(index, 1);
    }
  }
  getFilters(){
    this.service.SteeringCommitteeFilters().subscribe(data =>{
      this.OwnersList = data.Owner;
      this.RegionCountry = data.RegionCountry;
      this.SC_Region = [];
      this.SC_Country = [];
      this.SC_StandardKeyDeliverables = [];
      this.KUASC_StandardKeyDeliverables = [];
      data.RegionCountry.forEach(item =>{
        if (this.SC_Region.find((x) => x.Region === item.Region) === undefined) {
          this.SC_Region.push({Region : item.Region});
        }
        if (this.SC_Country.find((x) => x.Country === item.Country) === undefined) {
          this.SC_Country.push({Country : item.Country});
        }
      })
      this.SC_StandardKeyDeliverables = [
        {KeyDeliverable : "Standard Key Deliverables"},
        {KeyDeliverable : "Complete local client kick off / Project Start"},
        {KeyDeliverable : "Received Legal Entities from Client"},
        {KeyDeliverable : "Validate Legal Entities"},
        {KeyDeliverable : "Validate & Share Local Pricing"},
        {KeyDeliverable : "Provide Signed Master Agreement / GTC"},
        {KeyDeliverable : "Initiate and Complete all Credit Card Requests"},
        {KeyDeliverable : "Obtain and assign project resources"},
        {KeyDeliverable : "Scope - Close Discovery"},
        {KeyDeliverable : "Notify Incumbent of TMC Change to CWT"},
        {KeyDeliverable : "Sign local agreement - if applicable"},
        {KeyDeliverable : "Recruit & Hire Staffing"},
        {KeyDeliverable : "Change Management - Send Initial Traveler Communication"},
        {KeyDeliverable : "Leadership Touch base - if applicable"},
        {KeyDeliverable : "Provide FOP / BTA / Central Credit Card Details"},
        {KeyDeliverable : "Complete Supplier Rate Loading - Hotel"},
        {KeyDeliverable : "Complete Supplier Rate Loading - Car / Limo / Rail"},
        {KeyDeliverable : "Complete Supplier Rate Loading - Air"},
        {KeyDeliverable : "OBT testing completed"},
        {KeyDeliverable : "Offline Testing Completed"},
        {KeyDeliverable : "Go-Live"}
      ]
      this.KUASC_StandardKeyDeliverables = this.SC_StandardKeyDeliverables;
    })
  }
  onCountryChange(){
    this.CountrySettings.defaultOpen = true;
  }
  onCountryChangeAll(item :any){
    this.CountrySettings.defaultOpen = true;
  }
  onRegionChange(){
  // this.onCtrlBlur();
      // const ctrl = <MultiSelectComponent>(<unknown>);
      // ctrl._settings.defaultOpen = true;
    this.RegionSettings.defaultOpen = true;
    this.Changingvaluesincountry();
  }
  onRegionChangeAll(item :any){
    // this.onCtrlBlur();
    this.Region = item;
    this.RegionSettings.defaultOpen = true;
    this.Changingvaluesincountry();
  }
  
  onRiskRegionChange(index : any){
    this.ChangingvaluesinRiskcountry(index);
  }
  onRiskRegionChangeAll(item :any,index : any){
    this.RisksGap[index].arr_Region = item;
    this.ChangingvaluesinRiskcountry(index);
  }
  onWaveRegionChange(index : any){
    this.ChangingWavevaluesincountry(index);
  }
  onWaveRegionChangeAll(item :any,index : any){
    this.waves[index].arr_Region = item;
    this.ChangingWavevaluesincountry(index);
  }
  onKeyDeliverablesChange(){
    var previouskeydeliverables = this.SelectedKeyAccomplishmentsSinceLastUpdateKeyDeliverables + "\n";
    var re = new RegExp(previouskeydeliverables, 'igm');
    var remove_keyDeliverablesInInput = this.CompletedKeyDeliverables.replace(re,'');
    this.StandardKeyDeliverableSettings.defaultOpen = true;
    this.SelectedKeyAccomplishmentsSinceLastUpdateKeyDeliverables = this.KeyAccomplishmentsSinceLastUpdateKeyDeliverables.map((obj) => obj.KeyDeliverable).join('\n');
    this.CompletedKeyDeliverables = this.SelectedKeyAccomplishmentsSinceLastUpdateKeyDeliverables + "\n" + remove_keyDeliverablesInInput;
  }
  onKeyDeliverablesChangeAll(item :any){
    var previouskeydeliverables = this.SelectedKeyAccomplishmentsSinceLastUpdateKeyDeliverables + "\n";
    var re = new RegExp(previouskeydeliverables, 'igm');
    var remove_keyDeliverablesInInput = this.CompletedKeyDeliverables.replace(re,'');
    this.StandardKeyDeliverableSettings.defaultOpen = true;
    this.SelectedKeyAccomplishmentsSinceLastUpdateKeyDeliverables = item.map((obj) => obj.KeyDeliverable).join('\n');
    this.CompletedKeyDeliverables = this.SelectedKeyAccomplishmentsSinceLastUpdateKeyDeliverables + "\n" + remove_keyDeliverablesInInput;
  }
  KUAonKeyDeliverablesChange(){
    var previouskeydeliverables = this.SelectedKeyUpcomingActivitiesKeyDeliverables + "\n";
    var re = new RegExp(previouskeydeliverables, 'igm');
    var remove_keyDeliverablesInInput = this.ScheduledKeyDeliverables.replace(re,'');
    this.KUAStandardKeyDeliverableSettings.defaultOpen = true;
    this.SelectedKeyUpcomingActivitiesKeyDeliverables = this.KeyUpcomingActivitiesKeyDeliverables.map((obj) => obj.KeyDeliverable).join('\n');
    this.ScheduledKeyDeliverables = this.SelectedKeyUpcomingActivitiesKeyDeliverables + "\n" + remove_keyDeliverablesInInput;
  }
  KUAonKeyDeliverablesChangeAll(item :any){
    var previouskeydeliverables = this.SelectedKeyUpcomingActivitiesKeyDeliverables + "\n";
    var re = new RegExp(previouskeydeliverables, 'igm');
    var remove_keyDeliverablesInInput = this.ScheduledKeyDeliverables.replace(re,'');
    this.KUAStandardKeyDeliverableSettings.defaultOpen = true;
    this.SelectedKeyUpcomingActivitiesKeyDeliverables = item.map((obj) => obj.KeyDeliverable).join('\n');
    this.ScheduledKeyDeliverables = this.SelectedKeyUpcomingActivitiesKeyDeliverables + "\n" + remove_keyDeliverablesInInput;
  }
  registerOnTouched(onTouched: Function) {
    // this.onTouched = onTouched();
    console.log(onTouched)
  }
  Changingvaluesincountry(){
    this.SC_Country = [];
    // this.Country = [];
    let Country = [];
    this.RegionCountry.forEach(item =>{
      if (this.Region.find((x) => x.Region === item.Region)) {
        this.SC_Country.push({Country : item.Country});
        if(this.Country.find((x) => x.Country === item.Country)){
          Country.push({Country : item.Country})
        }
      }
    })
    this.Country = Country;
  }
  ChangingvaluesinRiskcountry(index : any){
    this.RisksGap[index].SC_Country = [];
    let Country = [];
    this.RegionCountry.forEach(item => {
      if(this.RisksGap[index].arr_Region.find((x) => x.Region === item.Region)){
        if(this.Country.find((x) => x.Country === item.Country)){
          this.RisksGap[index].SC_Country.push({Country : item.Country});
          if(this.RisksGap[index].arr_Country.find((x) => x.Country === item.Country)){
            Country.push({Country : item.Country})
          }
        }
      }
    })
    this.RisksGap[index].arr_Country = Country;
  }
  // ChangingWavevaluesincountry(index : any){
  //   this.waves[index].SC_Country = [];
  //   // this.waves[index].arr_Country = [];
  //   let Country = [];
  //   this.RegionCountry.forEach(item =>{
  //     if (this.waves[index].arr_Region.find((x) => x.Region === item.Region)) {
  //       this.waves[index].SC_Country.push({Country : item.Country});
  //       if(this.waves[index].arr_Country.find((x) => x.Country === item.Country)){
  //         Country.push({Country : item.Country})
  //       }
  //     }
  //   })
  //   this.waves[index].arr_Country = Country;
  // }
  ChangingWavevaluesincountry(index : any){
    this.waves[index].SC_Country = [];
    // this.waves[index].arr_Country = [];
    let Country = [];
    this.RegionCountry.forEach(item =>{
      if (this.waves[index].arr_Region.find((x) => x.Region === item.Region)) {
        if(this.Country.find((x) => x.Country === item.Country)){
          this.waves[index].SC_Country.push({Country : item.Country});
          if(this.waves[index].arr_Country.find((x) => x.Country === item.Country)){
            Country.push({Country : item.Country})
          }
        }
      }
    })
    this.waves[index].arr_Country = Country;
  }
  addnewriskgap(){
    let riskgap : RisksGap = {
      SCID : this.SCID,
      RGID : null,
      RisksGaps : "",
      MitigationPlan : "",
      arr_Region : [],
      arr_Country : [],
      Impact : '',
      Likelihood : '',
      SteeringCommitteeSupportNeed : "",
      RiskCategory : "",
      SupportNeededDetails : "",
      Due_Date : "",
      // Owners : [],
      Owners : "",
      Status : ""
    }
    this.RisksGap.push(riskgap);
    if(this.RisksGap.length > 9){
      this.DisableAddNewRiskButton = true;
    }else{
      this.DisableAddNewRiskButton = false;
    }
  }
  addnewWave(){
    let wave : Waves = {
      SCID : this.SCID,
      WaveID : null,
      arr_Region : [],
      arr_Country : [],
      Scope : "",
      GoLive : "",
      Status : ""
    }
    this.waves.push(wave);
    if(this.waves.length > 9){
      this.DisableAddNewWaveButton = true;
    }else{
      this.DisableAddNewWaveButton = false;
    }
  }
  Errors = 0;
  ErrorMessage : string;
  ErrorChecks(){
    this.Errors = 0;
    this.ErrorMessage = "";
    if(this.Record_Status == "" || this.Record_Status == null || this.Record_Status == undefined){
      this.ErrorMessage += "Please Select Record Status" + '\n';
      this.Errors = this.Errors+1;
    }
    if(this.ClientName == "" || this.ClientName == null || this.ClientName == undefined){
      this.ErrorMessage += "Client Name should not be empty" + '\n';
      this.Errors = this.Errors+1;
    }
    if(this.Client_Type == "" || this.Client_Type == null || this.Client_Type == undefined){
      this.ErrorMessage += "Please Select Client Type" + '\n';
      this.Errors = this.Errors+1;
    }
    if(this.Project_Lead == "" || this.Project_Lead == null || this.Project_Lead == undefined){
      this.ErrorMessage += "Project Lead should not be empty" + '\n';
      this.Errors = this.Errors+1;
    }
    if(this.Project_Status == "" || this.Project_Status == null || this.Project_Status == undefined){
      this.ErrorMessage += "Select Current Status" + '\n';
      this.Errors = this.Errors+1;
    }
    if(this.PreviousStatus == "" || this.PreviousStatus == null || this.PreviousStatus == undefined){
      this.ErrorMessage += "Select Previous Status" + '\n';
      this.Errors = this.Errors+1;
    }
    if(this.TotalBusinessVolume == null || this.TotalBusinessVolume == undefined){
      this.ErrorMessage += "Total Business Volume should not be empty" + '\n';
      this.Errors = this.Errors+1;
    }
    if(this.NewBusinessVolume == null || this.NewBusinessVolume == undefined){
      this.ErrorMessage += "New Business Volume should not be empty" + '\n';
      this.Errors = this.Errors+1;
    }
    if(this.Region == null || this.Region == undefined || this.Region.length == 0){
      this.ErrorMessage += "Select atleast One Region" + '\n';
      this.Errors = this.Errors+1;
    }
    if(this.Country == null || this.Country == undefined || this.Country.length == 0){
      this.ErrorMessage += "Select atleast One Country" + '\n';
      this.Errors = this.Errors+1;
    }
    // if(this.waves == undefined || this.waves.length == 0){
    //   this.ErrorMessage += "Please add atleast one Wave" + '\n';
    //   this.Errors = this.Errors+1;
    // }
    if(this.waves.length > 0){
      this.waves.map((each : any)=>{
        if(each.Status == "" || each.Status == null || each.Status == undefined){
          this.ErrorMessage += "Status Should not be empty in all Waves" + '\n';
          this.Errors = this.Errors+1;
        }
        if(each.GoLive == "" || each.GoLive == null || each.GoLive == undefined){
          this.ErrorMessage += "Go live Should not be empty in all Waves" + '\n';
          this.Errors = this.Errors+1;
        }
      })
    }
    // if(this.RisksGap == undefined || this.RisksGap.length == 0){
    //   this.ErrorMessage += "Please add atleast one Risk/Gap" + '\n';
    //   this.Errors = this.Errors+1;
    // }
    if(this.RisksGap.length > 0){
      this.RisksGap.map((each : any)=>{
        if(each.RiskCategory == "" || each.RiskCategory == null || each.RiskCategory == undefined){
          this.ErrorMessage += "Risk Category Should not be empty in all Risks" + '\n';
          this.Errors = this.Errors+1;
        }
        if(each.Status == "" || each.Status == null || each.Status == undefined){
          this.ErrorMessage += "Status Should not be empty in all Risks" + '\n';
          this.Errors = this.Errors+1;
        }
        if(each.Due_Date == "" || each.Due_Date == null || each.Due_Date == undefined){
          this.ErrorMessage += "Due Data Should not be empty in all Risks" + '\n';
          this.Errors = this.Errors+1;
        }
        if(each.Impact == "" || each.Impact == null || each.Impact == undefined){
          this.ErrorMessage += "Impact Should not be empty in all Risks" + '\n';
          this.Errors = this.Errors+1;
        }
        if(each.Likelihood == "" || each.Likelihood == null || each.Likelihood == undefined){
          this.ErrorMessage += "Likelihood Should not be empty in all Risks" + '\n';
          this.Errors = this.Errors+1;
        }
        if(each.SteeringCommitteeSupportNeed == "Yes" && (each.SupportNeededDetails == null || each.SupportNeededDetails == undefined || each.SupportNeededDetails == "")){
          this.ErrorMessage += "Please Enter Support Needed Details if Support Nedded is seleted as Yes" + '\n';
          this.Errors = this.Errors+1;
        }
      })
    }
  }
  onSaveClick(){
    this.ErrorChecks();
    if(this.Errors > 0){
      alert(this.ErrorMessage);
    }else{
      this.SelectedRegions = this.Region.map((obj) => obj.Region).join(', ');
      this.SelectedCountries = this.Country.map((obj) => obj.Country).join(', ');
      this.SelectedKeyAccomplishmentsSinceLastUpdateKeyDeliverables = this.KeyAccomplishmentsSinceLastUpdateKeyDeliverables.map((obj) => obj.KeyDeliverable).join(', ');
      this.SelectedKeyUpcomingActivitiesKeyDeliverables = this.KeyUpcomingActivitiesKeyDeliverables.map((obj) => obj.KeyDeliverable).join(', ');
      var KeyAccomplishmentsSinceLastUpdateKeyDeliverables = this.KeyAccomplishmentsSinceLastUpdateKeyDeliverables.map((obj) => obj.KeyDeliverable).join('\n');
      var KeyUpcomingActivitiesKeyDeliverables = this.KeyUpcomingActivitiesKeyDeliverables.map((obj) => obj.KeyDeliverable).join('\n');
      var previouskeydeliverables = KeyAccomplishmentsSinceLastUpdateKeyDeliverables + "\n";
      const re = new RegExp(previouskeydeliverables, 'igm');
      var removed_keyDeliverablesInCompletedKeyDeliverables = this.CompletedKeyDeliverables.replace(re,'');
      var _previouskeydeliverables = KeyUpcomingActivitiesKeyDeliverables + "\n";
      const re_skd = new RegExp(_previouskeydeliverables, 'igm');
      var removed_keyDeliverablesInScheduledKeyDeliverables = this.ScheduledKeyDeliverables.replace(re_skd,'');
      if(this.ButtonName == "Update"){
        this.service.SteeringCommitteeUpdate(this.SCID,this.Record_Status,this.ClientName,this.Client_Type,this.Project_Lead,this.Project_Status,this.PreviousStatus,
          this.TotalBusinessVolume,this.NewBusinessVolume,this.SelectedRegions,this.SelectedCountries,this.CurrentState,
          removed_keyDeliverablesInCompletedKeyDeliverables,removed_keyDeliverablesInScheduledKeyDeliverables,this.AdditionalNotes,this.SelectedKeyAccomplishmentsSinceLastUpdateKeyDeliverables,this.SelectedKeyUpcomingActivitiesKeyDeliverables,previouskeydeliverables+removed_keyDeliverablesInCompletedKeyDeliverables,_previouskeydeliverables+removed_keyDeliverablesInScheduledKeyDeliverables,localStorage.getItem("UID")).subscribe(data => {
            if(data.code == 200){
              if(this.waves.length > 0){
                for(let i = 0;i< this.waves.length;i++){
                  if(this.waves[i].GoLive == null){
                    this.waves[i].GoLiveDate = null
                  }else{
                    this.waves[i].GoLiveDate = this.datepipe.transform(this.waves[i].GoLive, "MM-dd-yyyy")+"";
                  }
                  if(this.waves[i].arr_Region == undefined){
                    this.waves[i].Region = "";
                  }else{
                    if(this.waves[i].arr_Region.length > 0){
                      this.waves[i].Region = this.waves[i].arr_Region.map((obj) => obj.Region).join(', ');
                    }else{
                      this.waves[i].Region = "";
                    }
                  }
                  if(this.waves[i].arr_Country == undefined){
                    this.waves[i].Country = "";
                  }else{
                    if(this.waves[i].arr_Country.length > 0){
                      this.waves[i].Country = this.waves[i].arr_Country.map((obj) => obj.Country).join(', ');
                    }else{
                      this.waves[i].Country = "";
                    }
                  }
                  if(this.waves[i].WaveID == null){
                    this.waves[i].SCID = this.SCID;
                    this.service.WavesInsert(this.SCID,""+(i+1),this.waves[i].Region,this.waves[i].Country,this.waves[i].Scope,this.waves[i].GoLiveDate,this.waves[i].Status,localStorage.getItem("UID")).subscribe(data => {
                    });
                  }else{
                    this.service.WavesUpdate(this.waves[i].WaveID,this.waves[i].SCID,""+(i+1),this.waves[i].Region,this.waves[i].Country,this.waves[i].Scope,this.waves[i].GoLiveDate,this.waves[i].Status,localStorage.getItem("UID")).subscribe(data => {
                    });
                  }
                }
              }
              if(this.RisksGap.length > 0){
                for(let i = 0;i< this.RisksGap.length;i++){
                  if(this.RisksGap[i].Due_Date == null){
                    this.RisksGap[i].DueDate = null
                  }else{
                    this.RisksGap[i].DueDate = this.datepipe.transform(this.RisksGap[i].Due_Date, "MM-dd-yyyy")+"";
                  }
                  if(this.RisksGap[i].arr_Region.length > 0){
                    this.RisksGap[i].Region = this.RisksGap[i].arr_Region.map((obj) => obj.Region).join(', ');
                  }else{
                    this.RisksGap[i].Region = "";
                  }
                  if(this.RisksGap[i].arr_Country.length > 0){
                    this.RisksGap[i].Country = this.RisksGap[i].arr_Country.map((obj) => obj.Country).join(', ');
                  }else{
                    this.RisksGap[i].Country = "";
                  }
                  this.RisksGap[i].Owner = this.RisksGap[i].Owners;
                  if(this.RisksGap[i].RGID == null){
                    this.RisksGap[i].SCID = this.SCID;
                    this.service.RiskGapInsert(this.SCID,this.RisksGap[i].RiskCategory,this.RisksGap[i].Region,this.RisksGap[i].Country,""+(i+1),this.RisksGap[i].RisksGaps,this.RisksGap[i].MitigationPlan,this.RisksGap[i].SteeringCommitteeSupportNeed,this.RisksGap[i].SupportNeededDetails,this.RisksGap[i].Impact+"",this.RisksGap[i].Likelihood+"",this.RisksGap[i].DueDate,this.RisksGap[i].Owner,this.RisksGap[i].Status,localStorage.getItem("UID")).subscribe(data => {
                      // console.log(data)
                    });
                  }else{
                    this.service.RiskGapUpdate(this.RisksGap[i].RGID,this.RisksGap[i].SCID,this.RisksGap[i].RiskCategory,this.RisksGap[i].Region,this.RisksGap[i].Country,""+(i+1),this.RisksGap[i].RisksGaps,this.RisksGap[i].MitigationPlan,this.RisksGap[i].SteeringCommitteeSupportNeed,this.RisksGap[i].SupportNeededDetails,this.RisksGap[i].Impact+"",this.RisksGap[i].Likelihood+"",this.RisksGap[i].DueDate,this.RisksGap[i].Owner,this.RisksGap[i].Status,localStorage.getItem("UID")).subscribe(data => {
                      // console.log(data)
                    });
                  }
                }
              }
              alert("Steering Committee Updated Succesfully");
              this.SendOutput.emit([{SelectionType : "Updated"}]);
            }else{
              console.log("Update Section failure")
            }
        })
      }else{
        this.service.SteeringCommitteeInsert(this.Record_Status,this.ClientName,this.Client_Type,this.Project_Lead,this.Project_Status,this.PreviousStatus,
          this.TotalBusinessVolume,this.NewBusinessVolume,this.SelectedRegions,this.SelectedCountries,this.CurrentState,
          removed_keyDeliverablesInCompletedKeyDeliverables,removed_keyDeliverablesInScheduledKeyDeliverables,this.AdditionalNotes,this.SelectedKeyAccomplishmentsSinceLastUpdateKeyDeliverables,this.SelectedKeyUpcomingActivitiesKeyDeliverables,previouskeydeliverables+removed_keyDeliverablesInCompletedKeyDeliverables,_previouskeydeliverables+removed_keyDeliverablesInScheduledKeyDeliverables,localStorage.getItem("UID")).subscribe(data => {
            if(data.code == 200){
              if(this.waves.length > 0){
                for(let i = 0;i< this.waves.length;i++){
                  if(this.waves[i].GoLive == null){
                    this.waves[i].GoLiveDate = null
                  }else{
                    this.waves[i].GoLiveDate = this.datepipe.transform(this.waves[i].GoLive, "MM-dd-yyyy")+"";
                  }
                  if(this.waves[i].arr_Region.length > 0){
                    this.waves[i].Region = this.waves[i].arr_Region.map((obj) => obj.Region).join(', ');
                  }else{
                    this.waves[i].Region = "";
                  }
                  if(this.waves[i].arr_Country.length > 0){
                    this.waves[i].Country = this.waves[i].arr_Country.map((obj) => obj.Country).join(', ');
                  }else{
                    this.waves[i].Country = "";
                  }
                  this.waves[i].SCID = data.SCId;
                  this.service.WavesInsert(this.waves[i].SCID,""+(i+1),this.waves[i].Region,this.waves[i].Country,this.waves[i].Scope,this.waves[i].GoLiveDate,this.waves[i].Status,localStorage.getItem("UID")).subscribe(data => {
                  });
                }
              }
              if(this.RisksGap.length > 0){
                for(let i = 0;i< this.RisksGap.length;i++){
                  if(this.RisksGap[i].Due_Date == null){
                    this.RisksGap[i].DueDate = null
                  }else{
                    this.RisksGap[i].DueDate = this.datepipe.transform(this.RisksGap[i].Due_Date, "MM-dd-yyyy")+"";
                  }
                  if(this.RisksGap[i].arr_Region.length > 0){
                    this.RisksGap[i].Region = this.RisksGap[i].arr_Region.map((obj) => obj.Region).join(', ');
                  }else{
                    this.RisksGap[i].Region = "";
                  }
                  if(this.RisksGap[i].arr_Country.length > 0){
                    this.RisksGap[i].Country = this.RisksGap[i].arr_Country.map((obj) => obj.Country).join(', ');
                  }else{
                    this.RisksGap[i].Country = "";
                  }
                  this.RisksGap[i].Owner = this.RisksGap[i].Owners;
                  this.RisksGap[i].SCID = data.SCId;
                  this.service.RiskGapInsert(this.RisksGap[i].SCID,this.RisksGap[i].RiskCategory,this.RisksGap[i].Region,this.RisksGap[i].Country,""+(i+1),this.RisksGap[i].RisksGaps,this.RisksGap[i].MitigationPlan,this.RisksGap[i].SteeringCommitteeSupportNeed,this.RisksGap[i].SupportNeededDetails,this.RisksGap[i].Impact+"",this.RisksGap[i].Likelihood+"",this.RisksGap[i].DueDate,this.RisksGap[i].Owner,this.RisksGap[i].Status,localStorage.getItem("UID")).subscribe(data => {
                  });
                }
              }
              alert("Steering Committee Inserted Succesfully");
              this.SendOutput.emit([{SelectionType : "Inserted"}]);
            }
        })
      }
    }
  }
  onCancelClick(){
    this.SendOutput.emit([{SelectionType : "Cancel"}]);
  }
  ButtonName : string = "Save";
  SCID : number;
  
  ngOnChanges(changes : SimpleChanges) {
    const ParsedSC_Data = changes['SteeringCommitteeSelectedData'].currentValue;
    this.SteeringCommitteeSelectedData = ParsedSC_Data;
    this.ButtonName = this.SteeringCommitteeSelectedData[0].Action;
    
    this.SCID = this.SteeringCommitteeSelectedData[0].SCID;
    this.Record_Status = this.SteeringCommitteeSelectedData[0].RecordStatus;
    this.ClientName = this.SteeringCommitteeSelectedData[0].ClientName;
    this.Client_Type = this.SteeringCommitteeSelectedData[0].ClientType;
    this.Project_Lead = this.SteeringCommitteeSelectedData[0].ProjectLead;
    this.Project_Status = this.SteeringCommitteeSelectedData[0].ProjectStatus;
    if(this.ButtonName == "Update"){
      this.PreviousStatus = this.SteeringCommitteeSelectedData[0].PreviousStatus;
    }else{
      this.PreviousStatus = "Green";
      this.isNewRecord = true;
    }
    this.TotalBusinessVolume = this.SteeringCommitteeSelectedData[0].TotalBusineesVolume;
    this.NewBusinessVolume = this.SteeringCommitteeSelectedData[0].NewBusinessVolume;
    this.Region = [];
    this.Country = [];
    this.KeyAccomplishmentsSinceLastUpdateKeyDeliverables = [];
    this.KeyUpcomingActivitiesKeyDeliverables = [];
    if(this.SteeringCommitteeSelectedData[0].Region == "" || this.SteeringCommitteeSelectedData[0].Region == null){
      this.Region = [];
    }else{
      var regions = this.SteeringCommitteeSelectedData[0].Region.split(', ');
      regions.map((each : any) => {
        this.Region.push({Region : each});
      })
    }
    if(this.SteeringCommitteeSelectedData[0].Country == "" || this.SteeringCommitteeSelectedData[0].Country == null){
      this.Country = [];
    }else{
      var Countries = this.SteeringCommitteeSelectedData[0].Country.split(', ');
      Countries.map((each : any) => {
        this.Country.push({Country : each});
      })
    }

    var sel_KeyAccomplishmentsSinceLastUpdateKeyDeliverables = "";
    var sel_KeyUpcomingActivitiesKeyDeliverables = "";
    if(this.SteeringCommitteeSelectedData[0].KeyAccomplishmentsSinceLastUpdateKeyDeliverables == "" || this.SteeringCommitteeSelectedData[0].KeyAccomplishmentsSinceLastUpdateKeyDeliverables == null){
      this.KeyAccomplishmentsSinceLastUpdateKeyDeliverables = [];
    }else{
      var key_deliverables = this.SteeringCommitteeSelectedData[0].KeyAccomplishmentsSinceLastUpdateKeyDeliverables.split(', ');
      key_deliverables.map((each : any) => {
        this.KeyAccomplishmentsSinceLastUpdateKeyDeliverables.push({KeyDeliverable : each});
      })
      this.SelectedKeyAccomplishmentsSinceLastUpdateKeyDeliverables = this.KeyAccomplishmentsSinceLastUpdateKeyDeliverables.map((obj) => obj.KeyDeliverable).join('\n');
      var KeyAccomplishmentsSinceLastUpdateKeyDeliverables = this.SteeringCommitteeSelectedData[0].KeyAccomplishmentsSinceLastUpdateKeyDeliverables;
      const re = new RegExp(', ', 'igm');
      var previouskeydeliverables = KeyAccomplishmentsSinceLastUpdateKeyDeliverables.replace(re,'\n');
      sel_KeyAccomplishmentsSinceLastUpdateKeyDeliverables = previouskeydeliverables;
    }
    if(this.SteeringCommitteeSelectedData[0].KeyUpcomingActivitiesKeyDeliverables == "" || this.SteeringCommitteeSelectedData[0].KeyUpcomingActivitiesKeyDeliverables == null){
      this.KeyUpcomingActivitiesKeyDeliverables = [];
    }else{
      var key_deliverables = this.SteeringCommitteeSelectedData[0].KeyUpcomingActivitiesKeyDeliverables.split(', ');
      key_deliverables.map((each : any) => {
        this.KeyUpcomingActivitiesKeyDeliverables.push({KeyDeliverable : each});
      })
      this.SelectedKeyUpcomingActivitiesKeyDeliverables = this.KeyUpcomingActivitiesKeyDeliverables.map((obj) => obj.KeyDeliverable).join('\n');
      var KeyUpcomingActivitiesKeyDeliverables = this.SteeringCommitteeSelectedData[0].KeyUpcomingActivitiesKeyDeliverables;
      const re = new RegExp(', ', 'igm');
      var previouskeydeliverables = KeyUpcomingActivitiesKeyDeliverables.replace(re,'\n');
      sel_KeyUpcomingActivitiesKeyDeliverables = previouskeydeliverables;
    }
    this.CurrentState = this.SteeringCommitteeSelectedData[0].CurrentState;
    this.CompletedKeyDeliverables = sel_KeyAccomplishmentsSinceLastUpdateKeyDeliverables + '\n' + this.SteeringCommitteeSelectedData[0].CompletedKeyDeliverables;
    this.ScheduledKeyDeliverables = sel_KeyUpcomingActivitiesKeyDeliverables + '\n'+ this.SteeringCommitteeSelectedData[0].ScheduledKeyDeliverables;
    this.AdditionalNotes = this.SteeringCommitteeSelectedData[0].AdditionalNotes;
    this.RisksGap = [];
    this.waves = [];
    this.RisksGap = this.SteeringCommitteeSelectedData[0].RiskGaps;
    this.waves = this.SteeringCommitteeSelectedData[0].Waves;
    if(this.RisksGap == undefined){
      this.RisksGap = [];
    }else{
      this.RisksGap.forEach((i) => {
        i.arr_Region = [];
        if(i.Region == null){
          i.arr_Region = [];
        }else{
          var Regions = i.Region.split(', ');
          Regions.map((each : any) => {
            i.arr_Region.push({Region : each});
          })
        }
        i.arr_Country = [];
        if(i.Country == null){
          i.arr_Country = [];
        }else{
          var Countries = i.Country.split(', ');
          Countries.map((each : any) => {
            i.arr_Country.push({Country : each});
          })
        }
        i.Owners = i.Owner;
        i.Due_Date = this.datepipe.transform(i.DueDate, "yyyy-MM-dd");
        var date = new Date();
        var duedate = new Date(this.datepipe.transform(i.DueDate, "yyyy-MM-dd"));
        if(i.Status == "Open" && date > duedate){
          i.isDueDateDelayed = true;
        }else{
          i.isDueDateDelayed = false;
        }
      });
    }
    if(this.waves == undefined){
      this.waves = [];
    }else{
      this.waves.forEach((i) => {
        i.GoLive = this.datepipe.transform(i.GoLiveDate, "yyyy-MM-dd");
        i.arr_Region = [];
        if(i.Region == null){
          i.arr_Region = [];
        }else{
          var Regions = i.Region.split(', ');
          Regions.map((each : any) => {
            i.arr_Region.push({Region : each});
          })
        }
        i.arr_Country = [];
        if(i.Country == null){
          i.arr_Country = [];
        }else{
          var Countries = i.Country.split(', ');
          Countries.map((each : any) => {
            i.arr_Country.push({Country : each});
          })
        }
      });
    }
  }
  
  OppID;
  OppIDErrorMessage : string = "";
  OnApplyClick(){
    this.service.GetSCDataUsingOppID(this.OppID).subscribe(data => {
      if(data.code == 200){
        if(data.Data.length > 0){
          this.OppIDErrorMessage = "";
          this.ClientName = data.Data[0].op_Account_Name;
          this.Record_Status = "Active";
          this.Project_Lead = data.Data[0].op_ProjectLead;
          this.TotalBusinessVolume = Math.round(data.Data[0].op_TotalVolume);
          this.NewBusinessVolume = Math.round(data.Data[0].op_RevenueVolume);
          if(data.Data[0].op_CycleTimeCategory == "New Global Including Upsell" || data.Data[0].op_CycleTimeCategory == "New Local Including Upsell" || data.Data[0].op_CycleTimeCategory == "New Global/regional/local"){
            this.Client_Type = "New Client Implementation";
          }else if(data.Data[0].op_CycleTimeCategory == "Existing Service Config Change (catch all including Spins/Mergers)" || data.Data[0].op_CycleTimeCategory == "Existing Add/Change OBT"){
            this.Client_Type = "Existing Client Implementation";
          }
          if(data.Data[0].op_ELTProjectStatus == "On Track - Green"){
            this.Project_Status = "Green";
            // this.Project_Trend = "Up";
          }else if(data.Data[0].op_ELTProjectStatus == "Issue - Red"){
            this.Project_Status = "Red";
            // this.Project_Trend = "Stable";
          }else if(data.Data[0].op_ELTProjectStatus == "Risk - Amber"){
            this.Project_Status = "Amber";
            // this.Project_Trend = "Down";
          }
          this.Region = [];
          this.Country = [];
          data.Data[0].op_Regions.forEach(item =>{
            this.Region.push({Region : item.Region});
          })
          data.Data[0].op_Countries.forEach(item =>{
            this.Country.push({Country : item.Country});
          })
        }else{
          this.OppIDErrorMessage = "No data found using "+ this.OppID +" Opportunity ID";
        }
      }else {
        this.ClientName = "";
        this.Project_Lead = "";
        this.Region = [];
        this.Country = [];
        this.OppIDErrorMessage = data.message;
      }
    })
  }
}