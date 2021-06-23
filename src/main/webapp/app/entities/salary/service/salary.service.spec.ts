import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { JobLevel } from 'app/entities/enumerations/job-level.model';
import { ISalary, Salary } from '../salary.model';

import { SalaryService } from './salary.service';

describe('Service Tests', () => {
  describe('Salary Service', () => {
    let service: SalaryService;
    let httpMock: HttpTestingController;
    let elemDefault: ISalary;
    let expectedResult: ISalary | ISalary[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(SalaryService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        joblevel: JobLevel.Tier_1,
        salary: 0,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Salary', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Salary()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Salary', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            joblevel: 'BBBBBB',
            salary: 1,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Salary', () => {
        const patchObject = Object.assign(
          {
            joblevel: 'BBBBBB',
            salary: 1,
          },
          new Salary()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Salary', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            joblevel: 'BBBBBB',
            salary: 1,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Salary', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addSalaryToCollectionIfMissing', () => {
        it('should add a Salary to an empty array', () => {
          const salary: ISalary = { id: 123 };
          expectedResult = service.addSalaryToCollectionIfMissing([], salary);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(salary);
        });

        it('should not add a Salary to an array that contains it', () => {
          const salary: ISalary = { id: 123 };
          const salaryCollection: ISalary[] = [
            {
              ...salary,
            },
            { id: 456 },
          ];
          expectedResult = service.addSalaryToCollectionIfMissing(salaryCollection, salary);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Salary to an array that doesn't contain it", () => {
          const salary: ISalary = { id: 123 };
          const salaryCollection: ISalary[] = [{ id: 456 }];
          expectedResult = service.addSalaryToCollectionIfMissing(salaryCollection, salary);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(salary);
        });

        it('should add only unique Salary to an array', () => {
          const salaryArray: ISalary[] = [{ id: 123 }, { id: 456 }, { id: 7128 }];
          const salaryCollection: ISalary[] = [{ id: 123 }];
          expectedResult = service.addSalaryToCollectionIfMissing(salaryCollection, ...salaryArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const salary: ISalary = { id: 123 };
          const salary2: ISalary = { id: 456 };
          expectedResult = service.addSalaryToCollectionIfMissing([], salary, salary2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(salary);
          expect(expectedResult).toContain(salary2);
        });

        it('should accept null and undefined values', () => {
          const salary: ISalary = { id: 123 };
          expectedResult = service.addSalaryToCollectionIfMissing([], null, salary, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(salary);
        });

        it('should return initial array if no Salary is added', () => {
          const salaryCollection: ISalary[] = [{ id: 123 }];
          expectedResult = service.addSalaryToCollectionIfMissing(salaryCollection, undefined, null);
          expect(expectedResult).toEqual(salaryCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
