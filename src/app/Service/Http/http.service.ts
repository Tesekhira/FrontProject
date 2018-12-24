import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private _httpOptions;
  constructor(private http: HttpClient) { }
  getHttp(url, headerType, user) {
    this._httpOptions = this.CreateHeader(headerType, user);
    return this.http.get(url, this._httpOptions).toPromise();
  }
  postHttp(url, model, headerType, user) {
    this._httpOptions = this.CreateHeader(headerType, user);
    return this.http.post(url, model, this._httpOptions).toPromise();
  }

  deleteHttp(url, model, headerType, user) {
    this._httpOptions = this.CreateHeader(headerType, user);
    return this.http.delete(url, this._httpOptions).toPromise();
  }

  patchHttp(url, model, headerType, user) {
    this._httpOptions = this.CreateHeader(headerType, user);
    return this.http.patch(url, model, this._httpOptions).toPromise();
  }
  CreateHeader(type, user) {
    switch (type) {
      case 1:
        return this._httpOptions = {
          headers: new HttpHeaders({
            'Content-Type':  'application/json'
          })
        };
        break;
      case 2:
        if (user != null && user.token !== '') {
          return this._httpOptions = {
            headers: new HttpHeaders({
              'Content-Type':  'application/json',
              'Authorization': user.token
            })
          };
        } else {
          return this._httpOptions = {
            headers: new HttpHeaders({
              'Content-Type':  'application/json'
              })
          };
        }
        break;
    }
  }
}
