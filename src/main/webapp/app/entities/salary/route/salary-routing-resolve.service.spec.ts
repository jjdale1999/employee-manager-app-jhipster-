jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ISalary, Salary } from '../salary.model';
import { SalaryService } from '../service/salary.service';

import { SalaryRoutingResolveService } from './salary-routing-resolve.service';

describe('Service Tests', () => {
  describe('Salary routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: SalaryRoutingResolveService;
    let service: SalaryService;
    let resultSalary: ISalary | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(SalaryRoutingResolveService);
      service = TestBed.inject(SalaryService);
      resultSalary = undefined;
    });

    describe('resolve', () => {
      it('should return ISalary returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultSalary = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultSalary).toEqual({ id: 123 });
      });

      it('should return new ISalary if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultSalary = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultSalary).toEqual(new Salary());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Salary })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultSalary = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultSalary).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
