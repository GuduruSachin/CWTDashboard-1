import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DashboardServiceService } from '../../dashboard-service.service';
import { IMPSData } from '../../Models/IMPSResponse';
import { Chart} from 'chart.js';
import { AssigneeReportTO, Assignee, Region, ProjectLevel, ProjectStatus } from '../../Models/IMPSFilters';
import { DatePipe } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LivedashboardComponent } from '../livedashboard/livedashboard.component';
import { GroupName } from 'src/app/Models/CtoFilters';
import { DashboardComponent } from '../dashboard/dashboard.component';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ExcelSXService } from '../../excelsx.service';

export interface IMPSDailog {
  Dailog_WTitle : string;
  Dailog_PStatus : string;
  Dailog_Comment : string;
}
@Component({
  selector: 'app-implementation-project-status',
  templateUrl: './implementation-project-status.component.html',
  styleUrls: ['./implementation-project-status.component.css']
})
export class ImplementationProjectStatusComponent implements OnInit {
  LevelsCount : IMPSData[];
  StatusCounts : IMPSData[]; 
  SelectedStatus : any;SelectedLevel : any;SelectedRegion : any;SelectedAssigneReport : any;SelectedGroupName : any;//SelectedAssigne : any;
  masterStatus : boolean;masterLevel : boolean;masterRegion : boolean;masterAssignReport : boolean; masterGroupName : boolean;//masterAssigne : boolean;
  statusList : ProjectStatus[];
  statusListSelected : ProjectStatus[];
  levelsList : ProjectLevel[];
  levelsListSelected : ProjectLevel[];
  regionList : Region[];
  regionListSelected : Region[];
  Group_NameList : GroupName[];
  Group_NameListSelected  : GroupName[];
  // AssigneeList : Assignee[];
  // AssigneeListSelected : Assignee[];
  Assignee_ReportList : AssigneeReportTO[];
  Assignee_ReportListSelected : AssigneeReportTO[];
  Apply_disable : boolean;

  GroupNames = [];
  Regions = [];
  GroupNamesCount = [];
  RegionsCount = [];
  LeadersCount = [];
  Leaders = [];
  chart : any;
  PSchart : any;
  PLchart : any;
  GNchart : any;
  Regionchart : any;
  dataSource;
  dateStart : Date;
  dateEnd : Date;
  //today_max : Date;
  screenWidth : number;
  screenHeight : number;
  IMPSData : IMPSData[];
  Dailog_WTitle : string;
  Dailog_PStatus : string;
  Dailog_Comment : string;
  LoginUID : string;
  displayedColumns: string[] = ['Workspace_Title','Milestone_Title','Milestone__Assignee__Reports_to__Full_Name','Milestone__Assignee__Full_Name','Task_Start_Date_c','Group_Name','Milestone__Region','Milestone__Project_Status','Workspace__Project_Level','Milestone__CRM_Revenue_ID__','Task_Title','Task__Task_Record_ID_Key','Workspace__CRM_Customer_Row_ID','Workspace__ELT_Overall_Status','Workspace__ELT_Overall_Comments','Milestone__Country','C__Complete','Milestone__Project_Notes','Milestone__Reason_Code','Milestone__Closed_Loop_Owner'];
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  constructor(public datepipe : DatePipe,public dialog: MatDialog,public service : DashboardServiceService,private excelxsService : ExcelSXService,public dashboard : LivedashboardComponent) 
  {
    //set screenWidth on page load
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    window.onresize = () => {
      //set screenWidth on screen size change
      this.screenWidth = window.innerWidth;
      this.screenHeight = window.innerHeight;
    };
  }
  Lpdata;
  ngOnInit() {
    this.ResetFilters();
  }
  ResetFilters(){
    this.LoginUID = localStorage.getItem("UID");
    var today = new Date();
    this.dateStart = new Date("01/01/"+(today.getFullYear()));
    this.dateEnd = new Date("01/01/"+(today.getFullYear()+5));
    // this.dateStart = new Date("01/01/"+today.getFullYear());
    // this.dateEnd = new Date("01/01/"+(today.getFullYear()+1));
    this.dashboard.ShowSpinnerHandler(true);
    this.service.ImeetPSFilters().subscribe(data =>{
      if(data.code == 200){
        this.statusList = data.ProjectStatus;
        this.masterStatus = false;
        for (var i = 0; i < this.statusList.length; i++) {
          if(this.statusList[i].Milestone__Project_Status == "A-Active/Date Confirmed" || this.statusList[i].Milestone__Project_Status == "N-Active/No Date Confirmed"){
            this.statusList[i].isSelected = true;
          }else{
            this.statusList[i].isSelected = false;
          }
        }
        this.getSelectedstatus();
        this.levelsList = data.ProjectLevel;
        this.masterLevel = true;
        this.getSelectedlevel();
        this.regionList = data.Region;
        this.masterRegion = true;
        this.getSelectedregion();
        this.Group_NameList = data.GroupName;
        this.masterGroupName = true;
        this.getSelectedGroupName();
        //this.AssigneeList = data.Assignee;
        //this.masterAssigne = true;
        //this.getSelectedAssigne();
        this.Assignee_ReportList = data.Assignee_ReportTO;
        this.masterAssignReport = true;
        this.getSelectedAssignReport();
        this.SetGraph();
        this.dashboard.ShowSpinnerHandler(false);
      }
    });
    this.Apply_disable = true;
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(ImplementationProjectStatusdailog, {
      width: '400px',
      data: {Dailog_Comment: this.Dailog_Comment,Dailog_WTitle : this.Dailog_WTitle,Dailog_PStatus : this.Dailog_PStatus}
    });
    dialogRef.afterClosed().subscribe(result => {
      //this.Comment = result;
    });
  }
  ShowComment(Dailog_WTitle : string,Dailog_PStatus : string,Dailog_Comment : string){
    this.Dailog_WTitle = Dailog_WTitle;
    this.Dailog_PStatus = Dailog_PStatus;
    this.Dailog_Comment = Dailog_Comment;
    this.openDialog();
  }
  StartdateChange(){
    this.Apply_disable = false;
  }
  EnddateChange(){
    this.Apply_disable = false;
  }
  SetGraph(){
    if(this.dateEnd == null || this.dateStart == null || this.SelectedStatus == null || this.SelectedLevel == null || this.SelectedRegion == null || this.SelectedAssigneReport == null || this.SelectedGroupName == null){
      alert("Please select all filters");
    }else{
      this.dashboard.ShowSpinnerHandler(true);
      this.service.ProjectLevelCount(this.dateStart.toLocaleDateString(),this.dateEnd.toLocaleDateString(),this.SelectedStatus,this.SelectedLevel,this.SelectedRegion,this.SelectedAssigneReport,this.SelectedGroupName).subscribe(data =>{
        //if(data.Data )
        if(data.code == 200){
          this.LevelsCount = data.Data;
          var pieOptions = {
            //events: false,
            legend: {
              display: true,
              position : 'bottom' as 'bottom',
              fullWidth : true,
              labels: {
                fontColor: '#000000',
                fontSize :  11,
                padding : 10,
                fontStyle : 'bold',
                fontFamily : 'Arial',
              }
            },
            title: {
              display: true,
              text: ' '
            },
            plugins: {
              labels: {
                render: 'value',
                fontColor: '#3B3B3B',
                //position: 'outside',
                textMargin: 6,
                arc: false,
                fontSize: 12,
                fontStyle: 'bold',
                fontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
              }
            },
            showAllTooltips: true,
            tooltips: {
              callbacks: {
                label: function(tooltipItems, data) {
                  return data.labels[tooltipItems.index] + " : "+ data.datasets[tooltipItems.datasetIndex].data[tooltipItems.index];
                }
              }
            },
            events: ['mousemove'],
          };
          if(this.chart != undefined){
            this.chart.destroy();
          }
          this.chart = new Chart('PLcanvas', {
            type : 'pie',
            data : {
              labels : ['Global','Local','Regional'],
              datasets : [
                {
                  label : "Total Count By Project Level ("+Math.round(this.LevelsCount[0].Global+this.LevelsCount[0].Local+this.LevelsCount[0].Regional)+")",
                  data : [this.LevelsCount[0].Global,this.LevelsCount[0].Local,this.LevelsCount[0].Regional],
                  backgroundColor: [
                    'rgba(255, 61, 103,0.4)', 'rgba(5, 155, 255,0.4)', 'rgba(255, 194, 51,0.4)'
                    // 'rgba(83, 188, 155,0.4)', 'rgba(245, 141, 54,0.4)', 'rgba(134, 98, 164,0.4)'
                  ],
                  borderColor: [
                    'rgba(255, 61, 103)', 'rgba(5, 155, 255)', 'rgba(255, 194, 51)'
                    // 'rgba(83, 188, 155,1)', 'rgba(245, 141, 54,1)', 'rgba(134, 98, 164,1)'
                  ],
                  hoverBackgroundColor: [
                    'rgba(255, 61, 103)', 'rgba(5, 155, 255)', 'rgba(255, 194, 51)'
                    // 'rgba(83, 188, 155,1)', 'rgba(245, 141, 54,1)', 'rgba(134, 98, 164,1)'
                  ],
                }
              ]
            },
            options : pieOptions
          })
        }
        this.dashboard.ShowSpinnerHandler(false);
      });
      this.dashboard.ShowSpinnerHandler(true);
      this.service.ProjectStatusCount(this.dateStart.toLocaleDateString(),this.dateEnd.toLocaleDateString(),this.SelectedStatus,this.SelectedLevel,this.SelectedRegion,this.SelectedAssigneReport,this.SelectedGroupName).subscribe(PSdata =>{
        this.StatusCounts = PSdata.Data;
        var data = {
          //labels : ['(blanks)','A-Active/Date Confirmed','C-Closed','H-On Hold','N-Active/No Date Confirmed','P-Pipeline','X-Cancelled'],
          labels : ['A-Active/Date Confirmed','C-Closed','H-Hold','N-Active/No Date Confirmed'],
          datasets : [
            {
              label : "Total Count By Project Status ("+Math.round(this.StatusCounts[0].C_Closed+this.StatusCounts[0].H_OnHold+this.StatusCounts[0].A_Active_Date+this.StatusCounts[0].N_Active_NoDate)+")",
              data : [this.StatusCounts[0].A_Active_Date,this.StatusCounts[0].C_Closed,this.StatusCounts[0].H_OnHold,this.StatusCounts[0].N_Active_NoDate],
              backgroundColor: [
                'rgba(46, 204, 113 ,1)','rgba(245, 176, 65,1)', 'rgba(234, 135, 69,1)','rgba(236, 112, 99,1)'
              ],
              borderColor: [
                'rgba(229, 231, 233,1)','rgba(229, 231, 233,1)', 'rgba(229, 231, 233,1)', 'rgba(229, 231, 233,1)'
              ],
              hoverBackgroundColor: [
                'rgba(46, 204, 113 ,0.7)','rgba(245, 176, 65,0.7)', 'rgba(234, 135, 69,0.7)','rgba(236, 112, 99,0.7)'
              ],
              // borderWidth: 2,
              // fill: false,
            }
          ]
        };
        var options = {
          legend: {
            display: true,
            position : 'bottom' as 'bottom',
            fullWidth : true,
            labels: {
                fontColor: '#000000',
                fontSize :  13,
                padding : 10,
                fontStyle : 'bold',
                fontFamily : 'Arial',
            }
          },
          hover: {
            mode: 'index' as 'index',
            intersect: false
          },
          title: {
            display: true,
            text: ' '
          },
          scales: {
            xAxes: [{
              ticks: {
                fontSize : 10,
                fontStyle : 'bold',
                fontColor : '#000000',
                fontFamily : 'Arial',
              },
              gridLines: {
                color: "rgba(0, 0, 0, 0)",
              }
            }],
            yAxes: [{
              ticks: {
                beginAtZero: true,
                fontSize : 10,
                fontStyle : 'bold',
                fontColor : '#000000',
                fontFamily : 'Arial',
              },
              gridLines: {
                color: "rgba(0, 0, 0, 0)",
              }
            }]
          },
          tooltips: {
            mode: 'index' as 'index',
            intersect: false,
            callbacks: {
              label: function(tooltipItem) {
                return tooltipItem.yLabel;
              }
            }
          },
          plugins: {
            labels: {
              render: 'value',
              fontColor: '#3B3B3B',
              position: 'outside',
              textMargin: 6,
              fontSize: 10,
              fontStyle: 'bold',
              fontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
            }
          },
        };
        var canvas : any = document.getElementById("PScanvas");
        var ctx = canvas.getContext("2d");
        var pieOptions = {
          //events: false,
          legend: {
            display: true,
            position : 'bottom' as 'bottom',
            fullWidth : true,
            labels: {
              fontColor: '#000000',
              fontSize :  11,
              padding : 10,
              fontStyle : 'bold',
              fontFamily : 'Arial',
            }
          },
          title: {
            display: true,
            text: ' '
          },
          plugins: {
            labels: {
              render: 'value',
              fontColor: '#3B3B3B',
              textMargin: 6,
              arc: false,
              fontSize: 12,
              fontStyle: 'bold',
              fontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
            }
          },
          showAllTooltips: true,
          tooltips: {
            callbacks: {
              label: function(tooltipItems, data) {
                return data.labels[tooltipItems.index] + " : "+ data.datasets[tooltipItems.datasetIndex].data[tooltipItems.index];
              }
            }
          },
          events: ['mousemove'],
        };
        if(this.PSchart != undefined){
          this.PSchart.destroy();
        }
        this.PSchart = new Chart(ctx, {
          // plugins: [ChartDataLabels],
          type: 'pie',
          data: data,
          options: pieOptions
        });
        this.dashboard.ShowSpinnerHandler(false);
      });
      this.Leaders = [];
      this.LeadersCount = [];
      this.dashboard.ShowSpinnerHandler(true);
      this.service.ProjectLeadersCounts(this.dateStart.toLocaleDateString(),this.dateEnd.toLocaleDateString(),this.SelectedStatus,this.SelectedLevel,this.SelectedRegion,this.SelectedAssigneReport,this.SelectedGroupName).subscribe(PLdata =>{
        //this.StatusCounts = PLdata.Data;
        for(let i = 0; i<PLdata.Data.length;i++){
          if(PLdata.Data[i].Milestone__Assignee__Reports_to__Full_Name == null){
            this.Leaders.push("(Partners)");
          }
          else{
            this.Leaders.push(PLdata.Data[i].Milestone__Assignee__Reports_to__Full_Name.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' '));
          }
          this.LeadersCount.push(PLdata.Data[i].WorkspaceCount);
        }
        var data = {
          labels : this.Leaders,
          datasets : [
            {
              label : "Total Count By Leaders ("+Math.round(PLdata.Data.map(t => t.WorkspaceCount).reduce((acc,value) => acc + value,0))+")",
              data : this.LeadersCount,
              // backgroundColor: 'rgb(46, 204, 113 ,0.4)',
              // borderColor : 'rgb(46, 204, 113 ,1)',
              // hoverBackgroundColor : 'rgb(46, 204, 113 ,1)',
              backgroundColor : 'rgb(52, 152, 219 ,0.4)',
              borderColor : 'rgb(52, 152, 219 ,1)',
              hoverBackgroundColor : 'rgb(52, 152, 219 ,1)',
              borderWidth: 2,
              fill: false,
            }
          ]
        };
        var options = {
          legend: {
            display: true,
            position : 'bottom' as 'bottom',
            fullWidth : true,
            labels: {
                fontColor: '#000000',
                fontSize :  12,
                padding : 10,
                fontStyle : 'bold',
                fontFamily : 'Arial',
            }
          },
          hover: {
            mode: 'index' as 'index',
            intersect: false
          },
          title: {
            display: true,
            text: ' '
          },
          scales: {
            xAxes: [{
              ticks: {
                beginAtZero: true,
                fontSize : 10,
                fontStyle : 'bold',
                fontColor : '#000000',
                fontFamily : 'Arial',
              },
            }],
            yAxes: [{
              ticks: {
                beginAtZero:true,
                // max:700,
                fontSize : 10,
                fontStyle : 'bold',
                fontColor : '#000000',
                fontFamily : 'Arial',
              },
              gridLines: {
                color: "rgba(0, 0, 0, 0)",
              }
            }]
          },
          plugins: {
            datalabels: {
              anchor : 'end' as 'end',
              align : 'end' as 'end',
              color : 'black',
              backgroundColor : 'rgb(52, 152, 219,0.4)',
              padding : 3,
              borderRadius : 6,
              font: {
                size: 11,
                weight: 'bold' as 'bold'
              }
            }
          },
          tooltips: {
            mode: 'index' as 'index',
            intersect: false,
            callbacks: {
              label: function(tooltipItem) {
                      return tooltipItem.yLabel;
              }
            }
          },
        };
        var canvas : any = document.getElementById("LPcanvas");
        var ctx = canvas.getContext("2d");
        if(this.PLchart != undefined){
          this.PLchart.destroy();
        }
        this.PLchart = new Chart(ctx, {
          plugins: [ChartDataLabels],
          type: 'horizontalBar',
          data: data,
          options: options
        });
        this.dashboard.ShowSpinnerHandler(false);
      });
      this.GroupNames = [];
      this.GroupNamesCount = [];
      this.dashboard.ShowSpinnerHandler(true);
      this.service.GroupNameCountIMPS(this.dateStart.toLocaleDateString(),this.dateEnd.toLocaleDateString(),this.SelectedStatus,this.SelectedLevel,this.SelectedRegion,this.SelectedAssigneReport,this.SelectedGroupName).subscribe(GNdata =>{
        //this.GroupNamesCount = PLdata.Data;
        for(let i = 0; i<GNdata.Data.length;i++){
          if(GNdata.Data[i].Group_Name == null){
            this.GroupNames.push("(Blanks)");
          }
          else{
            this.GroupNames.push(GNdata.Data[i].Group_Name.toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' '));
          }
          this.GroupNamesCount.push(GNdata.Data[i].WorkspaceCount);
        }
        var data = {
          labels : this.GroupNames,
          datasets : [
            {
              label : "Total Count By Group Names ("+Math.round(GNdata.Data.map(t => t.WorkspaceCount).reduce((acc,value) => acc + value,0))+")",
              data : this.GroupNamesCount,
              backgroundColor : 'rgba(48, 219, 193 ,0.4)',
              borderColor : 'rgba(48, 219, 193 ,1)',
              hoverBackgroundColor : 'rgba(48, 219, 193,1)',
              // backgroundColor : 'rgb(52, 152, 219 ,0.4)',
              // borderColor : 'rgb(52, 152, 219 ,1)',
              // hoverBackgroundColor : 'rgb(52, 152, 219 ,1)',
              borderWidth: 2,
              fill : false
              //backgroundColor: 'rgb(70, 191, 189,0.7)',//rgb(59, 138, 217,0.9)',
              //           fill : false,
            }
          ]
        };
        var options = {
          responsive : true,
          legend: {
            display: true,
            position : 'bottom' as 'bottom',
            fullWidth : true,
            labels: {
              fontColor: '#000000',
              fontSize :  12,
              padding : 10,
              fontStyle : 'bold',
              fontFamily : 'Arial',
            }
          },
          title: {
            display: true,
            text: ' '
          },
          scales: {
            xAxes: [{
              ticks: {
                beginAtZero: true,
                fontSize : 10,
                fontStyle : 'bold',
                fontColor : '#000000',
                fontFamily : 'Arial',
              },
            }],
            yAxes: [{
              ticks: {
                beginAtZero:true,
                fontSize : 10,
                fontStyle : 'bold',
                fontColor : '#000000',
                fontFamily : 'Arial',
              },
              gridLines: {
                color: "rgba(0, 0, 0, 0)",
              }
            }]
          },
          plugins: {
            datalabels: {
              anchor : 'end' as 'end',
              align : 'end' as 'end',
              color : 'black',
              backgroundColor : 'rgb(48, 219, 193 ,0.4)',
              padding : 3,
              borderRadius : 6,
              font: {
                size: 11,
                weight: 'bold' as 'bold'
              }
            }
          },
          tooltips: {
            mode: 'index' as 'index',
            intersect: false,
            callbacks: {
              label: function(tooltipItem) {
                return tooltipItem.yLabel;
              }
            }
          },
        };
        var canvas : any = document.getElementById("GNcanvas");
        var ctx = canvas.getContext("2d");
        if(this.GNchart != undefined){
          this.GNchart.destroy();
        }
        this.GNchart = new Chart(ctx, {
          plugins: [ChartDataLabels],
          type: 'horizontalBar',
          data: data,
          options: options
        });
        this.dashboard.ShowSpinnerHandler(false);
        
      });
      this.Regions = [];
      this.RegionsCount = [];
      this.dashboard.ShowSpinnerHandler(true);
      this.service.RegionWiseCountIMPS(this.dateStart.toLocaleDateString(),this.dateEnd.toLocaleDateString(),this.SelectedStatus,this.SelectedLevel,this.SelectedRegion,this.SelectedAssigneReport,this.SelectedGroupName).subscribe(Rdata => {
        for(let i = 0; i<Rdata.Data.length;i++){
          if(Rdata.Data[i].Region == null){
            this.Regions.push("(Blanks)");
          }
          else{
            this.Regions.push(Rdata.Data[i].Region.toUpperCase());
          }
          this.RegionsCount.push(Rdata.Data[i].WorkspaceCount);
        }
        var data = {
          labels : this.Regions,
          datasets : [
            {
              label : "Total Count By Regions ("+Math.round(Rdata.Data.map(t => t.WorkspaceCount).reduce((acc,value) => acc + value,0))+")",
              data : this.RegionsCount,
              backgroundColor : 'rgba(48, 219, 193 ,0.4)',
              borderColor : 'rgba(48, 219, 193 ,1)',
              hoverBackgroundColor : 'rgba(48, 219, 193,1)',
              // backgroundColor : 'rgb(52, 152, 219 ,0.4)',
              // borderColor : 'rgb(52, 152, 219 ,1)',
              // hoverBackgroundColor : 'rgb(52, 152, 219 ,1)',
              borderWidth: 2,
              fill : false
              //backgroundColor: 'rgb(70, 191, 189,0.7)',//rgb(59, 138, 217,0.9)',
              //           fill : false,
            }
          ]
        };
        var options = {
          responsive : true,
          legend: {
            display: true,
            position : 'bottom' as 'bottom',
            fullWidth : true,
            labels: {
              fontColor: '#000000',
              fontSize :  12,
              padding : 10,
              fontStyle : 'bold',
              fontFamily : 'Arial',
            }
          },
          title: {
            display: true,
            text: ' '
          },
          scales: {
            xAxes: [{
              ticks: {
                beginAtZero: true,
                fontSize : 10,
                fontStyle : 'bold',
                fontColor : '#000000',
                fontFamily : 'Arial',
              },
            }],
            yAxes: [{
              ticks: {
                beginAtZero:true,
                fontSize : 10,
                fontStyle : 'bold',
                fontColor : '#000000',
                fontFamily : 'Arial',
              },
              gridLines: {
                color: "rgba(0, 0, 0, 0)",
              }
            }]
          },
          plugins: {
            datalabels: {
              anchor : 'end' as 'end',
              align : 'end' as 'end',
              color : 'black',
              backgroundColor : 'rgb(48, 219, 193 ,0.4)',
              padding : 3,
              borderRadius : 6,
              font: {
                size: 11,
                weight: 'bold' as 'bold'
              }
            }
          },
          tooltips: {
            mode: 'index' as 'index',
            intersect: false,
            callbacks: {
              label: function(tooltipItem) {
                return tooltipItem.yLabel;
              }
            }
          },
        };
        var canvas : any = document.getElementById("Regioncanvas");
        var ctx = canvas.getContext("2d");
        if(this.Regionchart != undefined){
          this.Regionchart.destroy();
        }
        this.Regionchart = new Chart(ctx, {
          plugins: [ChartDataLabels],
          type: 'horizontalBar',
          data: data,
          options: options
        });
        this.dashboard.ShowSpinnerHandler(false);
      })
      this.dashboard.ShowSpinnerHandler(true);
      this.service.ImplementationProjectStatusData(this.dateStart.toLocaleDateString(),this.dateEnd.toLocaleDateString(),this.SelectedStatus,this.SelectedLevel,this.SelectedRegion,this.SelectedAssigneReport,this.SelectedGroupName).subscribe(data =>{ //this.SelectedAssigne,
        this.Apply_disable = true;
        this.IMPSData = data.Data;
        for(let i = 0;i<data.Data.length;i++){
          //DateTime
          // if(this.IMPSData[i].Milestone__Project_Start_Date == null){
          // }else{
          //   this.IMPSData[i].Milestone__Project_Start_Date = this.datepipe.transform(this.IMPSData[i].Milestone__Project_Start_Date, "yyyy-MM-dd");
          // }
          if(this.IMPSData[i].Task_Start_Date == null){
            this.IMPSData[i].Task_Start_Date_c == null;
          }else{
            this.IMPSData[i].Task_Start_Date_c = this.datepipe.transform(this.IMPSData[i].Task_Start_Date, "dd-MMM-yyyy");
          }
        }
        this.dataSource = new MatTableDataSource(this.IMPSData);
        this.dataSource.sort = this.sort;
      this.dashboard.ShowSpinnerHandler(false);
      });
    }
  }
  exportAsXLSX(){
    if(this.dateEnd == null || this.dateStart == null || this.SelectedStatus == null || this.SelectedLevel == null || this.SelectedRegion == null || this.SelectedAssigneReport == null){
      alert("Please select all filters");
    }else{
      this.dashboard.ShowSpinnerHandler(true);
      this.service.ImplementationProjectStatusData(this.dateStart.toLocaleDateString(),this.dateEnd.toLocaleDateString(),this.SelectedStatus,this.SelectedLevel,this.SelectedRegion,this.SelectedAssigneReport,this.SelectedGroupName).subscribe(data =>{ 
        if(data.code == 200){
          for(let i=0;i < data.Data.length;i++){
            if(data.Data[i].Task_Start_Date == null){
              data.Data[i].Task_Start_Date_c = null;
            }else{
              data.Data[i].Task_Start_Date_c = this.datepipe.transform(data.Data[i].Task_Start_Date,"MM-dd-yyyy");
            }
          }
          const CustomizedData = data.Data.map(o => {
            return {
              'Workspace Title': o.Workspace_Title,
              'Workspace CRM Customer Row ID' : o.Workspace__CRM_Customer_Row_ID,
              'Workspace Project Level' : o.Workspace__Project_Level,
              'Workspace ELT Overall Status' : o.Workspace__ELT_Overall_Status,
              'Workspace ELT Overall Comments' : o.Workspace__ELT_Overall_Comments,
              'Milestone Title' : o.Milestone_Title,
              'Milestone Region' : o.Milestone__Region,
              'Milestone Record ID Key' : o.Milestone__Record_ID_Key,
              'Milestone Country' : o.Milestone__Country,
              'Milestone Project Status' : o.Milestone__Project_Status,
              '% Complete' : o.C__Complete,
              'Milestone Project Start Date' : o.Milestone__Project_Start_Date,
              'Milestone Assignee Full Name' : o.Milestone__Assignee__Full_Name,
              'Milestone Assignee Reports to Full Name' : o.Milestone__Assignee__Reports_to__Full_Name,
              'Task Title' : o.Task_Title,
              'Task Task Record ID Key' : o.Task__Task_Record_ID_Key,
              'Task Start Date' : o.Task_Start_Date_c,
              'Milestone CRM Revenue ID' : o.Milestone__CRM_Revenue_ID__,
              'Milestone Project Notes' : o.Milestone__Project_Notes,
              'Milestone Reason Code' : o.Milestone__Reason_Code,
              'Milestone Closed Loop Owner' : o.Milestone__Closed_Loop_Owner,
              'Group Name' : o.Group_Name,
            };
          });
          this.excelxsService.exportAsExcelFile(
          [
            {
              sheetName: 'Implementation Project Status',
              data: CustomizedData,
              defaultBackgroundColor : 'FF34495E',
              defaultTextColor : 'FFFFFFFF',
              columnFormats: {
                'dd/MMM/yyyy' : ['Milestone Project Start Date','Task Start Date'], // Negative and Positive Numbers with 2 decimals with Dolor Symbol
                '0' : ['% Complete','Workspace CRM Customer Row ID','Milestone CRM Revenue ID'],
              },
            },
          ],
          'Implementation Project Status'
        );
        }else{
          alert("Something went wrong, Please try again later");
        }
        this.service.UsersUsageofReports(this.LoginUID,"Implementation Project Status","Export").subscribe(data =>{
        })
        this.dashboard.ShowSpinnerHandler(false);
      });
    }
  }
  //Start of Status methods
  checkUncheckStatus() {
    for (var i = 0; i < this.statusList.length; i++) {
      this.statusList[i].isSelected = this.masterStatus;
    }
    this.getSelectedstatus();
  }
  statusSelected() {
    this.masterStatus = this.statusList.every(function(item:any) {
        return item.isSelected == true;
    })
    this.getSelectedstatus();
  }
  getSelectedstatus(){
    this.Apply_disable = false;
    this.SelectedStatus = null;
    for(let i=0;i<this.statusList.length;i++){
      if(this.statusList[i].isSelected == true){
        if(this.SelectedStatus == null){
          if(this.statusList[i].Milestone__Project_Status == null || this.statusList[i].Milestone__Project_Status == ""){
            this.SelectedStatus = ",";
          }else{
            this.SelectedStatus = this.statusList[i].Milestone__Project_Status;
          }
        }else{
          this.SelectedStatus += ","+this.statusList[i].Milestone__Project_Status;
        }
      }else{
      }
    }
    this.statusListSelected = this.statusList.filter(s => s.isSelected == true);
  }
  deselectstatus(val : string){
    for(let i=0;i<this.statusList.length;i++){
      if(this.statusList[i].Milestone__Project_Status == val){
        this.statusList[i].isSelected = false;
      }else{
      }
    }
    this.statusSelected();
  }
  //End of Status Methods
  //Start of Level methods
  checkUncheckLevel() {
    for (var i = 0; i < this.levelsList.length; i++) {
      this.levelsList[i].isSelected = this.masterLevel;
    }
    this.getSelectedlevel();
  }
  levelSelected() {
    this.masterLevel = this.levelsList.every(function(item:any) {
        return item.isSelected == true;
    })
    this.getSelectedlevel();
  }
  getSelectedlevel(){
    this.Apply_disable = false;
    this.SelectedLevel = null;
    for(let i=0;i<this.levelsList.length;i++){
      if(this.levelsList[i].isSelected == true){
        if(this.SelectedLevel == null){
          if(this.levelsList[i].Workspace__Project_Level == null || this.levelsList[i].Workspace__Project_Level == ""){
            this.SelectedLevel = ",";
          }else{
            this.SelectedLevel = this.levelsList[i].Workspace__Project_Level;
          }
        }else{
          this.SelectedLevel += ","+this.levelsList[i].Workspace__Project_Level;
        }
      }else{
      }
    }
    this.levelsListSelected = this.levelsList.filter(s => s.isSelected == true);
  }
  deselectlevels(val : string){
    for(let i=0;i<this.levelsList.length;i++){
      if(this.levelsList[i].Workspace__Project_Level == val){
        this.levelsList[i].isSelected = false;
      }else{
      }
    }
    this.levelSelected();
  }
  //End of Level Methods
  //Start of Region methods
  checkUncheckRegion() {
    for (var i = 0; i < this.regionList.length; i++) {
      this.regionList[i].isSelected = this.masterRegion;
    }
    this.getSelectedregion();
  }
  regionSelected() {
    this.masterRegion = this.regionList.every(function(item:any) {
        return item.isSelected == true;
    })
    this.getSelectedregion();
  }
  getSelectedregion(){
    this.Apply_disable = false;
    this.SelectedRegion = null;
    for(let i=0;i<this.regionList.length;i++){
      if(this.regionList[i].isSelected == true){
        if(this.SelectedRegion == null){
          if(this.regionList[i].Milestone__Region == null || this.regionList[i].Milestone__Region == ""){
            this.SelectedRegion = ",";
          }else{
            this.SelectedRegion = this.regionList[i].Milestone__Region;
          }
        }else{
          this.SelectedRegion += ","+this.regionList[i].Milestone__Region;
        }
      }else{
      }
    }
    this.regionListSelected = this.regionList.filter(s => s.isSelected == true);
  }
  deselectregion(val : string){
    for(let i=0;i<this.regionList.length;i++){
      if(this.regionList[i].Milestone__Region == val){
        this.regionList[i].isSelected = false;
      }else{
      }
    }
    this.regionSelected();
  }
  //End of Region Methods
  //Start of Assign methods
  // checkUncheckAssigne() {
  //   for (var i = 0; i < this.AssigneeList.length; i++) {
  //     this.AssigneeList[i].isSelected = this.masterAssigne;
  //   }
  //   this.getSelectedAssigne();
  // }
  // AssigneSelected() {
  //   this.masterAssigne = this.AssigneeList.every(function(item:any) {
  //       return item.isSelected == true;
  //   })
  //   this.getSelectedAssigne();
  // }
  // getSelectedAssigne(){
  //   this.SelectedAssigne = null;
  //   for(let i=0;i<this.AssigneeList.length;i++){
  //     if(this.AssigneeList[i].isSelected == true){
  //       if(this.SelectedAssigne == null){
  //         if(this.AssigneeList[i].Milestone__Assignee__Full_Name == null || this.AssigneeList[i].Milestone__Assignee__Full_Name == ""){
  //           this.SelectedAssigne = ",";
  //         }else{
  //           this.SelectedAssigne = this.AssigneeList[i].Milestone__Assignee__Full_Name;
  //         }
  //       }else{
  //         this.SelectedAssigne += ","+this.AssigneeList[i].Milestone__Assignee__Full_Name;
  //       }
  //     }else{
  //     }
  //   }
  //   this.AssigneeListSelected = this.AssigneeList.filter(s => s.isSelected == true);
  // }
  // deselectAssigne(val : string){
  //   for(let i=0;i<this.AssigneeList.length;i++){
  //     if(this.AssigneeList[i].Milestone__Assignee__Full_Name == val){
  //       this.AssigneeList[i].isSelected = false;
  //     }else{
  //     }
  //   }
  //   this.regionSelected();
  // }
  //End of Assign Methods
  
  //Start of Assign & Report To methods
  checkUncheckAssign_Report() {
    for (var i = 0; i < this.Assignee_ReportList.length; i++) {
      this.Assignee_ReportList[i].isSelected = this.masterAssignReport;
    }
    this.getSelectedAssignReport();
  }
  Assign_ReportSelected() {
    this.masterAssignReport = this.Assignee_ReportList.every(function(item:any) {
        return item.isSelected == true;
    })
    this.getSelectedAssignReport();
  }
  getSelectedAssignReport(){
    this.Apply_disable = false;
    this.SelectedAssigneReport = null;
    for(let i=0;i<this.Assignee_ReportList.length;i++){
      if(this.Assignee_ReportList[i].isSelected == true){
        if(this.SelectedAssigneReport == null){
          if(this.Assignee_ReportList[i].Milestone__Assignee__Reports_to__Full_Name == null || this.Assignee_ReportList[i].Milestone__Assignee__Reports_to__Full_Name == ""){
            this.SelectedAssigneReport = ",";
          }else{
            this.SelectedAssigneReport = this.Assignee_ReportList[i].Milestone__Assignee__Reports_to__Full_Name;
          }
        }else{
          this.SelectedAssigneReport += ","+this.Assignee_ReportList[i].Milestone__Assignee__Reports_to__Full_Name;
        }
      }else{
      }
    }
    this.Assignee_ReportListSelected = this.Assignee_ReportList.filter(s => s.isSelected == true);
  }
  deselectAssignReport(val : string){
    for(let i=0;i<this.Assignee_ReportList.length;i++){
      if(this.Assignee_ReportList[i].Milestone__Assignee__Reports_to__Full_Name == val){
        this.Assignee_ReportList[i].isSelected = false;
      }else{
      }
    }
    this.Assign_ReportSelected();
  }
  //End of Assign & Report To Methods
  //Start of GroupName To methods
  checkUncheckGroup_Name() {
    for (var i = 0; i < this.Group_NameList.length; i++) {
      this.Group_NameList[i].isSelected = this.masterGroupName;
    }
    this.getSelectedGroupName();
  }
  Group_NameSelected() {
    this.masterGroupName = this.Group_NameList.every(function(item:any) {
        return item.isSelected == true;
    })
    this.getSelectedGroupName();
  }
  getSelectedGroupName(){
    this.Apply_disable = false;
    this.SelectedGroupName = null;
    for(let i=0;i<this.Group_NameList.length;i++){
      if(this.Group_NameList[i].isSelected == true){
        if(this.SelectedGroupName == null){
          if(this.Group_NameList[i].Group_Name == null || this.Group_NameList[i].Group_Name == ""){
            this.SelectedGroupName = ",";
          }else{
            this.SelectedGroupName = this.Group_NameList[i].Group_Name;
          }
        }else{
          this.SelectedGroupName += ","+this.Group_NameList[i].Group_Name;
        }
      }else{
      }
    }
    this.Group_NameListSelected = this.Group_NameList.filter(s => s.isSelected == true);
  }
  deselectGroupName(val : string){
    for(let i=0;i<this.Group_NameList.length;i++){
      if(this.Group_NameList[i].Group_Name == val){
        this.Group_NameList[i].isSelected = false;
      }else{
      }
    }
    this.Group_NameSelected();
  }
  //End of Assign & Report To Methods
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
@Component({
  selector: 'app-implementation-project-statusdailog',
  templateUrl: './implementation-project-statusdailog.component.html',
  // styleUrls: ['./clrcommentdailog.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ImplementationProjectStatusdailog {
  constructor(
    public dialogRef: MatDialogRef<ImplementationProjectStatusdailog>,
    @Inject(MAT_DIALOG_DATA) public data: IMPSDailog) {}
  onNoClick(): void {
    this.dialogRef.close();
  }
}