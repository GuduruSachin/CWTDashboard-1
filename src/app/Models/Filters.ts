export interface Year {
    Go_Live_Year: string;
    isSelected: boolean;
}
export interface c_Year {
    Go_Live_Year: string;
    isSelected: boolean;
}
export interface rp_Year {
    Go_Live_Year: string;
    isSelected: boolean;
}
export interface Quarter {
    Quarter: string;
    isSelected: boolean;
}
export interface Month {
    Go_Live_Month: string;
    isSelected: boolean;
}
export interface c_Month {
    Go_Live_Month: string;
    isSelected: boolean;
}
export interface ProjectLevel {
    iMeet_Project_Level: string;
    isSelected: boolean;
}
export interface c_ProjectLevel {
    iMeet_Project_Level: string;
    isSelected: boolean;
}
export interface Region {
    Region__Opportunity_: string;
    isSelected: boolean;
}
export interface Status {
    Backlog_Started: string;
    isSelected: boolean;
}
export interface MarketLeader {
    Market_Leader: string;
    isSelected: boolean;
}
export interface ImplementationType {
    Implementation_Type: string;
    isSelected: boolean;
}
export interface c_ImplementationType {
    Implementation_Type: string;
    isSelected: boolean;
}
export interface MilestoneStatus {
    iMeet_Milestone___Project_Status: string;
    isSelected: boolean;
}
export interface c_MilestoneStatus {
    ProjectStatus: string;
    isSelected: boolean;
}
export interface rp_ProjectStatus{
    iMeet_Milestone___Project_Status: string;
    isSelected: boolean;
}
export interface rp_ProjectStatus{
    iMeet_Milestone___Project_Status: string;
    isSelected: boolean;
}
export interface Country{
    Country: string;
    isSelected: boolean;
}
export interface Ownership{
    OwnerShip: string;
    isSelected: boolean;
}
export interface FilterOpportunity_Type {
    Opportunity_Type: string
    isSelected: boolean
}
export interface FilterPriority {
    Priority: string
    isSelected: boolean
}
export interface Filters {
    message: string;
    code: number;
    Year: Year[];
    c_Year: c_Year[];
    rp_Year : rp_Year[];
    Quarter: Quarter[];
    Months: Month[];
    c_Months : c_Month[];
    ProjectLevel: ProjectLevel[];
    c_ProjectLevel: c_ProjectLevel[];
    Region: Region[];
    Status: Status[];
    OwnerShip : Ownership[];
    MarketLeaders: MarketLeader[];
    MilestoneStatus : MilestoneStatus[];
    c_MilestoneStatus : c_MilestoneStatus[];
    ImplementationType: ImplementationType[];
    c_ImplementationType: c_ImplementationType[];
    rp_ProjectStatus : rp_ProjectStatus[];
    Country : Country[];
    FilterOpportunity_Type: FilterOpportunity_Type[]
    FilterPriority: FilterPriority[]
}