import { Injectable } from '@angular/core';

import { Response } from './DDOModels/Response';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class DdoServiceService {
  // Baseurl = 'http://localhost:64047/';
  Baseurl = 'http://10.180.27.32:8001/';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Access-Control-Allow-Origin' : '*'
    })
  };
  constructor(private http : HttpClient,public route : ActivatedRoute) { 
  }
  public ErrorsAllocatedData(){
    let params = new HttpParams();
    return this.http.post<Response>(`${this.Baseurl+"ErrorsAllocatedData"}`,params);
  }
  public DeleteErrorAllocated(ErrorAllocatedID : string,UpdatedBy : string){
    let params = new HttpParams();
    params = params.append('ErrorAllocatedID',ErrorAllocatedID);
    params = params.append('UpdatedBy',UpdatedBy);
    return this.http.post<Response>(`${this.Baseurl+"DeleteErrorAllocated"}`,params);
  }
  public ErrorAllocatedInsert(Con : string,Owner : string,NewOwner : string,AverageCount : string,Type : string,Comments : string,InsertedBy : string){
    let params = new HttpParams();
    params = params.append('Con',Con);
    params = params.append('Owner',Owner);
    params = params.append('NewOwner',NewOwner);
    params = params.append('AverageCount',AverageCount);
    params = params.append('Type',Type);
    params = params.append('Comments',Comments);
    params = params.append('InsertedBy',InsertedBy);
    return this.http.post<Response>(`${this.Baseurl+"ErrorAllocatedInsert"}`,params);
  }
  public ErrorAllocatedUpdate(ErrorAllocatedID : string,Con : string,Owner : string,NewOwner : string,AverageCount : string,Type : string,Comments : string,UpdatedBy : string){
    let params = new HttpParams();
    params = params.append('ErrorAllocatedID',ErrorAllocatedID);
    params = params.append('Con',Con);
    params = params.append('Owner',Owner);
    params = params.append('NewOwner',NewOwner);
    params = params.append('AverageCount',AverageCount);
    params = params.append('Type',Type);
    params = params.append('Comments',Comments);
    params = params.append('UpdatedBy',UpdatedBy);
    return this.http.post<Response>(`${this.Baseurl+"ErrorAllocatedUpdate"}`,params);
  }

  public GPNContactData(){
    let params = new HttpParams();
    return this.http.post<Response>(`${this.Baseurl+"GPNContactData"}`,params);
  }
  public DeleteGPNContact(GPNId : string,UpdatedBy : string){
    let params = new HttpParams();
    params = params.append('GPNId',GPNId);
    params = params.append('UpdatedBy',UpdatedBy);
    return this.http.post<Response>(`${this.Baseurl+"DeleteGPNContact"}`,params);
  }
  public GPNContactInsert(Region : string,Type : string,Country : string,Groups : string,Glory_DL_DLCBR : string,DataSubmitFrequency : string,SendErrorReportFrequency : string,MainContactGroupEmailAddress : string,GroupName : string,InsertedBy : string){
    let params = new HttpParams();
    params = params.append('Region',Region);
    params = params.append('Type',Type);
    params = params.append('Country',Country);
    params = params.append('Groups',Groups);
    params = params.append('Glory_DL_DLCBR',Glory_DL_DLCBR);
    params = params.append('DataSubmitFrequency',DataSubmitFrequency);
    params = params.append('SendErrorReportFrequency',SendErrorReportFrequency);
    params = params.append('MainContactGroupEmailAddress',MainContactGroupEmailAddress);
    params = params.append('GroupName',GroupName);
    params = params.append('InsertedBy',InsertedBy);
    return this.http.post<Response>(`${this.Baseurl+"GPNContactInsert"}`,params);
  }
  public GPNContactUpdate(GPNId : string,Region : string,Type : string,Country : string,Groups : string,Glory_DL_DLCBR : string,DataSubmitFrequency : string,SendErrorReportFrequency : string,MainContactGroupEmailAddress : string,GroupName : string,UpdatedBy : string){
    let params = new HttpParams();
    params = params.append('GPNId',GPNId);
    params = params.append('Region',Region);
    params = params.append('Type',Type);
    params = params.append('Country',Country);
    params = params.append('Groups',Groups);
    params = params.append('Glory_DL_DLCBR',Glory_DL_DLCBR);
    params = params.append('DataSubmitFrequency',DataSubmitFrequency);
    params = params.append('SendErrorReportFrequency',SendErrorReportFrequency);
    params = params.append('MainContactGroupEmailAddress',MainContactGroupEmailAddress);
    params = params.append('GroupName',GroupName);
    params = params.append('UpdatedBy',UpdatedBy);
    return this.http.post<Response>(`${this.Baseurl+"GPNContactUpdate"}`,params);
  }
}