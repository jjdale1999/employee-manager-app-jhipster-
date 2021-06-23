import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'department',
        data: { pageTitle: 'employeeManagerfinalApp.department.home.title' },
        loadChildren: () => import('./department/department.module').then(m => m.DepartmentModule),
      },
      {
        path: 'employee',
        data: { pageTitle: 'employeeManagerfinalApp.employee.home.title' },
        loadChildren: () => import('./employee/employee.module').then(m => m.EmployeeModule),
      },
      {
        path: 'blog',
        data: { pageTitle: 'employeeManagerfinalApp.blog.home.title' },
        loadChildren: () => import('./blog/blog.module').then(m => m.BlogModule),
      },
      {
        path: 'post',
        data: { pageTitle: 'employeeManagerfinalApp.post.home.title' },
        loadChildren: () => import('./post/post.module').then(m => m.PostModule),
      },
      {
        path: 'tag',
        data: { pageTitle: 'employeeManagerfinalApp.tag.home.title' },
        loadChildren: () => import('./tag/tag.module').then(m => m.TagModule),
      },
      {
        path: 'job',
        data: { pageTitle: 'employeeManagerfinalApp.job.home.title' },
        loadChildren: () => import('./job/job.module').then(m => m.JobModule),
      },
      {
        path: 'salary',
        data: { pageTitle: 'employeeManagerfinalApp.salary.home.title' },
        loadChildren: () => import('./salary/salary.module').then(m => m.SalaryModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
