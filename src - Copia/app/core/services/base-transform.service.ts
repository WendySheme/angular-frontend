import { Injectable } from '@angular/core';

export interface TransformConfig<T, K> {
  fieldMappings?: { [key: string]: string | ((data: any) => any) };
  defaultValues?: Partial<T>;
  validators?: { [key: string]: (value: any) => boolean };
  transformers?: { [key: string]: (value: any, data: any) => any };
  requiredFields?: (keyof K)[];
}

@Injectable({
  providedIn: 'root'
})
export class BaseTransformService {

  transformData<T, K = any>(
    data: K,
    config: TransformConfig<T, K>
  ): T {
    if (!data) {
      throw new Error('transform data cannot be null or undefined');
    }

    try {
      const result = { ...config.defaultValues } as T;

      if (config.requiredFields) {
        this.validateRequiredFields(data, config.requiredFields);
      }

      if (config.fieldMappings) {
        this.applyFieldMappings(data, result, config.fieldMappings);
      }

      if (config.transformers) {
        this.applyTransformers(data, result, config.transformers);
      }

      if (config.validators) {
        this.validateFields(result, config.validators);
      }

      return result;
    } catch (error) {
      console.error('transform error:', error);
      throw new Error(`failed to transform data: ${error instanceof Error ? error.message : 'unknown error'}`);
    }
  }

  transformArray<T, K = any>(
    dataArray: K[],
    config: TransformConfig<T, K>
  ): T[] {
    if (!Array.isArray(dataArray)) {
      throw new Error('input must be an array');
    }

    return dataArray.map((item, index) => {
      try {
        return this.transformData<T, K>(item, config);
      } catch (error) {
        console.error(`transform error at index ${index}:`, error);
        throw new Error(`failed to transform array item at index ${index}: ${error instanceof Error ? error.message : 'unknown error'}`);
      }
    });
  }

  safeTransform<T, K = any>(
    data: K,
    config: TransformConfig<T, K>,
    fallback?: T
  ): T | null {
    try {
      return this.transformData<T, K>(data, config);
    } catch (error) {
      console.warn('safe transform failed, returning fallback:', error);
      return fallback || null;
    }
  }

  private validateRequiredFields<K>(data: K, requiredFields: (keyof K)[]): void {
    const missing = requiredFields.filter(field =>
      data[field] === null || data[field] === undefined
    );

    if (missing.length > 0) {
      throw new Error(`missing required fields: ${missing.join(', ')}`);
    }
  }

  private applyFieldMappings<T>(
    data: any,
    result: T,
    mappings: { [key: string]: string | ((data: any) => any) }
  ): void {
    Object.entries(mappings).forEach(([targetField, mapping]) => {
      try {
        if (typeof mapping === 'function') {
          (result as any)[targetField] = mapping(data);
        } else {
          (result as any)[targetField] = this.getNestedValue(data, mapping);
        }
      } catch (error) {
        console.warn(`failed to map field ${targetField}:`, error);
        (result as any)[targetField] = undefined;
      }
    });
  }

  private applyTransformers<T>(
    data: any,
    result: T,
    transformers: { [key: string]: (value: any, data: any) => any }
  ): void {
    Object.entries(transformers).forEach(([field, transformer]) => {
      try {
        const currentValue = (result as any)[field];
        (result as any)[field] = transformer(currentValue, data);
      } catch (error) {
        console.warn(`failed to transform field ${field}:`, error);
      }
    });
  }

  private validateFields<T>(
    result: T,
    validators: { [key: string]: (value: any) => boolean }
  ): void {
    Object.entries(validators).forEach(([field, validator]) => {
      const value = (result as any)[field];
      if (!validator(value)) {
        throw new Error(`validation failed for field ${field}`);
      }
    });
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : undefined;
    }, obj);
  }

  sanitizeString(value: any, fallback: string = ''): string {
    return typeof value === 'string' ? value.trim() : fallback;
  }

  sanitizeNumber(value: any, fallback: number = 0): number {
    const num = Number(value);
    return !isNaN(num) ? num : fallback;
  }

  sanitizeBoolean(value: any, fallback: boolean = false): boolean {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return value.toLowerCase() === 'true';
    return fallback;
  }

  sanitizeDate(value: any, fallback?: Date): Date {
    if (value instanceof Date && !isNaN(value.getTime())) return value;
    if (typeof value === 'string' || typeof value === 'number') {
      const date = new Date(value);
      if (!isNaN(date.getTime())) return date;
    }
    return fallback || new Date();
  }

  sanitizeArray<T>(value: any, fallback: T[] = []): T[] {
    return Array.isArray(value) ? value : fallback;
  }
}
