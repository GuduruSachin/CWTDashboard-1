import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Countries, HomeData } from 'src/app/Models/HomeData';
import { DashboardServiceService } from 'src/app/dashboard-service.service';
import { LivedashboardComponent } from '../livedashboard/livedashboard.component';
import { FormControl } from '@angular/forms';
import { Chart } from 'chart.js';
import { DatePipe } from '@angular/common';
import { DashboardComponent } from '../dashboard/dashboard.component';

@Component({
  selector: 'app-live-home-page',
  templateUrl: './live-home-page.component.html',
  styleUrls: ['./live-home-page.component.css']
})
export class LiveHomePageComponent implements OnInit {
  imageUrl : string;
  TotalRevenue : string;
  ProjectsCount : number;
  PipelineVolume : string;
  CurrentMonth : string;
  NextMonth : string;
  ActiveRevenue : string;
  ClosedRevenue : string;
  otherRevenue : string;
  Country_FC = new FormControl();
  // screenWidth : number;screenHeight  : number;
  // imageUrl : string = "assets/images/cwt.png";
  CurrentMonthVolume: string;
  CurrentMonthNActiveVolume: string;
  CurrentMonthRecords: string;
  CurrentMonthNActiveRecords: string;
  NextMonthVolume: string;
  NextMonthNActiveVolume: string;
  NextMonthRecords: string;
  NextMonthNActiveRecords: string;
  PreMonthVolume: string;
  PreMonthRecords: string;
  RoyMonthVolume: string;
  RoyMonthRecords: string;
  ExpectedCurrentMonthVolume: string;
  ExpectedCurrentMonthRecords: string;
  FutureYearsVolume: string;
  FutureYearsRecords: string;
  HoldVolume: string;
  HoldRecords: string;
  PipelineRecords: string;
  HighPotentialVolume: string;
  HighPotentialRecords: string;
  PotentialVolume: string;
  PotentialRecords: string;
  DisableCountry : boolean = true;
  CountryList : Countries[];mastercountry : boolean;CountryNG = [];SelectedCountry;
  constructor(private router : Router,public service : DashboardServiceService,public datepipe : DatePipe,public dashboard : LivedashboardComponent) { }
  // constructor(private router : Router) {
  //   this.screenWidth = window.innerWidth;
  //   this.screenHeight = window.innerHeight;
  //   window.onresize = () => {
  //     // set screenWidth on screen size change
  //     this.screenWidth = window.innerWidth;
  //     this.screenHeight = window.innerHeight;
  //   };
  //  }
  GlobalData : boolean;APACData : boolean;EMEAData : boolean;LATAMData : boolean;NORAMData : boolean;
  NPSScoreReached : boolean = true;
  ngOnInit() {
    this.GlobalData = true;
    this.imageUrl = "assets/images/cwt.png";
    this.GetData("APAC,EMEA,LATAM,NORAM,Global");
    // this.service.GeteSOWData().subscribe(data => {
    //   console.log(data)
    // })
  }
  SelectedRegion;NPSScore;ResponseReceived;
  rollling_nps_chart : any;
  YearMonths : any[] = [];
  NpsScores : any[] = [];
  ReceivedResponses : any[] = [];
  ExistingAddChangeCycleTime : any;
  ExistingAddChangeProjectCount : any;
  ExistingServiceCycleTime : any;
  ExistingServiceProjectCount : any;
  NewGlobalCycleTime : any;
  NewGlobalProjectCount : any;
  NewLocalCycleTime : any;
  NewLocalProjectCount : any;
  OverallCycleTime : any;
  OverallProjectCount : any;
  GetData(Region : string){
    this.SelectedRegion = Region;
    this.dashboard.ShowSpinnerHandler(true);
    this.service.HomeDetailsData(Region).subscribe(data =>{
      this.ExistingAddChangeCycleTime = data.ExistingAddChangeProjectCount > 0 ? Math.round(data.ExistingAddChangeCycleTime/data.ExistingAddChangeProjectCount) : 0 ;
      this.ExistingAddChangeProjectCount = data.ExistingAddChangeProjectCount;
      this.ExistingServiceCycleTime = data.ExistingServiceCycleTime > 0 ? Math.round(data.ExistingServiceCycleTime/data.ExistingServiceProjectCount) : 0;
      this.ExistingServiceProjectCount = data.ExistingServiceProjectCount;
      this.NewGlobalCycleTime = data.NewGlobalCycleTime > 0 ? Math.round(data.NewGlobalCycleTime/data.NewGlobalProjectCount) : 0;
      this.NewGlobalProjectCount = data.NewGlobalProjectCount;
      this.NewLocalCycleTime = data.NewLocalCycleTime > 0 ? Math.round(data.NewLocalCycleTime/data.NewLocalProjectCount) : 0;
      this.NewLocalProjectCount = data.NewLocalProjectCount;
      this.OverallCycleTime = data.OverallCycleTime > 0 ? Math.round(data.OverallCycleTime/data.OverallProjectCount) : 0;
      this.OverallProjectCount = data.OverallProjectCount;
      this.ProjectsCount = data.Projects;
      this.PipelineVolume = this.NumberConverter(data.PipelineVolume);
      this.CurrentMonthVolume = this.NumberConverter(data.CurrentMonthVolume);
      this.CurrentMonthNActiveVolume = this.NumberConverter(data.CurrentMonthNActiveVolume);
      this.CurrentMonthRecords = data.CurrentMonthRecords+"";
      this.CurrentMonthNActiveRecords = data.CurrentMonthNActiveRecords+"";
      this.NextMonthVolume = this.NumberConverter(data.NextMonthVolume);
      this.NextMonthNActiveVolume = this.NumberConverter(data.NextMonthNActiveVolume);
      this.NextMonthRecords = data.NextMonthRecords+"";
      this.NextMonthNActiveRecords = data.NextMonthNActiveRecords+"";
      this.PreMonthVolume = this.NumberConverter(data.PreMonthVolume);
      this.PreMonthRecords = data.PreMonthRecords+"";
      this.RoyMonthVolume = this.NumberConverter(data.RoyMonthVolume);
      this.RoyMonthRecords = data.RoyMonthRecords+"";
      this.ExpectedCurrentMonthVolume = this.NumberConverter(data.ExpectedCurrentMonthVolume);
      this.ExpectedCurrentMonthRecords = data.ExpectedCurrentMonthRecords+"";
      this.FutureYearsVolume = this.NumberConverter(data.FutureYearsVolume);
      this.FutureYearsRecords = data.FutureYearsRecords+"";
      this.HoldVolume = this.NumberConverter(data.HoldVolume);
      this.HoldRecords = data.HoldRecords+"";
      this.PipelineVolume = this.NumberConverter(data.PipelineVolume);
      this.PipelineRecords = data.PipelineRecords+"";
      this.HighPotentialVolume = this.NumberConverter(data.HighPotentialVolume);
      this.HighPotentialRecords = data.HighPotentialRecords+"";
      let Potential_Volume = Number(data.HighPotentialVolume)+Number(data.PipelineVolume)+Number(data.HoldVolume)+Number(data.FutureYearsVolume);
      this.PotentialVolume = this.NumberConverter(Potential_Volume);
      this.PotentialRecords = data.PotentialRecords+"";
      this.CountryList = data.Countries;
      this.CountryNG = [];
      this.mastercountry = true;
      this.CountryList.forEach( item =>{
        this.CountryNG.push(item.Country);
      })
      this.ResponseReceived = data.NpsData[0].NESurveyReceived;
      this.NPSScore = data.NpsData[0].NESurveyReceived == 0 ? 0 : (Math.round(((data.NpsData[0].NEPromoter/data.NpsData[0].NESurveyReceived)-(data.NpsData[0].NEDetractor/data.NpsData[0].NESurveyReceived))*100*100)/100).toFixed(1);
      if(this.NPSScore > 70){
        this.NPSScoreReached = true;
      }else{
        this.NPSScoreReached = false;
      }
      data.RollingNpsData.map((datas,index) => {
        datas.NPSScore = datas.NESurveyReceived == 0 ? 0 : (Math.round(((datas.NEPromoter/datas.NESurveyReceived)-(datas.NEDetractor/datas.NESurveyReceived))*100*100)/100).toFixed(1);
      })
      if(this.rollling_nps_chart != undefined){
        this.rollling_nps_chart.destroy();
      }
      this.YearMonths = [];
      this.NpsScores = [];
      this.ReceivedResponses = [];
      data.RollingNpsData.forEach(element => {
        this.YearMonths.push(this.datepipe.transform(element.YearMonth, "MMM-yy"));
        this.NpsScores.push(element.NPSScore);
        this.ReceivedResponses.push(element.NESurveyReceived)
      });
      var options3 = {
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
              return args.dataset.type == "line" ? "            "+args.value : args.value ;
            },
            fontColor: (c) => {
              return c.dataset.type == "line" ? '#000000' : '#1F8A4C'
            },
            // fontColor : '#3B3B3B',
            textMargin: 6,
            overlap: false,
            fontSize: 14,
            fontStyle : 'bold',
            fontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
          }
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
              return data.datasets[tooltipItems.datasetIndex].label + " : " + Math.round(data.datasets[tooltipItems.datasetIndex].data[tooltipItems.index])
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
              fontStyle : 'bold',
              fontColor : '#000000',
              fontFamily : 'Arial',
              beginAtZero: true,
            },
            gridLines: {
              color: "rgba(0, 0, 0, 0)",
            },
            scaleLabel: {
              display: true,
              labelString: 'Response Received',
              fontSize : 13,
              fontStyle : 'bold',
              fontColor : '#000000',
              fontFamily : 'Arial',
            }
          },{
            id: 'B',
            type: 'linear',
            position: 'right',
            ticks: {
              beginAtZero:true,
              fontSize : 12,
              fontStyle : 'bold',
              fontColor : '#000000',
              fontFamily : 'Arial',
            },
            gridLines: {
              color: "rgba(0, 0, 0, 0)",
            },
            scaleLabel: {
              display: true,
              labelString: 'NPS Score',
              fontSize : 13,
              fontStyle : 'bold',
              fontColor : '#000000',
              fontFamily : 'Arial',
            }
          }],
          xAxes: [{
            ticks: {
              fontSize : 12,
              fontStyle : 'bold',
              fontColor : '#000000',
              fontFamily : 'Arial',
            },
            gridLines: {
              color: "rgba(0, 0, 0, 0)",
            }
          }]
        },
      }
      this.rollling_nps_chart = new Chart('rollling_nps_chart', {
        type : 'bar',
        data : {
          labels: this.YearMonths,
          datasets : [
            {
              label: 'NPS Score',
              data: this.NpsScores,
              backgroundColor : 'rgba(93, 173,226 ,1)',
              borderColor : 'rgba(93, 173,226 ,1)',
              type : 'line',
              fill: false,
              lineTension: 0,
              yAxisID: 'B',
            },
            {
              label: 'Response Received',
              data: this.ReceivedResponses,
              backgroundColor : 'rgba(25, 215, 172,1)',
              borderColor : 'rgba(255, 255,255 ,1)',
              hoverBackgroundColor : 'rgba(25, 215, 172,1)',
              borderWidth: 2,
              type : 'bar',
              fill: false,
              yAxisID: 'A',
            }
          ]
        },
        options : options3,
      })
      // if(Region == "APAC,EMEA,LATAM,NORAM,Global"){
      // }else{
      //   this.onCountrychange();
      // }
      this.dashboard.ShowSpinnerHandler(false);
    })
  }
  GlobalClick(){
    this.GlobalData = true;
    this.APACData = false;
    this.EMEAData = false;
    this.LATAMData = false;
    this.NORAMData = false;
    this.DisableCountry = true;
    this.GetData("APAC,EMEA,LATAM,NORAM,Global");
  }
  APACClick(){
    this.GlobalData = false;
    this.APACData = true;
    this.EMEAData = false;
    this.LATAMData = false;
    this.NORAMData = false;
    this.DisableCountry = false;
    this.GetData("APAC");
  }
  LATAMClick(){
    this.GlobalData = false;
    this.APACData = false;
    this.EMEAData = false;
    this.LATAMData = true;
    this.NORAMData = false;
    this.DisableCountry = false;
    this.GetData("LATAM");
  }
  NORAMClick(){
    this.GlobalData = false;
    this.APACData = false;
    this.EMEAData = false;
    this.LATAMData = false;
    this.NORAMData = true;
    this.DisableCountry = false;
    this.GetData("NORAM");
  }
  EMEAClick(){
    this.GlobalData = false;
    this.APACData = false;
    this.EMEAData = true;
    this.LATAMData = false;
    this.NORAMData = false;
    this.DisableCountry = false;
    this.GetData("EMEA");
  }
  checkUncheckCountry(){
    if(this.mastercountry == true){
      this.CountryNG = [];
      this.CountryList.forEach( item =>{
        this.CountryNG.push(item.Country);
      })
    }else{
      this.CountryNG = [];
    }
    this.onCountrychange();
  }
  onCountrychange(){
    if(this.CountryNG.length == this.CountryList.length){
      this.mastercountry = true;
    }else{
      this.mastercountry = false;
    }
    this.SelectedCountry = null;
    for(let i=0;i<this.CountryNG.length;i++){
      if(i == 0){
        this.SelectedCountry = this.CountryNG[i];
      }else{
        this.SelectedCountry += ","+this.CountryNG[i];
      }
    }
    if(this.SelectedCountry == null || this.SelectedCountry == ""){
    }else{
      this.service.HomeDetailsDataWithCountry(this.SelectedRegion,this.SelectedCountry).subscribe(data =>{
        this.ExistingAddChangeCycleTime = data.ExistingAddChangeProjectCount > 0 ? Math.round(data.ExistingAddChangeCycleTime/data.ExistingAddChangeProjectCount) : 0 ;
        this.ExistingAddChangeProjectCount = data.ExistingAddChangeProjectCount;
        this.ExistingServiceCycleTime = data.ExistingServiceCycleTime > 0 ? Math.round(data.ExistingServiceCycleTime/data.ExistingServiceProjectCount) : 0;
        this.ExistingServiceProjectCount = data.ExistingServiceProjectCount;
        this.NewGlobalCycleTime = data.NewGlobalCycleTime > 0 ? Math.round(data.NewGlobalCycleTime/data.NewGlobalProjectCount) : 0;
        this.NewGlobalProjectCount = data.NewGlobalProjectCount;
        this.NewLocalCycleTime = data.NewLocalCycleTime > 0 ? Math.round(data.NewLocalCycleTime/data.NewLocalProjectCount) : 0;
        this.NewLocalProjectCount = data.NewLocalProjectCount;
        this.OverallCycleTime = data.OverallCycleTime > 0 ? Math.round(data.OverallCycleTime/data.OverallProjectCount) : 0;
        this.OverallProjectCount = data.OverallProjectCount;
        this.ProjectsCount = data.Projects;
        this.PipelineVolume = this.NumberConverter(data.PipelineVolume);
        this.CurrentMonthVolume = this.NumberConverter(data.CurrentMonthVolume);
        this.CurrentMonthNActiveVolume = this.NumberConverter(data.CurrentMonthNActiveVolume);
        this.CurrentMonthRecords = data.CurrentMonthRecords+"";
        this.CurrentMonthNActiveRecords = data.CurrentMonthNActiveRecords+"";
        this.NextMonthVolume = this.NumberConverter(data.NextMonthVolume);
        this.NextMonthNActiveVolume = this.NumberConverter(data.NextMonthNActiveVolume);
        this.NextMonthRecords = data.NextMonthRecords+"";
        this.NextMonthNActiveRecords = data.NextMonthNActiveRecords+"";
        this.PreMonthVolume = this.NumberConverter(data.PreMonthVolume);
        this.PreMonthRecords = data.PreMonthRecords+"";
        this.RoyMonthVolume = this.NumberConverter(data.RoyMonthVolume);
        this.RoyMonthRecords = data.RoyMonthRecords+"";
        this.ExpectedCurrentMonthVolume = this.NumberConverter(data.ExpectedCurrentMonthVolume);
        this.ExpectedCurrentMonthRecords = data.ExpectedCurrentMonthRecords+"";
        this.FutureYearsVolume = this.NumberConverter(data.FutureYearsVolume);
        this.FutureYearsRecords = data.FutureYearsRecords+"";
        this.HoldVolume = this.NumberConverter(data.HoldVolume);
        this.HoldRecords = data.HoldRecords+"";
        this.PipelineVolume = this.NumberConverter(data.PipelineVolume);
        this.PipelineRecords = data.PipelineRecords+"";
        this.HighPotentialVolume = this.NumberConverter(data.HighPotentialVolume);
        this.HighPotentialRecords = data.HighPotentialRecords+"";
        let Potential_Volume = Number(data.HighPotentialVolume)+Number(data.PipelineVolume)+Number(data.HoldVolume)+Number(data.FutureYearsVolume);
        this.PotentialVolume = this.NumberConverter(Potential_Volume);
        this.PotentialRecords = data.PotentialRecords+"";
        // this.ResponseReceived = data.NpsData[0].NESurveyReceived;
        // this.NPSScore = data.NpsData[0].NESurveyReceived == 0 ? 0 : (Math.round(((data.NpsData[0].NEPromoter/data.NpsData[0].NESurveyReceived)-(data.NpsData[0].NEDetractor/data.NpsData[0].NESurveyReceived))*100*100)/100).toFixed(1);
        // if(this.NPSScore > 70){
        //   this.NPSScoreReached = true;
        // }else{
        //   this.NPSScoreReached = false;
        // }
        // data.RollingNpsData.map((datas,index) => {
        //   datas.NPSScore = datas.NESurveyReceived == 0 ? 0 : (Math.round(((datas.NEPromoter/datas.NESurveyReceived)-(datas.NEDetractor/datas.NESurveyReceived))*100*100)/100).toFixed(1);
        // })
        // if(this.rollling_nps_chart != undefined){
        //   this.rollling_nps_chart.destroy();
        // }
        // this.YearMonths = [];
        // this.NpsScores = [];
        // this.ReceivedResponses = [];
        // data.RollingNpsData.forEach(element => {
        //   this.YearMonths.push(this.datepipe.transform(element.YearMonth, "MMM-yy"));
        //   this.NpsScores.push(element.NPSScore);
        //   this.ReceivedResponses.push(element.NESurveyReceived)
        // });
        // this.rollling_nps_chart = new Chart('rollling_nps_chart', {
        //   type : 'bar',
        //   data : {
        //     labels: this.YearMonths,
        //     datasets : [
        //       {
        //         label: 'Nps Score',
        //         data: this.NpsScores,
        //         backgroundColor : 'rgba(93, 173,226 ,1)',
        //         borderColor : 'rgba(93, 173,226 ,1)',
        //         type : 'line',
        //         fill: false,
        //         lineTension: 0,
        //         yAxisID: 'B',
        //       },
        //       {
        //         label: 'Response Received',
        //         data: this.ReceivedResponses,
        //         backgroundColor : 'rgba(88, 214, 141,1)',
        //         borderColor : 'rgba(255, 255,255 ,1)',
        //         hoverBackgroundColor : 'rgba(88, 214, 141,1)',
        //         borderWidth: 2,
        //         type : 'bar',
        //         fill: false,
        //         yAxisID: 'A',
        //       }
        //     ]
        //   },
        //   options : options3,
        // })
        this.dashboard.ShowSpinnerHandler(false);
      })
    }
  }
  NumberConverter(label : any) : string{
    if(label == null || label == ""){
      return "$0";
    }else if(label <= 999){
      return '$' + label+"";
    }
    // thousands
    else if(label >= 1000 && label <= 999999){
      return '$' + Math.round(label / 1000) + 'K';
    }
    // millions
    else if(label >= 1000000 && label <= 999999999){
      return '$' + Math.round(label / 1000000) + 'M';
    }
    // billions
    else if(label >= 1000000000 && label <= 999999999999){
      return '$' + Math.round(label / 1000000000) + 'B';
    }
    else
      return '$' + label;
  }
}