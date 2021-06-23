import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { SalaryService } from '../service/salary.service';

import { SalaryComponent } from './salary.component';

describe('Component Tests', () => {
  describe('Salary Management Component', () => {
    let comp: SalaryComponent;
    let fixture: ComponentFixture<SalaryComponent>;
    let service: SalaryService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [SalaryComponent],
      })
        .overrideTemplate(SalaryComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(SalaryComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(SalaryService);

      const headers = new HttpHeaders().append('link', 'link;link');
      jest.spyOn(service, 'query').mockReturnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.salaries?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
