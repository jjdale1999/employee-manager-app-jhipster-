jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { SalaryService } from '../service/salary.service';
import { ISalary, Salary } from '../salary.model';

import { SalaryUpdateComponent } from './salary-update.component';

describe('Component Tests', () => {
  describe('Salary Management Update Component', () => {
    let comp: SalaryUpdateComponent;
    let fixture: ComponentFixture<SalaryUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let salaryService: SalaryService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [SalaryUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(SalaryUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(SalaryUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      salaryService = TestBed.inject(SalaryService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const salary: ISalary = { id: 456 };

        activatedRoute.data = of({ salary });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(salary));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Salary>>();
        const salary = { id: 123 };
        jest.spyOn(salaryService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ salary });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: salary }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(salaryService.update).toHaveBeenCalledWith(salary);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Salary>>();
        const salary = new Salary();
        jest.spyOn(salaryService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ salary });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: salary }));
        saveSubject.complete();

        // THEN
        expect(salaryService.create).toHaveBeenCalledWith(salary);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Salary>>();
        const salary = { id: 123 };
        jest.spyOn(salaryService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ salary });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(salaryService.update).toHaveBeenCalledWith(salary);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
