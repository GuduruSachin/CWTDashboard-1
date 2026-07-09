export interface SteeringCommittee {
    code : number;
    message : string;
    Data : SC_Data[];
    SCId : number;
}
export interface SC_ClientName {
    ClientName : string;
    isSelected : boolean;
}
export interface SC_Data {
    SCID: number;
    Action : string;
    RecordStatus: string;
    ClientName: string;
    ClientType: string;
    ProjectLead: string;
    ProjectStatus: string;
    PreviousStatus : string;
    // ProjectTrend: string;
    TotalBusineesVolume: number;
    TotalBusineesVolume_text?: string;
    NewBusinessVolume: number;
    NewBusinessVolume_text?: string;
    Region?: string;
    Regions? : any[];
    KeyAccomplishmentsSinceLastUpdateKeyDeliverables? : string;
    KeyUpcomingActivitiesKeyDeliverables? : string;
    op_Account_Name? : string;
    op_ProjectLead? : string;
    op_TotalVolume? : any;
    op_RevenueVolume? : any;
    op_ELTProjectStatus? : any;
    op_CycleTimeCategory? : any;
    op_Regions? : any[];
    op_Countries? : any[];
    Country?: string;
    Countries?: any[];
    CurrentState: string;
    CompletedKeyDeliverables: string;
    ScheduledKeyDeliverables: string;
    AdditionalNotes: string;
    InsertedBy?: string;
    InsertedDate?: Date;
    InsertedDate_text? : string;
    LastUpdatedBy?: string;
    LastUpdatedDate?: Date;
    LastUpdatedDate_text? : string;
    Waves: Wave[];
    RiskGaps: RiskGap[];
}
export interface Wave {
    Waves : string;
    WaveID: number;
    SCID: number;
    Region: string;
    Country: string;
    Scope: string;
    GoLiveDate?: Date;
    GoLiveDate_text: string;
    Status: string;
    InsertedBy: string;
    InsertedDate: Date;
    InsertedDate_text : string;
    LastUpdatedBy?: any;
    LastUpdatedDate: Date;
    LastUpdatedDate_text : string;
}
export interface RiskGap {
    Risks : string;
    RGID: number;
    SCID: number;
    RisksGaps: string;
    MitigationPlan: string;
    RiskCategory : string;
    SteeringCommitteeSupportNeed: string;
    SupportNeededDetails : string;
    DueDate?: Date;
    Impact : string;
    Likelihood : string;
    DueDate_text: string;
    Owner: string;
    Status : string;
    InsertedDate: Date;
    InsertedDate_text : string;
    InsertedBy: string;
    LastUpdatedBy?: any;
    LastUpdatedDate: Date;
    LastUpdatedDate_text : string;
}