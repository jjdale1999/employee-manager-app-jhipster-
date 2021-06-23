import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ISalary } from '../salary.model';
import { SalaryService } from '../service/salary.service';
import { SalaryDeleteDialogComponent } from '../delete/salary-delete-dialog.component';

@Component({
  selector: 'jhi-salary',
  templateUrl: './salary.component.html',
})
export class SalaryComponent implements OnInit {
  salaries?: ISalary[];
  isLoading = false;

  constructor(protected salaryService: SalaryService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.salaryService.query().subscribe(
      (res: HttpResponse<ISalary[]>) => {
        this.isLoading = false;
        this.salaries = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ISalary): number {
    return item.id!;
  }

  delete(salary: ISalary): void {
    const modalRef = this.modalService.open(SalaryDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.salary = salary;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
