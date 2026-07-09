export interface FilterImplementationType {
    ImplementationType: string;
    isSelected: boolean;
}
export interface FilterGDS{
    GDS: string;
    isSelected: boolean;
}
export interface FilterActivityType{
    ActivityType: string;
    isSelected: boolean;
}
export interface FilterRegion {
    Region: string;
    isSelected: boolean;
}
export interface FilterPriority {
    Priority: string;
    isSelected: boolean;
}
export interface FilterOwnerShip {
    OwnerShip: string;
    isSelected: boolean;
}
export interface FilterOBTReseller{
    OBTReseller: string;
    isSelected: boolean;
}
export interface FilterProjectStatu {
    ProjectStatus: string;
    isSelected: boolean;
}
export interface FilterReasonTypeList {
    ReasonType: string;
    isSelected: boolean;
}
export interface FilterCountryStatu {
    CountryStatus: string;
    isSelected: boolean;
}
export interface FilterProjectLevel {
    ProjectLevel: string;
    isSelected: boolean;
}
export interface FilterGroupName {
    Group_Name: string;
    isSelected: boolean;
}
export interface FilterWorkspaceELTOverallStatu {
    Workspace__ELT_Overall_Status: string;
    isSelected: boolean;
}
export interface FilterSalesStageName {
    Sales_Stage_Name: string;
    isSelected: boolean;
}
export interface FilterOpportunityType {
    Opportunity_Type: string;
    isSelected: boolean;
}
export interface FilterRevenueStatus {
    Revenue_Status: string;
    isSelected: boolean;
}
export interface FilterRevenueOpportunityType {
    Revenue_Opportunity_Type: string;
    isSelected: boolean;
}
export interface FilterOpportunityCategory {
    Opportunity_Category: string;
    isSelected: boolean;
}
export interface FilterLineWinProbability {
    Line_Win_Probability: number;
    isSelected: boolean;
}
export interface FilterStatu {
    Status: string;
    isSelected: boolean;
}
export interface FilterDataSourceType {
    DataSourceType: string;
    isSelected: boolean;
}
export interface FilterPipelineStatu {
    Pipeline_status: string;
    isSelected: boolean;
}
export interface FilterCountry {
    Country: string;
    isSelected: boolean;
}
export interface FilterAccountName {
    Account_Name: string;
    isSelected: boolean;
}
export interface FilterGlobalProjectManager {
    GlobalProjectManager: string;
    isSelected: boolean;
}
export interface FilterRegionalProjectManager {
    RegionalProjectManager: string;
    isSelected: boolean;
}
export interface FilterLocalProjectManager {
    LocalProjectManager: string;
    isSelected: boolean;
}
export interface FilterDigitalTeam {
    Manager: string;
    isSelected: boolean;
}
export interface RegionCountry {
    Country: string;
    isSelected: boolean;
}
export interface FilterRegionWiseCountry {
    Region: string;
    Countries: RegionCountry[];
    isSelected: boolean;
}
export interface FilterQuarter {
    Quarter: string;
    isSelected: boolean;
}
export interface FilterYears {
    Year: string;
    isSelected: boolean;
}
export interface FilterGlobalDigitalOBTLead {
    GlobalCISOBTLead: string;
    DigitalOBTManager : DigitalOBTManager[];
    isSelected: boolean;
}
export interface DigitalOBTManager {
    Manager : string;
    isSelected: boolean;
}
export interface NPSComment {
    NPSComment : string;
    isSelected: boolean;
}
export interface FilterAccountCategory {
    AccountCategory : string;
    isSelected: boolean;
}
export interface FiltereSowStatus {
    SOWStatus : string;
    isSelected: boolean;
}
export interface FilterServiceConfiguration {
    Service_Configuration : string;
    isSelected: boolean;
}
export interface CycleTimeCategories {
    CycleTimeCategories : string;
    isSelected: boolean;
}
export interface FilterCycleTime {
    Status: string;
    isSelected: boolean;
}
export interface AutomatedCLRFilters {
    message: string;
    code: number;
    CycleTimeCategories : CycleTimeCategories[];
    FilterImplementationType: FilterImplementationType[];
    FilterRegion: FilterRegion[];
    FilterPriority: FilterPriority[];
    FilterQuarter : FilterQuarter[];
    FilterYears : FilterYears[];
    FilterOwnerShip: FilterOwnerShip[];
    FilterOBTReseller: FilterOBTReseller[];
    FilterProjectStatus: FilterProjectStatu[];
    FilterCountryStatus: FilterCountryStatu[];
    FilterProjectLevel: FilterProjectLevel[];
    FilterGroup_Name: FilterGroupName[];
    FilterWorkspace__ELT_Overall_Status: FilterWorkspaceELTOverallStatu[];
    FilterSales_Stage_Name: FilterSalesStageName[];
    FilterOpportunity_Type: FilterOpportunityType[];
    FilterRevenue_Status: FilterRevenueStatus[];
    FilterRevenue_Opportunity_Type: FilterRevenueOpportunityType[];
    FilterOpportunity_Category: FilterOpportunityCategory[];
    FilterLine_Win_Probability: FilterLineWinProbability[];
    FilterStatus: FilterStatu[];
    FilterDataSourceType: FilterDataSourceType[];
    FilterPipeline_status: FilterPipelineStatu[];
    FilterCountry: FilterCountry[];
    FilterAccountName : FilterAccountName[];
    FilterGlobalProjectManager: FilterGlobalProjectManager[];
    FilterRegionalProjectManager: FilterRegionalProjectManager[];
    FilterLocalProjectManager: FilterLocalProjectManager[];
    FilterGDS: FilterGDS[];
    FilterActivityType: FilterActivityType[];
    FilterDigitalTeam: FilterDigitalTeam[];
    FilterRegionWiseCountries: FilterRegionWiseCountry[];
    FilterGlobalDigitalOBTLead: FilterGlobalDigitalOBTLead[];
    NPSCommentOne: NPSComment[];
    NPSCommentTwo: NPSComment[];
    NPSCommentThree: NPSComment[];
    FilterAccountCategory : FilterAccountCategory[];
    FiltereSowStatus : FiltereSowStatus[];
    FilterServiceConfiguration : FilterServiceConfiguration[];
    FilterGlobalDigitalData: FilterGlobalProjectManager[];
    FilterRegionalDigitalData: FilterGlobalProjectManager[];
    FilterLocalDigitalData: FilterGlobalProjectManager[];
}