import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

import { ProvinceComponent } from './province.component';
import { CreateOrUpdateProvinceComponent } from './create-or-update/create-or-update.component';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { ProvinceRoutingModule } from './province-routing.module';

@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    SharedModule,
    NzTagModule,
    NzToolTipModule,
    ProvinceComponent,
    CreateOrUpdateProvinceComponent,
    NzInputModule,
    NzFormModule,
    NzGridModule,
    NzButtonModule,
    NzTableModule,
    ProvinceComponent,
    ProvinceRoutingModule,
  ]
})
export class ProvinceModule {}
