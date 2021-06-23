import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ISalary, Salary } from '../salary.model';
import { SalaryService } from '../service/salary.service';

@Component({
  selector: 'jhi-salary-update',
  templateUrl: './salary-update.component.html',
})
export class SalaryUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    joblevel: [null, [Validators.required]],
    salary: [],
  });

  constructor(protected salaryService: SalaryService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ salary }) => {
      this.updateForm(salary);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const salary = this.createFromForm();
    if (salary.id !== undefined) {
      this.subscribeToSaveResponse(this.salaryService.update(salary));
    } else {
      this.subscribeToSaveResponse(this.salaryService.create(salary));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISalary>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(salary: ISalary): void {
    this.editForm.patchValue({
      id: salary.id,
      joblevel: salary.joblevel,
      salary: salary.salary,
    });
  }

  protected createFromForm(): ISalary {
    return {
      ...new Salary(),
      id: this.editForm.get(['id'])!.value,
      joblevel: this.editForm.get(['joblevel'])!.value,
      salary: this.editForm.get(['salary'])!.value,
    };
  }
}
