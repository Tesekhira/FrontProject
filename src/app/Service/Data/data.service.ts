import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private _storage:any;
  constructor() { }

  getData(){
    return this._storage;
  }
  setData(data){
    this._storage=data;
  }
}
