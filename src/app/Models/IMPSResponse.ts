export interface IMPSResponce {
    message: string;
    code: number;
    Data: IMPSData[];
}
export interface IMPSData {
    Global : number;
    Local : number;
    Regional : number;
    Blanks : number;

    N_Active_NoDate: number;
    A_Active_Date: number;
    C_Closed: number;
    X_Cancelled: number;
    P_Pipeline: number;
    H_OnHold: number;
    Milestone__Assignee__Reports_to__Full_Name: string;
    WorkspaceCount: number;
    Milestone__Assignee__Full_Name : string,
    Workspace_Title: string,
    Workspace__CRM_Customer_Row_ID: string,
    Workspace__ELT_Overall_Status: string,
    Workspace__ELT_Overall_Comments: string,
    Milestone__Region: string,
    Milestone__Country: string,
    C__Complete: string,
    Milestone__Project_Start_Date: string,
    Milestone__Project_Notes: string,
    Milestone__Reason_Code: string,
    Milestone__Closed_Loop_Owner: string,
    Milestone__CRM_Revenue_ID__: string,
    Task_Start_Date: Date,
    Task_Start_Date_c: string,
    Workspace__Project_Level :string,
    Milestone_Title : string,
    Milestone__Record_ID_Key : string,
    Milestone__Project_Status : string,
    Task_Title : string,
    Task__Task_Record_ID_Key :string,
    Group_Name : string,
    Region : string
}