import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Responce } from './Models/Responce';
import { Filters } from './Models/Filters';
import { CtoFilters } from './Models/CtoFilters';
import { CTOResponce } from './Models/CTOResponse';
import { IMPSResponce } from './Models/IMPSResponse';
import { IMPSFilters } from './Models/IMPSFilters';
import { EltResponse } from './Models/EltResponse';
import { eSOWFilters } from './Models/eSOWFilters';
import { eSOWResponse } from './Models/eSOWResponse';
import { CMResponse } from './Models/CMResponse';
import { UserDetails } from './Models/UserDetails';
import { LessonsLearntResponse } from './Models/LlResponse';
import { SGFilters } from './Models/SGFilters';
import { SGResponse } from './Models/SGResponse';
import { LLFilters } from './Models/LLFilters';
import { CMFilters } from './Models/CMFilters';
import { ClrResponse } from './Models/ClrResponse';
import { HomeData } from './Models/HomeData';
import { HierarchyFilter } from './Models/HierarchyFilter';
import { LResponce } from './Models/LResponce';
import { RResponce } from './Models/RResponce';
import { GResponce } from './Models/GResponse';
import { HierarcyResponce } from './Models/HierarcyResponse';
import { Hierarchy_Data, HierarchyData } from './Models/HierarchyData';
import { HierarchyGraphs } from './Models/HierarchyGraphs';
import { PerformanceData } from './Models/PerformanceData';
import { CHFilter} from './Models/CHFilter';
import { CapacityHierarchy} from './Models/CapacityHierarchy';
import { LastUpdateOn} from './Models/LastUpdatedOn';
import { UsersUsageofReports} from './Models/UsersUsageofReports';
import { CRMResponse} from './Models/CRMResponse';
import { NPSData} from './Models/NPSData';
import { PSDResponse} from './Models/PSDResponse';
import { AutomatedCLRResponse, ManualCLRDataResponse} from './Models/AutomatedCLRResponse';
import { UserReportAccess } from './Models/UserReportAccess';
import { AutomatedCLRFilters } from './Models/AutomatedCLRFilters';
import { PerformanceResponce } from './Models/PerformanceResponce';
import { SteeringCommitte } from './Models/SteeringCommitte';
import { SteeringCommittee } from './Models/SteeringCommittee';
@Injectable({
  providedIn: 'root'
})
export class DashboardServiceService {
  // Baseurl = 'http://localhost:50421/';
  // Baseurl = 'http://10.180.27.32/';
  // Baseurl = 'http://10.180.27.32:8005/';
  // Baseurl = 'http://www.cwtdashboard.com/';
  Baseurl = 'https://cwtimplementationteam.mycwt.com/';
  // ImeetURl = 'https://edge.imeetcentral.com/v1/reports/WzM1LDE1MzYxXQ?contextId=647';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
    })
  };
  // body = {
  //   "MessageObject": {
  //       "queryName": "eSoW Countries",
  //       "startDate": "2018-01-01",
  //       "endDate": null,
  //       "modifiedDate": "2022-06-01",
  //       "onlyWonOrSubmitted": false,
  //       "debug": false,
  //       "id": null,
  //       "limit": null,
  //       "includeTest": false
  //   }
  // }
  // esowHeaders = {
  //   headers: new HttpHeaders({
  //     'Content-Type' :  'application/json',
  //     'apiKey' : 'XVdjcIpDXDI7R6v9yE2ZxAGDMztLwdocZmh0jUUihjQ',
  //     // 'Access-Control-Allow-Origin' : '*'
  //   })
  // }
  // esowURL = "https://uat.gpsc.cwtwebpem.com/pat/esow/query";
  constructor(private http : HttpClient,public route : ActivatedRoute){
    // this.route.queryParams.subscribe(params => {
    //   this.restaurent_id = params["resid"];
    // });
  }
  // public GeteSOWData(){
  //   let params = new HttpParams();
  //   return this.http.post(`${this.esowURL+""}`,this.body,this.esowHeaders);
  // }
  public LastUpdatedOn(){
    let params = new HttpParams();
    return this.http.post<LastUpdateOn>(`${this.Baseurl+"LastUpdatedOn"}`,params);
  }
  public UserReportAccess(UID : string){
    let params = new HttpParams();
    params = params.append('UID',UID+"");
    return this.http.post<UserReportAccess>(`${this.Baseurl+"UserReportAccess"}`,params);
  }
  public UserReportWiseRequests(UID : string){
    let params = new HttpParams();
    params = params.append('UID',UID+"");
    return this.http.post<UserReportAccess>(`${this.Baseurl+"UserReportWiseRequests"}`,params);
  }
  //Implementation Market Report
  public ImeetMilestoneFiltersList(){
    let params = new HttpParams();
    return this.http.post<Filters>(`${this.Baseurl+"ImeetImplementationFiltersList"}`,params);
  }
  // public ProjectStatusList(){
  //   let params = new HttpParams();
  //   // params = params.append('iMeet_Milestone___Project_Status', iMeet_Milestone___Project_Status+"");
  //   return this.http.post<Responce>(`${this.Baseurl+"ProjectStatus"}`,params);
  // }
  public ImeetMilestoneProjectStatus(GoLiveYear: number,GoLiveMonth : string,ProjectLevel : string,Region : string,ProjectStatus : string,ImplementationType : string,Country : string,OwnerShip : string){
    let params = new HttpParams();
    params = params.append('GoLiveYear',GoLiveYear+"");
    params = params.append('GoLiveMonth',GoLiveMonth);
    params = params.append('ProjectLevel',ProjectLevel);
    params = params.append('Region',Region);
    params = params.append('Country',Country);
    params = params.append('ProjectStatus',ProjectStatus);
    params = params.append('ImplementationType',ImplementationType);
    params = params.append('OwnerShip',OwnerShip);
    return this.http.post<Responce>(`${this.Baseurl+"ImeetMilestoneProjectStatus"}`,params);
  }
  public MonthlyRevenueGraph(GoLiveYear: number,GoLiveMonth : string,Quarter : string,ProjectLevel : string,BacklogStarted : string,Region : string,MarketLeader : string){
    let params = new HttpParams();
    params = params.append('GoLiveYear',GoLiveYear+"");
    params = params.append('GoLiveMonth',GoLiveMonth);
    params = params.append('Quarter',Quarter);
    params = params.append('ProjectLevel',ProjectLevel);
    params = params.append('BacklogStarted',BacklogStarted);
    params = params.append('Region',Region);
    params = params.append('MarketLeader',MarketLeader);
    //params = params.append('Implementation_Type',Implementation_Type);
    return this.http.post<Responce>(`${this.Baseurl+"MonthlyRevenue"}`,params);
  }
  public MonthlyRevenueByYear(GoLiveYear: number,GoLiveMonth : string,ProjectLevel : string,Region : string,ProjectStatus : string,ImplementationType : string,Country : string,OwnerShip : string){
    let params = new HttpParams();
    params = params.append('GoLiveYear',GoLiveYear+"");
    params = params.append('GoLiveMonth',GoLiveMonth);
    // params = params.append('Quarter',Quarter);
    params = params.append('ProjectLevel',ProjectLevel);
    // params = params.append('BacklogStarted',BacklogStarted);
    params = params.append('Region',Region);
    params = params.append('Country',Country);
    params = params.append('ProjectStatus',ProjectStatus);
    params = params.append('ImplementationType',ImplementationType);
    params = params.append('OwnerShip',OwnerShip);
    return this.http.post<Responce>(`${this.Baseurl+"MonthlyRevenueByYear"}`,params);
  }
  // public MonthlyGTRevenue(Go_Live_Year: string,Go_Live_Month : string,Quarter : string,iMeet_Project_Level : string,Backlog_Started : string,Region__Opportunity_ : string,Market_Leader : string,iMeet_Milestone___Project_Status : string,Implementation_Type : string){
  //   let params = new HttpParams();
  //   params = params.append('Go_Live_Year',Go_Live_Year);
  //   params = params.append('Go_Live_Month',Go_Live_Month);
  //   params = params.append('Quarter',Quarter);
  //   params = params.append('iMeet_Project_Level',iMeet_Project_Level);
  //   params = params.append('Backlog_Started',Backlog_Started);
  //   params = params.append('Region__Opportunity_',Region__Opportunity_);
  //   params = params.append('Market_Leader',Market_Leader);
  //   params = params.append('iMeet_Milestone___Project_Status',iMeet_Milestone___Project_Status);
  //   params = params.append('Implementation_Type',Implementation_Type);
  //   return this.http.post<Responce>(`${this.Baseurl+"MonthlyGrandTotalRevenue"}`,params);
  // }
  public MonthlyTotalRevenueWithDelta(){
    let params = new HttpParams();
    return this.http.post<Responce>(`${this.Baseurl+"MonthlyTotalRevenueWithDelta"}`,params);
  }
  public RegionWiseRevenue(GoLiveYear: number,GoLiveMonth : string,ProjectLevel : string,Region : string,ProjectStatus : string,ImplementationType : string,Country : string,OwnerShip : string){
    let params = new HttpParams();
    params = params.append('GoLiveYear',GoLiveYear+"");
    params = params.append('GoLiveMonth',GoLiveMonth);
    // params = params.append('Quarter',Quarter);
    params = params.append('ProjectLevel',ProjectLevel);
    // params = params.append('BacklogStarted',BacklogStarted);
    params = params.append('Region',Region);
    params = params.append('Country',Country);
    params = params.append('ProjectStatus',ProjectStatus);
    params = params.append('ImplementationType',ImplementationType);
    params = params.append('OwnerShip',OwnerShip);
    return this.http.post<Responce>(`${this.Baseurl+"RegionWiseRevenue"}`,params);
  }
  public MarketGoliveReport(Region : string,ProjectLevel : string,ProjectStatus : string,ImplementationType : string,OwnerShip : string){
    let params = new HttpParams();
    // params = params.append('GoLiveYear',GoLiveYear+"");
    // params = params.append('GoLiveMonth',GoLiveMonth);
    // params = params.append('Quarter',Quarter);
    params = params.append('ProjectLevel',ProjectLevel);
    // params = params.append('BacklogStarted',BacklogStarted);
    params = params.append('Region',Region);
    // params = params.append('Country',Country);
    params = params.append('ProjectStatus',ProjectStatus);
    params = params.append('ImplementationType',ImplementationType);
    params = params.append('OwnerShip',OwnerShip);
    return this.http.post<Responce>(`${this.Baseurl+"MarketGoliveReport"}`,params);
  }
  public ProjectLevelWise(GoLiveYear: number,GoLiveMonth : string,ProjectLevel : string,Region : string,ProjectStatus : string,ImplementationType : string,Country : string,OwnerShip : string){
    let params = new HttpParams();
    params = params.append('GoLiveYear',GoLiveYear+"");
    params = params.append('GoLiveMonth',GoLiveMonth);
    // params = params.append('Quarter',Quarter);
    params = params.append('ProjectLevel',ProjectLevel);
    // params = params.append('BacklogStarted',BacklogStarted);
    params = params.append('Region',Region);
    params = params.append('Country',Country);
    params = params.append('ProjectStatus',ProjectStatus);
    params = params.append('ImplementationType',ImplementationType);
    params = params.append('OwnerShip',OwnerShip);
    return this.http.post<Responce>(`${this.Baseurl+"ProjectLevelWise"}`,params);
  }
  //Start Of CriticalTaskOverDue Api's
  public CriticalTaskFiltersList(){
    let params = new HttpParams();
    return this.http.post<CtoFilters>(`${this.Baseurl+"CriticalTaskFiltersList"}`,params);
  }
  public CriticalTaskOverDue(TaskType : string,Group_Name : string,Workspace__Project_Level : string,Milestone__Region : string){
    let params = new HttpParams();
    params = params.append('TaskType',TaskType);
    params = params.append('Group_Name',Group_Name);
    params = params.append('Workspace__Project_Level',Workspace__Project_Level);
    params = params.append('Milestone__Region',Milestone__Region);
    // params = params.append('Milestone__Country',Milestone__Country);
    return this.http.post<CTOResponce>(`${this.Baseurl+"CriticalTaskOverDue"}`,params);
  }
  public CriticalTaskOverDueExcel(){
    let params = new HttpParams();
    return this.http.post<CTOResponce>(`${this.Baseurl+"CriticalTaskOverDueExcel"}`,params);
  }
  public StatusWiseCount(Group_Name : string,Workspace__Project_Level : string,Milestone__Region : string){
    let params = new HttpParams();
    params = params.append('Group_Name',Group_Name);
    params = params.append('Workspace__Project_Level',Workspace__Project_Level);
    params = params.append('Milestone__Region',Milestone__Region);
    return this.http.post<CTOResponce>(`${this.Baseurl+"StatusWiseCount"}`,params);
  }
  public RegionWiseCount(TaskType : string,Group_Name : string,Workspace__Project_Level : string,Milestone__Region : string){
    let params = new HttpParams();
    params = params.append('TaskType',TaskType);
    params = params.append('Group_Name',Group_Name);
    params = params.append('Workspace__Project_Level',Workspace__Project_Level);
    params = params.append('Milestone__Region',Milestone__Region);
    return this.http.post<CTOResponce>(`${this.Baseurl+"RegionWiseCount"}`,params);
  }
  public GroupNameCountCTO(TaskType : string,Group_Name : string,Workspace__Project_Level : string,Milestone__Region : string){
    let params = new HttpParams();
    params = params.append('TaskType',TaskType);
    params = params.append('Group_Name',Group_Name);
    params = params.append('Workspace__Project_Level',Workspace__Project_Level);
    params = params.append('Milestone__Region',Milestone__Region);
    return this.http.post<CTOResponce>(`${this.Baseurl+"GroupNameCountCTO"}`,params);
  }
  // public ImeetTableNameResponce(){

  //   return this.http.get(`${this.ImeetURl, {ignoreAuthModule: true} }`);
  // }
  //End Of CriticalTaskOverDue Api's

  //Start Of ImplementationProjectStatus Api's
  public ProjectLevelCount(Task_Start_Date : string,Milestone__Project_Start_Date : string,Milestone__Project_Status : string,Workspace__Project_Level : string,Milestone__Region : string,Milestone__Assignee__Reports_to__Full_Name : string,Group_Name: string){
    let params = new HttpParams();
    params = params.append('Task_Start_Date',Task_Start_Date);
    params = params.append('Milestone__Project_Status',Milestone__Project_Status);
    params = params.append('Workspace__Project_Level',Workspace__Project_Level);
    params = params.append('Milestone__Region',Milestone__Region);
    // params = params.append('Milestone__Assignee__Full_Name',Milestone__Assignee__Full_Name);
    params = params.append('Milestone__Assignee__Reports_to__Full_Name',Milestone__Assignee__Reports_to__Full_Name);
    params = params.append('Group_Name',Group_Name);
    params = params.append('Milestone__Project_Start_Date',Milestone__Project_Start_Date);
    return this.http.post<IMPSResponce>(`${this.Baseurl+"ProjectLevelCount"}`,params);
  }
  public ProjectStatusCount(Task_Start_Date : string,Milestone__Project_Start_Date : string,Milestone__Project_Status : string,Workspace__Project_Level : string,Milestone__Region : string,Milestone__Assignee__Reports_to__Full_Name : string,Group_Name: string){
    let params = new HttpParams();
    params = params.append('Task_Start_Date',Task_Start_Date);
    params = params.append('Milestone__Project_Start_Date',Milestone__Project_Start_Date);
    params = params.append('Milestone__Project_Status',Milestone__Project_Status);
    params = params.append('Workspace__Project_Level',Workspace__Project_Level);
    params = params.append('Milestone__Region',Milestone__Region);
    // params = params.append('Milestone__Assignee__Full_Name',Milestone__Assignee__Full_Name);
    params = params.append('Milestone__Assignee__Reports_to__Full_Name',Milestone__Assignee__Reports_to__Full_Name);
    params = params.append('Group_Name',Group_Name);
    return this.http.post<IMPSResponce>(`${this.Baseurl+"ProjectStatusCount"}`,params);
  }
  public ProjectLeadersCounts(Task_Start_Date : string,Milestone__Project_Start_Date : string,Milestone__Project_Status : string,Workspace__Project_Level : string,Milestone__Region : string,Milestone__Assignee__Reports_to__Full_Name : string,Group_Name: string){
    let params = new HttpParams();
    params = params.append('Task_Start_Date',Task_Start_Date);
    params = params.append('Milestone__Project_Start_Date',Milestone__Project_Start_Date);
    params = params.append('Milestone__Project_Status',Milestone__Project_Status);
    params = params.append('Workspace__Project_Level',Workspace__Project_Level);
    params = params.append('Milestone__Region',Milestone__Region);
    // params = params.append('Milestone__Assignee__Full_Name',Milestone__Assignee__Full_Name);
    params = params.append('Milestone__Assignee__Reports_to__Full_Name',Milestone__Assignee__Reports_to__Full_Name);
    params = params.append('Group_Name',Group_Name);
    return this.http.post<IMPSResponce>(`${this.Baseurl+"ProjectLeadersCounts"}`,params);
  }
  public GroupNameCountIMPS(Task_Start_Date : string,Milestone__Project_Start_Date : string,Milestone__Project_Status : string,Workspace__Project_Level : string,Milestone__Region : string,Milestone__Assignee__Reports_to__Full_Name : string,Group_Name: string){
    let params = new HttpParams();
    params = params.append('Task_Start_Date',Task_Start_Date);
    params = params.append('Milestone__Project_Start_Date',Milestone__Project_Start_Date);
    params = params.append('Milestone__Project_Status',Milestone__Project_Status);
    params = params.append('Workspace__Project_Level',Workspace__Project_Level);
    params = params.append('Milestone__Region',Milestone__Region);
    // params = params.append('Milestone__Assignee__Full_Name',Milestone__Assignee__Full_Name);
    params = params.append('Milestone__Assignee__Reports_to__Full_Name',Milestone__Assignee__Reports_to__Full_Name);
    params = params.append('Group_Name',Group_Name);
    return this.http.post<IMPSResponce>(`${this.Baseurl+"GroupNameCountIMPS"}`,params);
  }
  public RegionWiseCountIMPS(Task_Start_Date : string,Milestone__Project_Start_Date : string,Milestone__Project_Status : string,Workspace__Project_Level : string,Milestone__Region : string,Milestone__Assignee__Reports_to__Full_Name : string,Group_Name: string){
    let params = new HttpParams();
    params = params.append('Task_Start_Date',Task_Start_Date);
    params = params.append('Milestone__Project_Start_Date',Milestone__Project_Start_Date);
    params = params.append('Milestone__Project_Status',Milestone__Project_Status);
    params = params.append('Workspace__Project_Level',Workspace__Project_Level);
    params = params.append('Milestone__Region',Milestone__Region);
    // params = params.append('Milestone__Assignee__Full_Name',Milestone__Assignee__Full_Name);
    params = params.append('Milestone__Assignee__Reports_to__Full_Name',Milestone__Assignee__Reports_to__Full_Name);
    params = params.append('Group_Name',Group_Name);
    return this.http.post<IMPSResponce>(`${this.Baseurl+"RegionWiseCountIMPS"}`,params);
  }
  
  public ImeetPSFilters(){
    let params = new HttpParams();
    return this.http.post<IMPSFilters>(`${this.Baseurl+"ImeetPSFilters"}`,params);
  }
  public ImplementationProjectStatusData(Task_Start_Date : string,Milestone__Project_Start_Date : string,Milestone__Project_Status : string,Workspace__Project_Level : string,Milestone__Region : string,Milestone__Assignee__Reports_to__Full_Name : string,Group_Name: string){
    let params = new HttpParams();
    params = params.append('Task_Start_Date',Task_Start_Date);
    params = params.append('Milestone__Project_Start_Date',Milestone__Project_Start_Date);
    params = params.append('Milestone__Project_Status',Milestone__Project_Status);
    params = params.append('Workspace__Project_Level',Workspace__Project_Level);
    params = params.append('Milestone__Region',Milestone__Region);
    // params = params.append('Milestone__Assignee__Full_Name',Milestone__Assignee__Full_Name);
    params = params.append('Milestone__Assignee__Reports_to__Full_Name',Milestone__Assignee__Reports_to__Full_Name);
    params = params.append('Group_Name',Group_Name);
    return this.http.post<IMPSResponce>(`${this.Baseurl+"ImplementationProjectStatusData"}`,params);
  }
  public ImplementationProjectStatusExcelData(){
    let params = new HttpParams();
    return this.http.post<IMPSResponce>(`${this.Baseurl+"ImplementationProjectStatusExcelData"}`,params);
  }
  //End of ImplementationProjectStatus Api's
  //Start OF EltReport Api's
  public CurrentMonthELT(){
    let params = new HttpParams();
    return this.http.post<EltResponse>(`${this.Baseurl+"CurrentMonthELT"}`,params);
  }
  public NextMonthELT(){
    let params = new HttpParams();
    return this.http.post<EltResponse>(`${this.Baseurl+"NextMonthELT"}`,params);
  }
  public RestOfMonthsELT(){
    let params = new HttpParams();
    return this.http.post<EltResponse>(`${this.Baseurl+"RestOfMonthsELT"}`,params);
  }
  public PreviousMonthsEltYearMonth(){
    let params = new HttpParams();
    return this.http.post<EltResponse>(`${this.Baseurl+"PreviousMonthsEltYearMonth"}`,params);
  }
  public SelectedPriorMonthYearData(Year : string,Month : string){
    let params = new HttpParams();
    params = params.append('Year',Year);
    params = params.append('Month',Month);
    return this.http.post<EltResponse>(`${this.Baseurl+"SelectedPriorMonthYearData"}`,params);
  }
  //End Of EltReport Api's
  //Start of eSowReport Api's
  public EssentialTablesFilters(){
    let params = new HttpParams();
    return this.http.post<eSOWFilters>(`${this.Baseurl+"EssentialTablesFilters"}`,params);
  }
  public EssentialTables(Sales_Leader_type_and_Type_of_bid : string,Prospect_Type : string,StartDate : string){
    let params = new HttpParams();
    params = params.append('Sales_Leader_type_and_Type_of_bid',Sales_Leader_type_and_Type_of_bid);
    params = params.append('Prospect_Type',Prospect_Type);
    params = params.append('StartDate',StartDate);
    return this.http.post<eSOWResponse>(`${this.Baseurl+"EssentialTables"}`,params);
  }
  public DSDmetrics(StartDate : string){
    let params = new HttpParams();
    params = params.append('StartDate', StartDate);
    return this.http.post<eSOWResponse>(`${this.Baseurl+"DSDmetrics"}`,params);
  }
  public TotalYTDActivity(StartDate : string){
    let params = new HttpParams();
    params = params.append('StartDate', StartDate);
    return this.http.post<eSOWResponse>(`${this.Baseurl+"TotalYTDActivity"}`,params);
  }
  public DavidData(StartDate : string,EndDate : string){
    let params = new HttpParams();
    params = params.append('StartDate',StartDate);
    params = params.append('EndDate',EndDate);
    return this.http.post<eSOWResponse>(`${this.Baseurl+"DavidData"}`,params);
  }
  //End of eSowReport Api's
  //Start of Market Api's
  public ChartVolumeCycleTimeCounts(GoLiveYear: number,GoLiveMonth : string,ProjectLevel : string,Region : string,ProjectStatus : string,ImplementationType : string,Country : string,OwnerShip : string){
    let params = new HttpParams();
    params = params.append('GoLiveYear',GoLiveYear+"");
    params = params.append('GoLiveMonth',GoLiveMonth);
    // params = params.append('Quarter',Quarter);
    params = params.append('ProjectLevel',ProjectLevel);
    // params = params.append('BacklogStarted',BacklogStarted);
    params = params.append('Region',Region);
    params = params.append('Country',Country);
    params = params.append('ProjectStatus',ProjectStatus);
    params = params.append('ImplementationType',ImplementationType);
    params = params.append('OwnerShip',OwnerShip);
    return this.http.post<Responce>(`${this.Baseurl+"ChartVolumeCycleTimeCounts"}`,params);
  }
  public CycleTimeChartVolumeCount(GoLiveYear: number,Region : string,ProjectStatus : string,CycleTimeCategories : string){
    let params = new HttpParams();
    params = params.append('GoLiveYear',GoLiveYear+"");
    // params = params.append('GoLiveMonth',GoLiveMonth);
    // params = params.append('Quarter',Quarter);
    // params = params.append('ProjectLevel',ProjectLevel);
    // params = params.append('BacklogStarted',BacklogStarted);
    params = params.append('Region',Region);
    params = params.append('CycleTimeCategories',CycleTimeCategories);
    params = params.append('ProjectStatus',ProjectStatus);
    // params = params.append('ImplementationType',ImplementationType);
    return this.http.post<Responce>(`${this.Baseurl+"CycleTimeChartVolumeCount"}`,params);
  }
  public CycleTimeFilters(){
    let params = new HttpParams();
    return this.http.post<Filters>(`${this.Baseurl+"CycleTimeFilters"}`,params);
  }
  public GlobalCycleTimeCount(ProjectStatus : string,ProjectLevel : string,GoLiveYear : string,GoLiveMonth : string,Region : string, ImplementationType : string){
    let params = new HttpParams();
    params = params.append('ProjectStatus',ProjectStatus);
    params = params.append('ProjectLevel',ProjectLevel);
    params = params.append('GoLiveYear',GoLiveYear);
    params = params.append('GoLiveMonth',GoLiveMonth);
    params = params.append('Region',Region);
    params = params.append('ImplementationType',ImplementationType);
    return this.http.post<GResponce>(`${this.Baseurl+"CycleTimeChartVolumeCount"}`,params);
  }
  public LocalCycleTimeCount(ProjectStatus : string,ProjectLevel : string,GoLiveYear : string,GoLiveMonth : string,Region : string, ImplementationType : string){
    let params = new HttpParams();
    params = params.append('ProjectStatus',ProjectStatus);
    params = params.append('ProjectLevel',ProjectLevel);
    params = params.append('GoLiveYear',GoLiveYear);
    params = params.append('GoLiveMonth',GoLiveMonth);
    params = params.append('Region',Region);
    params = params.append('ImplementationType',ImplementationType);
    return this.http.post<LResponce>(`${this.Baseurl+"CycleTimeChartVolumeCount"}`,params);
  }
  public RegionalCycleTimeCount(ProjectStatus : string,ProjectLevel : string,GoLiveYear : string,GoLiveMonth : string,Region : string, ImplementationType : string){
    let params = new HttpParams();
    params = params.append('ProjectStatus',ProjectStatus);
    params = params.append('ProjectLevel',ProjectLevel);
    params = params.append('GoLiveYear',GoLiveYear);
    params = params.append('GoLiveMonth',GoLiveMonth);
    params = params.append('Region',Region);
    params = params.append('ImplementationType',ImplementationType);
    return this.http.post<RResponce>(`${this.Baseurl+"CycleTimeChartVolumeCount"}`,params);
  }
  public ProjectCountByYear(GoLiveYear: number,GoLiveMonth : string,ProjectLevel : string,Region : string,ProjectStatus : string,ImplementationType : string,Country : string,OwnerShip : string){
    let params = new HttpParams();
    params = params.append('GoLiveYear',GoLiveYear+"");
    params = params.append('GoLiveMonth',GoLiveMonth);
    // params = params.append('Quarter',Quarter);
    params = params.append('ProjectLevel',ProjectLevel);
    // params = params.append('BacklogStarted',BacklogStarted);
    params = params.append('Region',Region);
    params = params.append('Country',Country);
    params = params.append('ProjectStatus',ProjectStatus);
    params = params.append('ImplementationType',ImplementationType);
    params = params.append('OwnerShip',OwnerShip);
    return this.http.post<Responce>(`${this.Baseurl+"ProjectCountByYear"}`,params);
  }
  //End of Market Api's
  //Start of Capacity Management Api's
  public CapacityFiltersList(){
    let params = new HttpParams();
    return this.http.post<CMFilters>(`${this.Baseurl+"CapacityFiltersList"}`,params);
  }
  public CapacityByClient(iMeet_Milestone___Project_Status : string,iMeet_Project_Level : string,Region__Opportunity_ : string,Go_Live_Year : string,Global_PL_Leader : string,Regional_PL_Leader : string,Local_PL_Leader : string, Global_Project_Manager : string,Regional_Project_Manager : string){
    let params = new HttpParams();
    params = params.append('iMeet_Milestone___Project_Status',iMeet_Milestone___Project_Status);
    params = params.append('iMeet_Project_Level',iMeet_Project_Level);
    params = params.append('Region__Opportunity_',Region__Opportunity_);
    params = params.append('Go_Live_Year',Go_Live_Year);
    params = params.append('Global_PL_Leader',Global_PL_Leader);
    params = params.append('Regional_PL_Leader',Regional_PL_Leader);
    params = params.append('Local_PL_Leader',Local_PL_Leader);
    params = params.append('Global_Project_Manager',Global_Project_Manager);
    params = params.append('Regional_Project_Manager',Regional_Project_Manager);
    return this.http.post<CMResponse>(`${this.Baseurl+"CapacityByClient"}`,params);
  }
  public CapacityByRegion(iMeet_Milestone___Project_Status : string,iMeet_Project_Level : string,Region__Opportunity_ : string,Go_Live_Year : string,Project_Sum : string){
    let params = new HttpParams();
    params = params.append('iMeet_Milestone___Project_Status',iMeet_Milestone___Project_Status);
    params = params.append('iMeet_Project_Level',iMeet_Project_Level);
    params = params.append('Region__Opportunity_',Region__Opportunity_);
    params = params.append('Go_Live_Year',Go_Live_Year);
    params = params.append('Project_Sum',Project_Sum);
    return this.http.post<CMResponse>(`${this.Baseurl+"CapacityByRegion"}`,params);
  }
  public CapacityByGlobalPL(iMeet_Milestone___Project_Status : string,iMeet_Project_Level : string,Region__Opportunity_ : string,Go_Live_Year : string,Project_Sum : string){
    let params = new HttpParams();
    params = params.append('iMeet_Milestone___Project_Status',iMeet_Milestone___Project_Status);
    params = params.append('iMeet_Project_Level',iMeet_Project_Level);
    params = params.append('Region__Opportunity_',Region__Opportunity_);
    params = params.append('Go_Live_Year',Go_Live_Year);
    params = params.append('Project_Sum',Project_Sum);
    return this.http.post<CMResponse>(`${this.Baseurl+"CapacityByGlobalPL"}`,params);
  }
  public CapacityByRegionalPL(iMeet_Milestone___Project_Status : string,iMeet_Project_Level : string,Region__Opportunity_ : string,Go_Live_Year : string,Project_Sum : string){
    let params = new HttpParams();
    params = params.append('iMeet_Milestone___Project_Status',iMeet_Milestone___Project_Status);
    params = params.append('iMeet_Project_Level',iMeet_Project_Level);
    params = params.append('Region__Opportunity_',Region__Opportunity_);
    params = params.append('Go_Live_Year',Go_Live_Year);
    params = params.append('Project_Sum',Project_Sum);
    return this.http.post<CMResponse>(`${this.Baseurl+"CapacityByRegionalPL"}`,params);
  }
  public CapacityByLocalPL(iMeet_Milestone___Project_Status : string,iMeet_Project_Level : string,Region__Opportunity_ : string,Go_Live_Year : string,Project_Sum : string){
    let params = new HttpParams();
    params = params.append('iMeet_Milestone___Project_Status',iMeet_Milestone___Project_Status);
    params = params.append('iMeet_Project_Level',iMeet_Project_Level);
    params = params.append('Region__Opportunity_',Region__Opportunity_);
    params = params.append('Go_Live_Year',Go_Live_Year);
    params = params.append('Project_Sum',Project_Sum);
    return this.http.post<CMResponse>(`${this.Baseurl+"CapacityByLocalPL"}`,params);
  }
  //End of Capacity Management Api's
  //start of LessonsLearnt Api's
  public LessonsLearntFiltersList(){
    let params = new HttpParams();
    return this.http.post<LLFilters>(`${this.Baseurl+"LessonsLearntFiltersList"}`,params);
  }
  public LessonsLearnt(Status__By_Leader_ : string,Region : string){
    let params = new HttpParams();
    params = params.append('Region',Region);
    params = params.append('Status__By_Leader_',Status__By_Leader_);
    return this.http.post<LessonsLearntResponse>(`${this.Baseurl+"LessonsLearnt"}`,params);
  }
  public LessonsLearntExcel(){
    let params = new HttpParams();
    return this.http.post<LessonsLearntResponse>(`${this.Baseurl+"LessonsLearntExcel"}`,params);
  }
  //End of LessonsLearnt Api's

  //start of StageGate Api's
  public StageGateFiltersList(){
    let params = new HttpParams();
    return this.http.post<SGFilters>(`${this.Baseurl+"StageGateFiltersList"}`,params);
  }
  public StageGateDataList1(Year : string,Month : string,Task_Status : string,Milestone__Project_Status : string){
    let params = new HttpParams();
    params = params.append('Year',Year);
    params = params.append('Month',Month);
    params = params.append('Task_Status',Task_Status);
    params = params.append('Milestone__Project_Status',Milestone__Project_Status);
    return this.http.post<SGResponse>(`${this.Baseurl+"StageGateDataList1"}`,params);
  }
  public StageGateDataList2(Year : string,Month : string,Task_Status : string,Milestone__Project_Status : string){
    let params = new HttpParams();
    params = params.append('Year',Year);
    params = params.append('Month',Month);
    params = params.append('Task_Status',Task_Status);
    params = params.append('Milestone__Project_Status',Milestone__Project_Status);
    return this.http.post<SGResponse>(`${this.Baseurl+"StageGateDataList2"}`,params);
  }
  public StageGateDataExport(Year : string,Month : string,Task_Status : string,Milestone__Project_Status : string,ReportName : string){
    let params = new HttpParams();
    params = params.append('Year',Year);
    params = params.append('Month',Month);
    params = params.append('Task_Status',Task_Status);
    params = params.append('Milestone__Project_Status',Milestone__Project_Status);
    params = params.append('ReportName',ReportName);
    return this.http.post<SGResponse>(`${this.Baseurl+"StageGateDataExport"}`,params);
  }
  //End of StageGate Api's
  //Start Of HomePageApi's
  public HomeDetailsData(Region : string){
    let params = new HttpParams();
    params = params.append('Region',Region);
    return this.http.post<HomeData>(`${this.Baseurl+"HomeDetailsData"}`,params);
  }
  public HomeDetailsDataWithCountry(Region : string,Country : string){
    let params = new HttpParams();
    params = params.append('Region',Region);
    params = params.append('Country',Country);
    return this.http.post<HomeData>(`${this.Baseurl+"HomeDetailsDataWithCountry"}`,params);
  }
  public HomeData(){
    let params = new HttpParams();
    // params = params.append('Region',Region);
    return this.http.post<HomeData>(`${this.Baseurl+"HomeData"}`,params);
  }
  //End Of HomePage Api's
  //Start Of Hierarchy Api's
  public HierarchyFilters(VP : string,Sr_Leader : string,LeaderOne : string,LeaderTwo : string){
    let params = new HttpParams();
    params = params.append('VP',VP);
    params = params.append('Sr_Leader',Sr_Leader);
    params = params.append('LeaderOne',LeaderOne);
    params = params.append('LeaderTwo',LeaderTwo);
    return this.http.post<HierarchyFilter>(`${this.Baseurl+"HierarchyFilters"}`,params);
  }
  public CLRHierarchyData(ProjectStatus : string,Region : string,ProjectLevel : string,Quarter : string,GoLiveYear : string,AssigneeFullName : string,VP : string,SeniorLeader : string,Leader : string){
    let params = new HttpParams();
    params = params.append('ProjectStatus',ProjectStatus);
    params = params.append('Region',Region);
    params = params.append('ProjectLevel',ProjectLevel);
    params = params.append('Quarter',Quarter);
    params = params.append('GoLiveYear',GoLiveYear);
    params = params.append('VP',VP);
    params = params.append('SeniorLeader',SeniorLeader);
    params = params.append('Leader',Leader);
    params = params.append('AssigneeFullName',AssigneeFullName);
    return this.http.post<HierarcyResponce>(`${this.Baseurl+"CLRHierarchyData"}`,params);
  }
  public HierarchyData(){
    let params = new HttpParams();
    return this.http.post<HierarchyData>(`${this.Baseurl+"HierarchyData"}`,params);
  }
  public HierarchyInsert(User_ID : string,Name : string,LeaderTwo : string,LeaderOne : string,Sr_Leader : string,VP : string,Email_Address : string,Region : string,Location : string,Role : string,Title : string,UserStatus : string){
    let params = new HttpParams();
    params = params.append('User_ID',User_ID);
    params = params.append('Name',Name);
    params = params.append('LeaderTwo',LeaderTwo);
    params = params.append('LeaderOne',LeaderOne);
    params = params.append('Sr_Leader',Sr_Leader);
    params = params.append('VP',VP);
    params = params.append('Email_Address',Email_Address);
    params = params.append('Region',Region);
    params = params.append('Location',Location);
    params = params.append('Role',Role);
    params = params.append('Title',Title);
    params = params.append('UserStatus',UserStatus);
    return this.http.post<HierarchyData>(`${this.Baseurl+"HierarchyInsert"}`,params);
  }
  public HierarchyUpdate(HierarchyID : number,User_ID : string,Name : string,LeaderTwo : string,LeaderOne : string,Sr_Leader : string,VP : string,Email_Address : string,Region : string,Location : string,Role : string,Title : string,UserStatus : string){
    let params = new HttpParams();
    params = params.append('HierarchyID',HierarchyID+"");
    params = params.append('User_ID',User_ID);
    params = params.append('Name',Name);
    params = params.append('LeaderTwo',LeaderTwo);
    params = params.append('LeaderOne',LeaderOne);
    params = params.append('Sr_Leader',Sr_Leader);
    params = params.append('VP',VP);
    params = params.append('Email_Address',Email_Address);
    params = params.append('Region',Region);
    params = params.append('Location',Location);
    params = params.append('Role',Role);
    params = params.append('Title',Title);
    return this.http.post<HierarchyData>(`${this.Baseurl+"HierarchyUpdate"}`,params);
  }
  public HierarchyDelete(User_ID : string){
    let params = new HttpParams();
    params = params.append('User_ID',User_ID);
    return this.http.post<HierarchyData>(`${this.Baseurl+"HierarchyDelete"}`,params);
  }
  public HierarchyGraphs(GoLiveYear : string,Quarter : string,Region : string,ProjectLevel : string,ProjectStatus : string,AssigneeFullName : string){
    let params = new HttpParams();
    params = params.append('GoLiveYear',GoLiveYear);
    params = params.append('Quarter',Quarter);
    params = params.append('Region',Region);
    params = params.append('ProjectLevel',ProjectLevel);
    params = params.append('ProjectStatus',ProjectStatus);
    params = params.append('AssigneeFullName',AssigneeFullName);
    return this.http.post<HierarchyGraphs>(`${this.Baseurl+"HierarchyGraphs"}`,params);
  }
  public HierarchyMonthWise(GoLiveYear : string,Quarter : string,Region : string,ProjectLevel : string,ProjectStatus : string,AssigneeFullName : string){
    let params = new HttpParams();
    params = params.append('GoLiveYear',GoLiveYear);
    params = params.append('Quarter',Quarter);
    params = params.append('Region',Region);
    params = params.append('ProjectLevel',ProjectLevel);
    params = params.append('ProjectStatus',ProjectStatus);
    params = params.append('AssigneeFullName',AssigneeFullName);
    return this.http.post<HierarchyGraphs>(`${this.Baseurl+"HierarchyMonthWise"}`,params);
  }
  public PerformanceData(GoLiveYear : string,Quarter : string,Region : string,ProjectLevel : string,ProjectStatus : string){
    let params = new HttpParams();
    params = params.append('GoLiveYear',GoLiveYear);
    params = params.append('Quarter',Quarter);
    params = params.append('Region',Region);
    params = params.append('ProjectLevel',ProjectLevel);
    params = params.append('ProjectStatus',ProjectStatus);
    return this.http.post<PerformanceData>(`${this.Baseurl+"PerformanceData"}`,params);
  }
  //End Of Hierarchy Api's

  public ResourceUtilizationNew(Comments : string){
    let params = new HttpParams();
    params = params.append('Comments',Comments);
    return this.http.post<Responce>(`${this.Baseurl+"ResourceUtilization"}`,params);
  }
  public Tracker(){
    let params = new HttpParams();
    // params = params.append('iMeet_Milestone___Project_Status', iMeet_Milestone___Project_Status+"");
    return this.http.post<Responce>(`${this.Baseurl+"Tracker"}`,params);
  }
  public GetCapacityHierarchy(){
    let params = new HttpParams();
    return this.http.post<CapacityHierarchy>(`${this.Baseurl+"GetCapacityHierarchy"}`,params);
  }
  public DeleteUserFromCapacityHierarchy(HID : string,InsertedBy : string){
    let params = new HttpParams();
    params = params.append('HID',HID);
    params = params.append('InsertedBy',InsertedBy);
    return this.http.post<UserReportAccess>(`${this.Baseurl+"DeleteUserFromCapacityHierarchy"}`,params);
  }
  public CapacityHierarchyFilters(){
    let params = new HttpParams();
    return this.http.post<CHFilter>(`${this.Baseurl+"CapacityHierarchyFilters"}`,params);
  }
  public AddingCapacityHierarchy(Region : string,Level : string,Leader : string,Manager : string,ProjectLevel : string,PLevel : string,WorkShedule : string,WorkingDays : string,Monday : string,Tuesday : string,Wednesday : number,Thursday : number,Friday : number,InsertedBy : string,TargetedUtilization : number){
    let params = new HttpParams();
    params = params.append('Region',Region);
    params = params.append('Level',Level);
    params = params.append('Leader',Leader);
    params = params.append('Manager',Manager);
    params = params.append('ProjectLevel',ProjectLevel);
    params = params.append('PLevel',PLevel);
    params = params.append('WorkShedule',WorkShedule);
    params = params.append('WorkingDays',WorkingDays);
    params = params.append('Monday',Monday+"");
    params = params.append('Tuesday',Tuesday+"");
    params = params.append('Wednesday',Wednesday+"");
    params = params.append('Thursday',Thursday+"");
    params = params.append('Friday',Friday+"");
    params = params.append('InsertedBy',InsertedBy);
    params = params.append('TargetedUtilization',TargetedUtilization+"");
    return this.http.post<Responce>(`${this.Baseurl+"AddingCapacityHierarchy"}`,params);
  }
  public UpdateCapacityHierarchy(HID : number,Region : string,Level : string,Leader : string,Manager : string,ProjectLevel : string,PLevel : string,WorkShedule : string,WorkingDays : string,Monday : string,Tuesday : string,Wednesday : number,Thursday : number,Friday : number,InsertedBy : string,TargetedUtilization : number){
    let params = new HttpParams();
    params = params.append('HID',HID+"")
    params = params.append('Region',Region);
    params = params.append('Level',Level);
    params = params.append('Leader',Leader);
    params = params.append('Manager',Manager);
    params = params.append('ProjectLevel',ProjectLevel);
    params = params.append('PLevel',PLevel);
    params = params.append('WorkShedule',WorkShedule);
    params = params.append('WorkingDays',WorkingDays);
    params = params.append('Monday',Monday+"");
    params = params.append('Tuesday',Tuesday+"");
    params = params.append('Wednesday',Wednesday+"");
    params = params.append('Thursday',Thursday+"");
    params = params.append('Friday',Friday+"");
    params = params.append('InsertedBy',InsertedBy);
    params = params.append('TargetedUtilization',TargetedUtilization+"");
    return this.http.post<Responce>(`${this.Baseurl+"UpdateCapacityHierarchy"}`,params);
  }
  public UpdateHierarchyComment(HID : number,Comments : string){
    let params = new HttpParams();
    params = params.append('HID',HID+"")
    params = params.append('Comments',Comments);
    return this.http.post<Responce>(`${this.Baseurl+"UpdateHierarchyComment"}`,params);
  }
  public GetProspect(){
    let params = new HttpParams();
    // params = params.append('iMeet_Milestone___Project_Status', iMeet_Milestone___Project_Status+"");
    return this.http.post<Responce>(`${this.Baseurl+"GetProspect"}`,params);
  }
  public ListofLeadersManagers(){
    let params = new HttpParams();
    // params = params.append('iMeet_Milestone___Project_Status', iMeet_Milestone___Project_Status+"");
    return this.http.post<AutomatedCLRFilters>(`${this.Baseurl+"ListofLeadersManagers"}`,params);
  }
  public AutomatedCLRData(){
    let params = new HttpParams();
    // params = params.append('iMeet_Milestone___Project_Status', iMeet_Milestone___Project_Status+"");
    return this.http.post<AutomatedCLRResponse>(`${this.Baseurl+"AutomatedCLRData"}`,params);
  }
  public GetCLRManualData(GoLiveYear : string,Status : string){
    let params = new HttpParams();
    params = params.append('GoLiveYear',GoLiveYear);
    params = params.append('Status',Status);
    // let headers =  new HttpHeaders();
    // console.log(params.has.length)
    // headers = headers.set('Content-length', params.has.length+"").append('Content-length', params.has.length+"");
    // params = params.append('iMeet_Milestone___Project_Status', iMeet_Milestone___Project_Status+"");
    return this.http.post<ManualCLRDataResponse>(`${this.Baseurl+"GetCLRManualData"}`,params);
  }
  public AutomatedCLRFilters(){
    let params = new HttpParams();
    // params = params.append('iMeet_Milestone___Project_Status', iMeet_Milestone___Project_Status+"");
    return this.http.post<AutomatedCLRFilters>(`${this.Baseurl+"AutomatedCLRFilters"}`,params);
  }
  public AutomatedCLRExport(){
    let params = new HttpParams();
    // params = params.append('iMeet_Milestone___Project_Status', iMeet_Milestone___Project_Status+"");
    return this.http.post<ManualCLRDataResponse>(`${this.Baseurl+"AutomatedCLRExport"}`,params);
  }
  public CRMExport(){
    let params = new HttpParams();
    return this.http.post<CRMResponse>(`${this.Baseurl+"CRMExport"}`,params);
  }
  public PSDExport(){
    let params = new HttpParams();
    return this.http.post<PSDResponse>(`${this.Baseurl+"PSDExport"}`,params);
  }
  public InsertManualColumns(Revenue_ID : number,Client : string,iMeet_Workspace_Title : string,Date_added_to_the_CLR : string,Implementation_Type : string,
    CLR_Country : string,
    Pipeline_status : string,
    Pipeline_comments : string,
    Service_configuration : string,
    OBT_Reseller___Direct : string,
    Servicing_location : string,
    Assignment_date : string,
    New_Business_volume__US__ : number,
    RevenueID : number,
    Implementation_Fee__PSD_ : string,
    EMEA_Country_to_charge : string,
    EMEA_Client : string,
    EMEA_OBT_standard_fee : string,
    EMEA_Included_for_accrual : string,
    EMEA_Accrual_date : string,
    EMEA_Scope_description : string,
    EMEA_Billing_notes : string,
    Manual_Entry__Wave_2__Wave_3__etc_ : string,
    Project_Effort : string,
    Priority : number,
    Resource_Status : string,
    Global_Project_Manager_replacement : string,
    Regional_Project_Manager_replacement : string,
    Milestone__Assignee__Full_Name_replacement : string,
    Global_CIS_OBT_Lead_replacement : string,
    Global_CIS_HR_Feed_Specialist_replacement : string,
    Global_CIS_Portrait_Lead_replacement : string,
    Global_CIS_RoomIT_Integration_Lead_replacement : string,
    GoLiveDate :string,
    GlobalProjectManager : string,
    RegionalProjectManager : string,
    AssigneeFullName : string,){
    let params = new HttpParams();
    params = params.append('Revenue_ID',Revenue_ID+"");
    params = params.append('Client',Client);
    params = params.append('iMeet_Workspace_Title',iMeet_Workspace_Title);
    params = params.append('Date_added_to_the_CLR',Date_added_to_the_CLR);
    params = params.append('Implementation_Type',Implementation_Type);
    params = params.append('CLR_Country',CLR_Country);
    params = params.append('Pipeline_status',Pipeline_status);
    params = params.append('Pipeline_comments',Pipeline_comments);
    params = params.append('Service_configuration',Service_configuration+"");
    params = params.append('OBT_Reseller___Direct',OBT_Reseller___Direct+"");
    params = params.append('Servicing_location',Servicing_location+"");
    params = params.append('Assignment_date',Assignment_date+"");
    params = params.append('New_Business_volume__US__',New_Business_volume__US__+"");
    params = params.append('RevenueID',RevenueID+"");
    params = params.append('Implementation_Fee__PSD_',Implementation_Fee__PSD_+"");
    params = params.append('EMEA_Country_to_charge',EMEA_Country_to_charge+"");
    params = params.append('EMEA_Client',EMEA_Client+"");
    params = params.append('EMEA_OBT_standard_fee',EMEA_OBT_standard_fee+"");
    params = params.append('EMEA_Included_for_accrual',EMEA_Included_for_accrual+"");
    params = params.append('EMEA_Accrual_date',EMEA_Accrual_date+"");
    params = params.append('EMEA_Scope_description',EMEA_Scope_description+"");
    params = params.append('EMEA_Billing_notes',EMEA_Billing_notes+"");
    params = params.append('Manual_Entry__Wave_2__Wave_3__etc_',Manual_Entry__Wave_2__Wave_3__etc_+"");
    params = params.append('Project_Effort',Project_Effort+"");
    params = params.append('Priority',Priority+"");
    params = params.append('Resource_Status',Resource_Status+"");
    params = params.append('Global_Project_Manager_replacement',Global_Project_Manager_replacement+"");
    params = params.append('Regional_Project_Manager_replacement',Regional_Project_Manager_replacement+"");
    params = params.append('Milestone__Assignee__Full_Name_replacement',Milestone__Assignee__Full_Name_replacement+"");
    params = params.append('Global_CIS_OBT_Lead_replacement',Global_CIS_OBT_Lead_replacement+"");
    params = params.append('Global_CIS_HR_Feed_Specialist_replacement',Global_CIS_HR_Feed_Specialist_replacement+"");
    params = params.append('Global_CIS_Portrait_Lead_replacement',Global_CIS_Portrait_Lead_replacement+"");
    params = params.append('Global_CIS_RoomIT_Integration_Lead_replacement',Global_CIS_RoomIT_Integration_Lead_replacement+"");
    params = params.append('GoLiveDate',GoLiveDate+"");
    params = params.append('GlobalProjectManager',GlobalProjectManager+"");
    params = params.append('RegionalProjectManager',RegionalProjectManager+"");
    params = params.append('AssigneeFullName',AssigneeFullName+"");
    return this.http.post<Responce>(`${this.Baseurl+"InsertManualColumns"}`,params);
  }
  public UpdateManualColumns(ManualID : number,
    Revenue_ID : number,
    Priority : string,
    Implementation_Type : string,
    Pipeline_status : string,
    Pipeline_comments : string,
    TXResourcing : string,
    // Service_configuration : string,
    ExpectedDecisionDate : string,
    Assignment_date : string,
    ResourseRequestedDate : string,
    RevenueID : number,
    Project_Effort : string,
    Status : string,
    UpdateBy : string
    ){
    let params = new HttpParams();
    params = params.append('ManualID',ManualID+"");
    params = params.append('Revenue_ID',Revenue_ID+"");
    params = params.append('Priority',Priority);
    params = params.append('Implementation_Type',Implementation_Type);
    params = params.append('Pipeline_status',Pipeline_status);
    params = params.append('Pipeline_comments',Pipeline_comments);
    params = params.append('TXResourcing',TXResourcing);
    // params = params.append('Service_configuration',Service_configuration+"");
    params = params.append('ExpectedDecisionDate',ExpectedDecisionDate+"");
    params = params.append('Assignment_date',Assignment_date+"");
    params = params.append('ResourseRequestedDate',ResourseRequestedDate+"");
    params = params.append('RevenueID',RevenueID+"");
    params = params.append('Project_Effort',Project_Effort+"");
    params = params.append('Status',Status+"");
    params = params.append('UpdateBy',UpdateBy+"");
    return this.http.post<Responce>(`${this.Baseurl+"UpdateManualColumns"}`,params);
  }
  public UpdateDigitalColumns(CLRID : string,DTID : string,RevenueID : string,GlobalCISOBTLead : string,RegionalCISOBTLead : string,LocalDigitalOBTLead : string,GlobalCISPortraitLead : string,RegionalCISPortraitLead : string,GlobalCISHRFeedSpecialist : string,ActivityType : string,ComplexityScore : string,GlobalCISDQSLead : string,UpdatedBy : string){
    let params = new HttpParams();
    params = params.append('CLRID',CLRID);
    params = params.append('DTID',DTID);
    // params = params.append('Implementation_Type',Implementation_Type);
    params = params.append('RevenueID',RevenueID);
    params = params.append('GlobalCISOBTLead',GlobalCISOBTLead);
    params = params.append('RegionalCISOBTLead',RegionalCISOBTLead);
    params = params.append('LocalDigitalOBTLead',LocalDigitalOBTLead);
    params = params.append('GlobalCISPortraitLead',GlobalCISPortraitLead);
    params = params.append('RegionalCISPortraitLead',RegionalCISPortraitLead);
    params = params.append('GlobalCISHRFeedSpecialist',GlobalCISHRFeedSpecialist);
    params = params.append('ActivityType',ActivityType);
    // params = params.append('GDS',GDS);
    params = params.append('ComplexityScore',ComplexityScore);
    params = params.append('GlobalCISDQSLead',GlobalCISDQSLead);
    params = params.append('UpdatedBy',UpdatedBy);
    return this.http.post<Responce>(`${this.Baseurl+"UpdateDigitalColumns"}`,params);
  }
  public UpdateManualPipelineColumns(ManualID : number,Revenue_ID : number,
    Priority : string,
    //Client : string,
    //iMeet_Workspace_Title : string,
    //Date_added_to_the_CLR : string,
    Implementation_Type : string,
    //CLR_Country : string,
    Pipeline_status : string,
    Pipeline_comments : string,
    TXResourcing : string,
    // Service_configuration : string,
    // OBT_Reseller___Direct : string,
    //Servicing_location : string,
    ExpectedDecisionDate : string,
    Assignment_date : string,
    ResourseRequestedDate : string,
    //New_Business_volume__US__ : number,
    RevenueID : number,
    //Implementation_Fee__PSD_ : string,
    // EMEA_Country_to_charge : string,
    // EMEA_Client : string,
    // EMEA_OBT_standard_fee : string,
    // EMEA_Included_for_accrual : string,
    // EMEA_Accrual_date : string,
    // EMEA_Scope_description : string,
    // EMEA_Billing_notes : string,
    // Manual_Entry__Wave_2__Wave_3__etc_ : string,
    Project_Effort : string,
    // Priority : number,
    // Resource_Status : string,
    // Global_Project_Manager_replacement : string,
    // Regional_Project_Manager_replacement : string,
    // Milestone__Assignee__Full_Name_replacement : string,
    // Global_CIS_OBT_Lead_replacement : string,
    // Global_CIS_HR_Feed_Specialist_replacement : string,
    // Global_CIS_Portrait_Lead_replacement : string,
    // Global_CIS_RoomIT_Integration_Lead_replacement : string,
    // ProjectStatus : string,
    GoLiveDate : string,
    ProjectLevel : string,
    GlobalProjectManager : string,
    RegionalProjectManager : string,
    AssigneeFullName : string,
    // GlobalCISDQSLead : string,
    Status : string,
    UpdateBy : string){
    let params = new HttpParams();
    params = params.append('ManualID',ManualID+"");
    params = params.append('Revenue_ID',Revenue_ID+"");
    params = params.append('Priority',Priority);
    params = params.append('Implementation_Type',Implementation_Type);
    params = params.append('Pipeline_status',Pipeline_status);
    params = params.append('Pipeline_comments',Pipeline_comments);
    params = params.append('TXResourcing',TXResourcing);
    // params = params.append('Service_configuration',Service_configuration+"");
    params = params.append('ExpectedDecisionDate',ExpectedDecisionDate+"");
    params = params.append('Assignment_date',Assignment_date+"");
    params = params.append('ResourseRequestedDate',ResourseRequestedDate+"");
    params = params.append('RevenueID',RevenueID+"");
    params = params.append('Project_Effort',Project_Effort+"");
    params = params.append('GoLiveDate',GoLiveDate+"");
    params = params.append('ProjectLevel',ProjectLevel+"");
    params = params.append('GlobalProjectManager',GlobalProjectManager+"");
    params = params.append('RegionalProjectManager',RegionalProjectManager+"");
    params = params.append('AssigneeFullName',AssigneeFullName+"");
    // params = params.append('GlobalCISDQSLead',GlobalCISDQSLead+"");
    params = params.append('Status',Status+"");
    params = params.append('UpdateBy',UpdateBy+"");
    return this.http.post<Responce>(`${this.Baseurl+"UpdateManualPipelineColumns"}`,params);
  }
  public GetRevenueId(){
    let params = new HttpParams();
    return this.http.post<HierarchyFilter>(`${this.Baseurl+"GetRevenueId"}`,params);
  }
  public GetManualdataUsingRevID(Revenue_ID : number){
    let params = new HttpParams();
    params = params.append('Revenue_ID',Revenue_ID+"");
    return this.http.post<ManualCLRDataResponse>(`${this.Baseurl+"GetManualdataUsingRevID"}`,params);
  }
  public ReplicatingManualData(Revenue_IDs : string,
    Revenue_ID : string,
    Priority : string,
    Implementation_Type : string,
    Pipeline_status : string,
    Pipeline_comments : string,
    TXResourcing : string,
    // Service_configuration : string,
    ExpectedDecisionDate : string,
    Assignment_date : string,
    ResourceRequest_date : string,
    RevenueID : string,
    Project_Effort : number,
    Status : string,
    ProjectLevel : string,
    GoLiveDate : string,
    GlobalProjectManager : string,
    RegionalProjectManager : string,
    AssigneeFullName : string,
    Priority_check : boolean,
    Implementation_Type_check : boolean,
    Pipeline_status_check : boolean,
    Pipeline_comments_check : boolean,
    TXResourcing_check : boolean,
    // Service_configuration_check : boolean,
    // OBT_Reseller___Direct_check : boolean,
    ExpectedDecision_date_check : boolean,
    Assignment_date_check : boolean,
    ResourceRequest_date_check : boolean,
    Project_Effort_check : boolean,
    Status_check : boolean,
    ProjectLevel_check : boolean,
    GoLiveDate_check : boolean,
    GlobalProjectManager_check : boolean,
    RegionalProjectManager_check : boolean,
    AssigneeFullName_check : boolean,
    // GDS : string,
    ComplexityScore : string,
    ActivityType : string,
    GlobalCISOBTLead : string,
    RegionalCISOBTLead : string,
    LocalDigitalOBTLead : string,
    GlobalCISPortraitLead : string,
    RegionalCISPortraitLead : string,
    GlobalCISHRFeedSpecialist : string,
    // GDS_check  : boolean,
    ComplexityScore_check : boolean,
    ActivityType_check  : boolean,
    GlobalCISOBTLead_check  : boolean,
    RegionalCISOBTLead_check  : boolean,
    LocalDigitalOBTLead_check  : boolean,
    GlobalCISPortraitLead_check  : boolean,
    RegionalCISPortraitLead_check  : boolean,
    GlobalCISHRFeedSpecialist_check  : boolean,
    UpdateBy : string
    ){
    let params = new HttpParams();
    params = params.append('Revenue_IDs',Revenue_IDs+"");
    params = params.append('Revenue_ID',Revenue_ID+"");
    params = params.append('Priority',Priority);
    params = params.append('Implementation_Type',Implementation_Type);
    params = params.append('Pipeline_status',Pipeline_status);
    params = params.append('Pipeline_comments',Pipeline_comments);
    params = params.append('TXResourcing',TXResourcing);
    // params = params.append('Service_configuration',Service_configuration+"");
    params = params.append('ExpectedDecisionDate',ExpectedDecisionDate+"");
    params = params.append('Assignment_date',Assignment_date+"");
    params = params.append('ResourceRequest_date',ResourceRequest_date+"");
    params = params.append('RevenueID',RevenueID+"");
    params = params.append('Project_Effort',Project_Effort+"");
    params = params.append('Status',Status+"");
    params = params.append('ProjectLevel',ProjectLevel+"");
    params = params.append('GoLiveDate',GoLiveDate+"");
    params = params.append('GlobalProjectManager',GlobalProjectManager+"");
    params = params.append('RegionalProjectManager',RegionalProjectManager+"");
    params = params.append('AssigneeFullName',AssigneeFullName+"");
    params = params.append('Priority_check',Priority_check+"");
    params = params.append('Implementation_Type_check',Implementation_Type_check+"");
    params = params.append('Pipeline_status_check',Pipeline_status_check+"");
    params = params.append('Pipeline_comments_check',Pipeline_comments_check+"");
    params = params.append('TXResourcing_check',TXResourcing_check+"");
    // params = params.append('Service_configuration_check',Service_configuration_check+"");
    params = params.append('ExpectedDecision_date_check',ExpectedDecision_date_check+"");
    params = params.append('Assignment_date_check',Assignment_date_check+"");
    params = params.append('ResourceRequest_date_check',ResourceRequest_date_check+"");
    params = params.append('Project_Effort_check',Project_Effort_check+"");
    params = params.append('Status_check',Status_check+"");
    params = params.append('ProjectLevel_check',ProjectLevel_check+"");
    params = params.append('GoLiveDate_check',GoLiveDate_check+"");
    params = params.append('GlobalProjectManager_check',GlobalProjectManager_check+"");
    params = params.append('RegionalProjectManager_check',RegionalProjectManager_check+"");
    params = params.append('AssigneeFullName_check',AssigneeFullName_check+"");
    // params = params.append('GDS',GDS+"");
    params = params.append('ComplexityScore',ComplexityScore+"");
    params = params.append('ActivityType',ActivityType+"");
    params = params.append('GlobalCISOBTLead',GlobalCISOBTLead+"");
    params = params.append('RegionalCISOBTLead',RegionalCISOBTLead+"");
    params = params.append('LocalDigitalOBTLead',LocalDigitalOBTLead+"");
    params = params.append('GlobalCISPortraitLead',GlobalCISPortraitLead+"");
    params = params.append('RegionalCISPortraitLead',RegionalCISPortraitLead+"");
    params = params.append('GlobalCISHRFeedSpecialist',GlobalCISHRFeedSpecialist+"");
    // params = params.append('GDS_check',GDS_check+"");
    params = params.append('ComplexityScore_check',ComplexityScore_check+"");
    params = params.append('ActivityType_check',ActivityType_check+"");
    params = params.append('GlobalCISOBTLead_check',GlobalCISOBTLead_check+"");
    params = params.append('RegionalCISOBTLead_check',RegionalCISOBTLead_check+"");
    params = params.append('LocalDigitalOBTLead_check',LocalDigitalOBTLead_check+"");
    params = params.append('GlobalCISPortraitLead_check',GlobalCISPortraitLead_check+"");
    params = params.append('RegionalCISPortraitLead_check',RegionalCISPortraitLead_check+"");
    params = params.append('GlobalCISHRFeedSpecialist_check',GlobalCISHRFeedSpecialist_check+"");
    params = params.append('UpdateBy',UpdateBy+"");
    return this.http.post<Responce>(`${this.Baseurl+"ReplicatingManualData"}`,params);
  }
  public UserRegistration(UID : string,FirstName : string,LastName : string,Email : string,Manager : string,Password : string,JobType : string){
    let params = new HttpParams();
    params = params.append('UID',UID);
    params = params.append('FirstName',FirstName);
    params = params.append('LastName',LastName);
    params = params.append('Manager',Manager);
    params = params.append('Email',Email);
    params = params.append('Password',Password);
    params = params.append('JobType',JobType);
    return this.http.post<Responce>(`${this.Baseurl+"UserRegistration"}`,params);
  }
  public UserLogin(UID : string,Email : string,Password : string){
    let params = new HttpParams();
    params = params.append('UID',UID);
    params = params.append('Email',Email);
    params = params.append('Password',Password);
    return this.http.post<UserDetails>(`${this.Baseurl+"UserLogin"}`,params);
  }
  public SendPasswordToUser(UID : string,Email : string){
    let params = new HttpParams();
    params = params.append('UID',UID);
    params = params.append('Email',Email);
    return this.http.post<Responce>(`${this.Baseurl+"SendPasswordToUser"}`,params);
  }
  public UserDetails(UID : string){
    let params = new HttpParams();
    params = params.append('UID',UID);
    return this.http.post<UserDetails>(`${this.Baseurl+"UserDetails"}`,params);
  }
  public RequestAccessTicket(UID : string,ReportName : string,TicketStatuts : string){
    let params = new HttpParams();
    params = params.append('UID',UID);
    params = params.append('ReportName',ReportName);
    params = params.append('TicketStatuts',TicketStatuts);
    return this.http.post<UserDetails>(`${this.Baseurl+"RequestAccessTicket"}`,params);
  }
  public UsersUsageofReports(UID : string,ReportName : string,TypeofUse : string){
    let params = new HttpParams();
    params = params.append('UID',UID);
    params = params.append('ReportName',ReportName);
    params = params.append('TypeofUse',TypeofUse);
    return this.http.post<UserDetails>(`${this.Baseurl+"UsersUsageofReports"}`,params);
  }
  public UpdateDetails(UID : string,FirstName : string,LastName : string,Email : string,Manager : string,Password : string,JobType : string){
    let params = new HttpParams();
    params = params.append('UID',UID);
    params = params.append('FirstName',FirstName);
    params = params.append('LastName',LastName);
    params = params.append('Manager',Manager);
    params = params.append('Email',Email);
    params = params.append('Password',Password);
    params = params.append('JobType',JobType);
    return this.http.post<Responce>(`${this.Baseurl+"UpdateDetails"}`,params);
  }
  public UsersUsageTracking(){
    let params = new HttpParams();
    return this.http.post<UsersUsageofReports>(`${this.Baseurl+"UsersUsageTracking"}`,params);
  }
  public TestingSortPagination(){
    let params = new HttpParams();
    return this.http.post<Responce>(`${this.Baseurl+"TestingSortPagination"}`,params);
  }
  public UserAccessDetailsForAdmin(UID : string){
    let params = new HttpParams();
    params = params.append('UID',UID);
    return this.http.post<UserReportAccess>(`${this.Baseurl+"UserAccessDetailsForAdmin"}`,params);
  }
  public GrantAccess(UID : string,TicketID : string,TicketStatuts : string,ReportName : string,AcceptedBy : string){
    let params = new HttpParams();
    params = params.append('UID',UID);
    params = params.append('TicketID',TicketID);
    params = params.append('TicketStatuts',TicketStatuts);
    params = params.append('ReportName',ReportName);
    params = params.append('AcceptedBy',AcceptedBy);
    return this.http.post<UserReportAccess>(`${this.Baseurl+"GrantAccess"}`,params);
  }
  public DeleteUser(UID : string,UpdatedBy : string){
    let params = new HttpParams();
    params = params.append('UID',UID);
    params = params.append('UpdatedBy',UpdatedBy);
    return this.http.post<UserReportAccess>(`${this.Baseurl+"DeleteUser"}`,params);
  }
  public RequestAccessNotifications(UID : string){
    let params = new HttpParams();
    params = params.append('UID',UID);
    return this.http.post<UserReportAccess>(`${this.Baseurl+"RequestAccessNotifications"}`,params);
  }
  public UpdatingAccessDetails(UID : string,IMPS:string,CTO : string,StageGate : string,LessonsLearnt : string,AutomatedCLR : string,CLREdits : string,MarketReport : string,MarketCommentsEdit: string,ELTReport : string,UserAccessStatus : string,UpdatedBy : string,CycleTime : string,CapacityTracker : string,ResourceUtilization : string,C_Hierarchy : string,C_HierarchyEdits : string,NPS : string,
    NPSAdmin : string,NPSClientInfo : string,NPSEdit : string,SteeringCommittee : string,SteeringCommitteeEdits : string,DDO : string,DDOHome : string,PriorityReport : string,DigitalReport : string,PerformanceAnalysis : string,){
    let params = new HttpParams();
    params = params.append('UID',UID);
    params = params.append('IMPS',IMPS);
    params = params.append('CTO',CTO);
    params = params.append('StageGate',StageGate);
    params = params.append('LessonsLearnt',LessonsLearnt);
    params = params.append('AutomatedCLR',AutomatedCLR);
    params = params.append('CLREdits',CLREdits);
    params = params.append('MarketReport',MarketReport);
    params = params.append('MarketCommentsEdit',MarketCommentsEdit);
    params = params.append('ELTReport',ELTReport);
    params = params.append('CycleTime',CycleTime);
    params = params.append('CapacityTracker',CapacityTracker);
    params = params.append('ResourceUtilization',ResourceUtilization);
    params = params.append('C_Hierarchy',C_Hierarchy);
    params = params.append('C_HierarchyEdits',C_HierarchyEdits);
    params = params.append('NPS',NPS);
    params = params.append('NPSAdmin',NPSAdmin);
    params = params.append('NPSClientInfo',NPSClientInfo);
    params = params.append('NPSEdit',NPSEdit);
    params = params.append('SteeringCommittee',SteeringCommittee);
    params = params.append('SteeringCommitteeEdits',SteeringCommitteeEdits);
    params = params.append('DDO',DDO);
    params = params.append('DDOHome',DDOHome);
    params = params.append('PriorityReport',PriorityReport);
    params = params.append('DigitalReport',DigitalReport);
    params = params.append('PerformanceAnalysis',PerformanceAnalysis);
    params = params.append('UserAccessStatus',UserAccessStatus);
    params = params.append('UpdatedBy',UpdatedBy);
    return this.http.post<UserReportAccess>(`${this.Baseurl+"UpdatingAccessDetails"}`,params);
  }
  // public
  // Start of Ad-hoc Api's
  public AdhocInsert(RevenueID : string,Client : string,StartDate : string,GoLiveDate : string,Country : string,Region : string,Comments : string,ProjectStatus : string,GlobalDQSLead : string,GlobalCISOBTLead : string,RegionalCISOBTLead : string,LocalDigitalOBTLead : string,GlobalCISPortraitLead : string,RegionalCISPortraitLead : string,GlobalCISHRFeedSpecialist : string,GDS : string,ComplexityScore : string,ActivityType : string,Status : string,Priority : string,Pipeline_Comments : string,InsertedBy : string){
    let params = new HttpParams();
    params = params.append('RevenueID',RevenueID);
    params = params.append('Client',Client);
    params = params.append('StartDate',StartDate);
    params = params.append('GoLiveDate',GoLiveDate);
    params = params.append('Country',Country);
    params = params.append('Region',Region);
    params = params.append('Comments',Comments);
    params = params.append('ProjectStatus',ProjectStatus);
    params = params.append('GlobalDQSLead',GlobalDQSLead);
    params = params.append('GlobalCISOBTLead',GlobalCISOBTLead);
    params = params.append('RegionalCISOBTLead',RegionalCISOBTLead);
    params = params.append('LocalDigitalOBTLead',LocalDigitalOBTLead);
    params = params.append('GlobalCISPortraitLead',GlobalCISPortraitLead);
    params = params.append('RegionalCISPortraitLead',RegionalCISPortraitLead);
    params = params.append('GlobalCISHRFeedSpecialist',GlobalCISHRFeedSpecialist);
    params = params.append('GDS',GDS);
    params = params.append('ComplexityScore',ComplexityScore);
    params = params.append('ActivityType',ActivityType);
    params = params.append('Status',Status);
    params = params.append('Priority',Priority);
    params = params.append('Pipeline_Comments',Pipeline_Comments);
    params = params.append('InsertedBy',InsertedBy);
    return this.http.post<Responce>(`${this.Baseurl+"AdhocInsert"}`,params);
  }
  public AdhocUpdate(RevenueID : string,Client : string,StartDate : string,GoLiveDate : string,Country : string,Region : string,Comments : string,ProjectStatus : string,GlobalDQSLead : string,GlobalCISOBTLead : string,RegionalCISOBTLead : string,LocalDigitalOBTLead : string,GlobalCISPortraitLead : string,RegionalCISPortraitLead : string,GlobalCISHRFeedSpecialist : string,GDS : string,ComplexityScore : string,ActivityType : string,Status : string,Priority : string,Pipeline_Comments : string,UpdatedBy : string){
    let params = new HttpParams();
    params = params.append('RevenueID',RevenueID);
    params = params.append('Client',Client);
    params = params.append('StartDate',StartDate);
    params = params.append('GoLiveDate',GoLiveDate);
    params = params.append('Country',Country);
    params = params.append('Region',Region);
    params = params.append('Comments',Comments);
    params = params.append('ProjectStatus',ProjectStatus);
    params = params.append('GlobalDQSLead',GlobalDQSLead);
    params = params.append('GlobalCISOBTLead',GlobalCISOBTLead);
    params = params.append('RegionalCISOBTLead',RegionalCISOBTLead);
    params = params.append('LocalDigitalOBTLead',LocalDigitalOBTLead);
    params = params.append('GlobalCISPortraitLead',GlobalCISPortraitLead);
    params = params.append('RegionalCISPortraitLead',RegionalCISPortraitLead);
    params = params.append('GlobalCISHRFeedSpecialist',GlobalCISHRFeedSpecialist);
    params = params.append('GDS',GDS);
    params = params.append('ComplexityScore',ComplexityScore);
    params = params.append('ActivityType',ActivityType);
    params = params.append('Status',Status);
    params = params.append('Priority',Priority);
    params = params.append('Pipeline_Comments',Pipeline_Comments);
    params = params.append('UpdatedBy',UpdatedBy);
    return this.http.post<Responce>(`${this.Baseurl+"AdhocUpdate"}`,params);
  }
  public AdhocDelete(RevenueID : string,UpdatedBy : string){
    let params = new HttpParams();
    params = params.append('RevenueID',RevenueID);
    params = params.append('UpdatedBy',UpdatedBy);
    return this.http.post<Responce>(`${this.Baseurl+"AdhocDelete"}`,params);
  }
  public AdhocMaxRevenueID(){
    let params = new HttpParams();
    return this.http.post<Responce>(`${this.Baseurl+"AdhocMaxRevenueID"}`,params);
  }
  public GenerateTracker(){
    let params = new HttpParams();
    return this.http.post<Responce>(`${this.Baseurl+"GenerateTracker"}`,params);
  }
  public ConfigData(){
    let params = new HttpParams();
    return this.http.post<Responce>(`${this.Baseurl+"ConfigData"}`,params);
  }
  public ConfigInsert(ProjectType : string,Duration : string,Status : string,InsertedBy : string){
    let params = new HttpParams();
    params = params.append('ProjectType',ProjectType);
    params = params.append('Duration',Duration);
    params = params.append('Status',Status);
    params = params.append('InsertedBy',InsertedBy);
    return this.http.post<Responce>(`${this.Baseurl+"ConfigInsert"}`,params);
  }
  public ConfigUpdate(ConfigID : string,ProjectType : string,Duration : string,Status : string,UpdatedBy : string){
    let params = new HttpParams();
    params = params.append('ConfigID',ConfigID);
    params = params.append('ProjectType',ProjectType);
    params = params.append('Duration',Duration);
    params = params.append('Status',Status);
    params = params.append('UpdatedBy',UpdatedBy);
    return this.http.post<Responce>(`${this.Baseurl+"ConfigUpdate"}`,params);
  }
  public ConfigDelete(ConfigID : string,UpdatedBy : string){
    let params = new HttpParams();
    params = params.append('ConfigID',ConfigID);
    params = params.append('UpdatedBy',UpdatedBy);
    return this.http.post<Responce>(`${this.Baseurl+"ConfigDelete"}`,params);
  }
  public GetAuditLog(){
    let params = new HttpParams();
    return this.http.post<Responce>(`${this.Baseurl+"GetAuditLog"}`,params);
  }
  public GetRecordLevelAuditLog(RevenueID : string){
    let params = new HttpParams();
    params = params.append('RevenueID',RevenueID);
    return this.http.post<Responce>(`${this.Baseurl+"GetRecordLevelAuditLog"}`,params);
  }
  public ProjectTeamPerformanceFilters(){
    let params = new HttpParams();
    return this.http.post<AutomatedCLRFilters>(`${this.Baseurl+"ProjectTeamPerformanceFilters"}`,params);
  }
  public GetProjectTeamPerformance(Quarter : string,Region : string,GlobalProjectManager : string,ProjectLevel : string,GoLiveYear : string){
    let params = new HttpParams();
    params = params.append('Quarter',Quarter);
    params = params.append('Region',Region);
    params = params.append('GlobalProjectManager',GlobalProjectManager);
    params = params.append('ProjectLevel',ProjectLevel);
    params = params.append('GoLiveYear',GoLiveYear);
    return this.http.post<PerformanceResponce>(`${this.Baseurl+"GetProjectTeamPerformance"}`,params);
  }
  public GetDigitalTeamPerformance(Quarter : string,Region : string,GlobalProjectManager : string,ProjectLevel : string,GoLiveYear : string){
    let params = new HttpParams();
    params = params.append('Quarter',Quarter);
    params = params.append('Region',Region);
    params = params.append('GlobalProjectManager',GlobalProjectManager);
    params = params.append('ProjectLevel',ProjectLevel);
    params = params.append('GoLiveYear',GoLiveYear);
    return this.http.post<PerformanceResponce>(`${this.Baseurl+"GetDigitalTeamPerformance"}`,params);
  }
  public P_ManagerWisePerformanceData(Quarter : string,GlobalProjectManager : string,GoLiveYear : string){
    let params = new HttpParams();
    params = params.append('Quarter',Quarter);
    params = params.append('GlobalProjectManager',GlobalProjectManager);
    params = params.append('GoLiveYear',GoLiveYear);
    return this.http.post<PerformanceResponce>(`${this.Baseurl+"P_ManagerWisePerformanceData"}`,params);
  }
  public D_ManagerWisePerformanceData(Quarter : string,GlobalProjectManager : string,GoLiveYear : string){
    let params = new HttpParams();
    params = params.append('Quarter',Quarter);
    params = params.append('GlobalProjectManager',GlobalProjectManager);
    params = params.append('GoLiveYear',GoLiveYear);
    return this.http.post<PerformanceResponce>(`${this.Baseurl+"D_ManagerWisePerformanceData"}`,params);
  }
  public ResourceAssignmentFilters(){
    let params = new HttpParams();
    return this.http.post<AutomatedCLRFilters>(`${this.Baseurl+"ResourceAssignmentFilters"}`,params);
  }
  public ResourceAssignmentData(ProjectStatus : string,ProjectLevel : string){
    let params = new HttpParams();
    // params = params.append('Status',Status);
    params = params.append('ProjectStatus',ProjectStatus);
    params = params.append('ProjectLevel',ProjectLevel);
    // params = params.append('CountryStatus',CountryStatus);
    return this.http.post<PerformanceResponce>(`${this.Baseurl+"ResourceAssignmentData"}`,params);
  }
  //End of Ad-hoc APi's
  public PrioritizationFilters(){
    let params = new HttpParams();
    return this.http.post<AutomatedCLRFilters>(`${this.Baseurl+"PrioritizationFilters"}`,params);
  }
  public PrioritizationData(YearMonth : string,Region : string,CountryasLineWin : string,OwnerShip : string){
    let params = new HttpParams();
    params = params.append('YearMonth',YearMonth);
    params = params.append('Region',Region);
    params = params.append('Country',CountryasLineWin);
    params = params.append('OwnerShip',OwnerShip);
    return this.http.post<PerformanceResponce>(`${this.Baseurl+"PrioritizationData"}`,params);
  }
  public TargetCycleTimeUpdate(TargetID : string,ExistingServiceConfigChange : string,NewGlobal : string,NewRegional : string,NewLocal : string,Overall : string,ExistingAddChange : string,UpdatedBy : string,Year : string,Months : string){
    let params = new HttpParams();
    params = params.append('TargetID',TargetID);
    params = params.append('ExistingServiceConfigChange',ExistingServiceConfigChange);
    params = params.append('NewGlobal',NewGlobal);
    params = params.append('NewRegional',NewRegional);
    params = params.append('NewLocal',NewLocal);
    params = params.append('Overall',Overall);
    params = params.append('ExistingAddChange',ExistingAddChange);
    params = params.append('UpdatedBy',UpdatedBy);
    params = params.append('Year',Year);
    params = params.append('Months',Months);
    return this.http.post<Responce>(`${this.Baseurl+"TargetCycleTimeUpdate"}`,params);
  }
  public TargetsCycleTimeData(){
    let params = new HttpParams();
    return this.http.post<Responce>(`${this.Baseurl+"TargetsCycleTimeData"}`,params);
  }
  public GetReportsUpdatedON(){
    let params = new HttpParams();
    return this.http.post<Responce>(`${this.Baseurl+"GetReportsUpdatedON"}`,params);
  }
  public TargetCycleTimeData(Year : string){
    let params = new HttpParams();
    params = params.append('Year',Year);
    return this.http.post<Responce>(`${this.Baseurl+"TargetCycleTimeData"}`,params);
  }
  public TargetCycleTimeInsert(ExistingServiceConfigChange : string,NewGlobal : string,NewRegional : string,NewLocal : string,Overall : string,ExistingAddChange : string,InsertedBy : string,Year : string,Months : string){
    let params = new HttpParams();
    params = params.append('ExistingServiceConfigChange',ExistingServiceConfigChange);
    params = params.append('NewGlobal',NewGlobal);
    params = params.append('NewRegional',NewRegional);
    params = params.append('NewLocal',NewLocal);
    params = params.append('Overall',Overall);
    params = params.append('ExistingAddChange',ExistingAddChange);
    params = params.append('InsertedBy',InsertedBy);
    params = params.append('Year',Year);
    params = params.append('Months',Months);
    return this.http.post<Responce>(`${this.Baseurl+"TargetCycleTimeInsert"}`,params);
  }
  public NPSData(YearMonth: string){
    let params = new HttpParams();
    params = params.append('YearMonth',YearMonth);
    return this.http.post<NPSData>(`${this.Baseurl+"NPSData"}`,params);
  }
  public NpsViewData(){
    let params = new HttpParams();
    return this.http.post<NPSData>(`${this.Baseurl+"NpsViewData"}`,params);
  }
  public NPSSendMail(NpsId :string,ClientName : string,Company : string,Email : string,Language : string,UpdatedBy : string){
    let params = new HttpParams();
    params = params.append('NpsId',NpsId);
    params = params.append('ClientName',ClientName);
    params = params.append('Company',Company);
    params = params.append('Email',Email);
    params = params.append('Language',Language);
    params = params.append('UpdatedBy',UpdatedBy)
    return this.http.post<NPSData>(`${this.Baseurl+"NPSSendMail"}`,params);
  }
  public NpsInsert(ClientName : string,Company : string,Email : string,Country : string,Region : string,RegionalProjectManager : string,GlobalProjectManager : string,LocalProjectManager : string,GoLiveDate : string,ClientType : string,CustomerContactNumber : string,Language : string,RecordStatus : string,GlobalDigitalPM : string,RegionalDigitalPM : string,LocalDigitalPM : string,InsertedBy : string){
    let params = new HttpParams();
    params = params.append('ClientName',ClientName);
    params = params.append('ClientType',ClientType);
    // params = params.append('SingleResource',SingleResource);
    params = params.append('LocalProjectManager',LocalProjectManager);
    params = params.append('Language',Language);
    params = params.append('RegionalProjectManager',RegionalProjectManager);
    params = params.append('GlobalProjectManager',GlobalProjectManager);
    params = params.append('Country',Country);
    params = params.append('Region',Region);
    params = params.append('Email',Email);
    params = params.append('CustomerContactNumber',CustomerContactNumber);
    params = params.append('Company',Company);
    params = params.append('GoLiveDate',GoLiveDate);
    params = params.append('RecordStatus',RecordStatus);
    params = params.append('GlobalDigitalPM',GlobalDigitalPM);
    params = params.append('RegionalDigitalPM',RegionalDigitalPM);
    params = params.append('LocalDigitalPM',LocalDigitalPM);
    params = params.append('InsertedBy',InsertedBy);
    return this.http.post<NPSData>(`${this.Baseurl+"NpsInsert"}`,params);
  }
  public NPSUpdate(NpsId : string,ClientName : string,Company : string,Email : string,Country : string,Region : string,RegionalProjectManager : string,GlobalProjectManager : string,LocalProjectManager : string,GoLiveDate : string,ClientType : string,CustomerContactNumber : string,Language : string,GlobalDigitalPM : string,RegionalDigitalPM : string,LocalDigitalPM : string,UpdatedBy : string){
    let params = new HttpParams();
    params = params.append('NpsId',NpsId);
    params = params.append('ClientName',ClientName);
    params = params.append('ClientType',ClientType);
    // params = params.append('SingleResource',SingleResource);
    params = params.append('LocalProjectManager',LocalProjectManager);
    params = params.append('Language',Language);
    params = params.append('RegionalProjectManager',RegionalProjectManager);
    params = params.append('GlobalProjectManager',GlobalProjectManager);
    params = params.append('Country',Country);
    params = params.append('Region',Region);
    params = params.append('Email',Email);
    params = params.append('CustomerContactNumber',CustomerContactNumber);
    params = params.append('Company',Company);
    params = params.append('GoLiveDate',GoLiveDate);
    params = params.append('GlobalDigitalPM',GlobalDigitalPM);
    params = params.append('RegionalDigitalPM',RegionalDigitalPM);
    params = params.append('LocalDigitalPM',LocalDigitalPM);
    params = params.append('UpdatedBy',UpdatedBy);
    return this.http.post<NPSData>(`${this.Baseurl+"NPSUpdate"}`,params);
  }
  public NPSDelete(NpsId : string,UpdatedBy : string){
    let params = new HttpParams();
    params = params.append('NpsId',NpsId);
    params = params.append('UpdatedBy',UpdatedBy);
    return this.http.post<UserReportAccess>(`${this.Baseurl+"NPSDelete"}`,params);
  }
  public NpsMaxRecipientId(){
    let params = new HttpParams();
    return this.http.post<Responce>(`${this.Baseurl+"NpsMaxRecipientId"}`,params);
  }
  public NPSViewUpdate(NpsId : string,ClientName : string,Company : string,Email : string,Country : string,Region : string,Language : string,RegionalProjectManager : string,GlobalProjectManager : string,LocalProjectManager : string,ClientType : string,CustomerContactNumber : string,DateServeySent : string,ClientScope : string,DateSurveyReceived : string,
    Status : string,AssignLeaderForClosedLoop : string,OpprtunityId : string,NPSScore : string,NPSIndicator : string,NPSCommentsWhatwasPositive : string,NPSComments_Howcouldwehaveimproved : string,NPSComments_Whatistheonethingwecandotomakeyouhappier : string,ClientFeedback : string,Action : string,ReasonType : string,UpdatedBy : string,NPSCommentsOne : string,NPSCommentsTwo : string,NPSCommentsThree : string,RecordStatus : string,GlobalDigitalPM : string,RegionalDigitalPM : string,LocalDigitalPM : string){
    let params = new HttpParams();
    params = params.append('NpsId',NpsId);
    params = params.append('ClientName',ClientName);
    params = params.append('ClientType',ClientType);
    // params = params.append('SingleResource',SingleResource);
    params = params.append('Language',Language);
    params = params.append('LocalProjectManager',LocalProjectManager);
    params = params.append('RegionalProjectManager',RegionalProjectManager);
    params = params.append('GlobalProjectManager',GlobalProjectManager);
    params = params.append('Country',Country);
    params = params.append('Region',Region);
    params = params.append('Email',Email);
    params = params.append('CustomerContactNumber',CustomerContactNumber);
    params = params.append('Company',Company);
    params = params.append('DateServeySent',DateServeySent);
    params = params.append('ClientScope',ClientScope);
    // params = params.append('DQS',DQS);
    // params = params.append('DSD',DSD);
    // params = params.append('OnlineTeam',OnlineTeam);
    params = params.append('DateSurveyReceived',DateSurveyReceived);
    params = params.append('Status',Status);
    params = params.append('AssignLeaderForClosedLoop',AssignLeaderForClosedLoop);
    params = params.append('NPSScore',NPSScore);
    params = params.append('OpprtunityId',OpprtunityId);
    params = params.append('NPSIndicator',NPSIndicator);
    params = params.append('NPSCommentsOne',NPSCommentsOne);
    params = params.append('NPSCommentsTwo',NPSCommentsTwo);
    params = params.append('NPSCommentsThree',NPSCommentsThree);
    params = params.append('NPSCommentsWhatwasPositive',NPSCommentsWhatwasPositive);
    params = params.append('NPSComments_Howcouldwehaveimproved',NPSComments_Howcouldwehaveimproved);
    params = params.append('NPSComments_Whatistheonethingwecandotomakeyouhappier',NPSComments_Whatistheonethingwecandotomakeyouhappier);
    params = params.append('ClientFeedback',ClientFeedback);
    params = params.append('Action',Action);
    params = params.append('ReasonType',ReasonType);
    params = params.append('GlobalDigitalPM',GlobalDigitalPM);
    params = params.append('RegionalDigitalPM',RegionalDigitalPM);
    params = params.append('LocalDigitalPM',LocalDigitalPM);
    params = params.append('UpdatedBy',UpdatedBy);
    params = params.append('RecordStatus',RecordStatus);
    return this.http.post<NPSData>(`${this.Baseurl+"NPSViewUpdate"}`,params);
  }
  public ConradData(){
    let params = new HttpParams();
    return this.http.post<Responce>(`${this.Baseurl+"ConradData"}`,params);
  }
  public DRRegionWiseYear(GoLiveYear : string,Quarter : string,ProjectStatus : string,Region : string,GlobalCISOBTLead : string){
    let params = new HttpParams();
    params = params.append('GoLiveYear',GoLiveYear);
    params = params.append('Quarter',Quarter);
    params = params.append('ProjectStatus',ProjectStatus);
    params = params.append('Region',Region);
    params = params.append('GlobalCISOBTLead',GlobalCISOBTLead);
    return this.http.post<Responce>(`${this.Baseurl+"DRRegionWiseYear"}`,params);
  }
  public DRRegionWiseGDS(GoLiveYear : string,Quarter : string,ProjectStatus : string,Region : string,GlobalCISOBTLead : string){
    let params = new HttpParams();
    params = params.append('GoLiveYear',GoLiveYear);
    params = params.append('Quarter',Quarter);
    params = params.append('ProjectStatus',ProjectStatus);
    params = params.append('Region',Region);
    params = params.append('GlobalCISOBTLead',GlobalCISOBTLead);
    return this.http.post<Responce>(`${this.Baseurl+"DRRegionWiseGDS"}`,params);
  }
  public DRRegionWiseCountryStatus(GoLiveYear : string,Quarter : string,ProjectStatus : string,Region : string,GlobalCISOBTLead : string){
    let params = new HttpParams();
    params = params.append('GoLiveYear',GoLiveYear);
    params = params.append('Quarter',Quarter);
    params = params.append('ProjectStatus',ProjectStatus);
    params = params.append('Region',Region);
    params = params.append('GlobalCISOBTLead',GlobalCISOBTLead);
    return this.http.post<Responce>(`${this.Baseurl+"DRRegionWiseCountryStatus"}`,params);
  }
  public DRRegionWiseImplementationType(GoLiveYear : string,Quarter : string,ProjectStatus : string,Region : string,GlobalCISOBTLead : string){
    let params = new HttpParams();
    params = params.append('GoLiveYear',GoLiveYear);
    params = params.append('Quarter',Quarter);
    params = params.append('ProjectStatus',ProjectStatus);
    params = params.append('Region',Region);
    params = params.append('GlobalCISOBTLead',GlobalCISOBTLead);
    return this.http.post<Responce>(`${this.Baseurl+"DRRegionWiseImplementationType"}`,params);
  }
  public DRRegionWiseActivityType(GoLiveYear : string,Quarter : string,ProjectStatus : string,Region : string,GlobalCISOBTLead : string){
    let params = new HttpParams();
    params = params.append('GoLiveYear',GoLiveYear);
    params = params.append('Quarter',Quarter);
    params = params.append('ProjectStatus',ProjectStatus);
    params = params.append('Region',Region);
    params = params.append('GlobalCISOBTLead',GlobalCISOBTLead);
    return this.http.post<Responce>(`${this.Baseurl+"DRRegionWiseActivityType"}`,params);
  }
  public DRRegionWiseOBTReseller(GoLiveYear : string,Quarter : string,ProjectStatus : string,Region : string,GlobalCISOBTLead : string){
    let params = new HttpParams();
    params = params.append('GoLiveYear',GoLiveYear);
    params = params.append('Quarter',Quarter);
    params = params.append('ProjectStatus',ProjectStatus);
    params = params.append('Region',Region);
    params = params.append('GlobalCISOBTLead',GlobalCISOBTLead);
    return this.http.post<Responce>(`${this.Baseurl+"DRRegionWiseOBTReseller"}`,params);
  }
  public DigitalReportData(GoLiveYear : string,Quarter : string,ProjectStatus : string,Region : string,GlobalCISOBTLead : string){
    let params = new HttpParams();
    params = params.append('GoLiveYear',GoLiveYear);
    params = params.append('Quarter',Quarter);
    params = params.append('ProjectStatus',ProjectStatus);
    params = params.append('Region',Region);
    params = params.append('GlobalCISOBTLead',GlobalCISOBTLead);
    return this.http.post<Responce>(`${this.Baseurl+"DigitalReportData"}`,params);
  }
  public RollingNPS(){
    let params = new HttpParams();
    return this.http.post<NPSData>(`${this.Baseurl+"RollingNPS"}`,params);
  }
  public GetNPSDataByYearMonth(YearMonth : string){
    let params = new HttpParams();
    params = params.append('YearMonth',YearMonth);
    return this.http.post<NPSData>(`${this.Baseurl+"GetNPSDataByYearMonth"}`,params);
  }

  // public GetNPSDataByYearMonth(YearMonth : string){
  //   let params = new HttpParams();
  //   params = params.append('YearMonth',YearMonth);
  //   return this.http.post<NPSData>(`${this.Baseurl+"GetNPSDataByYearMonth"}`,params);
  // }
  public SteeringCommitteeFilters(){
    let params = new HttpParams();
    return this.http.post<SteeringCommitte>(`${this.Baseurl+"SteeringCommitteeFilters"}`,params);
  }
  public KnowledgeBase(){
    let params = new HttpParams();
    return this.http.post<SteeringCommitte>(`${this.Baseurl+"KnowledgeBase"}`,params);
  }
  public SteeringCommitteeInsert(RecordStatus : string,ClientName : string,ClientType : string,ProjectLead : string,ProjectStatus : string,PreviousStatus : string,TotalBusineesVolume : Number,NewBusinessVolume : Number,
    Region : string,Country : string,CurrentState : string,CompletedKeyDeliverables : string,ScheduledKeyDeliverables : string,AdditionalNotes : string,KeyAccomplishmentsSinceLastUpdateKeyDeliverables : string,KeyUpcomingActivitiesKeyDeliverables : string,CombinedKeyDeliverableOne : any,CombinedKeyDeliverableTwo : any,InsertedBy : string){
    let params = new HttpParams();
    params = params.append('RecordStatus',RecordStatus);
    params = params.append('ClientName',ClientName);
    params = params.append('ClientType',ClientType);
    params = params.append('ProjectLead',ProjectLead);
    params = params.append('ProjectStatus',ProjectStatus);
    params = params.append('PreviousStatus',PreviousStatus);
    params = params.append('TotalBusineesVolume',TotalBusineesVolume+"");
    params = params.append('NewBusinessVolume',NewBusinessVolume+"");
    params = params.append('Region',Region);
    params = params.append('Country',Country);
    params = params.append('CurrentState',CurrentState);
    params = params.append('CompletedKeyDeliverables',CompletedKeyDeliverables);
    params = params.append('ScheduledKeyDeliverables',ScheduledKeyDeliverables);
    params = params.append('AdditionalNotes',AdditionalNotes);
    params = params.append('KeyAccomplishmentsSinceLastUpdateKeyDeliverables',KeyAccomplishmentsSinceLastUpdateKeyDeliverables);
    params = params.append('KeyUpcomingActivitiesKeyDeliverables',KeyUpcomingActivitiesKeyDeliverables);
    params = params.append('CombinedKeyDeliverableOne',CombinedKeyDeliverableOne);
    params = params.append('CombinedKeyDeliverableTwo',CombinedKeyDeliverableTwo);
    params = params.append('InsertedBy',InsertedBy);
    return this.http.post<SteeringCommittee>(`${this.Baseurl+"SteeringCommitteeInsert"}`,params);
  }
  public WavesInsert(SCID : Number,Waves : string,Region : string,Country : string,Scope : string,GoLiveDate : string,Status : string,InsertedBy : string){
    let params = new HttpParams();
    params = params.append('SCID',SCID+"");
    params = params.append('Waves',Waves+"");
    params = params.append('Region',Region);
    params = params.append('Country',Country);
    params = params.append('Scope',Scope);
    params = params.append('GoLiveDate',GoLiveDate);
    params = params.append('Status',Status);
    params = params.append('InsertedBy',InsertedBy);
    return this.http.post<SteeringCommittee>(`${this.Baseurl+"WavesInsert"}`,params);
  }
  public RiskGapInsert(SCID : Number,RiskCategory : string,Region : string,Country : string,Risks : string,RisksGaps : string,MitigationPlan : string,SteeringCommitteeSupportNeed : string,
    SupportNeededDetails : string,Impact : string,Likelihood : string,DueDate : string,Owner : string,Status : string,InsertedBy : string){
    let params = new HttpParams();
    params = params.append('SCID',SCID+"");
    params = params.append('RiskCategory',RiskCategory);
    params = params.append('Region',Region);
    params = params.append('Country',Country);
    params = params.append('Risks',Risks+"");
    params = params.append('RisksGaps',RisksGaps);
    params = params.append('MitigationPlan',MitigationPlan);
    params = params.append('SteeringCommitteeSupportNeed',SteeringCommitteeSupportNeed);
    params = params.append('SupportNeededDetails',SupportNeededDetails);
    params = params.append('Impact',Impact);
    params = params.append('Likelihood',Likelihood);
    params = params.append('DueDate',DueDate);
    params = params.append('Owner',Owner);
    params = params.append('Status',Status);
    params = params.append('InsertedBy',InsertedBy);
    return this.http.post<SteeringCommittee>(`${this.Baseurl+"RiskGapInsert"}`,params);
  }
  
  public RiskGapUpdate(RGID : number,SCID : Number,RiskCategory : string,Region : string,Country : string,Risks : string,RisksGaps : string,MitigationPlan : string,SteeringCommitteeSupportNeed : string,
    SupportNeededDetails : string,Impact : string,Likelihood : string,DueDate : string,Owner : string,Status : string,LastUpdatedBy : string){
    let params = new HttpParams();
    params = params.append('RGID',RGID+"");
    params = params.append('SCID',SCID+"");
    params = params.append('RiskCategory',RiskCategory);
    params = params.append('Region',Region);
    params = params.append('Country',Country);
    params = params.append('Risks',Risks+"");
    params = params.append('RisksGaps',RisksGaps);
    params = params.append('MitigationPlan',MitigationPlan);
    params = params.append('SteeringCommitteeSupportNeed',SteeringCommitteeSupportNeed);
    params = params.append('SupportNeededDetails',SupportNeededDetails);
    params = params.append('Impact',Impact);
    params = params.append('Likelihood',Likelihood);
    params = params.append('DueDate',DueDate);
    params = params.append('Owner',Owner);
    params = params.append('Status',Status);
    params = params.append('LastUpdatedBy',LastUpdatedBy);
    return this.http.post<SteeringCommittee>(`${this.Baseurl+"RiskGapUpdate"}`,params);
  }
  public SteeringCommitteeData(){
    let params = new HttpParams();
    return this.http.post<SteeringCommittee>(`${this.Baseurl+"SteeringCommitteeData"}`,params);
  }
  public SteeringCommitteeUpdate(SCID : number,RecordStatus : string,ClientName : string,ClientType : string,ProjectLead : string,ProjectStatus : string,PreviousStatus : string,TotalBusineesVolume : Number,NewBusinessVolume : Number,
    Region : string,Country : string,CurrentState : string,CompletedKeyDeliverables : string,ScheduledKeyDeliverables : string,AdditionalNotes : string,KeyAccomplishmentsSinceLastUpdateKeyDeliverables : string,KeyUpcomingActivitiesKeyDeliverables : string,CombinedKeyDeliverableOne : any,CombinedKeyDeliverableTwo : any,LastUpdatedBy : string){
    let params = new HttpParams();
    params = params.append('SCID',SCID+"");
    params = params.append('RecordStatus',RecordStatus);
    params = params.append('ClientName',ClientName);
    params = params.append('ClientType',ClientType);
    params = params.append('ProjectLead',ProjectLead);
    params = params.append('ProjectStatus',ProjectStatus);
    params = params.append('PreviousStatus',PreviousStatus);
    params = params.append('TotalBusineesVolume',TotalBusineesVolume+"");
    params = params.append('NewBusinessVolume',NewBusinessVolume+"");
    params = params.append('Region',Region);
    params = params.append('Country',Country);
    params = params.append('CurrentState',CurrentState);
    params = params.append('CompletedKeyDeliverables',CompletedKeyDeliverables);
    params = params.append('ScheduledKeyDeliverables',ScheduledKeyDeliverables);
    params = params.append('AdditionalNotes',AdditionalNotes);
    params = params.append('KeyAccomplishmentsSinceLastUpdateKeyDeliverables',KeyAccomplishmentsSinceLastUpdateKeyDeliverables);
    params = params.append('KeyUpcomingActivitiesKeyDeliverables',KeyUpcomingActivitiesKeyDeliverables);
    params = params.append('CombinedKeyDeliverableOne',CombinedKeyDeliverableOne);
    params = params.append('CombinedKeyDeliverableTwo',CombinedKeyDeliverableTwo);
    params = params.append('LastUpdatedBy',LastUpdatedBy);
    return this.http.post<SteeringCommittee>(`${this.Baseurl+"SteeringCommitteeUpdate"}`,params);
  }
  public WavesUpdate(WaveID : number,SCID : Number,Waves : string,Region : string,Country : string,Scope : string,GoLiveDate : string,Status : string,LastUpdatedBy : string){
    let params = new HttpParams();
    params = params.append('SCID',SCID+"");
    params = params.append('WaveID',WaveID+"");
    params = params.append('Waves',Waves+"");
    params = params.append('Region',Region);
    params = params.append('Country',Country);
    params = params.append('Scope',Scope);
    params = params.append('GoLiveDate',GoLiveDate);
    params = params.append('Status',Status);
    params = params.append('LastUpdatedBy',LastUpdatedBy);
    return this.http.post<SteeringCommittee>(`${this.Baseurl+"WavesUpdate"}`,params);
  }
  public GetSCDataUsingOppID(Opportunity_ID : number){
    let params = new HttpParams();
    params = params.append('Opportunity_ID',Opportunity_ID+"");
    return this.http.post<SteeringCommittee>(`${this.Baseurl+"GetSCDataUsingOppID"}`,params);
  }
  public DeleteSCData(SCID : number,LastUpdatedBy : string){
    let params = new HttpParams();
    params = params.append('SCID',SCID+"");
    params = params.append('LastUpdatedBy',LastUpdatedBy);
    return this.http.post<SteeringCommittee>(`${this.Baseurl+"DeleteSCData"}`,params);
  }
  public DeleteWave(WaveID : number,LastUpdatedBy : string){
    let params = new HttpParams();
    params = params.append('WaveID',WaveID+"");
    params = params.append('LastUpdatedBy',LastUpdatedBy);
    return this.http.post<SteeringCommittee>(`${this.Baseurl+"DeleteWave"}`,params);
  }
  public DeleteRiskGap(RGID : number,LastUpdatedBy : string){
    let params = new HttpParams();
    params = params.append('RGID',RGID+"");
    params = params.append('LastUpdatedBy',LastUpdatedBy);
    return this.http.post<SteeringCommittee>(`${this.Baseurl+"DeleteRiskGap"}`,params);
  }
  public CLRActivityData(){
    let params = new HttpParams();
    return this.http.post<Responce>(`${this.Baseurl+"CLRActivityData"}`,params);
  }
  public RecordHistoryData(Revenue_ID : string){
    let params = new HttpParams();
    params = params.append('Revenue_ID',Revenue_ID+"");
    return this.http.post<Responce>(`${this.Baseurl+"RecordHistoryData"}`,params);
  }
  public GetCRMDataByUsingRevenueID(Opportunity_ID : string){
    let params = new HttpParams();
    params = params.append('Opportunity_ID',Opportunity_ID+"");
    return this.http.post<Responce>(`${this.Baseurl+"GetCRMDataByUsingRevenueID"}`,params);
  }
  public GetCLRSelectedColumns(UID : string){
    let params = new HttpParams();
    params = params.append('UID',UID+"");
    return this.http.post<Responce>(`${this.Baseurl+"GetCLRSelectedColumns"}`,params);
  }
  public CLRColumnsUpdate(UID : string,
    Priority : string,
    Implementation_Type : string,
    Pipeline_status : string,
    Pipeline_comments : string,
    TXResourcing : string,
    Service_location : string,
    Service_configuration : string,
    OBT_Reseller___Direct : string,
    OBTAdoptionRate : string,
    ExpectedDecisionDate_c : string,
    Assignment_date_c : string,
    ResourseRequestedDate_c : string,
    UpdateOn_c : string,
    OppVolume : string,
    RevenueVolumeUSD : string,
    Region : string,
    OwnerShip : string,
    ProjectStart_ForCycleTime_c : string,
    GoLiveDate_c : string,
    PerCompleted : string,
    CycleTime : string,
    CycleTimeCategories : string,
    CycleTimeDelayCode : string,
    EltClientDelayDescription : string,
    ProjectStatus : string,
    Milestone__Reason_Code : string,
    CountryStatus : string,
    ProjectLevel : string,
    CompletedDate_c : string,
    GlobalProjectManager : string,
    RegionalProjectManager : string,
    AssigneeFullName : string,
    GlobalCISDQSLead : string,
    APAC_DQS : string,
    DQS_Import : string,
    DQS_Support : string,
    LATAM_DQS : string,
    NORAM_DQS : string,
    DQS_Operations : string,
    GlobalCISOBTLead : string,
    RegionalCISOBTLead : string,
    LocalDigitalOBTLead : string,
    GlobalCISPortraitLead : string,
    RegionalCISPortraitLead : string,
    GlobalCISHRFeedSpecialist : string,
    GDS : string,
    ActivityType : string,
    ComplexityScore : string,
    MilestoneTitle : string,
    Group_Name : string,
    Milestone__Project_Notes : string,
    Milestone__Closed_Loop_Owner : string,
    Workspace__ELT_Overall_Status : string,
    Workspace__ELT_Overall_Comments : string,
    NpsScore : string,
    Customer_Row_ID : string,
    Opportunity_ID : string,
    AccountOwner : string,
    Opportunity_Type : string,
    Revenue_Status : string,
    Revenue_Opportunity_Type : string,
    Opportunity_Owner : string,
    Opportunity_Category : string,
    Revenue_Total_Transactions : string,
    Line_Win_Probability : string,
    Implementation_Fee__PSD_ : string,
    Next_Step : string,
    AwardedDate_c : string,
    DataDescription : string,
    Date_added_to_the_CLR_c : string,
    CreatedDate_c : string,
    Project_Effort : string,
    Sales_Stage_Name : string,
    AccountCategory : string,
    SOWStatus : string,
    ImplementationReady : string,
    RecordHistory_C : string,
    DataSourceType : string,
    DataQuality : string){
    let params = new HttpParams();
    params = params.append('UID',UID+"");
    params = params.append('Priority',Priority+"");
    params = params.append('Implementation_Type',Implementation_Type+"");
    params = params.append('Pipeline_status',Pipeline_status+"");
    params = params.append('Pipeline_comments',Pipeline_comments+"");
    params = params.append('TXResourcing',TXResourcing+"");
    params = params.append('Service_location',Service_location+"");
    params = params.append('Service_configuration',Service_configuration+"");
    params = params.append('OBT_Reseller___Direct',OBT_Reseller___Direct+"");
    params = params.append('OBTAdoptionRate',OBTAdoptionRate+"");
    params = params.append('ExpectedDecisionDate_c',ExpectedDecisionDate_c+"");
    params = params.append('Assignment_date_c',Assignment_date_c+"");
    params = params.append('ResourseRequestedDate_c',ResourseRequestedDate_c+"");
    params = params.append('UpdateOn_c',UpdateOn_c+"");
    params = params.append('OppVolume',OppVolume+"");
    params = params.append('RevenueVolumeUSD',RevenueVolumeUSD+"");
    params = params.append('Region',Region+"");
    params = params.append('OwnerShip',OwnerShip+"");
    params = params.append('ProjectStart_ForCycleTime_c',ProjectStart_ForCycleTime_c+"");
    params = params.append('GoLiveDate_c',GoLiveDate_c+"");
    params = params.append('PerCompleted',PerCompleted+"");
    params = params.append('CycleTime',CycleTime+"");
    params = params.append('CycleTimeCategories',CycleTimeCategories+"");
    params = params.append('CycleTimeDelayCode',CycleTimeDelayCode+"");
    params = params.append('EltClientDelayDescription',EltClientDelayDescription+"");
    params = params.append('ProjectStatus',ProjectStatus+"");
    params = params.append('Milestone__Reason_Code',Milestone__Reason_Code+"");
    params = params.append('CountryStatus',CountryStatus+"");
    params = params.append('ProjectLevel',ProjectLevel+"");
    params = params.append('CompletedDate_c',CompletedDate_c+"");
    params = params.append('GlobalProjectManager',GlobalProjectManager+"");
    params = params.append('RegionalProjectManager',RegionalProjectManager+"");
    params = params.append('AssigneeFullName',AssigneeFullName+"");
    params = params.append('GlobalCISDQSLead',GlobalCISDQSLead+"");
    params = params.append('APAC_DQS',APAC_DQS+"");
    params = params.append('DQS_Import',DQS_Import+"");
    params = params.append('DQS_Support',DQS_Support+"");
    params = params.append('LATAM_DQS',LATAM_DQS+"");
    params = params.append('NORAM_DQS',NORAM_DQS+"");
    params = params.append('DQS_Operations',DQS_Operations+"");
    params = params.append('GlobalCISOBTLead',GlobalCISOBTLead+"");
    params = params.append('RegionalCISOBTLead',RegionalCISOBTLead+"");
    params = params.append('LocalDigitalOBTLead',LocalDigitalOBTLead+"");
    params = params.append('GlobalCISPortraitLead',GlobalCISPortraitLead+"");
    params = params.append('RegionalCISPortraitLead',RegionalCISPortraitLead+"");
    params = params.append('GlobalCISHRFeedSpecialist',GlobalCISHRFeedSpecialist+"");
    params = params.append('GDS',GDS+"");
    params = params.append('ActivityType',ActivityType+"");
    params = params.append('ComplexityScore',ComplexityScore+"");
    params = params.append('MilestoneTitle',MilestoneTitle+"");
    params = params.append('Group_Name',Group_Name+"");
    params = params.append('Milestone__Project_Notes',Milestone__Project_Notes+"");
    params = params.append('Milestone__Closed_Loop_Owner',Milestone__Closed_Loop_Owner+"");
    params = params.append('Workspace__ELT_Overall_Status',Workspace__ELT_Overall_Status+"");
    params = params.append('Workspace__ELT_Overall_Comments',Workspace__ELT_Overall_Comments+"");
    params = params.append('NpsScore',NpsScore+"");
    params = params.append('Customer_Row_ID',Customer_Row_ID+"");
    params = params.append('Opportunity_ID',Opportunity_ID+"");
    params = params.append('AccountOwner',AccountOwner+"");
    params = params.append('Opportunity_Type',Opportunity_Type+"");
    params = params.append('Revenue_Status',Revenue_Status+"");
    params = params.append('Revenue_Opportunity_Type',Revenue_Opportunity_Type+"");
    params = params.append('Opportunity_Owner',Opportunity_Owner+"");
    params = params.append('Opportunity_Category',Opportunity_Category+"");
    params = params.append('Revenue_Total_Transactions',Revenue_Total_Transactions+"");
    params = params.append('Line_Win_Probability',Line_Win_Probability+"");
    params = params.append('Implementation_Fee__PSD_',Implementation_Fee__PSD_+"");
    params = params.append('Next_Step',Next_Step+"");
    params = params.append('AwardedDate_c',AwardedDate_c+"");
    params = params.append('DataDescription',DataDescription+"");
    params = params.append('Date_added_to_the_CLR_c',Date_added_to_the_CLR_c+"");
    params = params.append('CreatedDate_c',CreatedDate_c+"");
    params = params.append('Project_Effort',Project_Effort+"");
    params = params.append('Sales_Stage_Name',Sales_Stage_Name+"");
    params = params.append('AccountCategory',AccountCategory+"");
    params = params.append('SOWStatus',SOWStatus+"");
    params = params.append('ImplementationReady',ImplementationReady+"");
    params = params.append('RecordHistory_C',RecordHistory_C+"");
    params = params.append('DataSourceType',DataSourceType+"");
    params = params.append('DataQuality',DataQuality+"");
    return this.http.post<Responce>(`${this.Baseurl+"CLRColumnsUpdate"}`,params);
  }

  public PriorityReportFiltersList(){
    let params = new HttpParams();
    return this.http.post<Filters>(`${this.Baseurl+"PriorityReportFiltersList"}`,params);
  }
  public GetPriorityData(ProjectStatus : string,Opportunity_Type : string){
    let params = new HttpParams();
    params = params.append('ProjectStatus',ProjectStatus+"");
    params = params.append('Opportunity_Type',Opportunity_Type);
    return this.http.post<Responce>(`${this.Baseurl+"GetPriorityData"}`,params);
  }
}