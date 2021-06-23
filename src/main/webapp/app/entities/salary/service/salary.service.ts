import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISalary, getSalaryIdentifier } from '../salary.model';

export type EntityResponseType = HttpResponse<ISalary>;
export type EntityArrayResponseType = HttpResponse<ISalary[]>;

@Injectable({ providedIn: 'root' })
export class SalaryService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/salaries');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(salary: ISalary): Observable<EntityResponseType> {
    return this.http.post<ISalary>(this.resourceUrl, salary, { observe: 'response' });
  }

  update(salary: ISalary): Observable<EntityResponseType> {
    return this.http.put<ISalary>(`${this.resourceUrl}/${getSalaryIdentifier(salary) as number}`, salary, { observe: 'response' });
  }

  partialUpdate(salary: ISalary): Observable<EntityResponseType> {
    return this.http.patch<ISalary>(`${this.resourceUrl}/${getSalaryIdentifier(salary) as number}`, salary, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ISalary>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISalary[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addSalaryToCollectionIfMissing(salaryCollection: ISalary[], ...salariesToCheck: (ISalary | null | undefined)[]): ISalary[] {
    const salaries: ISalary[] = salariesToCheck.filter(isPresent);
    if (salaries.length > 0) {
      const salaryCollectionIdentifiers = salaryCollection.map(salaryItem => getSalaryIdentifier(salaryItem)!);
      const salariesToAdd = salaries.filter(salaryItem => {
        const salaryIdentifier = getSalaryIdentifier(salaryItem);
        if (salaryIdentifier == null || salaryCollectionIdentifiers.includes(salaryIdentifier)) {
          return false;
        }
        salaryCollectionIdentifiers.push(salaryIdentifier);
        return true;
      });
      return [...salariesToAdd, ...salaryCollection];
    }
    return salaryCollection;
  }
}
