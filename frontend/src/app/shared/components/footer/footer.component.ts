import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RestaurantService } from '../../../core/services/restaurant.service';
import { Restaurant } from '../../../core/models/restaurant.model';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent implements OnInit {
  private restaurantService = inject(RestaurantService);
  restaurant = signal<Restaurant | null>(null);
  year = new Date().getFullYear();

  ngOnInit() {
    this.restaurantService.get().subscribe(r => this.restaurant.set(r));
  }

  getWhatsappUrl(number: string): string {
    return `https://wa.me/${number}`;
  }
}
