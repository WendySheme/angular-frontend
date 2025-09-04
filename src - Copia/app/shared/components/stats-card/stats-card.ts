import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

type CardColor = 'primary' | 'success' | 'warning' | 'error' | 'info';

@Component({
  selector: 'app-stats-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-card.component.html',
  styleUrls: ['./stats-card.component.scss']
})
export class StatsCardComponent {
  @Input() title: string = '';
  @Input() value: string | number = '';
  @Input() subtitle?: string = '';
  @Input() icon?: string = '';
  @Input() color: CardColor = 'primary';
  @Input() change?: number;

  get cardClasses(): string {
    const baseClasses = 'bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300';
    return baseClasses;
  }

  get iconClasses(): string {
    const baseClasses = 'w-12 h-12 rounded-xl flex items-center justify-center shadow-md';

    switch (this.color) {
      case 'success':
        return `${baseClasses} bg-gradient-to-br from-green-500 to-emerald-500`;
      case 'warning':
        return `${baseClasses} bg-gradient-to-br from-yellow-500 to-orange-500`;
      case 'error':
        return `${baseClasses} bg-gradient-to-br from-red-500 to-pink-500`;
      case 'info':
        return `${baseClasses} bg-gradient-to-br from-blue-500 to-cyan-500`;
      default:
        return `${baseClasses} bg-gradient-to-br from-gray-600 to-gray-700`;
    }
  }

  get iconPath(): string {
    switch (this.icon) {
      case 'check-circle':
        return 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z';
      case 'x-circle':
        return 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z';
      case 'file-text':
        return 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z';
      case 'trending-up':
        return 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6';
      case 'users':
        return 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z';
      case 'clock':
        return 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z';
      default:
        return 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6';
    }
  }

  get iconBgColor(): string {
    switch (this.color) {
      case 'success':
        return 'bg-green-100';
      case 'warning':
        return 'bg-yellow-100';
      case 'error':
        return 'bg-red-100';
      case 'info':
        return 'bg-blue-100';
      default:
        return 'bg-gray-100';
    }
  }

  get iconColor(): string {
    switch (this.color) {
      case 'success':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'error':
        return 'text-red-600';
      case 'info':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  }

  get changeColor(): string {
    if (this.change === undefined) return 'text-gray-500';
    if (this.change > 0) return 'text-green-600';
    if (this.change < 0) return 'text-red-600';
    return 'text-gray-500';
  }

  get changeText(): string {
    if (this.change === undefined) return '';
    const sign = this.change > 0 ? '+' : '';
    return `${sign}${this.change}%`;
  }
}
