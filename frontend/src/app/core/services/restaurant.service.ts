import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Restaurant } from '../models/restaurant.model';

@Injectable({ providedIn: 'root' })
export class RestaurantService {
  private http = inject(HttpClient);
  private api = `${environment.apiUrl}/restaurant`;

  get() {
    return this.http.get<Restaurant>(this.api);
  }

  update(data: Partial<Restaurant>) {
    return this.http.put<Restaurant>(this.api, data);
  }
}
