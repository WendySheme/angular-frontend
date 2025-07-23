import { TestBed } from '@angular/core/testing';
import { TransformService } from './transform.service';
import { UserTranformerService } from './user-tranformer.service';
import { JustificationTransformService } from './justification-transform.service';
import { AttendanceTransformService } from './attendance-transform.service';
import { BaseTransformService } from './base-transform.service';

describe('TransformService', () => {
  let service: TransformService;
  let userTransformService: jasmine.SpyObj<UserTranformerService>;
  let justificationTransformService: jasmine.SpyObj<JustificationTransformService>;
  let attendanceTransformService: jasmine.SpyObj<AttendanceTransformService>;

  beforeEach(() => {
    const userTransformSpy = jasmine.createSpyObj('UserTranformerService', ['transformBackend', 'transformBackendArray']);
    const justificationTransformSpy = jasmine.createSpyObj('JustificationTransformService', ['transformBackend', 'transformBackendArray']);
    const attendanceTransformSpy = jasmine.createSpyObj('AttendanceTransformService', ['transformBackend', 'transformBackendArray', 'transformAttendanceStats']);

    TestBed.configureTestingModule({
      providers: [
        { provide: UserTranformerService, useValue: userTransformSpy },
        { provide: JustificationTransformService, useValue: justificationTransformSpy },
        { provide: AttendanceTransformService, useValue: attendanceTransformSpy }
      ]
    });

    service = TestBed.inject(TransformService);
    userTransformService = TestBed.inject(UserTranformerService) as jasmine.SpyObj<UserTranformerService>;
    justificationTransformService = TestBed.inject(JustificationTransformService) as jasmine.SpyObj<JustificationTransformService>;
    attendanceTransformService = TestBed.inject(AttendanceTransformService) as jasmine.SpyObj<AttendanceTransformService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('user transforms', () => {
    it('should call user transform service for single user', () => {
      const mockData = { id: '1', nome: 'Test' };
      const mockResult = { id: '1', name: 'Test' } as any;
      userTransformService.transformBackend.and.returnValue(mockResult);

      const result = service.user.fromBackend(mockData);

      expect(userTransformService.transformBackend).toHaveBeenCalledWith(mockData);
      expect(result).toBe(mockResult);
    });

    it('should call user transform service for user array', () => {
      const mockData = [{ id: '1', nome: 'Test' }];
      const mockResult = [{ id: '1', name: 'Test' }] as any[];
      userTransformService.transformBackendArray.and.returnValue(mockResult);

      const result = service.user.fromBackendArray(mockData);

      expect(userTransformService.transformBackendArray).toHaveBeenCalledWith(mockData);
      expect(result).toBe(mockResult);
    });
  });

  describe('safeTransform', () => {
    it('should return transformed data on success', () => {
      const mockData = { test: 'data' };
      const transformFn = jasmine.createSpy('transformFn').and.returnValue('transformed');

      const result = service.safeTransform(mockData, transformFn);

      expect(transformFn).toHaveBeenCalledWith(mockData);
      expect(result).toBe('transformed');
    });

    it('should return fallback on transformation error', () => {
      const mockData = { test: 'data' };
      const fallback = 'fallback';
      const transformFn = jasmine.createSpy('transformFn').and.throwError('Transform error');

      const result = service.safeTransform(mockData, transformFn, fallback);

      expect(result).toBe(fallback);
    });

    it('should return null when no fallback provided and error occurs', () => {
      const mockData = { test: 'data' };
      const transformFn = jasmine.createSpy('transformFn').and.throwError('Transform error');

      const result = service.safeTransform(mockData, transformFn);

      expect(result).toBeNull();
    });
  });

  describe('transformApiResponse', () => {
    it('should transform response data', () => {
      const mockResponse = { data: { id: '1', name: 'Test' } };
      const transformFn = jasmine.createSpy('transformFn').and.returnValue('transformed');

      const result = service.transformApiResponse(mockResponse, transformFn);

      expect(transformFn).toHaveBeenCalledWith(mockResponse.data);
      expect(result).toBe('transformed');
    });

    it('should handle response with result property', () => {
      const mockResponse = { result: { id: '1', name: 'Test' } };
      const transformFn = jasmine.createSpy('transformFn').and.returnValue('transformed');

      const result = service.transformApiResponse(mockResponse, transformFn);

      expect(transformFn).toHaveBeenCalledWith(mockResponse.result);
      expect(result).toBe('transformed');
    });

    it('should return null for null response', () => {
      const transformFn = jasmine.createSpy('transformFn');

      const result = service.transformApiResponse(null, transformFn);

      expect(transformFn).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe('transformApiResponseArray', () => {
    it('should transform response array data', () => {
      const mockResponse = { data: [{ id: '1' }, { id: '2' }] };
      const transformFn = jasmine.createSpy('transformFn').and.returnValue(['transformed']);

      const result = service.transformApiResponseArray(mockResponse, transformFn);

      expect(transformFn).toHaveBeenCalledWith(mockResponse.data);
      expect(result).toEqual(['transformed']);
    });

    it('should return empty array for non-array data', () => {
      const mockResponse = { data: { notAnArray: true } };
      const transformFn = jasmine.createSpy('transformFn');

      const result = service.transformApiResponseArray(mockResponse, transformFn);

      expect(transformFn).not.toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it('should return empty array for null response', () => {
      const transformFn = jasmine.createSpy('transformFn');

      const result = service.transformApiResponseArray(null, transformFn);

      expect(transformFn).not.toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });
});