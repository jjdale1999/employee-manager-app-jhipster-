import { IEmployee } from 'app/entities/employee/employee.model';

export interface IJob {
  id?: number;
  jobTitle?: string;
  employees?: IEmployee[] | null;
}

export class Job implements IJob {
  constructor(public id?: number, public jobTitle?: string, public employees?: IEmployee[] | null) {}
}

export function getJobIdentifier(job: IJob): number | undefined {
  return job.id;
}
