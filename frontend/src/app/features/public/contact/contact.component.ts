import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { RestaurantService } from '../../../core/services/restaurant.service';
import { Restaurant } from '../../../core/models/restaurant.model';

@Component({
  selector: 'app-contact',
  imports: [CommonModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent implements OnInit {
  private restaurantService = inject(RestaurantService);
  private title = inject(Title);
  restaurant = signal<Restaurant | null>(null);

  ngOnInit() {
    this.title.setTitle('Contacto | La Terraza');
    this.restaurantService.get().subscribe(r => this.restaurant.set(r));
  }
}
