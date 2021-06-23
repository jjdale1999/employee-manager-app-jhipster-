import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ISalary } from '../salary.model';
import { SalaryService } from '../service/salary.service';

@Component({
  templateUrl: './salary-delete-dialog.component.html',
})
export class SalaryDeleteDialogComponent {
  salary?: ISalary;

  constructor(protected salaryService: SalaryService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.salaryService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
