import { TestBed } from '@angular/core/testing';
import { BaseTransformService, TransformConfig } from './base-transform.service';

interface TestModel {
  id: string;
  name: string;
  email: string;
  age: number;
  isActive: boolean;
  createdAt: Date;
  tags: string[];
  profile?: {
    bio: string;
    avatar: string;
  };
}

interface BackendModel {
  user_id: number;
  full_name: string;
  email_address: string;
  user_age: string;
  active_status: string;
  created_timestamp: string;
  user_tags: string[];
  user_profile?: {
    biography: string;
    profile_image: string;
  };
}

describe('BaseTransformService', () => {
  let service: BaseTransformService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BaseTransformService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('transformData', () => {
    it('should transform data with field mappings', () => {
      const backendData: BackendModel = {
        user_id: 123,
        full_name: 'John Doe',
        email_address: 'john@example.com',
        user_age: '25',
        active_status: 'true',
        created_timestamp: '2023-01-01T00:00:00Z',
        user_tags: ['admin', 'verified']
      };

      const config: TransformConfig<TestModel, BackendModel> = {
        fieldMappings: {
          id: (data) => data.user_id?.toString() ?? '',
          name: (data) => data.full_name ?? '',
          email: (data) => data.email_address ?? '',
          age: (data) => parseInt(data.user_age) || 0,
          isActive: (data) => data.active_status === 'true',
          createdAt: (data) => new Date(data.created_timestamp),
          tags: (data) => data.user_tags || []
        }
      };

      const result = service.transformData<TestModel, BackendModel>(backendData, config);

      expect(result.id).toBe('123');
      expect(result.name).toBe('John Doe');
      expect(result.email).toBe('john@example.com');
      expect(result.age).toBe(25);
      expect(result.isActive).toBe(true);
      expect(result.createdAt).toEqual(new Date('2023-01-01T00:00:00Z'));
      expect(result.tags).toEqual(['admin', 'verified']);
    });

    it('should apply default values', () => {
      const backendData: Partial<BackendModel> = {
        user_id: 123,
        email_address: 'john@example.com'
      };

      const config: TransformConfig<TestModel, BackendModel> = {
        fieldMappings: {
          id: (data) => data.user_id?.toString() ?? '',
          email: (data) => data.email_address ?? ''
        },
        defaultValues: {
          name: 'Default Name',
          age: 0,
          isActive: false,
          createdAt: new Date('2023-01-01'),
          tags: []
        }
      };

      const result = service.transformData<TestModel, BackendModel>(backendData as BackendModel, config);

      expect(result.name).toBe('Default Name');
      expect(result.age).toBe(0);
      expect(result.isActive).toBe(false);
      expect(result.tags).toEqual([]);
    });

    it('should validate required fields', () => {
      const backendData: Partial<BackendModel> = {
        full_name: 'John Doe'
      };

      const config: TransformConfig<TestModel, BackendModel> = {
        requiredFields: ['user_id', 'email_address']
      };

      expect(() => {
        service.transformData<TestModel, BackendModel>(backendData as BackendModel, config);
      }).toThrowError('Missing required fields: user_id, email_address');
    });

    it('should apply custom validators', () => {
      const backendData: BackendModel = {
        user_id: 123,
        full_name: 'John Doe',
        email_address: 'invalid-email',
        user_age: '25',
        active_status: 'true',
        created_timestamp: '2023-01-01T00:00:00Z',
        user_tags: []
      };

      const config: TransformConfig<TestModel, BackendModel> = {
        fieldMappings: {
          email: (data) => data.email_address ?? ''
        },
        validators: {
          email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        }
      };

      expect(() => {
        service.transformData<TestModel, BackendModel>(backendData, config);
      }).toThrowError('Validation failed for field email');
    });

    it('should apply transformers', () => {
      const backendData: BackendModel = {
        user_id: 123,
        full_name: '  john doe  ',
        email_address: 'john@example.com',
        user_age: '25',
        active_status: 'true',
        created_timestamp: '2023-01-01T00:00:00Z',
        user_tags: []
      };

      const config: TransformConfig<TestModel, BackendModel> = {
        fieldMappings: {
          name: (data) => data.full_name ?? ''
        },
        transformers: {
          name: (value) => value.trim().toLowerCase()
        }
      };

      const result = service.transformData<TestModel, BackendModel>(backendData, config);
      expect(result.name).toBe('john doe');
    });

    it('should handle null/undefined data', () => {
      expect(() => {
        service.transformData(null, {});
      }).toThrowError('Transform data cannot be null or undefined');

      expect(() => {
        service.transformData(undefined, {});
      }).toThrowError('Transform data cannot be null or undefined');
    });

    it('should handle nested field mappings', () => {
      const backendData: BackendModel = {
        user_id: 123,
        full_name: 'John Doe',
        email_address: 'john@example.com',
        user_age: '25',
        active_status: 'true',
        created_timestamp: '2023-01-01T00:00:00Z',
        user_tags: [],
        user_profile: {
          biography: 'Software developer',
          profile_image: 'avatar.jpg'
        }
      };

      const config: TransformConfig<TestModel, BackendModel> = {
        fieldMappings: {
          profile: (data) => data.user_profile ? {
            bio: data.user_profile.biography,
            avatar: data.user_profile.profile_image
          } : undefined
        }
      };

      const result = service.transformData<TestModel, BackendModel>(backendData, config);
      expect(result.profile?.bio).toBe('Software developer');
      expect(result.profile?.avatar).toBe('avatar.jpg');
    });
  });

  describe('transformArray', () => {
    it('should transform array of data', () => {
      const backendArray: BackendModel[] = [
        {
          user_id: 1,
          full_name: 'John Doe',
          email_address: 'john@example.com',
          user_age: '25',
          active_status: 'true',
          created_timestamp: '2023-01-01T00:00:00Z',
          user_tags: []
        },
        {
          user_id: 2,
          full_name: 'Jane Doe',
          email_address: 'jane@example.com',
          user_age: '30',
          active_status: 'false',
          created_timestamp: '2023-01-02T00:00:00Z',
          user_tags: []
        }
      ];

      const config: TransformConfig<TestModel, BackendModel> = {
        fieldMappings: {
          id: (data) => data.user_id?.toString() ?? '',
          name: (data) => data.full_name ?? '',
          email: (data) => data.email_address ?? ''
        }
      };

      const result = service.transformArray<TestModel, BackendModel>(backendArray, config);

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('John Doe');
      expect(result[1].name).toBe('Jane Doe');
    });

    it('should throw error for non-array input', () => {
      expect(() => {
        service.transformArray('not-an-array' as any, {});
      }).toThrowError('Input must be an array');
    });
  });

  describe('safeTransform', () => {
    it('should return transformed data on success', () => {
      const backendData: BackendModel = {
        user_id: 123,
        full_name: 'John Doe',
        email_address: 'john@example.com',
        user_age: '25',
        active_status: 'true',
        created_timestamp: '2023-01-01T00:00:00Z',
        user_tags: []
      };

      const config: TransformConfig<TestModel, BackendModel> = {
        fieldMappings: {
          id: (data) => data.user_id?.toString() ?? '',
          name: (data) => data.full_name ?? ''
        }
      };

      const result = service.safeTransform<TestModel, BackendModel>(backendData, config);
      expect(result?.id).toBe('123');
      expect(result?.name).toBe('John Doe');
    });

    it('should return fallback on error', () => {
      const fallback: TestModel = {
        id: 'fallback',
        name: 'Fallback User',
        email: 'fallback@example.com',
        age: 0,
        isActive: false,
        createdAt: new Date(),
        tags: []
      };

      const config: TransformConfig<TestModel, BackendModel> = {
        requiredFields: ['user_id']
      };

      const result = service.safeTransform<TestModel, BackendModel>({} as BackendModel, config, fallback);
      expect(result).toEqual(fallback);
    });

    it('should return null when no fallback provided', () => {
      const config: TransformConfig<TestModel, BackendModel> = {
        requiredFields: ['user_id']
      };

      const result = service.safeTransform<TestModel, BackendModel>({} as BackendModel, config);
      expect(result).toBeNull();
    });
  });

  describe('sanitize methods', () => {
    it('should sanitize strings', () => {
      expect(service.sanitizeString('  test  ')).toBe('test');
      expect(service.sanitizeString(123, 'default')).toBe('default');
      expect(service.sanitizeString(null, 'default')).toBe('default');
      expect(service.sanitizeString('')).toBe('');
    });

    it('should sanitize numbers', () => {
      expect(service.sanitizeNumber('123')).toBe(123);
      expect(service.sanitizeNumber('123.45')).toBe(123.45);
      expect(service.sanitizeNumber('invalid', 99)).toBe(99);
      expect(service.sanitizeNumber(null)).toBe(0);
    });

    it('should sanitize booleans', () => {
      expect(service.sanitizeBoolean(true)).toBe(true);
      expect(service.sanitizeBoolean(false)).toBe(false);
      expect(service.sanitizeBoolean('true')).toBe(true);
      expect(service.sanitizeBoolean('false')).toBe(false);
      expect(service.sanitizeBoolean('TRUE')).toBe(true);
      expect(service.sanitizeBoolean('invalid', true)).toBe(true);
      expect(service.sanitizeBoolean(null)).toBe(false);
    });

    it('should sanitize dates', () => {
      const validDate = new Date('2023-01-01');
      expect(service.sanitizeDate(validDate)).toEqual(validDate);
      expect(service.sanitizeDate('2023-01-01')).toEqual(new Date('2023-01-01'));
      expect(service.sanitizeDate(1672531200000)).toEqual(new Date(1672531200000));
      
      const fallback = new Date('2020-01-01');
      expect(service.sanitizeDate('invalid', fallback)).toEqual(fallback);
      expect(service.sanitizeDate(new Date('invalid'))).toBeTruthy();
    });

    it('should sanitize arrays', () => {
      expect(service.sanitizeArray(['a', 'b', 'c'])).toEqual(['a', 'b', 'c']);
      expect(service.sanitizeArray('not-array', ['fallback'])).toEqual(['fallback']);
      expect(service.sanitizeArray(null)).toEqual([]);
    });
  });
});