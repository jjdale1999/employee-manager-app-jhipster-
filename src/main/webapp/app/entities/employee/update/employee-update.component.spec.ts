jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { EmployeeService } from '../service/employee.service';
import { IEmployee, Employee } from '../employee.model';
import { IDepartment } from 'app/entities/department/department.model';
import { DepartmentService } from 'app/entities/department/service/department.service';
import { IJob } from 'app/entities/job/job.model';
import { JobService } from 'app/entities/job/service/job.service';
import { ISalary } from 'app/entities/salary/salary.model';
import { SalaryService } from 'app/entities/salary/service/salary.service';

import { EmployeeUpdateComponent } from './employee-update.component';

describe('Component Tests', () => {
  describe('Employee Management Update Component', () => {
    let comp: EmployeeUpdateComponent;
    let fixture: ComponentFixture<EmployeeUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let employeeService: EmployeeService;
    let departmentService: DepartmentService;
    let jobService: JobService;
    let salaryService: SalaryService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [EmployeeUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(EmployeeUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(EmployeeUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      employeeService = TestBed.inject(EmployeeService);
      departmentService = TestBed.inject(DepartmentService);
      jobService = TestBed.inject(JobService);
      salaryService = TestBed.inject(SalaryService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Employee query and add missing value', () => {
        const employee: IEmployee = { id: 456 };
        const manager: IEmployee = { id: 4374 };
        employee.manager = manager;

        const employeeCollection: IEmployee[] = [{ id: 10177 }];
        jest.spyOn(employeeService, 'query').mockReturnValue(of(new HttpResponse({ body: employeeCollection })));
        const additionalEmployees = [manager];
        const expectedCollection: IEmployee[] = [...additionalEmployees, ...employeeCollection];
        jest.spyOn(employeeService, 'addEmployeeToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ employee });
        comp.ngOnInit();

        expect(employeeService.query).toHaveBeenCalled();
        expect(employeeService.addEmployeeToCollectionIfMissing).toHaveBeenCalledWith(employeeCollection, ...additionalEmployees);
        expect(comp.employeesSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Department query and add missing value', () => {
        const employee: IEmployee = { id: 456 };
        const department: IDepartment = { id: 35363 };
        employee.department = department;

        const departmentCollection: IDepartment[] = [{ id: 78278 }];
        jest.spyOn(departmentService, 'query').mockReturnValue(of(new HttpResponse({ body: departmentCollection })));
        const additionalDepartments = [department];
        const expectedCollection: IDepartment[] = [...additionalDepartments, ...departmentCollection];
        jest.spyOn(departmentService, 'addDepartmentToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ employee });
        comp.ngOnInit();

        expect(departmentService.query).toHaveBeenCalled();
        expect(departmentService.addDepartmentToCollectionIfMissing).toHaveBeenCalledWith(departmentCollection, ...additionalDepartments);
        expect(comp.departmentsSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Job query and add missing value', () => {
        const employee: IEmployee = { id: 456 };
        const job: IJob = { id: 39994 };
        employee.job = job;

        const jobCollection: IJob[] = [{ id: 82126 }];
        jest.spyOn(jobService, 'query').mockReturnValue(of(new HttpResponse({ body: jobCollection })));
        const additionalJobs = [job];
        const expectedCollection: IJob[] = [...additionalJobs, ...jobCollection];
        jest.spyOn(jobService, 'addJobToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ employee });
        comp.ngOnInit();

        expect(jobService.query).toHaveBeenCalled();
        expect(jobService.addJobToCollectionIfMissing).toHaveBeenCalledWith(jobCollection, ...additionalJobs);
        expect(comp.jobsSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Salary query and add missing value', () => {
        const employee: IEmployee = { id: 456 };
        const joblevel: ISalary = { id: 16725 };
        employee.joblevel = joblevel;

        const salaryCollection: ISalary[] = [{ id: 59543 }];
        jest.spyOn(salaryService, 'query').mockReturnValue(of(new HttpResponse({ body: salaryCollection })));
        const additionalSalaries = [joblevel];
        const expectedCollection: ISalary[] = [...additionalSalaries, ...salaryCollection];
        jest.spyOn(salaryService, 'addSalaryToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ employee });
        comp.ngOnInit();

        expect(salaryService.query).toHaveBeenCalled();
        expect(salaryService.addSalaryToCollectionIfMissing).toHaveBeenCalledWith(salaryCollection, ...additionalSalaries);
        expect(comp.salariesSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const employee: IEmployee = { id: 456 };
        const manager: IEmployee = { id: 79320 };
        employee.manager = manager;
        const department: IDepartment = { id: 60127 };
        employee.department = department;
        const job: IJob = { id: 42699 };
        employee.job = job;
        const joblevel: ISalary = { id: 80603 };
        employee.joblevel = joblevel;

        activatedRoute.data = of({ employee });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(employee));
        expect(comp.employeesSharedCollection).toContain(manager);
        expect(comp.departmentsSharedCollection).toContain(department);
        expect(comp.jobsSharedCollection).toContain(job);
        expect(comp.salariesSharedCollection).toContain(joblevel);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Employee>>();
        const employee = { id: 123 };
        jest.spyOn(employeeService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ employee });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: employee }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(employeeService.update).toHaveBeenCalledWith(employee);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Employee>>();
        const employee = new Employee();
        jest.spyOn(employeeService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ employee });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: employee }));
        saveSubject.complete();

        // THEN
        expect(employeeService.create).toHaveBeenCalledWith(employee);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Employee>>();
        const employee = { id: 123 };
        jest.spyOn(employeeService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ employee });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(employeeService.update).toHaveBeenCalledWith(employee);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackEmployeeById', () => {
        it('Should return tracked Employee primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackEmployeeById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackDepartmentById', () => {
        it('Should return tracked Department primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackDepartmentById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackJobById', () => {
        it('Should return tracked Job primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackJobById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackSalaryById', () => {
        it('Should return tracked Salary primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackSalaryById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
