import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { map, flatMap, toArray } from 'rxjs/operators';
import * as moment from 'moment';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ScartService {

  // Hardcoded URLs
  baseURL = environment.api_url || 'http://localhost:3001/api';
  getSingleURL = `${this.baseURL}/cart`;
  orderInfoSS: any;


  constructor(private http: HttpClient) { }

  getOrderDetail(servedID: string) {
    // http get method --> get data from server
    const paramsToServer = new HttpParams()
    .set('id', servedID);
    const headersToServer = new HttpHeaders().set('Content-Type', 'app-json');
    return(
      this.http.get<any>(this.getSingleURL, {params: paramsToServer, headers: headersToServer})
    .toPromise()
    .then((result) => {
      this.orderInfoSS = JSON.parse(result);
      return this.orderInfoSS;
    })
    );
  }

  // Send cart details to backend via POST
  sendCart(dataIn) {
    const cartData = dataIn;
    return(
      this.http.post<any>(`${this.baseURL}/cart`, cartData).subscribe(
        data => {console.log('Cart data sent successfully: ', data)},
        error => {console.log('Error sending cart data: ', error)}
      )
    );
  }

  // Get cart details from backend via GET
  getCart(username: string) {
    const paramsToServer = new HttpParams()
    .set('name', username);
    const headersToServer = new HttpHeaders()
    .set('Content-Type', 'app-json');
    return(
      this.http.get<any>(`${this.baseURL}/cart`, {params: paramsToServer, headers: headersToServer}).toPromise()
    )
  }
}
