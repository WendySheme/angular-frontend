import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loader.html',
  styleUrls: ['./loader.scss']
})
export class LoaderComponent {
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() color: 'primary' | 'white' | 'gray' = 'primary';
  @Input() overlay: boolean = false;
  @Input() message: string = 'Caricamento...';

  get sizeClass(): string {
    switch (this.size) {
      case 'small':
        return 'w-4 h-4';
      case 'large':
        return 'w-12 h-12';
      default:
        return 'w-8 h-8';
    }
  }

  get colorClass(): string {
    switch (this.color) {
      case 'white':
        return 'border-white border-t-transparent';
      case 'gray':
        return 'border-gray-300 border-t-gray-600';
      default:
        return 'border-blue-200 border-t-blue-600';
    }
  }
}
