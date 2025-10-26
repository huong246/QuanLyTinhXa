import { RouterModule, Routes } from '@angular/router';
import { ProvinceComponent } from './province.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    component: ProvinceComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProvinceRoutingModule { }
