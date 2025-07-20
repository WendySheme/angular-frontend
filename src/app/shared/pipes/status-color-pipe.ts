import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusColor',
  standalone: true
})
export class StatusColorPipe implements PipeTransform {

  transform(status: string, type: 'text' | 'bg' | 'border' = 'text'): string {
    const colorMap: Record<string, Record<string, string>> = {
      'present': {
        text: 'text-green-600',
        bg: 'bg-green-100',
        border: 'border-green-300'
      },
      'absent': {
        text: 'text-red-600',
        bg: 'bg-red-100',
        border: 'border-red-300'
      },
      'justified': {
        text: 'text-blue-600',
        bg: 'bg-blue-100',
        border: 'border-blue-300'
      },
      'pending': {
        text: 'text-yellow-600',
        bg: 'bg-yellow-100',
        border: 'border-yellow-300'
      },
      'approved': {
        text: 'text-green-600',
        bg: 'bg-green-100',
        border: 'border-green-300'
      },
      'rejected': {
        text: 'text-red-600',
        bg: 'bg-red-100',
        border: 'border-red-300'
      },
      'active': {
        text: 'text-green-600',
        bg: 'bg-green-100',
        border: 'border-green-300'
      },
      'inactive': {
        text: 'text-gray-600',
        bg: 'bg-gray-100',
        border: 'border-gray-300'
      }
    };

    const statusKey = status?.toLowerCase() || 'pending';
    return colorMap[statusKey]?.[type] || colorMap['pending'][type];
  }
}
