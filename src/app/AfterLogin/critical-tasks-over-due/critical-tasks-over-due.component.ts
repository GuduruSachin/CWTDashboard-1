import { Component, OnInit, ViewChild } from '@angular/core';
import { DashboardServiceService } from '../../dashboard-service.service';
import { Chart } from 'chart.js';
import { ProjectStatus, CriticalOverDue, GroupName, TaskType, ProjectLevel, Region, Country, AssigneFullName } from '../../Models/CtoFilters';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort} from '@angular/material/sort';
import { LivedashboardComponent } from '../livedashboard/livedashboard.component';
import { DatePipe } from '@angular/common';
import { DashboardComponent } from '../dashboard/dashboard.component';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { FormControl } from '@angular/forms';
import { ExcelSXService } from '../../excelsx.service';

@Component({
  selector: 'app-critical-tasks-over-due',
  templateUrl: './critical-tasks-over-due.component.html',
  styleUrls: ['./critical-tasks-over-due.component.css']
})

export class CriticalTasksOverDueComponent implements OnInit {
  //SelectedStatus : any; SelectedOverDue : any; 
  SelectedGroupName : any; SelectedLevel : any; SelectedRegions : any; SelectedTaskType : any;
  // SelectedAssigne : any;
  //masterstatus : boolean; masteroverdue : boolean;
  mastergname : boolean; masterlevel  :boolean; masterregion : boolean; mastertasktype : boolean;
  // masterassigne : boolean;
  //mastercountry : boolean; SelectedCountry : any;
  // statusList : ProjectStatus[];
  // statusListSelected : ProjectStatus[];
  // overdueList : CriticalOverDue[];
  // overdueListSelected : CriticalOverDue[];
  TaskTypeList : TaskType[];
  TaskTypeListSelected : TaskType[];
  groupnameList : GroupName[];
  groupnameListSelected : GroupName[];
  levelList : ProjectLevel[];
  levelListSelected : ProjectLevel[];
  regionList : Region[];
  regionListSelected : Region[];
  // AssigneFullNameList : AssigneFullName[];
  // AssigneFullNameListSelected : AssigneFullName[];
  //countryList : Country[];
  Apply_disable : boolean;
  dataSource;
  Rcanvas : any;
  GNcanvas : any;
  ProjectStatus : any = [];
  ProjectCount : any = [];
  GroupNameCount : any = [];
  GroupNames : any = [];
  screenWidth : number;
  screenHeight : number;
  LoginUID : string;
  FilteredCount;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  displayedColumns: string[] = ['Workspace_Title', 'Milestone_Title_Country___Est_Go_Live_Date','Task_Title','Milestone__Project_Status','Milestone__Region','Workspace__Project_Level','Group_Name','OwnershipRevenue','Task_Due_Date_c','Task_Overdue'];
  constructor(public datepipe : DatePipe,public service : DashboardServiceService, public dashboard : LivedashboardComponent, private excelxsService : ExcelSXService) {
    //set screenWidth on page load
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    window.onresize = () => {
      //set screenWidth on screen size change
      this.screenWidth = window.innerWidth;
      this.screenHeight = window.innerHeight;
    };
   }
  ngOnInit() {
    this.ResetFilters();
  }
  ResetFilters(){
    this.LoginUID = localStorage.getItem("UID");
    this.dashboard.ShowSpinnerHandler(true);
    this.service.CriticalTaskFiltersList().subscribe(data =>{
      if(data.code == 200){
        this.TaskTypeList = data.TaskType;
        this.mastertasktype = true;
        this.getSelectedTaskType();
        this.groupnameList = data.GroupName;
        this.mastergname = true;
        this.getSelectedGName();
        this.levelList = data.ProjectLevel;
        this.masterlevel = true;
        this.getSelectedLevels();
        this.regionList = data.Region;
        this.masterregion = true;
        this.getSelectedRegion();
        // this.AssigneFullNameList = data.AssigneFullName;
        // this.masterassigne = true;
        // this.getSelectedAssigne();
        this.SetGraph();
      }
    });
    this.Apply_disable = true;
  }
  SetGraph(){
    if(this.SelectedGroupName == null || this.SelectedLevel == null || this.SelectedRegions == null){
      alert("Please Select all Filters");
    }else{
      this.dashboard.ShowSpinnerHandler(true);
      this.ProjectStatus = [];
      this.ProjectCount = [];
      this.GroupNameCount = [];
      this.GroupNames = [];
      console.log(this.SelectedTaskType,this.SelectedGroupName,this.SelectedLevel,this.SelectedRegions)
      this.service.CriticalTaskOverDue(this.SelectedTaskType,this.SelectedGroupName,this.SelectedLevel,this.SelectedRegions).subscribe(data =>{
        this.Apply_disable = true;
        if(data.code == 200){
          console.log(data.Data);
          for(let i=0;i < data.Data.length;i++){
            if(data.Data[i].Task_Due_Date == null){
              data.Data[i].Task_Due_Date_c = null;
            }else{
              data.Data[i].Task_Due_Date_c = this.datepipe.transform(data.Data[i].Task_Due_Date,"MM-dd-yyyy");
            }
          }
          this.dataSource = new MatTableDataSource(data.Data);
          this.FilteredCount = this.dataSource.data.length;
          this.dataSource.sort = this.sort;
        }else{
          this.dataSource = null;
        }
        this.dashboard.ShowSpinnerHandler(false);
      })
      this.dashboard.ShowSpinnerHandler(true);
      this.service.RegionWiseCount(this.SelectedTaskType,this.SelectedGroupName,this.SelectedLevel,this.SelectedRegions).subscribe(data =>{
        this.Apply_disable = true;
        var Options = {
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
          hover: {
            mode: 'index' as 'index',
            intersect: false
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
              backgroundColor : 'rgb(93, 173, 226)',
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
        }
        if(data.code == 200){
          data.Data.forEach( item =>{
            this.ProjectCount.push(item.ProjectsCount);
            this.ProjectStatus.push(item.Milestone__Region);
          })
          if(this.ProjectStatus != null && this.ProjectCount != null){
            if(this.Rcanvas != undefined){
              this.Rcanvas.destroy();
            }
            this.Rcanvas = new Chart('Rcanvas', {
              plugins: [ChartDataLabels],
              type: 'horizontalBar',
              data : {
                labels : this.ProjectStatus,
                //labels : ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
                datasets: [{
                  label: "Total Count By Region ("+Math.round(data.Data.map(t => t.ProjectsCount).reduce((acc,value) => acc + value,0))+")",
                  backgroundColor : 'rgba(93, 173, 226,1)',
                  borderColor : 'rgba(244, 246, 246 ,1)',
                  hoverBackgroundColor : 'rgba(93, 173, 226 ,0.6)',
                  borderWidth: 2,
                  data: this.ProjectCount,
                  fill: false,
                }]
              },
              options: Options,
            })
          }
        }else{
        }
        this.dashboard.ShowSpinnerHandler(false);
      });
      this.service.GroupNameCountCTO(this.SelectedTaskType,this.SelectedGroupName,this.SelectedLevel,this.SelectedRegions).subscribe(data =>{
        this.Apply_disable = true;
        var Options = {
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
          hover: {
            mode: 'index' as 'index',
            intersect: false
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
              backgroundColor : 'rgb(48, 219, 193)',
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
        }
        if(data.code == 200){
          data.Data.forEach( item =>{
            this.GroupNameCount.push(item.ProjectsCount);
            this.GroupNames.push(item.Group_Name);
          })
          if(this.GroupNames != null && this.GroupNameCount != null){
            if(this.GNcanvas != undefined){
              this.GNcanvas.destroy();
            }
            this.GNcanvas = new Chart('GNcanvas', {
              plugins: [ChartDataLabels],
              type: 'horizontalBar',
              data : {
                labels : this.GroupNames,
                //labels : ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
                datasets: [{
                  label: "Total Count By Group Names ("+Math.round(data.Data.map(t => t.ProjectsCount).reduce((acc,value) => acc + value,0))+")",
                  // backgroundColor : 'rgba(23, 32, 42 ,1)',
                  backgroundColor : 'rgba(48, 219, 193 ,1)',
                  borderColor : 'rgba(229, 231, 233 ,1)',
                  hoverBackgroundColor : 'rgba(48, 219, 193 ,0.6)',
                  borderWidth: 2,
                  data: this.GroupNameCount,
                  fill: false,
                }]
              },
              options: Options,
            })
          }
        }else{
        }
      });
    }
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.FilteredCount = this.dataSource.filteredData.length;
  }
  exportData(){
    this.dashboard.ShowSpinnerHandler(true);
    this.service.CriticalTaskOverDue(this.SelectedTaskType,this.SelectedGroupName,this.SelectedLevel,this.SelectedRegions).subscribe(data =>{
      if(data.code == 200){
        for(let i=0;i < data.Data.length;i++){
          if(data.Data[i].Estimated_Go_Live == null){
            data.Data[i].Estimated_Go_Live_c = null;
          }else{
            data.Data[i].Estimated_Go_Live_c = this.datepipe.transform(data.Data[i].Estimated_Go_Live,"MM-dd-yyyy");
          }
          if(data.Data[i].Milestone_Due_Date == null){
            data.Data[i].Milestone_Due_Date_c = null;
          }else{
            data.Data[i].Milestone_Due_Date_c = this.datepipe.transform(data.Data[i].Milestone_Due_Date,"MM-dd-yyyy");
          }
          if(data.Data[i].Task_Start_Date == null){
            data.Data[i].Task_Start_Date_c = null;
          }else{
            data.Data[i].Task_Start_Date_c = this.datepipe.transform(data.Data[i].Task_Start_Date,"MM-dd-yyyy");
          }
          if(data.Data[i].Task_Due_Date == null){
            data.Data[i].Task_Due_Date_c = null;
          }else{
            data.Data[i].Task_Due_Date_c = this.datepipe.transform(data.Data[i].Task_Due_Date,"MM-dd-yyyy");
          }
        }
        const CustomizedData = data.Data.map(o => {
          return {
            'Milestone Title Country Est Go Live Date' : o.Milestone_Title_Country___Est_Go_Live_Date,
            'Critical Overdue' : o.Critical_Overdue,
            'Estimated Go Live' : o.Estimated_Go_Live_c,
            'Workspace Title' : o.Workspace_Title,
            'Milestone Project Status' : o.Milestone__Project_Status,
            'Group Name' : o.Group_Name,
            'Milestone Region' : o.Milestone__Region,
            'Milestone Country' : o.Milestone__Country,
            'Milestone Title' : o.Milestone_Title,
            'Milestone Assignee Full Name' : o.Milestone__Assignee__Full_Name,
            'Milestone Due Date' : o.Milestone_Due_Date_c,
            'Milestone Country Status' : o.Milestone__Country_Status,
            'Task List Title' : o.Task_List_Title,
            'Task Title' : o.Task_Title,
            'Task Assignee Full Name' : o.Task__Assignee__Full_Name,
            'OwnershipRevenue' : o.OwnershipRevenue,
            'Task Status' : o.Task_Status,
            'Task Overdue' : o.Task_Overdue,
            'Task Start Date' : o.Task_Start_Date_c,
            'Task Due Date' : o.Task_Due_Date_c,
            'Workspace Project Level' : o.Workspace__Project_Level,
            'TaskType' : o.TaskType,
          };
        });
        this.excelxsService.exportAsExcelFile(
          [
            {
              sheetName: 'Task Over Due',
              data: CustomizedData,
              defaultBackgroundColor : 'FF34495E',
              defaultTextColor : 'FFFFFFFF',
              columnFormats: {
                'dd/MMM/yyyy' : ['Estimated Go Live','Milestone Due Date','Task Start Date','Task Due Date'], // Negative and Positive Numbers with 2 decimals with Dolor Symbol
                '0' : ['Critical Overdue','Task Overdue']
              },
            },
          ],
          'CriticalTaskOverDue'
        );
      }else{
        alert("Something Went wrong, Please Try again later");
      }
      this.service.UsersUsageofReports(this.LoginUID,"Critical Task Overdue","Export").subscribe(data =>{
      })
      this.dashboard.ShowSpinnerHandler(false);
    });
  }
  
  
  //Start of TaskType Methods
  checkUncheckTaskType(){
    for (var i = 0; i < this.TaskTypeList.length; i++) {
      this.TaskTypeList[i].isSelected = this.mastertasktype;
    }
    this.getSelectedTaskType();
  }
  task_typeSelected() {
    this.mastertasktype = this.TaskTypeList.every(function(item:any) {
        return item.isSelected == true;
    })
    this.getSelectedTaskType();
  }
  getSelectedTaskType(){
    this.Apply_disable = false;
    this.SelectedTaskType = null;
    for(let i=0;i<this.TaskTypeList.length;i++){
      if(this.TaskTypeList[i].isSelected == true){
        if(this.SelectedTaskType == null){
          if(this.TaskTypeList[i].TaskType == null){
            this.SelectedTaskType = "";
          }else{
            this.SelectedTaskType = this.TaskTypeList[i].TaskType;
          }
        }else{
          this.SelectedTaskType += ","+this.TaskTypeList[i].TaskType;
        }
      }else{
      }
    }
    this.TaskTypeListSelected = this.TaskTypeList.filter(s => s.isSelected == true);
  }
  deselectTaskType(val : string){
    for(let i=0;i<this.TaskTypeList.length;i++){
      if(this.TaskTypeList[i].TaskType == val){
        this.TaskTypeList[i].isSelected = false;
      }else{
      }
    }
    this.task_typeSelected();
  }
  //End of TaskType Methods
  //Start of GroupName Methods
  checkUncheckGName() {
    for (var i = 0; i < this.groupnameList.length; i++) {
      this.groupnameList[i].isSelected = this.mastergname;
    }
    this.getSelectedGName();
  }
  gnameSelected() {
    this.mastergname = this.groupnameList.every(function(item:any) {
        return item.isSelected == true;
    })
    this.getSelectedGName();
  }
  getSelectedGName(){
    this.Apply_disable = false;
    this.SelectedGroupName = null;
    for(let i=0;i<this.groupnameList.length;i++){
      if(this.groupnameList[i].isSelected == true){
        if(this.SelectedGroupName == null){
          if(this.groupnameList[i].Group_Name == null){
            this.SelectedGroupName = ""
          }else{
            this.SelectedGroupName = this.groupnameList[i].Group_Name;
          }
        }else{
          this.SelectedGroupName += ","+this.groupnameList[i].Group_Name;
        }
      }else{
      }
    }
    this.groupnameListSelected = this.groupnameList.filter(s => s.isSelected == true);
  }
  deselectgname(val : string){
    for(let i=0;i<this.groupnameList.length;i++){
      if(this.groupnameList[i].Group_Name == val){
        this.groupnameList[i].isSelected = false;
      }else{
      }
    }
    this.gnameSelected();
  }
  //End of GroupName Methods
  //Start of Level Methods
  checkUncheckLevel() {
    for (var i = 0; i < this.levelList.length; i++) {
      this.levelList[i].isSelected = this.masterlevel;
    }
    this.getSelectedLevels();
  }
  levelSelected() {
    this.masterlevel = this.levelList.every(function(item:any) {
        return item.isSelected == true;
    })
    this.getSelectedLevels();
  }
  getSelectedLevels(){
    this.Apply_disable = false;
    this.SelectedLevel = null;
    for(let i=0;i<this.levelList.length;i++){
      if(this.levelList[i].isSelected == true){
        if(this.SelectedLevel == null){
          if(this.levelList[i].Workspace__Project_Level == null){
            this.SelectedLevel = ""
          }else{
            this.SelectedLevel = this.levelList[i].Workspace__Project_Level;
          }
        }else{
          this.SelectedLevel += ","+this.levelList[i].Workspace__Project_Level;
        }
      }else{
      }
    }
    this.levelListSelected = this.levelList.filter(s => s.isSelected == true);
  }
  deselectLevel(val : string){
    for(let i=0;i<this.levelList.length;i++){
      if(this.levelList[i].Workspace__Project_Level == val){
        this.levelList[i].isSelected = false;
      }else{
      }
    }
    this.levelSelected();
  }
  //End of Level Methods
  //Start of Region Methods
  checkUncheckRegion() {
    for (var i = 0; i < this.regionList.length; i++) {
      this.regionList[i].isSelected = this.masterregion;
    }
    this.getSelectedRegion();
  }
  regionSelected() {
    this.masterregion = this.regionList.every(function(item:any) {
        return item.isSelected == true;
    })
    this.getSelectedRegion();
  }
  getSelectedRegion(){
    this.Apply_disable = false;
    this.SelectedRegions = null;
    for(let i=0;i<this.regionList.length;i++){
      if(this.regionList[i].isSelected == true){
        if(this.SelectedRegions == null){
          if(this.regionList[i].Milestone__Region == null){
            this.SelectedRegions = ""
          }else{
            this.SelectedRegions = this.regionList[i].Milestone__Region;
          }
        }else{
          this.SelectedRegions += ","+this.regionList[i].Milestone__Region;
        }
      }else{
      }
    }
    this.regionListSelected = this.regionList.filter(s => s.isSelected == true);
  }
  deselectRegion(val : string){
    for(let i=0;i<this.regionList.length;i++){
      if(this.regionList[i].Milestone__Region == val){
        this.regionList[i].isSelected = false;
      }else{
      }
    }
    this.regionSelected();
  }
  // checkUncheckAssigne() {
  //   for (var i = 0; i < this.AssigneFullNameList.length; i++) {
  //     this.AssigneFullNameList[i].isSelected = this.masterassigne;
  //   }
  //   this.getSelectedAssigne();
  // }
  // AssigneSelected() {
  //   this.masterassigne = this.AssigneFullNameList.every(function(item:any) {
  //       return item.isSelected == true;
  //   })
  //   this.getSelectedAssigne();
  // }
  // getSelectedAssigne(){
  //   this.Apply_disable = false;
  //   this.SelectedAssigne = null;
  //   for(let i=0;i<this.AssigneFullNameList.length;i++){
  //     if(this.AssigneFullNameList[i].isSelected == true){
  //       if(this.SelectedAssigne == null){
  //         if(this.AssigneFullNameList[i].AssigneFullName == null){
  //           this.SelectedAssigne = ""
  //         }else{
  //           this.SelectedAssigne = this.AssigneFullNameList[i].AssigneFullName;
  //         }
  //       }else{
  //         this.SelectedAssigne += ","+this.AssigneFullNameList[i].AssigneFullName;
  //       }
  //     }else{
  //     }
  //   }
  //   this.AssigneFullNameListSelected = this.AssigneFullNameList.filter(s => s.isSelected == true);
  // }
  //End of Region Methods
  //Start of Quarter Methods
  // checkUncheckCountry() {
  //   for (var i = 0; i < this.countryList.length; i++) {
  //     this.countryList[i].isSelected = this.mastercountry;
  //   }
  //   this.getSelectedCountry();
  // }
  // countrySelected() {
  //   this.mastercountry = this.countryList.every(function(item:any) {
  //       return item.isSelected == true;
  //   })
  //   this.getSelectedCountry();
  // }
  // getSelectedCountry(){
  //   this.SelectedCountry = null;
  //   for(let i=0;i<this.countryList.length;i++){
  //     if(this.countryList[i].isSelected == true){
  //       if(this.SelectedCountry == null){
  //         this.SelectedCountry = this.countryList[i].Milestone__Country;
  //       }else{
  //         this.SelectedCountry += ","+this.countryList[i].Milestone__Country;
  //       }
  //     }else{
  //     }
  //   }
  // }
  //End of Quarter Methods
}