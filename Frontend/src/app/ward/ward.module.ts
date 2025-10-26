import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { ProvinceComponent } from '../province/province.component';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { CreateOrUpdateWardComponent } from './create-or-update/create-or-update.component';
import { WardComponent } from './ward.component';
import { WardRoutingModule } from './ward-routing.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedModule,
    NzTagModule,
    NzToolTipModule,
    ProvinceComponent,
    CreateOrUpdateWardComponent,
    NzInputModule,
    NzFormModule,
    NzGridModule,
    NzButtonModule,
    NzTableModule,
    WardComponent,
    WardRoutingModule,
  ]
  })
export class WardModule {}
