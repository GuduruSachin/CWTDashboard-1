import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl,FormGroupDirective,NgForm,Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DashboardServiceService } from 'src/app/dashboard-service.service';
import { ExcelService } from 'src/app/excel.service';
import { FilterAccountName, FilterCountry, FilterGlobalProjectManager, FilterRegionWiseCountry, RegionCountry } from 'src/app/Models/AutomatedCLRFilters';
import { NPSViewData } from 'src/app/Models/NPSData';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { LivedashboardComponent } from '../livedashboard/livedashboard.component';
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-npsclient-entries',
  templateUrl: './npsclient-entries.component.html',
  styleUrls: ['./npsclient-entries.component.css']
})
export class NPSClientEntriesComponent implements OnInit {
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
  displayNPSClientForm : boolean = false;
  matcher = new MyErrorStateMatcher();
  screenHeight;screenWidth;
  displayedColumns : string[] = ['Company','ClientName','Country','Email','Region','InsertedBy','Inserted_On','actions'];
  columnsToDisplay: string[] = this.displayedColumns.slice();
  dataSource;
  NPSID;HeadingName;
  NPSViewData : NPSViewData[];
  ClientName = new FormControl('', [
    Validators.required,
  ]);
  ClientType = new FormControl('', [
    Validators.required,
  ]);
  Language = new FormControl('', [
    Validators.required,
  ]);
  // SingleResource
  LManager = new FormControl();
  RManager = new FormControl();
  GManager = new FormControl();
  GDManager = new FormControl();
  RDManager = new FormControl();
  LDManager = new FormControl();
  Country  = new FormControl('', [
    Validators.required,
  ]);
  CompanyName = new FormControl('', [
    Validators.required,
  ]);
  // CompanyName = new FormControl();
  Email = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  ClientContactNumber : string = "";
  DateGolive : Date;
  todayDate : Date = new Date();
  ngOnInit(): void {
    this.ButtonName = "Save";
    this.dashboard.ShowSpinnerHandler(true);
    this.service.UserReportAccess(localStorage.getItem("UID")).subscribe(data=>{
      if(data.code == 200){
        if(data.Data[0].NPSEdit == true){
        }else{
          this.columnsToDisplay.pop();
        }
      }
      this.dashboard.ShowSpinnerHandler(false);
    })
    this.GetNPSData();
    this.SearchValueChanges();
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
  }
  GPMsearch = new FormControl();
  RPMsearch = new FormControl();
  AFNsearch = new FormControl();
  GDPMsearch = new FormControl();
  RDPMsearch = new FormControl();
  LDPMsearch = new FormControl();
  CountrySearch = new FormControl();
  CompanyNameSearch = new FormControl();
  Region = new FormControl('', [
    Validators.required,
  ]);
  RegionWiseCountries : FilterRegionWiseCountry[];
  GManagerList : FilterGlobalProjectManager[];
  RManagerList : FilterGlobalProjectManager[];
  LManagerList : FilterGlobalProjectManager[];
  GDManagerList : FilterGlobalProjectManager[];
  RDManagerList : FilterGlobalProjectManager[];
  LDManagerList : FilterGlobalProjectManager[];
  CountryList : FilterCountry[];
  CompanyNameList : FilterAccountName[];
  public GPMData: ReplaySubject<FilterGlobalProjectManager[]> = new ReplaySubject<FilterGlobalProjectManager[]>(1);
  public RPMData: ReplaySubject<FilterGlobalProjectManager[]> = new ReplaySubject<FilterGlobalProjectManager[]>(1);
  public AFNData: ReplaySubject<FilterGlobalProjectManager[]> = new ReplaySubject<FilterGlobalProjectManager[]>(1);
  public GDPMData: ReplaySubject<FilterGlobalProjectManager[]> = new ReplaySubject<FilterGlobalProjectManager[]>(1);
  public RDPMData: ReplaySubject<FilterGlobalProjectManager[]> = new ReplaySubject<FilterGlobalProjectManager[]>(1);
  public LDPMData: ReplaySubject<FilterGlobalProjectManager[]> = new ReplaySubject<FilterGlobalProjectManager[]>(1);
  public CountryData: ReplaySubject<FilterCountry[]> = new ReplaySubject<FilterCountry[]>(1);
  public CompanyNameData : ReplaySubject<FilterAccountName[]> = new ReplaySubject<FilterAccountName[]>(1);
  
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
        }
        this.NPSViewData = data.NPSViewData;
        this.dataSource = new MatTableDataSource(data.NPSViewData);
        this.FilteredCount = this.dataSource.filteredData.length;
        this.dataSource.sort = this.sort;
      }
      this.dashboard.ShowSpinnerHandler(false);
    })
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
        this.CountryList = data.FilterCountry;
        this.CountryData.next(this.CountryList.slice());
        this.CompanyNameList = data.FilterAccountName;
        this.CompanyNameData.next(this.CompanyNameList.slice());
      }
      this.dashboard.ShowSpinnerHandler(false);
    })
  }
  
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
  OnSaveClick(){
    var DateGo_Live
    if(this.DateGolive == null){
      DateGo_Live = null;
    }else{
      DateGo_Live = this.datepipe.transform(this.DateGolive, "MM-dd-yyyy")+"";
    }
    if(this.ClientName.value == "null" || this.ClientName.value == null){
      this.ClientName.setValue("");
    }
    if(this.CompanyName.value == "null" || this.CompanyName.value == null){
      this.CompanyName.setValue("---");
    }
    if(this.Email.value == "null" || this.Email.value  == null){
      this.Email.setValue("");
    }
    if(this.Country.value == "null" || this.Country.value == null || this.Country.value == "---"){
      this.Country.setValue("");
    }
    if(this.GManager.value == "null" || this.GManager.value  == null){
      this.GManager.setValue("To Be Assigned");
    }
    if(this.RManager.value  == "null" || this.RManager.value  == null){
      this.RManager.setValue("To Be Assigned");
    }
    if(this.LManager.value  == "null" || this.LManager.value  == null){
      this.LManager.setValue("To Be Assigned");
    }
    if(this.ClientName.value == "" ||  this.CompanyName.value == "" || this.Email.value == "" || this.Region.value == "" || this.Language.value == "" || this.Country.value == "" || this.DateGolive == null || this.ClientType.value == ""){
      alert("Please Fill all fields");
      this.ClientName.markAsTouched();
      this.CompanyName.markAsTouched();
      this.Email.markAsTouched();
      this.Region.markAsTouched();
      this.Country.markAsTouched();
      this.Language.markAsTouched();
      this.ClientType.markAsTouched();
    }else{
      if(this.ButtonName == "Save"){
        // console.log(this.ClientName.value,this.CompanyName.value,this.Email.value,this.Country.value,this.Region.value,this.RManager.value,this.GManager.value,
        //     this.LManager.value,DateGo_Live,this.ClientType.value,this.ClientContactNumber,this.Language.value,"New Record",localStorage.getItem("UID"))
        this.service.NpsInsert(this.ClientName.value,this.CompanyName.value,this.Email.value,this.Country.value,this.Region.value,this.RManager.value,this.GManager.value,
          this.LManager.value,DateGo_Live,this.ClientType.value,this.ClientContactNumber,this.Language.value,"New Record",this.GDManager.value,this.RDManager.value,this.LDManager.value,localStorage.getItem("UID")).subscribe(data=>{
            if(data.code == 200){
              alert(data.message);
              this.GetNPSData();
              this.OnCancelClick();
            }else{
              alert("Something Went Wrong Please Try Again later");
            }
        })
      }else{
        this.service.NPSUpdate(this.NPSID,this.ClientName.value,this.CompanyName.value,this.Email.value,this.Country.value,this.Region.value,this.RManager.value,this.GManager.value,
          this.LManager.value,DateGo_Live,this.ClientType.value,this.ClientContactNumber,this.Language.value,this.GDManager.value,this.RDManager.value,this.LDManager.value,localStorage.getItem("UID")).subscribe(data=>{
            if(data.code == 200){
              alert(data.message);
              this.GetNPSData();
              this.OnCancelClick();
            }else{
              alert("Something Went Wrong Please Try Again later");
            }
        })
      }
    }
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
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.FilteredCount = this.dataSource.filteredData.length;
  }
  RecordNO;ButtonName;
  
  OppID;
  OppIDErrorMessage : string = "";
  OnApplyClick(){
    this.service.GetSCDataUsingOppID(this.OppID).subscribe(data => {
      if(data.code == 200){
        if(data.Data.length > 0){
          this.OppIDErrorMessage = "";
          this.CompanyName.setValue(data.Data[0].op_Account_Name);
        }else{
          this.OppIDErrorMessage = "No data found using "+ this.OppID +" Opportunity ID";
        }
      }else {
        this.CompanyName.setValue("");
        this.OppIDErrorMessage = data.message;
      }
    })
  }
  RowSelected(npsId : number){
    for(let i= 0;i<this.NPSViewData.length;i++){
      if(npsId == this.NPSViewData[i].NpsId){
        this.RecordNO = i;
      }else{}
    }
    this.displayNPSClientForm = true;
    this.ButtonName = "Update";
    this.HeadingName = "Edit Record - "+this.NPSViewData[this.RecordNO].ClientName;
    this.NPSID = this.NPSViewData[this.RecordNO].NpsId;
    this.ClientName.setValue(this.NPSViewData[this.RecordNO].ClientName);
    this.ClientType.setValue(this.NPSViewData[this.RecordNO].ClientType);
    // this.SingleResource = this.NPSViewData[this.RecordNO].SingleResource;
    this.Language.setValue(this.NPSViewData[this.RecordNO].Language);
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
    this.Region.setValue(this.NPSViewData[this.RecordNO].Region);
    this.Country.setValue(this.NPSViewData[this.RecordNO].Country);
    this.Email.setValue(this.NPSViewData[this.RecordNO].Email);
    this.ClientContactNumber = this.NPSViewData[this.RecordNO].CustomerContactNumber;
    this.CompanyName.setValue(this.NPSViewData[this.RecordNO].Company);
    this.DateGolive = this.NPSViewData[this.RecordNO].GoLiveDate;
  }
  Deleterow(NPSID : string,client : string){
    this.openDeleteDialog(NPSID,client);
  }
  NewRecord(){
    this.ButtonName = "Save";
    this.HeadingName = "Add Record";
    this.displayNPSClientForm = true;
    this.NPSID = "";
    this.ClientName.setValue("");
    this.ClientType.setValue("");
    // this.SingleResource = "";
    this.LManager.setValue("To Be Assigned");
    this.Language.setValue("");
    this.RManager.setValue("To Be Assigned");
    this.GManager.setValue("To Be Assigned");
    this.Country.setValue("---");
    this.Region.setValue("");
    this.Email.setValue("");
    this.ClientContactNumber = "";
    this.CompanyName.setValue("");
    this.DateGolive = null;
  }
  OnCancelClick(){
    this.displayNPSClientForm = false;
    this.ClientName.setValue("");
    this.ClientType.setValue("");
    // this.SingleResource = "";
    this.LManager.setValue("---");
    this.Language.setValue("");
    this.RManager.setValue("---");
    this.GManager.setValue("---");
    this.Country.setValue("---");
    this.Region.setValue("");
    this.Email.setValue("");
    this.ClientContactNumber = "";
    this.CompanyName.setValue("");
    this.DateGolive = null;
    this.NPSID = "";
  }
  Export(){
    const CustomizedData = this.NPSViewData.map(o => {
      return {
        "Client First and Last Name" : o.ClientName,
        "Client Type - New/Existing" : o.ClientType,
        "Company Name" : o.Company,
        "Country/Area of Responsibility" : o.Country,
        "Client Contact Number" : o.CustomerContactNumber,
        "Go Live date" : o.GoLiveDate,
        "Email address (Client)" : o.Email,
        "Global ProjectManager" : o.GlobalProjectManager,
        "Regional Project Manager" : o.RegionalProjectManager,
        "Local Project Manager" : o.LocalProjectManager,
        "Region" : o.Region,
        "Global Digital OBT Lead" : o.GlobalDigitalPM,
        "Regional Digital OBT Lead" : o.RegionalDigitalPM,
        "Local Digital OBT Lead" : o.LocalDigitalPM,
        // "Single Resource" : o.SingleResource,
        "Language" : o.Language,
      };
    });
    this.excelservice.exportAsExcelFile(CustomizedData, 'NPS Client Info');
    this.service.NpsViewData().subscribe(data=>{
      if(data.code == 200){
        this.NPSViewData = data.NPSViewData;
        this.dataSource = new MatTableDataSource(data.NPSViewData);
      }
      this.dashboard.ShowSpinnerHandler(false);
    })
  }
}
export interface NPSClientDailogData {
  Name : string;
  SelectedClient : string;
  SelectedNPSID : string;
}
@Component({
  selector: 'app-delete-npsclient',
  templateUrl: './delete-npsclient.component.html'
})
export class DeleteNPSClient {
  constructor(
    public datepipe : DatePipe,
    public service : DashboardServiceService,
    public dialogRef: MatDialogRef<DeleteNPSClient>,
    @Inject(MAT_DIALOG_DATA) public data: NPSClientDailogData) {
    }
  ngOnInit() {
  }
  onYesClick(){
    this.service.NPSDelete(this.data.SelectedNPSID,localStorage.getItem("UID")).subscribe(data=>{
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