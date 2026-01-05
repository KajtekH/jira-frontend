import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {ProductInterface} from "../../models/product/product.interface";
import {HttpClient} from "@angular/common/http";
import {ProductRequestInterface} from "../../models/product/product-request.interface";
import {HOST} from "../host.constant";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

 private baseUrl = `${HOST}/products`;
  constructor(private http: HttpClient) { }

  getProducts(): Observable<ProductInterface[]> {
    return this.http.get<ProductInterface[]>(this.baseUrl, {withCredentials: true});
  }

  getProductById(productId: number): Observable<ProductInterface> {
    return this.http.get<ProductInterface>(`${this.baseUrl}/${productId}`, {withCredentials: true});
  }

  addProduct(product: ProductRequestInterface): Observable<ProductInterface> {
    return this.http.post<ProductInterface>(this.baseUrl, product, {withCredentials: true});
  }
}
