import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardServiceService } from 'src/app/dashboard-service.service';
import { ExcelService } from 'src/app/excel.service';
import { DigitalOBTManager, FilterGlobalDigitalOBTLead, FilterProjectStatu, FilterQuarter, FilterRegion, FilterYears } from 'src/app/Models/AutomatedCLRFilters';
import { LivedashboardComponent } from '../livedashboard/livedashboard.component';
import { Chart } from 'chart.js';
import { Data } from 'src/app/Models/Responce';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { FormControl } from '@angular/forms';
export class MyFilter {
  OBTReseller: string[];
}
@Component({
  selector: 'app-digital-report',
  templateUrl: './digital-report.component.html',
  styleUrls: ['./digital-report.component.css']
})
export class DigitalReportComponent implements OnInit {
  constructor(private router : Router,private route : ActivatedRoute,private cdr: ChangeDetectorRef,private service : DashboardServiceService,public dialog: MatDialog,public datepipe : DatePipe,private dashboard : LivedashboardComponent,private excelService:ExcelService) {
    // set screenWidth on page load
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    window.onresize = () => {
      // set screenWidth on screen size change
      this.screenWidth = window.innerWidth;
      this.screenHeight = window.innerHeight;
    };
  }
  screenWidth : number;
  screenHeight  : number;
  Apply_disable : boolean;
  
  RegionList : FilterRegion[];
  RegionListSelected : FilterRegion[];
  QuarterList : FilterQuarter[];
  QuarterListSelected : FilterQuarter[];
  LeaderList : FilterGlobalDigitalOBTLead[];
  LeaderListSelected : FilterGlobalDigitalOBTLead[];
  ManagerList : DigitalOBTManager[];
  ManagerListSelected : DigitalOBTManager[];
  statusList : FilterProjectStatu[];
  statusListSelected : FilterProjectStatu[];
  
  yearList : FilterYears[];
  yearListSelected : FilterYears[];
  SelectedRegion : any;SelectedQuarter : any;SelectedLeader : any;SelectedManager;SelectedStatus : any;SelectedYears : any;
  masterRegion;masterleader;mastermanager;masterquarter;masterStatus : boolean;masteryear : boolean;
  dataSource;dataSource_data;
  displayedColumns: string[] = ['OBTReseller','APAC','EMEA','LATAM','NORAM','GrandTotal'];
  displayedColumns_data : string[] = ['Client','RevenueID','Country','iMeet_Workspace_Title','ImplementationType','OBT_Reseller___Direct','Region','ProjectStatus','CountryStatus','GlobalCISOBTLead','RegionalCISOBTLead','LocalDigitalOBTLead','GlobalCISPortraitLead','RegionalCISPortraitLead','GlobalCISHRFeedSpecialist','ActivityType','GDS','ComplexityScore','GoLiveYear','Quarter','RecordStatus','DataSourceType'];
  
  imp_displayColumns : any = [];
  imp_datasource : any = [];
  a_type_displayColumns : any = [];
  a_type_datasource : any = [];
  ngOnInit(): void {
    this.ResetFilters();
  }
  isLoading;isLoading_OR;
  ResetFilters(){
    this.dashboard.ShowSpinnerHandler(true);
    this.service.AutomatedCLRFilters().subscribe(data =>{
      if(data.code == 200){
        this.RegionList = data.FilterRegion;
        this.masterRegion = true;
        this.getSelectedRegion();
        this.QuarterList = data.FilterQuarter;
        this.masterquarter = true;
        this.getSelectedQuarter();
        this.LeaderList = data.FilterGlobalDigitalOBTLead;
        this.LeaderList.push({GlobalCISOBTLead : "(Blanks)",DigitalOBTManager : [{Manager : "(Blanks)",
        isSelected: true}],isSelected: true});
        this.masterleader = true;
        this.getSelectedleader();
        this.ManagerList = [];
        for(let i = 0;i<this.LeaderList.length;i++){
          this.LeaderList[i].DigitalOBTManager.forEach(item =>{
            this.ManagerList.push(item);
          })
        }
        this.mastermanager = true;
        this.getSelectedManager();
        this.statusList = data.FilterProjectStatus;
        this.masterStatus = false;
        // this.c_MilestonestatusList = data.c_MilestoneStatus;
        // this.c_masterMilestonestatus = false;
        for (var i = 0; i < this.statusList.length; i++) {
          if(this.statusList[i].ProjectStatus == "P-Pipeline" || this.statusList[i].ProjectStatus == "HP-High Potential"|| this.statusList[i].ProjectStatus == "EP-Early Potential"|| this.statusList[i].ProjectStatus == "X-Cancelled"){
            this.statusList[i].isSelected = false;
            // this.c_MilestonestatusList[i].isSelected = true;
          }else{
            this.statusList[i].isSelected = true;
            // this.c_MilestonestatusList[i].isSelected = false;
          }
        }
        this.getSelectedstatus();
        this.yearList = data.FilterYears;
        this.masteryear = false;
        // this.c_MilestonestatusList = data.c_MilestoneStatus;
        // this.c_masterMilestonestatus = false;
        for (var i = 0; i < this.yearList.length; i++) {
          if(this.yearList[i].Year == "2050"){
            this.yearList[i].isSelected = false;
            // this.c_MilestonestatusList[i].isSelected = true;
          }else{
            this.yearList[i].isSelected = true;
            // this.c_MilestonestatusList[i].isSelected = false;
          }
        }
        this.getSelectedYear();
        // this.SetGraph();
        this.GetData();
        this.dashboard.ShowSpinnerHandler(false);
      }
    });
    this.Apply_disable = true;
  }
  regionGDS : any;
  regionYear : any;
  regionimpyType : any;
  regionCountrystatus : any;
  regionActivityType : any;
  GDS_Values = [];
  gds_apac = [];
  gds_emea = [];
  gds_noram = [];
  gds_latam = [];
  Year_Values = [];
  year_apac = [];
  year_emea = [];
  year_noram = [];
  year_latam = [];
  impType_Values = [];
  impType_apac = [];
  impType_emea = [];
  impType_noram = [];
  impType_latam = [];
  C_status_Values = [];
  C_status_apac = [];
  C_status_emea = [];
  C_status_noram = [];
  C_status_latam = [];
  ActivityType_Values = [];
  ActivityType_apac = [];
  ActivityType_emea = [];
  ActivityType_noram = [];
  ActivityType_latam = [];
  
  @ViewChild('DRSort') DRSort: MatSort;
  @ViewChild('DROBT_R_Sort') DROBT_R_Sort: MatSort;
  OBTResellerList : any = [];
  OBTListWithoutBlank : any = [];
  GetData(){
    this.GDS_Values = [];
    this.gds_apac = [];
    this.gds_emea = [];
    this.gds_noram = [];
    this.gds_latam = [];
    this.Year_Values = [];
    this.year_apac = [];
    this.year_emea = [];
    this.year_noram = [];
    this.year_latam = [];
    this.impType_Values = [];
    this.impType_apac = [];
    this.impType_emea = [];
    this.impType_noram = [];
    this.impType_latam = [];
    this.C_status_Values = [];
    this.C_status_apac = [];
    this.C_status_emea = [];
    this.C_status_noram = [];
    this.C_status_latam = [];
    this.ActivityType_Values = [];
    this.ActivityType_apac = [];
    this.ActivityType_emea = [];
    this.ActivityType_noram = [];
    this.ActivityType_latam = [];
    // this.isLoading = true;
    this.isLoading_OR = true;
    var options3 = {
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
      chartArea: {
        backgroundColor: 'rgba(251, 85, 85, 0.4)'
      },
      title: {
        display: true,
        text: ' '
      },
      scales: {
        xAxes: [{ 
          stacked: true,
          ticks: {
            display: false,
            maxRotation: 90,
            minRotation: 90,
            fontSize : 13,
            fontStyle : 'normal',
            fontColor : '#000000',
            fontFamily : 'Arial',
          },
          gridLines: {
            color: "rgba(0, 0, 0, 0)",
          }
        }],
        yAxes: [{ 
          stacked: true,
          ticks: {
            beginAtZero: true,
            fontSize : 13,
            fontStyle : 'normal',
            fontColor : '#000000',
            fontFamily : 'Arial',
          },
          gridLines: {
            color: "rgba(0, 0, 0, 0)",
          }
        }]
      },
      plugins: {
        labels: false,
        // labels: {
        //   display: false,
          // render: 'value',
          // fontColor: '#3B3B3B',
          // position: 'outside',
          // textMargin: 6,
          // fontSize: 12,
          // fontStyle: 'bold',
          // fontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
        // },
      },
      tooltips: {
        mode: 'index' as 'index',
        intersect: false,
        callbacks: {
          label: function(tooltipItems, data) {
            return data.datasets[tooltipItems.datasetIndex].label + " " + data.datasets[tooltipItems.datasetIndex].data[tooltipItems.index];
          }
        }
      },
    }
    var options2 = {
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
      chartArea: {
        backgroundColor: 'rgba(251, 85, 85, 0.4)'
      },
      // hover: {
      //   mode: 'index',
      //   intersect: false
      // },
      title: {
        display: true,
        text: ' '
      },
      scales: {
        xAxes: [{ 
          // stacked: true,
          // renderer: {
          //   labels: {
          //     wrap: true,
          //     // maxWidth: 120
          //   }
          // },
          ticks: {
            // callback: function(label, index, labels) {
            //   if (/\s/.test(label)) {
            //     return label.split(" ");
            //   }else{
            //     return label;
            //   }              
            // },
            fontSize : 13,
            fontStyle : 'normal',
            fontColor : '#000000',
            fontFamily : 'Arial',
          },
          gridLines: {
            color: "rgba(0, 0, 0, 0)",
          }
        }],
        yAxes: [{ 
          // stacked: true,
          ticks: {
            beginAtZero: true,
            fontSize : 13,
            fontStyle : 'normal',
            fontColor : '#000000',
            fontFamily : 'Arial',
          },
          gridLines: {
            color: "rgba(0, 0, 0, 0)",
          }
        }]
      },
      plugins: {
        labels: {
          render: 'value',
          fontColor: '#3B3B3B',
          position: 'outside',
          textMargin: 6,
          fontSize: 12,
          fontStyle: 'bold',
          fontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
        },
      },
    }
    console.log(this.SelectedManager)
    this.service.DRRegionWiseGDS(this.SelectedYears,this.SelectedQuarter,this.SelectedStatus,this.SelectedRegion,this.SelectedManager).subscribe(data=>{
      for(let i = 0; i<data.Data.length;i++){
        if(data.Data[i].GDS == null){
          this.GDS_Values.push("Blanks");
        }
        else{
          this.GDS_Values.push(data.Data[i].GDS);
        }
        this.gds_apac.push(data.Data[i].APAC);
        this.gds_emea.push(data.Data[i].EMEA);
        this.gds_latam.push(data.Data[i].LATAM);
        this.gds_noram.push(data.Data[i].NORAM);
      }
      if(this.regionGDS != undefined){
        this.regionGDS.destroy();
      }
      this.regionGDS = new Chart('regionGDS', {
        type : 'bar',
        data : {
          labels: this.GDS_Values,
          datasets : [
            {
              label: 'APAC',
              data: this.gds_apac,
              backgroundColor: 'rgb(176, 185, 31)'
            },
            {
              label: 'EMEA',
              data: this.gds_emea,
              backgroundColor: 'rgb(0, 169, 201)'
            },
            {
              label: 'LATAM',
              data: this.gds_latam,
              backgroundColor: 'rgb(118, 173, 153)'
            },
            {
              label: 'NORAM',
              data: this.gds_noram,
              backgroundColor: 'rgb(252, 186, 47)'
            }
          ]
        },
        options : options2,
      })
    })
    this.service.DRRegionWiseYear(this.SelectedYears,this.SelectedQuarter,this.SelectedStatus,this.SelectedRegion,this.SelectedManager).subscribe(data=>{
      for(let i = 0; i<data.Data.length;i++){
        if(data.Data[i].Year == null){
          this.Year_Values.push("Blanks");
        }
        else{
          this.Year_Values.push(data.Data[i].Year);
        }
        this.year_apac.push(data.Data[i].APAC);
        this.year_emea.push(data.Data[i].EMEA);
        this.year_noram.push(data.Data[i].NORAM);
        this.year_latam.push(data.Data[i].LATAM);
      }
      if(this.regionYear != undefined){
        this.regionYear.destroy();
      }
      this.regionYear = new Chart('regionYear', {
        type : 'bar',
        data : {
          labels: this.Year_Values,
          datasets : [
            {
              label: 'APAC',
              data: this.year_apac,
              backgroundColor: 'rgb(176, 185, 31)'
            },
            {
              label: 'EMEA',
              data: this.year_emea,
              backgroundColor: 'rgb(0, 169, 201)'
            },
            {
              label: 'LATAM',
              data: this.year_latam,
              backgroundColor: 'rgb(118, 173, 153)'
            },
            {
              label: 'NORAM',
              data: this.year_noram,
              backgroundColor: 'rgb(252, 186, 47)'
            }
          ]
        },
        options : options2,
      })
    })
    this.service.DRRegionWiseImplementationType(this.SelectedYears,this.SelectedQuarter,this.SelectedStatus,this.SelectedRegion,this.SelectedManager).subscribe(data=>{
      for(let i = 0; i<data.Data.length;i++){
        if(data.Data[i].ImplementationType == null){
          this.impType_Values.push("Blanks");
        }
        else{
          this.impType_Values.push(data.Data[i].ImplementationType);
        }
        this.impType_apac.push(data.Data[i].APAC);
        this.impType_emea.push(data.Data[i].EMEA);
        this.impType_noram.push(data.Data[i].NORAM);
        this.impType_latam.push(data.Data[i].LATAM);
      }
      if(this.regionimpyType != undefined){
        this.regionimpyType.destroy();
      }
      this.imp_Data = data.Data;
      this.imp_displayColumns = [];
      this.imp_displayColumns.push('Region');
      this.imp_Data.forEach((item) => {
        this.imp_displayColumns.push(item.ImplementationType);
      });
      this.imp_displayColumns.push("Total");
      this.imp_datasource = this.imp_inputColumns.map((x) => this.imp_formatInputRow(x));
      this.imp_datasource[0].Total = Math.round(data.Data.map(t => t.APAC).reduce((acc,value) => acc + value,0));
      this.imp_datasource[1].Total = Math.round(data.Data.map(t => t.EMEA).reduce((acc,value) => acc + value,0));
      this.imp_datasource[2].Total = Math.round(data.Data.map(t => t.LATAM).reduce((acc,value) => acc + value,0));
      this.imp_datasource[3].Total = Math.round(data.Data.map(t => t.NORAM).reduce((acc,value) => acc + value,0));
      this.imp_datasource[4].Total = Math.round(data.Data.map(t => t.GrandTotal).reduce((acc,value) => acc + value,0));
      this.imp_datasource[0].Region = "APAC";
      this.imp_datasource[1].Region = "EMEA";
      this.imp_datasource[2].Region = "LATAM";
      this.imp_datasource[3].Region = "NORAM";
      this.imp_datasource[4].Region = "GrandTotal";
      this.regionimpyType = new Chart('regionimpyType', {
        type : 'bar',
        data : {
          labels: this.impType_Values,
          datasets : [
            {
              label: 'APAC',
              data: this.impType_apac,
              backgroundColor: 'rgb(176, 185, 31)'
            },
            {
              label: 'EMEA',
              data: this.impType_emea,
              backgroundColor: 'rgb(0, 169, 201)'
            },
            {
              label: 'LATAM',
              data: this.impType_latam,
              backgroundColor: 'rgb(118, 173, 153)'
            },
            {
              label: 'NORAM',
              data: this.impType_noram,
              backgroundColor: 'rgb(252, 186, 47)'
            }
          ]
        },
        options : options3,
      })
    })
    this.service.DRRegionWiseCountryStatus(this.SelectedYears,this.SelectedQuarter,this.SelectedStatus,this.SelectedRegion,this.SelectedManager).subscribe(data=>{
      for(let i = 0; i<data.Data.length;i++){
        if(data.Data[i].CountryStatus == null){
          this.C_status_Values.push("Blanks");
        }
        else{
          this.C_status_Values.push(data.Data[i].CountryStatus);
        }
        this.C_status_apac.push(data.Data[i].APAC);
        this.C_status_emea.push(data.Data[i].EMEA);
        this.C_status_noram.push(data.Data[i].NORAM);
        this.C_status_latam.push(data.Data[i].LATAM);
      }
      if(this.regionCountrystatus != undefined){
        this.regionCountrystatus.destroy();
      }
      this.regionCountrystatus = new Chart('regionCountrystatus', {
        type : 'bar',
        data : {
          labels: this.C_status_Values,
          datasets : [
            {
              label: 'APAC',
              data: this.C_status_apac,
              backgroundColor: 'rgb(176, 185, 31)'
            },
            {
              label: 'EMEA',
              data: this.C_status_emea,
              backgroundColor: 'rgb(0, 169, 201)'
            },
            {
              label: 'LATAM',
              data: this.C_status_latam,
              backgroundColor: 'rgb(118, 173, 153)'
            },
            {
              label: 'NORAM',
              data: this.C_status_noram,
              backgroundColor: 'rgb(252, 186, 47)'
            }
          ]
        },
        options : options2,
      })
    })
    this.service.DRRegionWiseActivityType(this.SelectedYears,this.SelectedQuarter,this.SelectedStatus,this.SelectedRegion,this.SelectedManager).subscribe(data=>{
      for(let i = 0; i<data.Data.length;i++){
        if(data.Data[i].ActivityType == null){
          this.ActivityType_Values.push("Blanks");
        }
        else{
          this.ActivityType_Values.push(data.Data[i].ActivityType);
        }
        this.ActivityType_apac.push(data.Data[i].APAC);
        this.ActivityType_emea.push(data.Data[i].EMEA);
        this.ActivityType_noram.push(data.Data[i].NORAM);
        this.ActivityType_latam.push(data.Data[i].LATAM);
      }
      if(this.regionActivityType != undefined){
        this.regionActivityType.destroy();
      }
      this.a_type_Data = data.Data;
      this.a_type_displayColumns = [];
      this.a_type_displayColumns.push('Region');
      this.a_type_Data.forEach((item) => {
        this.a_type_displayColumns.push(item.ActivityType);
      });
      this.a_type_displayColumns.push("Total");
      this.a_type_datasource = this.imp_inputColumns.map((x) => this.a_type_formatInputRow(x));
      this.a_type_datasource[0].Total = Math.round(data.Data.map(t => t.APAC).reduce((acc,value) => acc + value,0));
      this.a_type_datasource[1].Total = Math.round(data.Data.map(t => t.EMEA).reduce((acc,value) => acc + value,0));
      this.a_type_datasource[2].Total = Math.round(data.Data.map(t => t.LATAM).reduce((acc,value) => acc + value,0));
      this.a_type_datasource[3].Total = Math.round(data.Data.map(t => t.NORAM).reduce((acc,value) => acc + value,0));
      this.a_type_datasource[4].Total = Math.round(data.Data.map(t => t.GrandTotal).reduce((acc,value) => acc + value,0));
      this.a_type_datasource[0].Region = "APAC";
      this.a_type_datasource[1].Region = "EMEA";
      this.a_type_datasource[2].Region = "LATAM";
      this.a_type_datasource[3].Region = "NORAM";
      this.a_type_datasource[4].Region = "GrandTotal";
      this.regionActivityType = new Chart('regionActivityType', {
        type : 'bar',
        data : {
          labels: this.ActivityType_Values,
          datasets : [
            {
              label: 'APAC',
              data: this.ActivityType_apac,
              backgroundColor: 'rgb(176, 185, 31)'
            },
            {
              label: 'EMEA',
              data: this.ActivityType_emea,
              backgroundColor: 'rgb(0, 169, 201)'
            },
            {
              label: 'LATAM',
              data: this.ActivityType_latam,
              backgroundColor: 'rgb(118, 173, 153)'
            },
            {
              label: 'NORAM',
              data: this.ActivityType_noram,
              backgroundColor: 'rgb(252, 186, 47)'
            }
          ]
        },
        options : options3,
      })
    })
    this.service.DRRegionWiseOBTReseller(this.SelectedYears,this.SelectedQuarter,this.SelectedStatus,this.SelectedRegion,this.SelectedManager).subscribe(data=>{
      this.OBTResellerList = [];
      this.OBTListWithoutBlank = [];
      console.log(data.Data);
      data.Data.forEach(item =>{
        this.OBTResellerList.push(item.OBTReseller);
        if(item.OBTReseller == "(Blanks)"){
        }else{
          this.OBTListWithoutBlank.push(item.OBTReseller);
        }
      })
      this.OBT_APACTotal = Math.round(data.Data.map(t => t.APAC).reduce((acc,value) => acc + value,0));
      this.OBT_EMEATotal = Math.round(data.Data.map(t => t.EMEA).reduce((acc,value) => acc + value,0));
      this.OBT_LATAMTotal = Math.round(data.Data.map(t => t.LATAM).reduce((acc,value) => acc + value,0));
      this.OBT_NORAMTotal = Math.round(data.Data.map(t => t.NORAM).reduce((acc,value) => acc + value,0));
      this.OBT_GrandTotal = Math.round(data.Data.map(t => t.GrandTotal).reduce((acc,value) => acc + value,0));
      this.dataSource = new MatTableDataSource(data.Data);
      this.onFilterValueChange();
      this.OBTResellerFilter.setValue(this.OBTListWithoutBlank);
      this.onOBTResellerchange();
      this.isLoading_OR = false;
    },error => (this.isLoading_OR = false))
    this.service.DigitalReportData(this.SelectedYears,this.SelectedQuarter,this.SelectedStatus,this.SelectedRegion,this.SelectedManager).subscribe(data=>{
      this.dataSource_data = new MatTableDataSource(data.Data);
      this.dataSource_data.sort = this.DRSort;
      this.isLoading = false;
    },error => (this.isLoading = false))
  }
  OBT_APACTotal;OBT_EMEATotal;OBT_LATAMTotal;OBT_NORAMTotal;OBT_GrandTotal;
  imp_Data : Data[];
  a_type_Data : Data[];
  imp_inputColumns = ['APAC', 'EMEA', 'LATAM', 'NORAM','GrandTotal'];
  imp_formatInputRow(row) {
    const output = {};
    output[1] = row;
    for (let i = 0; i < this.imp_Data.length; ++i) {
        output[this.imp_Data[i].ImplementationType] = this.imp_Data[i][row];
    }
    return output;
  }
  a_type_formatInputRow(row) {
    const output = {};
    output[1] = row;
    for (let i = 0; i < this.a_type_Data.length; ++i) {
        output[this.a_type_Data[i].ActivityType] = this.a_type_Data[i][row];
    }
    return output;
  }
  masterOBTReseller;
  OBTResellerFilter = new FormControl();
  filteredValues : MyFilter = { OBTReseller : []}
  customFilterPredicate() {
    return (data: Data, filter: string): boolean => {
      let searchString = JSON.parse(filter) as MyFilter;
      let isOBTResellerAvailable = false;
      if (searchString.OBTReseller.length) {
        for (const d of searchString.OBTReseller) {
          if (data.OBTReseller.toString().trim() == d) {
            isOBTResellerAvailable = true;
          }
        }
      } else {
        isOBTResellerAvailable = true;
      }
      return (
        isOBTResellerAvailable
      )
    }
  }
  onFilterValueChange(){
    this.OBTResellerFilter.valueChanges.subscribe(value => {
      this.filteredValues["OBTReseller"] = value;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.OBT_APACTotal =  Math.round(this.dataSource.filteredData.map(t => t.APAC).reduce((acc,value) => acc + value,0));
      this.OBT_EMEATotal =  Math.round(this.dataSource.filteredData.map(t => t.EMEA).reduce((acc,value) => acc + value,0));
      this.OBT_LATAMTotal = Math.round(this.dataSource.filteredData.map(t => t.LATAM).reduce((acc,value) => acc + value,0));
      this.OBT_NORAMTotal = Math.round(this.dataSource.filteredData.map(t => t.NORAM).reduce((acc,value) => acc + value,0));
      this.OBT_GrandTotal = Math.round(this.dataSource.filteredData.map(t => t.GrandTotal).reduce((acc,value) => acc + value,0));
      // this.FilteredVolume = this.dataSource.filteredData.map(t => t.RevenueVolumeUSD).reduce((acc,value) => acc + value,0).toLocaleString("en-US",{style:"currency", currency:"USD"}).slice(0,-3);
      // this.FilteredCount = this.dataSource.filteredData.length;
    });
    this.dataSource.filterPredicate = this.customFilterPredicate();
    this.dataSource.sort = this.DROBT_R_Sort;
  }
  checkUncheckOBTReseller(){
    if(this.masterOBTReseller == true){
      this.OBTResellerFilter.setValue(this.OBTResellerList);
    }else{
      this.OBTResellerFilter.setValue("");
    }
  }
  onOBTResellerchange(){
    if(this.OBTResellerList.length == this.OBTResellerFilter.value.length){
      this.masterOBTReseller = true;
    }else{
      this.masterOBTReseller = false;
    }
    console.log(this.OBTResellerList,this.masterOBTReseller,this.OBTResellerFilter.value)
  }
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
          this.SelectedYears = this.yearList[i].Year;
        }else{
          this.SelectedYears += ","+this.yearList[i].Year;
        }
      }else{
      }
    }
    this.yearListSelected = this.yearList.filter(s => s.isSelected == true);
  }
  checkUncheckRegion(){
    for (var i = 0; i < this.RegionList.length; i++) {
      this.RegionList[i].isSelected = this.masterRegion;
    }
    this.getSelectedRegion();
  }
  regionSelected(){
    this.masterRegion = this.RegionList.every(function(item:any) {
      return item.isSelected == true;
    })
    this.getSelectedRegion();
  }
  getSelectedRegion(){
    this.Apply_disable = false;
    this.SelectedRegion = null;
    for(let i=0;i<this.RegionList.length;i++){
      if(this.RegionList[i].isSelected == true){
        if(this.SelectedRegion == null){
          if(this.RegionList[i].Region == null || this.RegionList[i].Region == ""){
            this.SelectedRegion = ",";
          }else{
            this.SelectedRegion = this.RegionList[i].Region;
          }
        }else{
          this.SelectedRegion += ","+this.RegionList[i].Region;
        }
      }else{
      }
    }
  }
  checkUncheckquarter(){
    for (var i = 0; i < this.QuarterList.length; i++) {
      this.QuarterList[i].isSelected = this.masterquarter;
    }
    this.getSelectedQuarter();
  }
  quarterSelected(){
    this.masterquarter = this.QuarterList.every(function(item:any) {
      return item.isSelected == true;
    })
    this.getSelectedQuarter();
  }
  getSelectedQuarter(){
    this.Apply_disable = false;
    this.SelectedQuarter = null;
    for(let i=0;i<this.QuarterList.length;i++){
      if(this.QuarterList[i].isSelected == true){
        if(this.SelectedQuarter == null){
          if(this.QuarterList[i].Quarter == null || this.QuarterList[i].Quarter == ""){
            this.SelectedQuarter = ",";
          }else{
            this.SelectedQuarter = this.QuarterList[i].Quarter;
          }
        }else{
          this.SelectedQuarter += ","+this.QuarterList[i].Quarter;
        }
      }else{
      }
    }
  }
  checkUncheckleader(){
    for (var i = 0; i < this.LeaderList.length; i++) {
      this.LeaderList[i].isSelected = this.masterleader;
    }
    if(this.masterleader == false){
      this.ManagerList = [];
      this.mastermanager = false;
    }else{
      this.mastermanager = true;
      for(let i = 0;i<this.LeaderList.length;i++){
        this.LeaderList[i].DigitalOBTManager.forEach(item =>{
          this.ManagerList.push(item);
        })
      }
      for (var i = 0; i < this.ManagerList.length; i++) {
        this.ManagerList[i].isSelected = this.mastermanager;
      }
    }
    this.getSelectedManager();
    this.getSelectedleader();
  }
  leaderSelected(){
    this.masterleader = this.LeaderList.every(function(item:any) {
      return item.isSelected == true;
    })
    this.mastermanager = true;
    this.ManagerList = [];
    for(let i = 0;i<this.LeaderList.length;i++){
      if(this.LeaderList[i].isSelected == true){
        this.LeaderList[i].DigitalOBTManager.forEach(item =>{
          this.ManagerList.push(item);
        })
      }
    }
    for (var i = 0; i < this.ManagerList.length; i++) {
      this.ManagerList[i].isSelected = this.mastermanager;
    }
    this.getSelectedManager();
    this.getSelectedleader();
  }
  getSelectedleader(){
    this.Apply_disable = false;
    this.SelectedLeader = null;
    for(let i=0;i<this.LeaderList.length;i++){
      if(this.LeaderList[i].isSelected == true){
        if(this.SelectedLeader == null){
          if(this.LeaderList[i].GlobalCISOBTLead == null || this.LeaderList[i].GlobalCISOBTLead == ""){
            this.SelectedLeader = ",";
          }else{
            this.SelectedLeader = this.LeaderList[i].GlobalCISOBTLead;
          }
        }else{
          this.SelectedLeader += ","+this.LeaderList[i].GlobalCISOBTLead;
        }
      }else{
      }
    }
  }
  checkUncheckmanager(){
    for (var i = 0; i < this.ManagerList.length; i++) {
      this.ManagerList[i].isSelected = this.mastermanager;
    }
    this.getSelectedManager();
  }
  managerSelected(){
    this.mastermanager = this.ManagerList.every(function(item:any) {
      return item.isSelected == true;
    })
    this.getSelectedManager();
  }
  getSelectedManager(){
    this.Apply_disable = false;
    this.SelectedManager = "";
    for(let i=0;i<this.ManagerList.length;i++){
      if(this.ManagerList[i].isSelected == true){
        if(this.SelectedManager == null){
          if(this.ManagerList[i].Manager == null || this.ManagerList[i].Manager == ""){
            this.SelectedManager = ",";
          }else if(this.ManagerList[i].Manager == "(Blanks)"){
            this.SelectedManager += "---";
          }else{
            this.SelectedManager = this.ManagerList[i].Manager;
          }
        }else{
          if(this.ManagerList[i].Manager == "(Blanks)"){
            this.SelectedManager += ","+"---";
          }else{
            this.SelectedManager += ","+this.ManagerList[i].Manager;
          }
        }
      }else{
      }
    }
  }
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
          if(this.statusList[i].ProjectStatus == null || this.statusList[i].ProjectStatus == ""){
            this.SelectedStatus = ",";
          }else{
            this.SelectedStatus = this.statusList[i].ProjectStatus;
          }
        }else{
          this.SelectedStatus += ","+this.statusList[i].ProjectStatus;
        }
      }else{
      }
    }
  }
  ExportData(){
    this.dashboard.ShowSpinnerHandler(true);
    this.service.DigitalReportData(this.SelectedYears,this.SelectedQuarter,this.SelectedStatus,this.SelectedRegion,this.SelectedManager).subscribe(data=>{
      const CustomizedData = data.Data.map(o => {
        return {
          'Account Name' : o.Client,
          'Revenue ID' : o.RevenueID,
          'Country' : o.Country,
          'iMeet Workspace Title' : o.iMeet_Workspace_Title,
          'Implementation Type' : o.ImplementationType,
          'OBT Reseller Direct' : o.OBT_Reseller___Direct,
          'Region' : o.Region,
          'Project Status' : o.ProjectStatus,
          'Country Status' : o.CountryStatus,
          'Global Digital OBT Lead' : o.GlobalCISOBTLead,
          'Regional Digital OBT Lead' : o.RegionalCISOBTLead,
          'Local Digital OBT Lead' : o.LocalDigitalOBTLead,
          'Global Digital Portrait Lead' : o.GlobalCISPortraitLead,
          'Regional Digital Portrait Lead' : o.RegionalCISPortraitLead,
          'Global Digital HRFeed Specialist' : o.GlobalCISHRFeedSpecialist,
          'Activity Type' : o.ActivityType,
          'GDS' : o.GDS,
          'Complexity Score' : o.ComplexityScore,
          'Go Live Year' : o.GoLiveYear,
          'Quarter' : o.Quarter,
          'Record Status' : o.RecordStatus,
          'DataSource Type' : o.DataSourceType,
        };
      });
      //this.dataSource = this.CLRData;
      this.excelService.exportAsExcelFile(CustomizedData, 'Digital Team Dashboard Data');
      this.dashboard.ShowSpinnerHandler(false);
    })
  }
}