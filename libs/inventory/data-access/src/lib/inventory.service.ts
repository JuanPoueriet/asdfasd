import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// import { environment } from '../../../environments/environment';
import { Product } from '@univeex/inventory/domain';

export type CreateProductDto = Omit<Product, 'id' | 'organizationId' | 'createdAt' | 'updatedAt'>;
export type UpdateProductDto = Partial<CreateProductDto>;

@Injectable({ providedIn: 'root' })
export class InventoryService {
  private http = inject(HttpClient);
  private apiUrl = `/api/inventory`;

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  createProduct(product: CreateProductDto): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  updateProduct(id: string, product: UpdateProductDto): Observable<Product> {
    return this.http.patch<Product>(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
