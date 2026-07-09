import { Component, OnInit, ViewChild } from '@angular/core';
import { Year,  Region, c_MilestoneStatus, c_ProjectLevel, c_ImplementationType, c_Month} from '../../Models/Filters';
import { DashboardServiceService } from '../../dashboard-service.service';
import { MatDialog } from '@angular/material/dialog';
import { Chart } from 'chart.js';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { ExcelSXService } from '../../excelsx.service';
import { LivedashboardComponent } from '../livedashboard/livedashboard.component';
import { Data } from 'src/app/Models/Responce';
import { CLRCommentdailog } from '../automated-clr/automated-clr.component';
import { DatePipe } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Observable, Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-cycle-time',
  templateUrl: './cycle-time.component.html',
  styleUrls: ['./cycle-time.component.css']
})
export class CycleTimeComponent implements OnInit {
  screenWidth : number;
  screenHeight : number;
  CurrentYear;
  Allcanvas : any;
  TargetsCanvas : any;
  Globalcanvas : any;
  Localcanvas : any;
  Regionalcanvas : any;
  Apply_disable : boolean;
  c_yearList : Year[];
  c_monthList : c_Month[];
  c_levelList : c_ProjectLevel[];
  c_levelListSelected : c_ProjectLevel[];
  c_regionList : Region[];
  SelectedCategory : string;
  SelectedMonth : string;
  c_MilestonestatusList : c_MilestoneStatus[];
  c_implementationtypeList: c_ImplementationType[];
  dataSource;
  dataSource_data;
  CycleTimeData : Data[];
  c_masteryear : boolean;c_mastermonth : boolean;c_masterlevel : boolean;c_masterMilestonestatus : boolean;c_masterregion : boolean;c_masterimplementation : boolean;
  c_SelectedYears : any;c_SelectedMonths : any;c_SelectedLevels : any;c_SelectedMilestonestatus : any;c_SelectedRegions : any;c_SelectedImplementation : any;
  displayedColumns: string[] = ['CycleTimeCategory', 'January_A','February_A','March_A','April_A','May_A','June_A','July_A','August_A','September_A','October_A','November_A','December_A','Total_A','Target_A',];//'H_One_A','TargetH1','H_Two_A','TargetCycleTime'//,'Total_A'
  // 'TargetH1',
  displayedColumns_data: string[] = ['Client', 'RevenueID','Workspace_Title','MilestoneTitle','ImplementationType','Region','Country','ProjectStatus','ProjectLevel','GoLive','ProjectStart','CycleTime','CycleTimeCategories','CycleTimeDelayCode','EltClientDelayDescription','GoLiveYear','GoLiveMonth'];
  constructor(public datepipe : DatePipe,public service : DashboardServiceService,public dialog: MatDialog,
    public dashboard : LivedashboardComponent,private excelxsService : ExcelSXService) {
    //set screenWidth on page load
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    window.onresize = () => {
      //set screenWidth on screen size change
      this.screenWidth = window.innerWidth;
      this.screenHeight = window.innerHeight;
    };
  }
  @ViewChild(MatSort) sort: MatSort;
  ngOnInit() {
    this.dashboard.ShowSpinnerHandler(true);
    this.service.CycleTimeFilters().subscribe(data =>{
      this.c_yearList = data.Year;
      this.c_masteryear = false;
      this.CurrentYear = (new Date()).getFullYear();
      for (var i = 0; i < this.c_yearList.length; i++) {
        if(this.c_yearList[i].Go_Live_Year == this.CurrentYear){
          this.c_yearList[i].isSelected = true;
        }
        else{
          this.c_yearList[i].isSelected = false;
        }
      }
      this.c_getSelectedYear();
      this.c_regionList = data.Region;
      this.c_masterregion = true;
      this.c_getSelectedRegion();
      this.c_MilestonestatusList = data.c_MilestoneStatus;
      this.c_masterMilestonestatus = false;
      for(var i = 0;i<this.c_MilestonestatusList.length;i++){
        if(this.c_MilestonestatusList[i].ProjectStatus == "C-Closed"){
          this.c_MilestonestatusList[i].isSelected = true;
        }else{
          this.c_MilestonestatusList[i].isSelected = false;
        }
      }
      this.c_getSelectedMilestoneStatus();
      this.SetGraph('Overall');
      this.SelectedCategory = 'Overall';
      this.dashboard.ShowSpinnerHandler(false);
    });
  }
  ResetFilters(){
    this.ngOnInit();
  }
  CategoryClick(SelectedCategory : string){
    this.dashboard.ShowSpinnerHandler(true);
    this.SelectedCategory = SelectedCategory;
    this.SetChartGraph(SelectedCategory);
    this.dashboard.ShowSpinnerHandler(false);
    this.FilterValuesinDataSource(SelectedCategory)
    
  }
  FilterValuesinDataSource(SelectedCategory : string){
    if(SelectedCategory == "Overall"){
      this.filteredData = this.OriginalData
    }else{
      this.filteredData = this.OriginalData.filter(item => {return item.CycleTimeCategories == SelectedCategory})
    }
    this.dataSource_data = new MatTableDataSource(this.filteredData);
    this.dataSource_data.sort = this.sort;
  }
  OriginalData = [];
  filteredData = [];
  onCategoryMonthClick(SelectedCategory : string,SelecetedMonth : string){
    this.SelectedCategory = SelectedCategory;
    this.SelectedMonth = SelecetedMonth;
    if(SelectedCategory == "Overall"){
      this.filteredData = this.OriginalData.filter(item => { return item.GoLiveMonth == SelecetedMonth})
    }else{
      this.filteredData = this.OriginalData.filter(item => { return item.GoLiveMonth == SelecetedMonth && item.CycleTimeCategories == SelectedCategory})
    }
    this.dataSource_data = new MatTableDataSource(this.filteredData);
    this.dataSource_data.sort = this.sort;
  }
  NewGlobal : number = 0;NewRegional : number = 0;NewLocal : number = 0;Overall : number = 0;ExistingAddChangeOBT : number = 0;ExistingServiceConfigChange : number = 0;TargetID;
  // H_NewGlobal : number = 0;H_NewRegional : number = 0;H_NewLocal : number = 0;H_Overall : number = 0;H_ExistingAddChangeOBT : number = 0;H_ExistingServiceConfigChange : number = 0;H_TargetID;
  
  imageUrl : string = "assets/images/cwt.png";
  SetGraph(SelectedCaegory : string){
    this.dataSource = null;
    this.dataSource_data = null;
    this.OriginalData = null;
    this.filteredData = null;
    this.SelectedCategory = SelectedCaegory;
    this.SelectedMonth = "";
    var backgroundColor = [
      'rgb(241, 145, 65)','rgb(59, 138, 217,0.5)','rgb(14, 61, 89)', 'rgb(255, 219, 105)', 'rgb(217,37,38)', 'rgb(75, 192, 192)', 'rgb(255, 99, 132)'
    ]
    var bordercolor = [
      'rgba(241, 130, 38,0.9)','rgba(59, 138, 217,0.9)','rgba(14, 61, 89)', 'rgba(255, 219, 105)', 'rgba(217,37,38)', 'rgba(75, 192, 192)', 'rgba(255, 99, 132)'
    ]
    var CountDataset = [];
    var CycleCountDataset = [];
    var CycleTimeDataset = [];
    var Options2 = {
      responsive : true,
      bezierCurve: false,
      hover: {
        mode: 'index',
        intersect: false,
        animationDuration: 0 
      },
      legend: {
        display: true,
        position : 'bottom',
        fullWidth : true,
        labels: {
            fontColor: '#000000',
            fontSize :  13,
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
        yAxes: [{
          id: 'A',
          type: 'linear',
          position: 'left',
          ticks: {
            fontSize : 12,
            fontStyle : 'normal',
            fontColor : '#000000',
            fontFamily : 'Arial',
          },
          gridLines: {
            color: "rgba(0, 0, 0, 0)",
          },
          scaleLabel: {
            display: true,
            labelString: 'Cycle Time',
            fontSize : 14,
            fontStyle : 'normal',
            fontColor : '#000000',
            fontFamily : 'Arial',
          }
        },{
          id: 'B',
          type: 'linear',
          position: 'right',
          ticks: {
            fontSize : 12,
            fontStyle : 'normal',
            fontColor : '#000000',
            fontFamily : 'Arial',
          },
          gridLines: {
            color: "rgba(0, 0, 0, 0)",
          },
          scaleLabel: {
            display: true,
            labelString: 'Projects Count',
            fontSize : 14,
            fontStyle : 'normal',
            fontColor : '#000000',
            fontFamily : 'Arial',
          }
        }],
        xAxes: [{
          ticks: {
            fontSize : 12,
            fontStyle : 'normal',
            fontColor : '#000000',
            fontFamily : 'Arial',
          },
          gridLines: {
            color: "rgba(0, 0, 0, 0)",
          },
        }]
      },
      plugins :{
        labels: {
          render : function(args){
            return Math.round(args.value);
          },
          fontColor: '#3B3B3B',
          position: 'outside',
          textMargin: 6,
          fontSize: 13,
          fontStyle : 'bold',
          fontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
        }
        // labels : false,
      },
      animation: {
        duration: 0, // general animation time
      },
      responsiveAnimationDuration: 0, // animation duration after a resize
      tooltips: {
        callbacks: {
          label: function(tooltipItems, data) {
            if(tooltipItems.datasetIndex === 0){
              // return data.labels[tooltipItems.index] +
              return " Project Count : " + 
              Math.round(data.datasets[tooltipItems.datasetIndex].data[tooltipItems.index]);
            }else if(tooltipItems.datasetIndex === 1){
              // return data.labels[tooltipItems.index] +
              return " Cycle Time : " + 
              Math.round(data.datasets[tooltipItems.datasetIndex].data[tooltipItems.index]);
            }
          }
        }
      },
    }
    if(this.c_SelectedYears == null || this.c_SelectedRegions == null || this.c_SelectedMilestonestatus == null){
      alert("Please select all Years");
    }else{
      this.service.TargetCycleTimeData(this.c_SelectedYears).subscribe(data =>{
        if(data.Data.length < 1 || data.Data == null || data.Data == undefined){
        }else{
          if(data.Data[0].ExistingAddChange == null){
            this.ExistingAddChangeOBT = 0;
          }else{
            this.ExistingAddChangeOBT = data.Data[0].ExistingAddChange;
          }
          if(data.Data[0].ExistingServiceConfigChange == null){
            this.ExistingServiceConfigChange = 0;
          }else{
            this.ExistingServiceConfigChange = data.Data[0].ExistingServiceConfigChange;
          }
          this.TargetID = data.Data[0].TargetID;
          if(data.Data[0].NewGlobal == null){
            this.NewGlobal = 0;
          }else{
            this.NewGlobal = data.Data[0].NewGlobal;
          }
          if(data.Data[0].NewRegional == null){
            this.NewRegional = 0;
          }else{
            this.NewRegional = data.Data[0].NewRegional;
          }
          if(data.Data[0].NewLocal == null){
            this.NewLocal = 0;
          }else{
            this.NewLocal = data.Data[0].NewLocal;
          }
          if(data.Data[0].Overall == null){
            this.Overall = 0;
          }else{
            this.Overall = data.Data[0].Overall;
          }
        }
      })
      this.allloader = true;
      this.m_loader = true;
      if(this.Allcanvas != undefined){
        this.Allcanvas.destroy();
      }
      if(this.TargetsCanvas != undefined){
        this.TargetsCanvas.destroy();
      }
      this.service.CycleTimeChartVolumeCount(this.c_SelectedYears,this.c_SelectedRegions,this.c_SelectedMilestonestatus,SelectedCaegory).subscribe(data =>{
        if(data.code == 200){
          this.SetChartGraph(SelectedCaegory);
          if(SelectedCaegory == "Overall" || SelectedCaegory == null){
            for(let i = 0; i<data.CycleTimeByCategories.length;i++){
              if(data.CycleTimeByCategories[i].CycleTimeCategory == "Overall"){
                data.CycleTimeByCategories[i].Target_A = Math.round(this.Overall);
              }else if(data.CycleTimeByCategories[i].CycleTimeCategory == "Existing Add/Change OBT"){
                data.CycleTimeByCategories[i].Target_A = Math.round(this.ExistingAddChangeOBT);
              }else if(data.CycleTimeByCategories[i].CycleTimeCategory == "New Local Including Upsell"){
                data.CycleTimeByCategories[i].Target_A = Math.round(this.NewLocal);
              }else if(data.CycleTimeByCategories[i].CycleTimeCategory == "New Global Including Upsell"){
                data.CycleTimeByCategories[i].Target_A = Math.round(this.NewGlobal);
              }else if(data.CycleTimeByCategories[i].CycleTimeCategory == "New Regional Including Upsell"){
                data.CycleTimeByCategories[i].Target_A = Math.round(this.NewRegional);
              }else if(data.CycleTimeByCategories[i].CycleTimeCategory == "Existing Service Config Change (catch all including Spins/Mergers)"){
                data.CycleTimeByCategories[i].Target_A = Math.round(this.ExistingServiceConfigChange);
              }
              data.CycleTimeByCategories[i].January_A = Math.round(data.CycleTimeByCategories[i].January_A);
              data.CycleTimeByCategories[i].February_A = Math.round(data.CycleTimeByCategories[i].February_A);
              data.CycleTimeByCategories[i].March_A = Math.round(data.CycleTimeByCategories[i].March_A);
              data.CycleTimeByCategories[i].April_A = Math.round(data.CycleTimeByCategories[i].April_A);
              data.CycleTimeByCategories[i].May_A = Math.round(data.CycleTimeByCategories[i].May_A);
              data.CycleTimeByCategories[i].June_A = Math.round(data.CycleTimeByCategories[i].June_A);
              data.CycleTimeByCategories[i].H_One_A= Math.round(data.CycleTimeByCategories[i].H_One_A);
              data.CycleTimeByCategories[i].July_A = Math.round(data.CycleTimeByCategories[i].July_A);
              data.CycleTimeByCategories[i].August_A = Math.round(data.CycleTimeByCategories[i].August_A);
              data.CycleTimeByCategories[i].September_A = Math.round(data.CycleTimeByCategories[i].September_A);
              data.CycleTimeByCategories[i].October_A = Math.round(data.CycleTimeByCategories[i].October_A);
              data.CycleTimeByCategories[i].November_A = Math.round(data.CycleTimeByCategories[i].November_A);
              data.CycleTimeByCategories[i].December_A = Math.round(data.CycleTimeByCategories[i].December_A);
              data.CycleTimeByCategories[i].H_Two_A= Math.round(data.CycleTimeByCategories[i].H_Two_A);
              data.CycleTimeByCategories[i].Total_A = Math.round(data.CycleTimeByCategories[i].Total_A);
            }
            this.CycleTimeData = data.CycleTimeByCategories;
            for(let i = 0;i<data.CycleTimeData.length;i++){
              if(data.CycleTimeData[i].ProjectStart_ForCycleTime == null){
                data.CycleTimeData[i].ProjectStart = "---";
              }else{
                data.CycleTimeData[i].ProjectStart = this.datepipe.transform(data.CycleTimeData[i].ProjectStart_ForCycleTime, "yyyy-MMM-dd");
              }
              if(data.CycleTimeData[i].GoLiveDate == null){
                data.CycleTimeData[i].GoLive = "---";
              }else{
                data.CycleTimeData[i].GoLive = this.datepipe.transform(data.CycleTimeData[i].GoLiveDate, "yyyy-MMM-dd");
              }
            }
            this.OriginalData = data.CycleTimeData;
            this.filteredData = data.CycleTimeData;
            this.dataSource_data = new MatTableDataSource(this.OriginalData);
            this.dataSource_data.sort = this.sort;
          }
          if(SelectedCaegory == 'Overall'){
            this.CycleTimeDataSearch = '';
            this.dataSource_data.filter = this.CycleTimeDataSearch.trim().toLowerCase();
          }else{
            this.CycleTimeDataSearch = SelectedCaegory;
            this.dataSource_data.filter = this.CycleTimeDataSearch.trim().toLowerCase();
          }
        }
      })
    }
    this.Apply_disable = true;
  }
  
  Dailog_Comment : string;
  Dailog_RevenueID : string;
  Dailog_Client : string;
  ShowComment(Dailog_Client : string,Dailog_RevenueID : string,Dailog_Comment : string){
    this.Dailog_Client = Dailog_Client;
    this.Dailog_RevenueID = Dailog_RevenueID;
    this.Dailog_Comment = Dailog_Comment;
    this.openDialog();
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(CLRCommentdailog, {
      // width: '400px',
      data: {Dailog_Comment: this.Dailog_Comment,Dailog_Client : this.Dailog_Client,Dailog_RevenueID : this.Dailog_RevenueID}
    });
    dialogRef.afterClosed().subscribe(result => {
      //this.Comment = result;
      // this.GetData();
    });
  }
  private subscription: Subscription;
  private timer: Observable<any>;
  allloader : boolean = true;
  m_loader : boolean = true;
  SetChartGraph(SelectedCaegory : string){
    var Options2 = {
      responsive : true,
      bezierCurve: false,
      hover: {
        mode: 'index' as 'index',
        intersect: false,
        animationDuration: 0 
      },
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
      title: {
        display: true,
        text: ' '
      },
      scales: {
        yAxes: [{
          id: 'A',
          type: 'linear',
          position: 'left',
          ticks: {
            fontSize : 12,
            fontStyle : 'normal',
            fontColor : '#000000',
            fontFamily : 'Arial',
          },
          gridLines: {
            color: "rgba(0, 0, 0, 0)",
          },
          scaleLabel: {
            display: true,
            labelString: 'Cycle Time',
            fontSize : 14,
            fontStyle : 'normal',
            fontColor : '#000000',
            fontFamily : 'Arial',
          }
        },{
          id: 'B',
          type: 'linear',
          position: 'right',
          ticks: {
            fontSize : 12,
            fontStyle : 'normal',
            fontColor : '#000000',
            fontFamily : 'Arial',
          },
          gridLines: {
            color: "rgba(0, 0, 0, 0)",
          },
          scaleLabel: {
            display: true,
            labelString: 'Projects Count',
            fontSize : 14,
            fontStyle : 'normal',
            fontColor : '#000000',
            fontFamily : 'Arial',
          }
        }],
        xAxes: [{
          ticks: {
            fontSize : 12,
            fontStyle : 'normal',
            fontColor : '#000000',
            fontFamily : 'Arial',
          },
          gridLines: {
            color: "rgba(0, 0, 0, 0)",
          },
        }]
      },
      plugins :{
        labels: {
          render : function(args){
            return Math.round(args.value);
          },
          fontColor: '#3B3B3B',
          position: 'outside',
          textMargin: 6,
          fontSize: 13,
          fontStyle : 'bold',
          fontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
        }
        // labels : false,
      },
      animation: {
        duration: 0, // general animation time
      },
      responsiveAnimationDuration: 0, // animation duration after a resize
      tooltips: {
        callbacks: {
          label: function(tooltipItems, data) {
            if(tooltipItems.datasetIndex === 0){
              // return data.labels[tooltipItems.index] +
              return " Project Count : " + 
              Math.round(data.datasets[tooltipItems.datasetIndex].data[tooltipItems.index]);
            }else if(tooltipItems.datasetIndex === 1){
              // return data.labels[tooltipItems.index] +
              return " Cycle Time : " + 
              Math.round(data.datasets[tooltipItems.datasetIndex].data[tooltipItems.index]);
            }
          }
        }
      },
    }
    // var Options = {
    //   responsive : true,
    //   bezierCurve: false,
    //   hover: {
    //     mode: 'index' as 'index',
    //     intersect: false,
    //     animationDuration: 0 
    //   },
    //   legend: {
    //     display: true,
    //     position : 'bottom' as 'bottom',
    //     fullWidth : true,
    //     labels: {
    //         fontColor: '#000000',
    //         fontSize :  13,
    //         padding : 10,
    //         fontStyle : 'bold',
    //         fontFamily : 'Arial',
    //     }
    //   },
    //   title: {
    //     display: true,
    //     text: ' '
    //   },
    //   scales: {
    //     yAxes: [{
    //       id: 'A',
    //       type: 'linear',
    //       position: 'left',
    //       ticks: {
    //         fontSize : 12,
    //         fontStyle : 'normal',
    //         fontColor : '#000000',
    //         fontFamily : 'Arial',
    //       },
    //       gridLines: {
    //         color: "rgba(0, 0, 0, 0)",
    //       },
    //       scaleLabel: {
    //         display: true,
    //         labelString: 'Cycle Time',
    //         fontSize : 14,
    //         fontStyle : 'normal',
    //         fontColor : '#000000',
    //         fontFamily : 'Arial',
    //       }
    //     }],
    //     xAxes: [{
    //       ticks: {
    //         fontSize : 12,
    //         fontStyle : 'normal',
    //         fontColor : '#000000',
    //         fontFamily : 'Arial',
    //       },
    //       gridLines: {
    //         color: "rgba(0, 0, 0, 0)",
    //       },
    //     }]
    //   },
    //   plugins :{
    //     labels: {
    //       render : function(args){
    //         return Math.round(args.value);
    //       },
    //       fontColor: '#3B3B3B',
    //       position: 'outside',
    //       textMargin: 6,
    //       fontSize: 13,
    //       fontStyle : 'bold',
    //       fontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
    //     }
    //     // labels : false,
    //   },
    //   animation: {
    //     duration: 0, // general animation time
    //   },
    //   responsiveAnimationDuration: 0, // animation duration after a resize
    //   tooltips: {
    //     callbacks: {
    //       label: function(tooltipItems, data) {
    //         if(tooltipItems.datasetIndex === 0){
    //           // return data.labels[tooltipItems.index] +
    //           return " Project Count : " + 
    //           Math.round(data.datasets[tooltipItems.datasetIndex].data[tooltipItems.index]);
    //         }else if(tooltipItems.datasetIndex === 1){
    //           // return data.labels[tooltipItems.index] +
    //           return " Cycle Time : " + 
    //           Math.round(data.datasets[tooltipItems.datasetIndex].data[tooltipItems.index]);
    //         }
    //       }
    //     }
    //   },
    // }
    var Options = {
      responsive : true,
      bezierCurve: false,
      hover: {
        mode: 'index' as 'index',
        intersect: false,
      },
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
      title: {
        display: true,
        text: ' '
      },
      scales: {
        yAxes: [{
          id: 'A',
          type: 'linear',
          position: 'left',
          ticks: {
            fontSize : 12,
            fontStyle : 'normal',
            fontColor : '#000000',
            fontFamily : 'Arial',
          },
          gridLines: {
            color: "rgba(0, 0, 0, 0)",
          },
          scaleLabel: {
            display: true,
            labelString: 'Project Count',
            fontSize : 14,
            fontStyle : 'normal',
            fontColor : '#000000',
            fontFamily : 'Arial',
          }
        },{
          id: 'B',
          type: 'linear',
          position: 'right',
          ticks: {
            fontSize : 12,
            fontStyle : 'normal',
            fontColor : '#000000',
            fontFamily : 'Arial',
          },
          gridLines: {
            color: "rgba(0, 0, 0, 0)",
          },
          scaleLabel: {
            display: true,
            labelString: 'Cycle Time & Targets',
            fontSize : 14,
            fontStyle : 'normal',
            fontColor : '#000000',
            fontFamily : 'Arial',
          }
        }],
        xAxes: [{
          ticks: {
            fontSize : 12,
            fontStyle : 'normal',
            fontColor : '#000000',
            fontFamily : 'Arial',
          },
          gridLines: {
            color: "rgba(0, 0, 0, 0)",
          },
        }]
      },
      plugins :{
        labels: {
          render : function(args){
            if(args.dataset.yAxisID == "B"){
              if(args.dataset.order == 1){
                return "          "+Math.round(args.value)
              }else{
                return "                    "+Math.round(args.value)
              }
            }else{
              return Math.round(args.value);
            }
          },
          fontColor: (c) => {
            return c.dataset.type == "line" ? c.dataset.order == 1 ? 'rgb(255, 43, 22)' : 'rgb(212, 172, 13)' : 'rgb(46, 134, 193)'
          },
          position: 'outside',
          textMargin: 6,
          fontSize: 14,
          fontStyle : 'bold',
          fontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
        }
        // labels : false,
      },
      animation: {
        duration: 0, // general animation time
      },
      responsiveAnimationDuration: 0, // animation duration after a resize
      tooltips: {
        mode: 'index' as 'index',
        intersect: false,
        callbacks: {
          label: function(tooltipItems, data) {
            if(tooltipItems.datasetIndex === 0){
              return " Target : " + 
              Math.round(data.datasets[tooltipItems.datasetIndex].data[tooltipItems.index]);
            }else if(tooltipItems.datasetIndex === 1){
              return " Cycle Time : " + 
              Math.round(data.datasets[tooltipItems.datasetIndex].data[tooltipItems.index]);
            }else if(tooltipItems.datasetIndex === 2){
              return " Project Count : " + 
              Math.round(data.datasets[tooltipItems.datasetIndex].data[tooltipItems.index]);
            }
          }
        }
      },
    }
    let i;
    if(this.Allcanvas != undefined){
      this.Allcanvas.destroy();
    }
    if(this.TargetsCanvas != undefined){
      this.TargetsCanvas.destroy();
    }
    this.allloader = true;
    // if(SelectedCaegory)
    this.timer = timer(3000); // 5000 millisecond means 5 seconds
    this.subscription = this.timer.subscribe(() => {
      for(let k = 0;k<this.CycleTimeData.length;k++){
        if(SelectedCaegory == this.CycleTimeData[k].CycleTimeCategory){
          i = k;
        }else{
        }
      }
      if(this.CycleTimeData.length > 0){
        this.Allcanvas = new Chart('Allcanvas', {
          type : 'bar',
          data : {
            labels : ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
            datasets: [
              {
                label : "Project Count",
                data: [this.CycleTimeData[i].January_PC,this.CycleTimeData[i].February_PC,this.CycleTimeData[i].March_PC,this.CycleTimeData[i].April_PC,this.CycleTimeData[i].May_PC,this.CycleTimeData[i].June_PC,this.CycleTimeData[i].July_PC,this.CycleTimeData[i].August_PC,this.CycleTimeData[i].September_PC,this.CycleTimeData[i].October_PC,this.CycleTimeData[i].November_PC,this.CycleTimeData[i].December_PC],
                backgroundColor : 'rgba(46, 134, 193, 1)',
                borderColor : "rgb(229, 231, 233)",
                hoverBackgroundColor : "rgba(46, 134, 193, 0.7)",
                fill : false,
                borderWidth : 2,
                type : 'bar',
                yAxisID: 'B',
              }
            ]
          },
          options: Options2,
        })
        // this.TargetsCanvas = new Chart('TargetsCanvas', {
        //   type : 'bar',
        //   data : {
        //     labels : ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
        //     datasets: [{
        //       label : "Target",
        //       data: [this.CycleTimeData[i].Target_A,this.CycleTimeData[i].Target_A,this.CycleTimeData[i].Target_A,this.CycleTimeData[i].Target_A,this.CycleTimeData[i].Target_A,this.CycleTimeData[i].Target_A,this.CycleTimeData[i].Target_A,this.CycleTimeData[i].Target_A,this.CycleTimeData[i].Target_A,this.CycleTimeData[i].Target_A,this.CycleTimeData[i].Target_A,this.CycleTimeData[i].Target_A],
        //       // data: [this.CycleTimeData[i].TargetH1,this.CycleTimeData[i].TargetH1,this.CycleTimeData[i].TargetH1,this.CycleTimeData[i].TargetH1,this.CycleTimeData[i].TargetH1,this.CycleTimeData[i].TargetH1,this.CycleTimeData[i].TargetCycleTime,this.CycleTimeData[i].TargetCycleTime,this.CycleTimeData[i].TargetCycleTime,this.CycleTimeData[i].TargetCycleTime,this.CycleTimeData[i].TargetCycleTime,this.CycleTimeData[i].TargetCycleTime],
        //       backgroundColor : 'rgb(255, 43, 22)',
        //       borderColor : 'rgb(255, 43, 22)',
        //       fill : false,lineTension: 0,
        //       type : 'line',
        //       yAxisID: 'A',
        //     },{
        //       label : "Cycle Time",
        //       data: [this.CycleTimeData[i].January_A,this.CycleTimeData[i].February_A,this.CycleTimeData[i].March_A,this.CycleTimeData[i].April_A,this.CycleTimeData[i].May_A,this.CycleTimeData[i].June_A,this.CycleTimeData[i].July_A,this.CycleTimeData[i].August_A,this.CycleTimeData[i].September_A,this.CycleTimeData[i].October_A,this.CycleTimeData[i].November_A,this.CycleTimeData[i].December_A],
        //       fill : false,lineTension: 0,
        //       backgroundColor : 'rgb(212, 172, 13)',
        //       borderColor : 'rgb(212, 172, 13)',
        //       type : 'line',
        //       yAxisID: 'A',
        //     }
        //   ]
        //   },
        //   options: Options,
        // })
        this.TargetsCanvas = new Chart('TargetsCanvas', {
          type : 'bar',
          data : {
            labels : ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
            datasets: [{
              label : "Target",
              data: [this.CycleTimeData[i].Target_A,this.CycleTimeData[i].Target_A,this.CycleTimeData[i].Target_A,this.CycleTimeData[i].Target_A,this.CycleTimeData[i].Target_A,this.CycleTimeData[i].Target_A,this.CycleTimeData[i].Target_A,this.CycleTimeData[i].Target_A,this.CycleTimeData[i].Target_A,this.CycleTimeData[i].Target_A,this.CycleTimeData[i].Target_A,this.CycleTimeData[i].Target_A],
              // data: [this.CycleTimeData[i].TargetH1,this.CycleTimeData[i].TargetH1,this.CycleTimeData[i].TargetH1,this.CycleTimeData[i].TargetH1,this.CycleTimeData[i].TargetH1,this.CycleTimeData[i].TargetH1,this.CycleTimeData[i].TargetCycleTime,this.CycleTimeData[i].TargetCycleTime,this.CycleTimeData[i].TargetCycleTime,this.CycleTimeData[i].TargetCycleTime,this.CycleTimeData[i].TargetCycleTime,this.CycleTimeData[i].TargetCycleTime],
              backgroundColor : 'rgb(255, 43, 22)',
              borderColor : 'rgb(255, 43, 22)',
              fill : false,lineTension: 0,
              type : 'line',
              yAxisID: 'B',
              order : 1
            },{
              label : "Cycle Time",
              data: [this.CycleTimeData[i].January_A,this.CycleTimeData[i].February_A,this.CycleTimeData[i].March_A,this.CycleTimeData[i].April_A,this.CycleTimeData[i].May_A,this.CycleTimeData[i].June_A,this.CycleTimeData[i].July_A,this.CycleTimeData[i].August_A,this.CycleTimeData[i].September_A,this.CycleTimeData[i].October_A,this.CycleTimeData[i].November_A,this.CycleTimeData[i].December_A],
              fill : false,lineTension: 0,
              backgroundColor : 'rgb(212, 172, 13)',
              borderColor : 'rgb(212, 172, 13)',
              type : 'line',
              yAxisID: 'B',
              order : 2
            },
            {
              label : "Project Count",
              data: [this.CycleTimeData[i].January_PC,this.CycleTimeData[i].February_PC,this.CycleTimeData[i].March_PC,this.CycleTimeData[i].April_PC,this.CycleTimeData[i].May_PC,this.CycleTimeData[i].June_PC,this.CycleTimeData[i].July_PC,this.CycleTimeData[i].August_PC,this.CycleTimeData[i].September_PC,this.CycleTimeData[i].October_PC,this.CycleTimeData[i].November_PC,this.CycleTimeData[i].December_PC],
              backgroundColor : 'rgba(46, 134, 193,1)',
              borderColor : "rgb(229, 231, 233)",
              hoverBackgroundColor : "rgba(46, 134, 193,0.7)",
              fill : false,
              borderWidth : 2,
              type : 'bar',
              yAxisID: 'A',
              order : 3
            }
          ]
          },
          options: Options,
        })
      }
      this.allloader = false;
      this.m_loader = false;
      this.dataSource = null;
      this.dataSource = this.CycleTimeData;
      // console.log(this.dataSource);
    })
  }
  CycleTimeDataSearch;
  exportCycleTimeData(){
    this.dashboard.ShowSpinnerHandler(true);
    this.service.CycleTimeChartVolumeCount(this.c_SelectedYears,this.c_SelectedRegions,this.c_SelectedMilestonestatus,'Overall').subscribe(data =>{
      if(data.code == 200){
        for(let i = 0;i<data.CycleTimeData.length;i++){
          if(data.CycleTimeData[i].GoLiveDate == null){
            data.CycleTimeData[i].GoLiveDate = null;
          }else{
            data.CycleTimeData[i].GoLiveDate = new Date(data.CycleTimeData[i].GoLiveDate);
          }
          if(data.CycleTimeData[i].ProjectStart_ForCycleTime == null){
            data.CycleTimeData[i].ProjectStart_ForCycleTime = null;
          }else{
            data.CycleTimeData[i].ProjectStart_ForCycleTime = new Date(data.CycleTimeData[i].ProjectStart_ForCycleTime);
          }
        }
        const CustomizedData = data.CycleTimeData.map(o => {
          return {
            'Client' : o.Client,
            'RevenueID' :o.RevenueID,
            'Workspace Title' : o.Workspace_Title,
            'Milestone Title' : o.MilestoneTitle,
            'Implementation Type' :o.ImplementationType,
            'Region' :o.Region,
            'Country' :o.Country,
            'ProjectStatus' :o.ProjectStatus,
            'ProjectLevel' :o.ProjectLevel,
            'GoLiveDate' :o.GoLiveDate,
            'ProjectStart_ForCycleTime' : o.ProjectStart_ForCycleTime,
            'CycleTime' : o.CycleTime,
            'CycleTimeCategories' : o.CycleTimeCategories,
            'EltClientDelayDescription' : o.EltClientDelayDescription,
            'GoLiveYear' : o.GoLiveYear,
            'GoLiveMonth' : o.GoLiveMonth,
            'CycleTimeDelayCode' : o.CycleTimeDelayCode
          };
        });
        this.excelxsService.exportAsExcelFile(
          [
            {
              sheetName: 'Cycle Time Data',
              data: CustomizedData,
              defaultBackgroundColor : 'FF34495E',
              defaultTextColor : 'FFFFFFFF',
              columnFormats: {
                'dd/MMM/yyyy' : ['GoLiveDate','ProjectStart_ForCycleTime'], // Negative and Positive Numbers with 2 decimals with Dolor Symbol
                '0' : ['RevenueID','CycleTime','GoLiveYear']
              },
            },
          ],
          'Cycle Time Data'
        );
      }
      //this.dataSource = this.CLRData
      this.dashboard.ShowSpinnerHandler(false);
    })
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource_data.filter = filterValue.trim().toLowerCase();
  }
  // c_checkUncheckYears() {
  //   for (var i = 0; i < this.c_yearList.length; i++) {
  //     this.c_yearList[i].isSelected = this.c_masteryear;
  //   }
  //   this.c_getSelectedYear();
  // }
  c_yearsSelected(year : string) {
    for (var i = 0; i < this.c_yearList.length; i++) {
      if(this.c_yearList[i].Go_Live_Year == year){
        this.c_yearList[i].isSelected = true;
      }else{
        this.c_yearList[i].isSelected = false;
      }
    }
    // this.c_masteryear = this.c_yearList.every(function(item:any) {
    //     return item.isSelected == true;
    // })
    this.c_getSelectedYear();
  }
  c_getSelectedYear(){
    this.Apply_disable = false;
    this.c_SelectedYears = null;
    for(let i=0;i<this.c_yearList.length;i++){
      if(this.c_yearList[i].isSelected == true){
        if(this.c_SelectedYears == null){
          this.c_SelectedYears = this.c_yearList[i].Go_Live_Year;
        }else{
          this.c_SelectedYears += ","+this.c_yearList[i].Go_Live_Year;
        }
      }else{
      }
    }
    //this.c_yearListSelected = this.c_yearList.filter(s => s.isSelected == true);
  }
  c_checkUncheckMonths() {
    for (var i = 0; i < this.c_monthList.length; i++) {
      this.c_monthList[i].isSelected = this.c_mastermonth;
    }
    this.c_getSelectedMonth();
  }
  c_monthsSelected() {
    this.c_mastermonth = this.c_monthList.every(function(item:any) {
        return item.isSelected == true;
    })
    this.c_getSelectedMonth();
  }
  c_getSelectedMonth(){
    this.Apply_disable = false;
    this.c_SelectedMonths = null;
    for(let i=0;i<this.c_monthList.length;i++){
      if(this.c_monthList[i].isSelected == true){
        if(this.c_SelectedMonths == null){
          this.c_SelectedMonths = this.c_monthList[i].Go_Live_Month;
        }else{
          this.c_SelectedMonths += ","+this.c_monthList[i].Go_Live_Month;
        }
      }else{
      }
    }
  }
  c_checkUncheckLevel() {
    for (var i = 0; i < this.c_levelList.length; i++) {
      this.c_levelList[i].isSelected = this.c_masterlevel;
    }
    this.c_getSelectedLevels();
  }
  c_levelSelected() {
    this.c_masterlevel = this.c_levelList.every(function(item:any) {
        return item.isSelected == true;
    })
    this.c_getSelectedLevels();
  }
  c_getSelectedLevels(){
    this.Apply_disable = false;
    this.c_SelectedLevels = null;
    for(let i=0;i<this.c_levelList.length;i++){
      if(this.c_levelList[i].isSelected == true){
        if(this.c_SelectedLevels == null){
          this.c_SelectedLevels = this.c_levelList[i].iMeet_Project_Level;
        }else{
          this.c_SelectedLevels += ","+this.c_levelList[i].iMeet_Project_Level;
        }
      }else{
      }
    }
    this.c_levelListSelected = this.c_levelList.filter(s => s.isSelected == true);
  }
  c_deselectlevel(val : string){
    for(let i=0;i<this.c_levelList.length;i++){
      if(this.c_levelList[i].iMeet_Project_Level == val){
        this.c_levelList[i].isSelected = false;
      }else{
      }
    }
    this.c_levelSelected();
  }
  c_checkUncheckRegion() {
    for (var i = 0; i < this.c_regionList.length; i++) {
      this.c_regionList[i].isSelected = this.c_masterregion;
    }
    this.c_getSelectedRegion();
  }
  c_regionSelected() {
    this.c_masterregion = this.c_regionList.every(function(item:any) {
        return item.isSelected == true;
    })
    this.c_getSelectedRegion();
  }
  c_getSelectedRegion(){
    this.Apply_disable = false;
    this.c_SelectedRegions = null;
    for(let i=0;i<this.c_regionList.length;i++){
      if(this.c_regionList[i].isSelected == true){
        if(this.c_SelectedRegions == null){
          this.c_SelectedRegions = this.c_regionList[i].Region__Opportunity_;
        }else{
          this.c_SelectedRegions += ","+this.c_regionList[i].Region__Opportunity_;
        }
      }else{
      }
    }
  }
  c_checkUncheckMilestoneStatus() {
    for (var i = 0; i < this.c_MilestonestatusList.length; i++) {
      this.c_MilestonestatusList[i].isSelected = this.c_masterMilestonestatus;
    }
    this.c_getSelectedMilestoneStatus();
  }
  c_MilestoneStatusSelected() {
    this.c_masterMilestonestatus = this.c_MilestonestatusList.every(function(item:any) {
        return item.isSelected == true;
    })
    this.c_getSelectedMilestoneStatus();
  }
  c_getSelectedMilestoneStatus(){
    this.Apply_disable = false;
    this.c_SelectedMilestonestatus = null;
    for(let i=0;i<this.c_MilestonestatusList.length;i++){
      if(this.c_MilestonestatusList[i].isSelected == true){
        if(this.c_SelectedMilestonestatus == null){
          this.c_SelectedMilestonestatus = this.c_MilestonestatusList[i].ProjectStatus;
        }else{
          this.c_SelectedMilestonestatus += ","+this.c_MilestonestatusList[i].ProjectStatus;
        }
      }else{
      }
    }
    //this.c_MilestonestatusListSelected = this.c_MilestonestatusList.filter(s => s.isSelected == true);
  }
  c_checkUncheckImplementation() {
    for (var i = 0; i < this.c_implementationtypeList.length; i++) {
      this.c_implementationtypeList[i].isSelected = this.c_masterimplementation;
    }
    this.c_getSelectedType();
  }
  c_typeSelected() {
    this.c_masterimplementation = this.c_implementationtypeList.every(function(item:any) {
        return item.isSelected == true;
    })
    this.c_getSelectedType();
  }
  c_getSelectedType(){
    this.Apply_disable = false;
    this.c_SelectedImplementation = null;
    for(let i=0;i<this.c_implementationtypeList.length;i++){
      if(this.c_implementationtypeList[i].isSelected == true){
        if(this.c_SelectedImplementation == null){
          this.c_SelectedImplementation = this.c_implementationtypeList[i].Implementation_Type;
        }else{
          this.c_SelectedImplementation += ","+this.c_implementationtypeList[i].Implementation_Type;
        }
      }else{
      }
    }
    //this.c_implementationtypeListSelected = this.c_implementationtypeList.filter(s => s.isSelected == true);
  }
}