import { AfterViewInit,Component, OnInit,ViewChild, Inject } from '@angular/core';
import { FormControl} from '@angular/forms';
import { DashboardServiceService } from '../../dashboard-service.service';
import { Responce, Data, VolumeCountCycleTime } from '../../Models/Responce';
import { Chart } from 'chart.js';
import 'chartjs-plugin-labels';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableFilter } from "mat-table-filter";
import { Year, Month, Quarter, ProjectLevel, Region, Status, MarketLeader,Country, ImplementationType, MilestoneStatus, c_Year, c_Month, c_ProjectLevel, c_MilestoneStatus, rp_ProjectStatus, rp_Year, c_ImplementationType, Ownership } from '../../Models/Filters';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { ClrData } from '../../Models/ClrResponse';
import { MatPaginator } from '@angular/material/paginator';
import { LivedashboardComponent } from '../livedashboard/livedashboard.component';
import { ExcelSXService } from '../../excelsx.service';
//import { ChartModule } from 'angular2-chartjs';
//import 'chartjs-plugin-labels';
export interface ImeetMilestoneProjectStatus {
  iMeet_Milestone___Project_Status: string;
  Client: string;
  iMeet_Project_Level: string;
  Revenue_Total_Volume_USD?: number;
  Region__Opportunity_: string;
  Implementation_Type: string;
}
// export class VolumeCountByCycleTime{
//   Go_Live_Month: string;
//   Revenue_Total_Volume_USD?: number;
//   Revenue_Total_Volume : string;
//   ProjectsCount: number;
//   Average: number;
//   AvgCycleTime : string;
// }
export interface MonthlyTotalRevenue {
  Leftheaders: string;
  Jan : string;
  Feb : string;
  Mar : string;
  Apr : string;
  May : string;
  Jun : string;
  Jul : string;
  Aug : string;
  Sep : string;
  Oct : string;
  Nov : string;
  Dec : string;
  Total : string;
}
// const Monthly_Total_Revenue: MonthlyTotalRevenue[] = [
//   {Leftheaders: '', Jan: '', Feb: '', Mar: 'H',Apr : '', May : '',Jun : '',Jul : '',Aug : '',Sep : '',Oct : '',Nov : '',Dec : ''},
// ];
@Component({
  selector: 'app-implementation-market-report',
  templateUrl: './implementation-market-report.component.html',
  styleUrls: ['./implementation-market-report.component.css']
})
export class ImplementationMarketReportComponent implements OnInit {
  implementationtypes = new FormControl();
  projectstatuses = new FormControl();
  dataSource;
  dataSource_delta;
  dataSource_VCtPc;
  screenWidth : number;
  screenHeight : number;
  StatusWiseData : Data[];
  exceldata : any;
  TotalCost : string;
  MonthlyRevenue : Data[];
  MonthlyTotalRevenueData : Data[];
  // RegionWiseRevenue : Data[];
  yearList : Year[];
  yearListSelected : Year[];
  SelectedYears : any;SelectedMonths : any;SelectedOwnership : any;SelectedLevels : any;
  SelectedRegions : any;SelectedStatus : any;SelectedLeader : any;SelectedCountry : any;
  SelectedMilestonestatus : any;Selectedprojectstatus : any;
  c_SelectedYears : any;c_SelectedMonths : any;c_SelectedLevels : any;
  c_SelectedMilestonestatus : any;c_SelectedRegions : any;
  rp_SelectedYears : any;SelectedImplementation : any;
  c_SelectedImplementation : any;
  monthList : Month[];
  monthListSelected : Month[];
  OwnerShipList : Ownership[];
  OwnerShipListSelected : Ownership[];
  levelList : ProjectLevel[];//[] = ['Global', 'Local', 'Regional'];
  levelListSelected : ProjectLevel[];
  regionList : Region[];
  regionListSelected : Region[];
  statusList : Status[];//[] = ['Backlog', 'Started'];
  statusListSelected : Status[];
  marketleaderList : MarketLeader[];//[] = ['Barbara', 'Bindu Batia', 'Cathy voss','Chris Bowen'];
  CountryList : Country[];// marketleaderListSelected : MarketLeader[];
  implementationtypeList: ImplementationType[];
  implementationtypeListSelected : ImplementationType[];
  MilestonestatusList : MilestoneStatus[];
  MilestonestatusListSelected : MilestoneStatus[];
  masteryear : boolean;masterownerShip : boolean;
  mastermonth : boolean;masterstatus : boolean;
  masterlevel : boolean;masterregion : boolean;
  masterleader : boolean;masterCountry : boolean;
  masterMilestonestatus : boolean;masterimplementation : boolean;
  // c_masteryear : boolean;c_mastermonth : boolean;c_masterlevel : boolean;c_masterMilestonestatus : boolean;c_masterregion : boolean;c_masterimplementation : boolean;
  Months : any = [];
  Volume : any = [];
  ProjectCount : any = [];
  AvgCycleTime : any = [];
  PLWProjectLevels : any = [];
  PLWProjectCount : any = [];
  PLWRevenueVolume : any = [];
  RWRegions : any = [];
  RWProjectCount  : any [];
  RWRevenueVolume : any = [];
  VolumeCountCycleTime : VolumeCountCycleTime[];
  ProjectCountByYear : Data[];
  displayedColumns: string[] = ['Client', 'GoLiveDate_c','iMeet_Project_Level','Region__Opportunity_','Country','Implementation_Type','iMeet_Milestone___Project_Status','Revenue_Total_Volume_USD'];
  displayedColumns_h: string[] = ['Client_h', 'GoLiveDate_c_h','iMeet_Project_Level_h','Region__Opportunity__h','Country_h','Implementation_Type_h','iMeet_Milestone___Project_Status_h','Revenue_Total_Volume_h'];
  displayedColumns_VCTPC: string[] = ['GoLiveMonth', 'Revenue_Total_Volume','ProjectsCount','AvgCycleTime'];
  // displayedColumns_VCTPCheader: string[] = ['GoLiveMonthh', 'Revenue_Total_Volumeh','ProjectsCounth','AvgCycleTimeh'];
  MonthlyTotaldisplayedColumns : any[] = ['Leftheaders', 'Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Total'];
  displayedColumnsrw : any[] = ['Region__Opportunity_','ProjectsCount','RevenueVolume_string'];
  displayedColumnsplw : any[] = ['iMeet_Project_Level','ProjectsCount','RevenueVolume_string'];
  // isExpansionDetailRow = (index, row) => row.hasOwnProperty('detailRow');
  rw_dataSource;
  plw_dataSource;
  filterEntity : Data;
  filterType: MatTableFilter;
  chart : any;
  ypcchart : any;
  rwchart : any;
  CVchart : any;
  // CTchart : any;
  plwcanvas : any;
  CurrentYear : number;
  CurrentYears : number;
  StatusSelectedList = [];
  StatusSelected : string;
  SelectedProjectCount;
  @ViewChild(MatSort) sort: MatSort;
  Apply_disable : boolean;
  ChartRevenueTotalVolume : any;
  ChartProjectCount : any;
  ChartAvgCycleTime : any;

  // SelectedDeltaMonthNumber;
  // SelectedDeltaComment;
  // SelectedDeltaMonth;
  DeltaID;
  DeltaValue;
  // filterEntity: VolumeCountCycleTime;
  // filterType: MatTableFilter;
  constructor(public service : DashboardServiceService, public dialog: MatDialog,public datepipe : DatePipe, public dashboard : LivedashboardComponent, private excelxsService : ExcelSXService) 
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
  ResetFilters(){
    this.ngOnInit();
  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    // this.GetData();
  }
  FilterChange(){
    this.SelectedProjectCount = this.dataSource.filteredData.length;
    this.TotalCost = Math.round(this.dataSource.filteredData.map(t => t.Revenue_Total_Volume_USD).reduce((acc,value) => acc + value,0)).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
  }
  LoginUID : string;
  DisplayDelta : boolean;
  ngOnInit() {
    this.LoginUID = localStorage.getItem("UID");
    this.dashboard.ShowSpinnerHandler(true);
    this.service.ImeetMilestoneFiltersList().subscribe(data =>{
      this.yearList = data.Year;
      this.masteryear = false;
      // this.c_yearList = data.c_Year;
      // this.c_masteryear = false;
      this.CurrentYears = (new Date()).getFullYear();
      for (var i = 0; i < this.yearList.length; i++) {
        if(this.yearList[i].Go_Live_Year == this.CurrentYears+""){
          //|| this.yearList[i].Go_Live_Year == (this.CurrentYear-1)+""
          this.yearList[i].isSelected = true;
          // this.c_yearList[i].isSelected = true;
        }
        else{
          this.yearList[i].isSelected = false;
          // this.c_yearList[i].isSelected = false;
        }
      }
      this.getSelectedYear();
      // this.c_getSelectedYear();
      this.monthList = data.Months;
      this.mastermonth = true;
      this.getSelectedMonth();
      // this.c_monthList = data.c_Months;
      // this.c_mastermonth = true;
      // this.c_getSelectedMonth();
      this.OwnerShipList = data.OwnerShip;
      this.masterownerShip = true;
      // for (var i = 0; i < this.OwnerShipList.length; i++) {
      //   if(this.OwnerShipList[i].OwnerShip == "Partner"){
      //     this.OwnerShipList[i].isSelected = false;
      //   }
      //   else{
      //     this.OwnerShipList[i].isSelected = true;
      //   }
      // }
      this.getSelectedOwnerships();
      this.levelList = data.ProjectLevel;
      this.masterlevel = true;
      this.getSelectedLevels();
      // this.c_levelList = data.c_ProjectLevel;
      // this.c_masterlevel = true;
      // this.c_getSelectedLevels();
      this.regionList = data.Region;
      this.masterregion = true;
      this.getSelectedRegion();
      // this.c_regionList = data.Region;
      // this.c_masterregion = true;
      // this.c_getSelectedRegion();
      // this.statusList = data.Status;
      // this.masterstatus = true;
      // this.getSelectedStatus();
      this.marketleaderList = data.MarketLeaders;
      this.masterleader = true;
      this.getSelectedLeader();
      this.CountryList = data.Country;
      this.masterCountry = true;
      this.getSelectedCountry();
      this.implementationtypeList = data.ImplementationType;
      this.masterimplementation = true;
      this.getSelectedType();
      // this.c_implementationtypeList = data.c_ImplementationType;
      // this.c_masterimplementation = true;
      // this.c_getSelectedType();
      this.MilestonestatusList = data.MilestoneStatus;
      this.masterMilestonestatus = false;
      // this.c_MilestonestatusList = data.c_MilestoneStatus;
      // this.c_masterMilestonestatus = false;
      for (var i = 0; i < this.MilestonestatusList.length; i++) {
        if(this.MilestonestatusList[i].iMeet_Milestone___Project_Status == "C-Closed" || this.MilestonestatusList[i].iMeet_Milestone___Project_Status == "A-Active/Date Confirmed"){
          this.MilestonestatusList[i].isSelected = true;
          // this.c_MilestonestatusList[i].isSelected = true;
        }else{
          this.MilestonestatusList[i].isSelected = false;
          // this.c_MilestonestatusList[i].isSelected = false;
        }
      }
      this.getSelectedMilestoneStatus();
      // this.c_getSelectedMilestoneStatus();
      // this.SetGraphChart();
      this.dashboard.ShowSpinnerHandler(true);
      this.SetGraph();
    });
    // this.service.ProjectStatusList().subscribe(data =>{
    //   if (data.code == 200){
    //     // this.projectstatusList = data.Data;
    //     // this.masterprojectstatus = false;
    //     // for (var i = 0; i < this.projectstatusList.length; i++) {
    //     //   if(this.projectstatusList[i].iMeet_Milestone___Project_Status == "P-Pipeline"){
    //     //     this.projectstatusList[i].isSelected = true;
    //     //   }else{
    //     //     this.projectstatusList[i].isSelected = false;
    //     //   }
    //     // }
    //     // this.getSelectedProjectStatus();
    //     // this.dashboard.ShowSpinnerHandler(true);
    //     // this.SetGraph2();
    //   }else{
    //   }
    // });
    this.Apply_disable = true;
    // this.Apply_disable1 = true;
    // this.Apply_disable2 = true;
  }
  SetGraph(){
    this.StatusSelectedList = [];
    this.StatusSelected = null;
    for(let i=0;i<this.MilestonestatusList.length;i++){
      if(this.MilestonestatusList[i].isSelected == true){
        if(this.MilestonestatusList[i].isSelected == null){
          this.StatusSelectedList.push("Blanks");
        }else{
          this.StatusSelectedList.push(this.MilestonestatusList[i].iMeet_Milestone___Project_Status);
        }
      }else{
      }
    }
    for(let i = 0;i<this.StatusSelectedList.length;i++){
      if(this.StatusSelectedList.length == 1){
        this.StatusSelected = this.StatusSelectedList[i];
      }else if(this.StatusSelectedList.length >= 2){
        if(i == 0){
          this.StatusSelected = this.StatusSelectedList[i];
        }else if(i == this.StatusSelectedList.length-1){
          this.StatusSelected += " & "+this.StatusSelectedList[i] + " Data";
        }else {
          this.StatusSelected += ", "+this.StatusSelectedList[i];
        }
      }
    }
    var years = [];
    var backgroundColor = [
      'rgb(40, 180, 99)','rgb(40, 180, 99,0.7)','rgb(40, 180, 99,0.4)', 'rgb(40, 180, 99,0.1)'
    ]
    var bgColor = [
      'rgba(40, 180, 99,1)','rgba(93, 173, 226,1)','rgba(14, 61, 89,1)', 'rgb(255, 219, 105,1)'
    ]
    var bocolor = [
      'rgba(229, 231, 233 ,1)','rgba(229, 231, 233 ,1)','rgba(229, 231, 233,1)', 'rgba(229, 231, 233,1)', 'rgba(229, 231, 233,1)', 'rgba(229, 231, 233,1)', 'rgba(229, 231, 233,1)'
    ]
    var hoverbgcolor = [
      'rgba(40, 180, 99,0.7)','rgb(93, 173, 226,0.7)','rgba(14, 61, 89,0.7)'
    ]
    var anotherbackgroundColor = [
      'rgba(46, 134, 193 )','rgba(46, 134, 193 ,0.7)','rgba(46, 134, 193 ,0.4)', 'rgba(46, 134, 193 ,0.1)'
    ]
    var anotherbordercolor = [
      'rgb(241, 130, 38)','rgb(59, 138, 217)','rgb(14, 61, 89)', 'rgb(255, 219, 105)', 'rgb(217,37,38)', 'rgb(75, 192, 192)', 'rgb(255, 99, 132)'
    ]
    var anotherbgColor = [
      'rgb(212, 172, 13)','rgb(212, 172, 13,0.7)','rgb(212, 172, 13,0.4)','rgb(212, 172, 13,0.1)'
    ]
    var str = this.SelectedYears+"";
    var mydatasets = [];
    years = null;
    let j = 0;
    let k = 0;
    let l = 0;
    var PCmydatasets = [];
    var VolumeDataset = [];
    var CountDataset = [];
    var VolumeCountDataset = [];
    var VolumeCycleCountDataset = [];
    var CycleCountDataset = [];
    var CycleTimeDataset = [];
    var CycleTimeLineDataset = [];
    var Options = {
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
      plugins: {
        labels: {
          render: function (args) {
            if(args.value == 0) {
              return '$'+0;
            }
            else
            {
              // hundreds
              if(args.value <= 999){
                return '$'+Math.round(args.value);
              }
              // thousands
              else if(args.value >= 1000 && args.value <= 999999){
                return '$'+Math.round(args.value / 1000) + 'K';
              }
              // millions
              else if(args.value >= 1000000 && args.value <= 999999999){
                return '$'+Math.round(args.value / 1000000) + 'M';
              }
              // billions
              else if(args.value >= 1000000000 && args.value <= 999999999999){
                return '$'+Math.round(args.value / 1000000000) + 'B';
              }
              else
                return '$'+Math.round(args.value);
            }
          },
          fontColor: '#3B3B3B',
          position: 'outside',
          textMargin: 6,
          fontSize: 12,
          fontStyle : 'bold',
          fontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
        }
      },
      tooltips: {
        mode: 'index' as 'index',
        intersect: false,
        callbacks: {
          label: function(tooltipItems, data) {
            return Math.round(data.datasets[tooltipItems.datasetIndex].data[tooltipItems.index]).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
          }
        }
      },
      // plugins: {
      //   labels: false,
      // },
      scales: {
        xAxes: [{
          ticks: {
            // mirror: true,
            fontSize : 11,
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
            beginAtZero:true,
            // max:700,
            fontSize : 11,
            fontStyle : 'bold',
            fontColor : '#000000',
            fontFamily : 'Arial',
            callback: function(label, index, labels) {
              if(label == 0) {
                return 0;
              }
              else
              {
                // hundreds
                if(label <= 999){
                  return label;
                }
                // thousands
                else if(label >= 1000 && label <= 999999){
                  return (label / 1000) + 'K';
                }
                // millions
                else if(label >= 1000000 && label <= 999999999){
                  return (label / 1000000) + 'M';
                }
                // billions
                else if(label >= 1000000000 && label <= 999999999999){
                  return (label / 1000000000) + 'B';
                }
                else
                  return label;
              }
            }
          },
          gridLines: {
            color: "rgba(0, 0, 0, 0)",
          },
          scaleLabel: {
              display: true,
              labelString: 'Revenue Total Volume USD',
              fontSize : 13,
              fontStyle : 'bold',
              fontColor : '#000000',
              fontFamily : 'Arial',
          }
        }]
      },
    }
    var PCOptions = {
      responsive : true,
      // events: false,
      legend: {
        display: true,
        position : 'bottom' as 'bottom',
        fullWidth : true,
        labels: {
            fontColor: '#000000',
            fontSize :  13,
            padding : 15,
            fontStyle : '600',
            fontFamily : 'Arial',
        }
      },
      plugins: {
        labels: false,
      },
      tooltips: {
        enabled: false,
        callbacks: {
          label: function(tooltipItem) {
            return tooltipItem.yLabel;
          }
        }
      },
      // tooltips: {
      //   mode: 'index',
      //   intersect: false,
      //   callbacks: {
      //     label: function(tooltipItems, data) {
      //       return data.datasets[tooltipItems.datasetIndex].label + 
      //       " : " + 
      //       data.datasets[tooltipItems.datasetIndex].data[tooltipItems.index];
      //     }
      //   }
      // },
      scales: {
        yAxes: [{
          ticks: {
            fontSize : 10,
            fontStyle : 'normal',
            fontColor : '#000000',
            fontFamily : 'Arial',
          },
          scaleLabel: {
              display: true,
              labelString: 'Projects Count',
              fontSize : 12,
              fontStyle : 'normal',
              fontColor : '#000000',
              fontFamily : 'Arial',
          }
        }],
        xAxes: [{
          ticks: {
            fontSize : 10,
            fontStyle : 'normal',
            fontColor : '#000000',
            fontFamily : 'Arial',
          }
        }]
      },
      hover: {
        animationDuration: 0
      },
      animation: {
        duration: 1,
        onComplete: function () {
          var chartInstance = this.chart,
              ctx = chartInstance.ctx;
          ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          this.data.datasets.forEach(function (dataset, i) {
              var meta = chartInstance.controller.getDatasetMeta(i);
              meta.data.forEach(function (bar, index) {
                  var data = dataset.data[index]; 
                  ctx.font = "550 12px Arial";                    
                  ctx.fillText(data, bar._model.x, bar._model.y - 5);
              });
          });
        }
      }
    }
    var Options2 = {
      responsive : true,
      bezierCurve: false,
      hover: {
        mode: 'index' as 'index',
        intersect: false
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
      plugins :{
        labels: {
          render: function (args) {
            if(args.dataset.yAxisID == "B"){
              if(args.dataset.order == 1){
                return "             "+Math.round(args.value)
              }else{
                return "                       "+Math.round(args.value)
              }
            }else{
              if(args.value == 0) {
                return '$'+0;
              }
              else
              {
                // hundreds
                if(args.value <= 999){
                  return '$'+Math.round(args.value);
                }
                // thousands
                else if(args.value >= 1000 && args.value <= 999999){
                  return '$'+Math.round(args.value / 1000) + 'K';
                }
                // millions
                else if(args.value >= 1000000 && args.value <= 999999999){
                  return '$'+Math.round(args.value / 1000000) + 'M';
                }
                // billions
                else if(args.value >= 1000000000 && args.value <= 999999999999){
                  return '$'+Math.round(args.value / 1000000000) + 'B';
                }
                else
                  return '$'+Math.round(args.value);
              }
            }
          },
          fontColor: (c) => {
            return c.dataset.type == "line" ? c.dataset.order == 1 ? 'rgb(212, 172, 13)' : 'rgb(46, 134, 193 )' : 'rgb(40, 180, 99)'
          },
          textMargin: 6,
          overlap: false,
          fontSize: 14,
          fontStyle : 'bold',
          fontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
        }
        // labels : false,
      },
      title: {
        display: true,
        text: ' '
      },
      tooltips: {
        mode: 'index' as 'index',
        intersect: false,
        callbacks: {
          label: function(tooltipItems, data) {
            if(tooltipItems.datasetIndex === 0){
              return " Project Count : " + 
              Math.round(data.datasets[tooltipItems.datasetIndex].data[tooltipItems.index]);
            }else if(tooltipItems.datasetIndex === 1){
              return " Revenue Volume : " + 
              Math.round(data.datasets[tooltipItems.datasetIndex].data[tooltipItems.index]).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
            }else if(tooltipItems.datasetIndex === 2){
              return " Cycle Time : " + 
              Math.round(data.datasets[tooltipItems.datasetIndex].data[tooltipItems.index]);
            }
          }
        }
      },
      scales: {
        yAxes: [{
          id: 'A',
          type: 'linear',
          position: 'left',
          // stacked: true,
          ticks: {
            fontSize : 12,
            fontStyle : 'normal',
            fontColor : '#000000',
            fontFamily : 'Arial',
            callback: function(label, index, labels) {
              if(label == 0) {
                return 0;
              }
              else
              {
                // hundreds
                if(label <= 999){
                  return label;
                }
                // thousands
                else if(label >= 1000 && label <= 999999){
                  return (label / 1000) + 'K';
                }
                // millions
                else if(label >= 1000000 && label <= 999999999){
                  return (label / 1000000) + 'M';
                }
                // billions
                else if(label >= 1000000000 && label <= 999999999999){
                  return (label / 1000000000) + 'B';
                }
                else
                  return label;
              }
            }
          },
          gridLines: {
            color: "rgba(0, 0, 0, 0)",
          },
          scaleLabel: {
            display: true,
            labelString: 'Revenue Total Volume USD',
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
            labelString: 'Projects Count & Average Cycle Time (Days)',
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
          },gridLines: {
            color: "rgba(0, 0, 0, 0)",
          }
        }]
      },
    }
    // var Options3 = {
    //   responsive : true,
    //   bezierCurve: false,
    //   hover: {
    //     mode: 'index' as 'index',
    //     intersect: false
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
    //   scales: {
    //     yAxes: [{
    //       id: 'A',
    //       type: 'linear',
    //       position: 'left',
    //       // stacked: true,
    //       ticks: {
    //         fontSize : 11,
    //         fontStyle : 'bold',
    //         fontColor : '#000000',
    //         fontFamily : 'Arial',
    //       },
    //       gridLines: {
    //         color: "rgba(0, 0, 0, 0)",
    //       },
    //       scaleLabel: {
    //         display: true,
    //         labelString: 'Cycle Time',
    //         fontSize : 13,
    //         fontStyle : 'bold',
    //         fontColor : '#000000',
    //         fontFamily : 'Arial',
    //       }
    //     },{
    //       id: 'B',
    //       type: 'linear',
    //       position: 'right',
    //       ticks: {
    //         fontSize : 11,
    //         fontStyle : 'bold',
    //         fontColor : '#000000',
    //         fontFamily : 'Arial',
    //       },
    //       gridLines: {
    //         color: "rgba(0, 0, 0, 0)",
    //       },
    //       scaleLabel: {
    //         display: true,
    //         labelString: 'Projects Count',
    //         fontSize : 13,
    //         fontStyle : 'bold',
    //         fontColor : '#000000',
    //         fontFamily : 'Arial',
    //       }
    //     }],
    //     xAxes: [{
    //       ticks: {
    //         fontSize : 11,
    //         fontStyle : 'bold',
    //         fontColor : '#000000',
    //         fontFamily : 'Arial',
    //       },
    //       gridLines: {
    //         color: "rgba(0, 0, 0, 0)",
    //       }
    //     }]
    //   },
    // }
    if(str == null || str == ''){
      alert("Please select year and Try Again");
    }else{
      years = str.split(',');
      var CurrentYear = (new Date()).getFullYear();
      bgColor = [];
      hoverbgcolor = [];
      years.map(x => {
        if(x == CurrentYear){
          bgColor.push('rgba(40, 180, 99, 1)');
          hoverbgcolor.push('rgba(40, 180, 99, 0.7)');
        }else if(x == CurrentYear-1){
          bgColor.push('rgba(255, 219, 105, 1)');
          hoverbgcolor.push('rgba(255, 219, 105, 0.7)');
        }else if(x == CurrentYear-2){
          bgColor.push('rgba(217, 37, 38, 1)');
          hoverbgcolor.push('rgba(217, 37, 38, 0.7)');
        }else if(x == CurrentYear+1){
          bgColor.push('rgba(93, 173, 226, 1)');
          hoverbgcolor.push('rgba(93, 173, 226, 0.7)');
        }else if(x == CurrentYear+2){
          bgColor.push('rgba(14, 61, 89, 1)');
          hoverbgcolor.push('rgba(14, 61, 89, 0.7)');
        }else if(x == CurrentYear+3){
          bgColor.push('rgba(255, 99, 132, 1)');
          hoverbgcolor.push('rgba(255, 99, 132, 0.7)');
        }else if(x == 2050){
          bgColor.push('rgba(203, 202, 202, 1)');
          hoverbgcolor.push('rgba(203, 202, 202, 0.7)');
        }else{
          bgColor.push('rgba(203, 202, 202, 1)');
          hoverbgcolor.push('rgb(203, 202, 202, 0.7)');
        }
      });
      for(let i=0;i<years.length;i++){
        if(years[i] == null || years[i] == ""){
          alert("Please select year and Try Again");
        }else{
          this.dashboard.ShowSpinnerHandler(true);
          this.service.MonthlyRevenueByYear(years[i],this.SelectedMonths,this.SelectedLevels,this.SelectedRegions,this.SelectedMilestonestatus,this.SelectedImplementation,this.SelectedCountry,this.SelectedOwnership).subscribe(data =>{
            if(data.Data.length > 0){
              // if(j==0){
              //   mydatasets[j] = {
              //     label : 'Target line',
              //     data : [75000000,75000000,75000000,75000000,75000000,75000000,75000000,75000000,75000000,75000000,75000000,75000000],
              //     type: 'line',
              //     backgroundColor : '#E74C3C',
              //     borderColor : '#E74C3C',
              //     fill : false,
              //     lineTension: 0,
              //   }
              //   mydatasets[j+1] = {
              //     label : years[i]+" ("+Math.round(data.Data[0].January+data.Data[0].February+data.Data[0].March+data.Data[0].April+data.Data[0].May+data.Data[0].June+data.Data[0].July+data.Data[0].August+data.Data[0].September+data.Data[0].October+data.Data[0].November+data.Data[0].December).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3)+")",
              //     data : [data.Data[0].January,data.Data[0].February,data.Data[0].March,data.Data[0].April,data.Data[0].May,data.Data[0].June,data.Data[0].July,data.Data[0].August,data.Data[0].September,data.Data[0].October,data.Data[0].November,data.Data[0].December],
              //     backgroundColor : bgColor[j],
              //     borderColor : bocolor[j],
              //     borderWidth: 2,
              //     hoverBackgroundColor : hoverbgcolor[j],
              //     // type: 'line',
              //     // fill : false,
              //   }
              // }else{
              //   mydatasets[j+1] = {
              //     label : years[i]+" ("+Math.round(data.Data[0].January+data.Data[0].February+data.Data[0].March+data.Data[0].April+data.Data[0].May+data.Data[0].June+data.Data[0].July+data.Data[0].August+data.Data[0].September+data.Data[0].October+data.Data[0].November+data.Data[0].December).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3)+")",
              //     data : [data.Data[0].January,data.Data[0].February,data.Data[0].March,data.Data[0].April,data.Data[0].May,data.Data[0].June,data.Data[0].July,data.Data[0].August,data.Data[0].September,data.Data[0].October,data.Data[0].November,data.Data[0].December],
              //     backgroundColor : bgColor[j],
              //     borderColor : bocolor[j],
              //     borderWidth: 2,
              //     hoverBackgroundColor : hoverbgcolor[j],
              //     // type: 'line',
              //     // fill : false,
              //   }
              // }
              mydatasets[j] = {
                label : years[i]+" ("+Math.round(data.Data[0].January+data.Data[0].February+data.Data[0].March+data.Data[0].April+data.Data[0].May+data.Data[0].June+data.Data[0].July+data.Data[0].August+data.Data[0].September+data.Data[0].October+data.Data[0].November+data.Data[0].December).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3)+")",
                data : [data.Data[0].January,data.Data[0].February,data.Data[0].March,data.Data[0].April,data.Data[0].May,data.Data[0].June,data.Data[0].July,data.Data[0].August,data.Data[0].September,data.Data[0].October,data.Data[0].November,data.Data[0].December],
                backgroundColor : bgColor[i],
                borderColor : bocolor[i],
                borderWidth: 2,
                hoverBackgroundColor : hoverbgcolor[i],
                // type: 'line',
                // fill : false,
              }
              if(i == 0){
                if(this.chart != undefined){
                  this.chart.destroy();
                }
                this.chart = new Chart('MRcanvas', {
                  type : 'bar',
                  data : {
                    labels : ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
                    datasets : mydatasets
                  },
                  options: Options,
                })
              }else{
                this.chart.update();
              }
              // chart.update();
              // if(this.chart != undefined){
              //  this.chart.update();
              // }
              j++;
            }
            this.dashboard.ShowSpinnerHandler(false);
          });
          this.service.ChartVolumeCycleTimeCounts(years[i],this.SelectedMonths,this.SelectedLevels,this.SelectedRegions,this.SelectedMilestonestatus,this.SelectedImplementation,this.SelectedCountry,this.SelectedOwnership).subscribe(data =>{
            if(data.code == 200){
              if(data.Data.length > 0){
                CountDataset[k] = {
                  label : years[i]+" Project Count",
                  data: [data.Data[0].January_PC,data.Data[0].February_PC,data.Data[0].March_PC,data.Data[0].April_PC,data.Data[0].May_PC,data.Data[0].June_PC,data.Data[0].July_PC,data.Data[0].August_PC,data.Data[0].September_PC,data.Data[0].October_PC,data.Data[0].November_PC,data.Data[0].December_PC],
                  backgroundColor : anotherbackgroundColor[k],
                  borderColor : anotherbackgroundColor[k],
                  fill : false,lineTension: 0,
                  type : 'line',
                  yAxisID: 'B',
                  order : 2
                }
                VolumeDataset[k] = {
                  label : years[i]+" Revenue Total Volume USD",
                  data: [data.Data[0].January_RV,data.Data[0].February_RV,data.Data[0].March_RV,data.Data[0].April_RV,data.Data[0].May_RV,data.Data[0].June_RV,data.Data[0].July_RV,data.Data[0].August_RV,data.Data[0].September_RV,data.Data[0].October_RV,data.Data[0].November_RV,data.Data[0].December_RV],
                  backgroundColor : backgroundColor[k],
                  borderColor : bocolor[k],
                  borderWidth : 2,
                  hoverBackgroundColor : backgroundColor[k],
                  fill : false,
                  type : 'bar',
                  yAxisID: 'A',
                  order : 3
                }
                // VolumeCountDataset = CountDataset.concat(VolumeDataset);
                // CycleTimeDataset[k] = {
                //   label : years[i]+" Cycle Time",
                //   data: [data.Data[0].January_A,data.Data[0].February_A,data.Data[0].March_A,data.Data[0].April_A,data.Data[0].May_A,data.Data[0].June_A,data.Data[0].July_A,data.Data[0].August_A,data.Data[0].September_A,data.Data[0].October_A,data.Data[0].November_A,data.Data[0].December_A],
                //   backgroundColor : bgColor[k],
                //   borderColor : bocolor[k],
                //   borderWidth : 2,
                //   hoverBackgroundColor : hoverbgcolor[k],
                //   fill : false,
                //   type : 'bar',
                //   yAxisID: 'A',
                // }
                CycleTimeLineDataset[k] = {
                  label : years[i]+" Cycle Time",
                  data: [data.Data[0].January_A,data.Data[0].February_A,data.Data[0].March_A,data.Data[0].April_A,data.Data[0].May_A,data.Data[0].June_A,data.Data[0].July_A,data.Data[0].August_A,data.Data[0].September_A,data.Data[0].October_A,data.Data[0].November_A,data.Data[0].December_A],
                  backgroundColor : anotherbgColor[k],
                  borderColor : anotherbgColor[k],
                  fill : false,lineTension: 0,
                  type : 'line',
                  yAxisID: 'B',
                  order : 1
                }
                // CycleCountDataset = CountDataset.concat(CycleTimeDataset);
                VolumeCycleCountDataset = CountDataset.concat(VolumeDataset).concat(CycleTimeLineDataset);//.concat(VolumeDataset)
                if(i == 0){
                  if(this.CVchart != undefined){
                    this.CVchart.destroy();
                  }
                  this.CVchart = new Chart('CVcanvas', {
                    type : 'bar',
                    data : {
                      labels : ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
                      datasets: VolumeCycleCountDataset
                    },
                    options: Options2,
                  })
                  // if(this.CTchart != undefined){
                  //   this.CTchart.destroy();
                  // }
                  // this.CTchart = new Chart('CTcanvas', {
                  //   type : 'bar',
                  //   data : {
                  //     labels : ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
                  //     datasets: CycleCountDataset
                  //   },
                  //   options: Options3,
                  // })
                }else{
                  this.CVchart.update();
                  // this.CTchart.update();
                }
                k++;
                // j++;
              }
            }
          });
          // this.service.ProjectCountByYear(years[i],this.SelectedMonths,this.SelectedLevels,this.SelectedRegions,this.SelectedMilestonestatus,this.SelectedImplementation,this.SelectedCountry,this.SelectedOwnership).subscribe(data => {
          //   if(data.code == 200){
          //     if(data.Data.length > 0){
          //       PCmydatasets[l] = {
          //         label : years[i]+"",
          //         data : [data.Data[0].January,data.Data[0].February,data.Data[0].March,data.Data[0].April,data.Data[0].May,data.Data[0].June,data.Data[0].July,data.Data[0].August,data.Data[0].September,data.Data[0].October,data.Data[0].November,data.Data[0].December],
          //         backgroundColor : anotherbackgroundColor[l],
          //         borderColor : anotherbordercolor[l],
          //         fill : false,
          //       }
          //       if(i == 0){
          //         if(this.ypcchart != undefined){
          //           this.ypcchart.destroy();
          //         }
          //         this.ypcchart = new Chart('YPCcanvas', {
          //           type : 'line',
          //           data : {
          //             labels : ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
          //             datasets : PCmydatasets,
          //           },
          //           options: PCOptions,
          //         })
          //       }else{
          //         this.ypcchart.update();
          //       }
          //       l++;
          //     }
          //   }
          // });
          if(i == years.length-1){
            this.dashboard.ShowSpinnerHandler(false);
          }
        }
      }
      this.PLWProjectLevels = [];
      this.PLWProjectCount = [];
      this.PLWRevenueVolume = [];
      this.RWRegions = [];
      this.RWRevenueVolume = [];
      this.RWProjectCount = [];
      this.dashboard.ShowSpinnerHandler(true);
      this.rw_dataSource = null;
      this.service.RegionWiseRevenue(this.SelectedYears,this.SelectedMonths,this.SelectedLevels,this.SelectedRegions,this.SelectedMilestonestatus,this.SelectedImplementation,this.SelectedCountry,this.SelectedOwnership).subscribe(data =>{
        for(let i = 0;i<data.Data.length;i++){
          if(data.Data[i].RevenueVolume == null){
            data.Data[i].RevenueVolume_string = "$0";
          }else{
            data.Data[i].RevenueVolume_string = Math.round(data.Data[i].RevenueVolume).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
            
          }
        }
        data.Data = data.Data.sort((a,b) => a.Region__Opportunity_.localeCompare(b.Region__Opportunity_));
        data.Data.forEach(item =>{
          this.RWRegions.push(item.Region__Opportunity_);
          this.RWRevenueVolume.push(item.RevenueVolume);
          this.RWProjectCount.push(item.ProjectsCount);
        })
        this.rw_dataSource = data.Data;
        var Options = {
          legend: {
            display: true,
            position : 'bottom' as 'bottom',
            fullWidth : true,
            labels: {
                fontColor: '#000000',
                fontSize :  11,
                padding : 15,
                fontStyle : '500',
                fontFamily : 'Arial',
            }
          },
          tooltips: {
            mode: 'index',
            yAlign: "bottom",
            callbacks: {
              label: function(tooltipItems, data) {
                return data.labels[tooltipItems.index] +
                " : " + 
                Math.round(data.datasets[tooltipItems.datasetIndex].data[tooltipItems.index]).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3)
                // + " || Projects Count : " + data.datasets[tooltipItems.datasetIndex].labels[tooltipItems.index];
              }
            }
          },
          events: ['mousemove'],
          animation: {
            duration: 500,
            easing: "easeOutQuart",
            onComplete: function () {
              var ctx = this.chart.ctx;
              ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontFamily, 'normal', Chart.defaults.global.defaultFontFamily);
              ctx.textAlign = 'center';
              ctx.textBaseline = 'ideographic';
              this.data.datasets.forEach(function (dataset) {
                for (var i = 0; i < dataset.data.length; i++) {
                  var model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model,
                      total = dataset._meta[Object.keys(dataset._meta)[0]].total,
                      mid_radius = model.innerRadius + (model.outerRadius - model.innerRadius)/2,
                      start_angle = model.startAngle,
                      end_angle = model.endAngle,
                      mid_angle = start_angle + (end_angle - start_angle)/2;
                  var x = mid_radius * Math.cos(mid_angle);
                  var y = mid_radius * Math.sin(mid_angle);
        
                  ctx.fillStyle = '#000';
                  ctx.font = '400 10px Arial';
                  // if (i == 3){ // Darker text color for lighter background
                  //   ctx.fillStyle = '#444';
                  // }
        
                  var val = dataset.data[i];
                  var percent = String(Math.round(val/total*100)) + "%";
                  if(val != 0) {
                    // ctx.fillText(dataset.data[i], model.x + x, model.y + y);
                    // Display percent in another line, line break doesn't work for fillText
                    ctx.fillText(dataset.labels[i], model.x + x, model.y + y);
                    // ctx.fillText(percent, model.x + x, model.y + y + 15);
                  }
                }
              });
            }
          }
        }
        var Options2 = {
          showAllTooltips: true,
          legend: {
            display: true,
            position : 'bottom' as 'bottom',
            fullWidth : true,
            labels: {
                fontColor: '#000000',
                fontSize :  11,
                padding : 15,
                fontStyle : '500',
                fontFamily : 'Arial',
            }
          },
          tooltips: {
            callbacks: {
              label: function(tooltipItems, data) {
                if(tooltipItems.datasetIndex === 0){
                  // return data.labels[tooltipItems.index] +
                  return " Project Count : " + 
                  Math.round(data.datasets[tooltipItems.datasetIndex].data[tooltipItems.index]);
                }else if(tooltipItems.datasetIndex === 1){
                  // return data.labels[tooltipItems.index] +
                  return " Revenue Volume : " + 
                  Math.round(data.datasets[tooltipItems.datasetIndex].data[tooltipItems.index]).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
                }
              }
            }
          },
          plugins: {
            labels: false,
            //   {
            //     render: 'value',
            //     render: function (tooltipItems, data,args) {
            //       if(tooltipItems.datasetIndex === 1){
            //         return Math.round(args.value).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
            //       }else{
            //         return args.value;
            //       }
            //       //return Math.round(args.value).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
            //     },

            //     fontColor: '#6D6D6D',
            //     position: 'outside',
            //     textMargin: 6,
            //     arc: false,
            //     fontSize: 12,
            //     fontStyle: 'bold',
            //     fontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
            //     textShadow: true,
            //     shadowBlur: 15,
            //     shadowOffsetX: -2,
            //     shadowOffsetY: 2,
            //     shadowColor: '#6D6D6D',
            //   }
            // ],
          },
          events: ['mousemove'],
        }
        if(this.rwchart != undefined){
          this.rwchart.destroy();
        }
        this.rwchart = new Chart('RWcanvas', {
          type : 'doughnut',
          data : {
            // labels : this.PLWProjectLevels,
            labels : this.RWRegions,
            datasets : [
              {
                label : "Project Count",
                data : this.RWProjectCount,
                hoverBackgroundColor: [
                  'rgb(176, 185, 31,0.7)', 'rgb(0, 169, 201,0.7)', 'rgb(118, 173, 153,0.7)', 'rgb(252, 186, 47,0.7)', 'rgb(220, 220, 220,0.7)'
                ],
                backgroundColor: [
                  'rgb(176, 185, 31)', 'rgb(0, 169, 201)', 'rgb(118, 173, 153)', 'rgb(252, 186, 47)', 'rgb(220, 220, 220)'
                ]
                // 'rgb(151, 187, 205)', 'rgb(253, 180, 92)', 'rgb(247, 70, 74)', 'rgb(70, 191, 189)', 'rgb(220, 220, 220)'
              },
              {
                label : "Revenue Volume",
                data : this.RWRevenueVolume,
                hoverBackgroundColor: [
                  'rgb(176, 185, 31,0.7)', 'rgb(0, 169, 201,0.7)', 'rgb(118, 173, 153,0.7)', 'rgb(252, 186, 47,0.7)', 'rgb(220, 220, 220,0.7)'
                ],
                backgroundColor: [
                  'rgb(176, 185, 31)', 'rgb(0, 169, 201)', 'rgb(118, 173, 153)', 'rgb(252, 186, 47)', 'rgb(220, 220, 220)'
                ]
              }
            ]
          },
          options : Options2,
        })
        this.dashboard.ShowSpinnerHandler(false);
      });
      
      this.dashboard.ShowSpinnerHandler(true);
      this.plw_dataSource = null;
      this.service.ProjectLevelWise(this.SelectedYears,this.SelectedMonths,this.SelectedLevels,this.SelectedRegions,this.SelectedMilestonestatus,this.SelectedImplementation,this.SelectedCountry,this.SelectedOwnership).subscribe(data =>{
        for(let i = 0;i<data.Data.length;i++){
          if(data.Data[i].RevenueVolume == null){
            data.Data[i].RevenueVolume_string = "$0";
          }else{
            data.Data[i].RevenueVolume_string = Math.round(data.Data[i].RevenueVolume).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
          }
        }
        this.plw_dataSource = data.Data;
        data.Data.forEach( item =>{
          this.PLWProjectLevels.push(item.iMeet_Project_Level);
          this.PLWProjectCount.push(item.ProjectsCount);
          this.PLWRevenueVolume.push(item.RevenueVolume);
        })
        if(this.plwcanvas != undefined){
          this.plwcanvas.destroy();
        }
        var Options = {
          legend: {
            display: true,
            position : 'bottom' as 'bottom',
            fullWidth : true,
            labels: {
                fontColor: '#000000',
                fontSize :  11,
                padding : 15,
                fontStyle : '500',
                fontFamily : 'Arial',
            }
          },
          tooltips: {
            callbacks: {
              label: function(tooltipItems, data) {
                if(tooltipItems.datasetIndex === 0){
                  // return data.labels[tooltipItems.index] +
                  return " Project Count : " + 
                  Math.round(data.datasets[tooltipItems.datasetIndex].data[tooltipItems.index]);
                }else if(tooltipItems.datasetIndex === 1){
                  // return data.labels[tooltipItems.index] +
                  return " Revenue Volume : " + 
                  Math.round(data.datasets[tooltipItems.datasetIndex].data[tooltipItems.index]).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
                }
                
              }
            }
          },
          plugins: {
            labels: false,
          },
          events: ['mousemove'],
        }
        this.plwcanvas = new Chart('PLWcanvas', {
          type : 'doughnut',
          data : {
            labels : this.PLWProjectLevels,
            // labels : ["---","GCG","National","MCG"],
            datasets : [
              {
                label : "Project Count",
                data : this.PLWProjectCount,
                hoverBackgroundColor: [
                  'rgb(255, 61, 103,0.7)', 'rgb(5, 155, 255,0.7)', 'rgb(255, 194, 51,0.7)'
                ],
                backgroundColor: [
                  'rgb(255, 61, 103)', 'rgb(5, 155, 255)', 'rgb(255, 194, 51)'
                ]
                //           fill : false,
              },
              {
                label : "Revenue Volume",
                data : this.PLWRevenueVolume,
                hoverBackgroundColor: [
                  // 'rgb(255, 61, 103)', 'rgb(5, 155, 255)', 'rgb(255, 194, 51)'
                  'rgb(255, 61, 103,0.7)', 'rgb(5, 155, 255,0.7)', 'rgb(255, 194, 51,0.7)'
                ],
                backgroundColor: [
                  'rgb(255, 61, 103)', 'rgb(5, 155, 255)', 'rgb(255, 194, 51)'
                ]
              }
            ]
          },
          options : Options,
        })
        this.dashboard.ShowSpinnerHandler(false);
      })
      this.dashboard.ShowSpinnerHandler(true);
      this.StatusWiseData = [];      
      this.filterEntity = null;
      this.filterType = null;
      this.dataSource = null;
      this.service.ImeetMilestoneProjectStatus(this.SelectedYears,this.SelectedMonths,this.SelectedLevels,this.SelectedRegions,this.SelectedMilestonestatus,this.SelectedImplementation,this.SelectedCountry,this.SelectedOwnership).subscribe(data =>{
        if(data.code == 200){
          this.SelectedProjectCount = data.Data.length;
          this.TotalCost = Math.round(data.Data.map(t => t.Revenue_Total_Volume_USD).reduce((acc,value) => acc + value,0)).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
          this.StatusWiseData = data.Data;
          for(let i = 0;i<data.Data.length;i++){
            // this.StatusWiseData[i].Revenue_Total_Volume = this.StatusWiseData[i].Revenue_Total_Volume_USD.toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
            //this.StatusWiseData[i].Revenue_Total_Volume = Math.round(this.StatusWiseData[i].Revenue_Total_Volume_USD).toLocaleString().replace(/,/g, '');
            if(this.StatusWiseData[i].Revenue_Total_Volume_USD == null){
              this.StatusWiseData[i].Revenue_Total_Volume = "$0";
            }else{
              this.StatusWiseData[i].Revenue_Total_Volume = Math.round(this.StatusWiseData[i].Revenue_Total_Volume_USD).toLocaleString("en-US",{style : "currency",currency:"USD"}).slice(0,-3);
            }
            if(this.StatusWiseData[i].GoLiveDate == null){
              this.StatusWiseData[i].GoLiveDate_c = "---";
            }else{
              this.StatusWiseData[i].GoLiveDate_c = this.datepipe.transform(this.StatusWiseData[i].GoLiveDate, "yyyy-MMM-dd");
            }
          }
          this.filterEntity = new Data();
          this.filterType = MatTableFilter.ANYWHERE;
          this.dataSource = new MatTableDataSource(this.StatusWiseData);
          this.dataSource.sort = this.sort;
        }else{
          this.dataSource = null;
          this.SelectedProjectCount = 0;
          this.TotalCost = "$0";
        }
        this.dashboard.ShowSpinnerHandler(false);
      });
      this.VolumeCountCycleTime = [];
      this.dataSource_VCtPc = null;
      this.service.ChartVolumeCycleTimeCounts(this.SelectedYears,this.SelectedMonths,this.SelectedLevels,this.SelectedRegions,this.SelectedMilestonestatus,this.SelectedImplementation,this.SelectedCountry,this.SelectedOwnership).subscribe(data => {
        this.VolumeCountCycleTime = data.VolumeCountCycleTime;
        // this.dataSource_VCtPc = data.VolumeCountCycleTime;
        this.ChartProjectCount = Math.round(data.VolumeCountCycleTime.map(t => t.ProjectsCount).reduce((acc,value) => acc + value,0));
        this.ChartRevenueTotalVolume = Math.round(data.VolumeCountCycleTime.map(t => t.Revenue_Total_Volume_USD).reduce((acc,value) => acc + value,0)).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
        this.ChartAvgCycleTime = Math.round(data.VolumeCountCycleTime.map(t => t.cycletimesum).reduce((acc,value) => acc + value,0)/Math.round(data.VolumeCountCycleTime.map(t => t.cycletimeCount).reduce((acc,value) => acc + value,0)));
        for(let i =0; i<data.VolumeCountCycleTime.length; i++){
          if(this.VolumeCountCycleTime[i].Average <= 0)
          {
            this.VolumeCountCycleTime[i].AvgCycleTime = '0';
          }else{
            this.VolumeCountCycleTime[i].AvgCycleTime = (Math.round(this.VolumeCountCycleTime[i].Average)).toFixed(0);
          }
          if(this.VolumeCountCycleTime[i].Revenue_Total_Volume_USD > 0){
            this.VolumeCountCycleTime[i].Revenue_Total_Volume = this.VolumeCountCycleTime[i].Revenue_Total_Volume_USD.toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
          }else{
            this.VolumeCountCycleTime[i].Revenue_Total_Volume = "$0";
          }
        }
        this.dataSource_VCtPc = new MatTableDataSource(this.VolumeCountCycleTime);
        this.dashboard.ShowSpinnerHandler(false);
      });
    }
    // this.LoadingMonthlyTotalRevenue();
    this.LoadingMonthlyTotalVolumeWithDelta();
    this.Apply_disable = true;
    if(this.yearList.length > 1){
      if(this.SelectedYears.includes(this.CurrentYears)){
        this.DisplayDelta = true;
      }else{
        this.DisplayDelta = false;
      }
    }else{
      if(this.SelectedYears.includes(this.CurrentYears)){
        this.DisplayDelta = true;
      }else{
        this.DisplayDelta = false;
      }
    }
  }
  FormatingNumber(number : any){
    if(number == 0) {
      return '$'+0;
    }
    else
    {
      // hundreds
      if(number <= 999){
        return '$'+Math.round(number);
      }
      // thousands
      else if(number >= 1000 && number <= 999999){
        return '$'+Math.round(number / 1000) + 'K';
      }
      // millions
      else if(number >= 1000000 && number <= 999999999){
        return '$'+Math.round(number / 1000000) + 'M';
      }
      // billions
      else if(number >= 1000000000 && number <= 999999999999){
        return '$'+Math.round(number / 1000000000) + 'B';
      }
      else
        return '$'+Math.round(number);
    }
  }
  LastUpdatedOn;
  LoadingMonthlyTotalVolumeWithDelta(){
    this.dashboard.ShowSpinnerHandler(true);
    this.service.MonthlyTotalRevenueWithDelta().subscribe(data => {
      if(data.code == 200){
        this.LastUpdatedOn = this.datepipe.transform(data.LastUpdatedOn,"MMM-d-y, h:mm a") +" IST";
        let Monthly_Total_Revenue : MonthlyTotalRevenue[] = [
          {
            Leftheaders: 'Current Total Volume',
            Jan : Math.round(data.MonthlyTotalRevenueWithDelta[0].CMJan).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3), 
            Feb : Math.round(data.MonthlyTotalRevenueWithDelta[0].CMFeb).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3), 
            Mar : Math.round(data.MonthlyTotalRevenueWithDelta[0].CMMar).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3), 
            Apr : Math.round(data.MonthlyTotalRevenueWithDelta[0].CMApr).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3), 
            May : Math.round(data.MonthlyTotalRevenueWithDelta[0].CMMay).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3), 
            Jun : Math.round(data.MonthlyTotalRevenueWithDelta[0].CMJun).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3), 
            Jul : Math.round(data.MonthlyTotalRevenueWithDelta[0].CMJul).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3), 
            Aug : Math.round(data.MonthlyTotalRevenueWithDelta[0].CMAug).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3), 
            Sep : Math.round(data.MonthlyTotalRevenueWithDelta[0].CMSep).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3), 
            Oct : Math.round(data.MonthlyTotalRevenueWithDelta[0].CMOct).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3), 
            Nov : Math.round(data.MonthlyTotalRevenueWithDelta[0].CMNov).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3), 
            Dec : Math.round(data.MonthlyTotalRevenueWithDelta[0].CMDec).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3), 
            Total : Math.round(data.MonthlyTotalRevenueWithDelta[0].CMTot).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3)
          },
          {
            Leftheaders: 'Previous Total Volume',
            Jan : Math.round(data.MonthlyTotalRevenueWithDelta[0].LMJan).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3), 
            Feb : Math.round(data.MonthlyTotalRevenueWithDelta[0].LMFeb).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3), 
            Mar : Math.round(data.MonthlyTotalRevenueWithDelta[0].LMMar).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3), 
            Apr : Math.round(data.MonthlyTotalRevenueWithDelta[0].LMApr).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3), 
            May : Math.round(data.MonthlyTotalRevenueWithDelta[0].LMMay).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3), 
            Jun : Math.round(data.MonthlyTotalRevenueWithDelta[0].LMJun).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3), 
            Jul : Math.round(data.MonthlyTotalRevenueWithDelta[0].LMJul).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3), 
            Aug : Math.round(data.MonthlyTotalRevenueWithDelta[0].LMAug).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3), 
            Sep : Math.round(data.MonthlyTotalRevenueWithDelta[0].LMSep).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3), 
            Oct : Math.round(data.MonthlyTotalRevenueWithDelta[0].LMOct).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3), 
            Nov : Math.round(data.MonthlyTotalRevenueWithDelta[0].LMNov).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3), 
            Dec : Math.round(data.MonthlyTotalRevenueWithDelta[0].LMDec).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3), 
            Total : Math.round(data.MonthlyTotalRevenueWithDelta[0].LMTot).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3)
          },
          {
            Leftheaders: 'Delta',
            Jan : Math.round(data.MonthlyTotalRevenueWithDelta[0].CMJan - data.MonthlyTotalRevenueWithDelta[0].LMJan).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3), 
            Feb : Math.round(data.MonthlyTotalRevenueWithDelta[0].CMFeb - data.MonthlyTotalRevenueWithDelta[0].LMFeb).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3), 
            Mar : Math.round(data.MonthlyTotalRevenueWithDelta[0].CMMar - data.MonthlyTotalRevenueWithDelta[0].LMMar).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3), 
            Apr : Math.round(data.MonthlyTotalRevenueWithDelta[0].CMApr - data.MonthlyTotalRevenueWithDelta[0].LMApr).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3), 
            May : Math.round(data.MonthlyTotalRevenueWithDelta[0].CMMay - data.MonthlyTotalRevenueWithDelta[0].LMMay).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3), 
            Jun : Math.round(data.MonthlyTotalRevenueWithDelta[0].CMJun - data.MonthlyTotalRevenueWithDelta[0].LMJun).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3), 
            Jul : Math.round(data.MonthlyTotalRevenueWithDelta[0].CMJul - data.MonthlyTotalRevenueWithDelta[0].LMJul).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3), 
            Aug : Math.round(data.MonthlyTotalRevenueWithDelta[0].CMAug - data.MonthlyTotalRevenueWithDelta[0].LMAug).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3), 
            Sep : Math.round(data.MonthlyTotalRevenueWithDelta[0].CMSep - data.MonthlyTotalRevenueWithDelta[0].LMSep).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3), 
            Oct : Math.round(data.MonthlyTotalRevenueWithDelta[0].CMOct - data.MonthlyTotalRevenueWithDelta[0].LMOct).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3), 
            Nov : Math.round(data.MonthlyTotalRevenueWithDelta[0].CMNov - data.MonthlyTotalRevenueWithDelta[0].LMNov).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3), 
            Dec : Math.round(data.MonthlyTotalRevenueWithDelta[0].CMDec - data.MonthlyTotalRevenueWithDelta[0].LMDec).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3), 
            Total : Math.round(data.MonthlyTotalRevenueWithDelta[0].CMTot - data.MonthlyTotalRevenueWithDelta[0].LMTot).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3)
          }
        ];
        this.CurrentYear = data.GlobalManager;
        this.dataSource_delta = Monthly_Total_Revenue;
        this.dashboard.ShowSpinnerHandler(false);
      }else{
        this.dashboard.ShowSpinnerHandler(false);
        alert("Something Went Wrong!Unable to load Data");
      }
    })
  }
  // PevSelectedDeltaMonth : string;
  // PevMonthDeltaValue : string;

  SetGraphChart(){
    this.dashboard.ShowSpinnerHandler(true);
    var years = [];
    var backgroundColor = [
      'rgb(241, 130, 38)','rgb(59, 138, 217)','rgb(14, 61, 89)', 'rgb(255, 219, 105)', 'rgb(217,37,38)', 'rgb(75, 192, 192)', 'rgb(255, 99, 132)'
    ]
    var bordercolor = [
      'rgb(241, 130, 38)','rgb(59, 138, 217)','rgb(14, 61, 89)', 'rgb(255, 219, 105)', 'rgb(217,37,38)', 'rgb(75, 192, 192)', 'rgb(255, 99, 132)'
    ]
    var str = this.c_SelectedYears+"";
    var mydatasets = [];
    var VolumeDataset = [];
    var CountDataset = [];
    var VolumeCountDataset = [];
    var CycleCountDataset = [];
    var CycleTimeDataset = [];
    years = null;
    let j = 0;
    let k = 0;
    // this.Months = [];
    // this.Volume = [];
    // this.ProjectCount = [];
    // this.AvgCycleTime = [];
    
    var Options = {
      responsive : true,
      events: false,
      legend: {
        display: true,
        position : 'bottom' as 'bottom',
        fullWidth : true,
        labels: {
            fontColor: '#000000',
            fontSize :  13,
            padding : 15,
            fontStyle : '600',
            fontFamily : 'Arial',
        }
      },
      plugins: {
        labels: false,
      },
      tooltips: {
        enabled: false,
        callbacks: {
          label: function(tooltipItem) {
            return tooltipItem.yLabel;
          }
        }
      },
      // tooltips: {
      //   mode: 'index',
      //   intersect: false,
      //   callbacks: {
      //     label: function(tooltipItems, data) {
      //       return data.datasets[tooltipItems.datasetIndex].label + 
      //       " : " + 
      //       data.datasets[tooltipItems.datasetIndex].data[tooltipItems.index];
      //     }
      //   }
      // },
      scales: {
        yAxes: [{
          ticks: {
            fontSize : 10,
            fontStyle : 'normal',
            fontColor : '#000000',
            fontFamily : 'Arial',
          },
          scaleLabel: {
              display: true,
              labelString: 'Projects Count',
              fontSize : 12,
              fontStyle : 'normal',
              fontColor : '#000000',
              fontFamily : 'Arial',
          }
        }],
        xAxes: [{
          ticks: {
            fontSize : 10,
            fontStyle : 'normal',
            fontColor : '#000000',
            fontFamily : 'Arial',
          }
        }]
      },
      hover: {
        animationDuration: 0
      },
      animation: {
        duration: 1,
        onComplete: function () {
          var chartInstance = this.chart,
              ctx = chartInstance.ctx;
          ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          this.data.datasets.forEach(function (dataset, i) {
              var meta = chartInstance.controller.getDatasetMeta(i);
              meta.data.forEach(function (bar, index) {
                  var data = dataset.data[index]; 
                  ctx.font = "550 12px Arial";                    
                  ctx.fillText(data, bar._model.x, bar._model.y - 5);
              });
          });
        }
      }
    }
    var Options2 = {
      responsive : true,
      hover: {
        mode: 'index',
        intersect: false
      },
      legend: {
        display: true,
        position : 'bottom' as 'bottom',
        fullWidth : true,
        labels: {
            fontColor: '#000000',
            fontSize :  13,
            padding : 15,
            fontStyle : '600',
            fontFamily : 'Arial',
        }
      },
      plugins: {
        labels: false,
      },
      tooltips: {
        callbacks: {
          label: function(tooltipItems, data) {
            if(tooltipItems.datasetIndex === 0){
              // return data.labels[tooltipItems.index] +
              return " Project Count : " + 
              Math.round(data.datasets[tooltipItems.datasetIndex].data[tooltipItems.index]);
            }else if(tooltipItems.datasetIndex === 1){
              // return data.labels[tooltipItems.index] +
              return " Revenue Volume : " + 
              Math.round(data.datasets[tooltipItems.datasetIndex].data[tooltipItems.index]).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
            }
            
          }
        }
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
            callback: function(label, index, labels) {
              if(label == 0) {
                return 0;
              }
              else
              {
                // hundreds
                if(label <= 999){
                  return label;
                }
                // thousands
                else if(label >= 1000 && label <= 999999){
                  return (label / 1000) + 'K';
                }
                // millions
                else if(label >= 1000000 && label <= 999999999){
                  return (label / 1000000) + 'M';
                }
                // billions
                else if(label >= 1000000000 && label <= 999999999999){
                  return (label / 1000000000) + 'B';
                }
                else
                  return label;
              }
            }
          },
          scaleLabel: {
            display: true,
            labelString: 'Revenue Total Volume USD',
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
          }
        }]
      },
    }
    var Options3 = {
      responsive : true,
      hover: {
        mode: 'index',
        intersect: false
      },
      legend: {
        display: true,
        position : 'bottom' as 'bottom',
        fullWidth : true,
        labels: {
            fontColor: '#000000',
            fontSize :  13,
            padding : 15,
            fontStyle : '600',
            fontFamily : 'Arial',
        }
      },
      plugins: {
        labels: false,
      },
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
          }
        }]
      },
    }
    if(str == null || str == '' || this.c_SelectedYears == null){
      alert("Please select year and Try Again");
      // this.Apply_disable2 = false;
      this.dashboard.ShowSpinnerHandler(false);
    }else{
      years = str.split(',');
      if(years.length > 2){
        alert("You can select only 2 years for Comparision");
        this.dashboard.ShowSpinnerHandler(false);
        // this.Apply_disable2 = false;
      }else{
        for(let i=0;i<years.length;i++){
          if(years[i] == null || years[i] == ""){
            alert("Please select year and Try Again");
          }else{
            // this.service.ChartVolumeCycleTimeCount(years[i],this.SelectedMonths,this.SelectedLevels,this.SelectedRegions,this.SelectedLeader,this.SelectedMilestonestatus,this.SelectedImplementation).subscribe(data =>{
            //   if(data.code == 200){
            //     if(data.Data.length > 0){
            //       CountDataset[k] = {
            //         label : years[i]+" Project Count",
            //         data: [data.Data[0].January_PC,data.Data[0].February_PC,data.Data[0].March_PC,data.Data[0].April_PC,data.Data[0].May_PC,data.Data[0].June_PC,data.Data[0].July_PC,data.Data[0].August_PC,data.Data[0].September_PC,data.Data[0].October_PC,data.Data[0].November_PC,data.Data[0].December_PC],
            //         backgroundColor : backgroundColor[k],
            //         borderColor : bordercolor[k],
            //         fill : false,
            //         type : 'line',
            //         yAxisID: 'B',
            //       }
            //       VolumeDataset[k] = {
            //         label : years[i]+" Revenue Total Volume USD",
            //         data: [data.Data[0].January_RV,data.Data[0].February_RV,data.Data[0].March_RV,data.Data[0].April_RV,data.Data[0].May_RV,data.Data[0].June_RV,data.Data[0].July_RV,data.Data[0].August_RV,data.Data[0].September_RV,data.Data[0].October_RV,data.Data[0].November_RV,data.Data[0].December_RV],
            //         backgroundColor : backgroundColor[k],
            //         borderColor : bordercolor[k],
            //         fill : false,
            //         type : 'bar',
            //         yAxisID: 'A',
            //       }
            //       VolumeCountDataset = CountDataset.concat(VolumeDataset);
            //       CycleTimeDataset[k] = {
            //         label : years[i]+" Cycle Time",
            //         data: [data.Data[0].January_A,data.Data[0].February_A,data.Data[0].March_A,data.Data[0].April_A,data.Data[0].May_A,data.Data[0].June_A,data.Data[0].July_A,data.Data[0].August_A,data.Data[0].September_A,data.Data[0].October_A,data.Data[0].November_A,data.Data[0].December_A],
            //         backgroundColor : backgroundColor[k],
            //         borderColor : bordercolor[k],
            //         fill : false,
            //         type : 'bar',
            //         yAxisID: 'A',
            //       }
            //       CycleCountDataset = CountDataset.concat(CycleTimeDataset);
            //       if(i == 0){
            //         if(this.CVchart != undefined){
            //           this.CVchart.destroy();
            //         }
            //         this.CVchart = new Chart('CVcanvas', {
            //           type : 'bar',
            //           data : {
            //             //labels : this.Months,
            //             labels : ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
            //             datasets: VolumeCountDataset
            //           },
            //           options: Options2,
            //         })
            //         if(this.CTchart != undefined){
            //           this.CTchart.destroy();
            //         }
            //         this.CTchart = new Chart('CTcanvas', {
            //           type : 'bar',
            //           data : {
            //             labels : ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
            //             datasets: CycleCountDataset
            //           },
            //           options: Options3,
            //         })
            //       }else{
            //         this.CVchart.update();
            //         this.CTchart.update();
            //       }
            //       k++;
            //       // j++;
            //     }
            //   }
            // });
            // this.service.ProjectCountByYear(years[i],this.SelectedMonths,this.SelectedLevels,this.SelectedRegions,this.SelectedLeader,this.SelectedMilestonestatus,this.SelectedImplementation).subscribe(data => {
            //   if(data.code == 200){
            //     if(data.Data.length > 0){
            //       mydatasets[j] = {
            //         label : years[i]+"",
            //         data : [data.Data[0].January,data.Data[0].February,data.Data[0].March,data.Data[0].April,data.Data[0].May,data.Data[0].June,data.Data[0].July,data.Data[0].August,data.Data[0].September,data.Data[0].October,data.Data[0].November,data.Data[0].December],
            //         backgroundColor : backgroundColor[j],
            //         borderColor : bordercolor[j],
            //         fill : false,
            //       }
            //       if(i == 0){
            //         if(this.ypcchart != undefined){
            //           this.ypcchart.destroy();
            //         }
            //         this.ypcchart = new Chart('YPCcanvas', {
            //           type : 'line',
            //           data : {
            //             labels : ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
            //             datasets : mydatasets,
            //           },
            //           options: Options,
            //         })
            //       }else{
            //         this.ypcchart.update();
            //       }
            //       j++;
            //     }
            //   }
            // });
          }
          if(i == years.length-1){
            this.dashboard.ShowSpinnerHandler(false);
          }
        }
        // this.Apply_disable2 = true;
      }
    }
  }
  exportAsXLSX(){
    this.dashboard.ShowSpinnerHandler(true);
    // this.service.ChartVolumeCycleTimeCount(this.c_SelectedMilestonestatus,this.c_SelectedLevels,this.c_SelectedYears,this.c_SelectedMonths,this.c_SelectedRegions,this.c_SelectedImplementation).subscribe(data => {
    //   if(data.code == 200){
    //     this.excelService.exportAsExcelFile(data.VolumeCountCycleTime, 'Chart Volume-Count-CycleTime');
    //   }else{
    //     alert("Something Went wrong, Please Try again later");
    //   }
    //   this.dashboard.ShowSpinnerHandler(false);
    // });
  }
  exportRegionWiseData(){
    this.dashboard.ShowSpinnerHandler(true);
    this.service.ImeetMilestoneProjectStatus(this.SelectedYears,this.SelectedMonths,this.SelectedLevels,this.SelectedRegions,this.SelectedMilestonestatus,this.SelectedImplementation,this.SelectedCountry,this.SelectedOwnership).subscribe(data =>{
      if(data.code == 200){
        for(let i = 0;i<data.Data.length;i++){
          if(data.Data[i].Revenue_Total_Volume_USD == null){
            data.Data[i].RevenueVolumeUSD = null;
          }else{
            data.Data[i].RevenueVolumeUSD = data.Data[i].Revenue_Total_Volume_USD.toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3)
          }
          if(data.Data[i].GoLiveDate == null){
            data.Data[i].GoLiveDate = null;
          }else{
            data.Data[i].GoLiveDate = new Date(data.Data[i].GoLiveDate);
          }
        }
        const CustomizedData = data.Data.map(o => {
          return { 
            "Client": o.Client,
            "Go Live Date" : o.GoLiveDate,
            "iMeet Project Level" : o.iMeet_Project_Level,
            "Region Opportunity" : o.Region__Opportunity_,
            "Country" : o.Country,
            "Implementation Type" : o.Implementation_Type,
            "iMeet Milestone Project Status" : o.iMeet_Milestone___Project_Status,
            "Revenue Volume USD" : o.RevenueVolumeUSD,
          };
        });
        this.excelxsService.exportAsExcelFile(
          [
            {
              sheetName: 'Market Report',
              data: CustomizedData,
              defaultBackgroundColor : 'FF34495E',
              defaultTextColor : 'FFFFFFFF',
              columnFormats: {
                'dd/MMM/yyyy' : ['Go Live Date'], 
                '$#,##0.00;-$#,##0.00;0.00' : ['Revenue Volume USD']
              },
            },
          ],
          'Market Report'
        );
      }else{
        alert("Something Went wrong, Please Try again later");
      }
      this.service.UsersUsageofReports(this.LoginUID,"Implementation Market Report","Region Wise Market Export").subscribe(data =>{
      })
      this.dashboard.ShowSpinnerHandler(false);
    });
  }
  //Start of Year methods
  checkUncheckYears() {
    for (var i = 0; i < this.yearList.length; i++) {
      this.yearList[i].isSelected = this.masteryear;
    }
    this.getSelectedYear();
  }
  yearsSelected() {
    this.masteryear = this.yearList.every(function(item:any) {
        return item.isSelected == true;
    })
    this.getSelectedYear();
  }
  getSelectedYear(){
    this.Apply_disable = false;
    this.SelectedYears = null;
    for(let i=0;i<this.yearList.length;i++){
      if(this.yearList[i].isSelected == true){
        if(this.SelectedYears == null){
          this.SelectedYears = this.yearList[i].Go_Live_Year;
        }else{
          this.SelectedYears += ","+this.yearList[i].Go_Live_Year;
        }
      }else{
      }
    }
    this.yearListSelected = this.yearList.filter(s => s.isSelected == true);
  }
  // deselectyear(val : string){
  //   for(let i=0;i<this.yearList.length;i++){
  //     if(this.yearList[i].Go_Live_Year == val){
  //       this.yearList[i].isSelected = false;
  //     }else{
  //     }
  //   }
  //   this.yearsSelected();
  // }
  // rp_checkUncheckYears() {
  //   for (var i = 0; i < this.rp_yearList.length; i++) {
  //     this.rp_yearList[i].isSelected = this.masterrp_year;
  //   }
  //   this.rp_getSelectedYear();
  // }
  // rp_yearsSelected() {
  //   this.masterrp_year = this.rp_yearList.every(function(item:any) {
  //       return item.isSelected == true;
  //   })
  //   this.rp_getSelectedYear();
  // }
  // rp_getSelectedYear(){
  //   this.Apply_disable1 = false;
  //   this.rp_SelectedYears = null;
  //   for(let i=0;i<this.rp_yearList.length;i++){
  //     if(this.rp_yearList[i].isSelected == true){
  //       if(this.rp_SelectedYears == null){
  //         this.rp_SelectedYears = this.rp_yearList[i].Go_Live_Year;
  //       }else{
  //         this.rp_SelectedYears += ","+this.rp_yearList[i].Go_Live_Year;
  //       }
  //     }else{
  //     }
  //   }
  //   this.rp_yearSelected = this.rp_yearList.filter(s => s.isSelected == true);
  // }
  // rp_deselectyear(val : string){
  //   for(let i=0;i<this.rp_yearList.length;i++){
  //     if(this.rp_yearList[i].Go_Live_Year == val){
  //       this.rp_yearList[i].isSelected = false;
  //     }else{
  //     }
  //   }
  //   this.rp_getSelectedYear();
  // }
  //End of Year Methods
  //Start of Quarter Methods
  checkUncheckOwnerShip() {
    for (var i = 0; i < this.OwnerShipList.length; i++) {
      this.OwnerShipList[i].isSelected = this.masterownerShip;
    }
    this.getSelectedOwnerships();
  }
  OwnerShipSelected() {
    this.masterownerShip = this.OwnerShipList.every(function(item:any) {
        return item.isSelected == true;
    })
    this.getSelectedOwnerships();
  }
  getSelectedOwnerships(){
    this.Apply_disable = false;
    this.SelectedOwnership = null;
    for(let i=0;i<this.OwnerShipList.length;i++){
      if(this.OwnerShipList[i].isSelected == true){
        if(this.SelectedOwnership == null){
          this.SelectedOwnership = this.OwnerShipList[i].OwnerShip;
        }else{
          this.SelectedOwnership += ","+this.OwnerShipList[i].OwnerShip;
        }
      }else{
      }
    }
    this.OwnerShipListSelected = this.OwnerShipList.filter(s => s.isSelected == true);
  }
  // deselectqtr(val : string){
  //   for(let i=0;i<this.quarterList.length;i++){
  //     if(this.quarterList[i].Quarter == val){
  //       this.quarterList[i].isSelected = false;
  //     }else{
  //     }
  //   }
  //   this.quarterSelected();
  // }
  //End of Quarter Methods
  //Start of Month Methods
  checkUncheckMonths() {
    for (var i = 0; i < this.monthList.length; i++) {
      this.monthList[i].isSelected = this.mastermonth;
    }
    this.getSelectedMonth();
  }
  monthsSelected() {
    this.mastermonth = this.monthList.every(function(item:any) {
        return item.isSelected == true;
    })
    this.getSelectedMonth();
  }
  getSelectedMonth(){
    this.Apply_disable = false;
    this.SelectedMonths = null;
    for(let i=0;i<this.monthList.length;i++){
      if(this.monthList[i].isSelected == true){
        if(this.SelectedMonths == null){
          this.SelectedMonths = this.monthList[i].Go_Live_Month;
        }else{
          this.SelectedMonths += ","+this.monthList[i].Go_Live_Month;
        }
      }else{
      }
    }
    this.monthListSelected = this.monthList.filter(s => s.isSelected == true);
  }
  // deselectmonth(val : string){
  //   for(let i=0;i<this.monthList.length;i++){
  //     if(this.monthList[i].Go_Live_Month == val){
  //       this.monthList[i].isSelected = false;
  //     }else{
  //     }
  //   }
  //   this.monthsSelected();
  // }
  //End of Month Methods
  //Start of Project levels Methods
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
    this.SelectedLevels = null;
    for(let i=0;i<this.levelList.length;i++){
      if(this.levelList[i].isSelected == true){
        if(this.SelectedLevels == null){
          this.SelectedLevels = this.levelList[i].iMeet_Project_Level;
        }else{
          this.SelectedLevels += ","+this.levelList[i].iMeet_Project_Level;
        }
      }else{
      }
    }
    this.levelListSelected = this.levelList.filter(s => s.isSelected == true);
  }
  // deselectlevel(val : string){
  //   for(let i=0;i<this.levelList.length;i++){
  //     if(this.levelList[i].iMeet_Project_Level == val){
  //       this.levelList[i].isSelected = false;
  //     }else{
  //     }
  //   }
  //   this.levelSelected();
  // }
  //End of Project levels Methods
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
          this.SelectedRegions = this.regionList[i].Region__Opportunity_;
        }else{
          this.SelectedRegions += ","+this.regionList[i].Region__Opportunity_;
        }
      }else{
      }
    }
    this.regionListSelected = this.regionList.filter(s => s.isSelected == true);
  }
  // deselectregion(val : string){
  //   for(let i=0;i<this.regionList.length;i++){
  //     if(this.regionList[i].Region__Opportunity_ == val){
  //       this.regionList[i].isSelected = false;
  //     }else{
  //     }
  //   }
  //   this.regionSelected();
  // }
  //End of Region Methods
  //Start of Status Methods
  checkUncheckStatus() {
    for (var i = 0; i < this.statusList.length; i++) {
      this.statusList[i].isSelected = this.masterstatus;
    }
    this.getSelectedStatus();
  }
  statusSelected() {
    this.masterstatus = this.statusList.every(function(item:any) {
        return item.isSelected == true;
    })
    this.getSelectedStatus();
  }
  getSelectedStatus(){
    this.Apply_disable = false;
    this.SelectedStatus = null;
    for(let i=0;i<this.statusList.length;i++){
      if(this.statusList[i].isSelected == true){
        if(this.SelectedStatus == null){
          this.SelectedStatus = this.statusList[i].Backlog_Started;
        }else{
          this.SelectedStatus += ","+this.statusList[i].Backlog_Started;
        }
      }else{
      }
    }
    // this.statusListSelected = this.statusList.filter(s => s.isSelected == true);
  }
  // deselectstatus(val : string){
  //   for(let i=0;i<this.statusList.length;i++){
  //     if(this.statusList[i].Backlog_Started == val){
  //       this.statusList[i].isSelected = false;
  //     }else{
  //     }
  //   }
  //   this.statusSelected();
  // }
  //End of Status Methods
  //Start of Leader Methods
  checkUncheckLeader() {
    for (var i = 0; i < this.marketleaderList.length; i++) {
      this.marketleaderList[i].isSelected = this.masterleader;
    }
    this.getSelectedLeader();
  }
  leaderSelected() {
    this.masterleader = this.marketleaderList.every(function(item:any) {
        return item.isSelected == true;
    })
    this.getSelectedLeader();
  }
  getSelectedLeader(){
    this.Apply_disable = false;
    this.SelectedLeader = null;
    for(let i=0;i<this.marketleaderList.length;i++){
      if(this.marketleaderList[i].isSelected == true){
        if(this.SelectedLeader == null){
          this.SelectedLeader = this.marketleaderList[i].Market_Leader;
        }else{
          this.SelectedLeader += ","+this.marketleaderList[i].Market_Leader;
        }
      }else{
      }
    }
    // this.marketleaderListSelected = this.marketleaderList.filter(s => s.isSelected == true);
  }
  // deselectmarket(val : string){
  //   for(let i=0;i<this.marketleaderList.length;i++){
  //     if(this.marketleaderList[i].Market_Leader == val){
  //       this.marketleaderList[i].isSelected = false;
  //     }else{
  //     }
  //   }
  //   this.leaderSelected();
  // }
  //End of Leader Methods
  //Start of Country Methods
  checkUncheckCountry() {
    for (var i = 0; i < this.CountryList.length; i++) {
      this.CountryList[i].isSelected = this.masterCountry;
    }
    this.getSelectedCountry();
  }
  CountrySelected() {
    this.masterCountry = this.CountryList.every(function(item:any) {
        return item.isSelected == true;
    })
    this.getSelectedCountry();
  }
  getSelectedCountry(){
    this.Apply_disable = false;
    this.SelectedCountry = null;
    for(let i=0;i<this.CountryList.length;i++){
      if(this.CountryList[i].isSelected == true){
        if(this.SelectedCountry == null){
          this.SelectedCountry = this.CountryList[i].Country;
        }else{
          this.SelectedCountry += ","+this.CountryList[i].Country;
        }
      }else{
      }
    }
    // this.marketleaderListSelected = this.CountryList.filter(s => s.isSelected == true);
  }
  //End of Country Methods
  //Start of Implementation Methods
  checkUncheckImplementation() {
    for (var i = 0; i < this.implementationtypeList.length; i++) {
      this.implementationtypeList[i].isSelected = this.masterimplementation;
    }
    this.getSelectedType();
  }
  typeSelected() {
    this.masterimplementation = this.implementationtypeList.every(function(item:any) {
        return item.isSelected == true;
    })
    this.getSelectedType();
  }
  getSelectedType(){
    this.Apply_disable = false;
    this.SelectedImplementation = null;
    for(let i=0;i<this.implementationtypeList.length;i++){
      if(this.implementationtypeList[i].isSelected == true){
        if(this.SelectedImplementation == null){
          this.SelectedImplementation = this.implementationtypeList[i].Implementation_Type;
        }else{
          this.SelectedImplementation += ","+this.implementationtypeList[i].Implementation_Type;
        }
      }else{
      }
    }
    // this.implementationtypeListSelected = this.implementationtypeList.filter(s => s.isSelected == true);
  }
  // deselectType(val : string){
  //   for(let i=0;i<this.implementationtypeList.length;i++){
  //     if(this.implementationtypeList[i].Implementation_Type == val){
  //       this.implementationtypeList[i].isSelected = false;
  //     }else{
  //     }
  //   }
  //   this.typeSelected();
  // }
  //End of Implementation Methods
  //Start of MilestoneStatus Methods
  checkUncheckMilestoneStatus() {
    for (var i = 0; i < this.MilestonestatusList.length; i++) {
      this.MilestonestatusList[i].isSelected = this.masterMilestonestatus;
    }
    this.getSelectedMilestoneStatus();
  }
  MilestoneStatusSelected() {
    this.masterMilestonestatus = this.MilestonestatusList.every(function(item:any) {
        return item.isSelected == true;
    })
    this.getSelectedMilestoneStatus();
  }
  getSelectedMilestoneStatus(){
    this.Apply_disable = false;
    this.SelectedMilestonestatus = null;
    for(let i=0;i<this.MilestonestatusList.length;i++){
      if(this.MilestonestatusList[i].isSelected == true){
        if(this.SelectedMilestonestatus == null){
          this.SelectedMilestonestatus = this.MilestonestatusList[i].iMeet_Milestone___Project_Status;
        }else{
          this.SelectedMilestonestatus += ","+this.MilestonestatusList[i].iMeet_Milestone___Project_Status;
        }
      }else{
      }
      // this.SelectedMilestonestatus = this.MilestonestatusList.map(x => x.iMeet_Milestone___Project_Status).join(', ');
    }
    this.MilestonestatusListSelected = this.MilestonestatusList.filter(s => s.isSelected == true);
  }
  // deselectMilestoneStatus(val : string){
  //   for(let i=0;i<this.MilestonestatusList.length;i++){
  //     if(this.MilestonestatusList[i].iMeet_Milestone___Project_Status == val){
  //       this.MilestonestatusList[i].isSelected = false;
  //     }else{
  //     }
  //   }
  //   this.MilestoneStatusSelected();
  // }
  //End of MilestoneStatus Methods
  //Start of ProjectStatus Methods
  // checkUncheckProjectStatus() {
  //   for (var i = 0; i < this.projectstatusList.length; i++) {
  //     this.projectstatusList[i].isSelected = this.masterprojectstatus;
  //   }
  //   this.getSelectedProjectStatus();
  // }
  // projectstatusSelected() {
  //   this.masterprojectstatus = this.projectstatusList.every(function(item:any) {
  //       return item.isSelected == true;
  //   })
  //   this.getSelectedProjectStatus();
  // }
  // getSelectedProjectStatus(){
  //   this.Apply_disable1 = false;
  //   this.Selectedprojectstatus = null;
  //   for(let i=0;i<this.projectstatusList.length;i++){
  //     if(this.projectstatusList[i].isSelected == true){
  //       if(this.Selectedprojectstatus == null){
  //         this.Selectedprojectstatus = this.projectstatusList[i].iMeet_Milestone___Project_Status;
  //       }else{
  //         this.Selectedprojectstatus += ","+this.projectstatusList[i].iMeet_Milestone___Project_Status;
  //       }
  //     }else{
  //     }
  //   }
  //   this.projectstatusListSelected = this.projectstatusList.filter(s => s.isSelected == true);
  // }
  // deselectprojectstatus(val : string){
  //   for(let i=0;i<this.projectstatusList.length;i++){
  //     if(this.projectstatusList[i].iMeet_Milestone___Project_Status == val){
  //       this.projectstatusList[i].isSelected = false;
  //     }else{
  //     }
  //   }
  //   this.projectstatusSelected();
  // }
  //End of Status Methods
}