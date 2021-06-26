import { IDepartment } from 'app/entities/department/department.model';
import { IJob } from 'app/entities/job/job.model';
import { ISalary } from 'app/entities/salary/salary.model';

export interface IEmployee {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string | null;
  imageUrl?: string | null;
  manager?: IEmployee | null;
  department?: IDepartment | null;
  job?: IJob | null;
  joblevel?: ISalary | null;
}

export class Employee implements IEmployee {
  constructor(
    public id?: number,
    public firstName?: string,
    public lastName?: string,
    public email?: string,
    public phoneNumber?: string | null,
    public imageUrl?: string | null,
    public manager?: IEmployee | null,
    public department?: IDepartment | null,
    public job?: IJob | null,
    public joblevel?: ISalary | null
  ) {}
}

export function getEmployeeIdentifier(employee: IEmployee): number | undefined {
  return employee.id;
}
