import { CLRColumns } from "./CLRColumns";

export interface Responce {
    message: string;
    code: number;
    Data: Data[];
    LastUpdatedOn : any;
    RevenueID : any;
    VolumeCountCycleTime : VolumeCountCycleTime[];
    CycleTimeByCategories : Data[];
    CycleTimeData : CycleTimeData[];
    GlobalManager : number;
    TargetCycleTimeData : TargetCycleTimeData[];
    CLRColumns : CLRColumns[];
    PriorityData : PriorityData[];
    ProjectStatusActivityData : ProjectStatusActivityData[];
    SalesStageNameActivityData : SalesStageNameActivityData[];
    MonthlyTotalRevenueWithDelta : MonthlyTotalRevenueWithDelta[];
    ReportsUpdatedON : ReportsUpdatedON[];
}
export interface ReportsUpdatedON{
    ReportID : number;
    ReportName : string;
    UpdatedOn : Date;
    Updated_On : Date;
    AvailableRows : number;
    UploadedRows : number;
}
export interface MonthlyTotalRevenueWithDelta{
    CMJan : number;
    CMFeb : number;
    CMMar : number;
    CMApr : number;
    CMMay : number;
    CMJun : number;
    CMJul : number;
    CMAug : number;
    CMSep : number;
    CMOct : number;
    CMNov : number;
    CMDec : number;
    CMTot : number;
    LMJan : number;
    LMFeb : number;
    LMMar : number;
    LMApr : number;
    LMMay : number;
    LMJun : number;
    LMJul : number;
    LMAug : number;
    LMSep : number;
    LMOct : number;
    LMNov : number;
    LMDec : number;
    LMTot : number;
    Delta_Jan : string;
    Delta_Feb : string;
    Delta_Mar : string;
    Delta_Apr : string;
    Delta_May : string;
    Delta_Jun : string;
    Delta_Jul : string;
    Delta_Aug : string;
    Delta_Sep : string;
    Delta_Oct : string;
    Delta_Nov : string;
    Delta_Dec : string;
    Delta_Tot : string;
}
export class ProjectStatusActivityData {
    RevenueID : string;
    EPDate_c : any;
    HPDate_c : any;
    PDate_c : any;
    EPDate : string;
    HPDate : string;
    PDate : string;
    Assignment: string;
    ExpectedDecision : string;
    ResourceRequested : string;
    ProjectStart : string;
    GoLive : string;
    ExpectedDecision_c : any;
    Assignment_c: any;
    ResourceRequested_c : any;
    ProjectStart_c : any;
    GoLive_c : any;
    CycleTime : any;
}
export class SalesStageNameActivityData {
    RevenueID : string;

    Withdrawn_c : any;
    NoGo_c : any;
    ClosedLost_c : any;
    PresentationStage_c : any;
    VerbalAward_c : any;
    Negotiations_c : any;
    Shortlisted_c : any;
    Sold_c : any;
    ProposalSubmitted_c : any;
    NeedsAreIdentified_c : any;
    ContractSigned_c : any;

    Withdrawn : string;
    NoGo : string;
    ClosedLost : string;
    PresentationStage : string;
    VerbalAward : string;
    Negotiations : string;
    Shortlisted : string;
    Sold : string;
    ProposalSubmitted : string;
    NeedsAreIdentified : string;
    ContractSigned : string;
}
export interface PriorityData {
    Client: string
    Workspace_Title : string;
    OppTOtalVolume: number;
    OppTOtalVolume_c: string;
    RevenueVolumeUSD: number;
    RevenueVolumeUSD_c: string;
    Line_Win_Probability: number;
    Sales_Stage_Name: string
    Opportunity_Type: string
    ExpectedDecisionDate?: any;
    ExpectedDecisionDate_c?: any;
    Assignment_date?: string;
    Assignment_date_c : string;
    Pipeline_comments: string
    Country: number
    CountryWiseData: CountryWiseData[]
  }
  
  export interface CountryWiseData {
    Client: string
    Workspace_Title : string;
    Opportunity_Type: string
    ManualCLient: string
    OppTOtalVolume: number
    OppTOtalVolume_c: string;
    RevenueVolumeUSD: number;
    RevenueVolumeUSD_c: string;
    Line_Win_Probability: number
    ExpectedDecisionDate?: any
    ExpectedDecisionDate_c?: string
    Assignment_date?: string
    Assignment_date_c?: string
    Sales_Stage_Name: string
    Revenue_Opportunity_Type: string
    Pipeline_comments: string
    Country: string
  }
export class TargetCycleTimeData{
    TargetID : string;
    ExistingServiceConfigChange : number;
    ExistingAddChange : number;
    NewGlobal : number;
    NewRegional : number;
    NewLocal : number;
    Overall : number;
    Year : string;
    Months : string;
}
export class VolumeCountCycleTime{
    GoLiveMonth: string;
    Revenue_Total_Volume_USD: number;
    Revenue_Total_Volume : string;
    ProjectsCount: number;
    Average: number;
    cycletimesum : number;
    cycletimeCount : number;
    AvgCycleTime : string;
}
export class CycleTimeData{
    Client : string;
    RevenueID : string;
    Workspace_Title : string;
    MilestoneTitle : string;
    ImplementationType : string;
    Region : string;
    Country : string;
    ProjectStatus : string;
    ProjectLevel : string;
    GoLiveDate : Date;
    GoLive : string;
    ProjectStart_ForCycleTime : Date;
    CycleTimeDelayCode : string;
    EltClientDelayDescription : string;
    ProjectStart : string;
    CycleTime : string;
    CycleTimeCategories : string;
    GoLiveYear : string;
    GoLiveMonth : string;
}

export class Data {
    ID : string;
    Candidate_Name : string;
    Comments : any;
    HierarchyID : number;
    iMeet_Milestone___Project_Status: string;
    isSelected : boolean;
    iMeet_Project_Level: string;
    Revenue_Total_Volume_USD?: number;
    Region__Opportunity_: string;
    Implementation_Type: string;
    Revenue_Total_Volume : string;
    GJanuary: number;
    LJanuary: number;
    RJanuary: number;
    GFebruary: number;
    LFebruary: number;
    RFebruary: number;
    GMarch: number;
    LMarch: number;
    RMarch: number;
    GApril: number;
    LApril: number;
    RApril: number;
    GMay: number;
    LMay: number;
    RMay: number;
    GJune: number;
    LJune: number;
    RJune: number;
    GJuly: number;
    LJuly: number;
    RJuly: number;
    GAugust: number;
    LAugust: number;
    RAugust: number;
    CountrywiseSum : Data[];
    GSeptember: number;
    LSeptember: number;
    RSeptember: number;
    GOctober: number;
    LOctober: number;
    ROctober: number;
    GNovember: number;
    LNovember: number;
    RNovember: number;
    GDecember: number;
    LDecember: number;
    RDecember: number;
    APAC: number;
    EMEA: number;
    LATAM: number;
    NORAM: number;
    Blanks: number;
    
    CurrentMonth : any;
    CurrentMonthCount : any;
    NextMonth : any;
    NextMonthCount : any;
    NextMonthPlusOne : any;
    NextMonthPlusOneCount : any;
    NextMonthPlusTwo : any;
    NextMonthPlusTwoCount : any;
    NextMonthPlusThree : any;
    NextMonthPlusThreeCount : any;
    CurrentMonth_n : any;
    NextMonth_n : any;
    NextMonthPlusOne_n : any;
    NextMonthPlusTwo_n : any;
    NextMonthPlusThree_n : any;
    CurrentMonthCount_n : any;
    NextMonthCount_n : any;
    NextMonthPlusOneCount_n : any;
    NextMonthPlusTwoCount_n : any;
    NextMonthPlusThreeCount_n : any;
    Jan: any;
    Feb: any;
    Mar: any;
    Apr: any;
    May: any;
    Jun: any;
    Jul: any;
    Aug: any;
    Sep: any;
    Oct: any;
    Nov: any;
    Dec: any;
    January : any;
    February : any;
    March : any;
    April : any;
    May_ : any;
    June : any;
    July : any;
    August : any;
    September : any;
    October : any;
    November : any;
    December : any;
    GoLiveMonth: string;
    ProjectsCount: number;
    Average: number;
    AvgCycleTime : string;
    RevenueVolume_string : string;

    January_RV: number;
    February_RV: number;
    March_RV: number;
    April_RV: number;
    May_RV: number;
    June_RV: number;
    July_RV: number;
    August_RV: number;
    September_RV: number;
    October_RV: number;
    November_RV: number;
    December_RV: number;
    CycleTimeCategory : string;
    January_PC: number;
    February_PC: number;
    March_PC: number;
    April_PC: number;
    May_PC: number;
    June_PC: number;
    H_One_PC : number;
    July_PC: number;
    August_PC: number;
    September_PC: number;
    October_PC: number;
    November_PC: number;
    December_PC: number;
    H_Two_PC : number;
    Total_PC : number;
    January_A: number;
    February_A: number;
    March_A: number;
    April_A: number;
    May_A: number;
    June_A: number;
    H_One_A: number;
    July_A: number;
    August_A: number;
    September_A: number;
    October_A: number;
    November_A: number;
    December_A: number;
    H_Two_A : number;
    Total_A : number;
    TargetCycleTime : number;
    TargetH1 : number;
	Level : string;

	//ResourceUtil
    ProjectManager: string;
    ProjectLevel: string;
    TargetedUtilization : number;
    CapacityAvailable : number;
    CATUColor : string;
    TUWorkingDays : number;
    CapacityAvailableTUWorkingDays : number;
    CATUWDColor : string;
    AvgUtil : number;
    PAvgUtil : number;
    RelativeCapacity : any;
    RCColor : string;
    C1stweek?: number;
    C2ndweek?: number;
    C3rdweek?: number;
    C4thweek?: number;
    C5thweek?: number;
    C6thweek?: number; 
    C7thweek?: number;
    C8thweek?: number;
    C9thweek?: number;
    C10thweek?: number;
    C11thweek?: number;
    C12thweek?: number;
    c13thweek?: number;
    c14thweek?: number;
    c15thweek?: number;
    c16thweek?: number;
    c17thweek?: number;
    c18thweek?: number;
    c19thweek?: number;
    c20thweek?: number;
    c21thweek?: number;
    c22thweek?: number;
    c23thweek?: number;
    c24thweek?: number;
    FirstWeek?: number;
    SecondWeek?: number;
    ThirdWeek?: number;
    FourthWeek?: number;
    FivthWeek?: number;
    SixthWeek?: number;
    SeventhWeek?: number;
    EighthWeek?: number;
    NinthWeek?: number;
    TenthWeek?: number;
    EleventhWeek?: number;
    twelvethWeek?: number;
    C13thweek?: number;
    C14thWeek?: number;
    C15thWeek?: number;
    C16thWeek?: number;
    C17thWeek?: number;
    C18thWeek?: number;
    C19thWeek?: number;
    C20thWeek?: number;
    C21stWeek?: number;
    C22ndWeek?: number;
    C23rdWeek?: number;
    C24thWeek?: number;
    Leader: string;
    Manager: string;
    WorkShedule: string;
    WorkingDays: number;
    Monday: number;
    Tuesday: number;
    Wednesday: number;
    Thursday: number;
    Friday: number;

    //Prospect
    PID: number;
    Client_Name: string;
    GoLiveDate : any;
    GoLiveDate_c :any;
    //Tracker
    TrackerId: number;
    RevenueID : string;
    Username : string;
    Region: string;
    Country: string;
    GManager: string;
    RManager: string;
    LManager: string;
    Client: string;
    iMeetWorkspaceTitle: string;
    RevenueVolume?: number;
    RevenueVolumeUSD: string;
    Project_Level: string;
    ImplementationType : string;
    Project_Type__CRM_: string;
    ProjectStatus: string;
    CIS_Resource__iMeet_: string;
    GlobalDigitalOBTLead : string;
    RegionalDigitalOBTLead : string;
    LocalDigitalOBTLead : string;
    GlobalDigitalPortraitLead : string;
    RegionalDigitalPortraitLead : string;
    GlobalDigitalHRFeedSpeciallist : string;
    GDS : string;
    ComplexityScore : number;
    Complexity_Score : number;
    ProjectDelay : number;
    ProjectEffort?: number;
    CalculatedEffort?: string;
    AssignmentDate? : Date;
    Proposed_Start_Date__iMeet_?: Date;
    Proposed_End_Date__Formula_?: Date;
    Go_Live_Date__iMeet_?: Date;
    ProjectStartDate : Date;
    Project_Start_Date : string;
    MilestoneProjectNotes : string;
    MilestoneDueDate : Date;
    MilestoneDueDateByLevel : Date;
    MilestoneDueDate_ByLevel : string;
    Milestone_Due_Date : string;
    OwnershipType : string;
    AssignmentDate_c : string;
    Proposed_Start_Date: string;
    Proposed_End_Date: string;
    Go_Live_Date: string;
    CompleteDuration: string;
    C__Completed__iMeet_?: number;
    PerCompleted : number;
    ConfigID : string;
    ProjectType : string;
    Duration : string;
    Status : string;
    InsertedBy : string;
    InsertedOn : Date;
    UpdatedBy : string;
    UpdatedOn : Date;
    OldValue : string;
    NewValue : string;
    Field : string;
    UsedPlatForm : string;
    DateUpdated : string;
    TaskRecordIDKey : string;
    TargetID : string;
    ExistingServiceConfigChange : number;
    ExistingAddChange : number;
    NewGlobal : number;
    NewRegional : number;
    NewLocal : number;
    Overall : number;
    Year : string;
    Months : string;
    CountryStatus : string;
    ActivityType : string;
    OBTReseller : string;
    iMeet_Workspace_Title : string;
    OBT_Reseller___Direct : string;
    GlobalCISOBTLead  : string;
    RegionalCISOBTLead  : string;
    GlobalCISPortraitLead  : string;
    RegionalCISPortraitLead  : string;
    GlobalCISHRFeedSpecialist  : string;
    Account_Name  : string;
    GoLiveYear  : string;
    Quarter   : string;
    RecordStatus  : string;
    DataSourceType : string;
    GrandTotal : number;
    Target_A : number;
    //CLR Activity
    ColumnName : string;
    UpdatedDate : string;
    UpdatedDate_text : string
    //Record History
    Assignment: string;
    ExpectedDecision : string;
    ResourceRequested : string;
    ProjectStart : string;
    GoLive : string;
    ExpectedDecision_c : any;
    Assignment_c: any;
    ResourceRequested_c : any;
    ProjectStart_c : any;
    GoLive_c : any;
    CycleTime : any;
    Close_Date : Date;
    Line_Win_Probability : number;
    Opportunity_Scope : string;
    Opportunity_Total_Volume_USD : number;
    Region__Revenue_ : string;
    Revenue_Id : number;
    Revenue_Opportunity_Type : string;
    Revenue_Status : string;
    Sales_Stage_Name : string;
}