import { IEmployee } from 'app/entities/employee/employee.model';
import { JobLevel } from 'app/entities/enumerations/job-level.model';

export interface ISalary {
  id?: number;
  joblevel?: JobLevel;
  salary?: number | null;
  employees?: IEmployee[] | null;
}

export class Salary implements ISalary {
  constructor(public id?: number, public joblevel?: JobLevel, public salary?: number | null, public employees?: IEmployee[] | null) {}
}

export function getSalaryIdentifier(salary: ISalary): number | undefined {
  return salary.id;
}
