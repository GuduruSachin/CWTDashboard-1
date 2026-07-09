import { Component, OnInit,ViewEncapsulation,Inject,Optional } from '@angular/core';
import { DashboardServiceService } from '../../dashboard-service.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { ExcelSXService } from '../../excelsx.service';

export interface ParsingData {
  Status : string;
  HierarchyID : number;
  userID : string;
  AssignedToName : string;
  LeaderTwo : string;
  LeaderOne : string;
  SeniorLeader : string;
  VP : string;
  EmailAddress : string;
  Region : string;
  Location : string;
  Role : string;
  Title : string;
  UserStatus : string;
}
export interface ParsingDeleteData{
  User_ID : string;
  Name : string;
}

@Component({
  selector: 'app-hierarchy',
  templateUrl: './hierarchy.component.html',
  styleUrls: ['./hierarchy.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HierarchyComponent implements OnInit {
  dataSource;
  displayedColumns : string[] = ['HierarchyID', 'User_ID','Name','LeaderTwo','LeaderOne','Sr_Leader','VP','Email_Address','Region','Location','Role','Title','UserStatus','actions'];
  screenWidth: number;
  screenHeight : number;
  constructor(public dashboard : DashboardComponent,public service : DashboardServiceService,public dialog: MatDialog,public excelxsService : ExcelSXService) {
    // set screenWidth on page load
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    window.onresize = () => {
      // set screenWidth on screen size change
      this.screenWidth = window.innerWidth;
      this.screenHeight = window.innerHeight;
    }
   }
  ngOnInit() {
    this.GetData();
  }
  GetData(){
    this.service.HierarchyData().subscribe(data =>{
      console.log(data.Data);
      this.dataSource = data.Data;
    })
  }
  openDialog(): void {
    let p_data : ParsingData = {
      Status : "Save",
      HierarchyID : 0,
      userID : "",
      AssignedToName : "",
      LeaderTwo : "",
      LeaderOne : "",
      SeniorLeader : "",
      VP : "",
      EmailAddress : "",
      Region : "",
      Location : "",
      Role : "",
      Title : "",
      UserStatus : "",
    }
    const dialogRef = this.dialog.open(AddingUser, {
      // width: '1000px',
      data: p_data
    });
    dialogRef.afterClosed().subscribe(result => {
      this.GetData();
    });
  }
  NewUser(){
    this.openDialog();
  }
  RowSelected(j,HierarchyID : number,User_ID : string,Name : string,LeaderTwo : string,LeaderOne : string,Sr_Leader : string,VP : string,Email_Address : string,Region : string,Location : string,Role : string,Title : string,UserStatus : string)
  {
    let p_data : ParsingData = {
      Status : "Update",
      HierarchyID : HierarchyID,
      userID : User_ID,
      AssignedToName : Name,
      LeaderTwo : LeaderTwo,
      LeaderOne : LeaderOne,
      SeniorLeader : Sr_Leader,
      VP : VP,
      EmailAddress : Email_Address,
      Region : Region,
      Location : Location,
      Role : Role,
      Title : Title,
      UserStatus : UserStatus,
    }
    const dialogRef = this.dialog.open(AddingUser, {
      // width: '1000px',
      data : p_data
    });
    dialogRef.afterClosed().subscribe(result => {
      this.GetData();
    });
  }
  RowSelecteddelete(j,User_ID : string,Name : string){
    let d_data : ParsingDeleteData = {
      User_ID : User_ID,
      Name : Name
    }
    const dialogRef = this.dialog.open(DeleteUser, {
      // width: '1000px',
      data : d_data
    });
    dialogRef.afterClosed().subscribe(result => {
      this.GetData();
    });
  }
  exportHierarchy(){
    this.dashboard.ShowSpinnerHandler(true);
    this.service.HierarchyData().subscribe(data =>{
      if(data.code == 200){
        this.excelxsService.exportAsExcelFile(
          [
            {
              sheetName: 'Hierarchy Data',
              data: data.Data,
              defaultBackgroundColor : 'FF34495E',
              defaultTextColor : 'FFFFFFFF',
              columnFormats: {
                'dd/MMM/yyyy' : ['Expected Decision Date','Assignment Date'], // Negative and Positive Numbers with 2 decimals with Dolor Symbol
                '0' : ['Countries','Line Win Probability'],
                '$#,##0.00;-$#,##0.00;0.00' : ['Opportunity Total Volume','Revenue Volume USD']
              },
            },
          ],
          'Hierarchy Data'
        );
      }else{
        alert("Something Went wrong, Please Try again later");
      }
      this.dashboard.ShowSpinnerHandler(false);
    })
  }
}
@Component({
  selector: 'app-addinguserdailog',
  templateUrl: './adding-user.component.html',
  styleUrls: ['./adding-user.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AddingUser {
  HierarchyID : number;
  userID : string;
  AssignedToName : string;
  LeaderTwo : string;
  LeaderOne : string;
  SeniorLeader : string;
  VP : string;
  EmailAddress : string;
  Region : string;
  Location : string;
  Role : string;
  Title : string;
  UserStatus : string;
  buttoncontent : string = "Save";
  constructor(
    public datepipe : DatePipe,
    public service : DashboardServiceService,
    public dialogRef : MatDialogRef<AddingUser>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: ParsingData,
    ) {
      if(data.Status == "Update"){
        this.HierarchyID = data.HierarchyID;
        this.userID = data.userID;
        this.AssignedToName = data.AssignedToName;
        this.LeaderTwo = data.LeaderTwo;
        this.LeaderOne = data.LeaderOne;
        this.SeniorLeader = data.SeniorLeader;
        this.VP = data.VP;
        this.EmailAddress = data.EmailAddress;
        this.Region = data.Region;
        this.Location = data.Location;
        this.Role = data.Role;
        this.Title = data.Title;
        this.UserStatus = data.UserStatus;
        this.buttoncontent = "Update";
      }else{
        this.buttoncontent = "Save";
      }
      // set screenWidth on page load
      this.screenWidth = window.innerWidth;
      this.screenHeight = window.innerHeight;
      window.onresize = () => {
        // set screenWidth on screen size change
        this.screenWidth = window.innerWidth;
        this.screenHeight = window.innerHeight;
      };
    }
  screenWidth: number;
  screenHeight : number;
  myDate = new Date();
  
  ngOnInit() {
    // this.valueofloss = 0;
    // this.creating_date = this.datepipe.transform(this.myDate,'dd / MM / yyyy'),
    // this.service.GetETDropDowns().subscribe(data =>{
    //   this.Manager = data.Manager;
    //   this.Resource = data.Resource;
    //   this.Country = data.Country;
    // })
  }
  OnSaveClick(){
    if(this.buttoncontent == "Save"){
      if(this.userID == null || this.AssignedToName == null || this.LeaderTwo == null || this.LeaderOne == null || this.SeniorLeader == null || this.VP == null || this.EmailAddress == null || this.Region == null || this.Location == null || this.Role == null || this.Title == null){
        alert("Please Fill all fields");
      }else{
        this.service.HierarchyInsert(this.userID,this.AssignedToName,this.LeaderTwo,this.LeaderOne,this.SeniorLeader,this.VP,this.EmailAddress,this.Region,this.Location,this.Role,this.Title,"Active").subscribe(data =>{
          if(data.code == 200){
            this.dialogRef.close();
            alert(data.message);
          }else{
            alert(data.message);
          }
        })
      }
    }else{
      if(this.userID == null || this.AssignedToName == null || this.LeaderTwo == null || this.LeaderOne == null || this.SeniorLeader == null || this.VP == null || this.EmailAddress == null || this.Region == null || this.Location == null || this.Role == null || this.Title == null){
        alert("Please Fill all fields");
      }else{
        this.service.HierarchyUpdate(this.HierarchyID,this.userID,this.AssignedToName,this.LeaderTwo,this.LeaderOne,this.SeniorLeader,this.VP,this.EmailAddress,this.Region,this.Location,this.Role,this.Title,"Active").subscribe(data =>{
          if(data.code == 200){
            this.dialogRef.close();
            alert(data.message);
          }else{
            alert(data.message);
          }
        })
      }
    }
  }
}

@Component({
  selector: 'app-deleteuserdailog',
  templateUrl: './delete-user.component.html',
  encapsulation: ViewEncapsulation.None
})
export class DeleteUser {
  UserID : string;
  Name : string;
  constructor(
    public service : DashboardServiceService,
    public dialogRef: MatDialogRef<DeleteUser>,
    @Inject(MAT_DIALOG_DATA) public data: ParsingDeleteData) {
      this.UserID = data.User_ID;
      this.Name = data.Name;
    }
  YesClick(){
    this.service.HierarchyDelete(this.UserID).subscribe(data =>{
      alert(data.message);
      this.dialogRef.close();
    })
  }
}